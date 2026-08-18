import { mkdirSync, writeFileSync } from 'node:fs';

const endpoint = process.argv[2] || 'http://127.0.0.1:9334';
const base = (process.argv[3] || 'http://127.0.0.1:8765').replace(/\/$/, '');
const screenshotDir = process.argv[4] || '';
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
if (!target) throw new Error('Browser test page was not found');

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
  const callbacks = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) callbacks.reject(new Error(message.error.message));
  else callbacks.resolve(message.result);
});

function command(method, params = {}) {
  const id = ++commandId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function click(selector) {
  const found = await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element || element.disabled) return false;
    element.click();
    return true;
  })()`);
  if (!found) throw new Error(`Missing enabled element: ${selector}`);
  await wait(100);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function capture(name) {
  if (!screenshotDir) return;
  mkdirSync(screenshotDir, { recursive: true });
  const shot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync(`${screenshotDir}/${name}.png`, Buffer.from(shot.data, 'base64'));
}

await command('Runtime.enable');
await command('Page.enable');
await command('Network.setCacheDisabled', { cacheDisabled: true });
await command('Emulation.setDeviceMetricsOverride', { width: 393, height: 852, deviceScaleFactor: 1, mobile: true });
await command('Page.navigate', { url: `${base}/phone-prototype.html?preview=home&simTime=09:40&profile-test=${Date.now()}` });
await wait(650);

await click('#appGrid [data-open-app="settings"]');
assert(await evaluate("Boolean(document.querySelector('.settings-profile-entry'))"), 'My Profile entry is missing from Settings');
await click('.settings-profile-entry');
assert(await evaluate("document.querySelector('.profile-ledger-card')?.textContent.includes('HK$3,000.00')"), 'Initial HK$3,000 balance is not shown');
assert(await evaluate("document.querySelector('.profile-ledger-card')?.textContent.includes('0 / 30')"), 'Initial growth target is not shown');
await capture('profile-initial');

await click('[data-action="profile-toggle-focus"][data-value="research"]');
await click('[data-action="profile-toggle-focus"][data-value="campus"]');
assert(await evaluate("JSON.parse(localStorage.getItem('polyu_simulator_phone_v1')).profile.focusAreas.join(',') === 'research,campus'"), 'Two focus areas were not saved');

await click('#systemHome');
await click('#appGrid [data-open-app="polyu"]');
await click('[data-action="research-open-detail"]');
await click('[data-action="research-book-official"]');
let state = await evaluate("JSON.parse(localStorage.getItem('polyu_simulator_phone_v1'))");
assert(state.taskState.officialResearch.steps.booked, 'Official research session was not booked');
assert(state.profile.growth === 0, 'Booking disclosed the outcome by awarding growth too early');
assert(state.balance === 3000, 'Booking changed the bank balance before attendance');
assert(!state.profile.focusLocked, 'Focus locked before the first settled outcome');
assert(state.notifications.some((item) => item.id === 'n-official-research-reminder' && item.time === '14:15'), 'Research check-in reminder was not scheduled');

const timeInjection = await command('Page.addScriptToEvaluateOnNewDocument', { source: `(() => {
  const savedState = JSON.parse(localStorage.getItem('polyu_simulator_phone_v1'));
  if (!savedState) return;
  savedState.time = 14 * 60 + 15;
  savedState.clockLastRealMs = Date.now();
  savedState.timeSpeed = 0;
  localStorage.setItem('polyu_simulator_phone_v1', JSON.stringify(savedState));
})()` });
await command('Page.navigate', { url: `${base}/phone-prototype.html?profile-test=attend-${Date.now()}` });
await wait(550);
await command('Page.removeScriptToEvaluateOnNewDocument', { identifier: timeInjection.identifier });
await click('#appGrid [data-open-app="polyu"]');
const checkInDebug = await evaluate(`(() => ({
  hasAction: Boolean(document.querySelector('[data-action=research-attend-official]')),
  content: document.querySelector('#appContent')?.textContent || '',
  state: JSON.parse(localStorage.getItem('polyu_simulator_phone_v1'))
}))()`);
assert(checkInDebug.hasAction, `Research check-in did not open at 14:15: ${JSON.stringify(checkInDebug)}`);
await click('[data-action="research-attend-official"]');
state = await evaluate("JSON.parse(localStorage.getItem('polyu_simulator_phone_v1'))");
assert(state.balance === 3250, `Research honorarium should produce HK$3,250, got ${state.balance}`);
assert(state.profile.growth === 23, `Research focus should award 23 growth, got ${state.profile.growth}`);
assert(state.profile.growthLedger.length === 1, 'Research growth was not recorded exactly once');
assert(state.profile.focusLocked, 'Focus did not lock after the first settled growth award');
assert(state.transactions.filter((item) => item.title === 'POLYU RESEARCH HONORARIUM').length === 1, 'Research honorarium was duplicated');

await click('[data-action="polyu-home"]');
await click('[data-action="event-open-detail"]');
await click('[data-action="event-register-official"]');
state = await evaluate("JSON.parse(localStorage.getItem('polyu_simulator_phone_v1'))");
assert(state.balance === 3190, `Official event should cost HK$60, got ${state.balance}`);
assert(state.profile.growth === 33, `Campus focus should add 10 growth, got ${state.profile.growth}`);
assert(state.profile.growthLedger.length === 2, 'Official event growth was not settled once');

await click('#systemHome');
await click('#appGrid [data-open-app="settings"]');
await click('.settings-profile-entry');
assert(await evaluate("document.querySelector('.profile-ledger-card')?.textContent.includes('33 / 30')"), 'Settled growth is not visible in My Profile');
assert(await evaluate("[...document.querySelectorAll('[data-action=profile-toggle-focus]')].every((item) => item.disabled)"), 'Focus controls remain editable after settlement');
await capture('profile-settled');

const migrationInjection = await command('Page.addScriptToEvaluateOnNewDocument', { source: `(() => {
  const migrated = JSON.parse(localStorage.getItem('polyu_simulator_phone_v1'));
  if (!migrated) return;
  migrated.version = 16;
  migrated.balance = 6123;
  delete migrated.profile;
  localStorage.setItem('polyu_simulator_phone_v1', JSON.stringify(migrated));
})()` });
await command('Page.navigate', { url: `${base}/phone-prototype.html?profile-test=migration-${Date.now()}` });
await wait(550);
await command('Page.removeScriptToEvaluateOnNewDocument', { identifier: migrationInjection.identifier });
state = await evaluate("JSON.parse(localStorage.getItem('polyu_simulator_phone_v1'))");
assert(state.version === 17, 'v16 save was not migrated to v17');
assert(state.profile && state.profile.growth === 0, 'Migrated profile defaults are missing');
assert(state.profile.startingBalance === 6123, 'Migration did not preserve the existing balance baseline');

console.log(JSON.stringify({
  result: 'PASS',
  initialBalance: 3000,
  researchGrowthWithFocus: 23,
  campusGrowthWithFocus: 10,
  finalGrowth: 33,
  migration: 'v16-to-v17'
}));
socket.close();
