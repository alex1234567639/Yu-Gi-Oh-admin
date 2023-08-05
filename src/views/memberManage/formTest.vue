<template>
  <div class="form-test">
    <template>
      <el-tabs v-model="tabName">
        <el-tab-pane label="新增表格" name="add">
          <Form
            class="form-container"
            :form-data="addFormData"
            :confirm-text="$t('lightbox.add')"
            @emitData="getAddData"
            @cancel="cancelAddData"
          />
        </el-tab-pane>

        <el-tab-pane label="編輯彈窗" name="edit">
          <el-button @click="handleEdit">編輯文章</el-button>

          <el-dialog title="編輯" :visible.sync="editVisible" width="1100px">
            <Form
              :form-data="editFormData"
              @emitData="getEditData"
              @cancel="editVisible = false"
            />
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
import Form from '@/components/Form/index'

export default {
  components: {
    Form
  },
  data() {
    return {
      tabName: 'add',
      // 新增
      addData: undefined,
      addFormData: {
        title: { type: 'input', label: '文章標題', preset: '' },
        type: {
          type: 'select',
          label: '狀態',
          preset: undefined,
          options: [
            { label: '上架中', value: 0 },
            { label: '下架中', value: 1 }
          ]
        },
        to_top: { type: 'checkbox', label: '置頂', preset: true },
        photo: { type: 'photo', label: '文章封面圖', preset: '' },
        tag: { type: 'tag', label: 'Tag', preset: [] },
        rarity: { type: 'rarity', label: '稀有度', preset: [] },
        content: { type: 'tinymce', label: '內容', preset: '' }
      },
      // 編輯
      editVisible: false,
      editData: undefined,
      editFormData: {},
      editFakeData: {
        title: { type: 'input', label: '文章標題', preset: '123' },
        type: {
          type: 'select',
          label: '狀態',
          preset: 0,
          options: [
            { label: '上架中', value: 0 },
            { label: '下架中', value: 1 }
          ]
        },
        to_top: { type: 'checkbox', label: '置頂', preset: false },
        photo: { type: 'photo', label: '文章封面圖', preset: '' },
        tag: {
          type: 'tag',
          label: 'Tag',
          preset: [
            { _id: '1', tag: 'Hero' },
            { _id: '2', tag: '主流牌組' }
          ]
        },
        rarity: {
          type: 'rarity',
          label: '稀有度',
          preset: ['金亮', '半鑽']
        },
        content: { type: 'tinymce', label: '內容', preset: '文章內容' }
      }
    }
  },
  methods: {
    getAddData(data) {
      console.log(data)
    },
    cancelAddData() {
      console.log('Cancel Add Data')
    },
    // 編輯會員
    handleEdit() {
      this.editVisible = true
      // eslint-disable-next-line no-undef
      this.editFormData = structuredClone(this.editFakeData)
    },
    getEditData(data) {
      console.log(data)
      this.editVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.form-test {
  padding: 20px;
  & .form-container {
    width: 1000px;
    padding: 20px;
  }
}
</style>
