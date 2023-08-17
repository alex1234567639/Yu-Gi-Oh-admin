<template>
  <div>
    <Article :detail-data="detailData" />
  </div>
</template>

<script>
import Article from '@/components/Article/index'
export default {
  components: {
    Article
  },
  data() {
    return {
      detailData: {
        list: this.$t('serialIntroduction.theme_list'),
        add: this.$t('serialIntroduction.theme_add'),
        type: 0,
        path: 'serialIntroduction'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
