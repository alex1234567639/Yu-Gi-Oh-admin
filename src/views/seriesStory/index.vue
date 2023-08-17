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
        list: this.$t('seriesStory.list'),
        add: this.$t('seriesStory.add'),
        type: null,
        path: 'seriesStory'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
