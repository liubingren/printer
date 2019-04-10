<style scoped lang="less">
.content {
  width: 100%;
  padding: 32px;
  text-align: center;
  .row_btn {
    text-align: left !important;
    position: relative;
    .searchBtn,
    .addBtn {
      width: 80px;
    }
  }
  .userTable {
    margin: 32px 0;
    width: 100%;
    border-collapse: collapse;
    thead {
      tr {
        background: #d5e8fc;
        font-size: 16px;
        font-weight: 700;
        color: #343436;
        height: 50px;
        line-height: 50px;
        text-align: center;
        td {
          border: 1px solid #d9d9d9;
        }
      }
    }
    tbody {
      tr {
        font-size: 12px;
        color: #515a6e;
        height: 50px;
        line-height: 50px;
        text-align: center;
        td {
          border: 1px solid #d9d9d9;
        }
      }
    }
    .ivu-form .ivu-form-item-label {
      text-align: right !important;
    }
  }
}
</style>
<template>
    <layOut v-cloak id="manage_log">
        <div slot="page-title" class="page-title" :style="{color:'#343436',fontSize:'18px',marginBottom:'15px'}">
            日志管理
        </div>
        <div slot="content" class="content">
            <div class="row_btn">
               <div class="toolTip">
                    <span>
                        操作用户：
                    </span>
                    <Input v-model="userName" placeholder="请输入操作用户" style="width: 160px;" clearable></Input>
                    <span style="margin-left:16px">
                        操作模块：
                    </span>
                    <Select v-model="module" filterable style="width:160px" clearable>
                        <Option v-for="item in moduleList" :value="item.moduleName" :key="item.moduleName">{{ item.moduleName }}</Option>
                    </Select>
                    <span style="margin-left:16px">
                        操作内容：
                    </span>
                    <Input v-model="operateDesc" placeholder="请输入操作内容" style="width: 160px;" clearable></Input>
                    <Button type="primary" style="margin-left:16px" @click="pageCurrent=1;getLogList()">查询</Button>
               </div>
            </div>
            <table class="userTable">
                <thead>
                    <tr>
                        <td>操作用户</td>
                        <td>操作模块</td>
                        <td>操作内容</td>
                        <td>IP地址</td>
                        <td>操作时间</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in logList" :data-id="item.id" :key="item.id" >
                        <td>{{ item.userName }}</td>
                        <td>{{ item.moduleName }}</td>
                        <td>{{ item.operateDesc }}</td>
                        <td>{{ item.ipAddress }}</td>
                        <td>{{ item.createTime }}</td>
                    </tr>
                </tbody>
            </table >
            <!-- <Page class='page-bar' :total="totalpage" show-elevator show-total/> -->
            <Page class="page-bar"  show-elevator show-total :total="totalpage" :current="pageCurrent" @on-change="pageInfor($event)"></Page>
        </div>
    </layOut>
</template>
<script>
import layOut from "./../components/Layout.vue";
import { Vue, HEADER, axios, hidePage, isShowBtn } from "../main.js";

export default {
  name: "manage_log",
  computed: {
    // ...mapState(['author','age'])
  },
  components: {
    layOut
  },
  data() {
    return {
      userName: "",
      module: "",
      operateDesc: "",
      logList: [],
      moduleList: [],
      totalpage: 0, //总条数
      pageCurrent: 1 //当前页
    };
  },
  mounted() {
    this.getCurUser();
    this.getModuleList();
    this.getLogList();
  },
  methods: {
    getCurUser() {
      // 获取当前登录人
      let THIS = this;
      THIS.GLOBAL.$http(THIS.GLOBAL.HEADER + "/user/logged", "GET", function(
        res
      ) {
        // console.log(res);
        if (res.data.code === 1 && res.data.data != null) {
        } else if (res.data.code === 2) {
        }
      });
    },
    getModuleList() {
      // 获取模块列表（资源列表）
      let THIS = this;
      THIS.GLOBAL.$http(
        THIS.GLOBAL.HEADER + "/userOperateLog/operateLogModel/list",
        "GET",
        function(res) {
          console.log(res);
          if (res.data.code === 1) {
            THIS.moduleList = res.data.data;
          } else if (res.data.code === 2) {
            THIS.moduleList = [];
          }
        },
        {
          pageNum: THIS.pageCurrent,
          pageSize: 1000
        }
      );
    },
    getLogList() {
      // 获取日志列表
      let THIS = this;
      THIS.GLOBAL.$http(
        THIS.GLOBAL.HEADER + "/userOperateLog",
        "GET",
        function(res) {
        //   console.log(res);
          if (res.data.code === 1) {
            THIS.logList = res.data.data.list;
            THIS.lognameList = res.data.data.list;
            THIS.totalpage = res.data.data.total;
          } else if (res.data.code === 2) {
            THIS.logList = [];
          }
        },
        {
          pageNum: THIS.pageCurrent,
          pageSize: 10,
          userName: THIS.userName,
          operateDesc: THIS.operateDesc,
          moduleName: THIS.module
        }
      );
    },
    pageInfor(e) {
      // 分页
      this.pageCurrent = e;
      this.getLogList(this.pageCurrent);
    }
  }
};
</script>
