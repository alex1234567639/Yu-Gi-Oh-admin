<template>
  <div class="components-container">
    <el-tabs v-model="tabName">
      <el-tab-pane :label="$t('card.list')" name="card_list">
        <!--搜尋Bar-->
        <div class="filter-container">
          <!-- 卡號 -->
          <div class="filter-item">
            <div class="title">{{ `${$t("card.id")}:` }}</div>
            <el-input
              v-model="listQuery.filter.id"
              :placeholder="$t('card.id')"
              clearable
              type="text"
              class="input"
            />
          </div>
          <!-- 卡片名稱 -->
          <div class="filter-item">
            <div class="title">{{ `${$t("card.name")}:` }}</div>
            <el-input
              v-model="listQuery.filter.name"
              :placeholder="$t('card.name')"
              clearable
              type="text"
              class="input"
            />
          </div>
          <!-- 種類 -->
          <div class="filter-item">
            <div class="title">{{ `${$t("card.type")}:` }}</div>
            <el-select
              v-model="listQuery.filter.type"
              :placeholder="$t('card.type')"
              clearable
              class="select"
            >
              <el-option
                v-for="item in ygoOptions.type"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </div>
          <!-- 星數 -->
          <div class="filter-item">
            <div class="title">{{ `${$t("card.star")}:` }}</div>
            <el-select
              v-model="listQuery.filter.star"
              :placeholder="$t('card.star')"
              clearable
              class="select"
            >
              <el-option
                v-for="item in ygoOptions.star"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </div>
          <!-- 屬性 -->
          <div class="filter-item">
            <div class="title">{{ `${$t("card.attribute")}:` }}</div>
            <el-select
              v-model="listQuery.filter.attribute"
              :placeholder="$t('card.attribute')"
              clearable
              class="select"
            >
              <el-option
                v-for="item in ygoOptions.attribute"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </div>
          <!-- 種族 -->
          <div class="filter-item">
            <div class="title">{{ `${$t("card.race")}:` }}</div>
            <el-select
              v-model="listQuery.filter.race"
              :placeholder="$t('card.race')"
              clearable
              class="select"
            >
              <el-option
                v-for="item in ygoOptions.race"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </div>
          <!-- 卡片密碼 -->
          <div class="filter-item">
            <div class="title">{{ `${$t("card.number")}:` }}</div>
            <el-input
              v-model="listQuery.filter.number"
              :placeholder="$t('card.number')"
              clearable
              type="text"
              class="input"
              @input="
                listQuery.filter.number = listQuery.filter.number.replace(
                  /[^\d]/g,
                  ''
                )
              "
            />
          </div>
          <!-- 搜尋 -->
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >
            {{ $t("common.search") }}
          </el-button>
        </div>
        <div class="filter-container">
          <!-- 攻擊力 -->
          <div class="filter-item">
            <div class="title">{{ `${$t("card.atk")}:` }}</div>
            <el-input
              v-model="listQuery.filter.atk_l"
              clearable
              type="text"
              class="input"
              @input="
                listQuery.filter.atk_l = listQuery.filter.atk_l.replace(
                  /[^\d]/g,
                  ''
                )
              "
            />
            <span class="text">~</span>
            <el-input
              v-model="listQuery.filter.atk_t"
              clearable
              type="text"
              class="input"
              @input="
                listQuery.filter.atk_t = listQuery.filter.atk_t.replace(
                  /[^\d]/g,
                  ''
                )
              "
            />
          </div>
          <!-- 守備力 -->
          <div class="filter-item">
            <div class="title">{{ `${$t("card.def")}:` }}</div>
            <el-input
              v-model="listQuery.filter.def_l"
              clearable
              type="text"
              class="input"
              @input="
                listQuery.filter.def_l = listQuery.filter.def_l.replace(
                  /[^\d]/g,
                  ''
                )
              "
            />
            <span class="text">~</span>
            <el-input
              v-model="listQuery.filter.def_t"
              clearable
              type="text"
              class="input"
              @input="
                listQuery.filter.def_t = listQuery.filter.def_t.replace(
                  /[^\d]/g,
                  ''
                )
              "
            />
          </div>
          <!-- 包裝分類 -->
          <div class="filter-item">
            <div class="title">
              {{ `${$t("card.product_information_type")}:` }}
            </div>
            <el-select
              v-model="listQuery.filter.product_information_type"
              :placeholder="$t('card.product_information_type')"
              clearable
              class="select"
              style="width: 270px"
            >
              <el-option
                v-for="item in packList"
                :key="item.id"
                :label="item.name"
                :value="item.packType"
              />
            </el-select>
          </div>
          <!-- 稀有度 -->
          <div class="filter-item">
            <div class="title">{{ `${$t("card.rarity")}:` }}</div>
            <el-select
              v-model="listQuery.filter.rarity"
              :placeholder="$t('card.rarity')"
              clearable
              class="select"
            >
              <el-option
                v-for="item in ygoOptions.rare"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </div>
        </div>

        <!--表格-->
        <el-table
          :data="list"
          border
          fit
          highlight-current-row
          class="table-list"
        >
          <!-- 展開內容 -->
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-row>
                  <el-form-item :label="$t('card.effect')">
                    <span style="white-space: pre-wrap" v-html="props.row.effect" />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item :label="$t('card.product_information_type')">
                    {{ props.row.product_information_type }}
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item :label="$t('card.rarity')">
                    {{ props.row.rarity.join("、") }}
                  </el-form-item>
                </el-row>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column :label="$t('common.id')" align="center" width="60">
            <template slot-scope="row">
              {{ row.$index + 1 + listQuery.page * listQuery.limit }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('card.id')"
            prop="id"
            align="center"
            width="150"
          />
          <el-table-column
            :label="$t('card.name')"
            prop="name"
            align="center"
            width="250"
          />
          <el-table-column
            :label="$t('card.type')"
            prop="type"
            align="center"
            width="100"
          />
          <el-table-column
            :label="$t('card.star')"
            prop="star"
            align="center"
            width="80"
          />
          <el-table-column
            :label="$t('card.attribute')"
            prop="attribute"
            align="center"
            width="60"
          />
          <el-table-column
            :label="$t('card.race')"
            prop="race"
            align="center"
            width="100"
          />
          <el-table-column
            :label="$t('card.atk')"
            prop="atk"
            align="center"
            width="80"
          />
          <el-table-column
            :label="$t('card.def')"
            prop="def"
            align="center"
            width="80"
          />
          <el-table-column
            :label="$t('card.number')"
            prop="number"
            align="center"
            width="100"
          />
          <el-table-column :label="$t('common.action')" width="100" align="center">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" @click="handleEdit(row)">
                {{ $t('common.edit') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="currentPage"
          :limit.sync="listQuery.limit"
          style="text-align: center"
          :page-sizes="[20, 50, 100]"
          class="pagination"
          @pagination="getList"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 編輯 -->
    <el-dialog title="編輯" :visible.sync="editVisible">
      <Form
        :form-data="editFormData"
        @emitData="confirmEdit"
        @cancel="editVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import Form from '@/components/Form/index'
import { ygoOptions } from '@/config/ygo.config'
import { callApi } from '@/api/api'
import { removeNullAndEmptyString } from '@/utils/index.js'

export default {
  components: {
    Pagination,
    Form
  },
  data() {
    return {
      ygoOptions,
      tabName: 'card_list',
      total: 0,
      list: null,
      listQuery: {
        page: 0,
        limit: 20,
        filter: {
          id: '',
          number: '',
          name: '',
          type: '',
          star: '',
          attribute: '',
          race: '',
          rarity: '',
          atk_t: '',
          atk_l: '',
          def_t: '',
          def_l: '',
          product_information_type: ''
        }
      },
      currentPage: 0,
      packListQuery: {
        page: 0,
        limit: 0,
        filter: {
          status: 0
        }
      },
      packList: null,
      // 編輯
      editVisible: false,
      editFormData: {},
      editData: {
        _id: { preset: '' },
        id: { type: 'input', label: this.$t('card.id'), preset: '' },
        name: { type: 'input', label: this.$t('card.name'), preset: '' },
        type: {
          type: 'select',
          label: this.$t('card.type'),
          preset: 0,
          options: []
        },
        star: {
          type: 'select',
          label: this.$t('card.star'),
          preset: 0,
          options: []
        },
        attribute: {
          type: 'select',
          label: this.$t('card.attribute'),
          preset: 0,
          options: []
        },
        race: {
          type: 'select',
          label: this.$t('card.race'),
          preset: 0,
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
          preset: 0,
          options: []
        },
        number: { type: 'input', label: this.$t('card.number'), preset: '' }
      },
      typeOption: [],
      starOption: [],
      attributeOption: [],
      raceOption: [],
      productInfoOption: []
    }
  },
  mounted() {
    this.getList()
    this.getPackList()
    this.typeOption = this.arrayTransfer(this.ygoOptions.type)
    this.starOption = this.arrayTransfer(this.ygoOptions.star)
    this.attributeOption = this.arrayTransfer(this.ygoOptions.attribute)
    this.raceOption = this.arrayTransfer(this.ygoOptions.race)
  },
  methods: {
    getList() {
      if (this.listQuery.filter.atk_l) {
        this.listQuery.filter.atk_l = parseInt(this.listQuery.filter.atk_l)
      }
      if (this.listQuery.filter.atk_t) {
        this.listQuery.filter.atk_t = parseInt(this.listQuery.filter.atk_t)
      }
      if (this.listQuery.filter.def_l) {
        this.listQuery.filter.def_l = parseInt(this.listQuery.filter.def_l)
      }
      if (this.listQuery.filter.def_t) {
        this.listQuery.filter.def_t = parseInt(this.listQuery.filter.def_t)
      }

      this.listQuery.page = this.currentPage - 1
      callApi('cards', 'list', removeNullAndEmptyString(this.listQuery)).then(
        (res) => {
          this.list = res.list
          this.total = res.total
        }
      )
    },
    handleFilter() {
      this.currentPage = 1
      this.listQuery.filter.id = this.listQuery.filter.id.toUpperCase()
      this.getList()
    },
    getPackList() {
      callApi('packType', 'list', this.packListQuery).then((res) => {
        this.packList = res.list
        for (let i = 0; i < this.packList.length; i++) {
          this.productInfoOption.push({ label: this.packList[i].name, value: this.packList[i].packType })
        }
      })
    },
    // 編輯
    arrayTransfer(arr, isRarity = false) {
      // 將陣列調整為 [{ label: '', value: 0 }, ...] 的形式
      const result = []
      for (let i = 0; i < arr.length; i++) {
        result.push({ label: arr[i], value: arr[i] })
      }
      return result
    },
    handleEdit(row) {
      this.editVisible = true
      this.editData.type.options = this.typeOption
      this.editData.star.options = this.starOption
      this.editData.attribute.options = this.attributeOption
      this.editData.race.options = this.raceOption
      this.editData.product_information_type.options = this.productInfoOption

      // 帶入預設值
      Object.keys(this.editData).forEach((key) => {
        this.editData[key].preset = row[key]
      })

      this.editFormData = this.editData
    },
    confirmEdit(data) {
      data.atk = parseInt(data.atk)
      data.def = parseInt(data.def)
      console.log(data)
      callApi('cards', 'edit', removeNullAndEmptyString(data)).then(() => {
        alert(this.$t('alert.editSuccess'))
        this.getList()
        this.editVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  width: 1100px;
  .filter-item {
    display: inline-block;
    vertical-align: bottom;
    margin-right: 10px;
    & .title {
      margin: 0 0 5px 3px;
      font-size: 14px;
      color: #8a8a8a;
    }
    & .input {
      width: 130px;
    }
    & .select {
      width: 130px;
    }
    & .text {
      font-size: 14px;
      color: #8a8a8a;
      margin: 0 1px;
    }
  }
}
.table-list {
  width: fit-content;
}
.pagination {
  max-width: 1100px;
  text-align: center;
}
</style>
