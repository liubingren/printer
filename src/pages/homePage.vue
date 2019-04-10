<style scoped lang="less">
.content {
  width: 100%;
  height: auto;
  background-color: #f5f7f9 !important;
  display: flex;
  justify-content: flex-start;
  .content-l {
    width: 360px;
    min-width: 360px;
    background-color: #fff;
    display: inline-block;
    border-radius: 8px;
    padding: 0 16px;
    .center-bar {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 60px;
      margin-bottom: 24px;
      img {
        width: 160px;
        height: 160px;
        margin-bottom: 16px;
      }
      span {
        font-size: 24px;
        color: #343436;
      }
    }
    .content-l-bar {
      margin-bottom: 8px;
      span:first-child {
        padding: 4px 10px;
        background-color: #2d8cf0;
        border-radius: 4px;
        color: #fefefe;
        margin-right: 8px;
      }
      span:last-child {
        font-size: 16px;
        color: #343436;
      }
    }
    .content-l-bar-border {
      border-bottom: 1px solid #d9d9d9;
      padding-bottom: 40px;
      margin-bottom: 48px;
    }
    .content-l-bar1 {
      font-size: 16px;
      color: #343436;
      margin-bottom: 16px;
      display: flex;
      justify-content: center;
      flex-direction: row;
      span:first-child {
        width: 80px;
        display: inline-block;
      }
      span:last-child {
        width: 248px;
        display: inline-block;
      }
    }
  }
  .content-r {
    width: 1305px;
    .content-r-t {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      margin-bottom: 16px;
      .r-t {
        width: 24%;
        margin-left: 16px;
        height: 200px;
        background-color: #2d8cf0;
        border-radius: 8px;
        padding-left: 24px;
        .r-t-item {
          width: 100%;
          height: 100%;
          background-color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 0 8px 8px 0;
          span:first-child {
            font-size: 48px;
            color: #343436;
          }
          span:last-child {
            font-size: 18px;
            color: #848484;
          }
        }
      }
      .r-t1 {
        background-color: #a9d86e;
      }
      .r-t2 {
        background-color: #e65555;
      }
      .r-t3 {
        background-color: #848484;
      }
    }
    .content-r-b {
      margin-left: 16px;
      height: 570px;
      background-color: #fff;
      border-radius: 8px;
      .r-b-title {
        background-color: #2d8cf0;
        color: #fff;
        font-size: 20px;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        padding: 5px 0;
        span{
          margin-left: 24px;
        }
      }
      .r-b-item {
        width: 100%;
        height: 100px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        border-radius: 0 8px 8px 0;
        text-align: right;
        padding-right: 40px;
        span:first-child {
          font-size: 48px;
          color: #343436;
        }
        span:last-child {
          font-size: 18px;
          color: #848484;
        }
      }
      .equipmentStatistics {
        width: 100%;
        height: 430px;
      }
    }
  }
}
</style>
<template>
  <layOut v-cloak>
    <div
      slot="page-title"
      class="page-title"
      :style="{color:'#343436',fontSize:'18px',marginBottom:'15px'}"
    >首页</div>
    <div slot="content" class="content">
      <div class="content-l">
        <div class="center-bar">
          <img src="../assets/man.png" v-if="sex == '男'" alt>
          <img src="../assets/woman.png" v-else alt>
          
          <span>{{ userName }}</span>
        </div>
        <div class="content-l-bar">
          <span>角色</span>
          <span>{{ roleName }}</span>
        </div>
        <div class="content-l-bar content-l-bar-border">
          <span>公司</span>
          <span>{{ compayName }}</span>
        </div>
        <div class="center-bar">
          <span>单位信息</span>
        </div>
        <div class="content-l-bar1">
          <span>单位名称：</span>
          <span>{{ compayName }}</span>
        </div>
        <div class="content-l-bar1">
          <span>单位地址：</span>
          <span>{{ compayAdress }}</span>
        </div>
        <div class="content-l-bar1">
          <span>联系电话：</span>
          <span>{{ phoneNumber }}</span>
        </div>
        <div class="content-l-bar1">
          <span>联系邮箱：</span>
          <span>{{ email }}</span>
        </div>
      </div>
      <div class="content-r">
        <div class="content-r-t">
          <div class="r-t">
            <div class="r-t-item">
              <span>{{ printertotal }}</span>
              <span>打印机总数(台)</span>
            </div>
          </div>
          <div class="r-t r-t1">
            <div class="r-t-item">
              <span>{{ normalPrinter }}</span>
              <span>正常打印机(台)</span>
            </div>
          </div>
          <div class="r-t r-t2">
            <div class="r-t-item">
              <span>{{ warningPrinter }}</span>
              <span>报警打印机(台)</span>
            </div>
          </div>
          <div class="r-t r-t3">
            <div class="r-t-item">
              <span>{{ outlinePrinter }}</span>
              <span>离线打印机(台)</span>
            </div>
          </div>
        </div>
        <div class="content-r-b">
          <div class="r-b-title"><span>设备统计</span></div>
          <div class="r-b-item">
            <span>{{ printertotal }}</span>
            <span>打印机总数(台)</span>
          </div>
          <div class="equipmentStatistics" id="equipment_statistics"></div>
        </div>
      </div>
    </div>
  </layOut>
</template>
<script>
import layOut from "./../components/Layout.vue";
// 引入 ECharts 主模块
let echarts = require("echarts/lib/echarts");
// 引入饼图
require("echarts/lib/chart/pie");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");

export default {
  name: "homePage",
  mounted() {
    this.getEquipmentStatistics()
    this.getUserInfor()
  },
  data() {
    return {
      userName:'',
      roleName:'',
      compayName:'',
      compayAdress:'',
      phoneNumber:'',
      sex:'',
      email:'',
      pieChart: "",
      printertotal:0,
      normalPrinter:0,
      warningPrinter:0,
      outlinePrinter:0,
      drawList:[]
    };
  },
  methods: {
    // 获取用户信息
    getUserInfor(){
      let that = this
        that.GLOBAL.axios({
            url: that.GLOBAL.HEADER + 'homePage/username',
            method: "GET"
        }).then(({
            data
        }) => {
            if (data.code === 1) {
                that.userName = data.data[0].name
                that.roleName = data.data[0].roleName
                that.compayName = data.data[0].name
                that.compayAdress = data.data[0].name
                that.phoneNumber = data.data[0].phoneNumber
                that.sex = data.data[0].sex
                that.email = data.data[0].email
            }
        })
    },
    //获取统计数
    getEquipmentStatistics(){
      let that = this
        that.GLOBAL.axios({
            url: that.GLOBAL.HEADER + '/homePage',
            method: "GET"
        }).then(({
            data
        }) => {
            if (data.code === 1) {
               that.printertotal = data.data[0].printerAll
               that.normalPrinter = data.data[0].printerNomal
               that.warningPrinter = data.data[0].printerUnusual
               that.outlinePrinter = data.data[0].printerOffLine
               
               that.drawList.push({
                 value: data.data[0].printerUnusual, name: "报警打印机"
               })
               that.drawList.push({
                 value: data.data[0].printerOffLine, name: "离线打印机"
               })
                that.drawList.push({
                 value: data.data[0].printerNomal, name: "正常打印机"
               })
               that.drawDoughnut(that.drawList)
            }else{
              that.GLOBAL.showResult(2,res.data.msg)
            }
        })
    },

    // 绘制环形图
    drawDoughnut(dataList) {
      this.pieChart = echarts.init(
        document.getElementById("equipment_statistics")
      );
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        color: ['#e65555','#848484','#a9d86e'],
        series: [
          {
            name: "访问来源",
            type: "pie",
            label: {
              formatter: '{d|{d}%\n}'+'{b|{b}}',
               rich: {
                d: {
                 fontSize: 36,
                  color: '#343436'
                },
                b: {
                  fontSize: 20,
                  color: '#848484'
                }
              }
            },
            radius: ['42%', '70%'],
            center: ["50%", "52%"],
            data: dataList,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };

      this.pieChart.setOption(option);
      let THIS = this
       window.onresize = function () {
        // 必须放在最后加载
        THIS.pieChart.resize()
      }
    }
  },
  components: {
    layOut
  }
};
</script>
