(function () {
  'use strict';

  const DATA = window.SIM_DATA;
  const STORAGE_KEY = 'polyu_simulator_phone_v1';
  const REQUIRED_TASK_IDS = ['parcel', 'contact'];
  const $ = (id) => document.getElementById(id);
  const els = {};

  const APP_NAMES = {
    'zh-CN': { phone: '电话', messages: '短信', mail: '邮件', polyu: 'PolyULife', browser: '浏览器', contacts: '联系人', bank: '银行', tasks: '任务', settings: '设置' },
    en: { phone: 'Phone', messages: 'Messages', mail: 'Mail', polyu: 'PolyULife', browser: 'Browser', contacts: 'Contacts', bank: 'Bank', tasks: 'Tasks', settings: 'Settings' }
  };

  const EN_UI = {
    '模拟器': 'Simulator', '完成今天的事。相信谁，由你判断。': 'Get through the day. Decide who to trust.',
    '教学模拟 · 不使用真实账户': 'Training simulation · No real accounts', '两件事需要处理': 'Two things need your attention', '今日待办': 'Today',
    '打开今日任务': 'Open today’s tasks', '返回主屏幕': 'Back to Home Screen', '返回上一页': 'Back', '返回': 'Back', '主页': 'Home', '系统导航': 'System navigation', '更多选项': 'More options',
    '关闭声音': 'Mute sound', '打开声音': 'Turn on sound', '声音已开启': 'Sound on', '声音已关闭': 'Sound off',
    '领取交换申请文件': 'Collect exchange application documents', '宿舍收发室 · 17:00前': 'Hall reception · Before 5:00 PM',
    '核实迎新联系人': 'Verify orientation contact', '确认“阿杰”的新号码': 'Confirm Ah Kit’s new number',
    '尚未开放': 'Not available yet', '这个应用会在之后的任务中出现。': 'This app will be available later.',
    '最近通话': 'Recents', '提示': 'Note', '主动回拨前先观察': 'Before calling back',
    '拨号键盘': 'Keypad', '输入号码': 'Enter a number', '拨号': 'Call', '删除一位': 'Delete digit', '无法接通': 'Call failed',
    '这个号码暂时无法接通。你可以检查输入、搜索号码，或通过其他渠道联系。': 'This number cannot be reached right now. Check what you entered, search the number, or use another channel.',
    '这是一个已经错过的来电。你可以从通话记录回拨了解来意，也可以先检查号码和已有联系人。': 'This is a missed call. You can call back to learn why they contacted you, or check the number and saved contacts first.',
    '信息': 'Messages', '今天': 'Today', '打开短信里的页面': 'Open link in message', '保存短信运单号': 'Save tracking number', '自己搜索这个域名': 'Search this domain independently',
    '收件箱': 'Inbox', '邮件详情': 'Message', '未读': 'Unread', '已打开': 'Opened', '发件人': 'From', '地址': 'Address', '运单号': 'Tracking number',
    '保存完整运单号': 'Save full tracking number', '致电收发室': 'Call hall reception', '打开 onboarding form': 'Open onboarding form',
    '从官方目录查教授': 'Check the official staff directory', '查看付款页面': 'View payment page', '在 PolyULife 查活动': 'Check the event in PolyULife', '查看相关联系人': 'View related contacts',
    '已保存联系人': 'Saved contacts', '搜索联系人': 'Search contacts', '没有匹配的联系人': 'No matching contacts', '拨打': 'Call', '银行卡已冻结': 'Card frozen', '冻结银行卡': 'Freeze card', '联系银行': 'Contact bank', '交易记录': 'Transactions',
    '截止时间 · 今天17:00': 'Due · Today at 5:00 PM', '宿舍收发室通知有一份挂号文件等待领取。': 'Hall reception says a registered document is ready for collection.',
    '查看收发室通知': 'Read the reception notice', '取得完整运单号': 'Get the full tracking number', '向独立渠道确认': 'Confirm through an independent channel', '前往收发室领取': 'Collect it from hall reception',
    '确认迎新活动联系人': 'Confirm orientation event contact', '中午前确认去年联系人阿杰是否能参加筹备。': 'Confirm by noon whether last year’s contact, Ah Kit, can join the preparations.',
    '回拨未接来电了解来意': 'Return the missed call', '检查原有联系方式': 'Check the existing contact details', '向共同联系人核对': 'Verify with a mutual contact', '确认今年联络方式': 'Confirm this year’s contact method',
    '已保存的信息': 'Saved information', '还没有保存信息': 'No information saved yet', '从邮件、联系人和自行打开的官方网站开始。': 'Start with Mail, Contacts, and official sites you open yourself.',
    '结束今天并查看记录': 'End the day and review', '重新开始': 'Start over', '已完成': 'Completed', '进行中': 'In progress', '前往收发室领取': 'Go to hall reception',
    '回拨': 'Calling back', '未知号码': 'Unknown number', '正在接通…': 'Connecting…', '你正在主动回拨刚才的未接来电': 'You are returning the missed call.', '正在拨打这个号码': 'You are calling this number.', '通话中': 'Call in progress',
    '取消回拨': 'Cancel callback', '结束通话': 'End call', '通话已结束': 'Call ended',
    '今天的收件箱会比较忙': 'Your inbox may get busy today', '开始今天': 'Start the day',
    '记下信息': 'Save information', '稍后处理': 'Do this later', '我收到通知有份文件，想查一下': 'I received a notice about a document and want to check it', '请问这里是什么单位？': 'Which office is this?', '只提供尾号和宿舍': 'Share only the last four digits and hall', '先问是否需要缴费': 'Ask whether any payment is required first', '提供完整运单号': 'Provide the full tracking number', '我想核实一封研究邀请': 'I want to verify a research invitation', '请问这里是什么办公室？': 'Which office is this?', '提供邮件主题和发件地址': 'Share the subject and sender address', '询问研究邀请': 'Ask about the research invitation', '记下结果': 'Save result', '打开联系人': 'Open Contacts', '关闭': 'Close', '知道了': 'Got it',
    '你那边能看到什么资料？': 'What information can you see there?', '你先说一下现有记录': 'Tell me what your record already shows', '我暂时不提供个人资料': 'I will not share personal information yet', '打开邮件核对资料': 'Open Mail and check the details', '记下这次通话内容': 'Save what was said in this call', '结束并作出判断': 'End and assess the call',
    '你们最近有招募研究助理吗？': 'Have you recently recruited research assistants?', '返回浏览器核对目录': 'Return to Browser and check the directory', '我只想了解正式招募渠道': 'I only want to know the official recruitment channels', '你先说名字': 'Tell me your name first', '你找我有什么事？': 'Why are you calling me?', '我不确认任何个人资料': 'I will not confirm any personal details',
    '说一件只有联系人知道的事': 'Tell me something only that contact would know', '说一件只有阿杰知道的事': 'Tell me something only Ah Kit would know', '先去联系人核对': 'Check with a saved contact first', '先发正式文件给我': 'Send the formal documents first', '资料确认前不处理': 'I will not act until the details are verified', '按对方要求处理': 'Proceed with the caller’s request', '不提供更多线索': 'Do not give the caller more clues', '再问一项共同经历': 'Ask about another shared experience',
    '确认私人转账': 'Confirm personal transfer', '确认转账': 'Confirm transfer', '返回通话': 'Return to call', '继续使用': 'Continue', '返回手机桌面': 'Return to Home Screen',
    '转账已提交': 'Transfer submitted', '收发室确认文件正在等待领取': 'Hall reception confirmed the document is ready.', '先确认领取地点和安排': 'Confirm the collection location and arrangements first.', '文件已领取': 'Document collected',
    '已保存短信中的编号': 'Message tracking number saved', '完整运单号已保存': 'Full tracking number saved', '官方查询结果已保存': 'Official result saved', '查询结果已保存': 'Search result saved',
    '银行卡已冻结': 'Card frozen', '活动报名完成，QR ticket 已发出': 'Registration complete. Your QR ticket is ready.', '已保留决定：暂不参加': 'Decision saved: not attending for now.',
    '搜索网址、号码或机构': 'Search websites, numbers, or organisations', '搜索': 'Search', '常用入口': 'Favourites',
    '没有完全匹配的结果': 'No exact matches', '尝试更具体的名称、完整号码、邮箱或域名。': 'Try a more specific name, full number, email address or domain.',
    '号码查询': 'Number search', '邮箱与域名查询': 'Email and domain search', '包裹与邮政查询': 'Parcel and postal search',
    'PolyU 官方网站': 'PolyU official website', 'PolyU 教职员目录': 'PolyU staff directory', '香港邮政': 'Hongkong Post',
    '包裹地址更新中心': 'Parcel address update centre', '香港邮政 · 邮件追踪': 'Hongkong Post · Mail tracking', '保存查询结果': 'Save result', '返回搜索': 'Back to search',
    '回邮件查找完整编号': 'Return to Mail for the full number', '提交模拟个人资料': 'Submit simulated personal details', '先查官方教职员目录': 'Check the official staff directory first',
    '致电部门办公室': 'Call the department office', '使用模拟 FPS 付款': 'Pay with simulated FPS', '去 PolyULife 查活动': 'Check the event in PolyULife', '在 PolyULife 查看收费': 'View the fee in PolyULife',
    '打开模拟 PolyULife': 'Open simulated PolyULife', '查看银行记录': 'View bank activity', '联系学校核实': 'Contact the university', '查看银行通知': 'View bank alert', '返回浏览器': 'Back to Browser',
    '我想参加 · 支付 HK$60': 'Attend · Pay HK$60', '这次不参加': 'Not this time', '返回日历': 'Back to Calendar', '已报名 · QR ticket issued': 'Registered · QR ticket issued',
    '你已查看资料，并决定暂时不参加。之后仍可改变决定。': 'You reviewed the details and decided not to attend for now. You can still change your mind.',
    '凭感觉行动': 'Acted on instinct', '完成闭环查证': 'Completed independent verification', '建立独立证据': 'Built independent evidence', '有核对意识': 'Started checking independently',
    '这不是正确答案清单，而是你今天留下的行动记录。': 'This is not an answer sheet. It is a record of the actions you took today.',
    '收件箱里的选择': 'Inbox decisions', '陌生来电的真相': 'What the unknown caller really was', '继续查看手机': 'Keep using the phone', '换一种情况重玩': 'Replay with a different case',
    '交换申请文件已领取。': 'The exchange application documents were collected.', '交换申请文件尚未领取。': 'The exchange application documents were not collected.',
    '迎新联系人已处理。': 'The orientation contact was handled.', '迎新联系人身份仍未确认。': 'The orientation contact is still unverified.',
    '今天没有从独立来源保存核实信息。': 'No information from an independent source was saved today.', '银行卡已冻结，完成了一项止损操作。': 'The card was frozen to limit further loss.',
    '发生付款后尚未冻结银行卡。': 'A payment was made, but the card has not been frozen.', '没有记录到资金损失。': 'No financial loss was recorded.',
    '陌生号码确实是换号后的阿杰，但私人转账要求仍不应仅凭来电处理。': 'The unknown number really was Ah Kit’s new number, but a personal transfer still should not be handled on the strength of a call alone.',
    '陌生号码冒充阿杰，并利用你在通话中提供的信息继续扮演。': 'The unknown caller impersonated Ah Kit and used information you supplied to continue the impersonation.',
    '你从官方目录重新联系学院，确认研究邀请冒充教授。': 'You contacted the department through the official directory and confirmed that the invitation impersonated a professor.',
    '你为邮件中的研究安排购买了电子礼券，但尚未通过学院核实。': 'You bought e-vouchers for the research arrangement without first verifying it with the department.',
    '你看过研究邀请，但没有把它当成必须立即回复的任务。': 'You read the research invitation without treating it as something that required an immediate reply.', '你今天没有打开这封研究邀请。': 'You did not open the research invitation today.',
    '你查看官方资料后，自主决定参加，并在 PolyULife 内完成报名。': 'After reviewing the official details, you chose to attend and registered in PolyULife.',
    '你核对了活动资料，并决定这次不参加；没有报名也不算任务失败。': 'You checked the event details and chose not to attend. Declining an optional event is not a failed task.',
    '你向邮件提供的个人 FPS 付款，但官方活动并未因此完成报名。': 'You paid the personal FPS account in the email, but this did not register you for the official event.',
    '你看过官方活动资料，暂时没有决定是否参加。': 'You reviewed the official event details but have not decided whether to attend.', '你今天没有处理这则活动邀请。': 'You did not act on this event invitation today.',
    '设置': 'Settings', '语言与地区': 'Language & Region', '系统语言': 'System Language', '国家或地区': 'Country or Region', '界面示例': 'Preview',
    '控制手机界面使用的语言和本地格式。': 'Choose the language and local formats used by the phone interface.', '日期与金额预览': 'Date and amount preview',
    '简体中文': 'Simplified Chinese', '英语': 'English', '香港': 'Hong Kong', '中国大陆': 'Mainland China', '美国': 'United States', '英国': 'United Kingdom',
    '语言已更新': 'Language updated', '地区已更新': 'Region updated', '系统界面会使用所选语言；邮件、短信和通话保留发送者原本的语言。': 'The system interface uses your selected language. Mail, messages, and calls keep the sender’s original language.',
    '当前进度会自动保存在这台设备上。你可以重新开始，系统会重新分配部分人物身份。': 'Progress is saved on this device. Starting over will assign some identities again.', '继续': 'Continue',
    '先看看今天会发生什么': 'See what comes up today',
    '校园里的很多安排不会预先写进待办，而会从收件箱和校内应用里陆续出现。': 'Many university arrangements do not begin as tasks. They appear gradually through your inbox and campus apps.',
    '院系与学生组织': 'Departments and student organisations', '讲座、工作坊、招募与临时安排': 'Talks, workshops, recruitment, and last-minute arrangements',
    '教学与研究团队': 'Teaching and research teams', '课程通知、研究参与邀请和助理岗位': 'Course updates, study invitations, and assistant roles',
    '校园服务': 'Campus services', '场地、住宿、缴费与个人事务更新': 'Updates about rooms, halls, payments, and personal administration',
    '这些来信有些与你有关，有些可以忽略。看清来源和内容后，再决定是否行动。': 'Some messages will matter to you; others can be ignored. Check the source and content before deciding what to do.',
    '进入手机': 'Enter the phone', '必须处理的事项': 'Required items', '独立来源': 'Independent sources', '资料暴露': 'Data shared', '金钱损失': 'Financial loss',
    '未接来电': 'Missed call', '呼出': 'Outgoing', '正在回拨': 'Calling back', '已回拨': 'Called back', '正在拨号': 'Calling', '已接通': 'Connected', '昨天': 'Yesterday', '保存': 'Saved',
    '可用余额': 'Available balance', '选定': 'Selected', '界面语言': 'Interface language', '地区格式': 'Regional formats',
    '从 PolyULife 确认创新之夜日期、地点及官方费用 HK$60': 'Confirmed the date, venue, and official HK$60 fee in PolyULife',
    '对比邮件 HK$180 私人FPS与官方 HK$60 应用内付款': 'Compared the email’s HK$180 personal FPS request with the official HK$60 in-app payment',
    '从 polyu.edu.hk 教职员目录找到教授官方邮箱及部门电话': 'Found the professor’s official email and department phone in the polyu.edu.hk staff directory',
    '从已保存号码联系宿舍收发室': 'Contacted hall reception using a saved number', '部门办公室确认没有该研究助理项目或代购礼券安排': 'The department confirmed there was no research assistant project or voucher-purchase arrangement',
    '阿杰旧号码已停用': 'Ah Kit’s old number is no longer in service', '从原号码联系到真正的阿杰': 'Reached the real Ah Kit through the original number',
    '嘉敏确认阿杰的新号码尾号8704': 'Ka Man confirmed Ah Kit’s new number ends in 8704', '嘉敏确认阿杰仍使用原号码': 'Ka Man confirmed Ah Kit still uses the original number',
    '保存了短信中的不完整编号 HKP8234': 'Saved the incomplete tracking number HKP8234 from the message', '从收发室邮件取得完整运单号': 'Obtained the full tracking number from the hall email',
    '要求对方提供报价单及正式收款资料': 'Asked the caller for a quotation and formal payment details', '从自行打开的邮政入口确认送达机构收发点': 'Confirmed delivery to the institutional reception through a postal site opened independently',
    'Scameter暂无记录，未把“查无结果”当作安全证明': 'Scameter had no record; a blank result was not treated as proof of safety', '从PolyULife确认目前没有待缴项目': 'Confirmed in PolyULife that there are no outstanding payments',
    '点击通话画面以播放粤语对白': 'Tap the call screen to play the Cantonese dialogue', '应用': 'App', '最近通话与回拨记录': 'Recent calls and callbacks',
    '通知不等于事实。': 'A notification is not a fact.', '从你信任的入口重新开始。': 'Start again from a source you trust.',
    '重点': 'Focused', '其他': 'Other', '筛选': 'Filter', '仅未读': 'Unread only', '显示全部': 'Show all', '未读邮件': 'Unread mail',
    '写邮件': 'Compose', '搜索邮件': 'Search mail', '个人文件夹': 'Personal folders', '邮箱': 'Mail', '日历': 'Calendar', '撰写': 'Compose',
    '检测到英语': 'English detected', '检测到中文': 'Chinese detected', '翻译为简体中文': 'Translate to Simplified Chinese', '翻译为英语': 'Translate to English',
    '查看原文': 'View original', '已翻译为简体中文': 'Translated to Simplified Chinese', '已翻译为英语': 'Translated to English',
    '译文用于理解内容，网址、金额和发件人未更改。': 'The translation is for understanding only. Links, amounts, and sender details are unchanged.',
    '回复': 'Reply', '转发': 'Forward', '更多邮件操作': 'More mail actions', '邮件已标记': 'Message flagged', '邮件操作': 'Message actions',
    '收件人：你': 'To: You', '标记为未读': 'Mark as unread', '已标记为未读': 'Marked as unread', '打印': 'Print',
    '翻译邮件': 'Translate Message', '更多加载项': 'More Add-Ins', '取消': 'Cancel', '关闭邮件操作': 'Close message actions',
    '邮件已翻译': 'Message translated', '正在显示原文': 'Showing original', '从发件人菜单可查看原文': 'Use the sender menu to view the original',
    '反应已添加': 'Reaction added', '打印功能在模拟器中不可用': 'Printing is unavailable in the simulator', '暂时没有其他加载项': 'No other add-ins are available',
    '此模拟不发送真实邮件。': 'This simulation does not send real email.', '暂时没有邮件': 'No messages here', '切换到另一个分类查看其余邮件。': 'Switch to the other category to see the remaining messages.'
    , '输入信息': 'iMessage', '发送': 'Send', '正在输入…': 'Typing…', '信息不能为空': 'Message cannot be empty',
    '回复内容': 'Reply', '发送回复': 'Send reply', '放弃草稿': 'Discard draft', '已发送': 'Sent',
    '模拟回复只在这台设备中生成，不会联系真实号码或邮箱。': 'Simulated replies are generated only on this device. No real number or email is contacted.'
  };

  Object.assign(EN_UI, {
    '打开项目工作台': 'Open project workspace',
    '核实招聘渠道': 'Verify the recruitment channel',
    '打开取消页面': 'Open cancellation page',
    '自行查官方医疗应用': 'Check the official health app independently',
    '查看收款验证': 'View receiving verification',
    '返回平台内交易': 'Return to the in-app transaction',
    '提交模拟资料': 'Submit simulated details',
    '完成首个试做任务': 'Complete the first trial task',
    '继续高额任务': 'Continue to the high-value task',
    '停止并核实': 'Stop and verify',
    '查看官方防骗建议': 'Check official anti-scam advice',
    '申请追回款项': 'Request fund recovery',
    '支付可退还保证金': 'Pay refundable guarantee',
    '出现损失后的联络': 'Contact after a loss',
    '早期返佣不等于工作真实': 'An early commission does not prove the job is genuine',
    '你完成小额试做并收到返佣，但没有因此继续投入更大金额。': 'You completed a small trial and received a commission, but did not treat it as proof for a larger payment.',
    '你在收到小额返佣后继续支付了更大任务押金。': 'After receiving a small commission, you continued with a much larger task deposit.',
    '你从独立渠道核实了招聘或追款安排。': 'You independently verified the recruitment or recovery claim.',
    '损失后出现了自称协助追款的人；掌握旧案资料仍不等于身份可信。': 'After the loss, someone claiming to help recover the money appeared. Knowing case details still did not verify their identity.',
    '你没有把陌生招聘转介当成必须完成的任务。': 'You did not treat an unsolicited recruitment referral as a required task.',
    '今天没有触发失款后的二次联络。': 'No post-loss recovery contact was triggered today.'
    , '先垫付印刷费': 'Pay the printing fee first'
    , '用原号码联系 Mandy': 'Contact Mandy using her saved number'
    , '查看案件摘要': 'View case summary'
    , '查看委托摘要': 'View engagement summary'
    , '同意转交合作律师': 'Agree to a partner lawyer referral'
    , '查看律师联络': 'View the lawyer contact'
    , '联络调查工作组': 'Contact the investigation team'
    , '打开远程协助': 'Open remote assistance'
    , '允许模拟远程协助': 'Allow simulated remote assistance'
    , '另行查证机构': 'Verify the organisation independently'
    , '案件转交记录': 'Case handoff history'
    , '客服受理': 'Intake desk'
    , '法律评估': 'Legal review'
    , '调查协助': 'Investigation support'
    , '熟人账号里的请求': 'A request from a familiar account'
    , '你离开原聊天账号，从已保存号码联系Mandy；历史对话和熟悉语气没有被当成身份证明。': 'You left the original chat and contacted Mandy through her saved number. Familiar history and tone were not treated as identity proof.'
    , '你根据聊天账号里的旧记录和熟悉语气完成了垫付款，但没有从原号码核实。': 'You paid based on old chat history and a familiar tone without checking through the saved number.'
    , '你看过Mandy账号提出的垫付请求，暂时没有把它当成必须立刻完成的任务。': 'You read the payment request from Mandy’s account without treating it as something that had to be done immediately.'
    , '你今天没有打开Mandy的聊天。': 'You did not open Mandy’s chat today.'
    , '客服把你转给律师，律师再转给调查员；角色变多、文件变完整，并没有产生独立核实。': 'A service agent referred you to a lawyer, who referred you to an investigator. More roles and documents did not create independent verification.'
    , '确认取消服务': 'Confirm cancellation'
    , '连接银行卡': 'Link bank card'
    , '提交学生资料': 'Submit student details'
    , '提交个人资料': 'Submit personal details'
    , '拨打部门电话': 'Call department number'
    , '通过 FPS 付款': 'Pay by FPS'
    , '打开 PolyULife': 'Open PolyULife'
    , '连接远程协助': 'Connect remote assistance'
  });

  function ui(value) {
    const text = String(value == null ? '' : value);
    if (!state || state.language !== 'en') return text;
    if (EN_UI[text]) return EN_UI[text];
    if (text.startsWith('今天 ')) return `Today ${text.slice(3)}`;
    if (text.endsWith(' 保存')) return `${text.slice(0, -3)} saved`;
    return text;
  }

  function appName(appId) {
    const language = state && state.language === 'en' ? 'en' : 'zh-CN';
    return (APP_NAMES[language] && APP_NAMES[language][appId]) || DATA.apps[appId].name;
  }

  function localized(zh, en) {
    return state && state.language === 'en' ? en : zh;
  }
  let state = loadState();
  let toastTimer = null;
  let callbackTimer = null;
  let callSession = null;
  let audioContext = null;
  let ringtoneTimer = null;
  let speechTimer = null;
  let callerAudio = null;
  let mailMenuReturnFocus = null;
  let activeThreadKey = null;
  let activeMailId = null;
  const pendingReplies = new Set();
  let unlockTransitionTimer = null;
  let unlockGesture = createUnlockGesture();

  function createUnlockGesture() {
    return {
      active: false,
      finishing: false,
      pointerId: null,
      startX: 0,
      startY: 0,
      lastY: 0,
      lastTime: 0,
      velocity: 0,
      distance: 0,
      direction: null
    };
  }
  const activeTones = new Set();

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(saved.version)) {
        const defaults = DATA.createInitialState();
        const savedVersion = saved.version;
        saved.version = 12;
        saved.contactVariant = ['real', 'fake', 'grey'].includes(saved.contactVariant)
          ? saved.contactVariant
          : (saved.contactIsReal ? 'real' : 'fake');
        saved.contactIsReal = saved.contactVariant === 'real';
        saved.soundEnabled = saved.soundEnabled !== false;
        saved.openingBriefSeen = saved.openingBriefSeen === true;
        saved.language = saved.language === 'en' ? 'en' : 'zh-CN';
        saved.region = ['HK', 'CN', 'US', 'GB'].includes(saved.region) ? saved.region : 'HK';
        saved.polyuPage = saved.polyuPage || 'home';
        saved.polyuCalendarView = saved.polyuCalendarView || 'month';
        saved.phoneView = ['recents', 'keypad'].includes(saved.phoneView) ? saved.phoneView : 'recents';
        saved.dialNumber = String(saved.dialNumber || '').slice(0, 24);
        saved.contactsQuery = String(saved.contactsQuery || '').slice(0, 60);
        saved.investigationQueries = Array.isArray(saved.investigationQueries) ? saved.investigationQueries.slice(-12) : [];
        saved.callLog = Array.isArray(saved.callLog) ? saved.callLog.map((call) => ({ ...call, name: '未知号码' })) : defaults.callLog;
        saved.messageDrafts = saved.messageDrafts && typeof saved.messageDrafts === 'object' ? saved.messageDrafts : {};
        saved.mailDrafts = saved.mailDrafts && typeof saved.mailDrafts === 'object' ? saved.mailDrafts : {};
        saved.mailReplies = saved.mailReplies && typeof saved.mailReplies === 'object' ? saved.mailReplies : {};
        saved.openMailComposerId = typeof saved.openMailComposerId === 'string' ? saved.openMailComposerId : null;
        saved.mailTab = ['focused', 'other'].includes(saved.mailTab) ? saved.mailTab : 'focused';
        saved.mailUnreadOnly = saved.mailUnreadOnly === true;
        saved.mailTranslations = saved.mailTranslations || {};
        saved.recoveryScamTriggered = saved.recoveryScamTriggered === true;
        saved.hijackedFriendVariant = ['hijacked', 'real'].includes(saved.hijackedFriendVariant) ? saved.hijackedFriendVariant : defaults.hijackedFriendVariant;
        const savedCallJudgements = saved.callJudgements && typeof saved.callJudgements === 'object'
          ? saved.callJudgements
          : {};
        saved.callJudgements = Object.fromEntries(
          Object.entries(savedCallJudgements)
            .filter(([, judgement]) => judgement && typeof judgement === 'object')
            .map(([recordId, judgement]) => [recordId, {
              verdict: judgement.verdict,
              time: judgement.time
            }])
        );
        saved.callRecords = Array.isArray(saved.callRecords) ? saved.callRecords.slice(-12) : [];
        saved.taskState = saved.taskState || {};
        Object.entries(defaults.taskState).forEach(([key, task]) => {
          if (!saved.taskState[key]) saved.taskState[key] = task;
          else saved.taskState[key] = {
            ...task,
            ...saved.taskState[key],
            steps: { ...task.steps, ...(saved.taskState[key].steps || {}) }
          };
        });
        ['notifications', 'contacts'].forEach((key) => {
          saved[key] = saved[key] || [];
          defaults[key].forEach((item) => {
            if (!saved[key].some((entry) => entry.id === item.id)) saved[key].push(item);
          });
        });
        defaults.notifications.forEach((defaultNotification) => {
          const savedNotification = saved.notifications.find((item) => item.id === defaultNotification.id);
          if (!savedNotification) return;
          const unread = typeof savedNotification.unread === 'boolean' ? savedNotification.unread : defaultNotification.unread;
          Object.assign(savedNotification, defaultNotification, { unread });
        });
        const savedMails = saved.mails || [];
        saved.mails = defaults.mails.map((defaultMail) => {
          const savedMail = savedMails.find((mail) => mail.id === defaultMail.id);
          return {
            ...defaultMail,
            unread: typeof savedMail?.unread === 'boolean' ? savedMail.unread : defaultMail.unread
          };
        });
        saved.messages = saved.messages && typeof saved.messages === 'object' ? saved.messages : {};
        Object.entries(defaults.messages).forEach(([key, defaultThread]) => {
          if (!saved.messages[key]) saved.messages[key] = defaultThread;
          else saved.messages[key] = {
            ...defaultThread,
            ...saved.messages[key],
            items: Array.isArray(saved.messages[key].items) ? saved.messages[key].items : defaultThread.items
          };
        });
        if (savedVersion < 6) {
          delete saved.mailTranslations['mail-parcel'];
          delete saved.mailTranslations['mail-event'];
        }
        if (!saved.taskState.contact.steps.strangerSpoken) {
          const missedCall = saved.callLog.find((item) => item.id === 'call-unknown');
          if (missedCall) Object.assign(missedCall, { time: '08:28', direction: '未接来电', unread: true });
          if (!saved.notifications.some((item) => item.id === 'n-call')) {
            saved.notifications.unshift({ id: 'n-call', app: 'phone', title: '未接来电', body: '未知号码 · +852 6XXX 8704', time: '08:28', unread: true });
          }
        }
        return saved;
      }
    } catch (error) {
      console.warn('Unable to restore simulator state', error);
    }
    return DATA.createInitialState();
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function ensureAudio() {
    if (!state.soundEnabled) return null;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioContext) audioContext = new AudioContextClass();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    return audioContext;
  }

  function tone(frequency, duration, delay, gainValue, type) {
    const context = ensureAudio();
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + (delay || 0);
    oscillator.type = type || 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue || 0.035, start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    activeTones.add(oscillator);
    oscillator.addEventListener('ended', () => activeTones.delete(oscillator), { once: true });
    oscillator.start(start);
    oscillator.stop(start + duration + 0.04);
  }

  function playSound(name) {
    if (!state.soundEnabled) return;
    if (name === 'tap') tone(620, 0.045, 0, 0.018, 'sine');
    if (name === 'unlock') {
      tone(523, 0.12, 0, 0.025, 'sine');
      tone(784, 0.18, 0.1, 0.032, 'sine');
    }
    if (name === 'notification') {
      tone(740, 0.12, 0, 0.034, 'sine');
      tone(988, 0.2, 0.12, 0.032, 'sine');
    }
    if (name === 'success') {
      tone(523, 0.12, 0, 0.028, 'triangle');
      tone(659, 0.14, 0.1, 0.03, 'triangle');
      tone(880, 0.22, 0.22, 0.034, 'triangle');
    }
    if (name === 'hangup') tone(320, 0.16, 0, 0.035, 'sine');
  }

  function playCallbackTone() {
    stopRingtone();
    if (!state.soundEnabled) return;
    tone(425, 0.62, 0, 0.032, 'sine');
    tone(425, 0.62, 1.02, 0.032, 'sine');
  }

  function stopRingtone() {
    clearInterval(ringtoneTimer);
    ringtoneTimer = null;
    activeTones.forEach((oscillator) => {
      try { oscillator.stop(); } catch {}
    });
    activeTones.clear();
  }

  function stopSpeech() {
    clearTimeout(speechTimer);
    speechTimer = null;
    if (callerAudio) {
      callerAudio.pause();
      callerAudio.currentTime = 0;
      callerAudio = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  function speakCallerText(text, notifyOnFailure = false) {
    if (!state.soundEnabled || !text || !('speechSynthesis' in window)) {
      if (notifyOnFailure) showToast('这台设备暂时无法播放语音');
      return;
    }
    const cleanText = String(text).replace(/[「」]/g, '').trim();
    if (!cleanText) return;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((item) => /^yue(?:-|$)/i.test(item.lang))
      || voices.find((item) => /^zh[-_]?hk$/i.test(item.lang));
    if (!voice) {
      if (notifyOnFailure) showToast('设备没有粤语声音，请使用通话中的预录语音');
      return;
    }
    utterance.lang = voice.lang;
    utterance.voice = voice;
    utterance.rate = 0.94;
    utterance.pitch = 0.98;
    utterance.volume = 0.95;
    utterance.onerror = () => {
      if (notifyOnFailure) showToast('语音播放失败，请检查浏览器声音权限');
    };
    window.speechSynthesis.speak(utterance);
  }

  function playCallerVoice(audioId, fallbackText = '', notifyOnFailure = false) {
    if (!state.soundEnabled) {
      if (notifyOnFailure) showToast('请先打开声音');
      return;
    }
    stopSpeech();
    if (!audioId) {
      speakCallerText(fallbackText, notifyOnFailure);
      return;
    }
    let usedFallback = false;
    const fallback = () => {
      if (usedFallback) return;
      usedFallback = true;
      callerAudio = null;
      speakCallerText(fallbackText, notifyOnFailure);
    };
    callerAudio = new Audio(`assets/audio/calls/${audioId}.mp3`);
    callerAudio.preload = 'auto';
    callerAudio.volume = 0.92;
    callerAudio.addEventListener('ended', () => { callerAudio = null; }, { once: true });
    callerAudio.addEventListener('error', fallback, { once: true });
    callerAudio.play().catch(fallback);
  }

  function stopAllAudio() {
    stopRingtone();
    stopSpeech();
  }

  function syncSoundButton() {
    if (!els.soundToggle) return;
    const enabled = state.soundEnabled !== false;
    els.soundToggle.setAttribute('aria-pressed', String(enabled));
    els.soundToggle.setAttribute('aria-label', ui(enabled ? '关闭声音' : '打开声音'));
    els.soundToggle.classList.toggle('is-muted', !enabled);
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    saveState();
    syncSoundButton();
    if (state.soundEnabled) {
      ensureAudio();
      playSound('unlock');
      if (callSession && callSession.phase === 'dialing') playCallbackTone();
      showToast('声音已开启');
    } else {
      stopAllAudio();
      showToast('声音已关闭');
    }
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function localeCode() {
    const language = state.language === 'en' ? 'en' : 'zh-Hans';
    return `${language}-${state.region}`;
  }

  function formatLocaleDate() {
    return new Intl.DateTimeFormat(localeCode(), {
      weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC'
    }).format(new Date(Date.UTC(2026, 7, 11)));
  }

  function formatHKD(amount) {
    return new Intl.NumberFormat(localeCode(), {
      style: 'currency', currency: 'HKD', currencyDisplay: 'symbol', minimumFractionDigits: 2
    }).format(amount);
  }

  function formatStoredTime(value) {
    const match = /^(\d{1,2}):(\d{2})$/.exec(String(value || ''));
    return match ? formatTime(Number(match[1]) * 60 + Number(match[2])) : ui(value);
  }

  function applyLocale() {
    const english = state.language === 'en';
    document.documentElement.lang = english ? 'en' : 'zh-CN';
    document.title = ui('模拟器');
    const setText = (id, value) => { const element = $(id); if (element) element.textContent = value; };
    setText('stageTitle', ui('模拟器'));
    setText('stageTagline', ui('完成今天的事。相信谁，由你判断。'));
    setText('simulationPill', ui('教学模拟 · 不使用真实账户'));
    setText('lockBriefLabel', english ? 'Today' : '今天');
    setText('lockBriefTitle', ui('两件事需要处理'));
    setText('unlockLabel', english ? 'Swipe up to open' : '向上轻扫以打开');
    setText('todayLabel', english ? 'TODAY' : 'TODAY');
    setText('todayTitle', ui('今日待办'));
    setText('homeTitle', ui('模拟器'));
    setText('stageNoteLine1', ui('通知不等于事实。'));
    setText('stageNoteLine2', ui('从你信任的入口重新开始。'));
    setText('lockDate', formatLocaleDate());
    setText('homeDate', formatLocaleDate());
    if (els.todayCard) els.todayCard.setAttribute('aria-label', ui('打开今日任务'));
    if (els.openTasksShortcut) els.openTasksShortcut.setAttribute('aria-label', ui('打开今日任务'));
    if (els.appBack) els.appBack.setAttribute('aria-label', ui('返回上一页'));
    if (els.appMore) els.appMore.setAttribute('aria-label', ui('更多选项'));
    if (els.systemNavigation) els.systemNavigation.setAttribute('aria-label', ui('系统导航'));
    if (els.systemBack) els.systemBack.setAttribute('aria-label', ui('返回上一页'));
    if (els.systemHome) els.systemHome.setAttribute('aria-label', ui('返回主屏幕'));
    if (els.systemBackLabel) els.systemBackLabel.textContent = ui('返回');
    if (els.systemHomeLabel) els.systemHomeLabel.textContent = ui('主页');
    const stage = document.querySelector('.sim-stage');
    if (stage) stage.setAttribute('aria-label', localized('PolyU 学生生活模拟器', 'PolyU Student Life Simulator'));
    syncSoundButton();
  }

  function formatTime(minutes) {
    const safe = Math.max(0, Math.min(1439, Math.round(minutes)));
    const hours = Math.floor(safe / 60);
    const minute = String(safe % 60).padStart(2, '0');
    if (state.region === 'US') return `${hours % 12 || 12}:${minute} ${hours < 12 ? 'AM' : 'PM'}`;
    return String(hours).padStart(2, '0') + ':' + minute;
  }

  function advanceTime(minutes) {
    state.time = Math.min(17 * 60 + 30, state.time + minutes);
    updateClock();
    saveState();
  }

  function updateClock() {
    const value = formatTime(state.time);
    els.statusTime.textContent = value;
    els.lockTime.textContent = value;
    if (els.lockDate) els.lockDate.textContent = formatLocaleDate();
  }

  function addEvidence(id, label) {
    if (!state.evidence.some((item) => item.id === id)) {
      state.evidence.push({ id, label, time: formatTime(state.time) });
    }
  }

  function addHistory(label, detail) {
    state.history.push({ label, detail, time: formatTime(state.time) });
  }

  function replyIntent(text) {
    const value = String(text || '').toLowerCase();
    return {
      refuse: /(不|不要|不会|不能|拒绝|取消|not\b|won't|will not|can't|cannot|decline|refuse)/i.test(value),
      sensitive: /(密码|验证码|一次性密码|学号|身份证|护照|银行卡|卡号|cvv|password|passcode|otp|student id|passport|card number)/i.test(value),
      payment: /(转账|付款|支付|fps|电子礼券|礼券|购买|pay\b|payment|transfer|voucher|buy)/i.test(value),
      verify: /(核实|确认|查一下|官网|官方|学院|部门|收发室|邮政|polyu|verify|check|official|department|reception|post office)/i.test(value),
      question: /[?？]|(谁|什么|为何|为什么|怎样|怎么|哪|吗|么|who|what|why|how|where|when)/i.test(value)
    };
  }

  function recordFreeReply(channel, id, text, intent) {
    if (intent.sensitive) state.privacyExposure += 1;
    addHistory('free-reply', `${channel === 'mail' ? '邮件' : '短信'}回复 ${id}：${text.slice(0, 80)}`);
  }

  function simulatedReply(channel, id, intent) {
    if (channel === 'message' && id === 'class') {
      if (intent.question || intent.verify) return '我也只看到 PolyULife 的通知，课室是 N003。你可以再看一下 Calendar。';
      return '收到，等下见。';
    }
    if (channel === 'message' && id === 'health') {
      if (intent.verify || intent.refuse) return '客服只能通过短信中的专用页面取消；今天不处理便会开始每月扣费。';
      if (intent.question) return '这是随健康应用试用附送的保障服务，系统显示你的资料已登记。';
      if (intent.sensitive || intent.payment) return '请在取消页面输入银行卡资料，系统会以HK$1验证扣款后关闭自动续费。';
      return '为免开始收费，请尽快使用取消页面。';
    }
    if (channel === 'message' && id === 'market') {
      if (intent.verify || intent.refuse) return '我已经付款了，平台客服说你只差收款验证。不要取消订单，不然钱会卡住。';
      if (intent.question) return '验证页面会显示我的付款记录；你输入银行资料后就能收款。';
      return '麻烦尽快完成验证，我等着取货。';
    }
    if (channel === 'message' && id === 'friend') {
      if (intent.verify || intent.refuse) return state.hijackedFriendVariant === 'real'
        ? '可以，你打我平时个号码啦。我仲喺会议室，未必即刻听到。'
        : '我部电话冇电，打唔到。你直接转俾印刷店同事就得，今晚一定还。';
      if (intent.question) return '就係上次蓝色poster嗰间印刷店，佢哋而家赶住开机。收款名係店员，唔係我。';
      if (intent.payment) return '好呀，转完cap张图俾我，今晚散会即刻还你。';
      return '拜托你先帮我处理啦，大家等紧我呢张单。';
    }
    if (channel === 'message' && id === 'recovery') {
      if (intent.verify || intent.refuse) return '你可以稍后决定；案件编号和资料摘要已经在受理页面，先看清楚再回复。';
      if (intent.question) return '我们负责登记和分流，法律意见会由合作团队另行提供。受理本身暂时不收费。';
      return '资料摘要只保留到今天，请用案件编号进入受理页面。';
    }
    if (channel === 'message' && id === 'lawyer') {
      if (intent.verify || intent.refuse) return '你可以核对电子名片和委托摘要。调查期间请勿联络原收款人，以免资金路径改变。';
      if (intent.question) return '我们会把案件转交调查工作组定位资金；成功前不收律师费，但需要按程序建立保证账户。';
      return '请先打开委托摘要，之后我会安排调查人员与你对接。';
    }
    if (channel === 'message' && id === 'investigator') {
      if (intent.verify || intent.refuse) return '这是联合调查流程，个案资料不能经一般热线核对。你若中断，冻结窗口可能失效。';
      if (intent.sensitive) return '远程协助后我会带你检查银行记录，不用在聊天发送密码。';
      if (intent.payment) return '保证金只是验证资金归属，结案时会连同追回款项退回。';
      return '先打开协助页面，我会逐步提示你完成资金核验。';
    }
    if (channel === 'message') {
      if (intent.refuse || intent.verify) return '系统显示两小时后会退回。请不要致电其他号码，直接使用短信链接处理。';
      if (intent.sensitive) return '请把资料填写到链接页面，不要直接在短信发送。完成后再支付重新处理费。';
      if (intent.question) return '系统只显示地址资料不完整。详情和处理步骤都在上面的链接。';
      if (intent.payment) return '重新处理费为 HK$32。付款后地址才会更新，请尽快完成。';
      return '请在两小时内使用链接更新，否则邮件会自动退回。';
    }
    if (id === 'mail-parcel') {
      if (intent.question || intent.verify || intent.payment) return 'Thanks for checking. Please bring your student ID to Hall Reception before 5:00 PM. We do not collect redelivery fees by text message.';
      return 'Thank you. The document will remain at Hall Reception until 5:00 PM today.';
    }
    if (id === 'mail-event') {
      if (intent.question || intent.verify) return 'Please use the original contact details in the attachment or contact Student Affairs if you need to confirm an identity.';
      return 'Noted. Please confirm this year’s arrangements through the original contact details.';
    }
    if (id === 'mail-research') {
      if (intent.refuse) return 'This opportunity closes today. If you change your mind, complete the onboarding form before 5:00 PM.';
      if (intent.verify) return 'The professor is currently in meetings. There is no need to contact the department; reply here and complete the onboarding form today.';
      if (intent.sensitive) return 'Please enter your student and banking details in the onboarding form so the reimbursement profile can be created.';
      if (intent.payment) return 'Purchase the e-vouchers first and send the receipts here. Reimbursement will be arranged after the project account is activated.';
      return 'Thank you for your interest. Please complete the onboarding form today to reserve the position.';
    }
    if (id === 'mail-career') {
      if (intent.refuse) return 'Understood. Your workspace invitation will expire at the end of today.';
      if (intent.verify) return 'The role is handled by our project team rather than the original employer. The fastest verification is to complete the training workspace.';
      if (intent.sensitive) return 'The workspace needs your mobile number and payment profile before it can release trial-task commission.';
      if (intent.payment) return 'The first task is small and commission is released immediately. Higher-value tasks become available after your account is rated.';
      return 'Thank you. Open the project workspace to begin the 40-minute training and trial task.';
    }
    if (intent.refuse) return 'Your provisional seat will expire at 10:00. No further action will be taken unless payment is received.';
    if (intent.verify) return 'The event desk is busy. The personal FPS account is the fastest way to secure the provisional seat before 10:00.';
    if (intent.sensitive) return 'Please use the payment page and reply with the transaction screenshot and your student number.';
    if (intent.payment) return 'After paying HK$180 by FPS, reply with the screenshot so we can issue the QR ticket.';
    return 'Your seat is still pending. Complete the HK$180 FPS payment before 10:00 to keep it.';
  }

  function sendMessageReply(key, text) {
    const thread = state.messages[key];
    const clean = String(text || '').trim().slice(0, 500);
    if (!thread || !clean) return showToast('信息不能为空');
    const intent = replyIntent(clean);
    thread.items.push({ from: 'mine', time: formatTime(state.time), text: clean });
    state.messageDrafts[key] = '';
    recordFreeReply('message', key, clean, intent);
    advanceTime(1);
    const pendingKey = `message:${key}`;
    pendingReplies.add(pendingKey);
    saveState();
    renderMessageThread(key);
    window.setTimeout(() => {
      pendingReplies.delete(pendingKey);
      thread.items.push({ from: 'them', time: formatTime(state.time), text: simulatedReply('message', key, intent) });
      thread.unread = activeThreadKey !== key;
      saveState();
      if (state.currentApp === 'messages' && activeThreadKey === key) renderMessageThread(key);
      renderHome();
    }, 650);
  }

  function sendMailReply(mail, text) {
    const clean = String(text || '').trim().slice(0, 1200);
    if (!mail || !clean) return showToast('信息不能为空');
    const intent = replyIntent(clean);
    const replies = state.mailReplies[mail.id] || (state.mailReplies[mail.id] = []);
    replies.push({ from: 'mine', time: formatTime(state.time), text: clean });
    state.mailDrafts[mail.id] = '';
    state.openMailComposerId = null;
    recordFreeReply('mail', mail.id, clean, intent);
    advanceTime(2);
    const pendingKey = `mail:${mail.id}`;
    pendingReplies.add(pendingKey);
    saveState();
    renderMailDetail(mail);
    window.setTimeout(() => {
      pendingReplies.delete(pendingKey);
      replies.push({ from: 'them', time: formatTime(state.time), text: simulatedReply('mail', mail.id, intent) });
      saveState();
      if (state.currentApp === 'mail' && activeMailId === mail.id) renderMailDetail(mail);
    }, 850);
  }

  function markNotification(id) {
    const item = state.notifications.find((entry) => entry.id === id);
    if (item) item.unread = false;
  }

  function markAppRead(appId) {
    state.notifications.forEach((item) => {
      if (item.app === appId) item.unread = false;
    });
    if (appId === 'mail') return;
    if (appId === 'phone') state.callLog.forEach((call) => { call.unread = false; });
  }

  function taskDoneCount() {
    return REQUIRED_TASK_IDS.filter((id) => state.taskState[id].status === 'done').length;
  }

  function showScreen(id) {
    [els.lockScreen, els.homeScreen, els.appScreen].forEach((screen) => screen.classList.remove('is-active'));
    $(id).classList.add('is-active');
    if (els.phoneViewport) els.phoneViewport.classList.toggle('is-locked', id === 'lockScreen');
    const unlockedScreen = id !== 'lockScreen';
    if (els.phoneViewport) els.phoneViewport.classList.toggle('has-system-navigation', unlockedScreen);
    if (els.systemNavigation) els.systemNavigation.classList.toggle('is-hidden', !unlockedScreen);
    if (els.systemBack) els.systemBack.disabled = id !== 'appScreen';
    if (els.systemHome) els.systemHome.disabled = !unlockedScreen;
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    els.toast.textContent = ui(message);
    els.toast.classList.add('show');
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2600);
  }

  function appBadge(appId) {
    let count = state.notifications.filter((item) => item.app === appId && item.unread).length;
    if (appId === 'messages') count = Math.max(count, Object.values(state.messages).filter((thread) => thread.unread).length);
    if (appId === 'mail') count = Math.max(count, state.mails.filter((mail) => mail.unread).length);
    if (appId === 'phone') count = Math.max(count, state.callLog.filter((call) => call.unread).length);
    return count;
  }

  function appButton(appId) {
    const app = DATA.apps[appId];
    const badge = appBadge(appId);
    return `
      <button class="app-button" type="button" data-open-app="${app.id}" style="--app-color:${app.color}">
        <span class="app-icon">${app.icon}</span>
        <span>${esc(appName(app.id))}</span>
        ${badge ? `<i class="app-badge">${badge}</i>` : ''}
      </button>`;
  }

  function renderLock() {
    els.lockNotifications.innerHTML = state.notifications.slice(0, 3).map((item) => {
      const app = DATA.apps[item.app];
      return `
        <button class="lock-notification" type="button" data-notification="${item.id}" data-open-app="${item.app}" data-target="${item.target || ''}" style="--app-color:${app.color}">
          <span class="notif-icon">${app.icon}</span>
          <span class="notif-copy"><strong>${esc(ui(item.title))}</strong><span>${esc(ui(item.body))}</span></span>
          <span class="notif-time">${esc(formatStoredTime(item.time))}</span>
        </button>`;
    }).join('');
  }

  function homeTodoItem(title, meta, done) {
    return `
      <div class="home-todo-item ${done ? 'done' : ''}">
        <i aria-hidden="true">${done ? '✓' : ''}</i>
        <span><strong>${esc(ui(title))}</strong><small>${esc(ui(meta))}</small></span>
      </div>`;
  }

  function renderHome() {
    els.appGrid.innerHTML = DATA.gridApps.map(appButton).join('');
    els.appDock.innerHTML = DATA.dockApps.map(appButton).join('');
    const done = taskDoneCount();
    const total = REQUIRED_TASK_IDS.length;
    els.todayProgress.textContent = `${done} / ${total}`;
    els.homeTodoList.innerHTML = [
      homeTodoItem('领取交换申请文件', '宿舍收发室 · 17:00前', state.taskState.parcel.status === 'done'),
      homeTodoItem('核实迎新联系人', '确认“阿杰”的新号码', state.taskState.contact.status === 'done')
    ].join('');
    els.todayProgressBar.style.width = `${Math.round(done / total * 100)}%`;
    updateClock();
    syncSoundButton();
    applyLocale();
  }

  function refreshLocalizedUI() {
    renderLock();
    renderHome();
    if (state.currentApp) {
      const app = DATA.apps[state.currentApp];
      els.appEyebrow.textContent = app.eyebrow;
      els.appTitle.textContent = appName(app.id);
      renderApp(state.currentApp);
    }
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function unlockThreshold() {
    const height = els.lockScreen ? els.lockScreen.getBoundingClientRect().height : 800;
    return Math.min(112, Math.max(84, height * .12));
  }

  function setUnlockVisuals(shift, progress) {
    if (!els.phoneViewport) return;
    const safeProgress = Math.max(0, Math.min(1, progress || 0));
    els.phoneViewport.style.setProperty('--unlock-shift', `${shift || 0}px`);
    els.phoneViewport.style.setProperty('--unlock-progress', String(safeProgress));
    els.phoneViewport.style.setProperty('--unlock-lock-opacity', String(1 - safeProgress * .16));
    els.phoneViewport.style.setProperty('--unlock-home-opacity', String(.18 + safeProgress * .82));
    els.phoneViewport.style.setProperty('--unlock-home-scale', String(.955 + safeProgress * .045));
    if (els.unlockButton) els.unlockButton.dataset.swipeState = safeProgress >= 1 ? 'ready' : (safeProgress > 0 ? 'moving' : 'idle');
  }

  function clearUnlockVisuals() {
    clearTimeout(unlockTransitionTimer);
    unlockTransitionTimer = null;
    if (!els.phoneViewport) return;
    els.phoneViewport.classList.remove('is-unlock-preview', 'is-unlock-dragging', 'is-unlock-returning', 'is-unlocking');
    els.phoneViewport.style.removeProperty('--unlock-shift');
    els.phoneViewport.style.removeProperty('--unlock-progress');
    els.phoneViewport.style.removeProperty('--unlock-lock-opacity');
    els.phoneViewport.style.removeProperty('--unlock-home-opacity');
    els.phoneViewport.style.removeProperty('--unlock-home-scale');
    if (els.homeScreen) els.homeScreen.classList.remove('is-unlock-preview');
    if (els.unlockButton) delete els.unlockButton.dataset.swipeState;
  }

  function resetUnlockGesture() {
    clearTimeout(unlockTransitionTimer);
    unlockTransitionTimer = null;
    const pointerId = unlockGesture.pointerId;
    if (pointerId != null && els.unlockButton && els.unlockButton.hasPointerCapture && els.unlockButton.hasPointerCapture(pointerId)) {
      try { els.unlockButton.releasePointerCapture(pointerId); } catch {}
    }
    unlockGesture = createUnlockGesture();
    clearUnlockVisuals();
  }

  function returnUnlockGesture() {
    const pointerId = unlockGesture.pointerId;
    unlockGesture.active = false;
    unlockGesture.pointerId = null;
    if (pointerId != null && els.unlockButton.hasPointerCapture && els.unlockButton.hasPointerCapture(pointerId)) {
      try { els.unlockButton.releasePointerCapture(pointerId); } catch {}
    }
    els.phoneViewport.classList.remove('is-unlock-dragging', 'is-unlocking');
    els.phoneViewport.classList.add('is-unlock-returning');
    setUnlockVisuals(0, 0);
    const finish = () => {
      if (unlockGesture.finishing) return;
      clearUnlockVisuals();
      unlockGesture = createUnlockGesture();
    };
    if (prefersReducedMotion()) finish();
    else unlockTransitionTimer = setTimeout(finish, 300);
  }

  function finishUnlockGesture() {
    unlockGesture.active = false;
    unlockGesture.finishing = true;
    unlockGesture.pointerId = null;
    ensureAudio();
    playSound('unlock');
    els.phoneViewport.classList.remove('is-unlock-dragging', 'is-unlock-returning');
    els.phoneViewport.classList.add('is-unlocking', 'is-unlock-preview');
    const exitDistance = Math.max(170, els.lockScreen.getBoundingClientRect().height * .2);
    setUnlockVisuals(-exitDistance, 1);
    const finish = () => {
      if (!unlockGesture.finishing) return;
      unlockGesture.finishing = false;
      clearUnlockVisuals();
      unlockGesture = createUnlockGesture();
      unlock(null, null, false);
    };
    if (prefersReducedMotion()) {
      finish();
      return;
    }
    const onTransitionEnd = (event) => {
      if (event.target !== els.lockScreen || event.propertyName !== 'translate') return;
      els.lockScreen.removeEventListener('transitionend', onTransitionEnd);
      finish();
    };
    els.lockScreen.addEventListener('transitionend', onTransitionEnd);
    unlockTransitionTimer = setTimeout(() => {
      els.lockScreen.removeEventListener('transitionend', onTransitionEnd);
      finish();
    }, 320);
  }

  function beginUnlockPointer(event) {
    if (state.unlocked || unlockGesture.active || unlockGesture.finishing) return;
    if (event.isPrimary === false || (event.pointerType === 'mouse' && event.button !== 0)) return;
    clearUnlockVisuals();
    unlockGesture = createUnlockGesture();
    unlockGesture.active = true;
    unlockGesture.pointerId = event.pointerId;
    unlockGesture.startX = event.clientX;
    unlockGesture.startY = event.clientY;
    unlockGesture.lastY = event.clientY;
    unlockGesture.lastTime = event.timeStamp || performance.now();
    setUnlockVisuals(0, 0);
    try { els.unlockButton.setPointerCapture(event.pointerId); } catch {}
    event.preventDefault();
  }

  function moveUnlockPointer(event) {
    if (!unlockGesture.active || event.pointerId !== unlockGesture.pointerId) return;
    const deltaX = event.clientX - unlockGesture.startX;
    const deltaY = event.clientY - unlockGesture.startY;
    const upward = Math.max(0, -deltaY);
    const movement = Math.hypot(deltaX, deltaY);
    const horizontal = Math.abs(deltaX);
    const downward = Math.max(0, deltaY);
    if (!unlockGesture.direction && movement >= 10) {
      if (upward >= 12 && upward > horizontal * 1.1) {
        unlockGesture.direction = 'up';
        els.homeScreen.classList.add('is-unlock-preview');
        els.phoneViewport.classList.add('is-unlock-preview', 'is-unlock-dragging');
      } else if ((horizontal >= 24 && horizontal > upward * 1.35) || downward >= 20) {
        unlockGesture.direction = 'blocked';
      }
    }
    const now = event.timeStamp || performance.now();
    const elapsed = Math.max(1, now - unlockGesture.lastTime);
    const instantVelocity = (unlockGesture.lastY - event.clientY) / elapsed;
    const carriedVelocity = elapsed <= 100 ? unlockGesture.velocity * .65 : 0;
    unlockGesture.velocity = carriedVelocity + instantVelocity * .35;
    unlockGesture.lastY = event.clientY;
    unlockGesture.lastTime = now;
    if (unlockGesture.direction !== 'up') {
      event.preventDefault();
      return;
    }
    const threshold = unlockThreshold();
    const resistedDistance = Math.min(160, Math.min(upward, threshold) + Math.max(0, upward - threshold) * .25);
    unlockGesture.distance = upward;
    setUnlockVisuals(-resistedDistance, upward / threshold);
    event.preventDefault();
  }

  function endUnlockPointer(event, cancelled) {
    if (!unlockGesture.active || event.pointerId !== unlockGesture.pointerId) return;
    const pointerId = unlockGesture.pointerId;
    const now = event.timeStamp || performance.now();
    const freshVelocity = now - unlockGesture.lastTime <= 100 ? unlockGesture.velocity : 0;
    const succeeded = !cancelled && unlockGesture.direction === 'up' && (
      unlockGesture.distance >= unlockThreshold() ||
      (unlockGesture.distance >= 28 && freshVelocity >= .55)
    );
    unlockGesture.active = false;
    unlockGesture.pointerId = null;
    if (els.unlockButton.hasPointerCapture && els.unlockButton.hasPointerCapture(pointerId)) {
      try { els.unlockButton.releasePointerCapture(pointerId); } catch {}
    }
    event.preventDefault();
    if (succeeded) finishUnlockGesture();
    else returnUnlockGesture();
  }

  function unlock(targetApp, target, withSound = true) {
    resetUnlockGesture();
    ensureAudio();
    if (withSound) playSound('unlock');
    state.unlocked = true;
    saveState();
    renderHome();
    showScreen('homeScreen');
    if (targetApp) openApp(targetApp, target);
    if (!state.openingBriefSeen) showOpeningBrief();
  }

  function goHome() {
    state.currentApp = null;
    saveState();
    els.appScreen.classList.remove('polyu-mode');
    els.appScreen.classList.remove('mail-mode');
    delete els.appScreen.dataset.app;
    delete els.appScreen.dataset.mailView;
    closeOverlay();
    renderHome();
    showScreen('homeScreen');
  }

  function navigateBack() {
    if (!state.unlocked) return;
    if (els.overlayLayer.firstElementChild) {
      if (els.overlayLayer.querySelector('.outlook-mail-menu-overlay')) closeMailMessageMenu();
      else if (callSession) minimizeCall();
      else closeOverlay();
      return;
    }
    if (state.currentApp === 'mail' && els.appScreen.dataset.mailView === 'detail') {
      if (state.openMailComposerId) {
        const mail = state.mails.find((item) => item.id === state.openMailComposerId);
        state.openMailComposerId = null;
        saveState();
        if (mail) renderMailDetail(mail);
        return;
      }
      renderMail();
      return;
    }
    if (state.currentApp === 'messages' && els.appContent.querySelector('.conversation')) {
      renderMessages();
      return;
    }
    if (state.currentApp === 'browser' && state.browserPage !== 'home') {
      state.browserPage = 'home';
      saveState();
      renderBrowser();
      return;
    }
    if (state.currentApp === 'polyu' && state.polyuPage !== 'home') {
      state.polyuPage = state.polyuPage === 'event-detail' ? 'calendar' : 'home';
      saveState();
      renderPolyU();
      return;
    }
    goHome();
  }

  function navigateHome() {
    if (!state.unlocked) return;
    if (callSession) minimizeCall();
    goHome();
    renderActiveCallBar();
  }

  function openApp(appId, target) {
    const app = DATA.apps[appId];
    if (!app) return;
    state.currentApp = appId;
    state.polyuPage = appId === 'polyu' ? (state.polyuPage || 'home') : state.polyuPage;
    markAppRead(appId);
    saveState();
    els.appScreen.classList.toggle('polyu-mode', appId === 'polyu');
    els.appScreen.classList.toggle('mail-mode', appId === 'mail');
    els.appScreen.dataset.app = appId;
    if (appId !== 'mail') delete els.appScreen.dataset.mailView;
    els.appEyebrow.textContent = app.eyebrow;
    els.appTitle.textContent = appName(app.id);
    renderApp(appId, target);
    showScreen('appScreen');
    renderHome();
  }

  function renderApp(appId, target) {
    switch (appId) {
      case 'phone': renderPhone(); break;
      case 'messages': renderMessages(target); break;
      case 'mail': renderMail(target); break;
      case 'polyu': renderPolyU(); break;
      case 'browser': renderBrowser(); break;
      case 'contacts': renderContacts(); break;
      case 'bank': renderBank(); break;
      case 'tasks': renderTasks(); break;
      case 'settings': renderSettings(); break;
      default: els.appContent.innerHTML = `<div class="empty-state"><div><strong>${esc(ui('尚未开放'))}</strong><span>${esc(ui('这个应用会在之后的任务中出现。'))}</span></div></div>`;
    }
  }

  function renderPhone() {
    const keypad = state.phoneView === 'keypad';
    const assessedCalls = state.callRecords.filter((record) => record.transcript && record.transcript.length).slice(-4).reverse();
    els.appContent.innerHTML = `
      <div class="app-pad">
        <div class="phone-segmented" role="tablist">
          <button type="button" role="tab" aria-selected="${!keypad}" data-action="phone-view" data-value="recents">${esc(ui('最近通话'))}</button>
          <button type="button" role="tab" aria-selected="${keypad}" data-action="phone-view" data-value="keypad">${esc(ui('拨号键盘'))}</button>
        </div>
        ${keypad ? renderPhoneKeypad() : `
          <div class="list-card phone-recents">
            ${state.callLog.map((call) => `
              <button class="list-row" type="button" data-action="call-number" data-id="${call.id}" data-number="${esc(call.number)}">
                <span class="mini-icon" style="--row-bg:${call.unread ? '#8b2435' : '#dde3e5'};--row-color:${call.unread ? '#fff' : '#4b5963'}">?</span>
                <span class="list-copy"><strong>${esc(ui('未知号码'))}</strong><span>${esc(ui(call.direction))} · ${esc(call.number)}</span></span>
                <span class="list-time">${esc(formatStoredTime(call.time))}</span>
              </button>`).join('')}
          </div>
          ${assessedCalls.length ? `<span class="section-label">${esc(localized('我的暂时判断', 'My assessments'))}</span><div class="list-card call-assessment-list">${assessedCalls.map((record) => {
            const judgement = state.callJudgements[record.id];
            const label = judgement ? callVerdictLabel(judgement.verdict) : localized('尚未判断', 'Not assessed');
            return `<button class="list-row" type="button" data-action="call-review-judgement" data-id="${esc(record.id)}"><span class="mini-icon" style="--row-bg:#2b7f58;--row-color:#fff">?</span><span class="list-copy"><strong>${esc(ui('未知号码'))}</strong><span>${esc(record.number)} · ${esc(label)}</span></span><span class="list-time">›</span></button>`;
          }).join('')}</div>` : ''}`}
      </div>`;
  }

  function callVerdictLabel(verdict) {
    return ({
      trusted: localized('暂时可信', 'Probably trustworthy'),
      suspicious: localized('可疑', 'Suspicious'),
      insufficient: localized('资料不足', 'Not enough information'),
      verify: localized('需要其他渠道确认', 'Verify through another channel')
    })[verdict] || localized('尚未判断', 'Not assessed');
  }

  function renderPhoneKeypad() {
    const keys = [['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'], ['*', ''], ['0', '+'], ['#', '']];
    return `
      <form class="phone-keypad" id="dialForm">
        <label class="sr-only" for="dialNumber">${esc(ui('输入号码'))}</label>
        <div class="dial-display"><input id="dialNumber" name="number" type="tel" inputmode="tel" autocomplete="off" maxlength="24" value="${esc(state.dialNumber)}" placeholder="${esc(ui('输入号码'))}"><button type="button" data-action="dial-delete" aria-label="${esc(ui('删除一位'))}">⌫</button></div>
        <div class="dial-pad">${keys.map(([digit, letters]) => `<button type="button" data-action="dial-key" data-value="${digit}"><strong>${digit}</strong><small>${letters}</small></button>`).join('')}</div>
        <button class="dial-call" type="submit" aria-label="${esc(ui('拨号'))}">${DATA.icons.phone}</button>
      </form>`;
  }

  function normaliseDialNumber(value) {
    return String(value || '').replace(/[^0-9+#*]/g, '').slice(0, 24);
  }

  function placeManualCall(rawNumber) {
    const entered = normaliseDialNumber(rawNumber);
    if (!entered) return;
    state.dialNumber = entered;
    const digits = entered.replace(/\D/g, '');
    const unknown = state.callLog.find((call) => call.id === 'call-unknown');
    if (unknown && digits.endsWith('8704')) {
      saveState();
      startCallback();
      return;
    }
    const contact = state.contacts.find((item) => {
      const lastFour = item.number.replace(/\D/g, '').slice(-4);
      return lastFour && digits.endsWith(lastFour);
    });
    if (contact) {
      saveState();
      callContact(contact.id);
      return;
    }
    state.callLog.unshift({ id: `manual-${Date.now()}`, name: '未知号码', number: entered, time: formatTime(state.time), direction: '呼出', unread: false });
    state.callLog = state.callLog.slice(0, 12);
    addHistory('manual-call', `拨打 ${entered}，暂时无法接通`);
    advanceTime(1);
    saveState();
    showDialog('无法接通', '这个号码暂时无法接通。你可以检查输入、搜索号码，或通过其他渠道联系。', [
      { label: '关闭', action: 'close-overlay', kind: 'primary-action' }
    ]);
  }

  function renderMessages(target) {
    if (target) {
      const targetKey = Object.keys(state.messages).find((key) => state.messages[key].id === target);
      if (targetKey) return renderMessageThread(targetKey);
    }
    activeThreadKey = null;
    els.appContent.innerHTML = `
      <div class="app-pad">
        <span class="section-label">${esc(ui('信息'))}</span>
        <div class="list-card">
          ${Object.values(state.messages).map((thread) => {
            const latest = thread.items[thread.items.length - 1];
            return `
              <button class="list-row" type="button" data-action="open-thread" data-id="${thread.id}">
                <span class="mini-icon" style="--row-bg:${thread.id === 'thread-parcel' ? '#59646e' : '#3479d8'}">${thread.id === 'thread-parcel' ? '?' : esc(thread.sender.slice(0, 2))}</span>
                <span class="list-copy"><strong>${esc(thread.id === 'thread-parcel' ? ui(thread.sender) : thread.sender)}</strong><span>${esc(latest.text)}</span></span>
                ${thread.unread ? '<i class="unread-dot"></i>' : `<span class="list-time">${esc(formatStoredTime(latest.time))}</span>`}
              </button>`;
          }).join('')}
        </div>
      </div>`;
  }

  function renderMessageThread(key) {
    const thread = state.messages[key];
    if (!thread) return renderMessages();
    activeThreadKey = key;
    thread.unread = false;
    if (key === 'recovery') state.taskState.recovery.steps.messageRead = true;
    if (key === 'friend') {
      state.taskState.friend.steps.messageRead = true;
      state.taskState.friend.steps.requestSeen = true;
    }
    if (key === 'lawyer') state.taskState.recovery.steps.lawyerContacted = true;
    if (key === 'investigator') state.taskState.recovery.steps.investigatorContacted = true;
    saveState();
    els.appTitle.textContent = key === 'parcel' ? ui(thread.sender) : thread.sender;
    const pending = pendingReplies.has(`message:${key}`);
    els.appContent.innerHTML = `
      <div class="conversation-shell">
      <div class="conversation" id="messageConversation">
        <div class="conversation-date">${esc(ui('今天'))} · ${esc(thread.number)}</div>
        ${thread.items.map((item) => `<div class="bubble ${item.from === 'mine' ? 'mine' : ''}">${esc(item.text)}<small>${esc(formatStoredTime(item.time))}</small></div>`).join('')}
        ${pending ? `<div class="bubble typing-bubble" aria-label="${esc(ui('正在输入…'))}"><i></i><i></i><i></i></div>` : ''}
        ${key === 'parcel' ? `
          <div class="message-actions">
            <button class="primary-action" type="button" data-action="message-open-link">${esc(ui('打开短信里的页面'))}</button>
            <button class="secondary-action" type="button" data-action="message-copy-tracking">${esc(ui('保存短信运单号'))}</button>
            <button class="secondary-action" type="button" data-action="message-search-domain">${esc(ui('自己搜索这个域名'))}</button>
          </div>` : ''}
        ${key !== 'parcel' ? messageThreadActions(key) : ''}
      </div>
      <form class="message-composer" id="messageReplyForm" data-thread="${esc(key)}">
        <label class="sr-only" for="messageReplyInput">${esc(ui('输入信息'))}</label>
        <textarea id="messageReplyInput" rows="1" maxlength="500" placeholder="${esc(ui('输入信息'))}">${esc(state.messageDrafts[key] || '')}</textarea>
        <button type="submit" aria-label="${esc(ui('发送'))}" ${pending ? 'disabled' : ''}>↑</button>
      </form>
      <p class="composer-privacy-note">${esc(ui('模拟回复只在这台设备中生成，不会联系真实号码或邮箱。'))}</p>
      </div>`;
    requestAnimationFrame(() => {
      const conversation = $('messageConversation');
      if (conversation) conversation.scrollTop = conversation.scrollHeight;
    });
  }

  const MAIL_ICONS = {
    back: '<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>',
    compose: '<svg viewBox="0 0 24 24"><path d="M13.5 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.5"/><path d="m11 13 1.2-4.2L18.8 2.2a1.4 1.4 0 0 1 2 2L14.2 10.8 11 13Z"/></svg>',
    filter: '<svg viewBox="0 0 24 24"><path d="M4 6h16M7 12h10m-7 6h4"/></svg>',
    more: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></svg>',
    moreVertical: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.55"/><circle cx="12" cy="12" r="1.55"/><circle cx="12" cy="19" r="1.55"/></svg>',
    flag: '<svg viewBox="0 0 24 24"><path d="M6 21V4m0 1h10l-1.5 3L17 11H6"/></svg>',
    reply: '<svg viewBox="0 0 24 24"><path d="m10 7-6 5 6 5v-3c5 0 8 1 10 4-1-6-4-9-10-9V7Z"/></svg>',
    forward: '<svg viewBox="0 0 24 24"><path d="m14 7 6 5-6 5v-3c-5 0-8 1-10 4 1-6 4-9 10-9V7Z"/></svg>',
    unread: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/><circle cx="19" cy="5" r="2.2"/></svg>',
    print: '<svg viewBox="0 0 24 24"><path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M7 14h10v7H7z"/></svg>',
    addins: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17.5 14v7M14 17.5h7"/></svg>',
    calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>'
  };

  function mailCopy(mail) {
    const translated = state.mailTranslations[mail.id] === true && mail.translation && mail.language !== state.language;
    return {
      translated: Boolean(translated),
      subject: translated ? mail.translation.subject : mail.subject,
      preview: translated ? mail.translation.preview : mail.preview,
      body: translated ? mail.translation.body : mail.body,
      language: translated ? (mail.language === 'en' ? 'zh-CN' : 'en') : mail.language
    };
  }

  function mailAvatarText(mail) {
    const words = mail.from.replace(/[^A-Za-z\u4e00-\u9fff ]/g, '').trim().split(/\s+/).filter(Boolean);
    return esc((words.length > 1 ? words[0][0] + words[words.length - 1][0] : words[0].slice(0, 2)).toUpperCase());
  }

  function mailAvatarClass(mail) {
    if (mail.id === 'mail-parcel') return 'mail-avatar-teal';
    if (mail.kind === 'research') return 'mail-avatar-violet';
    if (mail.kind === 'event-payment') return 'mail-avatar-orange';
    return 'mail-avatar-blue';
  }

  function mailBottomNav() {
    return `<nav class="outlook-bottom-nav" aria-label="${esc(ui('邮箱'))}">
      <button class="active" type="button" data-action="mail-inbox">${MAIL_ICONS.mail}<span>${esc(ui('邮箱'))}</span></button>
      <button type="button" data-action="mail-calendar">${MAIL_ICONS.calendar}<span>${esc(ui('日历'))}</span></button>
      <button type="button" data-action="mail-search">${DATA.icons.search}<span>${esc(ui('搜索'))}</span></button>
    </nav>`;
  }

  function renderMail(target) {
    if (target) {
      const mail = state.mails.find((item) => item.id === target);
      if (mail) return renderMailDetail(mail);
    }
    activeMailId = null;
    state.openMailComposerId = null;
    els.appTitle.textContent = appName('mail');
    els.appScreen.dataset.mailView = 'inbox';
    const activeTab = state.mailTab || 'focused';
    const visibleMails = state.mails.filter((mail) => {
      const inTab = activeTab === 'focused' ? mail.focused !== false : mail.focused === false;
      return inTab && (!state.mailUnreadOnly || mail.unread);
    });
    const focusedUnread = state.mails.filter((mail) => mail.focused !== false && mail.unread).length;
    const otherUnread = state.mails.filter((mail) => mail.focused === false && mail.unread).length;
    els.appContent.innerHTML = `
      <section class="outlook-mail-shell">
        <header class="outlook-mail-header">
          <button class="outlook-account" type="button" data-action="mail-account" aria-label="${esc(ui('个人文件夹'))}">CY</button>
          <div><span>POLYU MAIL</span><strong>${esc(ui('收件箱'))}</strong></div>
          <button class="outlook-compose" type="button" data-action="mail-compose" aria-label="${esc(ui('写邮件'))}">${MAIL_ICONS.compose}</button>
        </header>
        <div class="outlook-inbox-controls">
          <div class="outlook-tabs" role="tablist">
            <button class="${activeTab === 'focused' ? 'active' : ''}" type="button" role="tab" aria-selected="${activeTab === 'focused'}" data-action="mail-tab" data-value="focused">${esc(ui('重点'))}${focusedUnread ? `<i>${focusedUnread}</i>` : ''}</button>
            <button class="${activeTab === 'other' ? 'active' : ''}" type="button" role="tab" aria-selected="${activeTab === 'other'}" data-action="mail-tab" data-value="other">${esc(ui('其他'))}${otherUnread ? `<i>${otherUnread}</i>` : ''}</button>
          </div>
          <button class="outlook-filter ${state.mailUnreadOnly ? 'active' : ''}" type="button" data-action="mail-filter" aria-pressed="${state.mailUnreadOnly}">${MAIL_ICONS.filter}<span>${esc(ui(state.mailUnreadOnly ? '仅未读' : '筛选'))}</span></button>
        </div>
        <div class="outlook-mail-list">
          <span class="outlook-day-label">${esc(ui('今天'))}</span>
          ${visibleMails.length ? visibleMails.map((mail) => {
            const translated = mailCopy(mail).translated;
            return `<button class="outlook-mail-row ${mail.unread ? 'unread' : ''}" type="button" data-action="open-mail" data-id="${mail.id}">
              <span class="outlook-avatar ${mailAvatarClass(mail)}" aria-hidden="true">${mailAvatarText(mail)}</span>
              <span class="outlook-row-copy">
                <span class="outlook-row-top"><strong>${esc(mail.from)}</strong><time>${esc(formatStoredTime(mail.time))}</time></span>
                <b>${esc(mail.subject)}</b>
                <small>${esc(mail.preview)}</small>
              </span>
              ${mail.unread ? '<i class="outlook-unread-dot" aria-label="' + esc(ui('未读邮件')) + '"></i>' : ''}
              ${translated ? '<span class="outlook-language-mark" aria-hidden="true">A/文</span>' : ''}
            </button>`;
          }).join('') : `<div class="outlook-empty"><strong>${esc(ui('暂时没有邮件'))}</strong><span>${esc(ui('切换到另一个分类查看其余邮件。'))}</span></div>`}
        </div>
        ${mailBottomNav()}
      </section>`;
  }

  function mailTranslationStatus(mail, translated) {
    if (!translated) return '';
    const translatedLabel = mail.language === 'en' ? '已翻译为简体中文' : '已翻译为英语';
    return `<div class="outlook-translation-status" aria-live="polite">
      <span class="outlook-translate-icon" aria-hidden="true">A<span>文</span></span>
      <div><strong>${esc(ui(translatedLabel))}</strong><small>${esc(ui('从发件人菜单可查看原文'))}</small></div>
    </div>`;
  }

  function setMailMenuBackgroundInert(inert) {
    els.appScreen.inert = inert;
    const statusBar = document.querySelector('.phone-status');
    if (statusBar) statusBar.inert = inert;
  }

  function closeMailMessageMenu(restoreFocus = true) {
    const returnFocus = mailMenuReturnFocus;
    els.overlayLayer.innerHTML = '';
    els.overlayLayer.setAttribute('aria-live', 'assertive');
    setMailMenuBackgroundInert(false);
    mailMenuReturnFocus = null;
    if (!restoreFocus || !returnFocus) return;
    const fallback = els.appContent.querySelector(`.outlook-sender-more[data-id="${returnFocus.mailId}"]`);
    const savedTrigger = returnFocus.element && returnFocus.element.matches && returnFocus.element.matches('.outlook-sender-more');
    const focusTarget = savedTrigger && returnFocus.element.isConnected ? returnFocus.element : fallback;
    if (focusTarget) focusTarget.focus();
  }

  function showMailMessageMenu(mail) {
    const copy = mailCopy(mail);
    const canTranslate = Boolean(mail.translation) && (mail.language !== state.language || copy.translated);
    mailMenuReturnFocus = { element: document.activeElement, mailId: mail.id };
    els.overlayLayer.setAttribute('aria-live', 'off');
    setMailMenuBackgroundInert(true);
    const reactions = ['👍', '❤️', '🎉', '😂', '😮', '😢'].map((emoji) => `<button class="outlook-reaction" type="button" data-action="mail-react" data-reaction="${emoji}" aria-label="${esc(localized(`添加 ${emoji} 反应`, `React with ${emoji}`))}">${emoji}</button>`).join('');
    const translationButton = canTranslate
      ? `<button class="outlook-addin-button outlook-translate-addin" type="button" data-action="mail-toggle-translation" data-id="${mail.id}"><span class="outlook-addin-icon" aria-hidden="true">A<small>文</small></span><span>${esc(ui(copy.translated ? '查看原文' : '翻译邮件'))}</span></button>`
      : `<button class="outlook-addin-button outlook-translate-addin" type="button" disabled><span class="outlook-addin-icon" aria-hidden="true">A<small>文</small></span><span>${esc(ui('翻译邮件'))}</span></button>`;
    els.overlayLayer.innerHTML = `
      <div class="outlook-mail-menu-overlay">
        <button class="outlook-mail-menu-scrim" type="button" data-action="mail-menu-close" aria-label="${esc(ui('关闭邮件操作'))}"></button>
        <section class="outlook-mail-menu-sheet" role="dialog" aria-modal="true" aria-labelledby="outlookMailMenuTitle">
          <span class="outlook-sheet-handle" aria-hidden="true"></span>
          <h2 class="sr-only" id="outlookMailMenuTitle">${esc(ui('邮件操作'))}</h2>
          <div class="outlook-reactions" role="group" aria-label="${esc(localized('邮件反应', 'Message reactions'))}">${reactions}</div>
          <div class="outlook-menu-list">
            <button type="button" data-action="mail-mark-unread" data-id="${mail.id}">${MAIL_ICONS.unread}<span>${esc(ui('标记为未读'))}</span></button>
            <button type="button" data-action="mail-flag" data-id="${mail.id}">${MAIL_ICONS.flag}<span>${esc(ui('邮件已标记'))}</span></button>
            <button type="button" data-action="mail-reply" data-id="${mail.id}">${MAIL_ICONS.reply}<span>${esc(ui('回复'))}</span></button>
            <button type="button" data-action="mail-forward" data-id="${mail.id}">${MAIL_ICONS.forward}<span>${esc(ui('转发'))}</span></button>
            <button type="button" data-action="mail-print" data-id="${mail.id}">${MAIL_ICONS.print}<span>${esc(ui('打印'))}</span></button>
          </div>
          <div class="outlook-addins" aria-label="${esc(localized('加载项', 'Add-ins'))}">
            ${translationButton}
            <button class="outlook-addin-button" type="button" data-action="mail-more-addins">${MAIL_ICONS.addins}<span>${esc(ui('更多加载项'))}</span></button>
          </div>
          <button class="outlook-menu-cancel" type="button" data-action="mail-menu-close">${esc(ui('取消'))}</button>
        </section>
      </div>`;
    const firstAction = els.overlayLayer.querySelector('[data-action="mail-mark-unread"]');
    if (firstAction) firstAction.focus();
  }

  function renderMailDetail(mail) {
    activeMailId = mail.id;
    mail.unread = false;
    if (mail.id === 'mail-parcel') state.taskState.parcel.steps.noticeRead = true;
    if (mail.id === 'mail-research') state.taskState.research.steps.invitationRead = true;
    if (mail.id === 'mail-career') state.taskState.career.steps.invitationRead = true;
    if (mail.id === 'mail-event-fee') {
      state.taskState.event.steps.paymentMailRead = true;
      if (state.taskState.event.steps.officialEventOpened) state.taskState.event.steps.feeCompared = true;
    }
    saveState();
    const copy = mailCopy(mail);
    const replies = state.mailReplies[mail.id] || [];
    const composerOpen = state.openMailComposerId === mail.id;
    const replyPending = pendingReplies.has(`mail:${mail.id}`);
    els.appTitle.textContent = ui('邮件详情');
    els.appScreen.dataset.mailView = 'detail';
    els.appContent.innerHTML = `
      <section class="outlook-read-shell">
        <header class="outlook-read-toolbar">
          <button type="button" data-action="mail-inbox" aria-label="${esc(ui('收件箱'))}">${MAIL_ICONS.back}</button>
          <span></span>
        </header>
        <article class="outlook-message">
          <h1>${esc(copy.subject)}</h1>
          <div class="outlook-sender-row">
            <span class="outlook-avatar ${mailAvatarClass(mail)}" aria-hidden="true">${mailAvatarText(mail)}</span>
            <div class="outlook-sender-copy"><strong>${esc(mail.from)}</strong><span class="outlook-recipient">${esc(ui('收件人：你'))}</span><span class="outlook-address">${esc(mail.address)}</span></div>
            <time>${esc(formatStoredTime(mail.time))}</time>
            <button class="outlook-sender-more" type="button" data-action="mail-message-menu" data-id="${mail.id}" aria-label="${esc(ui('更多邮件操作'))}" aria-haspopup="dialog">${MAIL_ICONS.moreVertical}</button>
          </div>
          ${mailTranslationStatus(mail, copy.translated)}
          <div class="outlook-message-body" lang="${esc(copy.language)}"><p>${esc(copy.body)}</p></div>
          ${mail.tracking ? `<div class="outlook-tracking"><span>${esc(ui('运单号'))}</span><strong>${esc(mail.tracking)}</strong></div>` : ''}
          <div class="outlook-message-actions action-row"><span class="outlook-simulation-label">${esc(localized('核验后再行动', 'Verify before acting'))}</span>${mailActions(mail)}</div>
          ${replies.length || replyPending ? `<section class="outlook-reply-thread" aria-label="${esc(ui('回复'))}">
            ${replies.map((reply) => `<article class="outlook-reply-item ${reply.from === 'mine' ? 'mine' : ''}"><header><strong>${esc(reply.from === 'mine' ? localized('你', 'You') : mail.from)}</strong><time>${esc(formatStoredTime(reply.time))}</time></header><p>${esc(reply.text)}</p></article>`).join('')}
            ${replyPending ? `<div class="outlook-reply-wait"><i></i><i></i><i></i><span>${esc(ui('正在输入…'))}</span></div>` : ''}
          </section>` : ''}
          ${composerOpen ? `<form class="outlook-inline-composer" id="mailReplyForm" data-mail="${esc(mail.id)}">
            <header><span>${MAIL_ICONS.reply}</span><strong>${esc(ui('回复内容'))}</strong><button type="button" data-action="mail-discard" data-id="${esc(mail.id)}" aria-label="${esc(ui('放弃草稿'))}">×</button></header>
            <textarea id="mailReplyInput" rows="5" maxlength="1200" placeholder="${esc(localized('写下你的回复…', 'Write your reply…'))}">${esc(state.mailDrafts[mail.id] || '')}</textarea>
            <footer><span>${esc(ui('模拟回复只在这台设备中生成，不会联系真实号码或邮箱。'))}</span><button type="submit">${esc(ui('发送回复'))}</button></footer>
          </form>` : ''}
        </article>
        <nav class="outlook-reply-bar">
          <button class="outlook-reply-primary" type="button" data-action="mail-reply" data-id="${mail.id}">${MAIL_ICONS.reply}<span>${esc(ui('回复'))}</span></button>
          <button type="button" data-action="mail-forward" data-id="${mail.id}" aria-label="${esc(ui('转发'))}">${MAIL_ICONS.forward}</button>
          <button type="button" data-action="mail-flag" data-id="${mail.id}" aria-label="${esc(ui('邮件已标记'))}">${MAIL_ICONS.flag}</button>
        </nav>
      </section>`;
    if (composerOpen || replies.length || replyPending) {
      requestAnimationFrame(() => {
        const message = els.appContent.querySelector('.outlook-message');
        if (message) message.scrollTop = message.scrollHeight;
      });
    }
  }

  function mailActions(mail) {
    if (mail.tracking) return `<button class="primary-action" type="button" data-action="mail-save-tracking">${esc(ui('保存完整运单号'))}</button>`;
    if (mail.kind === 'research') return `<button class="primary-action" type="button" data-action="research-open-link">${esc(ui('打开 onboarding form'))}</button>`;
    if (mail.kind === 'career') return `<button class="primary-action" type="button" data-action="career-open-workspace">${esc(ui('打开项目工作台'))}</button>`;
    if (mail.kind === 'event-payment') return `<button class="primary-action" type="button" data-action="event-open-payment">${esc(ui('查看付款页面'))}</button>`;
    return `<button class="secondary-action" type="button" data-action="open-contacts">${esc(ui('查看相关联系人'))}</button>`;
  }

  const POLYU_ICONS = {
    home: '<svg viewBox="0 0 24 24"><path d="m3 11 9-8 9 8v9h-6v-6H9v6H3v-9Z"/></svg>',
    calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18M7 14h3m-3 3h3m4-3h3"/></svg>',
    qr: '<svg viewBox="0 0 24 24"><path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm11 0h2v2h-2zm3 0h2v5h-2zm-3 4h2v2h-2z"/></svg>',
    notice: '<svg viewBox="0 0 24 24"><path d="M4 5h16v12H9l-4 3v-3H4V5Z"/></svg>',
    more: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 17h8M8 7h8M8 12h8"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4 6h1M4 12h1M4 18h1"/></svg>',
    week: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 9v12m5-12v12m5-12v12"/></svg>'
  };

  function polyuBottomNav(active) {
    const items = [
      ['home', 'Home', 'polyu-home'],
      ['calendar', 'Calendar', 'polyu-calendar'],
      ['qr', '扫码', 'polyu-qr'],
      ['notice', 'Notification', 'polyu-notifications'],
      ['more', 'More', 'polyu-more']
    ];
    return `<nav class="polyu-bottom-nav" aria-label="PolyULife导航">${items.map(([id, label, action]) => `
      <button class="${active === id ? 'active' : ''} ${id === 'qr' ? 'qr-main' : ''}" type="button" data-action="${action}">
        <i>${POLYU_ICONS[id]}</i><span>${esc(label)}</span>
      </button>`).join('')}</nav>`;
  }

  function polyuShell(content, active) {
    return `
      <div class="polyu-app">
        <div class="polyu-sim-strip">教学模拟 · 不连接真实PolyU账户或NetID</div>
        <div class="polyu-scroll">${content}</div>
        ${polyuBottomNav(active)}
      </div>`;
  }

  function renderPolyU() {
    const page = state.polyuPage || 'home';
    if (page === 'calendar') return renderPolyUCalendar();
    if (page === 'notifications') return renderPolyUNotifications();
    if (page === 'qr') return renderPolyUQR();
    if (page === 'more') return renderPolyUMore();
    if (page === 'event-detail') return renderPolyUEventDetail();
    renderPolyUHome();
  }

  function renderPolyUHome() {
    els.appContent.innerHTML = polyuShell(`
      <header class="polyu-topbar">
        <button type="button" data-action="polyu-menu" aria-label="菜单">${POLYU_ICONS.menu}</button>
        <strong>Hi, Yutian</strong>
        <button type="button" data-action="polyu-search" aria-label="搜索">${POLYU_ICONS.search}</button>
      </header>
      <section class="polyu-overview">
        <div class="polyu-week-card"><strong>Week</strong><div class="week-ring"><span>12</span></div><small>Semester 1</small></div>
        <button class="polyu-today-event" type="button" data-action="polyu-notice">
          <strong>Event</strong><div><i>Today</i><span>AUG</span><b>11</b><small>10:30 · COMP2033</small></div>
          <footer><span>M</span><b>TUE</b><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></footer>
        </button>
      </section>
      <section class="polyu-home-section">
        <header><h2>My Class <i>1</i></h2><button type="button" data-action="polyu-timetable" aria-label="查看课表">›</button></header>
        <button class="polyu-class-card" type="button" data-action="polyu-notice">
          <span>10:30–12:30</span><strong>COMP2033 · Software Development</strong><small>课堂更改至 N003</small>
        </button>
      </section>
      <section class="polyu-home-section exam-section">
        <header><h2>My Exam <i>2</i></h2></header>
        <div class="polyu-exam-track">
          <article><b>DEC 09, 2026</b><span>12:30–14:30</span><span>SH1</span><p>Software Development</p><strong>COMP2033</strong></article>
          <article><b>DEC 14, 2026</b><span>09:00–11:00</span><span>Z211</span><p>Data Communication</p><strong>COMP2322</strong></article>
        </div>
      </section>
      <section class="polyu-home-section polyu-student-event">
        <header><h2>Student Event <i>1</i></h2><button type="button" data-action="event-open-detail" aria-label="查看活动">›</button></header>
        <button class="polyu-class-card" type="button" data-action="event-open-detail">
          <span>FRI · AUG 14 · 18:30</span><strong>Student Innovation Night</strong><small>Jockey Club Auditorium · Official fee HK$60</small>
        </button>
      </section>
      <section class="polyu-services" aria-label="校园服务">
        <button type="button" data-action="polyu-map"><i>⌖</i><span>Map</span></button>
        <button type="button" data-action="polyu-room"><i>▥</i><span>Room</span></button>
        <button type="button" data-action="polyu-food"><i>≋</i><span>Food</span></button>
        <button type="button" data-action="polyu-more"><i>▦</i><span>Apps</span></button>
        <button type="button" data-action="polyu-progress"><i>☷</i><span>Study progress</span></button>
      </section>`, 'home');
  }

  function polyuCalendarHeader(view) {
    const titles = {
      month: ['August', '2026–27 Semester 1'],
      list: ['Events', 'Show History'],
      week: ['Week 12', 'Aug · 2026–27 Semester 1']
    };
    const [title, subtitle] = titles[view];
    return `
      <header class="polyu-calendar-head">
        <div><strong>${title}</strong><span>${subtitle}</span></div>
        <div class="polyu-view-switch" aria-label="日历视图">
          <button class="${view === 'month' ? 'active' : ''}" type="button" data-action="polyu-calendar-view" data-view="month" aria-label="月历">${POLYU_ICONS.calendar}</button>
          <button class="${view === 'list' ? 'active' : ''}" type="button" data-action="polyu-calendar-view" data-view="list" aria-label="事件列表">${POLYU_ICONS.list}</button>
          <button class="${view === 'week' ? 'active' : ''}" type="button" data-action="polyu-calendar-view" data-view="week" aria-label="周课表">${POLYU_ICONS.week}</button>
        </div>
      </header>`;
  }

  function renderPolyUCalendar() {
    const view = state.polyuCalendarView || 'month';
    let content = polyuCalendarHeader(view);
    if (view === 'list') content += polyuEventList();
    else if (view === 'week') content += polyuWeekView();
    else content += polyuMonthView();
    els.appContent.innerHTML = polyuShell(content, 'calendar');
  }

  function polyuMonthView() {
    const days = [27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6];
    return `
      <section class="polyu-month-card">
        <div class="polyu-weekdays">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day) => `<span>${day}</span>`).join('')}</div>
        <div class="polyu-month-days">${days.map((day, index) => `<button type="button" class="${index < 5 || index > 35 ? 'other' : ''} ${index === 15 ? 'selected' : ''} ${(index === 10 || index === 15 || index === 30) ? 'has-event' : ''}" data-action="${index === 15 ? 'polyu-notice' : 'polyu-date'}">${day}</button>`).join('')}</div>
      </section>
      <section class="polyu-selected-day">
        <header><div><strong>Tuesday, August 11</strong><span>Class&nbsp; | &nbsp;Exam&nbsp; | &nbsp;Payment&nbsp; | &nbsp;Acad calendar</span></div><button type="button" data-action="polyu-filter" aria-label="筛选">▽</button></header>
        <button class="polyu-day-event" type="button" data-action="polyu-notice"><i>10:30</i><span><strong>COMP2033 课堂更改</strong><small>N003 · 官方通知</small></span><b>›</b></button>
      </section>`;
  }

  function polyuEventList() {
    return `
      <section class="polyu-event-list">
        <div class="event-filter-row"><span>Class&nbsp; | &nbsp;Exam&nbsp; | &nbsp;Payment&nbsp; | &nbsp;Acad calendar</span><button type="button" data-action="polyu-filter">▽</button></div>
        <h3>August, 2026</h3>
        <button class="polyu-event-row class-event" type="button" data-action="polyu-notice"><time><span>Tue</span><b>11</b></time><div><strong>COMP2033 classroom changed</strong><small>10:30 · N003</small></div></button>
        <button class="polyu-event-row class-event" type="button" data-action="event-open-detail"><time><span>Fri</span><b>14</b></time><div><strong>Student Innovation Night</strong><small>18:30 · Jockey Club Auditorium · HK$60</small></div></button>
        <button class="polyu-event-row" type="button" data-action="polyu-calendar-info"><time><span>Sun</span><b>30</b></time><div><strong>Academic Year 2025/26 ends</strong></div></button>
        <h3>September, 2026</h3>
        <button class="polyu-event-row holiday" type="button" data-action="polyu-calendar-info"><time><span>Sat</span><b>26</b></time><div><strong>The day following the Chinese Mid-Autumn Festival</strong><small>中秋節翌日</small></div></button>
        <h3>October, 2026</h3>
        <button class="polyu-event-row holiday" type="button" data-action="polyu-calendar-info"><time><span>Thu</span><b>01</b></time><div><strong>National Day</strong><small>國慶日</small></div></button>
      </section>`;
  }

  function polyuWeekView() {
    return `
      <section class="polyu-week-view">
        <div class="week-selector"><span>2025–26 Sem 3<br><small>Week 11</small></span><strong>2026–27 Sem 1<br><small>Week 12</small></strong><span>Week 13</span></div>
        <div class="timetable-scroll">
          <div class="timetable-grid">
            <div class="timetable-days"><span></span><b>Mon<br>10</b><b>Tue<br>11</b><b>Wed<br>12</b><b>Thu<br>13</b><b>Fri<br>14</b></div>
            <div class="time-labels"><span>08:30</span><span>09:30</span><span>10:30</span><span>11:30</span><span>12:30</span><span>13:30</span><span>14:30</span><span>15:30</span></div>
            <button class="course-block course-a" type="button" data-action="polyu-notice"><b>COMP2033</b><span>LEC001</span><small>N003</small></button>
            <button class="course-block course-b" type="button" data-action="polyu-calendar-info"><b>CLC1104P</b><span>SEM003</span><small>BC305</small></button>
            <button class="course-block course-c" type="button" data-action="polyu-calendar-info"><b>AMA2111</b><span>TUT004</span><small>QR504</small></button>
          </div>
        </div>
      </section>`;
  }

  function renderPolyUNotifications() {
    els.appContent.innerHTML = polyuShell(`
      <header class="polyu-simple-head"><strong>Notification</strong><span>3 unread</span></header>
      <section class="polyu-notice-list">
        <button type="button" data-action="polyu-notice"><i>Class</i><div><strong>COMP2033 classroom changed</strong><p>Today 10:30 class has moved to N003.</p><small>08:30</small></div></button>
        <button type="button" data-action="event-open-detail"><i>Event</i><div><strong>Student Innovation Night</strong><p>Registration is open. Official fee: HK$60 in PolyULife.</p><small>08:40</small></div></button>
        <button type="button" data-action="polyu-payment"><i>Pay</i><div><strong>No outstanding payment</strong><p>Your current eStudent balance is HK$0.</p><small>Yesterday</small></div></button>
        <button type="button" data-action="polyu-calendar"><i>Acad</i><div><strong>Semester calendar updated</strong><p>Week 12 events are available.</p><small>Aug 10</small></div></button>
      </section>`, 'notice');
  }

  function renderPolyUQR() {
    els.appContent.innerHTML = polyuShell(`
      <header class="polyu-simple-head"><strong>Campus QR</strong><span>Simulation only</span></header>
      <section class="polyu-qr-page"><div class="fake-qr" aria-label="模拟二维码"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><h2>Student access</h2><p>本教学模拟不会读取真实学生身份或启动摄像头。</p></section>`, 'qr');
  }

  function renderPolyUEventDetail() {
    const task = state.taskState.event;
    task.steps.officialEventOpened = true;
    if (task.steps.paymentMailRead) task.steps.feeCompared = true;
    addEvidence('official-event', '从 PolyULife 确认创新之夜日期、地点及官方费用 HK$60');
    if (task.steps.feeCompared) addEvidence('event-fee-compare', '对比邮件 HK$180 私人FPS与官方 HK$60 应用内付款');
    saveState();
    els.appContent.innerHTML = polyuShell(`
      <header class="polyu-simple-head"><strong>Student Event</strong><span>Official listing</span></header>
      <section class="polyu-event-detail">
        <span class="official-chip">POLYULIFE REGISTRATION</span>
        <h1>Student Innovation Night</h1>
        <p>Meet student founders, researchers and alumni working on campus innovation projects.</p>
        <dl class="event-facts">
          <dt>Date</dt><dd>Friday, August 14 · 18:30–21:00</dd>
          <dt>Venue</dt><dd>Jockey Club Auditorium</dd>
          <dt>Fee</dt><dd><strong>HK$60</strong></dd>
          <dt>Payment</dt><dd>Only inside PolyULife registration</dd>
        </dl>
        ${task.decision === 'skip' ? '<div class="decision-note">你已查看资料，并决定暂时不参加。之后仍可改变决定。</div>' : ''}
        <div class="action-row">
          ${task.steps.registered ? '<button class="primary-action" type="button" disabled>已报名 · QR ticket issued</button>' : '<button class="primary-action" type="button" data-action="event-register-official">我想参加 · 支付 HK$60</button><button class="secondary-action" type="button" data-action="event-skip-official">这次不参加</button>'}
          <button class="secondary-action" type="button" data-action="polyu-calendar">返回日历</button>
        </div>
      </section>`, 'calendar');
  }

  function renderPolyUMore() {
    els.appContent.innerHTML = polyuShell(`
      <header class="polyu-simple-head"><strong>More</strong><span>Campus services</span></header>
      <section class="polyu-more-grid">
        <button type="button" data-action="polyu-map"><i>⌖</i><strong>Campus Map</strong><span>Buildings and rooms</span></button>
        <button type="button" data-action="polyu-payment"><i>$</i><strong>eStudent</strong><span>Payment record</span></button>
        <button type="button" data-action="polyu-library"><i>▤</i><strong>Library</strong><span>Loans and booking</span></button>
        <button type="button" data-action="polyu-job"><i>◇</i><strong>Job Board</strong><span>Student opportunities</span></button>
      </section>`, 'more');
  }

  function renderBrowser() {
    if (state.browserPage !== 'home') return renderBrowserPage(state.browserPage);
    els.appContent.innerHTML = `
      <form class="browser-search" id="browserSearchForm">
        <input id="browserQuery" type="search" value="${esc(state.browserQuery)}" placeholder="${esc(ui('搜索网址、号码或机构'))}" autocomplete="off">
        <button type="submit" aria-label="${esc(ui('搜索'))}">${DATA.icons.search}</button>
      </form>
      <div class="browser-results" id="browserResults">${browserResultsHTML(state.browserQuery)}</div>`;
  }

  function browserResultsHTML(query) {
    const q = String(query || '').trim();
    if (!q) {
      return `
        <span class="section-label">${esc(ui('常用入口'))}</span>
        ${browserCard('www.polyu.edu.hk', 'PolyU 官方网站', '校园服务、学生资讯与官方联系方式。', 'polyu-official')}
        ${browserCard('www.polyu.edu.hk/staff', 'PolyU 教职员目录', '从学校域名核实教职员、电邮与部门电话。', 'staff-directory')}
        ${browserCard('www.hongkongpost.hk', '香港邮政', '邮件追踪及邮政服务。', 'post-official')}
        ${browserCard('www.cyberdefender.hk', '防骗视伏器 Scameter', '检查可疑网址、电话及账户。', 'scameter')}`;
    }
    if (/8704|6\s*x{2,}\s*8704|\+?852.*8704/i.test(q)) {
      return `
        <span class="section-label">${esc(ui('号码查询'))} · ${esc(q)}</span>
        ${browserCard('www.cyberdefender.hk', '防骗视伏器 Scameter', '该号码暂无公开记录。查无记录不代表身份真实。', 'scameter')}
        ${browserCard('本机联系人', '搜索已保存联系人', '没有联系人使用这个完整号码；可比较号码尾号，或联系共同认识的人。', 'contacts-search')}`;
    }
    if (/@|outlook\.example|campus-mail\.example|polyu\.edu\.hk/i.test(q)) {
      return `
        <span class="section-label">${esc(ui('邮箱与域名查询'))} · ${esc(q)}</span>
        ${browserCard('www.polyu.edu.hk/staff', 'PolyU 教职员目录', '通过学校域名重新查找教职员邮箱和部门电话。', 'staff-directory')}
        ${browserCard('www.cyberdefender.hk', '域名与账户查询', '比较发件域名、跳转网址与官方机构域名是否一致。', 'scameter')}`;
    }
    if (/prof|chan|research|教授|研究/i.test(q)) {
      return `
        <span class="section-label">${esc(localized(`“${q}”的结果`, `Results for “${q}”`))}</span>
        ${browserCard('www.polyu.edu.hk/staff', 'Professor C. W. Chan · Simulated Staff Directory', '教学模拟中的校内电邮和部门电话。', 'staff-directory')}
        ${browserCard('research-onboarding.example', 'AI Learning Research Onboarding', 'Complete your research assistant onboarding today.', 'research-onboarding', true)}`;
    }
    if (/northbridge|linkedin|job|career|招聘|兼职|助理/i.test(q)) {
      return `<span class="section-label">${esc(localized(`“${q}”的结果`, `Results for “${q}”`))}</span>${browserCard('northbridge-projects.example', 'Northbridge project workspace', 'Remote research tasks, training and instant commission.', 'career-workspace', true)}${browserCard('原招聘平台与公司官网', 'Research and Project Assistant', '职位详情、申请状态与公司公开资料。', 'career-official')}`;
    }
    if (/medical-service|health|ha go|醫療|医疗|自动扣费|自動扣費/i.test(q)) {
      return `<span class="section-label">${esc(localized(`“${q}”的结果`, `Results for “${q}”`))}</span>${browserCard('medical-service-cancel.example', 'Cancel health coverage', 'Enter card details to stop an automatic monthly charge.', 'health-cancel', true)}${browserCard('医疗服务应用', 'My account', 'Subscription and payment history.', 'health-official')}`;
    }
    if (/marketplace|carousell|二手|收款验证|收款驗證/i.test(q)) {
      return `<span class="section-label">${esc(localized(`“${q}”的结果`, `Results for “${q}”`))}</span>${browserCard('marketplace-protection.example', 'Payment protection verification', 'Link your bank account to receive the buyer payment.', 'market-protection', true)}${browserCard('二手交易平台', 'Calculator listing', 'Order details and payment status.', 'market-official')}`;
    }
    if (/adcc|追回|追款|case-recovery|防骗/i.test(q)) {
      return `<span class="section-label">${esc(localized(`“${q}”的结果`, `Results for “${q}”`))}</span>${browserCard('www.adcc.gov.hk', '官方防骗建议', '发生损失后直接从官方入口查证，不通过主动联络者提供的页面。', 'adcc-advice')}${browserCard('case-recovery-centre.example', 'Emergency fund recovery', 'Create a wallet to recover a reported loss.', 'recovery-portal', true)}`;
    }
    if (/event|innovation|活动|创新/i.test(q)) {
      return `
        <span class="section-label">${esc(localized(`“${q}”的结果`, `Results for “${q}”`))}</span>
        ${browserCard('www.polyu.edu.hk/campus-events', 'Student Innovation Night', 'PolyU campus event · August 14 · Registration in PolyULife.', 'event-official')}
        ${browserCard('student-event-payment.example', 'Innovation Night payment', 'Pay HK$180 now to keep your seat.', 'event-payment', true)}`;
    }
    if (/parcel-update\.example/i.test(q)) {
      return `
        <span class="section-label">${esc(ui('邮箱与域名查询'))} · ${esc(q)}</span>
        ${browserCard('parcel-update.example', '包裹地址更新中心', '短信中的页面要求更新资料并支付重新处理费。', 'fake-post', true)}
        ${browserCard('www.cyberdefender.hk', '查询网址', '查看公开风险记录；即使没有记录，也应比较官方邮政域名。', 'scameter')}
        ${browserCard('www.hongkongpost.hk', '香港邮政', '从独立入口重新开始查询。', 'post-official')}`;
    }
    if (/parcel|post|tracking|包裹|邮政|快递|HKP8234|RR\s*482/i.test(q)) {
      return `
        <span class="section-label">${esc(ui('包裹与邮政查询'))} · ${esc(q)}</span>
        ${browserCard('www.hongkongpost.hk', '香港邮政 · 邮件追踪', '从官方入口查询邮件状态及服务通知。', 'post-official')}
        ${browserCard('parcel-update.example', '包裹地址更新中心', '在线更新地址，避免邮件退回。', 'fake-post', true)}`;
    }
    return `
      <div class="search-empty"><strong>${esc(ui('没有完全匹配的结果'))}</strong><p>${esc(ui('尝试更具体的名称、完整号码、邮箱或域名。'))}</p></div>
      <span class="section-label">${esc(ui('常用入口'))}</span>
      ${browserCard('www.polyu.edu.hk', 'PolyU 官方网站', '校园服务、学生资讯与官方联系方式。', 'polyu-official')}
      ${browserCard('www.cyberdefender.hk', '防骗视伏器 Scameter', '检查可疑网址、电话及账户。', 'scameter')}`;
  }

  function browserCard(domain, title, body, page, sponsored) {
    return `
      <button class="browser-card ${sponsored ? 'sponsored' : ''}" type="button" data-action="open-browser-page" data-page="${page}">
        <span class="browser-domain">${esc(domain)}</span><h3>${esc(ui(title))}</h3><p>${esc(ui(body))}</p>
      </button>`;
  }

  function renderExtendedBrowserPage(page) {
    if (page === 'career-workspace') { renderCareerWorkspace(); return true; }
    const staticPages = {
      'career-official': `<div class="app-pad"><article class="browser-card"><span class="browser-domain">原招聘平台与公司公开资料</span><h2>Research and Project Assistant</h2><p>The original internship is still open and did not refer applicants to Northbridge Talent. The named company does not list a Research and Project Assistant role or any task-purchase onboarding process.</p><div class="action-row"><button class="primary-action" type="button" data-action="career-check-official">${esc(ui('保存查询结果'))}</button></div></article></div>`,
      'health-cancel': `<div class="fake-page"><span class="browser-domain">medical-service-cancel.example</span><div class="fake-logo">+</div><h2>Cancel monthly health coverage</h2><p>Confirm the card used for registration. A temporary HK$1 verification will be reversed after cancellation.</p><div class="fake-fee"><span>Next monthly charge</span><strong>HK$388</strong></div><div class="action-row"><button class="primary-action" type="button" data-action="health-submit-cancel">${esc(ui('确认取消服务'))}</button></div></div>`,
      'health-official': `<div class="app-pad"><article class="browser-card"><span class="browser-domain">教学模拟 · 官方入口说明</span><span class="official-chip">INDEPENDENT CHECK</span><h2>Health app account</h2><p>模拟账户没有任何保障试用、自动续费或待取消项目。官方机构不会要求经陌生短信页面输入银行卡来取消服务。</p><div class="action-row"><button class="primary-action" type="button" data-action="health-save-check">${esc(ui('保存查询结果'))}</button><button class="secondary-action" type="button" data-action="browser-home">${esc(ui('返回搜索'))}</button></div></article></div>`,
      'market-protection': `<div class="fake-page"><span class="browser-domain">marketplace-protection.example</span><div class="fake-logo">M</div><h2>Receive buyer payment</h2><p>The buyer's HK$680 payment is on hold. Link a bank card and enter the verification amount shown in your banking app to release it.</p><div class="fake-fee"><span>Payment to receive</span><strong>HK$680</strong></div><div class="action-row"><button class="primary-action" type="button" data-action="market-submit-verification">${esc(ui('连接银行卡'))}</button></div></div>`,
      'market-official': `<div class="app-pad"><article class="browser-card"><span class="browser-domain">平台内订单</span><h2>Calculator listing</h2><p>No payment has been received. The buyer moved the conversation outside the platform, and the external confirmation page is not part of this order.</p><div class="action-row"><button class="primary-action" type="button" data-action="market-save-check">${esc(ui('保存查询结果'))}</button></div></article></div>`,
      'adcc-advice': `<div class="app-pad"><article class="browser-card"><span class="browser-domain">www.adcc.gov.hk</span><h2>防骗资讯</h2><p>防骗机构不会要求转账、提供网上银行密码或支付“保证金”来追回损失。应从自行查找的官方渠道联络警方和银行，并保留交易及对话记录。</p><div class="action-row"><button class="primary-action" type="button" data-action="recovery-save-official">${esc(ui('保存查询结果'))}</button></div></article></div>`
    };
    if (page === 'recovery-portal') {
      const steps = state.taskState.recovery.steps;
      els.appContent.innerHTML = `<div class="fake-page handoff-page"><span class="browser-domain">claim-assistance.example/intake</span><div class="case-letterhead"><strong>Claim Assistance Desk</strong><small>Case intake summary</small></div>${recoveryHandoff(1)}<h2>案件资料摘要</h2><p>参考编号 CA-${String(state.seed).slice(0, 6).toUpperCase()} · 申报损失 ${esc(formatHKD(state.moneyLost))}。资料显示交易可能仍在分层转移，建议交由合作法律团队评估。</p><dl class="case-summary"><div><dt>状态</dt><dd>等待授权转介</dd></div><div><dt>初步费用</dt><dd>HK$0</dd></div><div><dt>时限</dt><dd>今天 18:00</dd></div></dl><div class="action-row"><button class="primary-action" type="button" data-action="recovery-accept-intake">${esc(ui(steps.intakeAccepted ? '查看律师联络' : '同意转交合作律师'))}</button></div></div>`;
      return true;
    }
    if (page === 'recovery-lawyer') {
      els.appContent.innerHTML = `<div class="fake-page handoff-page"><span class="browser-domain">chow-legal-associates.example/case</span><div class="case-letterhead"><strong>Chow Legal Associates</strong><small>Digital client memorandum</small></div>${recoveryHandoff(2)}<h2>资金追讨委托摘要</h2><p>周律师已接收案件 CA-${String(state.seed).slice(0, 6).toUpperCase()}。前期法律评估不收费；调查工作组会先定位收款路径，再决定是否启动资产冻结申请。</p><dl class="case-summary"><div><dt>负责人</dt><dd>周文轩律师</dd></div><div><dt>保密要求</dt><dd>避免接触涉案账户</dd></div><div><dt>下一步</dt><dd>转交调查工作组</dd></div></dl><div class="action-row"><button class="primary-action" type="button" data-action="recovery-transfer-investigator">${esc(ui('联络调查工作组'))}</button></div></div>`;
      return true;
    }
    if (page === 'recovery-investigator') {
      const steps = state.taskState.recovery.steps;
      els.appContent.innerHTML = `<div class="fake-page handoff-page"><span class="browser-domain">secure-case-assist.example/session</span><div class="case-letterhead"><strong>Secure Case Assist</strong><small>Investigation session · L. Wong</small></div>${recoveryHandoff(3)}<h2>${steps.remoteAccessGranted ? '资金归属核验' : '建立远程核验会话'}</h2><p>${steps.remoteAccessGranted ? '设备协助已连接。为确认申请人有能力接收冻结款项，请建立一个HK$300核验余额；系统结案时会一并退回。' : '调查员会通过屏幕协助核对交易记录。无需在聊天发送密码，但协助期间可查看屏幕上的银行通知和账户资料。'}</p><div class="action-row">${steps.remoteAccessGranted ? `<button class="primary-action" type="button" data-action="recovery-pay-guarantee">${esc(ui('支付可退还保证金'))}</button>` : `<button class="primary-action" type="button" data-action="recovery-grant-remote">${esc(ui('连接远程协助'))}</button>`}</div></div>`;
      return true;
    }
    if (!staticPages[page]) return false;
    els.appContent.innerHTML = staticPages[page];
    return true;
  }

  function recoveryHandoff(stage) {
    return `<div class="handoff-chain" aria-label="${esc(ui('案件转交记录'))}">${[
      ['客服受理', 1], ['法律评估', 2], ['调查协助', 3]
    ].map(([label, index]) => `<span class="${index <= stage ? 'active' : ''}"><i>${index}</i>${esc(ui(label))}</span>`).join('')}</div>`;
  }

  function renderBrowserPage(page) {
    if (renderExtendedBrowserPage(page)) return;
    if (page === 'contacts-search') {
      state.browserPage = 'home';
      saveState();
      openApp('contacts');
      return;
    }
    if (page === 'fake-post') {
      els.appContent.innerHTML = `
        <div class="fake-page">
          <span class="browser-domain">parcel-update.example</span>
          <div class="fake-logo">邮</div>
          <h2>更新配送资料</h2>
          <p>邮件因地址资料不完整而暂缓派送。请确认运单及支付重新处理费用。</p>
          <div class="fake-fee"><span>重新处理费用</span><strong>HK$32.00</strong></div>
          <div class="action-row">
            <button class="primary-action" type="button" data-action="fake-post-proceed">确认地址并付款</button>
          </div>
        </div>`;
      return;
    }
    if (page === 'post-official') {
      const saved = state.taskState.parcel.steps.trackingSaved;
      els.appContent.innerHTML = `
        <div class="app-pad">
          <article class="browser-card">
            <span class="browser-domain">www.hongkongpost.hk</span>
            <h2>邮件追踪</h2>
            <p>${saved ? '运单 RR 482 917 305 HK 已于08:14送达机构收发点。详细领取安排由收发点负责。' : '请输入完整邮件编号。你目前只从短信得到不完整编号 HKP8234。'}</p>
            <div class="action-row">
              ${saved ? `<button class="primary-action" type="button" data-action="save-official-tracking">${esc(ui('保存查询结果'))}</button>` : `<button class="secondary-action" type="button" data-action="open-mail-app">${esc(ui('回邮件查找完整编号'))}</button>`}
              <button class="secondary-action" type="button" data-action="browser-home">${esc(ui('返回搜索'))}</button>
            </div>
          </article>
        </div>`;
      return;
    }
    if (page === 'scameter') {
      els.appContent.innerHTML = `
        <div class="app-pad">
          <article class="browser-card">
            <span class="browser-domain">www.cyberdefender.hk</span>
            <h2>防骗视伏器</h2>
            <p>输入的网址 parcel-update.example 暂无足够记录。没有记录不代表安全，请结合来源、域名和独立渠道判断。</p>
            <div class="action-row"><button class="primary-action" type="button" data-action="save-scameter-result">${esc(ui('保存查询结果'))}</button><button class="secondary-action" type="button" data-action="browser-home">${esc(ui('返回搜索'))}</button></div>
          </article>
        </div>`;
      return;
    }
    if (page === 'research-onboarding') {
      els.appContent.innerHTML = `
        <div class="fake-page">
          <span class="browser-domain">research-onboarding.example</span>
          <div class="fake-logo">RA</div>
          <h2>Research Assistant Onboarding</h2>
          <p>Confirm your student profile, mobile number and availability to join Professor Chan's AI learning project.</p>
          <div class="fake-fee"><span>Hourly pay</span><strong>HK$180</strong></div>
          <div class="action-row"><button class="primary-action" type="button" data-action="research-submit-simulated">${esc(ui('提交学生资料'))}</button></div>
        </div>`;
      return;
    }
    if (page === 'staff-directory') {
      const task = state.taskState.research;
      task.steps.officialProfileFound = true;
      addEvidence('staff-directory', '从 polyu.edu.hk 教职员目录找到教授官方邮箱及部门电话');
      saveState();
      els.appContent.innerHTML = `
        <div class="app-pad"><article class="browser-card official-profile">
          <span class="browser-domain">www.polyu.edu.hk/staff</span>
          <h2>Professor C. W. Chan <small>(simulated profile)</small></h2>
          <p>Department of Applied Learning · Professor</p>
          <dl class="detail-grid"><dt>Email</dt><dd>cw.chan@staff.polyu.example</dd><dt>Office</dt><dd>Department General Office · +852 2XXX 6200</dd></dl>
          <div class="action-row"><button class="primary-action" type="button" data-action="research-contact-official">${esc(ui('拨打部门电话'))}</button></div>
        </article></div>`;
      return;
    }
    if (page === 'event-payment') {
      els.appContent.innerHTML = `
        <div class="fake-page">
          <span class="browser-domain">student-event-payment.example</span>
          <div class="fake-logo">IN</div>
          <h2>Seat payment pending</h2>
          <p>Student Innovation Night · Your provisional seat expires at 10:00.</p>
          <div class="fake-fee"><span>Participation fee</span><strong>HK$180</strong></div>
          <p class="payment-recipient">FPS recipient: IN EVENT SERVICES · Personal account</p>
          <div class="action-row"><button class="primary-action" type="button" data-action="event-pay-fake">${esc(ui('通过 FPS 付款'))}</button></div>
        </div>`;
      return;
    }
    if (page === 'event-official') {
      els.appContent.innerHTML = `
        <div class="app-pad"><article class="browser-card"><span class="browser-domain">www.polyu.edu.hk/campus-events</span><h2>Student Innovation Night</h2><p>Friday, August 14 · Jockey Club Auditorium. Registration and payment are handled inside PolyULife.</p><div class="action-row"><button class="primary-action" type="button" data-action="event-open-polyu">${esc(ui('打开 PolyULife'))}</button></div></article></div>`;
      return;
    }
    els.appContent.innerHTML = `
      <div class="app-pad"><article class="browser-card"><span class="browser-domain">www.polyu.edu.hk</span><h2>${esc(ui('PolyU 官方网站'))}</h2><p>请从已保存的官方入口进入学生服务。教学模拟不会要求输入真实 NetID。</p><div class="action-row"><button class="primary-action" type="button" data-action="open-polyu-app">${esc(ui('打开模拟 PolyULife'))}</button><button class="secondary-action" type="button" data-action="browser-home">${esc(ui('返回搜索'))}</button></div></article></div>`;
  }

  function renderContacts() {
    const query = String(state.contactsQuery || '').trim().toLowerCase();
    const contacts = state.contacts.filter((contact) => !query || `${contact.name} ${contact.note} ${contact.number}`.toLowerCase().includes(query));
    els.appContent.innerHTML = `
      <div class="app-pad">
        <form class="contacts-search" id="contactsSearchForm">
          <label class="sr-only" for="contactsQuery">${esc(ui('搜索联系人'))}</label>
          <span>${DATA.icons.search}</span><input id="contactsQuery" type="search" autocomplete="off" value="${esc(state.contactsQuery)}" placeholder="${esc(ui('搜索联系人'))}">
        </form>
        <span class="section-label">${esc(ui('已保存联系人'))}</span>
        <div class="list-card">
          ${contacts.length ? contacts.map((contact) => `
            <button class="list-row" type="button" data-action="call-contact" data-id="${contact.id}">
              <span class="mini-icon" style="--row-bg:#d58a22">${esc(contact.initials)}</span>
              <span class="list-copy"><strong>${esc(contact.name)}</strong><span>${esc(contact.note)} · ${esc(contact.number)}</span></span>
              <span class="list-time">${esc(ui('拨打'))}</span>
            </button>`).join('') : `<div class="inline-empty">${esc(ui('没有匹配的联系人'))}</div>`}
        </div>
      </div>`;
  }

  function renderBank() {
    els.appContent.innerHTML = `
      <section class="bank-summary"><span>${esc(ui('可用余额'))}</span><strong>${esc(formatHKD(state.balance))}</strong></section>
      <div class="bank-actions">
        <button class="secondary-action" type="button" data-action="freeze-card">${esc(ui(state.cardFrozen ? '银行卡已冻结' : '冻结银行卡'))}</button>
        <button class="secondary-action" type="button" data-action="bank-help">${esc(ui('联系银行'))}</button>
      </div>
      <div class="bank-card"><span class="section-label">${esc(ui('交易记录'))}</span>${state.transactions.map((item) => `<div class="transaction-row"><div><strong>${esc(item.title)}</strong><span>${esc(formatStoredTime(item.time))}</span></div><div class="transaction-amount">${item.amount < 0 ? '−' : '+'}${esc(formatHKD(Math.abs(item.amount)))}</div></div>`).join('')}</div>`;
  }

  function settingsOption(action, value, label, selected) {
    return `
      <button class="settings-option" type="button" role="radio" aria-checked="${selected}" data-action="${action}" data-value="${value}">
        <span class="settings-option-copy"><strong>${esc(ui(label))}</strong></span>
        <span class="settings-check" aria-hidden="true">${selected ? '✓' : ''}</span>
      </button>`;
  }

  function renderSettings() {
    els.appTitle.textContent = appName('settings');
    els.appContent.innerHTML = `
      <div class="app-pad settings-page">
        <section class="settings-profile">
          <span class="settings-hero-icon" aria-hidden="true">${DATA.icons.settings}</span>
          <div><h2>${esc(ui('语言与地区'))}</h2><p>${esc(ui('控制手机界面使用的语言和本地格式。'))}</p></div>
        </section>
        <span class="section-label">${esc(ui('系统语言'))}</span>
        <div class="list-card settings-options" role="radiogroup" aria-label="${esc(ui('系统语言'))}">
          ${settingsOption('set-language', 'zh-CN', '简体中文', state.language === 'zh-CN')}
          ${settingsOption('set-language', 'en', '英语', state.language === 'en')}
        </div>
        <span class="section-label">${esc(ui('国家或地区'))}</span>
        <div class="list-card settings-options" role="radiogroup" aria-label="${esc(ui('国家或地区'))}">
          ${settingsOption('set-region', 'HK', '香港', state.region === 'HK')}
          ${settingsOption('set-region', 'CN', '中国大陆', state.region === 'CN')}
          ${settingsOption('set-region', 'US', '美国', state.region === 'US')}
          ${settingsOption('set-region', 'GB', '英国', state.region === 'GB')}
        </div>
        <span class="section-label">${esc(ui('界面示例'))}</span>
        <section class="settings-preview">
          <strong>${esc(ui('日期与金额预览'))}</strong>
          <div class="settings-preview-row"><span>${esc(formatLocaleDate())}</span><b>${esc(formatTime(state.time))}</b></div>
          <div class="settings-preview-row"><span>HKD</span><b>${esc(formatHKD(6840))}</b></div>
        </section>
        <p class="settings-note">${esc(ui('系统界面会使用所选语言；邮件、短信和通话保留发送者原本的语言。'))}</p>
      </div>`;
  }

  function renderTasks() {
    const parcel = state.taskState.parcel;
    const contact = state.taskState.contact;
    els.appContent.innerHTML = `
      <div class="app-pad">
        <span class="section-label">${esc(ui('截止时间 · 今天17:00'))}</span>
        ${taskPanel('parcel', '领取交换申请文件', '宿舍收发室通知有一份挂号文件等待领取。', parcel.status, [
          ['noticeRead', '查看收发室通知'], ['trackingSaved', '取得完整运单号'], ['hallConfirmed', '向独立渠道确认'], ['collected', '前往收发室领取']
        ], parcel.steps)}
        ${taskPanel('contact', '确认迎新活动联系人', '中午前确认去年联系人阿杰是否能参加筹备。', contact.status, [
          ['strangerSpoken', '回拨未接来电了解来意'], ['oldNumberCalled', '检查原有联系方式'], ['organizerChecked', '向共同联系人核对'], ['resolved', '确认今年联络方式']
        ], contact.steps)}
        <span class="section-label">${esc(ui('已保存的信息'))}</span>
        <div class="list-card">
          ${state.evidence.length ? state.evidence.map((item) => `<div class="list-row"><span class="mini-icon" style="--row-bg:#238278">✓</span><span class="list-copy"><strong>${esc(ui(item.label))}</strong><span>${esc(formatStoredTime(item.time))} · ${esc(ui('保存'))}</span></span></div>`).join('') : `<div class="empty-state"><div><strong>${esc(ui('还没有保存信息'))}</strong><span>${esc(ui('从邮件、联系人和自行打开的官方网站开始。'))}</span></div></div>`}
        </div>
        <div class="action-row"><button class="primary-action" type="button" data-action="end-day">${esc(ui('结束今天并查看记录'))}</button><button class="secondary-action" type="button" data-action="reset-day">${esc(ui('重新开始'))}</button></div>
      </div>`;
  }

  function taskPanel(taskId, title, description, status, steps, values) {
    return `
      <article class="task-panel">
        <div class="task-head"><div><span class="detail-meta">DAILY TASK</span><h2>${esc(ui(title))}</h2></div><span class="task-status ${status === 'done' ? 'done' : ''}">${esc(ui(status === 'done' ? '已完成' : '进行中'))}</span></div>
        <p>${esc(ui(description))}</p>
        <div class="task-steps">${steps.map(([key, label]) => `<div class="task-step ${values[key] ? 'done' : ''}"><i>${values[key] ? '✓' : ''}</i><span>${esc(ui(label))}</span></div>`).join('')}</div>
        ${taskId === 'parcel' && values.hallConfirmed && !values.collected ? `<div class="action-row"><button class="primary-action" type="button" data-action="collect-parcel">${esc(ui('前往收发室领取'))}</button></div>` : ''}
      </article>`;
  }

  function startCallback() {
    if (callSession) { resumeCall(); showToast('先结束当前通话，再拨打另一个号码'); return; }
    startCallSession('orientation', '+852 6XXX 8704');
    const missedCall = state.callLog.find((item) => item.id === 'call-unknown');
    if (missedCall) Object.assign(missedCall, { direction: '正在回拨', unread: false });
    markNotification('n-call');
    addHistory('callback-started', '主动回拨未知号码');
    saveState();
    renderCallDialling(ui('回拨'), ui('你正在主动回拨刚才的未接来电'));
    callbackTimer = setTimeout(() => {
      if (callSession && callSession.phase === 'dialing' && callSession.scenario === 'orientation') connectCallSession();
    }, 1450);
  }

  function messageThreadActions(key) {
    if (key === 'health') return `<div class="message-actions"><button class="primary-action" type="button" data-action="health-open-cancel">${esc(ui('打开取消页面'))}</button></div>`;
    if (key === 'market') return `<div class="message-actions"><button class="primary-action" type="button" data-action="market-open-protection">${esc(ui('查看收款验证'))}</button></div>`;
    if (key === 'friend') return `<div class="message-actions"><button class="primary-action" type="button" data-action="friend-pay">${esc(ui('先垫付印刷费'))}</button></div>`;
    if (key === 'recovery') return `<div class="message-actions"><button class="primary-action" type="button" data-action="recovery-open-portal">${esc(ui('查看案件摘要'))}</button></div>`;
    if (key === 'lawyer') return `<div class="message-actions"><button class="primary-action" type="button" data-action="recovery-open-lawyer">${esc(ui('查看委托摘要'))}</button></div>`;
    if (key === 'investigator') return `<div class="message-actions"><button class="primary-action" type="button" data-action="recovery-open-investigator">${esc(ui('打开远程协助'))}</button></div>`;
    return '';
  }

  function startCallSession(scenario, number, contactId = null) {
    clearTimeout(callbackTimer);
    stopAllAudio();
    callSession = {
      id: `call-session-${Date.now()}`,
      scenario,
      number,
      contactId,
      phase: 'dialing',
      node: 'dialing',
      step: 0,
      startedAt: state.time,
      transcript: [],
      disclosed: [],
      claims: [],
      minimized: false,
      originApp: state.currentApp || 'phone'
    };
    renderActiveCallBar();
  }

  function startOfficialCall(contactId) {
    const contact = state.contacts.find((item) => item.id === contactId);
    if (!contact) return;
    if (callSession) { resumeCall(); showToast('先结束当前通话，再拨打另一个号码'); return; }
    const scenario = contactId === 'contact-hall' ? 'hall' : 'department';
    startCallSession(scenario, contact.number, contactId);
    const logItem = state.callLog.find((item) => item.number === contact.number);
    if (logItem) Object.assign(logItem, { direction: '正在拨号', unread: false });
    addHistory('official-call-started', `拨打 ${contact.number}`);
    saveState();
    renderCallDialling(ui('拨号'), ui('正在拨打这个号码'));
    callbackTimer = setTimeout(() => {
      if (callSession && callSession.phase === 'dialing' && callSession.contactId === contactId) connectCallSession();
    }, 1450);
  }

  function renderCallDialling(label, note) {
    if (!callSession) return;
    els.overlayLayer.innerHTML = `
      <section class="call-overlay call-dialling">
        <span class="simulation-tag">${esc(label)} · ${esc(callSession.number)}</span>
        <div class="call-avatar">?</div>
        <h2>${esc(ui('未知号码'))}</h2>
        <p class="call-state">${esc(ui('正在接通…'))}</p>
        <div class="callback-pulse" aria-hidden="true"><i></i><i></i><i></i></div>
        <p class="callback-note">${esc(note)}</p>
        <div class="call-controls"><button class="round-call-button" type="button" data-action="end-call" aria-label="${esc(ui('结束通话'))}">${DATA.icons.hangup}</button></div>
      </section>`;
    playCallbackTone();
  }

  function connectCallSession() {
    if (!callSession) return;
    stopRingtone();
    callSession.phase = 'connected';
    callSession.node = 'intro';
    callSession.step = 0;
    const contact = callSession.contactId && state.contacts.find((item) => item.id === callSession.contactId);
    const logItem = contact && state.callLog.find((item) => item.number === contact.number);
    if (logItem) logItem.direction = '已接通';
    if (callSession.scenario === 'orientation') {
      state.taskState.contact.steps.strangerSpoken = true;
      const missedCall = state.callLog.find((item) => item.id === 'call-unknown');
      if (missedCall) missedCall.direction = '已回拨';
      addHistory('unknown-call', '回拨后与陌生号码通话');
      advanceTime(2);
    } else {
      advanceTime(1);
    }
    const node = getCallNode(callSession.scenario, 'intro');
    addCallTurn('caller', resolveCallCopy(node.reply));
    saveState();
    renderCallSession(resolveCallCopy(node.audio) || '');
  }

  function resolveCallCopy(value) {
    return typeof value === 'function' ? value(callSession, state) : value;
  }

  function addCallTurn(role, text, intent = '') {
    if (!callSession || !text) return;
    callSession.transcript.push({ role, text, intent, time: formatTime(state.time) });
    callSession.transcript = callSession.transcript.slice(-14);
  }

  function getCallNode(scenario, nodeId) {
    const variant = state.contactVariant || (state.contactIsReal ? 'real' : 'fake');
    const scenarios = {
      hall: {
        intro: { reply: '「喂，你好。請問你想查咩？」', audio: 'hall-intro', quick: [['describe_request', '我收到通知有份文件，想查一下'], ['ask_identity', '请问这里是什么单位？'], ['ask_reference', '你那边能看到什么资料？']] },
        claim: { reply: '「呢度係宿舍收發室。請問你想查邊份文件？」', audio: 'hall-claim', quick: [['describe_request', '我收到通知有份文件，想查一下'], ['ask_reference', '你先说一下现有记录'], ['refuse_disclosure', '我暂时不提供个人资料']] },
        need_reference: { reply: '「可以。請講運單號最後四位，同埋文件送去邊間宿舍。」', audio: 'hall-need-reference', quick: [['share_partial', '只提供尾号和宿舍'], ['ask_fee', '先问是否需要缴费'], ['hold_research', '打开邮件核对资料']] },
        fee: { reply: '「一般領取文件唔使網上付款。不過要查到件，我要先核對運單資料。」', audio: 'hall-fee', quick: [['share_partial', '只提供尾号和宿舍'], ['ask_reference', '你先说一下现有记录'], ['hold_research', '打开邮件核对资料']] },
        partial: { reply: '「尾號1305，係嗎？我搵到一項紀錄，但要再核對完整編號先可以講送達時間。」', audio: 'hall-partial', quick: [['share_full', '提供完整运单号'], ['ask_reference', '先说送达日期可以吗？'], ['hold_research', '打开邮件核对资料']] },
        need_mail: { reply: '「冇完整編號我未能確認係同一份文件。你可以搵返通知再打嚟。」', audio: 'hall-need-mail', quick: [['hold_research', '打开邮件核对资料'], ['refuse_disclosure', '我稍后从其他渠道确认']] },
        result: { reply: '「查到喇：文件08:14送到收發室。今日17:00前帶學生證嚟拎就得，唔需要網上補交費用。」', audio: 'hall-result', quick: [['record_result', '记下这次通话内容'], ['ask_fee', '再确认是否需要缴费'], ['finish_judge', '结束并作出判断']] },
        cautious: { reply: '「冇問題。你可以先核對通知；我哋未確認資料前亦唔會講文件內容。」', audio: 'hall-cautious', quick: [['hold_research', '打开邮件核对资料'], ['finish_judge', '结束并作出判断']] }
      },
      department: {
        intro: { reply: '「喂，你好。請問你想搵邊位？」', audio: 'department-intro', quick: [['describe_request', '我想核实一封研究邀请'], ['ask_identity', '请问这里是什么办公室？'], ['ask_reference', '你们最近有招募研究助理吗？']] },
        claim: { reply: '「呢度係 Department General Office。請問你想查咩事？」', audio: 'department-claim', quick: [['describe_request', '我想核实一封研究邀请'], ['ask_reference', '你们最近有招募研究助理吗？'], ['refuse_disclosure', '我暂时不提供个人资料']] },
        need_mail: { reply: '「可以。你唔使提供個人資料，講封郵件嘅主題同發件地址就得。」', audio: 'department-need-mail', quick: [['share_mail', '提供邮件主题和发件地址'], ['hold_research', '返回浏览器核对目录'], ['refuse_disclosure', '我只想了解正式招募渠道']] },
        channels: { reply: '「正式招募會經 PolyU 電郵或部門系統，但我未睇過你嗰封信，暫時唔可以判斷係咪同一項目。」', audio: 'department-channels', quick: [['share_mail', '提供邮件主题和发件地址'], ['hold_research', '返回浏览器核对目录'], ['finish_judge', '结束并作出判断']] },
        result: { reply: '「我按主題同地址查過：Prof. Chan 冇發出呢封邀請，學院亦冇叫學生代購禮券。你唔好用信內連結。」', audio: 'department-result', quick: [['record_result', '记下这次通话内容'], ['ask_reference', '请再说明正式招募渠道'], ['finish_judge', '结束并作出判断']] },
        cautious: { reply: '「可以。唔提供個人資料都得；你可以用官網電郵將主題轉畀辦公室核對。」', audio: 'department-cautious', quick: [['hold_research', '返回浏览器核对目录'], ['finish_judge', '结束并作出判断']] }
      },
      orientation: {
        intro: { reply: '「喂，你真係唔記得我呀？上年迎新活動嗰個呀。你再諗下啦。」', audio: 'orientation-intro', quick: [['ask_identity', '你先说名字'], ['ask_purpose', '你找我有什么事？'], ['refuse_disclosure', '我不确认任何个人资料']] },
        identity: { reply: () => variant === 'real' ? '「我係阿杰呀，上年迎新喺N座擺攤嗰個。」' : (variant === 'grey' ? '「我係阿倫，之前幫迎新場地做聯絡嗰個。」' : '「吓，你連我個名都唔記得？上年我哋成日見㗎。」'), audio: () => `orientation-identity-${variant}`, quick: [['ask_purpose', '你找我有什么事？'], ['ask_reference', '说一件只有联系人知道的事'], ['hold_research', '先去联系人核对']] },
        guessed: { reply: '「係呀，我咪阿杰囉，終於認得我喇。」', audio: 'orientation-guessed', quick: [['ask_purpose', '你找我有什么事？'], ['ask_reference', '说一件只有阿杰知道的事'], ['hold_research', '先去联系人核对']] },
        purpose: { reply: () => variant === 'real' ? '「我換咗號碼。供應商有份訂金資料想你幫手睇，但唔使你私人付款。」' : (variant === 'grey' ? '「場地方想確認參加人數，你可唔可以send學生名單同電話畀我？」' : '「供應商催訂金，爭HK$1,200。你轉畀我先，今晚還畀你。」'), audio: () => `orientation-purpose-${variant}`, quick: [['ask_document', '先发正式文件给我'], ['refuse_disclosure', '我不会在这通电话提供资料'], ['hold_research', '先去联系人核对']] },
        reference: { reply: () => variant === 'real' ? '「上年你負責N座攤位，嘉敏遲到，我哋一齊搬過物資。」' : (variant === 'grey' ? '「我只係供應商聯絡人，係嘉敏畀你號碼我；你可以問返佢。」' : '「咁耐以前邊記得咁清楚？你先講你負責邊一part，我就記得。」'), audio: () => `orientation-reference-${variant}`, quick: [['ask_purpose', '继续问来意'], ['refuse_disclosure', '不提供更多线索'], ['hold_research', '先去联系人核对']] },
        document: { reply: () => variant === 'real' ? '「得，我send學院報價單畀你；款項應該由學院戶口處理。」' : (variant === 'grey' ? '「我只有場地公司張表，冇學院文件。你可以先問嘉敏。」' : '「供應商就收工，唔使搞咁多文件啦，你轉咗先。」'), audio: () => `orientation-document-${variant}`, quick: [['hold_research', '先去联系人核对'], ['refuse_disclosure', '资料确认前不处理'], ['offer_payment', '按对方要求处理']] },
        cautious: { reply: () => variant === 'fake' ? '「你而家咁唔信我？過咗今日個場就冇㗎喇。」' : '「可以，你問返嘉敏先。確認咗再聯絡。」', audio: () => variant === 'fake' ? 'orientation-cautious-fake' : 'orientation-cautious-safe', quick: [['hold_research', '先去联系人核对'], ['ask_reference', '再问一项共同经历'], ['finish_judge', '结束并作出判断']] },
        fallback: { reply: '「我唔係好明你想問邊一樣。你可以講清楚少少，或者遲啲再聯絡。」', audio: 'orientation-fallback', quick: [['ask_identity', '你先说名字'], ['ask_purpose', '你找我有什么事？'], ['hold_research', '先去联系人核对']] }
      }
    };
    return (scenarios[scenario] && scenarios[scenario][nodeId]) || scenarios[scenario]?.intro || { reply: '「喂？」', quick: [] };
  }

  function routeCallIntent(intent) {
    const scenario = callSession.scenario;
    const current = callSession.node;
    if (intent === 'finish_judge') return finishCallForJudgement();
    if (intent === 'end_call') return endCall('玩家结束通话');
    if (intent === 'hold_research') return minimizeCallAndResearch();
    if (intent === 'offer_payment') return handleAction('call-transfer', document.createElement('button'));
    if (intent === 'record_result') {
      if (scenario === 'hall' && current === 'result') return confirmHall();
      if (scenario === 'department' && current === 'result') return confirmDepartment();
    }
    if (scenario === 'hall') {
      if (intent === 'ask_identity') return 'claim';
      if (intent === 'describe_request') return 'need_reference';
      if (intent === 'ask_fee') return 'fee';
      if (intent === 'refuse_disclosure') return 'cautious';
      if (intent === 'share_partial') { markCallDisclosure('tracking-tail'); return 'partial'; }
      if (intent === 'share_full') {
        if (!state.taskState.parcel.steps.trackingSaved) return 'need_mail';
        markCallDisclosure('full-tracking');
        return 'result';
      }
      if (intent === 'ask_reference') return current === 'partial' ? 'partial' : 'need_reference';
    }
    if (scenario === 'department') {
      if (intent === 'ask_identity') return 'claim';
      if (intent === 'describe_request') return 'need_mail';
      if (intent === 'ask_reference') return 'channels';
      if (intent === 'refuse_disclosure') return 'cautious';
      if (intent === 'share_mail') { markCallDisclosure('mail-metadata'); return 'result'; }
    }
    if (scenario === 'orientation') {
      if (intent === 'guess_name') { markCallDisclosure('guessed-name'); return 'guessed'; }
      if (intent === 'ask_identity') return 'identity';
      if (intent === 'ask_purpose') return 'purpose';
      if (intent === 'ask_reference') return 'reference';
      if (intent === 'ask_document') return 'document';
      if (intent === 'refuse_disclosure') return 'cautious';
      return 'fallback';
    }
    return current;
  }

  function markCallDisclosure(kind) {
    if (!callSession || callSession.disclosed.includes(kind)) return;
    callSession.disclosed.push(kind);
    if (['guessed-name', 'full-tracking', 'mail-metadata'].includes(kind)) state.privacyExposure += 1;
  }

  function recogniseCallIntent(raw) {
    const text = String(raw || '').trim().toLowerCase();
    if (!text) return '';
    const has = (...terms) => terms.some((term) => text.includes(term));
    if (has('阿杰', 'ah kit', 'ajie')) return 'guess_name';
    if (has('你是谁', '你係邊個', '你边个', '什么单位', '甚麼單位', '办公室', 'office', 'department', '边位', '邊位')) return 'ask_identity';
    if (has('什么事', '甚麼事', '咩事', '来意', '找我', 'purpose', 'why')) return 'ask_purpose';
    if (has('尾号', '尾號', '最后四', 'last four')) return 'share_partial';
    if (has('完整', 'rr 482', '917 305')) return 'share_full';
    if (has('发件', '主題', '主题', 'sender', 'subject', 'outlook.example')) return 'share_mail';
    if (has('文件', '包裹', '運單', '运单', '通知')) return callSession.scenario === 'hall' ? 'describe_request' : 'ask_document';
    if (has('研究', '邀请', '邀請', 'research', 'professor', '教授')) return callSession.scenario === 'department' ? 'describe_request' : 'ask_purpose';
    if (has('费用', '費用', '付款', '缴费', '繳費', 'fee', 'pay')) return 'ask_fee';
    if (has('证明', '證明', '只有', '共同', 'reference')) return 'ask_reference';
    if (has('不提供', '不透露', '唔提供', '私隐', '隱私', 'privacy')) return 'refuse_disclosure';
    if (has('核对', '核實', '查一下', '查证', '先问', '先問', '稍后', '稍後')) return 'hold_research';
    if (has('结束', '結束', '挂了', '收线', 'bye')) return 'finish_judge';
    return callSession.scenario === 'orientation' ? 'unknown' : (callSession.scenario === 'hall' ? 'describe_request' : 'describe_request');
  }

  function submitCallReply(raw, forcedIntent = '') {
    if (!callSession || callSession.phase !== 'connected') return;
    const text = String(raw || '').trim().slice(0, 240);
    const intent = forcedIntent || recogniseCallIntent(text);
    if (!intent) { showToast('输入你想说的话'); return; }
    const spoken = text || callQuickLabel(intent);
    addCallTurn('player', spoken, intent);
    const nextNode = routeCallIntent(intent);
    if (!callSession || typeof nextNode !== 'string') return;
    if (nextNode === 'claim' || nextNode === 'identity' || nextNode === 'guessed') {
      if (!callSession.claims.includes('caller-claimed-identity')) callSession.claims.push('caller-claimed-identity');
      if (callSession.scenario === 'orientation') state.taskState.contact.steps.identityClaimed = true;
    }
    callSession.node = nextNode;
    callSession.step += 1;
    const node = getCallNode(callSession.scenario, nextNode);
    addCallTurn('caller', resolveCallCopy(node.reply));
    if (nextNode === 'result') {
      if (callSession.scenario === 'hall' && !state.taskState.parcel.steps.hallConfirmed) {
        state.taskState.parcel.steps.hallConfirmed = true;
        addEvidence('hall-call', '从已保存号码联系宿舍收发室');
        addHistory('hall-confirmed', '收发室确认文件已到，无需补缴费用');
      }
      if (callSession.scenario === 'department' && !state.taskState.research.steps.resolved) {
        state.taskState.research.steps.officialContacted = true;
        state.taskState.research.steps.resolved = true;
        state.taskState.research.status = 'done';
        addEvidence('department-confirmation', '部门办公室确认没有该研究助理项目或代购礼券安排');
        addHistory('research-resolved', '通过官网号码确认邀请邮件冒充教授');
      }
    }
    advanceTime(1);
    saveState();
    renderCallSession(resolveCallCopy(node.audio) || '');
  }

  function callQuickLabel(intent) {
    const node = callSession && getCallNode(callSession.scenario, callSession.node);
    const item = node && node.quick && node.quick.find(([value]) => value === intent);
    return item ? item[1] : intent;
  }

  function renderCallSession(audioId = '') {
    if (!callSession || callSession.phase !== 'connected') return;
    callSession.minimized = false;
    const node = getCallNode(callSession.scenario, callSession.node);
    const latestCallerText = [...callSession.transcript].reverse().find((turn) => turn.role === 'caller')?.text || '';
    const transcript = callSession.transcript.map((turn) => `<div class="call-turn ${turn.role}"><span>${turn.role === 'caller' ? esc(ui('未知号码')) : esc(localized('你', 'You'))}</span><p>${esc(turn.text)}</p></div>`).join('');
    els.overlayLayer.innerHTML = `
      <section class="call-overlay call-conversation" data-cantonese-audio="${esc(audioId || '')}">
        <header class="call-conversation-head">
          <button class="call-minimize" type="button" data-action="call-minimize" aria-label="${esc(localized('最小化通话', 'Minimise call'))}">⌄</button>
          <div><span>${esc(ui('通话中'))} · ${esc(callSession.number)}</span><strong>${esc(ui('未知号码'))}</strong></div>
          <button class="call-replay" type="button" data-action="call-replay-voice" aria-label="${esc(localized('重播对方刚才的话', 'Replay the caller'))}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 10v4h3.2l4.3 3.4V6.6L7.7 10H4.5Z"/><path d="M15 9a4.2 4.2 0 0 1 0 6M17.8 6.5a7.6 7.6 0 0 1 0 11"/></svg>
          </button>
        </header>
        <div class="call-transcript" id="callTranscript" aria-live="polite">${transcript}</div>
        <form class="call-reply-form" id="callReplyForm">
          <label class="sr-only" for="callReplyInput">${esc(localized('你想说什么', 'What do you want to say?'))}</label>
          <input id="callReplyInput" maxlength="240" autocomplete="off" placeholder="${esc(localized('你想说什么…', 'Say something…'))}">
          <button type="submit" aria-label="${esc(localized('说出回复', 'Say reply'))}">↑</button>
        </form>
        <div class="call-controls"><button class="round-call-button" type="button" data-action="call-finish-judge" aria-label="${esc(ui('结束通话'))}">${DATA.icons.hangup}</button></div>
      </section>`;
    renderActiveCallBar();
    requestAnimationFrame(() => {
      const log = $('callTranscript');
      if (log) log.scrollTop = log.scrollHeight;
    });
    playCallerVoice(audioId, latestCallerText);
  }

  function callClaimResponse(mode) {
    submitCallReply(mode === 'guess' ? '阿杰？' : '你先说名字', mode === 'guess' ? 'guess_name' : 'ask_identity');
  }

  function minimizeCallAndResearch() {
    if (!callSession || callSession.phase !== 'connected') return;
    callSession.minimized = true;
    els.overlayLayer.innerHTML = '';
    renderActiveCallBar();
    if (callSession.scenario === 'hall') openApp('mail', 'mail-parcel');
    else if (callSession.scenario === 'department') {
      state.browserPage = 'staff-directory';
      openApp('browser');
    } else openApp('contacts');
    showToast('通话仍在进行，可以查资料后返回');
  }

  function minimizeCall() {
    if (!callSession || callSession.phase !== 'connected') return;
    callSession.minimized = true;
    els.overlayLayer.innerHTML = '';
    renderActiveCallBar();
    if (state.currentApp) renderApp(state.currentApp);
    else renderHome();
  }

  function resumeCall() {
    if (!callSession) return;
    if (callSession.phase === 'dialing') renderCallDialling(ui('拨号'), ui('正在拨打这个号码'));
    else renderCallSession();
  }

  function renderActiveCallBar() {
    if (!els.activeCallBar) return;
    if (!callSession || !callSession.minimized) {
      els.activeCallBar.hidden = true;
      els.activeCallBar.innerHTML = '';
      return;
    }
    els.activeCallBar.hidden = false;
    els.activeCallBar.innerHTML = `
      <button type="button" data-action="call-resume">
        <span class="active-call-dot" aria-hidden="true"></span>
        <span><strong>${esc(ui('未知号码'))}</strong><small>${esc(localized('轻点返回通话', 'Tap to return to call'))}</small></span>
      </button>
      <button class="active-call-end" type="button" data-action="call-finish-judge" aria-label="${esc(ui('结束通话'))}">${DATA.icons.hangup}</button>`;
  }

  function archiveCallSession(note = '') {
    if (!callSession) return null;
    const record = {
      id: callSession.id,
      scenario: callSession.scenario,
      number: callSession.number,
      startedAt: callSession.startedAt,
      endedAt: state.time,
      disclosed: [...callSession.disclosed],
      claims: [...callSession.claims],
      transcript: callSession.transcript.map((turn) => ({ ...turn })),
      note
    };
    state.callRecords = [...state.callRecords.filter((item) => item.id !== record.id), record].slice(-12);
    return record;
  }

  function finishCallForJudgement() {
    if (!callSession) return;
    const record = archiveCallSession('等待玩家判断');
    clearTimeout(callbackTimer);
    stopAllAudio();
    playSound('hangup');
    callSession = null;
    renderActiveCallBar();
    saveState();
    showCallJudgement(record.id);
  }

  function showCallJudgement(recordId) {
    const record = state.callRecords.find((item) => item.id === recordId);
    if (!record) return closeOverlay();
    els.overlayLayer.innerHTML = `
      <div class="dialog-overlay call-judgement-overlay">
        <section class="dialog-sheet call-judgement-sheet">
          <span class="detail-meta">${esc(localized('通话后的暂时判断', 'Assessment after the call'))}</span>
          <h2>${esc(ui('未知号码'))}</h2>
          <p>${esc(localized('先记录你目前的看法。这里不会告诉你正确答案，之后仍可根据新证据改变判断。', 'Record what you think for now. No answer is revealed here, and you can revise it when you find new evidence.'))}</p>
          <div class="judgement-options">
            <button type="button" data-action="call-judgement" data-id="${esc(recordId)}" data-value="trusted">${esc(localized('暂时可信', 'Probably trustworthy'))}</button>
            <button type="button" data-action="call-judgement" data-id="${esc(recordId)}" data-value="suspicious">${esc(localized('可疑', 'Suspicious'))}</button>
            <button type="button" data-action="call-judgement" data-id="${esc(recordId)}" data-value="insufficient">${esc(localized('资料不足', 'Not enough information'))}</button>
            <button type="button" data-action="call-judgement" data-id="${esc(recordId)}" data-value="verify">${esc(localized('需要其他渠道确认', 'Verify through another channel'))}</button>
          </div>
          <button class="secondary-action" type="button" data-action="call-judgement-dismiss">${esc(localized('暂不判断', 'Decide later'))}</button>
        </section>
      </div>`;
  }

  function endCall(note) {
    if (note) addHistory('call-ended', note);
    archiveCallSession(note);
    clearTimeout(callbackTimer);
    stopAllAudio();
    playSound('hangup');
    els.overlayLayer.innerHTML = '';
    callSession = null;
    renderActiveCallBar();
    saveState();
    showToast('通话已结束');
    if (state.currentApp) renderApp(state.currentApp);
    renderHome();
  }

  function showDialog(title, body, actions) {
    els.overlayLayer.innerHTML = `
      <div class="dialog-overlay">
        <section class="dialog-sheet">
          <h2>${esc(ui(title))}</h2>
          <p>${esc(ui(body))}</p>
          <div class="action-row">${actions.map((action) => `<button class="${action.kind || 'secondary-action'}" type="button" data-action="${action.action}">${esc(ui(action.label))}</button>`).join('')}</div>
        </section>
      </div>`;
  }

  function showOpeningBrief() {
    els.overlayLayer.innerHTML = `
      <div class="dialog-overlay opening-overlay">
        <section class="dialog-sheet opening-sheet">
          <span class="opening-eyebrow">TODAY · INBOX</span>
          <h2>${esc(ui('先看看今天会发生什么'))}</h2>
          <p>${esc(ui('校园里的很多安排不会预先写进待办，而会从收件箱和校内应用里陆续出现。'))}</p>
          <div class="opening-sources">
            <div><i>Dept.</i><span><strong>${esc(ui('院系与学生组织'))}</strong><small>${esc(ui('讲座、工作坊、招募与临时安排'))}</small></span></div>
            <div><i>RA</i><span><strong>${esc(ui('教学与研究团队'))}</strong><small>${esc(ui('课程通知、研究参与邀请和助理岗位'))}</small></span></div>
            <div><i>Life</i><span><strong>${esc(ui('校园服务'))}</strong><small>${esc(ui('场地、住宿、缴费与个人事务更新'))}</small></span></div>
          </div>
          <div class="opening-note">${esc(ui('这些来信有些与你有关，有些可以忽略。看清来源和内容后，再决定是否行动。'))}</div>
          <div class="action-row"><button class="primary-action" type="button" data-action="start-day">${esc(ui('进入手机'))}</button></div>
        </section>
      </div>`;
  }

  function closeOverlay() {
    els.overlayLayer.innerHTML = '';
    els.overlayLayer.setAttribute('aria-live', 'assertive');
    setMailMenuBackgroundInert(false);
    mailMenuReturnFocus = null;
  }

  function confirmHall() {
    const task = state.taskState.parcel;
    task.steps.hallConfirmed = true;
    addEvidence('hall-call', '从已保存号码联系宿舍收发室');
    addHistory('hall-confirmed', '收发室确认文件已到，无需补缴费用');
    advanceTime(8);
    clearTimeout(callbackTimer);
    stopAllAudio();
    playSound('hangup');
    archiveCallSession('记下收发室通话中的具体领取资料');
    callSession = null;
    renderActiveCallBar();
    closeOverlay();
    saveState();
    showToast('收发室确认文件正在等待领取');
    if (state.currentApp) renderApp(state.currentApp);
    renderHome();
  }

  function confirmDepartment() {
    const task = state.taskState.research;
    task.steps.officialContacted = true;
    task.steps.resolved = true;
    task.status = 'done';
    addEvidence('department-confirmation', '部门办公室确认没有该研究助理项目或代购礼券安排');
    addHistory('research-resolved', '通过官网号码确认邀请邮件冒充教授');
    advanceTime(6);
    endCall('记下部门办公室的核验结果');
    renderHome();
    playSound('success');
  }

  function collectParcel() {
    const task = state.taskState.parcel;
    if (!task.steps.hallConfirmed) {
      showToast('先确认领取地点和安排');
      return;
    }
    task.steps.collected = true;
    task.status = 'done';
    addHistory('parcel-collected', '携带学生证领取了交换申请文件');
    advanceTime(25);
    saveState();
    renderTasks();
    renderHome();
    playSound('success');
    showToast('文件已领取');
  }

  function callContact(contactId) {
    const contact = state.contacts.find((item) => item.id === contactId);
    if (!contact) return;
    if (contactId === 'contact-hall') {
      startOfficialCall(contactId);
      return;
    }
    if (contactId === 'contact-department') {
      startOfficialCall(contactId);
      return;
    }
    if (contactId === 'contact-mandy') {
      const steps = state.taskState.friend.steps;
      steps.originalNumberCalled = true;
      steps.resolved = true;
      state.taskState.friend.status = 'done';
      advanceTime(4);
      if (state.hijackedFriendVariant === 'hijacked') {
        addEvidence('friend-original-number', '从Mandy原号码确认聊天账号已被盗用');
        addHistory('friend-verified', '没有在原聊天账号继续猜身份，而是从已保存号码联系本人');
        showDialog('Mandy', '“我个聊天账号俾人登入咗！我冇叫你帮我转钱，唔好理嗰边，我而家通知其他人。”', [
          { label: '记下结果', action: 'close-overlay', kind: 'primary-action' }
        ]);
      } else {
        addEvidence('friend-original-number', '从Mandy原号码确认印刷垫付款确由本人提出');
        addHistory('friend-verified', '从已保存号码确认请求来自本人，并进一步核对收款安排');
        showDialog('Mandy', '“係我呀，多谢你打嚟确认。印刷店可以等，我叫佢哋直接出正式单俾我，唔使你转去个人户口。”', [
          { label: '记下结果', action: 'close-overlay', kind: 'primary-action' }
        ]);
      }
      saveState();
      playSound('success');
      return;
    }
    if (contactId === 'contact-ajie') {
      state.taskState.contact.steps.oldNumberCalled = true;
      advanceTime(4);
      if (state.contactVariant === 'real') {
        addEvidence('old-number', '阿杰旧号码已停用');
        showDialog('旧号码语音信箱', '这个号码暂时无法接通。仅凭旧号码无法确认刚才的来电，需要寻找共同联系人。', [
          { label: '打开联系人', action: 'close-overlay', kind: 'primary-action' }
        ]);
      } else if (state.contactVariant === 'grey') {
        addEvidence('old-number', '阿杰确认没有换号，但场地承办商可能另有联系人');
        addHistory('grey-contact-unresolved', '阿杰表示没有换号，但尚未确认来电的场地联系人权限');
        showDialog('阿杰（原号码）', '“我没有换号码。场地公司好像有个叫阿伦的人，不过我没有叫他向你收名单或款项。你再问嘉敏确认他的权限。”', [
          { label: '打开联系人', action: 'close-overlay', kind: 'primary-action' }
        ]);
      } else {
        state.taskState.contact.steps.resolved = true;
        state.taskState.contact.status = 'done';
        addEvidence('old-number', '从原号码联系到真正的阿杰');
        addHistory('identity-resolved', '真正的阿杰否认使用新号码及要求转账');
        showDialog('阿杰（原号码）', '“我没有换号码，也没有叫你代付订金。刚才那个人不是我。”', [
          { label: '记下结果', action: 'close-overlay', kind: 'primary-action' }
        ]);
      }
      saveState();
      renderHome();
      playSound('success');
      return;
    }
    if (contactId === 'contact-kaman') {
      state.taskState.contact.steps.organizerChecked = true;
      state.taskState.contact.steps.resolved = true;
      state.taskState.contact.status = 'done';
      advanceTime(5);
      if (state.contactVariant === 'real') {
        addEvidence('co-organizer', '嘉敏确认阿杰的新号码尾号8704');
        addHistory('identity-resolved', '共同联系人确认来电者确实是阿杰');
        showDialog('嘉敏', '“阿杰昨天在筹备群说手机坏了，新号码尾号是8704。不过订金应该由学院账户处理，不用你私人转账。”', [
          { label: '记下结果', action: 'close-overlay', kind: 'primary-action' }
        ]);
      } else if (state.contactVariant === 'grey') {
        addEvidence('co-organizer', '嘉敏确认来电者是场地承办商联系人，但无权索取学生名单或私人付款');
        addHistory('identity-resolved', '共同联系人确认人物真实，但来电要求超出授权范围');
        showDialog('嘉敏', '“阿伦确实帮场地公司联络，但他只负责场地时间，不应该直接拿学生名单，也不能叫你私人付款。人数我会从正式表格给场地方。”', [
          { label: '记下结果', action: 'close-overlay', kind: 'primary-action' }
        ]);
      } else {
        addEvidence('co-organizer', '嘉敏确认阿杰仍使用原号码');
        addHistory('identity-resolved', '共同联系人否认阿杰更换号码');
        showDialog('嘉敏', '“阿杰没有换号码，筹备组也没有临时订金。不要向那个号码转账。”', [
          { label: '记下结果', action: 'close-overlay', kind: 'primary-action' }
        ]);
      }
      saveState();
      renderHome();
      playSound('success');
    }
  }

  function completeTransfer() {
    const amount = 1200;
    state.balance -= amount;
    if (!state.contactIsReal) state.moneyLost += amount;
    state.taskState.contact.steps.resolved = true;
    state.taskState.contact.status = 'done';
    addHistory('private-transfer', `向新号码提供的个人账户转账HK$${amount}`);
    state.transactions.unshift({ title: 'FPS TRANSFER', time: `今天 ${formatTime(state.time)}`, amount: -amount });
    advanceTime(3);
    if (!state.contactIsReal) triggerRecoveryScam();
    closeOverlay();
    endCall();
    saveState();
    showToast('转账已提交');
  }

  function triggerRecoveryScam() {
    if (state.recoveryScamTriggered || state.moneyLost <= 0) return;
    state.recoveryScamTriggered = true;
    state.taskState.recovery.status = 'active';
    state.messages.recovery = {
      id: 'thread-recovery',
      sender: '退款协助客服',
      number: '+852 6XXX 7742',
      unread: true,
      items: [
        { from: 'them', time: formatTime(state.time), text: `你好，我们的合作渠道转来一笔${formatHKD(state.moneyLost)}交易争议。你可以先查看案件摘要，再决定是否委托处理。` },
        { from: 'them', time: formatTime(state.time), text: '初步受理不收费。参考资料只保留到今天18:00：https://claim-assistance.example/intake' }
      ]
    };
    state.notifications.unshift({ id: `n-recovery-${Date.now()}`, app: 'messages', title: '退款协助客服', body: '案件摘要已建立，可选择是否转介', time: formatTime(state.time), unread: true, target: 'thread-recovery' });
    addHistory('recovery-scam-arrived', '发生损失后收到掌握交易金额的退款协助联络');
  }

  function payFriendRequest() {
    const steps = state.taskState.friend.steps;
    if (steps.paid) return showToast('这笔模拟转账已经处理');
    steps.paid = true;
    steps.resolved = true;
    state.taskState.friend.status = 'done';
    state.balance -= 760;
    state.transactions.unshift({ title: 'FPS · PRINTING', time: `今天 ${formatTime(state.time)}`, amount: -760 });
    addHistory('friend-payment', '在聊天账号提出请求后向第三方FPS账户垫付HK$760');
    if (state.hijackedFriendVariant === 'hijacked') state.moneyLost += 760;
    advanceTime(3);
    if (state.hijackedFriendVariant === 'hijacked') triggerRecoveryScam();
    saveState();
    showToast('模拟转账已提交');
    renderMessageThread('friend');
  }

  function renderCareerWorkspace() {
    const steps = state.taskState.career.steps;
    steps.trainingOpened = true;
    saveState();
    const stage = steps.largeDepositRequested ? 4 : (steps.trialCommissionReceived ? 3 : (steps.profileSubmitted ? 2 : 1));
    const content = stage === 1
      ? `<h2>Project workspace training</h2><p>Welcome. Review the company background, quality rules and task settlement process. Training progress: 40 minutes completed.</p><div class="action-row"><button class="primary-action" type="button" data-action="career-submit-profile">${esc(ui('提交个人资料'))}</button></div>`
      : (stage === 2
        ? `<h2>Trial task · Product data check</h2><p>Purchase one product sample for HK$120. The cost and HK$26 commission will be released immediately after review.</p><div class="fake-fee"><span>Trial task</span><strong>HK$120</strong></div><div class="action-row"><button class="primary-action" type="button" data-action="career-pay-trial">${esc(ui('完成首个试做任务'))}</button></div>`
        : `<h2>${stage === 3 ? 'Trial settled · Account upgraded' : 'Priority task waiting'}</h2><p>${stage === 3 ? 'HK$146 has reached your account. A priority batch is now available; deposit HK$2,400 to earn HK$720 commission.' : 'The priority batch remains locked until the HK$2,400 task deposit is completed.'}</p><div class="fake-fee"><span>Priority task deposit</span><strong>HK$2,400</strong></div><div class="action-row"><button class="primary-action" type="button" data-action="career-pay-large">${esc(ui('继续高额任务'))}</button></div>`);
    els.appContent.innerHTML = `<div class="fake-page career-workspace"><span class="browser-domain">northbridge-projects.example/workspace</span><div class="career-stage-strip">${['Training','Trial','Commission','Priority'].map((label, index) => `<span class="${index + 1 <= stage ? 'active' : ''}"><i>${index + 1}</i>${label}</span>`).join('')}</div>${content}</div>`;
    renderHome();
  }

  function submitCareerProfile() {
    const steps = state.taskState.career.steps;
    if (!steps.profileSubmitted) {
      steps.profileSubmitted = true;
      state.privacyExposure += 1;
      addHistory('career-profile-submitted', '向外部项目工作台提供了模拟电话号码及收款资料');
      advanceTime(4);
      saveState();
    }
    renderCareerWorkspace();
  }

  function payCareerTrial() {
    const steps = state.taskState.career.steps;
    if (!steps.trialPaid) {
      steps.trialPaid = true;
      state.balance -= 120;
      state.transactions.unshift({ title: 'PROJECT TRIAL PURCHASE', time: `今天 ${formatTime(state.time)}`, amount: -120 });
      advanceTime(2);
      state.balance += 146;
      state.transactions.unshift({ title: 'PROJECT TRIAL SETTLEMENT', time: `今天 ${formatTime(state.time)}`, amount: 146 });
      steps.trialCommissionReceived = true;
      steps.largeDepositRequested = true;
      addHistory('career-trial-returned', '完成HK$120试做后收到HK$146真实返款');
      state.notifications.unshift({ id: `n-career-commission-${Date.now()}`, app: 'bank', title: '银行', body: '入账 HK$146.00', time: formatTime(state.time), unread: true });
      saveState();
      playSound('notification');
    }
    renderCareerWorkspace();
  }

  function payCareerLargeTask() {
    const steps = state.taskState.career.steps;
    if (!state.history.some((item) => item.label === 'career-large-paid')) {
      state.balance -= 2400;
      state.moneyLost += 2400;
      state.transactions.unshift({ title: 'PROJECT PRIORITY DEPOSIT', time: `今天 ${formatTime(state.time)}`, amount: -2400 });
      addHistory('career-large-paid', '收到小额返佣后继续支付HK$2,400高额任务押金');
      advanceTime(3);
      triggerRecoveryScam();
      saveState();
      playSound('notification');
    }
    els.appContent.innerHTML = `<div class="fake-page"><span class="browser-domain">northbridge-projects.example/workspace</span><div class="fake-logo">!</div><h2>Account review required</h2><p>The batch contains a data mismatch. Complete another matching task before commission and deposit can be withdrawn.</p></div>`;
    renderHome();
  }

  function verifyCareerChannel() {
    const steps = state.taskState.career.steps;
    steps.verified = true;
    state.taskState.career.status = 'done';
    addEvidence('career-channel', '从原招聘平台及公司公开联系方式确认没有该研究助理转介或任务充值安排');
    addHistory('career-channel-verified', '独立核实招聘与任务充值安排');
    saveState();
    showDialog('招聘渠道核实', '原职位页面没有把申请转交给 Northbridge Talent；真实雇主也没有“购买样品、充值任务、完成后返佣”的入职流程。', [{ label: '知道了', action: 'close-overlay', kind: 'primary-action' }]);
  }

  function processHealthCancellation() {
    if (!state.history.some((item) => item.label === 'health-cancel-paid')) {
      state.privacyExposure += 2;
      state.balance -= 388;
      state.moneyLost += 388;
      state.transactions.unshift({ title: 'HEALTH COVERAGE VERIFICATION', time: `今天 ${formatTime(state.time)}`, amount: -388 });
      addHistory('health-cancel-paid', '在假冒取消页面提交银行卡资料并产生HK$388模拟扣款');
      advanceTime(2);
      triggerRecoveryScam();
      saveState();
      playSound('notification');
    }
    els.appContent.innerHTML = `<div class="fake-page"><span class="browser-domain">medical-service-cancel.example</span><div class="fake-logo">…</div><h2>Cancellation under review</h2><p>The verification amount has been received. Keep this page open while an agent reviews your cancellation.</p></div>`;
    renderHome();
  }

  function processMarketplaceVerification() {
    if (!state.history.some((item) => item.label === 'market-verification-paid')) {
      state.privacyExposure += 2;
      state.balance -= 680;
      state.moneyLost += 680;
      state.transactions.unshift({ title: 'MARKETPLACE VERIFICATION', time: `今天 ${formatTime(state.time)}`, amount: -680 });
      addHistory('market-verification-paid', '为领取不存在的二手平台款项支付HK$680验证转账');
      advanceTime(2);
      triggerRecoveryScam();
      saveState();
      playSound('notification');
    }
    els.appContent.innerHTML = `<div class="fake-page"><span class="browser-domain">marketplace-protection.example</span><div class="fake-logo">!</div><h2>Verification mismatch</h2><p>The amount entered does not match. Contact the buyer and complete another verification to unlock the held payment.</p></div>`;
    renderHome();
  }

  function acceptRecoveryIntake() {
    const steps = state.taskState.recovery.steps;
    if (!steps.intakeAccepted) {
      steps.intakeAccepted = true;
      state.messages.lawyer = {
        id: 'thread-lawyer', sender: '周律师 · 资金追讨', number: '法律团队聊天', unread: true,
        items: [
          { from: 'them', time: formatTime(state.time), text: `你好，我是受理台转介的周律师。案件CA-${String(state.seed).slice(0, 6).toUpperCase()}由我作初步评估。` },
          { from: 'them', time: formatTime(state.time), text: '我们在成功追回前不收律师费。请先看电子委托摘要；之后会由调查工作组与你核对资金路径。' }
        ]
      };
      state.notifications.unshift({ id: `n-lawyer-${Date.now()}`, app: 'messages', title: '周律师 · 资金追讨', body: '已收到案件转介，请查看委托摘要', time: formatTime(state.time), unread: true, target: 'thread-lawyer' });
      addHistory('recovery-intake-accepted', '同意退款协助客服把案件转交合作律师');
      advanceTime(2);
      saveState();
      playSound('notification');
    }
    openApp('messages', 'thread-lawyer');
  }

  function transferRecoveryInvestigator() {
    const steps = state.taskState.recovery.steps;
    if (!steps.investigatorContacted) {
      steps.investigatorContacted = true;
      state.messages.investigator = {
        id: 'thread-investigator', sender: '调查工作组 · L. Wong', number: '加密案件聊天', unread: true,
        items: [
          { from: 'them', time: formatTime(state.time), text: '周律师已把案件交给我。我们正在尝试锁定收款路径，请不要向原收款人透露调查进度。' },
          { from: 'them', time: formatTime(state.time), text: '下一步要远程查看交易记录和银行通知。打开会话后我会逐项指示：https://secure-case-assist.example/session' }
        ]
      };
      state.notifications.unshift({ id: `n-investigator-${Date.now()}`, app: 'messages', title: '调查工作组 · L. Wong', body: '已接收案件，请建立核验会话', time: formatTime(state.time), unread: true, target: 'thread-investigator' });
      addHistory('recovery-investigator-handoff', '律师把案件转交自称调查工作组的另一联系人');
      advanceTime(2);
      saveState();
      playSound('notification');
    }
    openApp('messages', 'thread-investigator');
  }

  function grantRecoveryRemoteAccess() {
    const steps = state.taskState.recovery.steps;
    if (!steps.remoteAccessGranted) {
      steps.remoteAccessGranted = true;
      steps.bankingDetailsShared = true;
      state.privacyExposure += 3;
      addHistory('recovery-remote-access', '允许调查员进行模拟远程协助并查看银行通知');
      advanceTime(2);
      saveState();
    }
    renderBrowserPage('recovery-investigator');
  }

  function payRecoveryGuarantee() {
    const steps = state.taskState.recovery.steps;
    if (!steps.guaranteePaid) {
      steps.guaranteePaid = true;
      state.balance -= 300;
      state.moneyLost += 300;
      state.transactions.unshift({ title: 'RECOVERY GUARANTEE', time: `今天 ${formatTime(state.time)}`, amount: -300 });
      addHistory('recovery-guarantee-paid', '在多角色追款流程中支付HK$300资金核验保证金');
      advanceTime(2);
      saveState();
      playSound('notification');
    }
    els.appContent.innerHTML = `<div class="fake-page handoff-page"><span class="browser-domain">secure-case-assist.example/session</span>${recoveryHandoff(3)}<div class="fake-logo">…</div><h2>Compliance review pending</h2><p>Your verification balance is recorded. The investigator may request another compliance amount before the release window can be opened.</p></div>`;
    renderHome();
  }

  function processResearchOnboarding() {
    if (!state.history.some((item) => item.label === 'research-profile-submitted')) {
      state.privacyExposure += 2;
      addHistory('research-profile-submitted', '向外部研究表单提交了模拟学号及电话号码');
      advanceTime(3);
      saveState();
    }
    els.appContent.innerHTML = `
      <div class="fake-page"><span class="browser-domain">research-onboarding.example/tasks</span><div class="fake-logo">1</div><h2>First research task</h2><p>Purchase HK$800 in participant e-vouchers now. The professor will reimburse you together with your first salary.</p><div class="fake-fee"><span>Participant incentives</span><strong>HK$800</strong></div><div class="action-row"><button class="primary-action" type="button" data-action="research-buy-vouchers">购买电子礼券</button></div></div>`;
    renderHome();
  }

  function processResearchVoucherPayment() {
    if (!state.history.some((item) => item.label === 'research-vouchers-paid')) {
      state.balance -= 800;
      state.moneyLost += 800;
      state.transactions.unshift({ title: 'E-VOUCHER PURCHASE', time: `今天 ${formatTime(state.time)}`, amount: -800 });
      state.notifications.unshift({ id: 'n-bank-research-' + Date.now(), app: 'bank', title: '银行', body: '电子礼券交易 HK$800.00', time: formatTime(state.time), unread: true });
      addHistory('research-vouchers-paid', '为冒充教授的研究项目购买HK$800电子礼券');
      advanceTime(3);
      triggerRecoveryScam();
      saveState();
      playSound('notification');
    }
    els.appContent.innerHTML = `<div class="fake-page"><span class="browser-domain">research-onboarding.example</span><div class="fake-logo">✓</div><h2>Task submitted</h2><p>Your e-voucher codes have been received. Reimbursement is pending professor approval.</p></div>`;
    renderHome();
  }

  function processFakeEventPayment() {
    if (!state.history.some((item) => item.label === 'fake-event-paid')) {
      state.balance -= 180;
      state.moneyLost += 180;
      state.transactions.unshift({ title: 'FPS · SIMULATED RECIPIENT', time: `今天 ${formatTime(state.time)}`, amount: -180 });
      state.notifications.unshift({ id: 'n-bank-event-' + Date.now(), app: 'bank', title: '银行', body: 'FPS 转账 HK$180.00', time: formatTime(state.time), unread: true });
      addHistory('fake-event-paid', '向活动邮件提供的个人FPS账户支付HK$180');
      advanceTime(2);
      triggerRecoveryScam();
      saveState();
      playSound('notification');
    }
    els.appContent.innerHTML = `<div class="fake-page"><span class="browser-domain">student-event-payment.example</span><div class="fake-logo">✓</div><h2>Payment received</h2><p>Please email your payment screenshot. Your QR ticket is still pending manual verification.</p><div class="action-row"><button class="primary-action" type="button" data-action="event-open-polyu">在 PolyULife 检查报名</button><button class="secondary-action" type="button" data-action="open-bank-app">查看银行记录</button></div></div>`;
    renderHome();
  }

  function registerOfficialEvent() {
    const task = state.taskState.event;
    if (!task.steps.registered) {
      state.balance -= 60;
      state.transactions.unshift({ title: 'POLYULIFE EVENT REGISTRATION', time: `今天 ${formatTime(state.time)}`, amount: -60 });
      task.steps.registered = true;
      task.decision = 'attend';
      task.status = 'done';
      addHistory('official-event-registration', '通过 PolyULife 支付HK$60并完成活动报名');
      advanceTime(2);
      saveState();
      playSound('success');
      showToast('活动报名完成，QR ticket 已发出');
    }
    renderPolyUEventDetail();
    renderHome();
  }

  function skipOfficialEvent() {
    const task = state.taskState.event;
    task.decision = 'skip';
    task.status = 'done';
    addHistory('official-event-skipped', '查看官方活动资料后决定暂不参加');
    advanceTime(1);
    saveState();
    playSound('success');
    renderPolyUEventDetail();
    renderHome();
    showToast('已保留决定：暂不参加');
  }

  function processFakePost() {
    if (!state.history.some((item) => item.label === 'fake-post-paid')) {
      state.privacyExposure += 2;
      state.moneyLost += 32;
      state.balance -= 32;
      state.transactions.unshift({ title: 'ONLINE CARD PAYMENT', time: `今天 ${formatTime(state.time)}`, amount: -32 });
      addHistory('fake-post-paid', '在短信页面使用模拟资料并支付HK$32');
      state.notifications.unshift({ id: 'n-bank-' + Date.now(), app: 'bank', title: '银行', body: '网上交易 HK$32.00', time: formatTime(state.time), unread: true });
      advanceTime(3);
      triggerRecoveryScam();
      saveState();
      playSound('notification');
    }
    els.appContent.innerHTML = `
      <div class="fake-page"><span class="browser-domain">parcel-update.example</span><div class="fake-logo">✓</div><h2>资料处理中</h2><p>系统显示地址更新请求已提交。请等待进一步通知。</p><div class="action-row"><button class="primary-action" type="button" data-action="open-bank-app">查看银行通知</button><button class="secondary-action" type="button" data-action="browser-home">返回浏览器</button></div></div>`;
    renderHome();
  }

  function freezeCard() {
    state.cardFrozen = true;
    addHistory('card-frozen', '通过银行App冻结银行卡');
    saveState();
    renderBank();
    playSound('success');
    showToast('银行卡已冻结');
  }

  function showReview() {
    state.dayEnded = true;
    saveState();
    const done = taskDoneCount();
    const total = REQUIRED_TASK_IDS.length;
    const verification = state.evidence.length;
    let style = '凭感觉行动';
    if (verification >= 4 && done === total) style = '完成闭环查证';
    else if (verification >= 3) style = '建立独立证据';
    else if (verification >= 1) style = '有核对意识';
    const identityTruth = state.contactVariant === 'real'
      ? '陌生号码确实是换号后的阿杰，但私人转账要求仍不应仅凭来电处理。'
      : (state.contactVariant === 'grey'
        ? '来电者确实参与场地联络，但不代表他获授权索取学生名单或私人付款。人物真实和要求合理是两件事。'
        : '陌生号码冒充阿杰，并利用你在通话中提供的信息继续扮演。');
    const researchOutcome = state.taskState.research.steps.resolved
      ? '你从官方目录重新联系学院，确认研究邀请冒充教授。'
      : (state.history.some((item) => item.label === 'research-vouchers-paid') ? '你为邮件中的研究安排购买了电子礼券，但尚未通过学院核实。' : (state.taskState.research.steps.invitationRead ? '你看过研究邀请，但没有把它当成必须立即回复的任务。' : '你今天没有打开这封研究邀请。'));
    const eventOutcome = state.taskState.event.decision === 'attend'
      ? '你查看官方资料后，自主决定参加，并在 PolyULife 内完成报名。'
      : (state.taskState.event.decision === 'skip' ? '你核对了活动资料，并决定这次不参加；没有报名也不算任务失败。' : (state.history.some((item) => item.label === 'fake-event-paid') ? '你向邮件提供的个人 FPS 付款，但官方活动并未因此完成报名。' : (state.taskState.event.steps.officialEventOpened ? '你看过官方活动资料，暂时没有决定是否参加。' : '你今天没有处理这则活动邀请。')));
    const careerOutcome = state.history.some((item) => item.label === 'career-large-paid')
      ? '你在收到小额返佣后继续支付了更大任务押金。'
      : (state.taskState.career.steps.trialCommissionReceived ? '你完成小额试做并收到返佣，但没有因此继续投入更大金额。' : (state.taskState.career.steps.verified ? '你从独立渠道核实了招聘或追款安排。' : '你没有把陌生招聘转介当成必须完成的任务。'));
    const recoveryOutcome = state.recoveryScamTriggered
      ? (state.taskState.recovery.steps.investigatorContacted
        ? '客服把你转给律师，律师再转给调查员；角色变多、文件变完整，并没有产生独立核实。'
        : '损失后出现了自称协助追款的人；掌握旧案资料仍不等于身份可信。')
      : '今天没有触发失款后的二次联络。';
    const friendOutcome = state.taskState.friend.steps.originalNumberCalled
      ? '你离开原聊天账号，从已保存号码联系Mandy；历史对话和熟悉语气没有被当成身份证明。'
      : (state.taskState.friend.steps.paid
        ? '你根据聊天账号里的旧记录和熟悉语气完成了垫付款，但没有从原号码核实。'
        : (state.taskState.friend.steps.messageRead ? '你看过Mandy账号提出的垫付请求，暂时没有把它当成必须立刻完成的任务。' : '你今天没有打开Mandy的聊天。'));
    els.overlayLayer.innerHTML = `
      <section class="review-overlay">
        <span class="simulation-tag">DAY REVIEW · ${formatTime(state.time)}</span>
        <h1>${esc(ui(style))}</h1>
        <p>${esc(ui('这不是正确答案清单，而是你今天留下的行动记录。'))}</p>
        <article class="review-card"><strong>${esc(ui('必须处理的事项'))} ${done} / ${total}</strong><p>${esc(ui(state.taskState.parcel.status === 'done' ? '交换申请文件已领取。' : '交换申请文件尚未领取。'))} ${esc(ui(state.taskState.contact.status === 'done' ? '迎新联系人已处理。' : '迎新联系人身份仍未确认。'))}</p></article>
        <article class="review-card"><strong>${esc(ui('收件箱里的选择'))}</strong><p>${esc(ui(researchOutcome))} ${esc(ui(eventOutcome))}</p></article>
        <article class="review-card"><strong>${esc(ui('熟人账号里的请求'))}</strong><p>${esc(ui(friendOutcome))}</p></article>
        <article class="review-card"><strong>${esc(ui('早期返佣不等于工作真实'))}</strong><p>${esc(ui(careerOutcome))}</p></article>
        ${state.recoveryScamTriggered ? `<article class="review-card"><strong>${esc(ui('出现损失后的联络'))}</strong><p>${esc(ui(recoveryOutcome))}</p></article>` : ''}
        <article class="review-card"><strong>${esc(ui('独立来源'))} ${verification}</strong><p>${verification ? state.evidence.map((item) => esc(ui(item.label))).join(state.language === 'en' ? '; ' : '；') : esc(ui('今天没有从独立来源保存核实信息。'))}</p></article>
        <article class="review-card"><strong>${esc(ui('资料暴露'))} ${state.privacyExposure} · ${esc(ui('金钱损失'))} ${esc(formatHKD(state.moneyLost))}</strong><p>${esc(ui(state.cardFrozen ? '银行卡已冻结，完成了一项止损操作。' : state.moneyLost ? '发生付款后尚未冻结银行卡。' : '没有记录到资金损失。'))}</p></article>
        <article class="review-card"><strong>${esc(ui('陌生来电的真相'))}</strong><p>${esc(ui(identityTruth))}</p></article>
        <div class="review-actions"><button class="primary-action" type="button" data-action="close-review">${esc(ui('继续查看手机'))}</button><button class="secondary-action" type="button" data-action="reset-day">${esc(ui('换一种情况重玩'))}</button></div>
      </section>`;
  }

  function resetDay() {
    const preferences = { language: state.language, region: state.region, soundEnabled: state.soundEnabled };
    stopAllAudio();
    localStorage.removeItem(STORAGE_KEY);
    state = DATA.createInitialState();
    Object.assign(state, preferences);
    callSession = null;
    clearTimeout(callbackTimer);
    resetUnlockGesture();
    closeOverlay();
    renderLock();
    renderHome();
    updateClock();
    saveState();
    showScreen('lockScreen');
  }

  function handleAction(action, target) {
    const id = target.dataset.id;
    switch (action) {
      case 'set-language': {
        const language = target.dataset.value;
        if (!['zh-CN', 'en'].includes(language)) break;
        state.language = language;
        saveState();
        refreshLocalizedUI();
        showToast('语言已更新');
        break;
      }
      case 'set-region': {
        const region = target.dataset.value;
        if (!['HK', 'CN', 'US', 'GB'].includes(region)) break;
        state.region = region;
        saveState();
        refreshLocalizedUI();
        showToast('地区已更新');
        break;
      }
      case 'mail-tab':
        state.mailTab = target.dataset.value === 'other' ? 'other' : 'focused';
        saveState();
        renderMail();
        break;
      case 'mail-filter':
        state.mailUnreadOnly = !state.mailUnreadOnly;
        saveState();
        renderMail();
        showToast(state.mailUnreadOnly ? '仅未读' : '显示全部');
        break;
      case 'mail-inbox':
        renderMail();
        break;
      case 'mail-toggle-translation': {
        const mail = state.mails.find((item) => item.id === id);
        if (!mail || !mail.translation) break;
        const wasTranslated = mailCopy(mail).translated;
        if (!wasTranslated && mail.language === state.language) break;
        state.mailTranslations[id] = !wasTranslated;
        saveState();
        closeMailMessageMenu(false);
        renderMailDetail(mail);
        const senderMenu = els.appContent.querySelector(`.outlook-sender-more[data-id="${id}"]`);
        if (senderMenu) senderMenu.focus();
        showToast(wasTranslated ? '正在显示原文' : '邮件已翻译');
        break;
      }
      case 'mail-account':
        showDialog(localized('PolyU 学生邮箱', 'PolyU Student Mail'), localized('这里只显示与今天情境有关的模拟邮件，不连接真实学校账户。', 'Only simulated messages related to today are shown. No real university account is connected.'), [
          { label: localized('继续查看', 'Keep browsing'), action: 'mail-close-dialog', kind: 'primary-action' }
        ]);
        break;
      case 'mail-compose':
        showDialog(ui('写邮件'), localized('此情境暂时不需要主动发送邮件。你仍可通过官方目录中的地址或电话独立核实。', 'This scenario does not require an outgoing message. You can still verify independently using an address or phone number from the official directory.'), [
          { label: localized('知道了', 'Got it'), action: 'mail-close-dialog', kind: 'primary-action' }
        ]);
        break;
      case 'mail-search':
        showDialog(ui('搜索邮件'), localized('可以按发件人、主题或内容搜索；当前四封情境邮件已全部加载。', 'Search can use sender, subject, or message text. All four scenario messages are already loaded.'), [
          { label: localized('关闭', 'Close'), action: 'mail-close-dialog', kind: 'primary-action' }
        ]);
        break;
      case 'mail-calendar':
        showDialog(ui('日历'), localized('Outlook 风格导航保留了日历入口；校内课程和活动仍以 PolyULife 为准。', 'The Outlook-style navigation keeps a Calendar entry. Campus classes and events remain authoritative in PolyULife.'), [
          { label: localized('关闭', 'Close'), action: 'mail-close-dialog', kind: 'primary-action' }
        ]);
        break;
      case 'mail-flag':
        if (els.overlayLayer.querySelector('.outlook-mail-menu-overlay')) closeMailMessageMenu();
        showToast('邮件已标记');
        break;
      case 'mail-message-menu':
      case 'mail-more':
        {
          const mail = state.mails.find((item) => item.id === id);
          if (mail) showMailMessageMenu(mail);
        }
        break;
      case 'mail-menu-close':
        closeMailMessageMenu();
        break;
      case 'mail-mark-unread': {
        const mail = state.mails.find((item) => item.id === id);
        if (mail) mail.unread = true;
        saveState();
        closeMailMessageMenu();
        showToast('已标记为未读');
        break;
      }
      case 'mail-react':
        closeMailMessageMenu();
        showToast(`${ui('反应已添加')} ${target.dataset.reaction || ''}`.trim());
        break;
      case 'mail-print':
        closeMailMessageMenu();
        showToast('打印功能在模拟器中不可用');
        break;
      case 'mail-more-addins':
        closeMailMessageMenu();
        showToast('暂时没有其他加载项');
        break;
      case 'mail-reply':
        if (els.overlayLayer.querySelector('.outlook-mail-menu-overlay')) closeMailMessageMenu(false);
        {
          const mail = state.mails.find((item) => item.id === id);
          if (!mail) break;
          state.openMailComposerId = mail.id;
          saveState();
          renderMailDetail(mail);
          requestAnimationFrame(() => $('mailReplyInput')?.focus());
        }
        break;
      case 'mail-discard':
        state.openMailComposerId = null;
        state.mailDrafts[id] = '';
        saveState();
        {
          const mail = state.mails.find((item) => item.id === id);
          if (mail) renderMailDetail(mail);
        }
        break;
      case 'mail-forward':
        if (els.overlayLayer.querySelector('.outlook-mail-menu-overlay')) closeMailMessageMenu(false);
        showDialog(ui('转发'), ui('此模拟不发送真实邮件。'), [
          { label: localized('关闭', 'Close'), action: 'mail-close-dialog', kind: 'primary-action' }
        ]);
        break;
      case 'mail-close-dialog':
        closeOverlay();
        break;
      case 'open-thread': {
        const key = Object.keys(state.messages).find((threadKey) => state.messages[threadKey].id === id);
        if (key) renderMessageThread(key);
        break;
      }
      case 'open-mail': {
        const mail = state.mails.find((item) => item.id === id);
        if (mail) renderMailDetail(mail);
        break;
      }
      case 'message-open-link': state.browserPage = 'fake-post'; state.browserQuery = ''; saveState(); openApp('browser'); break;
      case 'message-copy-tracking':
        addEvidence('sms-tracking', '保存了短信中的不完整编号 HKP8234');
        showToast('已保存短信中的编号'); saveState(); break;
      case 'message-search-domain': state.browserPage = 'home'; state.browserQuery = 'parcel-update.example'; saveState(); openApp('browser'); break;
      case 'mail-save-tracking':
        state.taskState.parcel.steps.trackingSaved = true;
        addEvidence('full-tracking', '从收发室邮件取得完整运单号');
        saveState(); showToast('完整运单号已保存'); renderHome(); break;
      case 'research-open-link':
        state.browserPage = 'research-onboarding'; state.browserQuery = ''; saveState(); openApp('browser'); break;
      case 'research-check-directory':
        state.browserPage = 'staff-directory'; state.browserQuery = 'Prof. C. W. Chan research'; saveState(); openApp('browser'); break;
      case 'research-submit-simulated': processResearchOnboarding(); break;
      case 'research-buy-vouchers': processResearchVoucherPayment(); break;
      case 'research-contact-official': callContact('contact-department'); break;
      case 'career-open-workspace': state.browserPage = 'career-workspace'; saveState(); openApp('browser'); break;
      case 'career-submit-profile': submitCareerProfile(); break;
      case 'career-pay-trial': payCareerTrial(); break;
      case 'career-pay-large': payCareerLargeTask(); break;
      case 'career-check-official': verifyCareerChannel(); break;
      case 'health-open-cancel': state.browserPage = 'health-cancel'; saveState(); openApp('browser'); break;
      case 'health-check-official': state.browserPage = 'health-official'; saveState(); openApp('browser'); break;
      case 'health-submit-cancel': processHealthCancellation(); break;
      case 'health-save-check': addEvidence('health-official', '从自行打开的医疗应用确认没有试用或自动续费项目'); saveState(); showToast('查询结果已保存'); break;
      case 'market-open-protection': state.browserPage = 'market-protection'; saveState(); openApp('browser'); break;
      case 'market-check-platform': state.browserPage = 'market-official'; saveState(); openApp('browser'); break;
      case 'market-submit-verification': processMarketplaceVerification(); break;
      case 'market-save-check': addEvidence('market-official', '返回二手平台内订单确认买家并未付款'); saveState(); showToast('查询结果已保存'); break;
      case 'recovery-open-portal': state.taskState.recovery.steps.portalOpened = true; state.browserPage = 'recovery-portal'; saveState(); openApp('browser'); break;
      case 'recovery-accept-intake': acceptRecoveryIntake(); break;
      case 'recovery-open-lawyer': state.browserPage = 'recovery-lawyer'; saveState(); openApp('browser'); break;
      case 'recovery-transfer-investigator': transferRecoveryInvestigator(); break;
      case 'recovery-open-investigator': state.browserPage = 'recovery-investigator'; saveState(); openApp('browser'); break;
      case 'recovery-grant-remote': grantRecoveryRemoteAccess(); break;
      case 'recovery-pay-guarantee': payRecoveryGuarantee(); break;
      case 'recovery-check-official': state.browserPage = 'adcc-advice'; saveState(); openApp('browser'); break;
      case 'recovery-save-official': state.taskState.recovery.steps.officialAdviceChecked = true; state.taskState.recovery.status = 'done'; addEvidence('recovery-official', '从官方防骗资讯确认追款机构不会要求转账、银行密码或保证金'); saveState(); showToast('查询结果已保存'); break;
      case 'friend-pay': payFriendRequest(); break;
      case 'friend-call-original': callContact('contact-mandy'); break;
      case 'event-open-payment':
        state.browserPage = 'event-payment'; state.browserQuery = ''; saveState(); openApp('browser'); break;
      case 'event-open-polyu':
      case 'event-open-detail':
        state.polyuPage = 'event-detail'; saveState(); openApp('polyu'); break;
      case 'event-pay-fake': processFakeEventPayment(); break;
      case 'event-register-official': registerOfficialEvent(); break;
      case 'event-skip-official': skipOfficialEvent(); break;
      case 'call-quick': submitCallReply(target.dataset.label || '', target.dataset.intent || ''); break;
      case 'call-replay-voice': {
        if (!callSession) break;
        const latestCallerText = [...callSession.transcript].reverse().find((turn) => turn.role === 'caller')?.text || '';
        const node = getCallNode(callSession.scenario, callSession.node);
        playCallerVoice(resolveCallCopy(node.audio) || '', latestCallerText, true);
        break;
      }
      case 'call-minimize': minimizeCall(); break;
      case 'call-resume': resumeCall(); break;
      case 'call-finish-judge': finishCallForJudgement(); break;
      case 'call-judgement':
        state.callJudgements[id] = { verdict: target.dataset.value, time: formatTime(state.time) };
        addHistory('call-judgement', `保存了对号码的暂时判断：${target.dataset.value}`);
        saveState();
        closeOverlay();
        showToast('判断已保存，之后仍可继续核对');
        if (state.currentApp) renderApp(state.currentApp);
        renderHome();
        break;
      case 'call-judgement-dismiss':
        closeOverlay();
        showToast('暂未保存判断，可以继续寻找证据');
        if (state.currentApp) renderApp(state.currentApp);
        renderHome();
        break;
      case 'call-review-judgement': showCallJudgement(id); break;
      case 'call-hall': callContact('contact-hall'); break;
      case 'call-hall-ask-identity': submitCallReply('请问这里是什么单位？', 'ask_identity'); break;
      case 'call-hall-describe-request': submitCallReply('我收到通知有份文件，想查一下', 'describe_request'); break;
      case 'call-hall-ask-fee': submitCallReply('请问领取是否需要缴费？', 'ask_fee'); break;
      case 'call-hall-share-partial': submitCallReply('运单尾号是1305，送到学生宿舍', 'share_partial'); break;
      case 'call-hall-provide-tracking': submitCallReply('完整运单号是 RR 482 917 305 HK', 'share_full'); break;
      case 'call-department-ask-identity': submitCallReply('请问这里是什么办公室？', 'ask_identity'); break;
      case 'call-department-describe-request': submitCallReply('我想核实一封研究邀请', 'describe_request'); break;
      case 'call-department-ask-research': submitCallReply('主题是Research Assistant，发件地址是outlook.example', 'share_mail'); break;
      case 'confirm-department': confirmDepartment(); break;
      case 'call-official-later': finishCallForJudgement(); break;
      case 'confirm-hall': confirmHall(); break;
      case 'collect-parcel': collectParcel(); break;
      case 'open-contacts': openApp('contacts'); break;
      case 'call-contact': callContact(id); break;
      case 'call-number': placeManualCall(target.dataset.number || ''); break;
      case 'phone-view':
        state.phoneView = target.dataset.value === 'keypad' ? 'keypad' : 'recents';
        saveState(); renderPhone(); break;
      case 'dial-key':
        state.dialNumber = normaliseDialNumber(`${state.dialNumber || ''}${target.dataset.value || ''}`);
        saveState(); renderPhone(); break;
      case 'dial-delete':
        state.dialNumber = String(state.dialNumber || '').slice(0, -1);
        saveState(); renderPhone(); break;
      case 'end-call': endCall('主动结束陌生来电'); break;
      case 'call-guess-ajie': callClaimResponse('guess'); break;
      case 'call-ask-name': callClaimResponse('ask'); break;
      case 'call-later': finishCallForJudgement(); break;
      case 'call-ask-document':
        addEvidence('requested-document', '要求对方提供报价单及正式收款资料');
        submitCallReply('先发正式文件给我', 'ask_document');
        break;
      case 'call-check-kaman':
        addHistory('check-promised', '告诉来电者会先向共同联系人确认');
        minimizeCallAndResearch();
        break;
      case 'call-transfer':
        showDialog('确认私人转账', '对方要求你向一个个人FPS账户支付HK$1,200。银行只会显示收款人资料，不会判断活动是否真实。', [
          { label: '确认转账', action: 'confirm-transfer', kind: 'danger-action' },
          { label: '返回通话', action: 'resume-call' }
        ]);
        break;
      case 'confirm-transfer': completeTransfer(); break;
      case 'resume-call': resumeCall(); break;
      case 'open-browser-page': state.browserPage = target.dataset.page; saveState(); renderBrowser(); break;
      case 'browser-home': state.browserPage = 'home'; saveState(); renderBrowser(); break;
      case 'open-mail-app': state.browserPage = 'home'; saveState(); openApp('mail', 'mail-parcel'); break;
      case 'save-official-tracking':
        addEvidence('official-tracking', '从自行打开的邮政入口确认送达机构收发点');
        saveState(); showToast('官方查询结果已保存'); break;
      case 'save-scameter-result':
        addEvidence('scameter', 'Scameter暂无记录，未把“查无结果”当作安全证明');
        saveState(); showToast('查询结果已保存'); break;
      case 'fake-post-proceed': processFakePost(); break;
      case 'open-bank-app': state.browserPage = 'home'; saveState(); openApp('bank'); break;
      case 'open-polyu-app': state.browserPage = 'home'; saveState(); openApp('polyu'); break;
      case 'freeze-card': freezeCard(); break;
      case 'bank-help':
        showDialog('银行客服', state.moneyLost ? '客服已记录网上交易，并建议立即冻结银行卡及检查其他账户。' : '客服确认目前没有异常交易。请勿向来电者提供验证码。', [
          { label: '关闭', action: 'close-overlay', kind: 'primary-action' }
        ]);
        break;
      case 'polyu-home': state.polyuPage = 'home'; saveState(); renderPolyU(); break;
      case 'polyu-calendar': state.polyuPage = 'calendar'; saveState(); renderPolyU(); break;
      case 'polyu-notifications': state.polyuPage = 'notifications'; saveState(); renderPolyU(); break;
      case 'polyu-qr': state.polyuPage = 'qr'; saveState(); renderPolyU(); break;
      case 'polyu-more': state.polyuPage = 'more'; saveState(); renderPolyU(); break;
      case 'polyu-calendar-view':
        state.polyuPage = 'calendar';
        state.polyuCalendarView = target.dataset.view || 'month';
        saveState(); renderPolyU(); break;
      case 'polyu-timetable':
        state.polyuPage = 'calendar'; state.polyuCalendarView = 'week';
        saveState(); renderPolyU(); break;
      case 'polyu-menu':
        showDialog('PolyULife', '这是根据校园应用界面制作的教学模拟，不连接真实NetID、课表或付款资料。', [
          { label: '返回手机桌面', action: 'exit-polyu', kind: 'primary-action' },
          { label: '继续使用', action: 'close-overlay' }
        ]);
        break;
      case 'exit-polyu': goHome(); break;
      case 'polyu-search': showDialog('Search', '可搜索课室、课程和校园服务。当前任务可直接查看COMP2033或N003。', [{ label: '关闭', action: 'close-overlay', kind: 'primary-action' }]); break;
      case 'polyu-room': showDialog('Room availability', 'N003今天10:30–12:30用于COMP2033课堂。', [{ label: '关闭', action: 'close-overlay', kind: 'primary-action' }]); break;
      case 'polyu-food': showDialog('Food', 'VA学生食堂营业至20:00。此页面没有待处理付款。', [{ label: '关闭', action: 'close-overlay', kind: 'primary-action' }]); break;
      case 'polyu-progress': showDialog('Study progress', 'Semester 1 · Week 12。当前没有逾期学习活动。', [{ label: '关闭', action: 'close-overlay', kind: 'primary-action' }]); break;
      case 'polyu-filter': showDialog('Event filters', '当前显示Class、Exam、Payment和Academic calendar四类事件。', [{ label: '关闭', action: 'close-overlay', kind: 'primary-action' }]); break;
      case 'polyu-date': showToast('这一天没有与当前任务相关的事件'); break;
      case 'polyu-calendar-info': showDialog('Academic calendar', '这是校历事件，不要求通过短信链接付款或提供个人资料。', [{ label: '关闭', action: 'close-overlay', kind: 'primary-action' }]); break;
      case 'polyu-payment':
        addEvidence('polyu-payment', '从PolyULife确认目前没有待缴项目');
        saveState(); showDialog('缴费记录', '目前没有待缴学费或其他项目。任何声称“今天必须补缴”的信息都应再向学校确认。', [{ label: '知道了', action: 'close-overlay', kind: 'primary-action' }]);
        break;
      case 'polyu-map': showDialog('校园地图', '宿舍收发室位于大堂服务台，开放至17:00。N003位于N座地下。', [{ label: '关闭', action: 'close-overlay', kind: 'primary-action' }]); break;
      case 'polyu-notice': showDialog('COMP2033 课堂通知', '今天10:30课堂由原课室改至N003。此通知直接显示在模拟PolyULife内。', [{ label: '关闭', action: 'close-overlay', kind: 'primary-action' }]); break;
      case 'polyu-library': showDialog('图书馆', '今天没有待领取预约或即将到期的借阅项目。', [{ label: '关闭', action: 'close-overlay', kind: 'primary-action' }]); break;
      case 'polyu-job': showDialog('Job Board', '首个原型专注包裹与身份核实。校园职位会在下一天开放。', [{ label: '关闭', action: 'close-overlay', kind: 'primary-action' }]); break;
      case 'end-day': showReview(); break;
      case 'close-review': closeOverlay(); break;
      case 'reset-day': resetDay(); break;
      case 'start-day':
        state.openingBriefSeen = true;
        saveState();
        closeOverlay();
        if (state.currentApp) renderApp(state.currentApp);
        renderHome();
        break;
      case 'close-overlay': closeOverlay(); if (state.currentApp) renderApp(state.currentApp); renderHome(); break;
    }
  }

  function bindEvents() {
    els.unlockButton.addEventListener('pointerdown', beginUnlockPointer);
    window.addEventListener('pointermove', moveUnlockPointer, { passive: false });
    window.addEventListener('pointerup', (event) => endUnlockPointer(event, false), { passive: false });
    window.addEventListener('pointercancel', (event) => endUnlockPointer(event, true), { passive: false });
    window.addEventListener('blur', () => {
      if (unlockGesture.active && !unlockGesture.finishing) returnUnlockGesture();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && unlockGesture.active && !unlockGesture.finishing) returnUnlockGesture();
    });
    els.unlockButton.addEventListener('lostpointercapture', () => {
      if (unlockGesture.active && !unlockGesture.finishing) returnUnlockGesture();
    });
    els.unlockButton.addEventListener('click', (event) => {
      if (event.detail === 0) unlock();
    });
    els.soundToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleSound();
    });
    els.lockNotifications.addEventListener('click', (event) => {
      const button = event.target.closest('[data-open-app]');
      if (!button) return;
      playSound('tap');
      markNotification(button.dataset.notification);
      unlock(button.dataset.openApp, button.dataset.target || null);
    });
    [els.appGrid, els.appDock].forEach((container) => container.addEventListener('click', (event) => {
      const button = event.target.closest('[data-open-app]');
      if (button) { playSound('tap'); openApp(button.dataset.openApp); }
    }));
    els.todayCard.addEventListener('click', () => { playSound('tap'); openApp('tasks'); });
    els.todayCard.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault(); playSound('tap'); openApp('tasks');
    });
    els.openTasksShortcut.addEventListener('click', () => { playSound('tap'); openApp('tasks'); });
    els.appBack.addEventListener('click', () => { playSound('tap'); navigateBack(); });
    els.systemBack.addEventListener('click', () => { playSound('tap'); navigateBack(); });
    els.systemHome.addEventListener('click', () => { playSound('tap'); navigateHome(); });
    els.appMore.addEventListener('click', () => showDialog('模拟器', '当前进度会自动保存在这台设备上。你可以重新开始，系统会重新分配部分人物身份。', [
      { label: '重新开始', action: 'reset-day', kind: 'danger-action' },
      { label: '继续', action: 'close-overlay' }
    ]));
    els.appContent.addEventListener('click', (event) => {
      const target = event.target.closest('[data-action]');
      if (target) { playSound('tap'); handleAction(target.dataset.action, target); }
    });
    els.appContent.addEventListener('submit', (event) => {
      if (!['browserSearchForm', 'dialForm', 'contactsSearchForm', 'messageReplyForm', 'mailReplyForm'].includes(event.target.id)) return;
      event.preventDefault();
      if (event.target.id === 'messageReplyForm') {
        const key = event.target.dataset.thread;
        sendMessageReply(key, $('messageReplyInput')?.value || '');
        return;
      }
      if (event.target.id === 'mailReplyForm') {
        const mail = state.mails.find((item) => item.id === event.target.dataset.mail);
        sendMailReply(mail, $('mailReplyInput')?.value || '');
        return;
      }
      if (event.target.id === 'browserSearchForm') {
        const input = $('browserQuery');
        const query = input ? input.value.trim().slice(0, 80) : '';
        state.browserQuery = query;
        state.browserPage = 'home';
        if (query) {
          state.investigationQueries = [...state.investigationQueries.filter((item) => item.query !== query), { query, time: formatTime(state.time) }].slice(-12);
          addHistory('independent-search', `自行搜索：${query}`);
          advanceTime(1);
        }
        saveState();
        renderBrowser();
        return;
      }
      if (event.target.id === 'dialForm') {
        const input = $('dialNumber');
        placeManualCall(input ? input.value : state.dialNumber);
        return;
      }
      if (event.target.id === 'contactsSearchForm') {
        const input = $('contactsQuery');
        state.contactsQuery = input ? input.value.trim().slice(0, 60) : '';
        saveState();
        renderContacts();
      }
    });
    els.appContent.addEventListener('input', (event) => {
      if (event.target.id === 'dialNumber') state.dialNumber = normaliseDialNumber(event.target.value);
      if (event.target.id === 'messageReplyInput' && activeThreadKey) {
        state.messageDrafts[activeThreadKey] = event.target.value.slice(0, 500);
        saveState();
      }
      if (event.target.id === 'mailReplyInput' && activeMailId) {
        state.mailDrafts[activeMailId] = event.target.value.slice(0, 1200);
        saveState();
      }
      if (event.target.id === 'contactsQuery') {
        state.contactsQuery = event.target.value.slice(0, 60);
        renderContacts();
        const input = $('contactsQuery');
        if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
      }
    });
    els.overlayLayer.addEventListener('click', (event) => {
      const target = event.target.closest('[data-action]');
      if (target) { playSound('tap'); handleAction(target.dataset.action, target); }
    });
    els.overlayLayer.addEventListener('submit', (event) => {
      if (event.target.id !== 'callReplyForm') return;
      event.preventDefault();
      const input = $('callReplyInput');
      submitCallReply(input ? input.value : '');
    });
    els.activeCallBar.addEventListener('click', (event) => {
      const target = event.target.closest('[data-action]');
      if (target) { playSound('tap'); handleAction(target.dataset.action, target); }
    });
    document.addEventListener('keydown', (event) => {
      const mailMenu = els.overlayLayer.querySelector('.outlook-mail-menu-sheet');
      if (!mailMenu) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMailMessageMenu();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...mailMenu.querySelectorAll('button:not(:disabled)')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function init() {
    const preview = new URLSearchParams(window.location.search).get('preview');
    if (preview) {
      state = DATA.createInitialState();
      state.unlocked = preview !== 'lock';
    }
    Object.assign(els, {
      statusTime: $('statusTime'), lockTime: $('lockTime'), phoneViewport: $('phoneViewport'), lockScreen: $('lockScreen'),
      homeScreen: $('homeScreen'), appScreen: $('appScreen'), lockNotifications: $('lockNotifications'),
      unlockButton: $('unlockButton'), appGrid: $('appGrid'), appDock: $('appDock'),
      todayCard: $('todayCard'), homeTodoList: $('homeTodoList'), todayProgress: $('todayProgress'), todayProgressBar: $('todayProgressBar'),
      openTasksShortcut: $('openTasksShortcut'), appBack: $('appBack'), appMore: $('appMore'),
      appEyebrow: $('appEyebrow'), appTitle: $('appTitle'), appContent: $('appContent'),
      soundToggle: $('soundToggle'), toast: $('toast'), overlayLayer: $('overlayLayer'), activeCallBar: $('activeCallBar'),
      systemNavigation: $('systemNavigation'), systemBack: $('systemBack'), systemHome: $('systemHome'),
      systemBackLabel: $('systemBackLabel'), systemHomeLabel: $('systemHomeLabel')
    });
    bindEvents();
    renderLock();
    renderHome();
    syncSoundButton();
    updateClock();
    if (state.unlocked) {
      showScreen('homeScreen');
      if (preview && DATA.apps[preview]) openApp(preview);
      if (!preview && !state.openingBriefSeen) showOpeningBrief();
    } else {
      showScreen('lockScreen');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
