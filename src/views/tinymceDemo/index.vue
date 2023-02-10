<template>
  <div class="tinymce-demo-wrapper">
    <el-button class="btn" type="primary" @click="showContent">取得副文本內容</el-button>
    <tinymce v-model="content" :height="300" />

    <h3>預覽</h3>
    <div v-html="content" />
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  data() {
    return {
      content: ''
    }
  },
  methods: {
    showContent() {
      console.log(this.content)
    }
  }
}
</script>

<style lang="scss" scoped>
.tinymce-demo-wrapper {
  padding: 20px;
  & .btn {
    margin-bottom: 10px;
  }
}
</style>
