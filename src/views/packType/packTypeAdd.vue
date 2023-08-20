<template>
  <div class="pack-type-add">
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
import store from '@/store'
import { packMainTypeList } from '@/config/main'
import { callApi } from '@/api/api'

export default {
  components: {
    Form
  },
  data() {
    return {
      addFormData: {
        name: { type: 'long-input', label: this.$t('packType.name'), preset: '' },
        packType: { type: 'input', label: this.$t('packType.packType'), preset: '' },
        mainType: {
          type: 'select',
          label: this.$t('packType.mainType'),
          preset: '',
          options: packMainTypeList
        }
      }
    }
  },
  methods: {
    confirmAdd(data) {
      if (store.state.settings.showLog) {
        console.log(data)
      }
      if (this.formValidate(data)) {
        callApi('packType', 'add', data).then(() => {
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
    },
    // 表單驗證
    formValidate(form) {
      const validationRules = [
        { field: 'name', condition: !form.name, message: 'packType.inputId' },
        { field: 'packType', condition: !form.packType, message: 'packType.inputName' },
        { field: 'mainType', condition: !form.mainType, message: 'packType.mainType' }
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
.pack-type-add {
  border: 1px dashed lightgray;
  width: fit-content;
  padding: 20px 30px;
  border-radius: 5px;
}
</style>
