import i18n from '@/lang'
export default {
  options: [
    // 會員管理
    {
      id: 'member',
      label: i18n.t('permits.member'),
      disabled: true,
      children: [
        { id: 'member_add', label: i18n.t('permits.member_add'), disabled: true },
        { id: 'member_edit', label: i18n.t('permits.member_edit'), disabled: true }
      ]
    },
    // banner管理
    {
      id: 'banner',
      label: i18n.t('permits.banner'),
      disabled: true,
      children: [
        { id: 'banner_add', label: i18n.t('permits.banner_add'), disabled: true },
        { id: 'banner_edit', label: i18n.t('permits.banner_edit'), disabled: true }
      ]
    },
    // 文章列表-系列介紹
    {
      id: 'series_introduction',
      label: i18n.t('permits.series_introduction'),
      disabled: true,
      children: [
        { id: 'series_introduction_add', label: i18n.t('permits.series_introduction_add'), disabled: true },
        { id: 'series_introduction_edit', label: i18n.t('permits.series_introduction_edit'), disabled: true }
      ]
    },
    // 文章列表-泛用卡介紹
    {
      id: 'useful_card_introduction',
      label: i18n.t('permits.useful_card_introduction'),
      disabled: true,
      children: [
        { id: 'useful_card_introduction_add', label: i18n.t('permits.useful_card_introduction_add'), disabled: true },
        { id: 'useful_card_introduction_edit', label: i18n.t('permits.useful_card_introduction_edit'), disabled: true }
      ]
    },
    // 文章列表-上位卡表
    {
      id: 'meta_deck',
      label: i18n.t('permits.meta_deck'),
      disabled: true,
      children: [
        { id: 'meta_deck_add', label: i18n.t('permits.meta_deck_add'), disabled: true },
        { id: 'meta_deck_edit', label: i18n.t('permits.meta_deck_edit'), disabled: true }
      ]
    },
    // 文章列表-卡表介紹
    {
      id: 'production_information',
      label: i18n.t('permits.production_information'),
      disabled: true,
      children: [
        { id: 'production_information_add', label: i18n.t('permits.production_information_add'), disabled: true },
        { id: 'production_information_edit', label: i18n.t('permits.production_information_edit'), disabled: true }
      ]
    },
    // 文章列表-規則相關
    {
      id: 'rules',
      label: i18n.t('permits.rules'),
      disabled: true,
      children: [
        { id: 'rules_add', label: i18n.t('permits.rules_add'), disabled: true },
        { id: 'rules_edit', label: i18n.t('permits.rules_edit'), disabled: true }
      ]
    },
    // 文章列表-卡片故事
    {
      id: 'series_story',
      label: i18n.t('permits.series_story'),
      disabled: true,
      children: [
        { id: 'series_story_add', label: i18n.t('permits.series_story_add'), disabled: true },
        { id: 'series_story_edit', label: i18n.t('permits.series_story_edit'), disabled: true }
      ]
    },
    // 行事曆
    {
      id: 'calendar',
      label: i18n.t('permits.calendar'),
      disabled: true,
      children: [
        { id: 'calendar_add', label: i18n.t('permits.calendar_add'), disabled: true },
        { id: 'calendar_edit', label: i18n.t('permits.calendar_edit'), disabled: true }
      ]
    },
    // 牌組列表
    {
      id: 'deck',
      label: i18n.t('permits.deck'),
      disabled: true,
      children: [
        { id: 'deck_add', label: i18n.t('permits.deck_add'), disabled: true },
        { id: 'deck_edit', label: i18n.t('permits.deck_edit'), disabled: true }
      ]
    },
    // 卡片管理
    {
      id: 'cards',
      label: i18n.t('permits.cards'),
      disabled: true,
      children: [
        { id: 'card_add', label: i18n.t('permits.card_add'), disabled: true },
        { id: 'card_edit', label: i18n.t('permits.card_edit'), disabled: true }
      ]
    },
    // Tag管理
    {
      id: 'tag',
      label: i18n.t('permits.tag'),
      disabled: true,
      children: [
        { id: 'tag_add', label: i18n.t('permits.tag_add'), disabled: true },
        { id: 'tag_edit', label: i18n.t('permits.tag_edit'), disabled: true }
      ]
    },
    // 包裝分類管理
    {
      id: 'pack_type',
      label: i18n.t('permits.pack_type'),
      disabled: true,
      children: [
        { id: 'pack_type_add', label: i18n.t('permits.pack_type_add'), disabled: true },
        { id: 'pack_type_edit', label: i18n.t('permits.pack_type_edit'), disabled: true }
      ]
    },
    // 權限管理
    {
      id: 'permit',
      label: i18n.t('permits.permit'),
      disabled: true,
      children: [
        { id: 'permit_add', label: i18n.t('permits.permit_add'), disabled: true },
        { id: 'permit_edit', label: i18n.t('permits.permit_edit'), disabled: true }
      ]
    }
  ],
  list: {
    member: false,
    member_add: false,
    member_edit: false,
    banner: false,
    banner_add: false,
    banner_edit: false,
    series_introduction: false,
    series_introduction_add: false,
    series_introduction_edit: false,
    useful_card_introduction: false,
    useful_card_introduction_add: false,
    useful_card_introduction_edit: false,
    meta_deck: false,
    meta_deck_add: false,
    meta_deck_edit: false,
    production_information: false,
    production_information_add: false,
    production_information_edit: false,
    rules: false,
    rules_add: false,
    rules_edit: false,
    series_story: false,
    series_story_add: false,
    series_story_edit: false,
    calendar: false,
    calendar_add: false,
    calendar_edit: false,
    deck: false,
    deck_add: false,
    deck_edit: false,
    cards: false,
    card_add: false,
    card_edit: false,
    tag: false,
    tag_add: false,
    tag_edit: false,
    pack_type: false,
    pack_type_add: false,
    pack_type_edit: false,
    permit: false,
    permit_add: false,
    permit_edit: false
  }
}
