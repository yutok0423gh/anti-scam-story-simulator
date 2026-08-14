import { mkdirSync, writeFileSync } from 'node:fs';

const endpoint = process.argv[2] || 'http://127.0.0.1:9335';
const base = (process.argv[3] || 'http://127.0.0.1:8765').replace(/\/$/, '');
const screenshotDir = process.argv[4] || '';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const page = (await fetch(`${endpoint}/json/list`).then((response) => response.json()))
  .find((item) => item.type === 'page');
if (!page) throw new Error('No browser page available');

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let nextId = 0;
const pending = new Map();
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const callback = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) callback.reject(new Error(message.error.message));
  else callback.resolve(message.result);
});

function command(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}

async function click(selector) {
  const result = await evaluate(`(() => { const node = document.querySelector(${JSON.stringify(selector)}); if (!node) return false; node.click(); return true; })()`);
  if (!result) throw new Error(`Missing element: ${selector}`);
  await wait(100);
}

async function capture(name) {
  if (!screenshotDir) return;
  mkdirSync(screenshotDir, { recursive: true });
  const shot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync(`${screenshotDir}/${name}.png`, Buffer.from(shot.data, 'base64'));
}

function assert(value, message) {
  if (!value) throw new Error(message);
}

await command('Runtime.enable');
await command('Page.enable');
await command('Emulation.setDeviceMetricsOverride', { width: 393, height: 852, deviceScaleFactor: 1, mobile: true });
await command('Page.navigate', { url: `${base}/phone-prototype.html?preview=home&adcc-test=${Date.now()}` });
await wait(500);
await evaluate('localStorage.removeItem("polyu_simulator_phone_v1")');
await command('Page.reload');
await wait(500);

await click('#appDock [data-open-app="messages"]');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).version === 14'), 'State version 14 missing');
assert(await evaluate('Boolean(JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).messages.health)'), 'Health decoy missing');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).mails.some(mail => mail.id === "mail-career")'), 'Career mail missing');

await evaluate(`(() => {
  const saved = JSON.parse(localStorage.getItem('polyu_simulator_phone_v1'));
  saved.version = 11;
  delete saved.taskState.career;
  delete saved.taskState.recovery;
  delete saved.messages.health;
  delete saved.messages.market;
  saved.mails = saved.mails.filter(mail => mail.id !== 'mail-career');
  localStorage.setItem('polyu_simulator_phone_v1', JSON.stringify(saved));
})()`);
await command('Page.reload');
await wait(450);
await click('#appDock [data-open-app="messages"]');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).version === 14'), 'Version 11 state did not migrate');
assert(await evaluate('Boolean(JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).taskState.career)'), 'Career state was not added during migration');
assert(await evaluate('Boolean(JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).messages.health)'), 'Health thread was not added during migration');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).mails.some(mail => mail.id === "mail-career")'), 'Career mail was not added during migration');
assert(await evaluate('Boolean(JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).messages.friend)'), 'Friend account thread was not added during migration');

await click('[data-action="open-thread"][data-id="thread-health"]');
await click('[data-action="health-open-cancel"]');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).browserPage === "health-cancel"'), 'Health cancellation page state did not open');
assert(await evaluate('document.body.textContent.includes("HK$388")'), 'Health cancellation page did not render');

await click('#systemHome');
await evaluate('window.__adccErrors=[]; window.addEventListener("error", event => window.__adccErrors.push(event.error?.stack || event.message))');
await click('#appGrid [data-open-app="mail"]');
await click('[data-action="open-mail"][data-id="mail-career"]');
await click('[data-action="career-open-workspace"]');
await click('[data-action="career-submit-profile"]');
await click('[data-action="career-pay-trial"]');
assert(await evaluate('document.body.textContent.includes("HK$2,400")'), 'Trust-building escalation did not appear');
await capture('career-escalation');
await click('[data-action="career-pay-large"]');

let state = await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1"))');
assert(state.moneyLost === 2400, 'Large task loss was not recorded');
assert(state.recoveryScamTriggered && state.messages.recovery, 'Post-loss recovery scam did not trigger');
assert(state.transactions.some((item) => item.amount === 146), 'Early real commission was not recorded');

await click('#systemHome');
await click('#appDock [data-open-app="messages"]');
await click('[data-action="open-thread"][data-id="thread-recovery"]');
await click('[data-action="recovery-open-portal"]');
await capture('recovery-intake');
await click('[data-action="recovery-accept-intake"]');
assert(await evaluate('Boolean(JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).messages.lawyer)'), 'Lawyer handoff did not arrive');
await click('[data-action="recovery-open-lawyer"]');
await click('[data-action="recovery-transfer-investigator"]');
assert(await evaluate('Boolean(JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).messages.investigator)'), 'Investigator handoff did not arrive');
await click('[data-action="recovery-open-investigator"]');
await capture('recovery-handoff');
await click('[data-action="recovery-grant-remote"]');
await click('[data-action="recovery-pay-guarantee"]');

state = await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1"))');
assert(state.moneyLost === 2700, 'Secondary recovery loss was not recorded');
assert(state.privacyExposure >= 3, 'Scenario data exposure was not recorded');

await click('#systemHome');
await click('#appDock [data-open-app="messages"]');
await click('[data-action="open-thread"][data-id="thread-friend"]');
await capture('friend-account-request');
assert(await evaluate('document.querySelector("[data-action=friend-call-original]") === null'), 'Friend thread still exposes the suggested verification action');
await click('#systemHome');
await click('#appDock [data-open-app="contacts"]');
await click('[data-action="call-contact"][data-id="contact-mandy"]');
state = await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1"))');
assert(state.taskState.friend.steps.originalNumberCalled, 'Independent call to the friend was not recorded');
assert(state.evidence.some((item) => item.id === 'friend-original-number'), 'Friend verification evidence was not recorded');
socket.close();
console.log('ADCC scenario regression passed');
