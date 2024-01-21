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
        list: this.$t('metaDeck.list'),
        add: this.$t('metaDeck.add'),
        type: null,
        path: 'metaDeck'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
