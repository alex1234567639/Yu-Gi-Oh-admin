<template>
  <div class="components-container">
    <el-tabs v-model="tabName">
      <el-tab-pane :label="$t('route.cardsAdd')" name="card_add">
        <Form
          class="form-container"
          :form-data="addFormData"
          :confirm-text="$t('lightbox.add')"
          @emitData="confirmAdd"
          @cancel="clearAdd"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Form from '@/components/Form/index'
import { ygoOptions } from '@/config/ygo.config'
import { callApi } from '@/api/api'
import store from '@/store'
import { removeNullAndEmptyString } from '@/utils'
import { getPackTypeList } from '@/utils/packTypeList'

export default {
  components: {
    Form
  },
  data() {
    return {
      ygoOptions,
      tabName: 'card_add',
      packListQuery: {
        page: 0,
        limit: 0,
        filter: {
          status: 0
        }
      },
      packList: null,
      addFormData: {
        id: { type: 'input', label: this.$t('card.id'), preset: '' },
        name: { type: 'input', label: this.$t('card.name'), preset: '' },
        type: {
          type: 'select',
          label: this.$t('card.type'),
          preset: '',
          options: []
        },
        star: {
          type: 'select',
          label: this.$t('card.star'),
          preset: '',
          options: []
        },
        attribute: {
          type: 'select',
          label: this.$t('card.attribute'),
          preset: '',
          options: []
        },
        race: {
          type: 'select',
          label: this.$t('card.race'),
          preset: '',
          options: []
        },
        rarity: {
          type: 'rarity',
          label: this.$t('card.rarity'),
          preset: []
        },
        atk: { type: 'input', label: this.$t('card.atk'), preset: '' },
        def: { type: 'input', label: this.$t('card.def'), preset: '' },
        effect: {
          type: 'textarea',
          label: this.$t('card.effect'),
          preset: ''
        },
        product_information_type: {
          type: 'select',
          label: this.$t('card.product_information_type'),
          preset: '',
          options: []
        },
        number: { type: 'input', label: this.$t('card.number'), preset: '' }
      }
    }
  },
  mounted() {
    this.addFormData.type.options = this.arrayTransfer(this.ygoOptions.type)
    this.addFormData.star.options = this.arrayTransfer(this.ygoOptions.star)
    this.addFormData.attribute.options = this.arrayTransfer(this.ygoOptions.attribute)
    this.addFormData.race.options = this.arrayTransfer(this.ygoOptions.race)
    this.addFormData.product_information_type.options = getPackTypeList()
  },
  methods: {
    arrayTransfer(arr, isRarity = false) {
      // 將陣列調整為 [{ label: '', value: 0 }, ...] 的形式
      const result = []
      for (let i = 0; i < arr.length; i++) {
        result.push({ label: arr[i], value: arr[i] })
      }
      return result
    },
    confirmAdd(data) {
      data.id = data.id.toUpperCase()
      data.atk = parseInt(data.atk)
      data.def = parseInt(data.def)
      if (store.state.settings.showLog) {
        console.log(data)
      }
      callApi('cards', 'add', removeNullAndEmptyString(data)).then(() => {
        alert(this.$t('alert.addSuccess'))
        this.clearAdd()
      })
    },
    clearAdd() {
      Object.keys(this.addFormData).forEach((key) => {
        this.addFormData[key].preset = key === 'rarity' ? [] : ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.components-container {
  width: 1000px;
}
</style>
