<template>
  <div class="app-container calendar-list-container">
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="编号" width="65">
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
      <el-table-column min-width="80px" align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <el-button size="mini" type="text"  @click="handleCreate(scope.row)">
              绑定
          </el-button>
          <el-button size="mini" type="text">同步</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>
    </div>
</template>


<script>
import { fetchNewpropList } from "@/api/newprop";
import waves from "@/directive/waves"; // 水波纹指令
import { parseTime } from "@/utils";
export default {
  name: "newproplist",
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
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
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    }
  }
};
</script>
