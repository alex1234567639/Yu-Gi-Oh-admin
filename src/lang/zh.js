export default {
  route: {
    dashboard: '首頁',
    profile: '個人資料',
    // 會員管理
    member: '會員管理',
    memberList: '會員列表',
    // banner管理
    banner: 'Banner 管理',
    // 文章列表-系列介紹
    seriesIntroduction: '系列介紹',
    theme: '主題牌組',
    plugins: '外掛',
    // 文章列表-泛用卡介紹
    usefulCardIntroduction: '泛用卡介紹',
    singleCard: '單卡介紹',
    strategy: '戰術分析',
    // 文章列表-上位卡表
    metaDeck: '上位卡表',
    // 文章列表-泛用卡介紹
    productionInformation: '泛用卡介紹',
    pack: '補充包',
    deck: '預組',
    // 文章列表-規則相關
    rules: '規則相關',
    precedent: '判例',
    forbiddenList: '禁卡表',
    // 文章列表-卡片故事
    seriesStory: '卡片故事',
    // 戰報管理
    battlePaper: '戰報管理',
    // 行事曆
    calendar: '行事曆',
    // 卡片管理
    cards: '卡片管理',
    // Tag管理
    tag: 'Tag 管理',
    // 包裝分類管理
    packType: '包裝分類管理',
    // 權限管理
    permit: '權限管理'
  },
  // 登入
  login: {
    title: '系统登錄',
    logIn: '登錄',
    username: '帳號',
    password: '密碼',
    captcha: '驗證碼',
    wrongCaptcha: '驗證碼錯誤',
    loginFail: '帳號或密碼錯誤，請重新再試',
    password6Digits: '密碼長度介於8~16字'
  },
  // Navbar
  navbar: {
    profile: '個人資料',
    dashboard: '首頁',
    logOut: '登出'
  },
  tagsView: {
    refresh: '刷新',
    close: '關閉',
    closeOthers: '關閉其他',
    closeAll: '關閉所有'
  },
  // 會員管理
  memberManage: {
    // 會員列表
    list: '會員列表',
    chooseStatus: '選擇狀態',
    normal: '使用中',
    blocked: '停用中',
    chooseType: '選擇類型',
    manager: '管理者',
    blogAdminUser: '前後台用戶',
    blogOnlyUser: '前台用戶',
    inputName: '輸入用戶名',
    inputAccount: '輸入帳號',
    search: '搜尋',
    no: '編號',
    id: '會員ID',
    name: '會員名稱',
    account: '帳號',
    createDate: '註冊日期',
    type: '類型',
    status: '狀態',
    action: '操作',
    edit: '編輯',
    // 新增會員
    addAccount: '新增會員',
    password: '密碼',
    inputPassword: '輸入密碼',
    passwordConfirm: '確認密碼',
    inputPasswordConfirm: '確認密碼',
    inputValidPassword: '請輸入正確密碼格式',
    differentPassword: '密碼不一致'
  },
  // 權限管理
  permits: {
    permits: 'permits',
    name: '類型名稱',
    inputName: '輸入類型名稱',
    member: '會員管理',
    member_add: '新增會員',
    member_edit: '編輯會員',
    banner: 'banner管理',
    banner_add: '新增banner',
    banner_edit: '編輯banner',
    series_introduction: '文章列表-系列介紹',
    series_introduction_add: '新增文章',
    series_introduction_edit: '編輯文章',
    useful_card_introduction: '文章列表-泛用卡介紹',
    useful_card_introduction_add: '新增文章',
    useful_card_introduction_edit: '編輯文章',
    meta_deck: '文章列表-上位卡表',
    meta_deck_add: '新增文章',
    meta_deck_edit: '編輯文章',
    production_information: '文章列表-卡表介紹',
    production_information_add: '新增文章',
    production_information_edit: '編輯文章',
    rules: '文章列表-規則相關',
    rules_add: '新增文章',
    rules_edit: '編輯文章',
    series_story: '文章列表-卡片故事',
    series_story_add: '新增文章',
    series_story_edit: '編輯文章',
    battle_paper: '戰報管理',
    battle_paper_add: '新增文章',
    battle_paper_edit: '編輯文章',
    calendar: '行事曆',
    calendar_add: '新增行事曆',
    calendar_edit: '編輯行事曆',
    deck: '牌組列表',
    deck_add: '新增牌組列表',
    deck_edit: '編輯牌組列表',
    cards: '卡片管理',
    card_add: '新增卡片',
    card_edit: '編輯卡片',
    tag: 'Tag管理',
    tag_add: '新增Tag',
    tag_edit: '編輯Tag',
    pack_type: '包裝分類管理',
    pack_type_add: '新增包裝分類',
    pack_type_edit: '編輯包裝分類',
    permit: '權限管理',
    permit_add: '新增權限',
    permit_edit: '編輯權限'
  },
  common: {
    id: '編號',
    action: '操作',
    edit: '編輯'
  },
  alert: {
    alert: '提醒',
    send: '送出',
    confirm: '確定',
    cancel: '取消',
    fileTooLarge: '檔案大小不得超過1M',
    sizeTooLarge: '檔案尺寸不得超過1920*1000',
    addSuccess: '新增成功',
    editSuccess: '修改成功',
    deleteSuccess: '刪除成功'
  },
  lightbox: {
    cancel: '取消',
    confirm: '確定',
    add: '新增',
    search: '搜尋',
    reLogin: '重新登入',
    reLoginTitle: '重新登入提示',
    reLoginContent:
      '此帳號已閒置過久或已從其他地方登入，請選擇重新登入或是留在此頁。'
  },
  errorCode: {
    10009: '帳號已經重複登入，其他地方即將登出!',
    10001: '請求路徑錯誤',
    10002: '請求方法應為 POST',
    10003: 'JSON decode failed',
    10004: '請求參數不合法',
    10005: '帳號登入逾時',
    10006: 'Base64 decode failed',
    10007: '找不到對應資料',
    10008: '沒有權限的操作',
    100010: '上傳圖片失敗',
    10011: 'JSON encode failed',
    10012: '資料重複',
    11001: '找不到使用者',
    11002: '密碼錯誤',
    11003: '註冊帳號重複',
    11004: '帳號尚未申請後台使用權限'
  },
  form: {
    pleaseInput: '請輸入',
    pleaseChoose: '請選擇',
    choosePhoto: '選擇圖片'
  }
}
