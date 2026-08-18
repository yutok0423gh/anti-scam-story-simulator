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
      version: 17,
      seed: Math.random().toString(36).slice(2),
      contactVariant,
      contactIsReal: contactVariant === 'real',
      unlocked: false,
      openingBriefSeen: false,
      language: 'zh-CN',
      region: 'HK',
      soundEnabled: true,
      callVoiceLanguage: 'yue',
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
      timeSpeed: 0,
      clockLastRealMs: Date.now(),
      clockRemainderMs: 0,
      timelineHandled: [],
      timelineLastEvent: null,
      balance: 3000,
      profile: {
        startingBalance: 3000,
        growth: 0,
        growthTarget: 30,
        focusAreas: [],
        focusLocked: false,
        growthLedger: []
      },
      cardFrozen: false,
      privacyExposure: 0,
      moneyLost: 0,
      consequences: {
        goodsLost: 0,
        debt: 0,
        cashOrValuablesLost: 0,
        accountTakeovers: 0,
        remoteAccess: 0,
        muleRisk: 0
      },
      recoveryScamTriggered: false,
      hijackedFriendVariant: Math.random() < 0.72 ? 'hijacked' : 'real',
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
            intakeAccepted: false,
            lawyerContacted: false,
            investigatorContacted: false,
            remoteAccessGranted: false,
            bankingDetailsShared: false,
            guaranteePaid: false,
            officialAdviceChecked: false
          }
        },
        officialResearch: {
          status: 'available',
          steps: {
            listingOpened: false,
            booked: false,
            attended: false
          }
        },
        friend: {
          status: 'pending',
          steps: {
            messageRead: false,
            requestSeen: false,
            originalNumberCalled: false,
            mandyConfirmed: false,
            shopCalled: false,
            shopOrderMatched: false,
            merchantInvoicePaid: false,
            repaid: false,
            paid: false,
            resolved: false
          }
        },
        government: {
          status: 'pending',
          steps: {
            callbackMade: false,
            studentIdShared: false,
            identityDigitsShared: false,
            bankingDetailsShared: false,
            depositPaid: false,
            valuablesHandedOver: false,
            officialDirectoryOpened: false,
            officialNumberCalled: false,
            resolved: false
          }
        },
        market: {
          status: 'pending', route: null,
          steps: { emailOpened: false, externalPageOpened: false, bankLinked: false, officialOrderChecked: false, pendingCreditSeen: false, itemReleased: false }
        },
        health: {
          status: 'pending',
          steps: { messageRead: false, callbackMade: false, fakePageOpened: false, cardShared: false, officialAppChecked: false }
        },
        investment: {
          status: 'pending',
          steps: { messageRead: false, groupOpened: false, firstDepositPaid: false, withdrawalRequested: false, unlockFeePaid: false, officialCheck: false }
        },
        jobLoan: {
          status: 'pending',
          steps: { messageRead: false, contractOpened: false, personalLoanTaken: false, transferred: false, secondLoanRequested: false, officialCheck: false }
        },
        campusBorrow: {
          status: 'pending',
          steps: { messageRead: false, privatePaymentMade: false, officialDirectoryChecked: false }
        },
        officialServices: {
          status: 'pending',
          steps: { waterOpened: false, ticketOpened: false, mpfOpened: false, cardShared: false, officialChecks: [] }
        },
        census: {
          status: 'pending',
          steps: { noticeRead: false, identityShared: false, officialCheck: false }
        },
        donation: {
          status: 'pending',
          steps: { messageRead: false, callbackMade: false, bankingShared: false, officialCheck: false }
        },
        rental: {
          status: 'pending',
          steps: { messageRead: false, listingOpened: false, identityShared: false, depositPaid: false, officialCheck: false }
        },
        deepfake: {
          status: 'pending',
          steps: { callbackMade: false, originalNumberCalled: false, transferMade: false }
        }
      },
      notifications: [
        { id: 'n-call', app: 'phone', title: '未接来电', body: '未知号码 · +852 6XXX 8704', time: '08:28', unread: true },
      { id: 'n-polyu', app: 'polyu', title: 'PolyULife', body: '10:30课堂更换至N003', time: '08:30', unread: true, priority: 'important' },
      { id: 'n-mail', app: 'mail', title: 'Hall Reception', body: 'Registered document ready for collection', time: '08:32', unread: true, target: 'mail-parcel', priority: 'important' },
        { id: 'n-sms', app: 'messages', title: '未知号码', body: '包裹地址资料不完整', time: '08:35', unread: true, target: 'thread-parcel' },
        { id: 'n-research', app: 'mail', title: 'Prof. C. W. Chan', body: 'Research assistant opportunity', time: '08:41', unread: true, target: 'mail-research' },
        { id: 'n-event-fee', app: 'mail', title: 'PolyU Student Event Team', body: 'Payment pending · Student Innovation Night', time: '08:45', unread: true, target: 'mail-event-fee' },
        { id: 'n-career', app: 'mail', title: 'Northbridge Talent', body: 'Alternative remote research role', time: '08:49', unread: true, target: 'mail-career' },
        { id: 'n-health', app: 'messages', title: '医疗服务通知', body: '免费试用即将转为每月自动收费', time: '08:52', unread: true, target: 'thread-health' },
        { id: 'n-friend', app: 'messages', title: 'Mandy · Design Group', body: '你得闲帮我处理一下吗？', time: '09:02', unread: true, target: 'thread-friend' },
      { id: 'n-government-call', app: 'phone', title: '未接来电', body: '未知号码 · +852 3XXX 2147', time: '09:06', unread: true, priority: 'important' },
        { id: 'n-market', app: 'messages', title: 'Carousell buyer', body: 'Payment sent — please check your email', time: '09:10', unread: true, target: 'thread-market' },
        { id: 'n-investment', app: 'messages', title: 'Market Insight Group', body: 'Your trial account is ready', time: '09:14', unread: true, target: 'thread-investment' },
        { id: 'n-job-loan', app: 'messages', title: 'Apex Campus Recruitment', body: 'Your e-contract has been approved', time: '09:18', unread: true, target: 'thread-job-loan' },
        { id: 'n-campus-borrow', app: 'messages', title: 'Prof. Chan Office', body: 'Can you handle an urgent supplier payment?', time: '09:22', unread: true, target: 'thread-campus-borrow' },
        { id: 'n-water', app: 'messages', title: 'WSD-eBill', body: 'Outstanding water charge HK$86.40', time: '09:26', unread: true, target: 'thread-water' },
        { id: 'n-ticket', app: 'messages', title: 'eTrafficNotice', body: 'Electronic ticket pending', time: '09:29', unread: true, target: 'thread-ticket' },
        { id: 'n-mpf', app: 'messages', title: 'eMPF Notice', body: 'Profile update required', time: '09:32', unread: true, target: 'thread-mpf' },
        { id: 'n-census', app: 'messages', title: '访客登记', body: '人口普查人员正在大堂等候', time: '09:36', unread: true, target: 'thread-census' },
        { id: 'n-donation', app: 'messages', title: 'Donation Confirmation', body: 'HK$580 debit scheduled today', time: '09:39', unread: true, target: 'thread-donation' },
        { id: 'n-rental', app: 'messages', title: '陈先生', body: '红磡两房，今日可以留单位给你', time: '09:40', unread: true, target: 'thread-rental' },
      { id: 'n-deepfake-call', app: 'phone', title: '未接视频来电', body: '未知号码 · +852 6XXX 1182', time: '10:05', unread: true, priority: 'important' }
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
            { from: 'them', time: '08:52', text: '【HA Go / eHealth Service】你的医疗计划将于今日自动续费HK$388。如非本人登记，请立即致电+852 5XXX 0198取消。' },
            { from: 'them', time: '08:52', text: 'https://ha-go-account.example/cancel' }
          ]
        },
        market: {
          id: 'thread-market',
          sender: '二手平台买家',
          number: '平台对话',
          unread: false,
          items: [
            { from: 'them', time: '09:10', text: 'Hi, I paid HK$680 for the calculator. Carousell says the confirmation was sent to your email. Can you check it now?' },
            { from: 'them', time: '09:11', text: 'If the email is delayed, seller protection can release it here: https://marketplace-protection.example/receive' },
            { from: 'them', time: '09:11', text: 'I can also deposit a cheque now. Once your banking app shows it, please leave the calculator at the lobby.' }
          ]
        },
        friend: {
          id: 'thread-friend',
          sender: 'Mandy · Design Group',
          number: '聊天账号',
          unread: true,
          items: [
            { from: 'them', time: '上周五', text: '多谢你上次帮我改poster，最后老师选了蓝色那版 😂' },
            { from: 'mine', time: '上周五', text: '记得请我饮咖啡就得。' },
            { from: 'them', time: '09:02', text: '啱啱开会走不开，你得闲帮我先垫HK$760给印刷店吗？今晚转返给你。' },
            { from: 'them', time: '09:03', text: 'FPS户口不是我名字，是印刷店同事。现在就差我这单，帮我一下 🙏' }
          ]
        },
        investment: {
          id: 'thread-investment', sender: 'Market Insight Group', number: 'WhatsApp 群组', unread: true,
          items: [
            { from: 'them', time: '09:14', text: 'Assistant May: Welcome from the Instagram AI investing seminar. Mentor Leo has opened a HK$500 trial account for you.' },
            { from: 'them', time: '09:15', text: 'Mentor Leo: Today’s AI signal is ready. Follow the assistant’s registration steps before the session closes.' },
            { from: 'them', time: '09:15', text: 'Member Chloe: My HK$500 trial is showing HK$1,860 already. Withdrawal screenshot attached.' },
            { from: 'them', time: '09:16', text: 'Platform Support: Accounts must be registered through https://meta-invest-pro.example/start to receive the group signal.' },
            { from: 'them', time: '09:16', text: 'Assistant May: Message me after depositing and I will ask Compliance to activate withdrawals.' }
          ]
        },
        jobLoan: {
          id: 'thread-job-loan', sender: 'Apex Campus Recruitment', number: '+852 6XXX 4021', unread: true,
          items: [
            { from: 'them', time: '09:18', text: 'Your Administrative Project Assistant e-contract has been approved. Salary is HK$180/hour.' },
            { from: 'them', time: '09:19', text: 'The client has an urgent procurement gap. This is not an onboarding fee: use a personal cash loan for HK$3,000 and the company will repay it today with commission.' },
            { from: 'them', time: '09:19', text: 'Contract portal: https://apex-recruit-contract.example' }
          ]
        },
        campusBorrow: {
          id: 'thread-campus-borrow', sender: 'Prof. Chan Office', number: 'WhatsApp', unread: true,
          items: [
            { from: 'them', time: '09:22', text: 'I am in a faculty meeting. The seminar supplier needs a HK$960 deposit before 10:00.' },
            { from: 'them', time: '09:23', text: 'Please pay the supplier’s personal FPS first. The department will reimburse you after the meeting. This will also help us confirm the student research team.' }
          ]
        },
        water: {
          id: 'thread-water', sender: 'WSD-eBill', number: 'SMS', unread: true,
          items: [
            { from: 'them', time: '09:26', text: 'Water account 83••19 has an outstanding HK$86.40 charge. Service may be suspended after today.' },
            { from: 'them', time: '09:26', text: 'Review and pay: https://wsd-ebill-check.example' }
          ]
        },
        ticket: {
          id: 'thread-ticket', sender: 'eTrafficNotice', number: 'SMS', unread: true,
          items: [
            { from: 'them', time: '09:29', text: 'Electronic traffic ticket ET-260814-73 is pending. View notice and settle HK$320 today.' },
            { from: 'them', time: '09:29', text: 'https://gov-eticket-view.example' }
          ]
        },
        mpf: {
          id: 'thread-mpf', sender: 'eMPF Notice', number: 'SMS', unread: true,
          items: [
            { from: 'them', time: '09:32', text: 'Your eMPF profile is incomplete. Contributions and withdrawals may be suspended unless details are updated today.' },
            { from: 'them', time: '09:32', text: 'https://empf-profile-update.example' }
          ]
        },
        census: {
          id: 'thread-census', sender: '访客登记', number: '宿舍大堂', unread: true,
          items: [
            { from: 'them', time: '09:36', text: '一名自称人口普查统计员的人正在大堂等候，穿着工作背心并出示职员证。他说需要核对住户人数和身份证。' }
          ]
        },
        donation: {
          id: 'thread-donation', sender: 'Donation Confirmation', number: '+852 5XXX 7310', unread: true,
          items: [
            { from: 'them', time: '09:39', text: 'Your HK$580 donation to Community Relief Fund will be debited today.' },
            { from: 'them', time: '09:39', text: 'If you did not authorise it, call +852 5XXX 7310 immediately to cancel.' }
          ]
        },
        rental: {
          id: 'thread-rental', sender: '陈先生', number: '+852 6XXX 2290', unread: true,
          items: [
            { from: 'them', time: '09:40', text: '你好，我在租房群看到你找红磡单位。黄埔花园有一套两房，月租HK$5,800，家具齐全。' },
            { from: 'them', time: '09:40', text: '我这几天在深圳陪家人，暂时不能亲自带看。照片、短片和电子租约都在这里：https://hk-home-listing.example/unit/H52' },
            { from: 'them', time: '09:41', text: '今天先付一个月诚意金就可以留房，正式签约时会当首月租金。FPS是业主本人陈先生。' }
          ]
        }
      },
      mails: [
        {
          id: 'mail-market-payment', kind: 'market-payment', from: 'Carousell Payment', address: 'payment@carousell-secure.example',
          subject: 'Buyer payment received — seller action required', preview: 'HK$680 is waiting for release to your account.', time: '09:10', unread: true, focused: true, language: 'en',
          body: 'The buyer has completed payment for Calculator Listing #C-8142. Your HK$680 is currently on hold. Complete Seller Payment Protection using the secure button below. A bank card and one-time passcode may be required to activate receiving.',
          linkUrl: 'https://marketplace-protection.example/receive',
          translation: { subject: '已收到买家付款——卖家需要操作', preview: 'HK$680正在等待转入你的账户。', body: '买家已经为计算器商品#C-8142完成付款。HK$680目前被暂扣。请通过下方安全按钮完成“卖家付款保障”。激活收款可能需要银行卡及一次性密码。' }, tracking: null
        },
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
          linkUrl: 'https://research-onboarding.example/start',
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
          linkUrl: 'https://northbridge-projects.example/workspace',
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
          linkUrl: 'https://student-event-payment.example/seat',
          translation: {
            subject: '付款待处理 · 学生创新之夜',
            preview: '你的临时席位将于10:00失效。请通过FPS支付HK$180。',
            body: '你在“学生创新之夜”的临时席位将保留至10:00。请使用付款页面所示的个人FPS账户支付HK$180参加费，并回复付款截图以领取二维码门票。'
          },
          tracking: null
        }
      ],
      callLog: [
        { id: 'call-deepfake', name: '未知号码', number: '+852 6XXX 1182', time: '10:05', direction: '未接视频来电', unread: true },
        { id: 'call-government', name: '未知号码', number: '+852 3XXX 2147', time: '09:06', direction: '未接来电', unread: true },
        { id: 'call-unknown', name: '未知号码', number: '+852 6XXX 8704', time: '08:28', direction: '未接来电', unread: true },
        { id: 'call-hall', name: '未知号码', number: '+852 2XXX 0000', time: '昨天', direction: '呼出', unread: false }
      ],
      contacts: [
        { id: 'contact-ajie', name: '阿杰（去年迎新）', initials: 'AJ', number: '+852 9XXX 4428', note: '模拟旧号码 · 去年活动联系人' },
        { id: 'contact-kaman', name: '嘉敏', initials: 'KM', number: '+852 9XXX 2134', note: '模拟号码 · 迎新筹备组' },
        { id: 'contact-hall', name: 'Hall Reception', initials: 'HR', number: '+852 2XXX 0000', note: '模拟号码 · 宿舍收发室' },
        { id: 'contact-department', name: 'Department General Office', initials: 'DO', number: '+852 2XXX 6200', note: '模拟号码 · 教职员及研究项目查询' },
        { id: 'contact-immigration', name: 'General Enquiries', initials: 'GE', number: '+852 2XXX 6111', note: '模拟号码 · 从政府网站取得' },
        { id: 'contact-mandy', name: 'Mandy', initials: 'MY', number: '+852 9XXX 5381', note: '模拟原号码 · Design Group同学' },
        { id: 'contact-printshop', name: 'Blue Peak Printing', initials: 'BP', number: '+852 2XXX 7718', note: '模拟号码 · 上次蓝色海报订单保存的店铺' },
        { id: 'contact-father', name: '爸爸', initials: '爸', number: '+852 9XXX 4412', note: '模拟原号码 · 已保存联系人' }
      ],
      transactions: [
        { id: 'market-pending-credit', title: 'CHEQUE DEPOSIT · PENDING', time: '今天 09:12', amount: 680, pending: true },
        { title: 'Campus Café', time: '今天 08:06', amount: -36 },
        { title: 'MTR', time: '昨天 19:42', amount: -12.4 },
        { title: 'Opening balance', time: '8月25日', amount: 3048.4 }
      ],
      browserPage: 'home',
      browserQuery: '',
      browserUrl: '',
      browserUrlPage: '',
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
