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
                    <span v-html="props.row.effect" />
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { ygoOptions } from '@/config/ygo.config'
import { callApi } from '@/api/api'
import { removeNullAndEmptyString } from '@/utils/index.js'

export default {
  components: {
    Pagination
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
      packList: null
    }
  },
  mounted() {
    this.getList()
    this.getPackList()
  },
  methods: {
    getList() {
      if (this.listQuery.filter.atk_l) { this.listQuery.filter.atk_l = parseInt(this.listQuery.filter.atk_l) }
      if (this.listQuery.filter.atk_t) { this.listQuery.filter.atk_t = parseInt(this.listQuery.filter.atk_t) }
      if (this.listQuery.filter.def_l) { this.listQuery.filter.def_l = parseInt(this.listQuery.filter.def_l) }
      if (this.listQuery.filter.def_t) { this.listQuery.filter.def_t = parseInt(this.listQuery.filter.def_t) }

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
      this.getList()
    },
    getPackList() {
      callApi('packType', 'list', this.packListQuery).then((res) => {
        this.packList = res.list
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
