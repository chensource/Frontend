<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-date-picker  style="width:145px;" class="filter-item"
        v-model="listQuery.beginTime"
        type="date"
        placeholder="开始时间"
        value-format="yyyy-MM-dd"
        :editable = false
        :picker-options="beginTimeOptions"
        name="beginTime"
        id="beginTime"
      ></el-date-picker>
      <el-date-picker style="width:145px;"  class="filter-item"
        v-model="listQuery.endTime"
        type="date"
        :editable = false
        placeholder="结束时间"
        value-format="yyyy-MM-dd"
        name="endTime"
        id="endTime"
        :picker-options="endTimeOptions"
      ></el-date-picker>
      <el-input clearable class="filter-item" style="width: 120px" v-model="listQuery.callId" placeholder="通话编号"></el-input>

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
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-download" @click="handleDownload" :disabled="true">导出</el-button>
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
      <el-table-column min-width="160px" align="center" label="来电项目">
        <template slot-scope="scope">
          <span>{{ scope.row.calledMsg }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="130px" align="center" label="接听人工号">
        <template slot-scope="scope">
          <span>{{ scope.row.calledNo }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" align="center" label="接听人姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.calledName }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" align="center" label="接听人电话">
        <template slot-scope="scope">
          <span>{{ scope.row.called }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="90px" align="center" label="来电时间">
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
      <el-table-column min-width="70px"  align="center" label="是否评价">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isEvaluation | iconFilter">
            <span :class="scope.row.isEvaluation?'el-icon-success':'el-icon-error'"></span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="70px"  align="center" label="评分">
        <template slot-scope="scope">
           <span>{{ scope.row.score ? scope.row.score:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="70px"  align="center" label="评价人">
        <template slot-scope="scope">
            <span>{{scope.row.createEmployeeName ? scope.row.createEmployeeName:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isEvaluation" type="primary" size="mini" :disabled="scope.row.calledStatus !== 0"  @click="handleUpdate(scope.row)">
              编辑
          </el-button>
          <el-button v-else size="mini" :disabled="scope.row.calledStatus !== 0" @click="handleCreate(scope.row)">
              创建
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>

    <el-dialog   :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="handleDialogClose()">
      <el-steps :active="stepQuery.step" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="客户信息"></el-step>
        <el-step title="顾问评分"></el-step>
      </el-steps>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px" label-position="left" style='width: 600px; margin:20px 0 0 70px;'>
        <div v-show="stepQuery.step == 1">
          <el-form-item label="通话录音">
            <VueAudio v-if="showAudio" :theUrl="audioStr" :theError="false" />
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
          <el-form-item label="是否接通" prop="isConnected" required>
            <el-radio-group v-model="temp.isConnected" >
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否有效" prop="isEffective">
            <el-radio-group v-model="temp.isEffective">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="意向区域">
            <el-input v-model="temp.intentionArea" placeholder="意向区域" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="物业类型">
            <el-select clearable class="filter-item" style="width: 250px" v-model="temp.propertyType" placeholder="物业类型" >
              <el-option v-for="item in propertyTypeOptions" :key="item.key" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单价">
            <el-input-number v-model="temp.unitPrice" placeholder="单价" style="width: 250px"></el-input-number>
          </el-form-item>
          <el-form-item label="面积">
            <el-input-number lable="最小面积" v-model="temp.minArea">
            </el-input-number>
            <el-input-number lable="最大面积" v-model="temp.maxArea">
            </el-input-number>
          </el-form-item>
        </div>
        <div v-show="stepQuery.step == 3">
          <el-form-item label="礼貌用语">
            <el-switch v-model="temp.isCourtesy"></el-switch>
          </el-form-item>
          <el-form-item :label="temp.isNewprop ? '耐心解答':'房源信息'">
            <el-switch v-model="temp.isPatienty"></el-switch>
          </el-form-item>
          <el-form-item label="客户需求" v-if="!temp.isNewprop">
            <el-switch v-model="temp.isRequirement"></el-switch>
          </el-form-item>
          <el-form-item label="邀约到访">
            <el-switch v-model="temp.isInvitation"></el-switch>
          </el-form-item>
          <el-form-item :label="temp.isNewprop ? '项目转介':'约看成功'" >
            <el-switch v-model="temp.isTransfer"></el-switch>
          </el-form-item>
          <el-form-item label="评分" >
             <el-input-number v-model="temp.score" width=50px; :max='100' :step='5' :min='0' placeholder="评分"></el-input-number>
          </el-form-item>
           <el-form-item label="备注信息" >
            <el-input v-model="temp.remark" style="width:400px;" :rows="3" placeholder="备注信息" type="textarea"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handlePreStep" v-show="stepQuery.preStep">上一步</el-button>
        <el-button @click="handleNextStep" v-show="stepQuery.nextStep">下一步</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-show="stepQuery.step==3" v-if="dialogStatus=='create'" type="primary" @click="createData">确定添加</el-button>
        <el-button v-show="stepQuery.step==3" v-else type="primary" @click="updateData">确定修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, create, update, fetchOne } from "@/api/callrecord";
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
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      showAudio: true,
      listQuery: {
        callId: null,
        page: 1,
        limit: 10,
        iscentaline: null,
        isnewprop: null,
        calledStatus: 0,
        beginTime: "",
        endTime: ""
      },
      beginTimeOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now();
        }
      },
      endTimeOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now();
        }
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
        callId: 0,
        isConnected: false,
        isEffective: true,
        propertyType: "",
        intentionArea: "",
        unitPrice: 0.0,
        minArea: 0,
        maxArea: 0,
        remark: "",
        isRequirement: false,
        isCourtesy: false,
        isPatienty: false,
        isInvitation: false,
        isTransfer: false,
        score: 0,
        calledStatus: 0,
        updateTime: new Date()
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
      rules: {
        isConnected: [
          { required: true, message: "请选择是否接通", trigger: "change" }
        ],
        isEffective: [
          { required: true, message: "请选择是否有效", trigger: "change" }
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
      if (this.listQuery.beginTime === "" || this.listQuery.endTime === "") {
        const endtime = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        this.listQuery.beginTime = parseTime(start, "{y}-{m}-{d}");
        this.listQuery.endTime = parseTime(endtime, "{y}-{m}-{d}");
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
      if (this.stepQuery.step === 2) {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            this.stepQuery.step++;
            this.goStep(this.stepQuery.step);
          }
        });
      } else {
        this.stepQuery.step++;
        this.goStep(this.stepQuery.step);
      }
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
    handleCreate(row) {
      this.showAudio = true;
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.temp = Object.assign({}, row); // copy obj
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          create(this.temp).then(response => {
            var data = response.data;
            if (data.meta.code === 0) {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "添加成功",
                type: "success",
                duration: 2000
              });
            }
            this.getList();
            this.resetStepQuery();
          });
        }
      });
    },
    handleUpdate(row) {
      this.showAudio = true;
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      fetchOne(row.callId).then(response => {
        var data = response.data;
        if (data.meta.code === 0) {
          this.temp = Object.assign(data.data, row);
        }
      });

      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          update(this.temp).then(response => {
            var data = response.data;
            if (data.meta.code === 0) {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success",
                duration: 2000
              });
            }
            this.getList();
            this.resetStepQuery();
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
      this.showAudio = false;
    },
    handleDialogClose() {
      this.resetStepQuery();
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
