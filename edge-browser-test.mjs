import { mkdirSync, writeFileSync } from 'node:fs';

const endpoint = process.argv[2] || 'http://127.0.0.1:9334';
const screenshotDir = process.argv[3] || '';
const base = (process.argv[4] || 'http://127.0.0.1:8765').replace(/\/$/, '');
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

let nextId = 0;
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
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const response = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
  return response.result.value;
}

async function click(selector) {
  const found = await evaluate(`(() => { const element = document.querySelector(${JSON.stringify(selector)}); if (!element) return false; element.click(); return true; })()`);
  if (!found) throw new Error(`Missing element: ${selector}`);
  await wait(100);
}

async function search(value) {
  await evaluate(`(() => { const input = document.querySelector('#browserQuery'); input.value = ${JSON.stringify(value)}; document.querySelector('#browserSearchForm').requestSubmit(); })()`);
  await wait(180);
}

async function capture(name) {
  if (!screenshotDir) return;
  mkdirSync(screenshotDir, { recursive: true });
  const shot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync(`${screenshotDir}/${name}.png`, Buffer.from(shot.data, 'base64'));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await command('Runtime.enable');
await command('Page.enable');
await command('Network.setCacheDisabled', { cacheDisabled: true });
await command('Emulation.setDeviceMetricsOverride', { width: 393, height: 852, deviceScaleFactor: 1, mobile: true });
await command('Page.navigate', { url: `${base}/phone-prototype.html?preview=browser&edge-test=${Date.now()}` });
await wait(600);

assert(await evaluate("getComputedStyle(document.querySelector('.app-header')).display === 'none'"), 'Generic app header is still visible in Edge');
assert(await evaluate("document.querySelector('.edge-browser-shell') && document.querySelector('.edge-address-form') && document.querySelector('.edge-browser-toolbar')"), 'Edge browser shell is incomplete');
assert(await evaluate("document.querySelectorAll('.edge-shortcut').length === 5"), 'Edge new-tab shortcuts are missing');
await capture('edge-mobile-new-tab');

await search('Professor C. W. Chan');
assert(await evaluate("document.querySelectorAll('.browser-card').length >= 2"), 'Search results did not render');
assert(await evaluate("getComputedStyle(document.querySelector('.browser-card')).borderRadius === '0px'"), 'Search results still use dashboard cards');
await capture('edge-mobile-search-results');

await click('[data-action="open-browser-page"][data-page="staff-directory"]');
assert(await evaluate("JSON.parse(localStorage.getItem('polyu_simulator_phone_v1')).browserPage === 'staff-directory'"), 'Search result did not open inside Edge');
assert(await evaluate("document.querySelector('#browserQuery').value.includes('polyu.edu.hk')"), 'Address bar did not show the opened site');
await capture('edge-mobile-web-page');

await click('[data-action="browser-back"]');
assert(await evaluate("JSON.parse(localStorage.getItem('polyu_simulator_phone_v1')).browserPage === 'home'"), 'Edge back button did not return to the new tab');
await search('parcel-update.example/pay');
assert(await evaluate("(() => { const saved = JSON.parse(localStorage.getItem('polyu_simulator_phone_v1')); return saved.browserPage === 'fake-post' && saved.browserUrl.startsWith('https://parcel-update.example'); })()"), 'Direct domain navigation did not stay inside the simulator');
await click('[data-action="browser-home"]');
await search('https://unknown-campus.example/info?id=42');
assert(await evaluate("(() => { const saved = JSON.parse(localStorage.getItem('polyu_simulator_phone_v1')); return saved.browserPage === 'generic-url' && saved.browserUrl === 'https://unknown-campus.example/info?id=42'; })()"), 'Unknown valid URL did not open the generic simulated page');

await click('[data-action="browser-tabs"]');
assert(await evaluate("document.querySelector('.dialog-sheet')?.textContent.includes('1 个模拟标签页')"), 'Tabs control did not open');
await click('[data-action="close-overlay"]');

console.log(JSON.stringify({ result: 'PASS', checks: ['Edge shell', 'new tab', 'search results', 'address display', 'back', 'known URL', 'generic URL', 'tabs'] }));
socket.close();
