(function () {
  'use strict';

  const icons = {
    phone: '<svg viewBox="0 0 24 24"><path d="M7.2 3.5 9.7 8 7.8 9.8c1.2 2.5 3.3 4.6 5.8 5.8l1.8-1.9 4.6 2.5-.4 3.1c-.1.8-.8 1.4-1.6 1.4C9.9 20.7 3.3 14.1 3.3 6c0-.8.6-1.5 1.4-1.6l2.5-.9Z"/></svg>',
    messages: '<svg viewBox="0 0 24 24"><path d="M5 18.5 3.5 21l4.3-1.2c1.2.5 2.6.7 4.2.7 5 0 9-3.6 9-8s-4-8-9-8-9 3.6-9 8c0 2.3 1.1 4.4 3 5.8Z"/><path d="M8 12.5h.01M12 12.5h.01M16 12.5h.01"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
    polyu: '<svg viewBox="0 0 24 24"><path d="M4 20h16M6 20V9h12v11M4.5 9 12 4l7.5 5M9 12h2v3H9zm4 0h2v3h-2z"/></svg>',
    browser: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z"/></svg>',
    contacts: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2"/><path d="M5.5 20c.7-3.5 3-5.5 6.5-5.5s5.8 2 6.5 5.5"/></svg>',
    bank: '<svg viewBox="0 0 24 24"><path d="m3 9 9-5 9 5M5 10v7m4-7v7m6-7v7m4-7v7M3 20h18"/></svg>',
    tasks: '<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="m8 8 1.2 1.2L11.5 7M13.5 8H17m-9 6 1.2 1.2 2.3-2.2m2 1H17"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.8 1.8 0 0 0 .35 2l.05.05-2.75 2.75-.05-.05a1.8 1.8 0 0 0-2-.35 1.8 1.8 0 0 0-1.1 1.65V21h-3.8v-.08A1.8 1.8 0 0 0 9 19.27a1.8 1.8 0 0 0-2 .35l-.05.05-2.75-2.75.05-.05a1.8 1.8 0 0 0 .35-2A1.8 1.8 0 0 0 2.95 13.8H3v-3.8h-.05A1.8 1.8 0 0 0 4.6 8.9a1.8 1.8 0 0 0-.35-2l-.05-.05L6.95 4.1 7 4.15a1.8 1.8 0 0 0 2 .35 1.8 1.8 0 0 0 1.1-1.65V2.8h3.8v.05A1.8 1.8 0 0 0 15 4.5a1.8 1.8 0 0 0 2-.35l.05-.05 2.75 2.75-.05.05a1.8 1.8 0 0 0-.35 2 1.8 1.8 0 0 0 1.65 1.1h.05v3.8h-.05A1.8 1.8 0 0 0 19.4 15Z"/></svg>',
    map: '<svg viewBox="0 0 24 24"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15m6-12v15"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.7 2.8 8.3 7 10 4.2-1.7 7-5.3 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2"/><path d="M5.5 20c.7-3.5 3-5.5 6.5-5.5s5.8 2 6.5 5.5"/></svg>',
    chevron: '<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
    hangup: '<svg viewBox="0 0 24 24"><path d="M5 15c4.6-3.2 9.4-3.2 14 0M7.5 13l-2 4m11-4 2 4"/></svg>'
  };

  const apps = {
    phone: { id: 'phone', name: '电话', eyebrow: 'CALLS', color: '#2f9c65', icon: icons.phone },
    messages: { id: 'messages', name: '短信', eyebrow: 'MESSAGES', color: '#3479d8', icon: icons.messages },
    mail: { id: 'mail', name: '邮件', eyebrow: 'INBOX', color: '#b33a43', icon: icons.mail },
    polyu: { id: 'polyu', name: 'PolyULife', eyebrow: 'CAMPUS', color: '#8b2435', icon: icons.polyu },
    browser: { id: 'browser', name: '浏览器', eyebrow: 'RESEARCH', color: '#238278', icon: icons.browser },
    contacts: { id: 'contacts', name: '联系人', eyebrow: 'CONTACTS', color: '#d58a22', icon: icons.contacts },
    bank: { id: 'bank', name: '银行', eyebrow: 'WALLET', color: '#22384d', icon: icons.bank },
    tasks: { id: 'tasks', name: '任务', eyebrow: 'TODAY', color: '#4c5964', icon: icons.tasks },
    settings: { id: 'settings', name: '设置', eyebrow: 'SETTINGS', color: '#7d838b', icon: icons.settings }
  };

  function createInitialState() {
    const contactRoll = Math.random();
    const contactVariant = contactRoll < 0.32 ? 'real' : (contactRoll < 0.78 ? 'fake' : 'grey');
    return {
      version: 11,
      seed: Math.random().toString(36).slice(2),
      contactVariant,
      contactIsReal: contactVariant === 'real',
      unlocked: false,
      openingBriefSeen: false,
      language: 'zh-CN',
      region: 'HK',
      soundEnabled: true,
      polyuPage: 'home',
      polyuCalendarView: 'month',
      phoneView: 'recents',
      dialNumber: '',
      contactsQuery: '',
      investigationQueries: [],
      messageDrafts: {},
      mailDrafts: {},
      mailReplies: {},
      openMailComposerId: null,
      currentApp: null,
      mailTab: 'focused',
      mailUnreadOnly: false,
      mailTranslations: {},
      time: 510,
      balance: 6840,
      cardFrozen: false,
      privacyExposure: 0,
      moneyLost: 0,
      recoveryScamTriggered: false,
      evidence: [],
      history: [],
      callJudgements: {},
      callRecords: [],
      taskState: {
        parcel: {
          status: 'pending',
          steps: {
            noticeRead: false,
            trackingSaved: false,
            hallConfirmed: false,
            collected: false
          }
        },
        contact: {
          status: 'pending',
          steps: {
            strangerSpoken: false,
            identityClaimed: false,
            oldNumberCalled: false,
            organizerChecked: false,
            resolved: false
          }
        },
        research: {
          status: 'pending',
          steps: {
            invitationRead: false,
            officialProfileFound: false,
            officialContacted: false,
            resolved: false
          }
        },
        event: {
          status: 'pending',
          decision: null,
          steps: {
            paymentMailRead: false,
            officialEventOpened: false,
            feeCompared: false,
            registered: false
          }
        },
        career: {
          status: 'pending',
          steps: {
            invitationRead: false,
            trainingOpened: false,
            profileSubmitted: false,
            trialPaid: false,
            trialCommissionReceived: false,
            largeDepositRequested: false,
            verified: false
          }
        },
        recovery: {
          status: 'locked',
          steps: {
            messageRead: false,
            portalOpened: false,
            bankingDetailsShared: false,
            guaranteePaid: false,
            officialAdviceChecked: false
          }
        }
      },
      notifications: [
        { id: 'n-call', app: 'phone', title: '未接来电', body: '未知号码 · +852 6XXX 8704', time: '08:28', unread: true },
        { id: 'n-polyu', app: 'polyu', title: 'PolyULife', body: '10:30课堂更换至N003', time: '08:30', unread: true },
        { id: 'n-mail', app: 'mail', title: 'Hall Reception', body: 'Registered document ready for collection', time: '08:32', unread: true, target: 'mail-parcel' },
        { id: 'n-sms', app: 'messages', title: '未知号码', body: '包裹地址资料不完整', time: '08:35', unread: true, target: 'thread-parcel' },
        { id: 'n-research', app: 'mail', title: 'Prof. C. W. Chan', body: 'Research assistant opportunity', time: '08:41', unread: true, target: 'mail-research' },
        { id: 'n-event-fee', app: 'mail', title: 'PolyU Student Event Team', body: 'Payment pending · Student Innovation Night', time: '08:45', unread: true, target: 'mail-event-fee' },
        { id: 'n-career', app: 'mail', title: 'Northbridge Talent', body: 'Alternative remote research role', time: '08:49', unread: true, target: 'mail-career' },
        { id: 'n-health', app: 'messages', title: '医疗服务通知', body: '免费试用即将转为每月自动收费', time: '08:52', unread: true, target: 'thread-health' }
      ],
      messages: {
        parcel: {
          id: 'thread-parcel',
          sender: '未知号码',
          number: '+852 6XXX 3017',
          unread: true,
          items: [
            { from: 'them', time: '08:35', text: '【香港邮政】您的包裹地址资料不完整，请于两小时内更新，否则将退回寄件人。' },
            { from: 'them', time: '08:35', text: 'https://parcel-update.example/update?id=HKP8234' }
          ]
        },
        class: {
          id: 'thread-class',
          sender: 'COMP2033 Group',
          number: '群组',
          unread: false,
          items: [
            { from: 'them', time: '08:12', text: '有人看到今天换课室了吗？PolyULife说改到N003。' },
            { from: 'mine', time: '08:14', text: '看到了，我晚点过去。' }
          ]
        },
        health: {
          id: 'thread-health',
          sender: '医疗服务通知',
          number: '+852 5XXX 0198',
          unread: true,
          items: [
            { from: 'them', time: '08:52', text: '【医疗服务】你的健康保障免费试用将于今日结束，其后每月自动收取HK$388。如需取消，请致电+852 5XXX 0198或使用以下页面。' },
            { from: 'them', time: '08:52', text: 'https://medical-service-cancel.example' }
          ]
        },
        market: {
          id: 'thread-market',
          sender: '二手平台买家',
          number: '平台对话',
          unread: false,
          items: [
            { from: 'them', time: '08:18', text: '你好，我已经付款买你的计算器。平台说卖家账户要先完成一次收款验证，你看一下邮件或这个链接。' },
            { from: 'them', time: '08:19', text: 'https://marketplace-protection.example/receive' }
          ]
        }
      },
      mails: [
        {
          id: 'mail-parcel',
          official: true,
          from: 'Hall Reception',
          address: 'hall.reception@campus-mail.example',
          subject: 'Registered document ready for collection',
          preview: 'Your registered document has arrived at hall reception.',
          time: '08:32',
          unread: true,
          focused: true,
          language: 'en',
          body: 'Your registered document has arrived at hall reception. Please bring your student ID and collect it before 5:00 PM today. Hall reception does not charge redelivery fees by text message.',
          translation: {
            subject: '挂号文件可供领取',
            preview: '你的挂号文件已经送到宿舍收发室。',
            body: '你的挂号文件已经送到宿舍收发室。请于今天17:00前携带学生证领取。收发室不会通过短信收取重新派送费用。'
          },
          tracking: 'RR 482 917 305 HK'
        },
        {
          id: 'mail-event',
          official: true,
          from: 'Student Affairs',
          address: 'student.affairs@campus-mail.example',
          subject: 'Last year’s orientation contacts',
          preview: 'The attachment lists last year’s student contacts.',
          time: '昨天',
          unread: false,
          focused: false,
          language: 'en',
          body: 'Last year’s orientation contacts were Chan Chi Kit (Ah Kit) and Lam Ka Man. Please confirm this year’s arrangements through the original contact details first.',
          translation: {
            subject: '去年迎新活动联系人',
            preview: '附件列出了去年活动的学生联络人。',
            body: '去年迎新活动联系人为陈志杰（阿杰）及林嘉敏。请优先通过原有联络方式确认今年安排。'
          },
          tracking: null
        },
        {
          id: 'mail-research',
          kind: 'research',
          from: 'Prof. C. W. Chan',
          address: 'cw.chan.research@outlook.example',
          subject: 'Research Assistant Opportunity – reply today',
          preview: 'Your profile was recommended for an AI learning research project.',
          time: '08:41',
          unread: true,
          focused: true,
          language: 'en',
          body: 'Dear Student, your profile was recommended for an eight-week AI learning research project. The work pays HK$180 per hour and can be completed remotely. Please confirm your availability today through the onboarding form. The first assignment involves arranging participant incentive e-vouchers; all costs will be reimbursed.',
          translation: {
            subject: '研究助理机会——请于今日回复',
            preview: '你的资料获推荐参与一项人工智能学习研究。',
            body: '同学你好：你的资料获推荐参加一个为期八周的人工智能学习研究项目。工作可远程完成，时薪为HK$180。请于今天通过入职表格确认是否有空。第一项任务包括代为安排参与者奖励电子礼券，所有费用随后报销。'
          },
          tracking: null
        },
        {
          id: 'mail-career',
          kind: 'career',
          from: 'Northbridge Talent',
          address: 'recruitment@northbridge-projects.example',
          subject: 'Alternative remote Research Assistant role',
          preview: 'The position you viewed is full, but a flexible project role is available.',
          time: '08:49',
          unread: true,
          focused: true,
          language: 'en',
          body: 'Hello, the internship you viewed has reached capacity. Based on your student profile, we can instead offer a remote Research and Project Assistant role. The work includes product data collection and quality checks. Training takes around 40 minutes and the first trial task is paid immediately. Continue through our project workspace today if interested.',
          translation: {
            subject: '替代的远程研究助理职位',
            preview: '你查看的职位已满，但现有一个时间灵活的项目岗位。',
            body: '你好，你查看的实习职位已经满额。根据你的学生资料，我们可以改为提供远程研究及项目助理职位，工作包括产品资料搜集和质量检查。培训约需40分钟，首个试做任务会即时结算。如有兴趣，请于今天进入我们的项目工作平台。'
          },
          tracking: null
        },
        {
          id: 'mail-event-fee',
          kind: 'event-payment',
          from: 'PolyU Student Event Team',
          address: 'payment@student-event-payment.example',
          subject: 'Payment pending · Student Innovation Night',
          preview: 'Your provisional seat expires at 10:00. Pay HK$180 by FPS.',
          time: '08:45',
          unread: true,
          focused: false,
          language: 'en',
          body: 'Your provisional seat for Student Innovation Night is being held until 10:00. Complete the HK$180 participation fee using the personal FPS account shown on the payment page. Reply with the payment screenshot to receive your QR ticket.',
          translation: {
            subject: '付款待处理 · 学生创新之夜',
            preview: '你的临时席位将于10:00失效。请通过FPS支付HK$180。',
            body: '你在“学生创新之夜”的临时席位将保留至10:00。请使用付款页面所示的个人FPS账户支付HK$180参加费，并回复付款截图以领取二维码门票。'
          },
          tracking: null
        }
      ],
      callLog: [
        { id: 'call-unknown', name: '未知号码', number: '+852 6XXX 8704', time: '08:28', direction: '未接来电', unread: true },
        { id: 'call-hall', name: '未知号码', number: '+852 2XXX 0000', time: '昨天', direction: '呼出', unread: false }
      ],
      contacts: [
        { id: 'contact-ajie', name: '阿杰（去年迎新）', initials: 'AJ', number: '+852 9XXX 4428', note: '模拟旧号码 · 去年活动联系人' },
        { id: 'contact-kaman', name: '嘉敏', initials: 'KM', number: '+852 9XXX 2134', note: '模拟号码 · 迎新筹备组' },
        { id: 'contact-hall', name: 'Hall Reception', initials: 'HR', number: '+852 2XXX 0000', note: '模拟号码 · 宿舍收发室' },
        { id: 'contact-department', name: 'Department General Office', initials: 'DO', number: '+852 2XXX 6200', note: '模拟号码 · 教职员及研究项目查询' }
      ],
      transactions: [
        { title: 'Campus Café', time: '今天 08:06', amount: -36 },
        { title: 'MTR', time: '昨天 19:42', amount: -12.4 },
        { title: 'Opening balance', time: '8月25日', amount: 6888.4 }
      ],
      browserPage: 'home',
      browserQuery: '',
      dayEnded: false
    };
  }

  window.SIM_DATA = {
    icons,
    apps,
    gridApps: ['polyu', 'mail', 'browser', 'tasks', 'settings'],
    dockApps: ['phone', 'messages', 'contacts', 'bank'],
    createInitialState
  };
})();
