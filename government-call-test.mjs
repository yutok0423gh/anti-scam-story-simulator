const endpoint = process.argv[2] || 'http://127.0.0.1:9336';
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
  const found = await evaluate(`(() => { const node = document.querySelector(${JSON.stringify(selector)}); if (!node) return false; node.click(); return true; })()`);
  if (!found) throw new Error(`Missing element: ${selector}`);
  await wait(100);
}

async function reply(text) {
  await evaluate(`(() => { const input = document.querySelector('#callReplyInput'); if (!input) return false; input.value = ${JSON.stringify(text)}; document.querySelector('#callReplyForm').requestSubmit(); return true; })()`);
  await wait(180);
}

function assert(value, message) {
  if (!value) throw new Error(message);
}

await command('Runtime.enable');
await command('Page.enable');
await command('Emulation.setDeviceMetricsOverride', { width: 393, height: 852, deviceScaleFactor: 1, mobile: true });

async function reset() {
  await command('Page.navigate', { url: `${base}/phone-prototype.html?preview=home&simTime=10:00&government-test=${Date.now()}` });
  await wait(450);
  await evaluate('localStorage.removeItem("polyu_simulator_phone_v1")');
  await command('Page.reload');
  await wait(450);
}

await reset();
await click('#appDock [data-open-app="phone"]');
assert(await evaluate('Boolean(document.querySelector("[data-action=call-number][data-id=call-government]"))'), 'Government missed call is missing');
await click('[data-action="call-number"][data-id="call-government"]');
await wait(1650);
assert(await evaluate('document.querySelector(".call-conversation-head strong").textContent === "未知号码"'), 'Callback exposed a caller identity');
assert(await evaluate('document.querySelector(".call-transcript").textContent.includes("入境文件")'), 'Government call did not connect');

await reply('是什么文件？');
assert(await evaluate('document.querySelector(".call-transcript").textContent.includes("IM-26-0814-73")'), 'Case number was not supplied');
await reply('我的学号是24081234');
assert(await evaluate('document.querySelector(".call-transcript").textContent.includes("1234")'), 'Shared student ID tail was not reused');
await reply('证件尾号7788');
await reply('我在汇丰，大概有6000');
assert(await evaluate('document.querySelector(".call-transcript").textContent.includes("HK$6000")'), 'Shared balance was not reused');
await reply('汇丰户口尾号9911');
assert(await evaluate('document.querySelector(".call-transcript").textContent.includes("HK$5,000")'), 'Deposit request did not appear');
await reply('我可以转账');
assert(await evaluate('document.querySelector(".dialog-sheet").textContent.includes("S T CONSULTING")'), 'FPS transfer sheet did not open');
await click('[data-action="government-confirm-transfer"]');

let state = await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1"))');
assert(state.moneyLost === 5000, 'Government call loss was not recorded');
assert(state.privacyExposure >= 6, 'Government call disclosures were not recorded');
assert(state.taskState.government.steps.depositPaid, 'Government deposit state was not recorded');

await reset();
await click('#appDock [data-open-app="phone"]');
await click('[data-action="call-number"][data-id="call-government"]');
await wait(1650);
await reply('是什么文件？');
await reply('我的学号是24081234');
await reply('证件尾号7788');
await reply('我大概有6000');
await reply('汇丰户口尾号9911');
await reply('可以准备金粒在大堂交收吗？');
assert(await evaluate('document.querySelector(".call-transcript").textContent.includes("深色外套")'), 'Physical handoff instructions did not appear');
await reply('我会把现金交给楼下同事');
assert(await evaluate('document.querySelector(".dialog-sheet").textContent.includes("IM-26-0814-73")'), 'Valuables handoff sheet did not open');
await click('[data-action="government-confirm-valuables"]');
state = await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1"))');
assert(state.moneyLost === 0, 'Physical handoff was incorrectly counted as bank loss');
assert(state.consequences.cashOrValuablesLost === 5000, 'Cash or valuables loss was not recorded');

await reset();
await click('#appGrid [data-open-app="browser"]');
await evaluate(`(() => { const input = document.querySelector('#browserQuery'); input.value = '入境事务处电话'; document.querySelector('#browserSearchForm').requestSubmit(); })()`);
await wait(120);
await click('[data-action="open-browser-page"][data-page="government-directory"]');
await click('[data-action="government-contact-official"]');
await wait(1650);
assert(await evaluate('document.querySelector(".call-conversation-head strong").textContent === "未知号码"'), 'Official callback used a different caller label');
await reply('我想查一个案件');
await reply('案件编号IM-26-0814-73，职员IMD-417');
assert(await evaluate('document.querySelector(".call-transcript").textContent.includes("冇IM-26-0814-73")'), 'Independent enquiry did not return a case result');
state = await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1"))');
assert(state.taskState.government.steps.resolved, 'Independent enquiry was not recorded');

await evaluate(`(() => {
  const saved = JSON.parse(localStorage.getItem('polyu_simulator_phone_v1'));
  saved.version = 12;
  delete saved.taskState.government;
  saved.callLog = saved.callLog.filter((item) => item.id !== 'call-government');
  saved.notifications = saved.notifications.filter((item) => item.id !== 'n-government-call');
  localStorage.setItem('polyu_simulator_phone_v1', JSON.stringify(saved));
})()`);
await command('Page.navigate', { url: `${base}/phone-prototype.html?government-migration=${Date.now()}` });
await wait(450);
await click('#appDock [data-open-app="phone"]');
state = await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1"))');
assert(state.version === 14, 'Version 12 state did not migrate to 14');
assert(Boolean(state.taskState.government), 'Government state was not added during migration');
assert(state.callLog.some((item) => item.id === 'call-government'), 'Government missed call was not added during migration');
assert(state.notifications.some((item) => item.id === 'n-government-call'), 'Government notification was not added during migration');

socket.close();
console.log('Government call regression passed');
