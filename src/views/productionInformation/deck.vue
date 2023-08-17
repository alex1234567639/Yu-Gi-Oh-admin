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
        list: this.$t('productionInformation.deckList'),
        add: this.$t('productionInformation.deckAdd'),
        type: 3,
        path: 'productInformation'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
