<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-date-picker class="filter-item"
        v-model="dateRange"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        unlink-panels
        default-value="2010-10-01"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
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
      <el-table-column min-width="70px"  align="center" label="来电类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isNewprop |  iconFilter">
            <span>{{ scope.row.isNewprop ? '新房' : '二手房' }}</span>
          </el-tag>
        </template>
      </el-table-column>
       <el-table-column min-width="70px"  align="center" label="公司来电">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isCentaline | iconFilter">
            <span :class="scope.row.isCentaline?'el-icon-success':'el-icon-error'"></span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="0" class-name="small-padding">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="handleDialogClose()">
      <el-steps :active="stepQuery.step" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="客户信息"></el-step>
        <el-step title="顾问评分"></el-step>
      </el-steps>
      <el-form ref="dataForm" :model="temp" label-width="100px" label-position="left" style='width: 600px; margin:20px 0 0 70px;'>
        <div v-show="stepQuery.step == 1">
          <el-form-item label="通话录音">
            <VueAudio :theUrl="audioStr" :theError="false" :thePlaying="temp.playing" />
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
          <el-form-item label="意向区域">
            <el-input v-model="temp.intentionArea" placeholder="意向区域" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="物业类型">
            <el-select clearable class="filter-item" style="width: 250px" multiple v-model="temp.propertyType" placeholder="物业类型">
              <el-option v-for="item in propertyTypeOptions" :key="item.key" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单价">
            <el-input v-model="temp.unitPrice" placeholder="单价" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="面积">
            <el-input-number lable="最小面积" v-model="temp.minArea"></el-input-number>
            <el-input-number lable="最大面积" v-model="temp.maxArea"></el-input-number>
          </el-form-item>
        </div>
        <div v-show="stepQuery.step == 3">
          <el-form-item label="礼貌用语">
            <el-switch v-model="temp.isCourtesy"></el-switch>
          </el-form-item>
          <el-form-item :label="temp.isNewprop ? '耐心解答':'房源信息'">
            <el-switch v-model="temp.isPatienty"></el-switch>
          </el-form-item>
          <el-form-item label="邀约到访">
            <el-switch v-model="temp.isInvitation"></el-switch>
          </el-form-item>
          <el-form-item :label="temp.isNewprop ? '项目转介':'约看成功'">
            <el-switch v-model="temp.isTransfer"></el-switch>
          </el-form-item>
          <el-form-item label="评分">
            <el-rate style="margin-top:8px;" show-score v-model="temp.score" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
          </el-form-item>
           <el-form-item label="备注信息">
            <el-input v-model="temp.remark" style="width:400px;" :rows="3" placeholder="单价" type="textarea"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handlePreStep" v-show="stepQuery.preStep">上一步</el-button>
        <el-button @click="handleNextStep" v-show="stepQuery.nextStep">下一步</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-show="stepQuery.step == 3" type="primary" @click="createData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, create } from "@/api/callrecord";
// import store from "./store";

import waves from "@/directive/waves"; // 水波纹指令
import { parseTime } from "@/utils";
import VueAudio from "@/components/Audio";

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
      dateRange: "",
      listQuery: {
        page: 1,
        limit: 10,
        iscentaline: null,
        type: undefined,
        isnewprop: null,
        calledStatus: 0,
        beginTime: "",
        endTime: ""
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
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
      importanceOptions: [1, 2, 3],
      propertyTypeOptions: [
        { keyid: 1, value: "住宅", name: "住宅" },
        { keyid: 2, value: "商铺", name: "商铺" },
        { keyid: 3, value: "公寓", name: "公寓" },
        { keyid: 4, value: "写字楼", name: "写字楼" },
        { keyid: 5, value: "其他", name: "其他" }
      ],
      temp: {
        callId: undefined,
        isConnected: false,
        isEffective: true,
        propertyType: null,
        intentionArea: null,
        unitPrice: null,
        minArea: null,
        maxArea: null,
        remark: null,
        isCourtesy: false,
        isPatienty: false,
        isInvitation: false,
        isTransfer: false,
        score: null,
        calledStatus: 0,
        timestamp: new Date(),
        playing: false
        // username: store.getters.name
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
  computed: {
    audioStr: function() {
      return (
        "http://10.4.18.13/RecordingDownLoad.aspx?userid=" +
        this.temp.calledNo +
        "&id=" +
        this.temp.callId
      );
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      if (this.dateRange !== "" && this.dateRange !== null) {
        this.listQuery.beginTime = this.dateRange[0];
        this.listQuery.endTime = this.dateRange[1];
      } else {
        this.listQuery.beginTime = "";
        this.listQuery.endTime = "";
      }
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      console.log(this.temp);
      create(this.temp).then(response => {
        // this.list.unshift(this.temp);
        var data = response.data;
        if (data.meta.code === 0) {
          this.dialogFormVisible = false;
          this.$notify({
            title: "成功",
            message: "创建成功",
            type: "success",
            duration: 2000
          });
        }
      });
    },
    resetStepQuery() {
      this.stepQuery = {
        step: 1,
        preStep: false,
        nextStep: true
      };
    },
    handleDialogClose() {
      this.resetStepQuery();
      this.temp.playing = false;
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
