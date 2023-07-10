<template>
  <div class="permit-wrapper">permit-wrapper</div>
</template>

<script>
import { callApi } from '@/api/api'
// import { getPermit } from '@/api/permission'

export default {
  mounted() {
    callApi('permission', 'list').then((res) => {
      console.log(res)
    })
    // getPermit().then(res => {
    //   console.log(res)
    // })
  }
}
</script>
