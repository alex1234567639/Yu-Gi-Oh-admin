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
        list: this.$t('productionInformation.boxList'),
        add: this.$t('productionInformation.boxAdd'),
        type: 4,
        path: 'productInformation'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
