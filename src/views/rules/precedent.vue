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
        list: this.$t('rules.forbiddenListList'),
        add: this.$t('rules.forbiddenListAdd'),
        type: 1,
        path: 'rules'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
