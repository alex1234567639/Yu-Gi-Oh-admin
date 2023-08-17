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
        list: this.$t('usefulCardIntroduction.strategyList'),
        add: this.$t('usefulCardIntroduction.strategyAdd'),
        type: 1,
        path: 'usefulCardIntroduction'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
