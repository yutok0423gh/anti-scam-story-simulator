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

async function submitCallText(text) {
  const submitted = await evaluate(`(() => {
    const input = document.querySelector('#callReplyInput');
    const form = document.querySelector('#callReplyForm');
    if (!input || !form) return false;
    input.value = ${JSON.stringify(text)};
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    return true;
  })()`);
  if (!submitted) throw new Error('Call reply form was not available');
  await wait(220);
  return evaluate("document.querySelector('.call-turn.caller:last-child p')?.textContent || ''");
}

async function verifyContextualHallDialogue() {
  await setCallLanguage('yue');
  await click('#appDock [data-open-app="phone"]');
  await click('[data-action="call-number"][data-id="call-hall"]');
  await wait(1700);

  const clarification = await submitCallText('不知道');
  assert(clarification.includes('見到未接來電') && clarification.includes('宿舍收發室'), `Hall clarification ignored the callback context: ${clarification}`);
  assert(!clarification.includes('請講運單號最後四位'), `Hall clarification incorrectly advanced to tracking-number collection: ${clarification}`);

  const request = await submitCallText('我有个文件通知');
  assert(request.includes('運單號最後四位'), `Hall document request did not reach the reference question: ${request}`);

  const wrongTail = await submitCallText('1305');
  assert(wrongTail.includes('搵唔到對應記錄'), `Incorrect tail was accepted: ${wrongTail}`);
  assert(!await evaluate("JSON.parse(localStorage.getItem('polyu_simulator_phone_v1')).taskState.parcel.steps.hallConfirmed"), 'Incorrect tail confirmed the parcel');

  const numberQuestion = await submitCallText('完整运单号是什么？');
  assert(!numberQuestion.includes('查到喇'), `Question was treated as disclosure: ${numberQuestion}`);

  const numericAnswer = await submitCallText('7305');
  assert(numericAnswer.includes('尾號7305'), `Correct bare four-digit answer was not understood: ${numericAnswer}`);

  const challenge = await submitCallText('为什么要告诉你完整运单号');
  assert(challenge.includes('尾號只係用嚟縮窄收件記錄'), `Hall challenge did not receive a reasoned response: ${challenge}`);
  await evaluate(`(() => { window.__replayedCallVoice = []; speechSynthesis.cancel = () => {}; speechSynthesis.speak = (utterance) => window.__replayedCallVoice.push(utterance.text); })()`);
  await click('[data-action="call-replay-voice"]');
  assert(await evaluate("window.__replayedCallVoice.some((line) => line.includes('尾號只係用嚟縮窄收件記錄'))"), 'Replay used stale node audio rather than the latest contextual reply');

  const unknown = await submitCallText('这句话我没表达清楚 abcdef');
  assert(unknown.includes('先睇返收件通知'), `Unknown follow-up did not preserve the current parcel context: ${unknown}`);

  const wrongFull = await submitCallText('完整运单号是 RR 482 917 306 HK');
  assert(wrongFull.includes('搵唔到對應記錄'), `Incorrect full number was accepted: ${wrongFull}`);
  assert(!await evaluate("JSON.parse(localStorage.getItem('polyu_simulator_phone_v1')).taskState.parcel.steps.hallConfirmed"), 'Incorrect full number advanced the parcel task');

  const correctFull = await submitCallText('RR 482 917 305 HK');
  assert(correctFull.includes('查到喇'), `Correct full number was rejected: ${correctFull}`);
  assert(await evaluate("JSON.parse(localStorage.getItem('polyu_simulator_phone_v1')).taskState.parcel.steps.hallConfirmed"), 'Correct full number did not confirm the parcel');
  await click('[data-action="end-call"]');
}

async function verifyOfficialReferenceChecks() {
  await click('#systemHome');
  await click('#appDock [data-open-app="contacts"]');
  await click('[data-action="call-contact"][data-id="contact-department"]');
  await wait(1700);
  const wrongMail = await submitCallText('发件地址是 another.person@example.com');
  assert(wrongMail.includes('搵唔到對應邀請'), `Unrelated mail produced a confirmed result: ${wrongMail}`);
  const correctMail = await submitCallText('cw.chan.research@outlook.example');
  assert(correctMail.includes('Prof. Chan 冇發出'), `Matching mail did not produce the research finding: ${correctMail}`);
  await click('[data-action="end-call"]');

  await click('[data-action="call-contact"][data-id="contact-printshop"]');
  await wait(1700);
  const wrongOrder = await submitCallText('BP-9999');
  assert(wrongOrder.includes('搵唔到對應嘅印刷單'), `Unrelated order produced a confirmed result: ${wrongOrder}`);
  const correctOrder = await submitCallText('BP-8147');
  assert(correctOrder.includes('BP-8147'), `Matching order did not produce a specific result: ${correctOrder}`);
  await click('[data-action="end-call"]');
}

await command('Runtime.enable');
await command('Page.enable');
await command('Network.setCacheDisabled', { cacheDisabled: true });
await command('Page.navigate', { url: `${pageBase}/phone-prototype.html?preview=home&simTime=09:40&voice-test=setup` });
await wait(650);

await verifyCall('zh-CN', '真的不记得我', 'zh');
await verifyCall('en', 'really do not remember me', 'en');
await verifyContextualHallDialogue();
await verifyOfficialReferenceChecks();

console.log(JSON.stringify({ result: 'PASS', languages: ['zh-CN', 'en'], contextualDialogue: ['clarification', 'reference validation', 'question safety', 'replay', 'official mail and order checks'], cantoneseFallback: 'covered by phone-smoke-test.mjs' }));
socket.close();
