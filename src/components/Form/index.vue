<template>
  <div class="form-wrapper">
    <el-form class="form" label-width="90px" label-position="left">
      <div v-for="(item, key, index) in formData" :key="index">
        <!-- time -->
        <el-form-item v-if="item.type === 'time'" :label="item.label">
          <el-date-picker
            v-model="item.preset"
            type="datetime"
            placeholder="Select time"
          />
        </el-form-item>
        <!-- input -->
        <el-form-item v-if="item.type === 'input'" :label="item.label">
          <el-input
            v-model="item.preset"
            type="text"
            maxlength="30"
            class="input"
            :placeholder="$t('form.pleaseInput')"
          />
        </el-form-item>
        <!-- log input -->
        <el-form-item v-if="item.type === 'long-input'" :label="item.label">
          <el-input
            v-model="item.preset"
            type="text"
            maxlength="120"
            style="width: 500px"
            class="input"
            :placeholder="$t('form.pleaseInput')"
          />
        </el-form-item>
        <!-- textarea -->
        <el-form-item v-if="item.type === 'textarea'" :label="item.label">
          <el-input
            v-model="item.preset"
            type="textarea"
            class="textarea"
            :placeholder="$t('form.pleaseInput')"
            :autosize="{ minRows: 2, maxRows: 8 }"
            resize="none"
          />
        </el-form-item>
        <!-- select -->
        <el-form-item v-if="item.type === 'select'" :label="item.label">
          <el-select
            v-model="item.preset"
            :placeholder="$t('form.pleaseChoose')"
            clearable
            filterable
          >
            <el-option
              v-for="(option, optionIndex) in item.options"
              :key="optionIndex"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <!-- checkbox -->
        <el-form-item v-if="item.type === 'checkbox'" :label="item.label">
          <el-checkbox v-model="item.preset" />
        </el-form-item>
        <!-- 圖片 -->
        <el-form-item v-if="item.type === 'photo'" :label="item.label">
          <label class="photo-container">
            <input
              class="photo-btn"
              type="file"
              accept="image/*"
              @change="chooseFile($event)"
            >
            {{ formData.photo.preset ? photoName : $t("form.choosePhoto") }}
          </label>
          <img
            class="upload-photo"
            :src="formData.photo.preset"
            alt=""
          >
        </el-form-item>
        <!-- 副文本 -->
        <tinymce
          v-if="item.type === 'tinymce'"
          ref="reset"
          v-model="item.preset"
          :height="500"
          class="tinymce"
        />
        <!-- Tag -->
        <div v-if="item.type === 'tag'" class="tag-container">
          <div>
            <div slot="header" class="item-title">
              {{ `Tag（${formData.tag.preset.length}/3）` }}
            </div>
            <el-tag
              v-for="(tag, tagIndex) in item.preset"
              :key="tag._id"
              closable
              :disable-transitions="false"
              class="tag"
              @close="handleClose(tagIndex)"
            >
              {{ tag.tag }}
            </el-tag>
          </div>

          <el-card class="tag-selection-box">
            <div
              v-for="(item, index) in tagList"
              :key="item._id"
              class="tag-selection"
              @click="addTag(item, index)"
            >
              {{ item.tag }}
            </div>
          </el-card>
        </div>
        <!-- 稀有度 -->
        <div v-if="item.type === 'rarity'" class="tag-container">
          <div>
            <div slot="header" class="item-title">
              {{ $t("card.rarity") }}
            </div>
            <el-tag
              v-for="(rarity, rarityIndex) in item.preset"
              :key="rarity"
              closable
              :disable-transitions="false"
              class="tag"
              @close="handleCloseRarity(rarityIndex)"
            >
              {{ rarity }}
            </el-tag>
          </div>

          <el-card class="tag-selection-box">
            <div
              v-for="item in ygoOptions.rare"
              :key="item"
              class="tag-selection"
              @click="addRarity(item)"
            >
              {{ item }}
            </div>
          </el-card>
        </div>
      </div>
    </el-form>

    <div class="btn-box">
      <el-button @click="handleCancel">
        {{ $t("lightbox.cancel") }}
      </el-button>
      <el-button type="primary" @click="emitData">
        {{ confirmText }}
      </el-button>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce/index'
import { uploadImage } from '@/utils/image'
import { height_limit, KB_limit, width_limit } from '@/config/main'
import { ygoOptions } from '@/config/ygo.config'
import store from '@/store/modules/article'
import { checkTagList } from '@/api/article'

export default {
  components: {
    Tinymce
  },
  props: {
    formData: {
      type: Object,
      required: true
    },
    confirmText: {
      type: String,
      default() {
        return this.$t('lightbox.confirm')
      }
    }
  },
  data() {
    return {
      ygoOptions,
      // photo
      photoName: this.$t('form.choosePhoto'),
      imgSrc: ''
    }
  },
  computed: {
    tagList() {
      return store.state.tagList
    }
  },
  mounted() {
    checkTagList(this.tagList)
  },
  methods: {
    // 資料傳回父層
    emitData() {
      const formDataLength = Object.entries(this.formData)
      const emitData = {}
      for (let i = 0; i < formDataLength.length; i++) {
        emitData[formDataLength[i][0]] = formDataLength[i][1].preset
      }
      this.$emit('emitData', emitData)
    },
    // 取消
    handleCancel() {
      this.$emit('cancel')
    },
    // photo
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
            vm.formData.photo.preset = result.result
            vm.photoName = result.name
          },
          function(err) {
            alert(vm.$t('alert.' + err))
          },
          width_limit,
          height_limit
        )
      }
    },
    // tag
    checkDuplicateTag(tagObj) {
      return this.formData.tag.preset.find((e) => e._id === tagObj._id)
    },
    addTag(tagObj, index) {
      // tag上限為三個
      if (this.formData.tag.preset.length < 3) {
        // 檢查被點擊的tag是否已經加入
        if (!this.checkDuplicateTag(tagObj)) {
          this.formData.tag.preset.push(this.tagList[index])
        }
      }
    },
    handleClose(tagIndex) {
      this.formData.tag.preset.splice(tagIndex, 1)
    },
    // 稀有度
    checkDuplicateRarity(rarity) {
      return this.formData.rarity.preset.find((e) => e === rarity)
    },
    handleCloseRarity(rarityIndex) {
      this.formData.rarity.preset.splice(rarityIndex, 1)
    },
    addRarity(item) {
      // 檢查被點擊的稀有度是否已經加入
      if (!this.checkDuplicateRarity(item)) {
        this.formData.rarity.preset.push(item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-wrapper {
  padding: 0 20px;
  & .input {
    width: 198px;
  }
  & .textarea {
    width: 500px;
  }
  & .item-title {
    width: 90px;
    line-height: 36px;
    display: inline-block;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    padding: 0 12px 0 0;
    font-weight: 700;
  }
  & .photo-container {
    display: inline-block;
    max-width: 130px;
    padding: 0 14px 0 11px;
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
  & .upload-photo {
    width: 150px;
    margin-left: 10px;
  }
  & .tinymce {
    width: 99%;
    margin-bottom: 20px;
  }
  & .tag-container {
    margin: 20px 0;
    & .tag {
      margin-right: 10px;
    }
    & .tag-selection-box {
      margin-top: 10px;
      width: 400px;
      max-height: 150px;
      overflow-y: scroll;
      background-color: #eef5ff;
      ::v-deep .el-card__body {
        padding: 5px 15px !important;
      }
      & .tag-selection {
        margin: 5px 0;
        cursor: pointer;
        transition-duration: 0.2s;
        &:hover {
          color: rgb(24, 144, 255);
        }
      }
    }
  }
  & .btn-box {
    text-align: right;
  }
}
</style>
