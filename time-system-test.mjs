const endpoint = process.argv[2] || 'http://127.0.0.1:9334';
const base = (process.argv[3] || 'http://127.0.0.1:8765').replace(/\/$/, '');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let target;
for (let attempt = 0; attempt < 30; attempt += 1) {
  try {
    const targets = await fetch(`${endpoint}/json/list`).then((response) => response.json());
    target = targets.find((item) => item.type === 'page' && item.url.includes('phone-prototype.html'));
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
  commandId += 1;
  socket.send(JSON.stringify({ id: commandId, method, params }));
  return new Promise((resolve, reject) => pending.set(commandId, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function click(selector) {
  const clicked = await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return false; el.click(); return true; })()`);
  if (!clicked) throw new Error(`Missing clickable element: ${selector}`);
  await wait(120);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await command('Page.enable');
await command('Runtime.enable');
await command('Page.navigate', { url: `${base}/phone-prototype.html?preview=home&simTime=08:30&time-test=${Date.now()}` });
await wait(450);

assert(await evaluate('document.querySelector("#statusTime").textContent === "08:30"'), 'Clock did not start at 08:30');
await click('#appDock [data-open-app="phone"]');
assert(await evaluate('Boolean(document.querySelector("[data-id=call-unknown]"))'), '08:28 missed call was not available at the start');
assert(await evaluate('!document.querySelector("[data-id=call-government]")'), '09:06 missed call appeared too early');

await click('#systemHome');
await click('#appDock [data-open-app="messages"]');
assert(await evaluate('Boolean(document.querySelector("[data-id=thread-class]"))'), 'Previous class thread should be available at the start');
assert(await evaluate('!document.querySelector("[data-id=thread-parcel]")'), '08:35 parcel message appeared too early');
assert(await evaluate('!document.querySelector("[data-id=thread-donation]")'), '09:39 donation message appeared too early');

await click('#systemHome');
await click('#appGrid [data-open-app="mail"]');
assert(await evaluate('!document.querySelector("[data-id=mail-parcel]")'), '08:32 parcel mail appeared too early');
assert(await evaluate('!document.querySelector("[data-id=mail-research]")'), '08:41 research mail appeared too early');

await click('#systemHome');
await wait(5600);
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).time >= 511'), 'Clock did not advance while the simulator was open');

await command('Page.addScriptToEvaluateOnNewDocument', { source: `(() => {
  const state = JSON.parse(localStorage.getItem('polyu_simulator_phone_v1'));
  if (!state) return;
  state.time = 510;
  state.clockRemainderMs = 0;
  state.clockLastRealMs = Date.now() - 26000;
  state.unlocked = true;
  state.openingBriefSeen = true;
  localStorage.setItem('polyu_simulator_phone_v1', JSON.stringify(state));
})()` });
await command('Page.navigate', { url: `${base}/phone-prototype.html?time-resume=${Date.now()}` });
await wait(500);

const resumedTime = await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).time');
assert(resumedTime >= 515 && resumedTime <= 516, `Elapsed time resume produced ${resumedTime}, expected 08:35–08:36`);
assert(await evaluate('Boolean(document.querySelector("#lockNotifications [data-notification=n-sms]"))'), '08:35 SMS notification did not arrive after elapsed time');
assert(await evaluate('!document.querySelector("#lockNotifications [data-notification=n-government-call]")'), '09:06 call notification arrived too early');

await click('#appGrid [data-open-app="mail"]');
assert(await evaluate('Boolean(document.querySelector("[data-id=mail-parcel]"))'), '08:32 parcel mail did not arrive');
assert(await evaluate('!document.querySelector("[data-id=mail-research]")'), '08:41 research mail arrived too early after resume');
await click('#systemHome');
await click('#appDock [data-open-app="messages"]');
assert(await evaluate('Boolean(document.querySelector("[data-id=thread-parcel]"))'), '08:35 parcel message did not arrive');

socket.close();
console.log(JSON.stringify({ result: 'PASS', start: '08:30', resumed: resumedTime, checks: ['continuous clock', 'elapsed-time resume', 'scheduled mail', 'scheduled SMS', 'scheduled missed calls'] }));
