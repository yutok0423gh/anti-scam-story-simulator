const endpoint = process.argv[2] || 'http://127.0.0.1:9336';
const base = (process.argv[3] || 'http://127.0.0.1:8765').replace(/\/$/, '');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let target;
for (let attempt = 0; attempt < 30; attempt += 1) {
  try {
    const targets = await fetch(`${endpoint}/json/list`).then((response) => response.json());
    target = targets.find((item) => item.type === 'page');
    if (target) break;
  } catch {}
  await wait(200);
}
if (!target) throw new Error('Simulator tab was not found');

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let commandId = 0;
const pending = new Map();
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const request = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) request.reject(new Error(message.error.message));
  else request.resolve(message.result);
});

function command(method, params = {}) {
  const id = ++commandId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}

async function click(selector, pause = 100) {
  const clicked = await evaluate(`(() => { const node = document.querySelector(${JSON.stringify(selector)}); if (!node) return false; node.click(); return true; })()`);
  if (!clicked) throw new Error(`Missing clickable element: ${selector}`);
  await wait(pause);
}

async function navigate(time) {
  await evaluate('localStorage.clear()');
  await command('Page.navigate', { url: `${base}/phone-prototype.html?preview=home&simTime=${time}&new-events=${Date.now()}` });
  await wait(450);
}

function assert(value, message) {
  if (!value) throw new Error(message);
}

await command('Page.enable');
await command('Runtime.enable');
await command('Emulation.setDeviceMetricsOverride', { width: 393, height: 852, deviceScaleFactor: 1, mobile: true });

await command('Page.navigate', { url: `${base}/phone-prototype.html?preview=home&simTime=09:39&new-events=${Date.now()}` });
await wait(450);
await click('#appDock [data-open-app="messages"]');
assert(!await evaluate('Boolean(document.querySelector("[data-id=thread-rental]"))'), 'Rental message appeared before 09:40');
await click('#systemHome');
await click('#appDock [data-open-app="phone"]');
assert(!await evaluate('Boolean(document.querySelector("[data-id=call-deepfake]"))'), 'Video call appeared before 10:05');

await navigate('09:40');
await click('#appDock [data-open-app="messages"]');
assert(await evaluate('Boolean(document.querySelector("[data-id=thread-rental]"))'), 'Rental message was not available at 09:40');
await click('[data-id="thread-rental"]');
assert(await evaluate('document.querySelector("#appTitle").textContent.includes("陈先生")'), 'Rental thread did not open as an ordinary contact');
await click('[data-url*="hk-home-listing.example"]');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).browserPage === "rental-listing"'), 'Rental link did not route inside the simulated browser');
await click('[data-action="rental-share-id"]');
await click('[data-action="rental-pay-deposit"]');
const rentalLoss = await evaluate('(() => { const s=JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")); return { privacy:s.privacyExposure, lost:s.moneyLost, paid:s.taskState.rental.steps.depositPaid }; })()');
assert(rentalLoss.privacy === 2 && rentalLoss.lost === 5800 && rentalLoss.paid, 'Rental consequences were not recorded once');

await navigate('09:40');
await click('#appGrid [data-open-app="browser"]');
await evaluate(`(() => { const input=document.querySelector('#browserQuery'); input.value='landreg.gov.hk 黄埔 H52-814'; input.dispatchEvent(new Event('input',{bubbles:true})); document.querySelector('#browserSearchForm').requestSubmit(); })()`);
await wait(120);
await click('[data-page="rental-verification"]');
await click('[data-action="rental-save-check"]');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).taskState.rental.steps.officialCheck'), 'Independent rental check was not saved');

await navigate('10:05');
await click('#appDock [data-open-app="phone"]');
assert(await evaluate('Boolean(document.querySelector("[data-id=call-deepfake]"))'), 'Missed video call was not available at 10:05');
await click('[data-id="call-deepfake"]', 1700);
assert(await evaluate('Boolean(document.querySelector(".call-conversation.is-video-call .call-video-surface"))'), 'Video callback did not use the neutral video-call surface');
assert(await evaluate('document.querySelector(".call-conversation-head strong").textContent.includes("未知号码")'), 'Video callback exposed the claimed identity');
await evaluate(`(() => { const input=document.querySelector('#callReplyInput'); input.value='你是谁？你在哪里？'; document.querySelector('#callReplyForm').requestSubmit(); })()`);
await wait(150);
assert(await evaluate('document.querySelector("#callTranscript").textContent.includes("深圳")'), 'Free-form location question did not advance the video dialogue');
await click('[data-action="end-call"]');
await click('#systemHome');
await click('#appDock [data-open-app="contacts"]');
await click('[data-action="call-contact"][data-id="contact-father"]', 1700);
assert(await evaluate('document.querySelector(".call-conversation-head strong").textContent.includes("未知号码")'), 'Saved-contact call exposed identity on the call screen');
assert(await evaluate('document.querySelector("#callTranscript").textContent.includes("我而家喺屋企")'), 'Original-number verification dialogue did not connect');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).taskState.deepfake.steps.originalNumberCalled'), 'Original-number verification was not recorded');

socket.close();
console.log(JSON.stringify({ result: 'PASS', checks: ['scheduled rental message', 'simulated rental link', 'rental consequences', 'independent rental check', 'scheduled unknown video call', 'free-form video dialogue', 'saved-number verification'] }));
