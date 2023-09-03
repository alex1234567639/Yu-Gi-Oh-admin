<template>
  <div class="components-container">
    <div class="photo-upload">
      <div>
        <label class="photo-container">
          <input
            class="photo-btn"
            type="file"
            accept="image/*"
            @change="chooseFile($event)"
          >
          {{ photoName ? photoName : $t("form.choosePhoto") }}
        </label>
      </div>
      <img v-if="photoBase64" class="img" :src="photoBase64" alt="">
    </div>
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
import store from '@/store'
import { callApi } from '@/api/api'
import { removeNullAndEmptyString } from '@/utils'
import { getPackTypeList } from '@/utils/packTypeList'
import { uploadImage } from '@/utils/image'
import { height_limit, KB_limit, width_limit } from '@/config/main'
import { ygoOptions } from '@/config/ygo.config'

export default {
  components: {
    Form
  },
  data() {
    return {
      actionLoading: false,
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
      },
      // 圖片
      photoName: '',
      photoBase64: ''
    }
  },
  mounted() {
    this.addFormData.type.options = this.arrayTransfer(this.ygoOptions.type)
    this.addFormData.star.options = this.arrayTransfer(this.ygoOptions.star)
    this.addFormData.attribute.options = this.arrayTransfer(
      this.ygoOptions.attribute
    )
    this.addFormData.race.options = this.arrayTransfer(this.ygoOptions.race)
    this.addFormData.product_information_type.options = getPackTypeList()
    if (sessionStorage.getItem('copyCardInfo')) {
      const copyCardsInfo = JSON.parse(sessionStorage.getItem('copyCardInfo'))
      sessionStorage.removeItem('copyCardInfo')
      for (const key in copyCardsInfo) {
        if (this.addFormData[key]) {
          this.addFormData[key].preset = copyCardsInfo[key]
        }
      }
    }
  },
  methods: {
    arrayTransfer(arr) {
      // 將陣列調整為 [{ label: '', value: 0 }, ...] 的形式
      const result = []
      for (let i = 0; i < arr.length; i++) {
        result.push({ label: arr[i], value: arr[i] })
      }
      return result
    },
    confirmAdd(data) {
      if (this.actionLoading) {
        return
      }
      this.actionLoading = true
      data.id = data.id.toUpperCase()
      data.atk = data.atk ? parseInt(data.atk) : ''
      data.def = data.def ? parseInt(data.def) : ''
      if (store.state.settings.showLog) {
        console.log(data)
      }
      if (this.formValidate(data)) {
        callApi('cards', 'add', removeNullAndEmptyString(data))
          .then(() => {
            // 判斷是否有上傳圖片
            if (this.photoName && data.number) {
              const imageUploadData = {
                number: data.number,
                photo: this.photoBase64
              }
              return callApi('cardsImage', 'add', imageUploadData)
            } else {
              return Promise.resolve()
            }
          })
          .then(() => {
            alert(this.$t('alert.addSuccess'))
            this.clearAdd()
            this.actionLoading = false
          })
      }
    },
    clearAdd() {
      Object.keys(this.addFormData).forEach((key) => {
        // 不清除packType
        if (key !== 'product_information_type') {
          this.addFormData[key].preset = key === 'rarity' ? [] : ''
        }
      })
      this.photoName = ''
      this.photoBase64 = ''
    },
    // 表單驗證
    formValidate(form) {
      const validationRules = [
        { field: 'id', condition: !form.id, message: 'card.inputId' },
        { field: 'name', condition: !form.name, message: 'card.inputName' },
        { field: 'type', condition: !form.type, message: 'card.chooseType' },
        {
          field: 'attribute',
          condition: !form.attribute,
          message: 'card.chooseAttribute'
        },
        {
          field: 'rarity',
          condition: form.rarity.length < 1,
          message: 'card.chooseRarity'
        },
        {
          field: 'effect',
          condition: !form.effect,
          message: 'card.inputEffect'
        },
        {
          field: 'product_information_type',
          condition: !form.product_information_type,
          message: 'card.chooseProductType'
        }
      ]
      for (const rule of validationRules) {
        if (rule.condition) {
          alert(this.$t(rule.message))
          return false
        }
      }
      return true
    },
    // 圖片
    chooseFile(event) {
      if (event.target.files.length === 0) {
        return
      }
      const size = event.target.files[0].size
      const sizeKB = size / 1024
      // 檢查photo不大於1M
      if (sizeKB >= KB_limit) {
        this.$alert(this.$t('alert.fileTooLarge'), this.$t('alert.alert'), {
          confirmButtonText: this.$t('alert.confirm')
        })
      } else {
        const vm = this
        uploadImage(
          event,
          function(result) {
            vm.photoBase64 = result.result
            vm.photoName = result.name

            // 將檔名填入卡片密碼欄位
            const fileName = result.name
            const indexOfLastDot = fileName.lastIndexOf('.')
            if (indexOfLastDot !== -1) {
              vm.addFormData.number.preset = fileName.substring(
                0,
                indexOfLastDot
              )
            }
          },
          function(err) {
            alert(vm.$t('alert.' + err))
          },
          width_limit,
          height_limit
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.components-container {
  width: 1000px;
  & .photo-upload {
    position: absolute;
    right: 20px;
    top: 55px;
    z-index: 10;
    text-align: right;
    & .photo-container {
      padding: 10px 21px 10px 20px;
      color: #ffffff;
      background-color: #1890ff;
      border-color: #1890ff;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 400;
      outline: none;
      transition-duration: 0.2s;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: middle;
      cursor: pointer;
      &:hover {
        background-color: #51a6f6;
      }
      & .photo-btn {
        width: 1px;
        height: 1px;
        opacity: 0;
        overflow: hidden;
        z-index: -1;
      }
    }
    & .img {
      margin-top: 30px;
      width: 200px;
    }
  }
}
</style>
