<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%" @sort-change="handleSortChange" :default-sort = "{prop: 'updateTime', order: 'descending'}">
      <el-table-column sortable="custom" prop="id" align="center" label="编号" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="新房编号">
        <template slot-scope="scope">
           <span>{{scope.row.newCode}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" align="center" label="楼盘名称">
        <template slot-scope="scope">
          <span><a class="link-type" target="_blank" :href="scope.row.url">{{ scope.row.adName }}</a></span>
        </template>
      </el-table-column>
      <el-table-column min-width="130px" align="center" label="物业类型">
        <template slot-scope="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" align="center" label="价格">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}
            <span v-if="scope.row.price>1000">元/平</span>
            <span v-else-if="scope.row.price==='价格待定'"></span>
            <span v-else>万/套</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column min-width="90px" align="center" label="地址">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="right">
            <p>{{ scope.row.address }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.area }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column min-width="90px" align="center" label="销售状态">
        <template slot-scope="scope">
          <span>
            <el-tag :type="scope.row.status === '售完'?'info':'success'" >
              <span>{{ scope.row.status}}</span>
            </el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" prop="updateTime" sortable="custom" align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleBinding(scope.row)">绑定</el-button>
          <el-button size="small" type="text">同步</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="绑定数据" :visible.sync="dialogFormVisible" @close="handleDialogClose()">
      <el-form ref="dataForm" :model="temp" label-width="100px" label-position="left" style='width: 600px; margin:0px 0 0 70px;'>
        <el-form-item label="项目编号">
          <span>{{ temp.newCode }}</span>
        </el-form-item>
        <el-form-item label="项目名称">
          <span>{{ temp.adName }}</span>
        </el-form-item>
        <el-form-item label="物业类型">
          <span>{{ temp.category }}</span>
        </el-form-item>
        <el-form-item label="官网父盘">
          <template>
            <el-select
              v-model="newpropNo"
              filterable
              clearable
              remote
              reserve-keyword
              placeholder="请输入父盘名称"
              :remote-method="remoteMethod"
              @focus="handleClear"
              @clear="handleClear"
              @visible-change="handleChange"
              :loading="loading">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.estateName"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="官网子盘">
          <template>
            <el-select
              v-model="childNo"
              filterable
              remote
              clearable
              placeholder="请输入父盘名称"
              :remote-method="remoteMethod"
              :disabled="newpropNo !==''?false:true"
              :loading="loading">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.estateName"
                :value="item.id">
                <span style="float: left">{{ item.estateName }}</span>
                <el-tag type="success" style="margin-left:2px;float: right;">{{ item.estateType }}</el-tag>
              </el-option>
            </el-select>
          </template>
          {{newpropNo}}
          {{childNo}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button v-if="dialogStatus=='create'" type="primary" @click="createData()">确定添加</el-button>
        <el-button v-else type="primary" @click="updateData()">确定修改</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchNewpropList, fetchNewpropOptions } from "@/api/newprop";
import waves from "@/directive/waves"; // 水波纹指令
export default {
  name: "newproplist",
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      optionlist: null,
      options: [],
      total: null,
      list: null,
      listLoading: true,
      loading: false,
      newpropNo: "",
      childNo: "",
      listQuery: {
        page: 1,
        limit: 10,
        order: "",
        field: ""
      },
      dialogFormVisible: false,
      temp: {
        newCode: "",
        adName: "",
        category: ""
      }
    };
  },
  filters: {},
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchNewpropList(this.listQuery).then(response => {
        var result = response.data.data;
        this.list = result.items;
        this.total = result.total;
        this.listLoading = false;
      });
    },
    handleOptionlist() {
      fetchNewpropOptions().then(response => {
        var result = response.data.data;
        this.optionlist = result;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleBinding(row) {
      this.dialogFormVisible = true;
      this.temp = Object.assign({}, row); // copy obj
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      /* 绑定数据 */
    },
    handleDialogClose() {
      /* 弹窗关闭 */
      this.newpropNo = "";
      this.childNo = "";
    },
    handleSortChange(obj) {
      this.listQuery.order = obj.order;
      this.listQuery.field = obj.prop;
      this.getList();
    },
    remoteMethod(query) {
      /* 远程搜索 */
      if (query !== "") {
        this.handleOptionlist();
        this.loading = true;
        setTimeout(() => {
          let lists = this.optionlist;
          if (this.newpropNo !== "") {
            lists = this.optionlist.filter(i => {
              return i.id === this.newpropNo;
            })[0].item;
            console.log(lists);
          }

          this.loading = false;
          this.options = lists.filter(i => {
            return i.estateName.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      }
    },
    handleClear() {
      this.options = [];
      this.newpropNo = "";
      this.childNo = "";
    },
    handleChange(status) {
      if (status === false) {
        this.options = [];
      }
    }
  }
};
</script>
