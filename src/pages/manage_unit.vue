<style scoped lang="less">
.page-title {
  color: #343436;
  font-size: 18px;
  margin-bottom: 15px;
  display: flex;
  flex-flow: row;
  .back {
    margin-left: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    div {
      width: 26px;
      height: 26px;
      background: url("./../assets/back.png") no-repeat left top;
      margin-right: 8px;
    }
  }
}
.content {
  span {
    margin-left: 8px;
  }
  .table-wrap {
    margin-top: 32px;
    .page-bar {
      margin-top: 32px;
      text-align: center;
    }
  }
  &.detail-content {
    .detailTitle {
      height: 40px;
      width: 100%;
      background: #2d8cf0;
      color: #fefefe;
      line-height: 40px;
      text-indent: 24px;
      font-size: 20px;
      border-radius: 8px 8px 0 0;
    }
    .detail-item {
      color: #343436;
      font-size: 16px;
      margin-bottom: 12px;
      &:nth-of-type(3) {
        margin: 12px 0;
      }
      span {
        height: 16px;
        width: 16px;
        border-radius: 50%;
        display: inline-block;
        &.online {
          background: #a9d86e;
        }
        &.offline {
          background: #e65555;
        }
        &.error {
          background: #d9d9d9;
        }
      }
    }
    .tableTitle {
      color: #343436;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .abnormal-alarm,
    .device-log {
      width: 100%;
      .title {
        height: 40px;
        width: 100%;
        background: #2d8cf0;
        color: #fefefe;
        line-height: 40px;
        text-indent: 24px;
        font-size: 20px;
        border-radius: 8px 8px 0 0;
      }
      .body {
        // text-align: center;
        border: 1px solid #d9d9d9;
        border-radius: 0 0 8px 8px;
        div {
          height: 32px;
          line-height: 32px;
          padding-left: 32px;
          color: #343436;
          font-size: 16px;
          &.more {
            padding-left: 0px;
            text-align: center;
            margin: 8px 0;
            cursor: pointer;
          }
        }
      }
    }
  }
}

.toolTip{
        position: relative;
        .add {
            position: absolute;
            right: 0;
        }
    }
</style>
<template>
    <layOut v-cloak>
        <div slot="page-title" class="page-title">
            <Breadcrumb v-if="pageName === 'unitList'" :style="{color:'#343436',fontSize:'18px'}">
                <BreadcrumbItem>单位管理</BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div slot="content" class="content" :style="{padding: '32px'}"  v-if="pageName === 'unitList'">
            <div class="toolTip">
                <span>
                    单位地址：
                </span>
                <Select v-model="unitList.provinceId" style="width:80px" clearable placeholder="省" @on-change="getCityList('tooltips',$event)">
                    <Option v-for="item in provinceList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Select v-model="unitList.cityId" style="width:80px" clearable placeholder="市" @on-change="getDistrictList('tooltips',$event)">
                    <Option v-for="item in cityList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Select v-model="unitList.districtId" clearable placeholder="区" style="width:80px">
                    <Option v-for="item in districtList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Input v-model="unitList.contactAddress" placeholder="请输入详细地址" style="width: 160px" clearable></Input>
                <span>
                    单位名称：
                </span>
                <Select v-model="unitList.name" filterable style="width:160px" @on-change="searchingunitList"  clearable>
                    <Option v-for="item in unitnameList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                </Select>
                <Button type="primary"  style="margin-left:10px"  @click="searchingunitList">查询</Button>
                <Button type="primary" class="add" @click="showActionModal">新建</Button>
            </div>
            <div class='table-wrap'>
                <Table :columns="unitTableColumns" :data="unitTableData" border></Table>
                <Page class="page-bar" :total="unitListTotalPage" :current="unitListCurrentPage" show-total show-elevator @on-change="updateTable($event)"></Page>
            </div>
            <Modal
                v-model="actionModal"
                :title="modalTitle"
                ref="actionModal"
                @on-ok="handleSubmit('formValidate')"
                @on-cancel="cancel"
                width="760">
                 <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" inline label-position='left'>
                     <Row type="flex" justify="space-around">
                         <Col span="12">
                             <FormItem label="单位名称" prop="name">
                                <Input type="text" v-model="formValidate.name" placeholder="请输入单位名称" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                             <FormItem label="联系人" prop="name">
                                <Input type="text" v-model="formValidate.contact" placeholder="请输入联系人" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="区域" prop="provinceId">
                                <Select v-model="formValidate.provinceId" placeholder="省" @on-change="getCityList('',$event)" label-in-value style="width: 72px">
                                     <Option v-for="item in provinceList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem prop="cityId">
                                <Select v-model="formValidate.cityId" placeholder="市" @on-change="getDistrictList('',$event)" label-in-value style="width: 72px">
                                     <Option v-for="item in formValidate.cityList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem prop="districtId">
                                <Select v-model="formValidate.districtId" placeholder="区"  @on-change="getDistrictName"  label-in-value style="width: 72px">
                                     <Option v-for="item in formValidate.districtList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="详细地址" prop="contactAddress">
                                <Input type="text" v-model="formValidate.contactAddress" placeholder="请输入详细地址" style="width: 240px"  @on-blur="getPosition"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                             <FormItem label="经度" prop="longitude">
                                <Input type="text" v-model="formValidate.longitude" placeholder="请输入经度" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                             <FormItem label="纬度" prop="latitude">
                                <Input type="text" v-model="formValidate.latitude" placeholder="请输入纬度" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                             <FormItem label="联系电话" prop="contactNumber">
                                <Input type="text" v-model="formValidate.contactNumber" placeholder="请输入联系电话" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="联系邮箱" prop="contactEmail">
                                <Input type="text" v-model="formValidate.contactEmail" placeholder="请输入联系邮箱" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    </layOut>
</template>
<script>
// import Utils from './../utils/index.js'
// import {mapState,mapMutations} from 'vuex'
import layOut from "./../components/Layout.vue";

export default {
  name: "unitManagement",

  data() {
    //手机验证
    const validatePhomeNUm = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请填写联系电话！"));
      }
      setTimeout(() => {
        if (!this.regphone.test(value)) {
          callback(new Error("请填写正确的手机号格式！"));
        } else {
          callback();
        }
      }, 100);
    };
    return {
      regphone: /^1[34578]\d{9}$/, //手机号
      pageName: "unitList",
      currentDataIndex: null,
      currentRowId: "",
      currentSerialNumber: "",
      currentAction: "",
      actionModal: false,
      modalTitle: "",
      modelsList: [],
      // unitname: "",
      unitnameList: [], //单位名称列表
      provinceList: [],
      cityList: [],
      districtList: [],
      provinceId: "",
      cityId: "",
      districtId: "",
      isValid: false,
      unitListCurrentPage: 1,
      unitListTotalPage: 0,
      unitTableData: [],
      unitList: {
        //搜索的内容
        provinceId: "",
        cityId: "",
        districtId: "",
        contactAddress: "",
        name: ""
      },
      formValidate: {
        //新建和编辑框里的内容
        name: "",
        contact: "",
        provinceId: "",
        provinceName: "",
        cityId: "",
        cityName: "",
        districtId: "",
        districtName: "",
        cityList: [],
        districtList: [],
        contactAddress: "",
        longitude: "",
        latitude: "",
        contactEmail: "",
        contactNumber: ""
      },
      ruleValidate: {
        name: [
          { required: true, message: "单位名称不能为空", trigger: "blur" }
        ],
        contact: [{ required: true, message: "请填写联系人", trigger: "blur" }],
        provinceId: [{ required: true, message: "请选择省", trigger: "blur" }],
        cityId: [{ required: true, message: "请选择市", trigger: "blur" }],
        districtId: [{ required: true, message: "请选择区", trigger: "blur" }],
        contactAddress: [
          { required: true, message: "请填写联系地址", trigger: "blur" }
        ],
        longitude: [{ required: true, message: "请输入经度", trigger: "blur" }],
        latitude: [{ required: true, message: "请输入纬度", trigger: "blur" }],
        contactEmail: [
          { required: true, message: "请填写联系邮箱", trigger: "blur" }
        ],
        contactNumber: [
          { required: true, validator: validatePhomeNUm, trigger: "blur" }
        ]
      },
      unitTableColumns: [
        {
          title: "单位名称",
          key: "name"
        },
        {
          title: "单位地址",
          key: "contactAddress"
        },
        {
          title: "经度",
          key: "longitude"
        },
        {
          title: "纬度",
          key: "latitude"
        },
        {
          title: "联系人",
          key: "contact"
        },
        {
          title: "联系电话",
          key: "contactNumber"
        },
        {
          title: "联系邮箱",
          key: "contactEmail"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 180,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary"
                  },
                  style: {
                    marginRight: "5px",
                    width: "60px",
                    height: "32px"
                  },
                  on: {
                    click: () => {
                      this.currentDataIndex = params.index;
                      this.currentAction = "edit";
                      this.modalTitle = "编辑单位";
                      // let currentRowData=this.unitTableData[params.index]
                      /***
                                            等待市区列表加载完成后绑定数据到市区数据到控件控件中
                                            * */
                      Promise.all([
                        new Promise((resolve, reject) => {
                          this.GLOBAL.$http(
                            this.GLOBAL.HEADER +
                              `units/location/${params.row.provinceId}`,
                            "GET",
                            res => {
                              if (res.data.code === 1) {
                                this.formValidate.cityList = res.data.data; //市列表
                                resolve("success");
                              } else {
                                this.GLOBAL.showResult(
                                  res.data.code,
                                  res.data.msg
                                );
                              }
                            }
                          );
                        }),
                        new Promise((resolve, reject) => {
                          this.GLOBAL.$http(
                            this.GLOBAL.HEADER +
                              `units/location/${params.row.cityId}`,
                            "GET",
                            res => {
                              if (res.data.code === 1) {
                                this.formValidate.districtList = res.data.data; //区列表
                                resolve("success");
                              } else {
                                this.GLOBAL.showResult(
                                  res.data.code,
                                  res.data.msg
                                );
                              }
                            }
                          );
                        })
                      ])
                        .then(([city, district]) => {
                          if (city && district) {
                            {
                              this.formValidate.id = params.row.id; //单位名
                              this.formValidate.name = params.row.name; //单位名
                              this.formValidate.contact = params.row.contact; //联系人
                              this.formValidate.contactAddress =
                                params.row.contactAddress; //地址
                              this.formValidate.longitude =
                                params.row.longitude; //经
                              this.formValidate.latitude = params.row.latitude; //纬
                              this.formValidate.contactNumber =
                                params.row.contactNumber; //电话
                              this.formValidate.contactEmail =
                                params.row.contactEmail; //邮箱
                              this.formValidate.provinceId =
                                params.row.provinceId; //省
                              this.formValidate.provinceName =
                                params.row.provinceName;
                              this.formValidate.cityId = params.row.cityId; //市
                              this.formValidate.cityName = params.row.cityName;
                              this.formValidate.districtId =
                                params.row.districtId; //区
                              this.formValidate.districtName =
                                params.row.districtName;
                              this.actionModal = true;
                            }
                            this.validForm("formValidate");
                          }
                        })
                        .catch(error => {});
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    ghost: true
                  },
                  style: {
                    width: "60px",
                    height: "32px"
                  },
                  on: {
                    click: () => {
                      this.deleteRow(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    };
  },
  mounted() {
    this.getProvinceList();
    this.getUnitnameList();
    this.initPrinterTable();
  },
  computed: {
    // ...mapState(['author','age'])
  },
  methods: {
    getUnitnameList() {
      // 获取单位名称列表
      let THIS = this;
      THIS.GLOBAL.$http(
        THIS.GLOBAL.HEADER + "units/list",
        "GET",
        function(res) {
          console.log(res);
          if (res.data.code === 1) {
            THIS.unitnameList = res.data.data;
          } else if (res.data.code === 2) {
            THIS.unitnameList = [];
          }
        },
        {}
      );
    },
    cancel() {
      let newruleValidate = this.ruleValidate;
      this.ruleValidate = {};
      this.ruleValidate = newruleValidate;
    },
    deleteRow(index) {
      // 删除
      this.$Modal.confirm({
        title: "提示信息",
        content: "<p>确定删除该单位？</p>",
        loading: true,
        onOk: () => {
          this.GLOBAL.$http(
            this.GLOBAL.HEADER + "units",
            "DELETE",
            res => {
              if (res.data.code === 1) {
                this.initPrinterTable();
                this.GLOBAL.showResult(res.data.code, res.data.msg);
                setTimeout(() => {
                  this.$Modal.remove();
                }, 1000);
              } else {
                this.GLOBAL.showResult(res.data.code, res.data.msg);
              }
            },
            {
              id: this.unitTableData[index].id
            }
          );
        }
      });
    },
    validForm(name) {
      //表单验证
      this.$refs[name].validate(valid => {
        if (valid) {
          this.isValid = true;
        } else {
          //校验失败
          // this.$Message.error('Fail!');
          this.$refs.actionModal.visible = true;
          this.actionModal = true;
          this.isValid = false;
        }
      });
      return this.isValid;
    },
    handleSubmit(name) {
      //提交
      if (this.validForm(name)) {
        //校验成功提交表单信息
        let data = {
            id: this.formValidate.id,
            name: this.formValidate.name,
            provinceId: this.formValidate.provinceId,
            cityId: this.formValidate.cityId,
            districtId: this.formValidate.districtId,
            contact: this.formValidate.contact,
            contactNumber: this.formValidate.contactNumber,
            contactEmail: this.formValidate.contactEmail,
            contactAddress: this.formValidate.contactAddress,
            longitude: this.formValidate.longitude,
            latitude: this.formValidate.latitude
          },
          method = "POST";

        if (this.currentAction === "edit") {
          data["id"] = this.unitTableData[this.currentDataIndex].id;
          method = "PUT";
        }
        this.GLOBAL.$http(
          this.GLOBAL.HEADER + "units",
          method,
          res => {
            if (res.data.code === 1) {
              // this.provinceList=res.data.data
              this.initPrinterTable();
              this.GLOBAL.showResult(res.data.code, res.data.msg);
            } else {
              this.GLOBAL.showResult(res.data.code, res.data.msg);
            }
          },
          data
        );
      }
    },
    showActionModal() {
      //点击新建
      this.currentAction = "add";
      this.modalTitle = "新建单位";
      //清空对话框的表单控件内容
      {
        this.formValidate.id = "";
        this.formValidate.name = "";
        this.formValidate.contact = "";
        this.formValidate.contactAddress = "";
        this.formValidate.provinceId = "";
        this.formValidate.cityId = "";
        this.formValidate.districtId = "";
        this.formValidate.provinceName = "";
        this.formValidate.cityName = "";
        this.formValidate.districtName = "";
        this.formValidate.longitude = "";
        this.formValidate.latitude = "";
      }
      //重置验证规则
      this.$refs["formValidate"].fields.forEach(function(e) {
        e.resetField();
      });
      this.actionModal = true;
    },
    getPosition() {
      //获取经纬度
      // console.log(this.validForm.provinceName)
      console.log(
        this.formValidate.provinceName +
          this.formValidate.cityName +
          this.formValidate.districtName +
          this.formValidate.contactAddress
      );
      this.GLOBAL.$http(
        this.GLOBAL.HEADER + "units/latLon",
        "GET",
        res => {
          if (res.data.code === 1) {
            //input必须是字符串才能验证通过
            this.formValidate.longitude = res.data.data.lng + "";
            this.formValidate.latitude = res.data.data.lat + "";
          } else {
            this.GLOBAL.showResult(res.data.code, res.data.msg);
          }
        },
        {
          address:
            this.formValidate.provinceName +
            this.formValidate.cityName +
            this.formValidate.districtName +
            this.formValidate.contactAddress,
          ak: "oIlwMrZYdYeZL8CH1pH6vm8KYR3C9TLe"
        }
      );
    },
    changePageName() {
      this.pageName = "unitList";
    },
    initPrinterTable() {
      //初始化单位列表
      this.GLOBAL.$http(
        this.GLOBAL.HEADER + "units",
        "GET",
        res => {
          if (res.data.code === 1) {
            this.unitTableData = res.data.data.list;
            this.unitListCurrentPage = res.data.data.pageNum;
            this.unitListTotalPage = res.data.data.total;
          } else {
            this.GLOBAL.showResult(res.data.code, res.data.msg);
          }
        },
        {
          pageNum: this.unitListCurrentPage,
          pageSize: 10
        }
      );
    },
    getProvinceList() {
      //获取省列表
      this.GLOBAL.$http(
        this.GLOBAL.HEADER + "units/location/d87cfe59cb9b4260ac0e1c909e6350bf",
        "GET",
        res => {
          if (res.data.code === 1) {
            this.provinceList = res.data.data;
          } else {
            this.GLOBAL.showResult(res.data.code, res.data.msg);
          }
        }
      );
    },
    getCityList(type, e) {
      console.log("省改变");
      console.log(e);
      // 获取市列表
      if (e) {
        this.formValidate.provinceName = e.label;
        let id;
        if (e.value) {
          id = e.value;
        } else {
          id = e;
        }
        this.GLOBAL.$http(
          this.GLOBAL.HEADER + `units/location/${id}`,
          "GET",
          res => {
            console.log(res);
            if (res.data.code === 1) {
              if (type === "tooltips") {
                this.cityList = res.data.data;
              } else {
                this.formValidate.cityList = res.data.data;
              }
            } else {
              this.GLOBAL.showResult(res.data.code, res.data.msg);
            }
          }
        );
      }
    },
    getDistrictList(type, e) {
      //   获取区列表;
      if (e) {
        this.formValidate.cityName = e.label;
        let id;
        if (e.value) {
          id = e.value;
        } else {
          id = e;
        }
        this.GLOBAL.$http(
          this.GLOBAL.HEADER + `units/location/${id}`,
          "GET",
          res => {
            if (res.data.code === 1) {
              if (type === "tooltips") {
                this.districtList = res.data.data;
              } else {
                this.formValidate.districtList = res.data.data;
              }
            } else {
              this.GLOBAL.showResult(res.data.code, res.data.msg);
            }
          }
        );
      }
    },
    getDistrictName(e) {
      //区选择改变
      if (e) {
        this.formValidate.districtName = e.label;
        //编辑中如果已经有了安装地址就直接获取经纬度
        if (this.formValidate.contactAddress) {
          this.getPosition();
        }
      }
    },
    formatInstallDate(e) {
      // 安装日期changed
      this.formValidate.installDate = e;
    },
    updateTable(e) {
      //翻页刷新数据
      this.unitListCurrentPage = e;
      this.initPrinterTable();
    },
    searchingunitList() {
      // 查询
      this.unitListCurrentPage = 1;
      let data = {
        name:this.unitList.name,
        provinceId: this.unitList.provinceId,
        cityId: this.unitList.cityId,
        districtId: this.unitList.districtId,
        contactAddress: this.unitList.contactAddress,
        pageNum: this.unitListCurrentPage,
        pageSize: 10
      };
      this.GLOBAL.$http(
        this.GLOBAL.HEADER + "units",
        "GET",
        res => {
          if (res.data.code === 1) {
            this.unitTableData = res.data.data.list;
            this.unitListCurrentPage = res.data.data.pageNum;
            this.unitListTotalPage = res.data.data.total;
          } else {
            this.GLOBAL.showResult(res.data.code, res.data.msg);
          }
        },
        data
      );
    }
  },
  components: {
    layOut
  }
};
</script>
