<template>
  <div class="banner-add">
    <el-form class="form" label-width="120px" label-position="left">
      <el-form-item :label="$t('banner.photo_pc')">
        <div>
          <label class="photo-container">
            <input
              class="photo-btn"
              type="file"
              accept="image/*"
              @change="chooseFile($event, 'pc')"
            >
            {{ $t("form.choosePhoto") }}
          </label>
          <img v-if="addPcPhoto" class="img" :src="addPcPhoto" alt="">
        </div>
      </el-form-item>
      <el-form-item :label="$t('banner.photo_mobile')">
        <label class="photo-container">
          <input
            class="photo-btn"
            type="file"
            accept="image/*"
            @change="chooseFile($event, 'mb')"
          >
          {{ $t("form.choosePhoto") }}
        </label>
        <img v-if="addMbPhoto" class="img" :src="addMbPhoto" alt="">
      </el-form-item>
    </el-form>
    <Form
      :form-data="addFormData"
      :confirm-text="$t('lightbox.add')"
      @emitData="confirmAdd"
      @cancel="clearAdd"
    />
  </div>
</template>

<script>
import Form from '@/components/Form/index'
import { callApi } from '@/api/api'
import { removeNullAndEmptyString } from '@/utils/index.js'
import { uploadImage } from '@/utils/image'
import store from '@/store'
import { height_limit, KB_limit, width_limit } from '@/config/main'

export default {
  components: {
    Form
  },
  data() {
    return {
      addFormData: {
        title: { type: 'long-input', label: this.$t('banner.title'), preset: '' },
        subtitle: { type: 'long-input', label: this.$t('banner.subtitle'), preset: '' },
        url: { type: 'long-input', label: this.$t('banner.url'), preset: '' }
      },
      addPcPhoto: '',
      addMbPhoto: ''
    }
  },
  methods: {
    confirmAdd(data) {
      data.photo_pc = this.addPcPhoto
      data.photo_mobile = this.addMbPhoto
      if (store.state.settings.showLog) {
        console.log(data)
      }
      if (this.formValidate(data)) {
        callApi('banner', 'add', removeNullAndEmptyString(data)).then((res) => {
          alert(this.$t('alert.addSuccess'))
          this.clearAdd()
          this.$emit('addCompleted')
        })
      }
    },
    clearAdd() {
      Object.keys(this.addFormData).forEach((key) => {
        this.addFormData[key].preset = ''
      })
      this.clearPhoto()
    },
    // 圖片
    chooseFile(event, type) {
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
            if (type === 'pc') {
              vm.addPcPhoto = result.result
            }
            if (type === 'mb') {
              vm.addMbPhoto = result.result
            }
          },
          function(err) {
            alert(vm.$t('alert.' + err))
          },
          width_limit,
          height_limit
        )
      }
    },
    clearPhoto() {
      this.addPcPhoto = ''
      this.addMbPhoto = ''
    },
    // 表單驗證
    formValidate(form) {
      const validationRules = [
        { field: 'photo_pc', condition: !form.photo_pc, message: 'banner.choosePhotoPc' },
        { field: 'photo_mobile', condition: !form.photo_pc, message: 'banner.choosePhotoMobile' }
      ]
      for (const rule of validationRules) {
        if (rule.condition) {
          alert(this.$t(rule.message))
          return false
        }
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.banner-add {
  border: 1px dashed lightgray;
  width: fit-content;
  padding: 20px 30px;
  border-radius: 5px;
}
.form {
  padding: 0 20px;
  & .photo-container {
    margin-right: 20px;
    padding: 10px 21px 10px 18px;
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
    vertical-align: top;
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
    width: 150px;
  }
}
</style>
