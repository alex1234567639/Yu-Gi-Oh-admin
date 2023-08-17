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
        list: this.$t('productionInformation.rushDuelList'),
        add: this.$t('productionInformation.rushDuelAdd'),
        type: 1,
        path: 'productInformation'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
