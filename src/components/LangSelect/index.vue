<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh'" command="zh">
        中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'" command="en">
        English
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage(lang) {
      // 切換
      this.$i18n.locale = lang
      // 結合vuex (vuex的mutations方法結合了cookie)
      this.$store.dispatch('app/setLanguage', lang) // 存入cookie
      // 切換成功提示
      this.$message({
        message: 'Switch Language Success',
        type: 'success'
      })
    }
  }
}
</script>
