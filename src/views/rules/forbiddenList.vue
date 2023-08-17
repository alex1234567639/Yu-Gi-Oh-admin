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
        list: this.$t('rules.precedentList'),
        add: this.$t('rules.precedentAdd'),
        type: 0,
        path: 'rules'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
