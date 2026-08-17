import { mkdirSync, writeFileSync } from 'node:fs';

const endpoint = process.argv[2] || 'http://127.0.0.1:9334';
const screenshotDir = process.argv[3] || '';
const viewportWidth = Number(process.argv[4] || 1280);
const viewportHeight = Number(process.argv[5] || 1000);
const pageBase = (process.argv[6] || 'http://127.0.0.1:8765').replace(/\/$/, '');

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
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

function command(method, params = {}) {
  const id = ++commandId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, {
    resolve,
    reject: (error) => reject(new Error(`${method}: ${error.message}`))
  }));
}

async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function click(selector) {
  const clicked = await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return false; el.click(); return true; })()`);
  if (!clicked) throw new Error(`Missing clickable element: ${selector}`);
  await wait(80);
}

async function elementCenter(selector) {
  return evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);
}

async function touchStart(point) {
  await command('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: point.x, y: point.y, radiusX: 2, radiusY: 2, force: 1 }]
  });
}

async function touchMove(point) {
  await command('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: point.x, y: point.y, radiusX: 2, radiusY: 2, force: 1 }]
  });
}

async function touchEnd() {
  await command('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
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
await command('Emulation.setDeviceMetricsOverride', { width: viewportWidth, height: viewportHeight, deviceScaleFactor: 1, mobile: viewportWidth <= 500 });
await command('Page.navigate', { url: `${pageBase}/?preview=lock` });
await wait(350);
assert(await evaluate('document.querySelector("#unlockButton").textContent.includes("点按进入")'), 'Clickable lock-screen affordance did not render');
await capture('simulator-ios-lock');

let unlockPoint = await elementCenter('#unlockButton');
assert(unlockPoint, 'Unlock gesture target is missing');
await touchStart(unlockPoint);
for (let step = 1; step <= 5; step += 1) {
  await touchMove({ x: unlockPoint.x + 1, y: unlockPoint.y - step * 7 });
  await wait(70);
}
assert(await evaluate('parseFloat(document.querySelector("#phoneViewport").style.getPropertyValue("--unlock-shift")) < -20'), 'Lock screen did not follow the finger during a short swipe');
await capture('simulator-swipe-follow');
await touchEnd();
await wait(340);
assert(await evaluate('document.querySelector("#lockScreen").classList.contains("is-active")'), 'A short swipe incorrectly unlocked the phone');
assert(await evaluate('!document.querySelector("#phoneViewport").classList.contains("is-unlock-returning")'), 'Short swipe did not finish its elastic return');
await capture('simulator-swipe-return');

unlockPoint = await elementCenter('#unlockButton');
assert(unlockPoint, 'Unlock gesture target is missing');
await touchStart(unlockPoint);
await touchMove({ x: unlockPoint.x + 80, y: unlockPoint.y - 5 });
await wait(40);
await touchEnd();
await wait(320);
assert(await evaluate('document.querySelector("#lockScreen").classList.contains("is-active")'), 'A horizontal swipe incorrectly unlocked the phone');

unlockPoint = await elementCenter('#unlockButton');
await touchStart(unlockPoint);
await touchMove({ x: unlockPoint.x + 1, y: unlockPoint.y - 36 });
await wait(160);
await touchMove({ x: unlockPoint.x + 2, y: unlockPoint.y - 37 });
await wait(18);
await touchEnd();
await wait(320);
assert(await evaluate('document.querySelector("#lockScreen").classList.contains("is-active")'), 'A stale flick velocity incorrectly unlocked the phone');

unlockPoint = await elementCenter('#unlockButton');
await touchStart(unlockPoint);
await touchMove({ x: unlockPoint.x + 10, y: unlockPoint.y - 3 });
await wait(25);
for (let step = 1; step <= 6; step += 1) {
  await touchMove({ x: unlockPoint.x + 10 + step, y: unlockPoint.y - step * 24 });
  await wait(18);
}
await touchEnd();
await wait(650);
assert(await evaluate('document.querySelector(".opening-sheet").textContent.includes("院系与学生组织")'), 'Opening brief did not describe realistic campus senders');
assert(await evaluate('document.querySelector(".opening-sheet").textContent.includes("研究参与邀请")'), 'Opening brief did not mention research invitations naturally');
assert(await evaluate('document.querySelector(".opening-sheet").textContent.includes("没有唯一的操作顺序")'), 'Opening brief did not present inbox items as optional interactions');
await capture('simulator-opening-brief');
await click('[data-action="start-day"]');
await command('Page.navigate', { url: `${pageBase}/?preview=home&simTime=10:00` });
await wait(450);

assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).version === 14'), 'Scenario state was not migrated to version 14');
assert(await evaluate('["real", "fake", "grey"].includes(JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).contactVariant)'), 'The three-way caller variant was not initialised');
assert(await evaluate('document.querySelectorAll("#homeTodoList .home-todo-item").length === 2'), 'Desktop to-do widget did not keep optional inbox items out of the task list');
assert(await evaluate('!document.querySelector("#systemNavigation").classList.contains("is-hidden")'), 'System navigation buttons were not shown after unlocking');
assert(await evaluate('document.querySelector("#systemBack").disabled && !document.querySelector("#systemHome").disabled'), 'System navigation buttons did not expose an active Home button on the home screen');
assert(await evaluate('document.querySelector("#soundToggle").getAttribute("aria-pressed") === "true"'), 'Sound control is not enabled by default');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).notifications.some(item => item.id === "n-call")'), 'Missed-call notification is missing');
assert(await evaluate('fetch("assets/audio/calls/callback-intro.mp3").then(async response => response.ok && (await response.arrayBuffer()).byteLength > 1000)'), 'Local Cantonese call audio is unavailable');
await click('#soundToggle');
assert(await evaluate('document.querySelector("#soundToggle").getAttribute("aria-pressed") === "false"'), 'Sound control did not mute');
await click('#soundToggle');
assert(await evaluate('document.querySelector("#soundToggle").getAttribute("aria-pressed") === "true"'), 'Sound control did not unmute');
await wait(2800);
await capture('simulator-home-todo');

await click('#appDock [data-open-app="phone"]');
assert(await evaluate('Array.from(document.querySelectorAll(".phone-recents .list-copy strong")).every(el => el.textContent === "未知号码")'), 'Phone Recents exposed an automatic caller identity');
assert(await evaluate('!document.querySelector(".phone-recents").textContent.includes("Hall Reception")'), 'A saved contact label leaked into Phone Recents');
await click('[data-action="call-number"][data-id="call-hall"]');
assert(await evaluate('document.querySelector(".call-overlay").textContent.includes("正在接通") && document.querySelector(".call-overlay h2").textContent === "未知号码"'), 'Opening an official number from Recents did not match the anonymous scam-call screen');
assert(await evaluate('!document.querySelector(".call-overlay").textContent.includes("Hall Reception")'), 'Opening an official number from Recents exposed its saved identity');
await capture('simulator-official-call-dialing');
await click('[data-action="end-call"]');
await click('[data-action="phone-view"][data-value="keypad"]');
assert(await evaluate('document.querySelector("#dialForm") !== null && document.querySelectorAll(".dial-pad button").length === 12'), 'Free-form phone keypad did not render');
await capture('simulator-free-keypad');
await evaluate(`(() => { const input = document.querySelector('#dialNumber'); input.value = '5550123'; input.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('#dialForm').requestSubmit(); })()`);
await wait(80);
assert(await evaluate('document.querySelector(".dialog-sheet").textContent.includes("无法接通")'), 'An arbitrary dialled number did not produce a realistic failed-call result');
await click('[data-action="close-overlay"]');
await click('[data-action="phone-view"][data-value="recents"]');
assert(await evaluate('document.querySelector(".phone-recents").textContent.includes("5550123")'), 'Manual call was not added to Recents');
assert(await evaluate('document.querySelector(".phone-recents [data-number=\\"5550123\\"] .list-copy strong").textContent === "未知号码"'), 'Manual number was used as an automatic caller identity');
await click('#systemHome');

await click('#appDock [data-open-app="contacts"]');
await evaluate(`(() => { const input = document.querySelector('#contactsQuery'); input.value = 'Department'; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
assert(await evaluate('document.querySelectorAll("[data-action=call-contact]").length === 1 && document.querySelector("#appContent").textContent.includes("General Office")'), 'Contact search did not filter by organisation');
await capture('simulator-contact-search');
await evaluate(`(() => { const input = document.querySelector('#contactsQuery'); input.value = 'nobody-xyz'; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
assert(await evaluate('document.querySelector(".inline-empty") !== null'), 'Contact search did not show an empty result');
await evaluate(`(() => { const input = document.querySelector('#contactsQuery'); input.value = ''; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
await click('#systemHome');

await click('#appGrid [data-open-app="browser"]');
await evaluate(`(() => { const input = document.querySelector('#browserQuery'); input.value = 'coffee society'; document.querySelector('#browserSearchForm').requestSubmit(); })()`);
assert(await evaluate('document.querySelector(".search-empty") !== null && !document.querySelector("#browserResults").textContent.includes("包裹地址更新中心")'), 'Unrelated free search was incorrectly forced into the parcel storyline');
await capture('simulator-free-search-empty');
await evaluate(`(() => { const input = document.querySelector('#browserQuery'); input.value = '+852 6123 8704'; document.querySelector('#browserSearchForm').requestSubmit(); })()`);
assert(await evaluate('document.querySelector("#browserResults").textContent.includes("查无记录不代表身份真实")'), 'Number search did not return the contextual verification result');
await capture('simulator-free-number-search');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).investigationQueries.length >= 2'), 'Free investigation queries were not persisted');
await click('#systemHome');

await click('#appDock [data-open-app="messages"]');
await click('[data-action="open-thread"][data-id="thread-parcel"]');
assert(await evaluate('document.querySelector("#messageReplyForm textarea") !== null'), 'Free-form message composer did not render');
await evaluate(`(() => { const input = document.querySelector('#messageReplyInput'); input.value = '我会先联系香港邮政官方核实，不会付款。'; input.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('#messageReplyForm').requestSubmit(); })()`);
assert(await evaluate('Array.from(document.querySelectorAll(".bubble.mine")).some(el => el.textContent.includes("不会付款"))'), 'Free-form message was not added to the conversation');
assert(await evaluate('document.querySelector(".typing-bubble") !== null'), 'Message reply did not show a typing state');
await wait(800);
assert(await evaluate('Array.from(document.querySelectorAll(".bubble:not(.mine)")).some(el => el.textContent.includes("不要致电其他号码"))'), 'Suspicious sender did not react to a verification/refusal reply');
await capture('simulator-free-message-reply');
await click('#systemHome');

await click('#appGrid [data-open-app="mail"]');
await click('[data-action="open-mail"][data-id="mail-parcel"]');
await click('.outlook-reply-primary');
assert(await evaluate('document.querySelector("#mailReplyForm textarea") !== null'), 'Outlook inline reply composer did not render');
await evaluate(`(() => { const input = document.querySelector('#mailReplyInput'); input.value = 'Could you confirm whether I should pay the fee in the text message?'; input.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('#mailReplyForm').requestSubmit(); })()`);
assert(await evaluate('document.querySelector(".outlook-reply-item.mine").textContent.includes("pay the fee")'), 'Free-form mail reply was not preserved');
await wait(1000);
assert(await evaluate('Array.from(document.querySelectorAll(".outlook-reply-item:not(.mine)")).some(el => el.textContent.includes("do not collect redelivery fees"))'), 'Official mail sender did not answer the player’s question contextually');
await capture('simulator-free-mail-reply');
await click('#systemHome');

await click('#appGrid [data-open-app="settings"]');
assert(await evaluate('document.querySelector("#appTitle").textContent === "设置"'), 'Settings app did not open');
await click('[data-action="set-language"][data-value="en"]');
assert(await evaluate('document.querySelector("#appTitle").textContent === "Settings"'), 'English interface language did not apply');
assert(await evaluate('document.querySelector("#systemBackLabel").textContent === "Back" && document.querySelector("#systemHomeLabel").textContent === "Home"'), 'System navigation labels were not localized');
assert(await evaluate('!document.querySelector("#systemBack").disabled && !document.querySelector("#systemHome").disabled'), 'System navigation buttons were not enabled inside an app');
assert(await evaluate('document.querySelector("#appContent").textContent.includes("Country or Region")'), 'Settings controls were not localized');
await click('[data-action="set-region"][data-value="US"]');
assert(await evaluate('document.querySelector(".settings-preview").textContent.includes("Tuesday, August 11")'), 'US date format did not apply');
assert(await evaluate('document.querySelector(".settings-preview").textContent.includes("AM")'), 'US time format did not apply');
assert(await evaluate('document.documentElement.lang === "en"'), 'Document language did not update');
await capture('simulator-settings-english-us');
await click('#systemBack');
assert(await evaluate('document.querySelector("#homeScreen").classList.contains("is-active")'), 'System back did not return from an app root to the home screen');
await click('#appGrid [data-open-app="tasks"]');
assert(await evaluate('document.querySelector(".task-panel").textContent.includes("Collect exchange application documents")'), 'Dynamic task content did not switch to English');
await click('[data-action="end-day"]');
assert(await evaluate('document.querySelector(".review-overlay").textContent.includes("Required items")'), 'Dynamic day review did not switch to English');
assert(await evaluate('document.querySelector(".review-overlay").textContent.includes("Inbox decisions")'), 'Review outcomes did not switch to English');
await click('[data-action="close-review"]');
await click('#systemHome');
await click('#appDock [data-open-app="messages"]');
await click('[data-action="open-thread"][data-id="thread-parcel"]');
assert(await evaluate('document.querySelector(".bubble").textContent.includes("您的包裹地址资料不完整")'), 'Sender-authored message was incorrectly translated');
await click('#systemBack');
assert(await evaluate('document.querySelector(".conversation") === null && document.querySelector("[data-action=open-thread]") !== null'), 'System back did not return from the message thread to the inbox');
await click('#systemHome');
await click('#appGrid [data-open-app="mail"]');
await click('[data-action="open-mail"][data-id="mail-parcel"]');
assert(await evaluate('document.querySelector(".outlook-message-body").textContent.includes("registered document has arrived")'), 'Official PolyU mail was not shown in its English source language');
assert(await evaluate('document.querySelector("[data-action=mail-toggle-translation]") === null'), 'English source mail incorrectly offered translation under the English interface');
assert(await evaluate('document.querySelector(".outlook-sender-more") !== null'), 'Sender menu button is missing');
await click('.outlook-sender-more');
assert(await evaluate('document.querySelector(".outlook-mail-menu-sheet") !== null'), 'Outlook message action sheet did not open');
assert(await evaluate('document.querySelector(".outlook-translate-addin").disabled === true'), 'Same-language translation add-in should be disabled');
assert(await evaluate('document.querySelector(".phone-status").inert && document.querySelector("#appScreen").inert'), 'Message action sheet did not make the background inert');
assert(await evaluate('document.activeElement.dataset.action === "mail-mark-unread"'), 'Message action sheet did not focus its first action');
assert(await evaluate(`(() => {
  const sheet = document.querySelector('.outlook-mail-menu-sheet');
  const buttons = [...sheet.querySelectorAll('button:not(:disabled)')];
  const first = buttons[0];
  const last = buttons.at(-1);
  last.focus();
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
  const wrapsForward = document.activeElement === first;
  first.focus();
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
  return wrapsForward && document.activeElement === last;
})()`), 'Message action sheet did not trap keyboard focus');
await evaluate('document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))');
await wait(80);
assert(await evaluate('document.querySelector(".outlook-mail-menu-sheet") === null'), 'Escape did not close the message action sheet');
assert(await evaluate('document.activeElement.classList.contains("outlook-sender-more")'), 'Closing the message action sheet did not restore sender-menu focus');
assert(await evaluate('!document.querySelector(".phone-status").inert && !document.querySelector("#appScreen").inert'), 'Closing the message action sheet left the background inert');
await click('.outlook-sender-more');
await click('#systemBack');
assert(await evaluate('document.querySelector(".outlook-mail-menu-sheet") === null && document.querySelector("#appScreen").dataset.mailView === "detail"'), 'System back did not close the mail action sheet before leaving the message');
await click('#systemBack');
assert(await evaluate('document.querySelector("#appScreen").dataset.mailView === "inbox"'), 'System back did not return from the mail message to the inbox');
await click('#systemHome');
await click('#appGrid [data-open-app="settings"]');
await click('[data-action="set-region"][data-value="HK"]');
await click('[data-action="set-language"][data-value="zh-CN"]');
assert(await evaluate('document.querySelector("#appTitle").textContent === "设置"'), 'Chinese interface language did not restore');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).region === "HK"'), 'Region setting was not persisted');
await click('#systemHome');
await click('#appGrid [data-open-app="polyu"]');
assert(await evaluate('document.querySelector("#appContent").textContent.includes("Hi, Yutian")'), 'PolyULife home did not render');
await capture('simulator-polyulife-home');
await click('[data-action="polyu-calendar"]');
assert(await evaluate('document.querySelector(".polyu-month-card") !== null'), 'PolyULife month calendar did not render');
await capture('simulator-polyulife-month');
await click('[data-action="polyu-calendar-view"][data-view="list"]');
assert(await evaluate('document.querySelector(".polyu-event-list") !== null'), 'PolyULife event list did not render');
await click('[data-action="polyu-calendar-view"][data-view="week"]');
assert(await evaluate('document.querySelector(".timetable-grid") !== null'), 'PolyULife weekly timetable did not render');
await capture('simulator-polyulife-week');
await click('#systemHome');
await click('#appDock [data-open-app="bank"]');
assert(await evaluate('document.querySelector("#appContent").textContent.includes("可用余额")'), 'Bank app did not render');
await click('#systemHome');

const unreadBeforeInbox = await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).mails.filter(mail => mail.unread).length');
await click('#appGrid [data-open-app="mail"]');
assert(await evaluate('document.querySelector("#appTitle").textContent === "邮件"'), 'Mail app did not open');
assert(await evaluate('document.querySelector(".outlook-mail-shell") !== null'), 'Outlook-style inbox did not render');
assert(await evaluate('document.querySelectorAll(".outlook-tabs [role=tab]").length === 2'), 'Focused and Other tabs are missing');
assert((await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).mails.filter(mail => mail.unread).length')) === unreadBeforeInbox, 'Opening the inbox incorrectly marked messages as read');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).mails.filter(mail => mail.official).every(mail => mail.language === "en")'), 'An official campus email is not stored in English');
await capture('simulator-outlook-inbox');
await click('[data-action="mail-tab"][data-value="other"]');
await click('[data-action="open-mail"][data-id="mail-event"]');
assert(await evaluate('document.querySelector(".outlook-message-body").textContent.includes("orientation contacts")'), 'Student Affairs email was not shown in English');
assert(await evaluate('document.querySelector("[data-action=mail-toggle-translation]") === null'), 'Translation was exposed directly in the message');
await click('.outlook-sender-more');
assert(await evaluate('document.querySelector(".outlook-mail-menu-sheet").textContent.includes("翻译邮件")'), 'Student Affairs sender menu did not offer translation');
assert(await evaluate('document.activeElement.dataset.action === "mail-mark-unread"'), 'Message action sheet did not receive focus');
await capture('simulator-outlook-message-menu');
await click('[data-action="mail-toggle-translation"]');
assert(await evaluate('document.querySelector(".outlook-mail-menu-sheet") === null'), 'Message action sheet stayed open after translation');
assert(await evaluate('document.querySelector(".outlook-message-body").textContent.includes("去年迎新活动联系人")'), 'Student Affairs email did not translate into Chinese');
assert(await evaluate('document.activeElement.classList.contains("outlook-sender-more")'), 'Translation did not restore focus to the sender menu');
await click('[data-action="mail-inbox"]');
await click('[data-action="mail-tab"][data-value="focused"]');
await click('[data-action="open-mail"][data-id="mail-parcel"]');
assert(await evaluate('document.querySelector("#appContent").textContent.includes("RR 482 917 305 HK")'), 'Parcel email details are missing');
assert(await evaluate('document.querySelector(".outlook-message-body").textContent.includes("registered document has arrived")'), 'Hall Reception email source was not English');
assert(await evaluate('document.querySelector("[data-action=mail-toggle-translation]") === null'), 'Hall Reception translation was exposed outside the sender menu');
await click('.outlook-sender-more');
assert(await evaluate('document.querySelector("[data-action=mail-toggle-translation]").textContent.includes("翻译邮件")'), 'Hall Reception sender menu did not offer translation');
await click('[data-action="mail-toggle-translation"]');
assert(await evaluate('document.querySelector(".outlook-message-body").textContent.includes("挂号文件已经送到宿舍收发室")'), 'Hall Reception email did not translate into Chinese');
await click('[data-action="mail-save-tracking"]');

await click('#systemHome');
await click('#appDock [data-open-app="contacts"]');
await click('[data-action="call-contact"][data-id="contact-hall"]');
assert(await evaluate('document.querySelector(".call-overlay").textContent.includes("正在接通") && document.querySelector(".call-overlay h2").textContent === "未知号码"'), 'Official call did not use the same anonymous connecting screen');
assert(await evaluate('!document.querySelector(".call-overlay").textContent.includes("Hall Reception")'), 'Official call exposed its identity before connection');
await wait(1600);
assert(await evaluate('document.querySelector(".call-turn.caller:last-child p").textContent === "「喂，你好。請問你想查咩？」"'), 'Hall call greeting disclosed or implied an official identity');
assert(await evaluate('!document.querySelector(".call-overlay").textContent.includes("宿舍收發室")'), 'Hall call identified itself before the player asked');
await capture('simulator-official-call-greeting');
await evaluate(`(() => { const input = document.querySelector('#callReplyInput'); input.value = '请问这里是什么单位？'; document.querySelector('#callReplyForm').requestSubmit(); })()`);
assert(await evaluate('document.querySelector(".call-turn.caller:last-child p").textContent.includes("宿舍收發室")'), 'Hall identity claim was not available after the player asked');
assert(await evaluate('!JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).taskState.parcel.steps.hallConfirmed'), 'A caller identity claim incorrectly completed verification');
await evaluate(`(() => { const input = document.querySelector('#callReplyInput'); input.value = '我收到通知有份文件，想查一下'; document.querySelector('#callReplyForm').requestSubmit(); })()`);
await click('[data-action="call-minimize"]');
assert(await evaluate('!document.querySelector("#activeCallBar").hidden && document.querySelector("#activeCallBar").textContent.includes("未知号码")'), 'The live call did not minimise into a persistent status bar');
await click('#systemHome');
await click('#appGrid [data-open-app="mail"]');
assert(await evaluate('document.querySelector("#appScreen").dataset.app === "mail"'), 'The player could not independently open Mail during a minimised call');
await capture('simulator-live-call-research');
await click('#activeCallBar [data-action="call-resume"]');
assert(await evaluate('document.querySelector("#callReplyForm") !== null'), 'The minimised call did not resume with its composer');
await evaluate(`(() => { const input = document.querySelector('#callReplyInput'); input.value = '运单尾号是1305，送到学生宿舍'; document.querySelector('#callReplyForm').requestSubmit(); })()`);
await evaluate(`(() => { const input = document.querySelector('#callReplyInput'); input.value = '完整运单号是 RR 482 917 305 HK'; document.querySelector('#callReplyForm').requestSubmit(); })()`);
assert(await evaluate('document.querySelector(".call-turn.caller:last-child p").textContent.includes("08:14")'), 'Full tracking details did not reach the verified hall result');
await click('[data-action="end-call"]');
assert(await evaluate('document.querySelector(".call-overlay") === null'), 'Ending the call still leaves a forced assessment overlay');
await click('#systemHome');
await click('#appGrid [data-open-app="tasks"]');
assert((await evaluate('document.querySelectorAll(".task-panel:first-of-type .task-step.done").length')) >= 3, 'Parcel verification steps were not persisted');
await click('[data-action="collect-parcel"]');
assert(await evaluate('document.querySelector(".task-panel .task-status").textContent === "已完成"'), 'Parcel task did not complete');
await click('#systemHome');
assert(await evaluate('document.querySelector("#homeTodoList .home-todo-item:first-child").classList.contains("done")'), 'Completed parcel task was not checked on the desktop');

await click('#appDock [data-open-app="messages"]');
await click('[data-action="open-thread"][data-id="thread-parcel"]');
await click('[data-action="open-simulated-url"][data-url*="parcel-update.example"]');
await wait(180);
const parcelPageText = await evaluate('document.querySelector("#appContent").textContent');
const parcelPageState = await evaluate('window.ScamBusterPhone?.getState?.().browserPage || "unavailable"');
const parcelPageUrl = await evaluate('location.href');
const parcelScriptUrls = await evaluate('performance.getEntriesByType("resource").filter((entry) => entry.name.includes("phone-")).map((entry) => entry.name).join(", ")');
assert(parcelPageText.includes('parcel-update.example'), `Simulated parcel site did not open (url=${parcelPageUrl}; state=${parcelPageState}; scripts=${parcelScriptUrls}; text=${parcelPageText.slice(0, 160)})`);

await click('#systemHome');
await click('#appDock [data-open-app="phone"]');
assert(await evaluate('document.querySelector("[data-action=\\"call-number\\"][data-id=\\"call-unknown\\"] .list-copy span").textContent.includes("未接来电")'), 'Unknown number is not shown as a missed call');
await capture('simulator-missed-call');
await click('[data-action="call-number"][data-id="call-unknown"]');
assert(await evaluate('document.querySelector(".call-overlay").textContent.includes("正在接通")'), 'Callback dialing screen did not start');
await capture('simulator-callback-dialing');
await wait(1600);
assert(await evaluate('document.querySelector(".call-overlay").dataset.cantoneseAudio === "orientation-intro"'), 'Cantonese callback audio was not selected');
assert(await evaluate(`Promise.all([
  'hall-intro', 'hall-claim', 'hall-need-reference', 'hall-fee', 'hall-partial', 'hall-need-mail', 'hall-result', 'hall-cautious',
  'department-intro', 'department-claim', 'department-need-mail', 'department-channels', 'department-result', 'department-cautious',
  'orientation-intro', 'orientation-identity-real', 'orientation-identity-grey', 'orientation-identity-fake', 'orientation-guessed',
  'orientation-purpose-real', 'orientation-purpose-grey', 'orientation-purpose-fake', 'orientation-reference-real',
  'orientation-reference-grey', 'orientation-reference-fake', 'orientation-document-real', 'orientation-document-grey',
  'orientation-document-fake', 'orientation-cautious-fake', 'orientation-cautious-safe', 'orientation-fallback'
].map((id) => fetch('assets/audio/calls/' + id + '.mp3').then((response) => response.ok && response.headers.get('content-type')?.includes('audio')))).then((results) => results.every(Boolean))`), 'One or more fixed Cantonese call audio files are unavailable');
assert(await evaluate('document.querySelector(".call-turn.caller:last-child p").textContent.includes("真係唔記得我")'), 'Unknown caller Cantonese dialogue did not start');
assert(await evaluate('document.querySelector("[data-action=call-replay-voice]") !== null'), 'Caller voice replay control is missing');
await capture('simulator-callback-cantonese');
await evaluate(`(() => { const input = document.querySelector('#callReplyInput'); input.value = '阿杰？'; document.querySelector('#callReplyForm').requestSubmit(); })()`);
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).privacyExposure >= 1'), 'Guessing a caller name did not record information disclosure');
await click('[data-action="call-minimize"]');
await click('#systemHome');
await click('#appDock [data-open-app="contacts"]');
assert(await evaluate('document.querySelector("#appScreen").dataset.app === "contacts" && !document.querySelector("#activeCallBar").hidden'), 'Orientation call could not be minimised for contact research');
await click('#activeCallBar [data-action="end-call"]');
await capture('simulator-call-ended');
assert(await evaluate('document.querySelector(".call-judgement-sheet") === null'), 'Ending a minimised call opened an assessment screen');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).callRecords.some(item => item.scenario === "orientation")'), 'Ended call transcript was not archived');
await click('[data-action="call-contact"][data-id="contact-kaman"]');
await click('[data-action="close-overlay"]');

await click('#systemHome');
await click('#appDock [data-open-app="phone"]');
assert(await evaluate('document.querySelector(".call-assessment-list") === null'), 'Phone Recents still asks the player to label calls');
await click('#systemHome');
await click('#appGrid [data-open-app="mail"]');
await click('[data-action="open-mail"][data-id="mail-research"]');
assert(await evaluate('document.querySelector("#appContent").textContent.includes("outlook.example")'), 'Research invitation sender address is missing');
assert(await evaluate('document.querySelector("#appContent").textContent.includes("e-vouchers")'), 'Research invitation did not include the reimbursement hook');
await capture('simulator-research-invitation');
assert(await evaluate('document.querySelector("[data-action=mail-toggle-translation]") === null'), 'Research translation was exposed outside the sender menu');
await click('.outlook-sender-more');
assert(await evaluate('document.querySelector("[data-action=mail-toggle-translation]").textContent.includes("翻译邮件")'), 'Research sender menu did not offer Chinese translation');
await click('[data-action="mail-toggle-translation"]');
assert(await evaluate('document.querySelector(".outlook-message-body").textContent.includes("参与者奖励电子礼券")'), 'Mail translation did not display the Chinese body');
assert(await evaluate('document.querySelector(".outlook-sender-row").textContent.includes("outlook.example")'), 'Translation changed or hid the sender address');
assert(await evaluate('getComputedStyle(document.querySelector(".outlook-address")).whiteSpace !== "nowrap" && getComputedStyle(document.querySelector(".outlook-address")).textOverflow !== "ellipsis"'), 'Sender address is visually truncated');
assert(await evaluate('document.querySelector(".outlook-translation-status") !== null'), 'Translated status was not shown');
await capture('simulator-outlook-translation');
await click('.outlook-sender-more');
assert(await evaluate('document.querySelector("[data-action=mail-toggle-translation]").textContent.includes("查看原文")'), 'Sender menu did not offer the original text');
await click('[data-action="mail-toggle-translation"]');
assert(await evaluate('document.querySelector(".outlook-message-body").textContent.includes("e-vouchers")'), 'View original did not restore the source email');
assert(await evaluate('document.querySelector("[data-action=research-check-directory]") === null'), 'Research mail still exposes a suggested verification action');
await click('#systemHome');
await click('#appGrid [data-open-app="browser"]');
await evaluate(`(() => { const back = document.querySelector('#appBack'); if (!document.querySelector('#browserSearchForm') && back) back.click(); })()`);
await wait(100);
await evaluate(`(() => { const input = document.querySelector('#browserQuery'); input.value = 'Professor C. W. Chan'; document.querySelector('#browserSearchForm').requestSubmit(); })()`);
await click('[data-action="open-browser-page"][data-page="staff-directory"]');
assert(await evaluate('document.querySelector("#appContent").textContent.includes("cw.chan@staff.polyu.example")'), 'Simulated staff profile did not render');
assert(await evaluate('!document.querySelector("#appContent").textContent.includes("outlook.example")'), 'Staff directory still explicitly points out the suspicious sender mismatch');
await capture('simulator-research-directory');
await click('[data-action="research-contact-official"]');
assert(await evaluate('document.querySelector(".call-overlay").textContent.includes("正在接通") && document.querySelector(".call-overlay h2").textContent === "未知号码"'), 'Department call did not use the anonymous connecting screen');
await wait(1600);
assert(await evaluate('document.querySelector(".call-turn.caller:last-child p").textContent === "「喂，你好。請問你想搵邊位？」"'), 'Department greeting disclosed or implied an official identity');
assert(await evaluate('!document.querySelector(".call-overlay").textContent.includes("Department General Office")'), 'Department identified itself before the player asked');
await evaluate(`(() => { const input = document.querySelector('#callReplyInput'); input.value = '请问这里是什么办公室？'; document.querySelector('#callReplyForm').requestSubmit(); })()`);
assert(await evaluate('document.querySelector(".call-turn.caller:last-child p").textContent.includes("Department General Office")'), 'Department identity claim was not available after the player asked');
assert(await evaluate('!JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).taskState.research.steps.resolved'), 'A caller identity claim incorrectly resolved the research invitation');
await evaluate(`(() => { const input = document.querySelector('#callReplyInput'); input.value = '我想核实一封研究邀请'; document.querySelector('#callReplyForm').requestSubmit(); })()`);
await evaluate(`(() => { const input = document.querySelector('#callReplyInput'); input.value = '主题是Research Assistant，发件地址是outlook.example'; document.querySelector('#callReplyForm').requestSubmit(); })()`);
assert(await evaluate('document.querySelector(".call-turn.caller:last-child p").textContent.includes("冇發出呢封邀請")'), 'Department confirmation did not resolve the research invitation');
await click('[data-action="end-call"]');

await click('#systemHome');
await click('#appGrid [data-open-app="mail"]');
await click('[data-action="mail-tab"][data-value="other"]');
assert(await evaluate('document.querySelector(".outlook-tabs [data-value=other]").getAttribute("aria-selected") === "true"'), 'Other inbox did not activate');
await click('[data-action="open-mail"][data-id="mail-event-fee"]');
assert(await evaluate('document.querySelector("#appContent").textContent.includes("HK$180")'), 'External event payment amount is missing');
assert(await evaluate('document.querySelector("#appContent").textContent.includes("personal FPS")'), 'External event payment channel is missing');
await capture('simulator-event-payment-mail');
assert(await evaluate('document.querySelector("[data-action=event-open-polyu]") === null'), 'Event mail still exposes a suggested PolyULife verification action');
await click('#systemHome');
await click('#appGrid [data-open-app="polyu"]');
await click('[data-action="polyu-home"]');
await click('[data-action="event-open-detail"]');
assert(await evaluate('document.querySelector(".polyu-event-detail").textContent.includes("HK$60")'), 'Official PolyULife event fee did not render');
assert(await evaluate('!document.querySelector(".polyu-event-detail").textContent.includes("个人 FPS")'), 'PolyULife event detail still points out the suspicious payment channel');
await capture('simulator-polyulife-event-detail');
await click('[data-action="event-skip-official"]');
assert(await evaluate('document.querySelector(".polyu-event-detail").textContent.includes("决定暂时不参加")'), 'Optional event could not be declined');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).balance === 6840'), 'Declining an optional event changed the balance');

await click('#systemHome');
await click('#appGrid [data-open-app="tasks"]');
assert(await evaluate('document.querySelectorAll(".task-panel").length === 2'), 'Inbox decisions leaked into the required task list');
assert(await evaluate('Array.from(document.querySelectorAll(".task-status")).every(el => el.textContent === "已完成")'), 'Not all daily tasks completed');
await click('[data-action="end-day"]');
assert(await evaluate('document.querySelector(".review-overlay") !== null'), 'Day review did not open');
assert(await evaluate('document.querySelector(".review-overlay").textContent.includes("没有报名也不算任务失败")'), 'Review did not treat declining the event as a valid choice');

await click('[data-action="reset-day"]');
unlockPoint = await elementCenter('#unlockButton');
await touchStart(unlockPoint);
await touchEnd();
await wait(420);
assert(await evaluate('document.querySelector(".opening-sheet") !== null'), 'A real touch tap did not unlock the phone');
await click('[data-action="start-day"]');
await command('Page.navigate', { url: `${pageBase}/?preview=home&simTime=10:00&phase=loss` });
await wait(350);
await click('#appGrid [data-open-app="mail"]');
await click('[data-action="open-mail"][data-id="mail-research"]');
await click('[data-action="open-simulated-url"][data-url*="research-onboarding.example"]');
await click('[data-action="research-submit-simulated"]');
await click('[data-action="research-buy-vouchers"]');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).moneyLost === 800'), 'Research voucher payment was not recorded as a loss');
await click('#systemHome');
await click('#appGrid [data-open-app="mail"]');
await click('[data-action="mail-tab"][data-value="other"]');
await click('[data-action="open-mail"][data-id="mail-event-fee"]');
await click('[data-action="open-simulated-url"][data-url*="student-event-payment.example"]');
  await click('[data-action="event-pay-fake"]');
  assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).moneyLost === 980'), 'Fake event FPS payment was not recorded as a loss');
  assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).taskState.event.status === "pending"'), 'Fake event payment incorrectly completed official registration');
  assert(await evaluate('document.querySelector("[data-action=event-open-polyu], [data-action=open-bank-app]") === null'), 'Fake payment success page still suggests the verification path');

console.log(JSON.stringify({
  result: 'PASS',
  apps: ['phone', 'messages', 'mail', 'polyu', 'browser', 'contacts', 'bank', 'tasks', 'settings'],
  flow: 'tap or swipe unlock and elastic return, opening brief, desktop to-do, free-form SMS and mail replies, sound control, language and region settings, PolyULife views, parcel verification, unknown caller, professor impersonation, event fee cross-check, day review'
}));

socket.close();
