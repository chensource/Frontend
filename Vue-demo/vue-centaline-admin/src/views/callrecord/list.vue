<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!-- <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.title">
      </el-input> -->
      <el-select clearable class="filter-item" style="width: 120px" v-model="listQuery.isnewprop" placeholder="类型">
        <el-option v-for="item in sourceOptions" :key="item.key" :label="item.name" :value="item.value">
        </el-option>
      </el-select>
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.iscentaline" placeholder="来源">
        <el-option v-for="item in tradeOptions" :key="item.key" :label="item.name" :value="item.value">
        </el-option>
      </el-select>
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.calledStatus" placeholder="通话状态">
        <el-option v-for="item in calledStatusOptions" :key="item.key" :label="item.name" :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="编号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.keyId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="通话编号">
        <template slot-scope="scope">
           <span>{{scope.row.callId}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="220px" align="center" label="来电项目">
        <template slot-scope="scope">
          <span>{{ scope.row.calledMsg }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="接听人工号">
        <template slot-scope="scope">
          <span>{{ scope.row.calledNo }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="接听人姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.calledName }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" label="接听人电话">
        <template slot-scope="scope">
          <span>{{ scope.row.called }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="来电时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="70px"  align="center" label="新房来电">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isNewprop |  iconFilter">
            <i v-if="scope.row.isNewprop" class="el-icon-success"></i>
            <i v-else class="el-icon-error"></i>
          </el-tag>
        </template>
      </el-table-column>
       <el-table-column min-width="70px"  align="center" label="公司来电">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isCentaline | iconFilter">
            <i v-if="scope.row.isCentaline" class="el-icon-success"></i>
            <i v-else class="el-icon-error"></i>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-steps :active="stepQuery.step" simple align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="客户信息"></el-step>
        <el-step title="顾问评分"></el-step>
      </el-steps>
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" style='width: 700px; margin:25px 0 0 75px;'>
        <div v-show="stepQuery.step == 1">
          <el-form-item label="通话录音">
            <VueAudio :theUrl="temp.audioStr" />
          </el-form-item>
          <el-form-item label="来电项目">
            <span>{{ temp.calledMsg }}</span>
          </el-form-item>
          <el-form-item label="来电电话">
            <span>{{ temp.caller }}</span>
          </el-form-item>
          <el-form-item label="接听人工号">
             <span>{{ temp.calledNo }}</span>
          </el-form-item>
          <el-form-item label="接听人姓名">
            <span>{{ temp.calledName }}</span>
          </el-form-item>
           <el-form-item label="接听人电话">
            <span>{{ temp.called }}</span>
          </el-form-item>
        </div>
        <div v-show="stepQuery.step == 2">
          <el-form-item label="是否接通">
            <el-switch v-model="temp.isConnected"></el-switch>
          </el-form-item>
          <el-form-item label="是否有效">
            <el-switch v-model="temp.isEffective"></el-switch>
          </el-form-item>
          <el-form-item label="物业类型">
            <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.iscentaline" placeholder="物业类型">
              <el-option v-for="item in tradeOptions" :key="item.key" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="意向区域">
          </el-form-item>
          <el-form-item label="意向区域">
          </el-form-item>
        </div>
        <div v-show="stepQuery.step == 3">
          3
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handlePreStep" v-show="stepQuery.preStep">上一步</el-button>
        <el-button @click="handleNextStep" v-show="stepQuery.nextStep">下一步</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-show="stepQuery.step == 3" type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from "@/api/callrecord";

import waves from "@/directive/waves"; // 水波纹指令
import { parseTime } from "@/utils";
import VueAudio from "@/components/Audio";

// const tradeOptions = [
//   { key: 1, name: "新房", value: "新" },
//   { key: 2, name: "出售", value: "售" },
//   { key: 3, name: "出租", value: "租" }
// ];

// const sourceOptions = [
//   { key: 1, name: "新房", value: "Newprop" },
//   { key: 2, name: "二手房", value: "esf" }
// ];

// // arr to obj ,such as { CN : "中国", US : "美国" }
// const tardeTypeKeyValue = tradeOptions.reduce((acc, cur) => {
//   acc[cur.value] = cur.name;
//   return acc;
// }, {});

export default {
  name: "calledlist",
  directives: {
    waves
  },
  components: {
    VueAudio
  },
  data() {
    return {
      datetimes: "",
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        iscentaline: null,
        type: undefined,
        isnewprop: null,
        calledStatus: 0
      },
      tradeOptions: [
        {
          key: 1,
          value: "true",
          name: "公司项目"
        },
        {
          key: 2,
          value: "false",
          name: "非公司项目"
        }
      ],
      sourceOptions: [
        {
          key: 1,
          value: "true",
          name: "新房"
        },
        {
          key: 2,
          value: "false",
          name: "二手房"
        }
      ],
      calledStatusOptions: [
        {
          key: 1,
          value: 0,
          name: "已接通"
        },
        {
          key: 2,
          value: -1,
          name: "未接通"
        }
      ],
      showAuditor: false,
      temp: {
        id: undefined,
        isConnected: true,
        isEffective: true,
        propertyType: 1,
        intentionArea: null,
        unitPrice: null,
        minArea: null,
        maxArea: null,
        remark: null,
        isCourtesy: false,
        isPatienty: false,
        isInvitation: false,
        isTransfer: false,
        CalledStatus: 0,
        timestamp: new Date(),
        audioStr: ""
      },
      stepQuery: {
        step: 1,
        preStep: false,
        nextStep: true
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      dialogPvVisible: false,
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" }
        ]
      }
    };
  },
  filters: {
    iconFilter(status) {
      const statusMap = {
        true: "success",
        false: "danger"
      };
      return statusMap[status];
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data.items;
        this.total = response.data.data.total;
        this.listLoading = false;
      });
    },
    handlePreStep() {
      this.stepQuery.step--;
      this.goStep(this.stepQuery.step);
    },
    handleNextStep() {
      this.stepQuery.step++;
      this.goStep(this.stepQuery.step);
    },
    getAudioUrl() {},
    goStep: function(n) {
      switch (n) {
        case 1:
          this.stepQuery.preStep = false;
          this.stepQuery.nextStep = true;
          break;
        case 2:
          this.stepQuery.preStep = true;
          this.stepQuery.nextStep = true;
          break;
        case 3:
          this.stepQuery.preStep = true;
          this.stepQuery.nextStep = false;
          break;
      }
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
    resetStepQuery() {
      this.stepQuery = {
        step: 1,
        preStep: false,
        nextStep: true
      };
    },
    handleUpdate(row) {
      this.resetStepQuery();

      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);

      this.temp.audioStr =
        "http://10.4.18.13/RecordingDownLoad.aspx?userid=" +
        this.temp.calledNo +
        "&id=" +
        this.temp.callId;

      console.log(this.temp.audioStr);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
        }
      });
    },
    handleDelete(row) {
      this.$notify({
        title: "成功",
        message: "删除成功",
        type: "success",
        duration: 2000
      });
      const index = this.list.indexOf(row);
      this.list.splice(index, 1);
    },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/vendor/Export2Excel");
        const tHeader = ["时间", "地区", "类型", "标题", "重要性"];
        const filterVal = ["timestamp", "province", "type", "title", "trade"];
        const data = this.formatJson(filterVal, this.list);
        export_json_to_excel(tHeader, data, "table数据");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
