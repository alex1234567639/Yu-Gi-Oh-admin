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
        list: this.$t('battlePaper.list'),
        add: this.$t('battlePaper.add'),
        type: 0,
        path: 'battlePaper'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
