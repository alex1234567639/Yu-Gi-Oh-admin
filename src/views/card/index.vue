<template>
  <div class="card-wrapper">
    card-wrapper
  </div>
</template>

<script>
import { callApi } from '@/api/api'
import { removeNullAndEmptyString } from '@/utils/index.js'

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
          atk_t: 2800,
          atk_l: 3500,
          def_t: 2000,
          def_l: 2600,
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
      callApi('cards', 'list', removeNullAndEmptyString(this.listQuery)).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>
