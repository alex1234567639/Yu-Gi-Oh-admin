<template>
  <div class="card-wrapper">card-wrapper</div>
</template>

<script>
import { callApi } from '@/api/api'

export default {
  data() {
    return {
      total: 0,
      list: null,
      listQuery: {
        page: 0,
        limit: 10,
        filter: {
          id: '',
          number: '',
          name: '青眼',
          type: '',
          star: '等級8',
          attribute: '光',
          // rarity: '',
          atk_t: 3500,
          atk_l: 2500,
          def_t: 3000,
          def_l: 2500,
          product_information_type: ''
        }
      },
      currentPage: 0
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      callApi('cards', 'list', this.listQuery).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>
