# Scam Buster

**v2.0.0 · Anti-Scam Student Life Simulator**

Scam Buster 是一个面向大学生的浏览器反诈骗情境模拟器。玩家在一部仿 iOS 手机中处理日常来电、邮件、短信、活动通知与校园事务；信息不会预先标明真假，需要结合上下文、来源和核验路径自行判断。

本项目用于反诈骗教育。所有姓名、账号、对话和交易均为模拟内容，不连接真实 PolyU、Outlook、银行或支付账户。

## v2.0.0

Released on 12 August 2026.

- 仿 iOS 手机桌面、锁屏通知与待办组件。
- 未接来电回拨流程及粤语通话音频。
- Outlook 风格邮件收件箱与详情页；PolyU 情境邮件使用英文原文，并可从发件人右侧的 `…` 菜单选择翻译。
- 电话、短信、邮件、浏览器、联系人、银行与 PolyULife 等应用界面。
- 面向学生的真实感情境：研究邀请、活动缴费、包裹通知、冒充熟人及账号核验等。
- 一部分邮件和活动只是可选信息，不会全部被包装成任务。
- 08:30–17:30 的模拟时钟会持续推进，通知、邮件、短信和未接来电按各自时间到达；离开后再打开也会补算经过时间。
- 简体中文与英文界面，以及国家/地区格式设置。
- 保留 v1.x 经典剧情模式。

## Run locally

This is a static web project. Serve it over HTTP so browser audio and storage behave consistently:

```powershell
python -m http.server 8765
```

Then open <http://127.0.0.1:8765/>.

- `index.html`: v2 phone simulator (default)
- `phone-prototype.html`: direct v2 simulator entry
- `classic.html`: v1.x story mode

## Data and privacy

- No backend or real account integration is used.
- Messages, calls, payments and identities shown in the simulator are fictional training data.
- Progress and preferences are stored only in the browser's `localStorage` and can be cleared with the browser's site-data controls.
- External links shown inside scenarios should be treated as simulated evidence, not as instructions to make a real payment or disclose information.

## Validation

```powershell
node --check phone-data.js
node --check phone-engine.js
node --check phone-smoke-test.mjs
```

## Project structure

```text
index.html / phone-prototype.html  v2 simulator shell
phone.css                         phone and app presentation
phone-data.js                     scenarios and localized content
phone-engine.js                   simulator state and interactions
assets/audio/calls/               simulated call audio
classic.html                      v1.x story mode
```

## License

No open-source license is included in this release. Public repository visibility does not grant permission to copy, modify, or redistribute the project; all rights remain with the repository owner unless permission is granted separately.

<details>
<summary>v1.x classic documentation</summary>

# Anti-Scam Story Simulator v1.x

一款以劇情選擇為核心的網頁端反詐互動遊戲。

A web-based interactive anti-scam game built around narrative choices and decision-making.

---

## 專案介紹｜Project Overview

玩家將以不同身份進入模擬詐騙情境，在聊天、交易、付款、身份驗證及個人資料處理等關鍵節點作出決定。

每次選擇都會影響風險程度、財產安全、個人資料安全及最終結局。

Players enter simulated scam scenarios under different identities and make decisions during key moments involving messages, transactions, payments, identity verification, and personal information.

Each decision affects the level of risk, financial security, data privacy, and the final outcome.

---

## 專案目標｜Project Goals

本專案希望將傳統反詐教育由知識問答轉化為具有故事性、沉浸感及決策壓力的互動體驗。

遊戲不會直接告訴玩家哪一個選項正確，而是透過對話細節、人物行為及情境線索，讓玩家自行辨識潛在的詐騙風險。

This project transforms traditional anti-scam education from simple quizzes into an immersive, story-driven experience involving realistic decisions and pressure.

Instead of directly showing which option is correct, the game encourages players to identify potential scams through dialogue details, character behaviour, and contextual clues.

---

## 核心玩法｜Core Gameplay

- 選擇玩家身份及地區背景  
  Select a player identity and regional background.

- 進入不同類型的詐騙劇情  
  Enter different types of scam scenarios.

- 閱讀聊天紀錄、通知及交易資訊  
  Review conversations, notifications, and transaction information.

- 在關鍵節點作出選擇  
  Make decisions at critical moments.

- 選項會改變角色狀態及後續劇情  
  Choices affect character status and subsequent events.

- 根據玩家決策進入不同結局  
  Reach different endings based on player decisions.

- 完成劇情後查看風險分析及反詐建議  
  Receive a risk analysis and anti-scam guidance after completing a scenario.

---

## 設計特色｜Key Features

### 劇情式體驗｜Story-Driven Experience

遊戲以完整事件發展取代單純的是非題，玩家需要根據前後文、人物反應及事件細節辨識風險。

The game uses complete storylines instead of simple true-or-false questions. Players must evaluate risks using context, character reactions, and event details.

### 非明顯選項｜Non-Obvious Choices

每個選項都具有一定合理性，不會直接使用「相信騙子」或「立即報警」等過於明顯的表述。

Each option is designed to appear reasonably plausible. The game avoids overly obvious choices such as “trust the scammer” or “call the police immediately.”

### 多維度評分｜Multi-Dimensional Evaluation

玩家的決策會影響以下狀態：

Player decisions may affect:

- 財產安全｜Financial Security
- 個人資料安全｜Personal Data Security
- 心理壓力｜Psychological Pressure
- 詐騙警覺程度｜Scam Awareness
- 角色信任關係｜Character Trust Relationships

### 多重結局｜Multiple Endings

遊戲結局不只分為成功或失敗，而是根據玩家在不同階段的選擇，產生不同程度的損失、補救結果及風險評價。

The outcomes are not limited to simple success or failure. Different choices may lead to varying levels of financial loss, recovery, consequences, and risk evaluations.

---

## 預計情境｜Planned Scenarios

- 網路購物詐騙｜Online Shopping Scams
- 冒充客服退款｜Fake Customer Service Refunds
- 虛假投資平台｜Fraudulent Investment Platforms
- 冒充政府或執法人員｜Government or Law-Enforcement Impersonation
- 兼職刷單詐騙｜Fake Part-Time Job Scams
- 感情及交友詐騙｜Romance and Social Scams
- 帳戶盜用及釣魚連結｜Account Theft and Phishing Links
- 冒充親友要求轉帳｜Family or Friend Impersonation Scams

---

## 專案狀態｜Project Status

本專案目前仍在持續開發中，主要改進方向包括：

This project is currently under development. Planned improvements include:

- 延長單一劇情的遊戲流程  
  Extending the length of each storyline.

- 增加事件、對話及選擇數量  
  Adding more events, dialogues, and decisions.

- 降低正確選項的明顯程度  
  Making correct choices less obvious.

- 強化選項之間的連鎖影響  
  Strengthening the long-term consequences of decisions.

- 增加角色互動及情境細節  
  Improving character interactions and scenario details.

- 完善評分系統及結局分析  
  Enhancing the evaluation system and ending analysis.

---

## 使用方式｜How to Play

1. 選擇身份或詐騙情境。  
   Select an identity or scam scenario.

2. 閱讀角色對話及事件資訊。  
   Read character conversations and event information.

3. 在關鍵節點選擇處理方式。  
   Choose how to respond at critical moments.

4. 觀察選擇造成的後續影響。  
   Observe the consequences of each decision.

5. 完成劇情並查看結局及反詐分析。  
   Complete the storyline and review the ending and risk analysis.

---

## 免責聲明｜Disclaimer

本專案僅用於反詐教育、情境模擬及互動體驗。

遊戲中的人物、帳號、對話及事件均為模擬內容。部分真實機構名稱僅用於建立可辨識的教育情境；本專案不代表相關機構，也不獲其背書。

This project is intended solely for anti-scam education, scenario simulation, and interactive learning.

All people, accounts, conversations, and events are simulated. Real organisation names may appear solely to make the training scenario recognisable; this project is neither affiliated with nor endorsed by those organisations.

</details>
