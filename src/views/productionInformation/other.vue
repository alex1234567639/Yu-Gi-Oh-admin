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
        list: this.$t('productionInformation.otherList'),
        add: this.$t('productionInformation.otherAdd'),
        type: 2,
        path: 'productInformation'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
