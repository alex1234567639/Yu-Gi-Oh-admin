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
        list: this.$t('serialIntroduction.plugin_list'),
        add: this.$t('serialIntroduction.plugin_add'),
        type: 1,
        path: 'serialIntroduction'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
