import i18n from '@/lang'

// 上傳照片限制
const KB_limit = 1024
const width_limit = 1920
const height_limit = 1000

// 產品包裝分類
const packMainTypeList = [
  { value: 0, label: i18n.t('route.pack') },
  { value: 1, label: i18n.t('route.rushDuel') },
  { value: 3, label: i18n.t('route.deck') },
  { value: 4, label: i18n.t('route.box') },
  { value: 2, label: i18n.t('route.other') }
]

export {
  KB_limit,
  width_limit,
  height_limit,
  packMainTypeList
}
