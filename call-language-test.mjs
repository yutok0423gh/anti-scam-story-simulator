const endpoint = process.argv[2] || 'http://127.0.0.1:9334';
const pageBase = (process.argv[3] || 'http://127.0.0.1:8765').replace(/\/$/, '');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let target;
for (let attempt = 0; attempt < 30; attempt += 1) {
  try {
    const targets = await fetch(`${endpoint}/json/list`).then((response) => response.json());
    target = targets.find((item) => item.type === 'page' && item.url.includes('127.0.0.1:8765'));
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
    if (!element) return false;
    element.click();
    return true;
  })()`);
  if (!found) throw new Error(`Missing element: ${selector}`);
  await wait(100);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function setCallLanguage(language) {
  await command('Page.navigate', { url: `${pageBase}/phone-prototype.html?preview=home&simTime=09:40&voice-test=${language}` });
  await wait(650);
  await click('#appGrid [data-open-app="settings"]');
  await click('[data-action="settings-page"][data-value="sound"]');
  await click('[data-action="settings-choice"][data-value="voice"]');
  await click(`[data-action="set-call-voice"][data-value="${language}"]`);
  await click('#systemHome');
}

async function verifyCall(language, textFragment, languagePrefix) {
  await setCallLanguage(language);
  await evaluate(`(() => {
    window.__callVoiceTest = [];
    const synthesis = window.speechSynthesis;
    if (!synthesis) return false;
    synthesis.cancel = () => {};
    synthesis.speak = (utterance) => window.__callVoiceTest.push({ text: utterance.text, lang: utterance.lang });
    return true;
  })()`);
  await click('#appDock [data-open-app="phone"]');
  await click('[data-action="call-number"][data-id="call-unknown"]');
  await wait(1700);
  const transcript = await evaluate("document.querySelector('.call-turn.caller:last-child p')?.textContent || ''");
  const savedLanguage = await evaluate("JSON.parse(localStorage.getItem('polyu_simulator_phone_v1')).callVoiceLanguage");
  assert(transcript.includes(textFragment), `${language} caller transcript did not use the selected language (saved=${savedLanguage}, text=${transcript})`);
  assert(await evaluate(`window.__callVoiceTest.some((item) => item.text.includes(${JSON.stringify(textFragment)}) && item.lang.toLowerCase().startsWith(${JSON.stringify(languagePrefix)}))`), `${language} speech synthesis did not receive the matching text and language`);
  await click('[data-action="end-call"]');
}

await command('Runtime.enable');
await command('Page.enable');
await command('Network.setCacheDisabled', { cacheDisabled: true });
await command('Page.navigate', { url: `${pageBase}/phone-prototype.html?preview=home&simTime=09:40&voice-test=setup` });
await wait(650);

await verifyCall('zh-CN', '真的不记得我', 'zh');
await verifyCall('en', 'really do not remember me', 'en');

console.log(JSON.stringify({ result: 'PASS', languages: ['zh-CN', 'en'], cantoneseFallback: 'covered by phone-smoke-test.mjs' }));
socket.close();
