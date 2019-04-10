<style scoped lang="less">
.content {
  width: 100%;
  padding: 32px;
  text-align: center;
  .row_btn {
    text-align: left !important;
    position: relative;
    .searchBtn {
      width: 80px;
    }
    .addBtn {
      width: 80px;
      position: absolute;
      right: 0;
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
    <layOut v-cloak id="manage_user">
        <div slot="page-title" class="page-title" :style="{color:'#343436',fontSize:'18px',marginBottom:'15px'}">
            用户管理
        </div>
        <div slot="content" class="content">
            <div class="row_btn">
               <Input v-model="searchValue" placeholder="请输入用户名/姓名/手机号" style="width: 240px;margin-right:16px;" clearable></Input>
               <Button class="searchBtn" type="primary" @click="pageCurrent=1;getUserList()">查询</Button>
               <Button class="addBtn" type="primary" @click="addBtnClicked()" >新建</Button>
            </div>
            <table class="userTable">
                <thead>
                    <tr>
                        <td>用户名</td>
                        <td>角色</td>
                        <td>姓名</td>
                        <td>性别</td>
                        <td>手机</td>
                        <td>邮箱</td>
                        <td>用户状态</td>
                        <td>单位名称</td>
                        <td>操作</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in userlist" :data-id="item.id" :key="item.id" >
                        <td>{{ item.userName }}</td>
                        <td>{{ item.roleName }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.sex }}</td>
                        <td>{{ item.phoneNumber }}</td>
                        <td>{{ item.email }}</td>
                        <td>{{ item.isEnableValue }}</td>
                        <td>{{ item.unitsName }}</td>
                        <td><Button @click="editBtnClicked(index)" type="primary" style="margin-right:16px">编辑</Button><Button @click="deleteBtnClicked(item.id)" type="primary" ghost>删除</Button></td>
                    </tr>
                </tbody>
            </table >
            <!-- <Page class='page-bar' :total="totalpage" show-elevator show-total/> -->
            <Page class="page-bar"  show-elevator show-total :total="totalpage" :current="pageCurrent" @on-change="pageInfor($event)"></Page>
            <Modal v-model="model_add" ref="model_add" title="添加用户" @on-ok="doAdd()" @on-cancel="cancelAdd" width="760">
                 <Form ref="addForm" :model="addForm" :rules="ruleValidate" inline label-position='left'>
                     <Row>
                        <Col span="12">
                             <FormItem label="用户名" prop="userName" style="text-align: right;">
                                <Input type="text" v-model="addForm.userName" placeholder="请填写用户名" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                             <FormItem label="性别" prop="sex" >
                                <Select v-model="addForm.sex" placeholder="请选择性别" style="width: 240px">
                                    <Option value="男" key="男">男</Option>
                                    <Option value="女" key="女">女</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="密码" prop="password">
                                <Input type="password" v-model="addForm.password" placeholder="请填写密码" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                             <FormItem label="手机号码" prop="phoneNumber" >
                                <Input type="text" v-model="addForm.phoneNumber" placeholder="请填写手机号码" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                             <FormItem label="姓名" prop="name" >
                                <Input type="text" v-model="addForm.name" placeholder="请填写姓名" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                             <FormItem label="邮箱" prop="email" >
                                <Input type="text" v-model="addForm.email" placeholder="请填写邮箱" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                             <FormItem label="角色" prop="roleName"  >
                                <Select v-model="addForm.roleName"  placeholder="请选择角色"  style="width: 240px;">
                                    <Option v-for="item in roleList" :value="item.id" :key="item.id" >{{ item.rName }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                             <FormItem label="用户状态" prop="isEnable" >
                                <Select v-model="addForm.isEnable"  placeholder="请选择用户状态"  style="width: 240px;">
                                    <Option value=1 key=1>启用</Option>
                                    <Option value=1 key=0>禁用</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                             <FormItem label="单位" prop="unitsId" >
                                <Select v-model="addForm.unitsId"  placeholder="请选择单位"  style="width: 240px;" @on-change="unitChanged">
                                    <Option v-for="item in unitsList" :value="item.id" :key="item.id" >{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Modal v-model="model_edit" ref="model_edit" title="修改用户信息" @on-ok="doEdit()" @on-cancel="cancelEdit()" width="760">
                 <Form ref="editForm" :model="editForm" :rules="ruleValidate" inline label-position='left'>
                     <Row>
                        <Col span="12">
                             <FormItem label="用户名">
                                <Input type="text" v-model="editForm.userName" placeholder="请填写用户名" style="width: 240px" disabled></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                             <FormItem label="性别" prop="sex" >
                                <Select v-model="editForm.sex" placeholder="请选择性别" style="width: 240px">
                                    <Option value="男" key="男">男</Option>
                                    <Option value="女" key="女">女</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="密码" prop="password">
                                <Input type="password" v-model="editForm.password" placeholder="******" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                             <FormItem label="手机号码" prop="phoneNumber" >
                                <Input type="text" v-model="editForm.phoneNumber" placeholder="请填写手机号码" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                             <FormItem label="姓名" prop="name" >
                                <Input type="text" v-model="editForm.name" placeholder="请填写姓名" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                             <FormItem label="邮箱" prop="email" >
                                <Input type="text" v-model="editForm.email" placeholder="请填写邮箱" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                             <FormItem label="角色" prop="roleName" >
                                <Select v-model="editForm.roleName"  placeholder="请选择角色"  style="width: 240px;">
                                    <Option v-for="item in roleList" :value="item.id" :key="item.id" >{{ item.rName }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                             <FormItem label="用户状态" prop="isEnable2" >
                                <Select v-model="editForm.isEnable"  placeholder="请选择用户状态"  style="width: 240px;" >
                                    <Option :value=1 :key=1>启用</Option>
                                    <Option :value=0 :key=0>禁用</Option>
                                </Select>
                            </FormItem>
                        </Col>
                         <Col span="12">
                             <FormItem label="单位" prop="unitsId" >
                                <Select v-model="editForm.unitsId"  placeholder="请选择单位"  style="width: 240px;"  @on-change="unitChanged">
                                    <Option v-for="item in unitsList" :value="item.id" :key="item.id" >{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    </layOut>
</template>
<script>
import layOut from "./../components/Layout.vue";
import { Vue, HEADER, axios, hidePage, isShowBtn } from "../main.js";

export default {
  name: "manage_user",
  computed: {
    // ...mapState(['author','age'])
  },
  components: {
    layOut
  },
  data() {
    //手机验证
    const validatePhomeNUm = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号码不能为空！"));
      }
      setTimeout(() => {
        if (!this.regphone.test(value)) {
          callback(new Error("请输入正确的手机号格式！"));
        } else {
          callback();
        }
      }, 100);
    };
    return {
      searchValue: "", //搜索参数
      totalpage: 0, //总条数
      pageCurrent: 1, //当前页
      isValid: false,
      regphone: /^1[34578]\d{9}$/, //手机
      ruleValidate: {
        userName: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            min: 5,
            message: "用户名至少要5位",
            trigger: "blur"
          }
        ],
        sex: [
          {
            required: true,
            message: "性别不能为空",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
          // {
          //   type: "string",
          //   min: 6,
          //   message: "密码至少要6位",
          //   trigger: "blur"
          // }
        ],
        phoneNumber: [
          {
            required: true,
            validator: validatePhomeNUm,
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "邮箱不能为空",
            trigger: "blur"
          },
          {
            type: "email",
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ],
        roleName: [
          {
            required: true,
            message: "请选择角色",
            trigger: "change"
          }
        ],
        isEnable: [
          {
            required: true,
            message: "请选择用户状态",
            trigger: "change"
          }
        ],
        unitsId: [
          {
            required: true,
            message: "请选择单位",
            trigger: "change"
          }
        ]
      },
      model_add: false,
      model_edit: false,
      addForm: {},
      editForm: {},
      userlist: [], //用户列表
      roleList: [],
      unitsList: []
    };
  },
  mounted() {
    // this.getCurUser();
    this.getroleList();
    this.getunitsList();
    this.getUserList();
  },
  methods: {
    unitChanged() {
      console.log("单位改变");
      console.log(this.editForm.unitsId);
    },
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
    getroleList() {
      // 获取所有角色列表
      let THIS = this;
      THIS.GLOBAL.$http(THIS.GLOBAL.HEADER + "/user/role/list", "GET", function(
        res
      ) {
        THIS.roleList = res.data.data;
      });
    },
    getunitsList() {
      let THIS = this;
      THIS.GLOBAL.$http(
        THIS.GLOBAL.HEADER + "user/units/list",
        "GET",
        function(res) {
          console.log(res);
          if (res.data.code === 1) {
            THIS.unitsList = res.data.data;
          } else if (res.data.code === 2) {
            THIS.unitsList = [];
          }
        },
        {}
      );
    },
    getUserList() {
      // 获取用户列表
      let THIS = this;
      THIS.GLOBAL.$http(
        THIS.GLOBAL.HEADER + "/user",
        "GET",
        function(res) {
          // console.log(res);
          if (res.data.code === 1) {
            THIS.userlist = res.data.data.list;
            THIS.totalpage = res.data.data.total;
          } else if (res.data.code === 2) {
            THIS.userlist = [];
          }
        },
        {
          pageNum: THIS.pageCurrent,
          pageSize: 10,
          param: this.searchValue
        }
      );
    },
    doSearch() {
      // 点击搜索
      this.searchValue;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    addBtnClicked() {
      // 点击新建
      this.addForm = {
        id: "",
        userName: "",
        name: "",
        roleName: "",
        sex: "",
        phoneNumber: "",
        email: "",
        isEnable: "",
        unitsId: ""
      };
      this.model_add = true;
    },
    editBtnClicked(index) {
      // 点击编辑
      this.model_edit = true;
      console.log("点击编辑");
      console.log(this.userlist[index]);
      this.editForm = {
        id: this.userlist[index].id,
        userName: this.userlist[index].userName,
        name: this.userlist[index].name,
        roleName: this.userlist[index].roleId,
        sex: this.userlist[index].sex,
        phoneNumber: this.userlist[index].phoneNumber,
        email: this.userlist[index].email,
        isEnable: this.userlist[index].isEnable,
        unitsId: this.userlist[index].unitsId
      };
      console.log(this.editForm);
    },
    deleteBtnClicked(id) {
      // 点击删除
      this.$Modal.confirm({
        content: "确认删除该用户？",
        onOk: () => {
          setTimeout(() => {
            this.doDelete(id);
          }, 300);
        }
      });
    },
    doAdd() {
      // 请求新建
      let THIS = this;
      THIS.$refs["addForm"].validate(valid => {
        if (valid) {
          THIS.isValid = true;
          THIS.GLOBAL.axios({
            url: THIS.GLOBAL.HEADER + "/user",
            method: "POST",
            params: {
              userName: THIS.addForm.userName,
              passWord: THIS.addForm.password,
              name: THIS.addForm.name,
              phoneNumber: THIS.addForm.phoneNumber,
              email: THIS.addForm.email,
              sex: THIS.addForm.sex,
              isEnable: THIS.addForm.isEnable,
              roleId: THIS.addForm.roleName,
              unitsId: THIS.addForm.unitsId
            }
          }).then(res => {
            console.log(res);
            console.log("请求新建 ");
            if (res.data.code === 1) {
              THIS.getUserList();
              THIS.GLOBAL.showResult(1, "添加成功！");
            } else {
              THIS.GLOBAL.showResult(2, res.data.msg);
            }
          });
        } else {
          THIS.$refs.model_add.visible = true;
          THIS.model_add = true;
          THIS.isValid = false;
        }
      });
    },
    doEdit() {
      // 请求编辑
      let THIS = this;
      console.log("请求编辑");
      console.log(THIS.editForm.unitsId);
      THIS.$refs["editForm"].validate(valid => {
        if (valid) {
          THIS.isValid = true;
          THIS.GLOBAL.$http(
            THIS.GLOBAL.HEADER + "/user",
            "PUT",
            function(res) {
              console.log("编辑成功");
              console.log(res);
              if (res.data.code === 1) {
                THIS.getUserList();
                THIS.GLOBAL.showResult(1, "修改成功！");
              } else {
                THIS.GLOBAL.showResult(2, res.data.msg);
                THIS.GLOBAL.banSureBut(THIS);
              }
            },
            {
              id: THIS.editForm.id,
              userName: THIS.editForm.userName,
              passWord: THIS.editForm.password,
              name: THIS.editForm.name,
              phoneNumber: THIS.editForm.phoneNumber,
              email: THIS.editForm.email,
              sex: THIS.editForm.sex,
              roleId: THIS.editForm.roleName,
              isEnable: THIS.editForm.isEnable,
              unitsId: THIS.editForm.unitsId
            }
          );
        } else {
          THIS.$refs.model_edit.visible = true;
          THIS.model_edit = true;
          THIS.isValid = false;
        }
      });
    },
    doDelete(id) {
      // 请求删除
      let THIS = this;
      THIS.GLOBAL.$http(
        THIS.GLOBAL.HEADER + "/user",
        "DELETE",
        function(res) {
          console.log(res);
          console.log("请求删除 ");
          if (res.data.code === 1) {
            THIS.getUserList();
          } else {
            THIS.GLOBAL.showResult(2, res.data.msg);
          }
        },
        {
          id: id
        }
      );
    },
    cancelEdit() {
      this.editForm = {
        id: "",
        userName: "",
        name: "",
        roleName: "",
        sex: "",
        phoneNumber: "",
        email: "",
        isEnable: "",
        unitsId: ""
      };
    },
    cancelAdd() {
      this.addForm = {
        id: "",
        userName: "",
        name: "",
        roleName: "",
        sex: "",
        phoneNumber: "",
        email: "",
        isEnable: "",
        unitsId: ""
      };
    },
    pageInfor(e) {
      // 分页
      this.pageCurrent = e;
      this.getUserList(this.pageCurrent);
      // this.checkStatus = [];
      // this.readMids = [];
    }
  }
};
</script>
