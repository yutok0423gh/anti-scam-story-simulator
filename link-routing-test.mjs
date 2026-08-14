const endpoint = process.argv[2] || 'http://127.0.0.1:9335';
const base = (process.argv[3] || 'http://127.0.0.1:8765').replace(/\/$/, '');
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
  const clicked = await evaluate(`(() => {
    const node = document.querySelector(${JSON.stringify(selector)});
    if (!node) return false;
    node.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`Missing element: ${selector}`);
  await wait(80);
}

function assert(value, message) {
  if (!value) throw new Error(message);
}

async function state() {
  return evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1"))');
}

async function openMessageUrl(threadId, urlFragment, expectedPage, expectedService = '') {
  await click('#systemHome');
  await click('#appDock [data-open-app="messages"]');
  await click(`[data-action="open-thread"][data-id="${threadId}"]`);
  await click(`.bubble [data-action="open-simulated-url"][data-url*="${urlFragment}"]`);
  const saved = await state();
  assert(saved.currentApp === 'browser', `${urlFragment} did not open the simulated browser`);
  assert(saved.browserPage === expectedPage, `${urlFragment} routed to ${saved.browserPage}, expected ${expectedPage}`);
  if (expectedService) assert(saved.activeService === expectedService, `${urlFragment} selected the wrong service`);
  assert(await evaluate(`document.querySelector('.simulated-browser-address')?.textContent.includes(${JSON.stringify(urlFragment)})`), `${urlFragment} was not preserved in the browser address bar`);
}

async function openMailUrl(mailId, urlFragment, expectedPage) {
  await click('#systemHome');
  await click('#appGrid [data-open-app="mail"]');
  await click(`[data-action="open-mail"][data-id="${mailId}"]`);
  await click(`.outlook-message-body [data-action="open-simulated-url"][data-url*="${urlFragment}"]`);
  const saved = await state();
  assert(saved.currentApp === 'browser', `${urlFragment} mail link did not open the simulated browser`);
  assert(saved.browserPage === expectedPage, `${urlFragment} mail link routed to ${saved.browserPage}`);
  assert(await evaluate(`document.querySelector('.simulated-browser-address')?.textContent.includes(${JSON.stringify(urlFragment)})`), `${urlFragment} mail link was not preserved`);
}

await command('Runtime.enable');
await command('Page.enable');
await command('Emulation.setDeviceMetricsOverride', { width: 393, height: 852, deviceScaleFactor: 1, mobile: true });
await command('Page.navigate', { url: `${base}/phone-prototype.html?preview=home&link-test=${Date.now()}` });
await wait(450);

await openMessageUrl('thread-parcel', 'parcel-update.example', 'fake-post');
await openMessageUrl('thread-health', 'ha-go-account.example', 'health-cancel');
await openMessageUrl('thread-market', 'marketplace-protection.example', 'market-protection');
await openMessageUrl('thread-investment', 'meta-invest-pro.example', 'investment-platform');
await openMessageUrl('thread-job-loan', 'apex-recruit-contract.example', 'jobloan-contract');
await openMessageUrl('thread-water', 'wsd-ebill-check.example', 'service-fake', 'water');
await openMessageUrl('thread-ticket', 'gov-eticket-view.example', 'service-fake', 'ticket');
await openMessageUrl('thread-mpf', 'empf-profile-update.example', 'service-fake', 'mpf');

await openMailUrl('mail-research', 'research-onboarding.example', 'research-onboarding');
await openMailUrl('mail-career', 'northbridge-projects.example', 'career-workspace');
await openMailUrl('mail-market-payment', 'marketplace-protection.example', 'market-protection');

await click('#systemHome');
await evaluate(`(() => {
  const saved = JSON.parse(localStorage.getItem('polyu_simulator_phone_v1'));
  saved.messages.class.items.push({ from: 'them', time: '10:02', text: 'Details: https://unknown-campus.example/info?id=42' });
  localStorage.setItem('polyu_simulator_phone_v1', JSON.stringify(saved));
})()`);
await command('Page.navigate', { url: `${base}/phone-prototype.html?link-generic=${Date.now()}` });
await wait(450);
await click('#appDock [data-open-app="messages"]');
await click('[data-action="open-thread"][data-id="thread-class"]');
await click('.bubble [data-action="open-simulated-url"][data-url*="unknown-campus.example"]');
const generic = await state();
assert(generic.browserPage === 'generic-url', 'Unknown valid URL did not open the generic simulated page');
assert(generic.browserUrl === 'https://unknown-campus.example/info?id=42', 'Unknown URL was not preserved exactly');
assert(await evaluate('document.body.textContent.includes("unknown-campus.example") && document.body.textContent.includes("/info?id=42")'), 'Generic simulated page did not render the host and path');

socket.close();
console.log('Simulated link routing regression passed');
