<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import store from '@/store/modules/errorLog'
export default {
  name: 'App',
  computed: {
    goToLogin() {
      return store.state.goToLogin
    }
  },
  watch: {
    async goToLogin(newIndex) {
      console.log(newIndex)
      if (newIndex) this.$router.push('/login')
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$store.dispatch('errorLog/goToLoginPage', false)
    }
  }
}
</script>
