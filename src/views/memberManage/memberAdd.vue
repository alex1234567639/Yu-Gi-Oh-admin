<template>
  <div class="admin-add-wrapper">
    <el-form label-width="120px" label-position="left">
      <el-form-item :label="'*' + $t('memberManage.type')">
        <el-select
          v-model="add_type"
          :placeholder="$t('memberManage.chooseType')"
        >
          <el-option :label="$t('memberManage.manager')" :value="0" />
          <el-option :label="$t('memberManage.blogAdminUser')" :value="1" />
          <el-option :label="$t('memberManage.blogOnlyUser')" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item :label="'*' + $t('memberManage.name')">
        <el-input
          v-model="add_name"
          autocomplete="off"
          :placeholder="$t('memberManage.inputName')"
          type="text"
          maxlength="30"
          class="input"
        />
      </el-form-item>
      <el-form-item :label="'*' + $t('memberManage.account')">
        <el-input
          v-model="add_account"
          autocomplete="off"
          :placeholder="$t('memberManage.inputAccount')"
          type="text"
          maxlength="30"
          class="input"
        />
      </el-form-item>
      <el-form-item :label="'*' + $t('memberManage.password')">
        <div class="remind-content">
          {{ "*" + $t("login.password6Digits") }}
        </div>
        <el-input
          v-model="add_password"
          autocomplete="new-password"
          :placeholder="$t('memberManage.inputPassword')"
          type="password"
          maxlength="30"
          class="input"
        />
      </el-form-item>
      <el-form-item :label="'*' + $t('memberManage.passwordConfirm')">
        <el-input
          v-model="add_passwordConfirm"
          autocomplete="new-password"
          :placeholder="$t('memberManage.inputPasswordConfirm')"
          type="password"
          maxlength="30"
          class="input"
        />
      </el-form-item>
    </el-form>
    <div class="btn-box">
      <el-button @click="clearAddUser">
        {{ $t("lightbox.cancel") }}
      </el-button>
      <el-button type="primary" @click="handleAddUser">
        {{ $t("lightbox.add") }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { validPlatformPassword } from '@/utils/validate'
import { callApi } from '@/api/api'

export default {
  data() {
    return {
      add_type: undefined,
      add_name: '',
      add_account: '',
      add_password: '',
      add_passwordConfirm: ''
    }
  },
  methods: {
    handleAddUser() {
      if (this.add_type === '' || this.add_type === undefined) {
        alert(this.$t('memberManage.chooseType'))
      } else if (this.add_name === '') {
        alert(this.$t('memberManage.inputName'))
      } else if (this.add_account === '') {
        alert(this.$t('memberManage.inputAccount'))
      } else if (validPlatformPassword(this.add_password) === false) {
        alert(this.$t('memberManage.inputValidPassword'))
      } else if (this.add_password !== this.add_passwordConfirm) {
        alert(this.$t('memberManage.differentPassword'))
      } else {
        const data = {
          // 'token': getToken(),
          type: this.add_type,
          name: this.add_name,
          account: this.add_account,
          password: this.add_password
        }
        console.log(data)
        callApi('admin', 'add', data).then((res) => {
          alert(this.$t('alert.addSuccess'))
          this.clearAddUser()
          this.$emit('addCompleted')
        })
      }
    },
    clearAddUser() {
      this.add_type = undefined
      this.add_name = ''
      this.add_account = ''
      this.add_password = ''
      this.add_passwordConfirm = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-add-wrapper {
  border: 1px dashed lightgray;
  width: fit-content;
  padding: 20px 30px;
  border-radius: 5px;
}
.input {
  width: 300px;
}
.remind-content {
  font-size: 12px;
  color: red;
}
.btn-box {
  text-align: right;
}
</style>
