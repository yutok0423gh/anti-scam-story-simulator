const endpoint = process.argv[2] || 'http://127.0.0.1:9340';
const base = (process.argv[3] || 'http://127.0.0.1:8765').replace(/\/$/, '');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const page = (await fetch(`${endpoint}/json/list`).then((response) => response.json())).find((item) => item.type === 'page');
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
  const callback = pending.get(message.id); pending.delete(message.id);
  if (message.error) callback.reject(new Error(message.error.message));
  else callback.resolve(message.result);
});
function command(method, params = {}) {
  const id = ++nextId; socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}
async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}
async function click(selector) {
  const found = await evaluate(`(() => { const n=document.querySelector(${JSON.stringify(selector)}); if(!n)return false;n.click();return true;})()`);
  if (!found) throw new Error(`Missing element: ${selector}`);
  await wait(120);
}
async function waitForSelector(selector, timeout = 3000) {
  const until = Date.now() + timeout;
  while (Date.now() < until) {
    if (await evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`).catch(() => false)) return;
    await wait(100);
  }
  throw new Error(`Timed out waiting for ${selector}`);
}
async function openApp(id) { await click(`[data-open-app="${id}"]`); }
async function openThread(id) { await openApp('messages'); await click(`[data-action="open-thread"][data-id="${id}"]`); }
async function search(query) {
  if (await evaluate('Boolean(document.querySelector("#systemHome:not(.is-hidden)"))')) await click('#systemHome');
  await openApp('browser');
  await evaluate(`(() => { const input=document.querySelector('#browserQuery'); input.value=${JSON.stringify(query)}; document.querySelector('#browserSearchForm').requestSubmit(); })()`);
  await wait(120);
}
async function reset() {
  await command('Page.navigate', { url: `${base}/phone-prototype.html?preview=home&expansion-test=${Date.now()}` });
  await wait(600);
  await evaluate('localStorage.clear()');
  await command('Page.reload', { ignoreCache: true });
  await waitForSelector('.app-button');
  await evaluate('document.querySelector(\'#soundToggle\').click(); document.querySelector(\'#soundToggle\').click()');
  await wait(120);
}
function assert(value, message) { if (!value) throw new Error(message); }
async function state() { return evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1"))'); }

await command('Page.enable');
await reset();
let saved = await state();
assert(saved.version === 14, 'Version 14 state missing');
assert(saved.consequences && saved.taskState.investment && saved.taskState.jobLoan, 'Expansion state missing');
assert(saved.messages.water && saved.messages.ticket && saved.messages.mpf && saved.messages.census && saved.messages.donation, 'Official-service events missing');
assert(saved.mails.some((mail) => mail.id === 'mail-market-payment'), 'Carousell payment email missing');

await evaluate(`(() => { const s=JSON.parse(localStorage.getItem('polyu_simulator_phone_v1')); s.version=13; delete s.consequences; delete s.taskState.investment; delete s.messages.water; localStorage.setItem('polyu_simulator_phone_v1',JSON.stringify(s)); })()`);
await command('Page.navigate', { url: `${base}/phone-prototype.html?expansion-migration=${Date.now()}` });
await waitForSelector('.app-button');
await evaluate('document.querySelector(\'#soundToggle\').click(); document.querySelector(\'#soundToggle\').click()');
await wait(120);
saved = await state();
assert(saved.version === 14 && saved.consequences && saved.taskState.investment && saved.messages.water, 'Version 13 migration failed');

await reset();
await search('Carousell calculator');
await click('[data-action="open-browser-page"][data-page="market-official"]');
await click('[data-action="market-save-check"]');
saved = await state();
assert(saved.moneyLost === 0 && saved.taskState.market.steps.officialOrderChecked, 'Carousell independent path failed');

await reset();
await search('HA Go eHealth');
await click('[data-action="open-browser-page"][data-page="health-official"]');
await click('[data-action="health-save-check"]');
saved = await state();
assert(saved.moneyLost === 0 && saved.taskState.health.steps.officialAppChecked, 'HA Go independent path failed');

await reset();
await search('AI Market Pro investment');
await click('[data-action="open-browser-page"][data-page="investment-official"]');
await click('[data-action="investment-save-check"]');
saved = await state();
assert(saved.moneyLost === 0 && saved.taskState.investment.steps.officialCheck, 'Investment independent path failed');

await reset();
await search('Apex recruitment loan');
await click('[data-action="open-browser-page"][data-page="jobloan-official"]');
await click('[data-action="jobloan-save-check"]');
saved = await state();
assert(saved.consequences.debt === 0 && saved.taskState.jobLoan.steps.officialCheck, 'Job-loan independent path failed');

await reset();
await search('water WSD');
await click('[data-action="open-browser-page"][data-page="government-services"]');
await click('[data-action="service-official-check"][data-service="water"]');
saved = await state();
assert(saved.moneyLost === 0 && saved.taskState.officialServices.steps.officialChecks.includes('water'), 'Official-service independent path failed');

await reset();
await openThread('thread-market');
await click('[data-action="market-open-protection"]');
await click('[data-action="market-submit-verification"]');
saved = await state();
assert(saved.moneyLost === 680 && saved.consequences.accountTakeovers === 1, 'Carousell protection loss not recorded');

await reset();
await openApp('bank');
await click('[data-action="market-release-item"]');
saved = await state();
assert(saved.moneyLost === 0 && saved.consequences.goodsLost === 680, 'Bounced-cheque goods loss not separated');

await reset();
await openThread('thread-health');
await click('[data-action="health-open-cancel"]');
await click('[data-action="health-submit-cancel"]');
saved = await state();
assert(saved.taskState.health.steps.cardShared && saved.moneyLost === 388, 'HA Go phishing path failed');

await reset();
await openThread('thread-investment');
await click('[data-action="investment-open-platform"]');
await click('[data-action="investment-deposit"]');
await click('[data-action="investment-withdraw"]');
await click('[data-action="investment-pay-unlock"]');
saved = await state();
assert(saved.moneyLost === 1400 && saved.taskState.investment.steps.unlockFeePaid, 'Investment escalation failed');

await reset();
await openThread('thread-job-loan');
await click('[data-action="jobloan-open-contract"]');
await click('[data-action="jobloan-take-loan"]');
await click('[data-action="jobloan-transfer"]');
saved = await state();
assert(saved.moneyLost === 3000 && saved.consequences.debt === 3000 && saved.consequences.muleRisk === 1, 'Job-loan debt path failed');

await reset();
await openThread('thread-water');
await click('[data-action="service-open-link"]');
await click('[data-action="service-submit-card"]');
saved = await state();
assert(saved.moneyLost === 86.4 && saved.taskState.officialServices.steps.cardShared, 'Water-service phishing path failed');

await reset();
await openThread('thread-census');
await click('[data-action="census-share-id"]');
saved = await state();
assert(saved.privacyExposure === 2 && saved.moneyLost === 0, 'Census privacy-only consequence failed');

await reset();
await openThread('thread-donation');
await click('[data-action="donation-call"]');
assert(await evaluate('document.querySelector(".call-dialling h2").textContent === "未知号码"'), 'Donation callback disclosed an identity before connection');
await waitForSelector('#callReplyForm', 3000);
assert(await evaluate('document.querySelector(".call-conversation-head strong").textContent === "未知号码"'), 'Donation call does not use the same unknown-number UI');
await evaluate(`(() => { const input=document.querySelector('#callReplyInput'); input.value='网银登录是student23，密码是Demo7788，OTP是482731'; document.querySelector('#callReplyForm').requestSubmit(); })()`);
saved = await state();
assert(saved.moneyLost === 580 && saved.consequences.accountTakeovers === 1, 'Donation callback path failed');

await reset();
await openThread('thread-campus-borrow');
await search('Professor C. W. Chan');
await click('[data-action="open-browser-page"][data-page="staff-directory"]');
await click('[data-action="research-contact-official"]');
await waitForSelector('#callReplyForm', 3000);
await evaluate(`(() => { const input=document.querySelector('#callReplyInput'); input.value='我想核实教授在WhatsApp叫我垫付HK$960给供应商FPS'; document.querySelector('#callReplyForm').requestSubmit(); })()`);
assert(await evaluate('document.querySelector(".call-turn.caller:last-child p").textContent.includes("冇叫學生用私人 FPS")'), 'Department call did not answer the borrowing request');
saved = await state();
assert(saved.taskState.campusBorrow.status === 'done' && saved.taskState.campusBorrow.steps.officialDirectoryChecked, 'Campus borrowing verification was not persisted');
await click('[data-action="end-call"]');

console.log('ADCC expansion regression passed');
await command('Runtime.evaluate', { expression: 'window.__adccExpansionTestPassed = true' });
socket.close();
