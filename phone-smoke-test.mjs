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
await command('Page.navigate', { url: `${pageBase}/phone-prototype.html?preview=lock` });
await wait(350);
assert(await evaluate('document.querySelector("#unlockButton").textContent.includes("向上轻扫")'), 'iOS-style lock-screen affordance did not render');
await capture('simulator-ios-lock');
await click('#unlockButton');
assert(await evaluate('document.querySelector(".opening-sheet").textContent.includes("院系与学生组织")'), 'Opening brief did not describe realistic campus senders');
assert(await evaluate('document.querySelector(".opening-sheet").textContent.includes("研究参与邀请")'), 'Opening brief did not mention research invitations naturally');
assert(await evaluate('document.querySelector(".opening-sheet").textContent.includes("看清来源和内容")'), 'Opening brief did not explain how to treat optional inbox items');
await capture('simulator-opening-brief');
await click('[data-action="start-day"]');
await command('Page.navigate', { url: `${pageBase}/phone-prototype.html?preview=home` });
await wait(450);

assert(await evaluate('document.querySelectorAll("#homeTodoList .home-todo-item").length === 2'), 'Desktop to-do widget did not keep optional inbox items out of the task list');
assert(await evaluate('document.querySelector("#soundToggle").getAttribute("aria-pressed") === "true"'), 'Sound control is not enabled by default');
assert(await evaluate('document.querySelector("#lockNotifications [data-notification=\\"n-call\\"]") !== null'), 'Missed-call notification is missing');
assert(await evaluate('fetch("assets/audio/calls/callback-intro.mp3").then(async response => response.ok && (await response.arrayBuffer()).byteLength > 1000)'), 'Local Cantonese call audio is unavailable');
await click('#soundToggle');
assert(await evaluate('document.querySelector("#soundToggle").getAttribute("aria-pressed") === "false"'), 'Sound control did not mute');
await click('#soundToggle');
assert(await evaluate('document.querySelector("#soundToggle").getAttribute("aria-pressed") === "true"'), 'Sound control did not unmute');
await wait(2800);
await capture('simulator-home-todo');
await click('#appGrid [data-open-app="settings"]');
assert(await evaluate('document.querySelector("#appTitle").textContent === "设置"'), 'Settings app did not open');
await click('[data-action="set-language"][data-value="en"]');
assert(await evaluate('document.querySelector("#appTitle").textContent === "Settings"'), 'English interface language did not apply');
assert(await evaluate('document.querySelector("#appContent").textContent.includes("Country or Region")'), 'Settings controls were not localized');
await click('[data-action="set-region"][data-value="US"]');
assert(await evaluate('document.querySelector(".settings-preview").textContent.includes("Tuesday, August 11")'), 'US date format did not apply');
assert(await evaluate('document.querySelector(".settings-preview").textContent.includes("AM")'), 'US time format did not apply');
assert(await evaluate('document.documentElement.lang === "en"'), 'Document language did not update');
await capture('simulator-settings-english-us');
await click('#appBack');
await click('#appGrid [data-open-app="tasks"]');
assert(await evaluate('document.querySelector(".task-panel").textContent.includes("Collect exchange application documents")'), 'Dynamic task content did not switch to English');
await click('[data-action="end-day"]');
assert(await evaluate('document.querySelector(".review-overlay").textContent.includes("Required items")'), 'Dynamic day review did not switch to English');
assert(await evaluate('document.querySelector(".review-overlay").textContent.includes("Inbox decisions")'), 'Review outcomes did not switch to English');
await click('[data-action="close-review"]');
await click('#appBack');
await click('#appDock [data-open-app="messages"]');
await click('[data-action="open-thread"][data-id="thread-parcel"]');
assert(await evaluate('document.querySelector(".bubble").textContent.includes("您的包裹地址资料不完整")'), 'Sender-authored message was incorrectly translated');
await click('#appBack');
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
await click('#homeIndicator');
await click('#appGrid [data-open-app="settings"]');
await click('[data-action="set-region"][data-value="HK"]');
await click('[data-action="set-language"][data-value="zh-CN"]');
assert(await evaluate('document.querySelector("#appTitle").textContent === "设置"'), 'Chinese interface language did not restore');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).region === "HK"'), 'Region setting was not persisted');
await click('#appBack');
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
await click('#homeIndicator');
await click('#appDock [data-open-app="bank"]');
assert(await evaluate('document.querySelector("#appContent").textContent.includes("可用余额")'), 'Bank app did not render');
await click('#appBack');

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

await click('#appBack');
await click('#appDock [data-open-app="contacts"]');
await click('[data-action="call-contact"][data-id="contact-hall"]');
await click('[data-action="confirm-hall"]');
await click('#appBack');
await click('#appGrid [data-open-app="tasks"]');
assert((await evaluate('document.querySelectorAll(".task-panel:first-of-type .task-step.done").length')) >= 3, 'Parcel verification steps were not persisted');
await click('[data-action="collect-parcel"]');
assert(await evaluate('document.querySelector(".task-panel .task-status").textContent === "已完成"'), 'Parcel task did not complete');
await click('#appBack');
assert(await evaluate('document.querySelector("#homeTodoList .home-todo-item:first-child").classList.contains("done")'), 'Completed parcel task was not checked on the desktop');

await click('#appDock [data-open-app="messages"]');
await click('[data-action="open-thread"][data-id="thread-parcel"]');
await click('[data-action="message-open-link"]');
await wait(180);
const parcelPageText = await evaluate('document.querySelector("#appContent").textContent');
const parcelPageState = await evaluate('window.ScamBusterPhone?.getState?.().browserPage || "unavailable"');
const parcelPageUrl = await evaluate('location.href');
const parcelScriptUrls = await evaluate('performance.getEntriesByType("resource").filter((entry) => entry.name.includes("phone-")).map((entry) => entry.name).join(", ")');
assert(parcelPageText.includes('parcel-update.example'), `Simulated parcel site did not open (url=${parcelPageUrl}; state=${parcelPageState}; scripts=${parcelScriptUrls}; text=${parcelPageText.slice(0, 160)})`);

await click('#appBack');
await click('#appDock [data-open-app="phone"]');
assert(await evaluate('document.querySelector("[data-action=\\"call-number\\"][data-id=\\"call-unknown\\"] .list-copy span").textContent.includes("未接来电")'), 'Unknown number is not shown as a missed call');
await capture('simulator-missed-call');
await click('[data-action="call-number"][data-id="call-unknown"]');
assert(await evaluate('document.querySelector(".call-overlay").textContent.includes("正在接通")'), 'Callback dialing screen did not start');
await capture('simulator-callback-dialing');
await wait(1600);
assert(await evaluate('document.querySelector(".call-overlay").dataset.cantoneseAudio === "callback-intro"'), 'Cantonese callback audio was not selected');
assert(await evaluate('document.querySelector(".call-dialogue").textContent.includes("真係唔記得我")'), 'Unknown caller Cantonese dialogue did not start');
await capture('simulator-callback-cantonese');
await click('[data-action="call-guess-ajie"]');
await click('[data-action="call-check-kaman"]');
await click('[data-action="call-contact"][data-id="contact-kaman"]');
await click('[data-action="close-overlay"]');

await click('#appBack');
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
await click('[data-action="research-check-directory"]');
assert(await evaluate('document.querySelector("#appContent").textContent.includes("cw.chan@staff.polyu.example")'), 'Simulated staff profile did not render');
assert(await evaluate('document.querySelector("#appContent").textContent.includes("outlook.example")'), 'Simulated profile did not explain the email mismatch');
await capture('simulator-research-directory');
await click('[data-action="research-contact-official"]');
assert(await evaluate('document.querySelector(".dialog-sheet").textContent.includes("没有发送这封邮件")'), 'Department confirmation did not resolve the research invitation');
await click('[data-action="close-overlay"]');

await click('#appBack');
await click('#appGrid [data-open-app="mail"]');
await click('[data-action="mail-tab"][data-value="other"]');
assert(await evaluate('document.querySelector(".outlook-tabs [data-value=other]").getAttribute("aria-selected") === "true"'), 'Other inbox did not activate');
await click('[data-action="open-mail"][data-id="mail-event-fee"]');
assert(await evaluate('document.querySelector("#appContent").textContent.includes("HK$180")'), 'External event payment amount is missing');
assert(await evaluate('document.querySelector("#appContent").textContent.includes("personal FPS")'), 'External event payment channel is missing');
await capture('simulator-event-payment-mail');
await click('[data-action="event-open-polyu"]');
assert(await evaluate('document.querySelector(".polyu-event-detail").textContent.includes("HK$60")'), 'Official PolyULife event fee did not render');
assert(await evaluate('document.querySelector(".polyu-event-detail").textContent.includes("个人 FPS")'), 'Official event guidance did not explain the payment channel');
await capture('simulator-polyulife-event-detail');
await click('[data-action="event-skip-official"]');
assert(await evaluate('document.querySelector(".polyu-event-detail").textContent.includes("决定暂时不参加")'), 'Optional event could not be declined');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).balance === 6840'), 'Declining an optional event changed the balance');

await click('#appBack');
await click('#appGrid [data-open-app="tasks"]');
assert(await evaluate('document.querySelectorAll(".task-panel").length === 2'), 'Inbox decisions leaked into the required task list');
assert(await evaluate('Array.from(document.querySelectorAll(".task-status")).every(el => el.textContent === "已完成")'), 'Not all daily tasks completed');
await click('[data-action="end-day"]');
assert(await evaluate('document.querySelector(".review-overlay") !== null'), 'Day review did not open');
assert(await evaluate('document.querySelector(".review-overlay").textContent.includes("没有报名也不算任务失败")'), 'Review did not treat declining the event as a valid choice');

await click('[data-action="reset-day"]');
await click('#unlockButton');
await click('[data-action="start-day"]');
await click('#appGrid [data-open-app="mail"]');
await click('[data-action="open-mail"][data-id="mail-research"]');
await click('[data-action="research-open-link"]');
await click('[data-action="research-submit-simulated"]');
await click('[data-action="research-buy-vouchers"]');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).moneyLost === 800'), 'Research voucher payment was not recorded as a loss');
await click('#appBack');
await click('#appGrid [data-open-app="mail"]');
await click('[data-action="mail-tab"][data-value="other"]');
await click('[data-action="open-mail"][data-id="mail-event-fee"]');
await click('[data-action="event-open-payment"]');
await click('[data-action="event-pay-fake"]');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).moneyLost === 980'), 'Fake event FPS payment was not recorded as a loss');
assert(await evaluate('JSON.parse(localStorage.getItem("polyu_simulator_phone_v1")).taskState.event.status === "pending"'), 'Fake event payment incorrectly completed official registration');

console.log(JSON.stringify({
  result: 'PASS',
  apps: ['phone', 'messages', 'mail', 'polyu', 'browser', 'contacts', 'bank', 'tasks', 'settings'],
  flow: 'opening brief, desktop to-do, sound control, language and region settings, PolyULife views, parcel verification, unknown caller, professor impersonation, event fee cross-check, day review'
}));

socket.close();
