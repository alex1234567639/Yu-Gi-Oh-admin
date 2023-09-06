<template>
  <div class="components-container">
    <!--新增權限-->
    <el-button type="primary" icon="el-icon-plus" @click="handleAddPermit">
      {{ $t('permits.permit_add') }}
    </el-button>

    <!--權限列表-->
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      class="data-list"
    >
      <el-table-column :label="$t('common.no')" type="index" align="center" width="60" />
      <el-table-column :label="$t('permits.name')" prop="name" align="center" width="250" />
      <el-table-column :label="$t('common.action')" align="center" width="120">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdatePermit(row)">
            {{ $t('common.edit') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--權限燈箱-->
    <el-dialog destroy-on-close :visible.sync="dialogVisible" :title="dialogType==='edit'?$t('permits.permit_edit'):$t('permits.permit_add')">
      <el-form label-width="100px" label-position="left" style="margin-left:50px">
        <el-form-item :label="'*' + $t('permits.name')">
          <el-input v-model="name" :placeholder="$t('permits.inputName')" class="input" />
        </el-form-item>
        <el-form-item :label="$t('permits.permit')">
          <el-tree
            ref="tree"
            :data="permitOptionList"
            show-checkbox
            node-key="id"
            class="permission-tree"
            check-strictly
            accordion
            :default-checked-keys="defaultChecked"
            @check-change="isChecked"
            @check="nodeClick"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right">
        <el-button @click="dialogVisible = false">
          {{ $t('lightbox.cancel') }}
        </el-button>
        <el-button :loading="actionLoading" type="primary" @click="confirmPermit">
          {{ $t('lightbox.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import permitOption from '@/views/permit/permitOption'
import { callApi } from '@/api/api'
import { getPermitList } from '@/utils/permitsList'

export default {
  data() {
    return {
      actionLoading: false,
      permitOption,
      permitOptionList: [],
      checked: undefined,
      list: null,
      dialogVisible: false,
      dialogType: 'add',
      // 編輯、新增
      name: '',
      id: '',
      permission: {},
      trueOption: [],
      trueKeys: [],
      defaultChecked: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      callApi('permission', 'list').then((res) => {
        this.list = res.list
        // 將沒有的權限 在權限燈箱改為disabled
        this.permitOptionList = Object.assign({}, permitOption).options
        const permits = getPermitList()
        for (let i = 0; i < permits.length; i++) {
          const permitOptionListLength = this.permitOptionList.length
          for (let j = 0; j < permitOptionListLength; j++) {
            // 第一層
            if (permits[i] === this.permitOptionList[j].id) {
              this.permitOptionList[j].disabled = false
            }
            // 第二層(children)
            if (this.permitOptionList[j].children) {
              this.permitOptionList[j].children.forEach(function(element) {
                if (permits[i] === element.id) {
                  element.disabled = false
                }
              })
            }
          }
        }
      })
    },
    nodeClick(data) {
      // 主項目勾選後，全選子項目
      if (data.children && this.checked === true) {
        this.defaultChecked = this.$refs.tree.getCheckedKeys()
        this.defaultChecked.push(data.id)
        for (let i = 0; i < data.children.length; i++) {
          this.defaultChecked.push(data.children[i].id)
        }
        this.$refs.tree.setCheckedKeys(this.defaultChecked)
      }
    },
    isChecked(data, checked) {
      this.checked = checked
    },
    // 新增
    handleAddPermit() {
      this.dialogType = 'add'
      this.dialogVisible = true
      this.name = ''
      this.permission = Object.assign({}, permitOption.list)
    },
    // 編輯
    handleUpdatePermit(list) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.permission = Object.assign({}, permitOption.list)
      this.findKey(list.permission[0]) // 將值為true的key寫入this.trueKeys陣列中
      this.name = list.name
      this.id = list._id
      this.$nextTick(() => {
        // 由this.trueKeys帶入將要預設打勾的選項
        this.$refs.tree.setCheckedKeys(this.trueKeys, true)
      })
    },
    // 建立返回物件value對應的key值
    findKey(list) {
      const objectKeys = Object.keys(list)
      // 先清除上一次值為true的key
      this.trueKeys = []
      for (let i = 0; i < objectKeys.length; i++) {
        if (list[objectKeys[i]] === true) {
          this.trueKeys.push(objectKeys[i])
        }
      }
      if (this.$store.state.settings.showLog) {
        console.log(this.trueKeys)
      }
    },
    // 送出
    confirmPermit() {
      if (this.actionLoading) {
        return
      }
      this.actionLoading = true
      if (this.dialogType === 'edit') {
        if (this.name === '') {
          alert(this.$t('permits.inputName'))
        } else {
          // 取得勾選為true的選項
          this.trueOption = this.$refs.tree.getCheckedKeys()
          for (let i = 0; i < this.trueOption.length; i++) {
            this.permission[this.trueOption[i]] = true
          }
          const data = {
            name: this.name,
            _id: this.id,
            permission: this.permission
          }
          callApi('permission', 'edit', data).then(() => {
            alert(this.$t('alert.editSuccess'))
            this.dialogVisible = false
            this.clearForm()
            this.getList()
            this.actionLoading = false
          })
        }
      } else {
        // 判斷為新增動作
        if (this.name === '') {
          alert(this.$t('permits.inputName'))
        } else {
          // 取得勾選為true的選項
          this.trueOption = this.$refs.tree.getCheckedKeys()
          if (this.$store.state.settings.showLog) {
            console.log(this.trueOption)
          }
          for (let i = 0; i < this.trueOption.length; i++) {
            this.permission[this.trueOption[i]] = true
          }
          const data = {
            name: this.name,
            permission: this.permission
          }
          callApi('permission', 'add', data).then(() => {
            alert(this.$t('alert.addSuccess'))
            this.dialogVisible = false
            this.clearForm()
            this.getList()
            this.actionLoading = false
          })
        }
      }
    },
    clearForm() {
      this.name = ''
      this.id = ''
      this.permission = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.data-list {
  width: fit-content;
  margin-top: 20px;
}
.input {
  width: 400px;
}
</style>
