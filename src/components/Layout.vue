<style scoped lang='less'>
.layout {
  background: #f5f7f9;
  position: relative;
  overflow-y: auto;
  width: calc(100vw);
  height: calc(100vh);
  padding: 0 0;
  margin: 0 0;
  .ivu-menu-horizontal {
    height: 80px;
    line-height: 80px;
    background: #343436;
    overflow: hidden;
    .layout-logo {
      float: left;
      position: relative;
      height: 100%;
      display: flex;
      align-items: center;
      a {
        display: inline-block;
        background: url("./../assets/logo.png");
        width: 48px;
        height: 62px;
        border-radius: 3px;
        margin-left: 32px;
        margin-right: 12px;
      }
      span {
        font-size: 18px;
        color: #fefefe;
      }
    }
    .layout-nav {
      width: 200px;
      height: 100%;
      margin: 0 auto;
      margin-right: 20px;
      float: right;
      text-align: right;
      i,
      a,
      span {
        color: #ffffff;
      }
      span {
        font-size: 24px;
        margin: 0 8px;
      }
      a {
        font-size: 16px;
      }
      i {
        font-size: 24px;
      }
    }
  }
  .ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item {
    color: #ffffff;
  }
  .ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item:hover {
    color: #2d8cf0;
  }
  .ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu),
  .ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):hover {
    color: #ffffff;
    background: #2d8cf0;
    z-index: 2;
  }
}
</style>
<template>
  <div class="layout" id="layout">
    <Layout>
      <Header
        :style="{height:'calc(80px)',minWidth:'1349px',width:'100vw',position: 'fixed',zIndex:'99'}"
      >
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo">
            <a href></a>
            <span>高温喷墨打印机云平台</span>
          </div>
          <div class="layout-nav">
            <Icon @click="getpersonalInfor" type="md-person"></Icon>
            <a href @click.prevent="getpersonalInfor">个人</a>
            <span>|</span>
            <Icon type="ios-power" @click="signOut"></Icon>
            <a href @click.prevent="signOut">退出</a>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider
          hide-trigger
          :style="{background: '#4e4e50',minHeight:'calc(100vh - 80px)',top:'80px',width:'280px',position: 'fixed',zIndex:'99'}"
        >
          <Menu
            :style="{background: '#4e4e50',color:'#ffffff'}"
            width="auto"
            :open-names="open"
            :active-name="active"
            ref="side_menu"
            @on-select="getMenuItemName"
            @on-open-change="getSubmenuName"
          >
            <MenuItem
              :name="item.id"
              :key="item.id"
              :to="item.url"
              v-for="(item,index) in navLeftData"
              v-if="item.child.length === 0"
            >{{item.name}}</MenuItem>
            <Submenu :key="item.id" :name="item.id" v-else>
              <template slot="title">{{item.name}}</template>
              <MenuItem
                v-for="page of item.child"
                :key="page.id"
                :name="page.id"
                :to="page.url"
              >{{page.name}}</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout
          :style="{padding: '16px',position:'absolute',top:'80px',left:'200px',minWidth:'calc(1349px - 232px)',width:'calc(100vw - 232px)',overflow:'hidden'}"
        >
          <slot name="page-title"></slot>
          <Content :style="{ minHeight:'calc(80vh)', background: '#fff'}">
            <slot name="content"></slot>
          </Content>
        </Layout>
      </Layout>
    </Layout>
    <Modal
      v-model="userModal"
      title="个人设置"
      @on-ok="postpersonalSet()"
      class-name="userModal"
      :loading="loading"
      :accordion="true"
    >
      <Tabs :value="tabValue" @on-click="getTabValue($event)">
        <TabPane label="个人信息" name="userSet">
          <Form
            ref="personInforList"
            :model="personInforList"
            :rules="ruleValidate"
            :label-width="80"
          >
            <FormItem label="用户名" class="ivu-form-item-label1" prop="userName">
              <span>{{ personInforList.userName }}</span>
            </FormItem>
            <FormItem label="角色" class="ivu-form-item-label1" prop="role">
              <span>{{ personInforList.role }}</span>
            </FormItem>
            <FormItem label="姓名" prop="nameU">
              <Input size="large" v-model="personInforList.nameU" placeholder="请输入姓名"></Input>
            </FormItem>
            <FormItem label="性别" prop="sex">
              <Select size="large" v-model="personInforList.sex" placeholder="请选择性别">
                <Option value="男">男</Option>
                <Option value="女">女</Option>
              </Select>
            </FormItem>
            <FormItem label="手机" prop="phoneNum">
              <Input size="large" v-model="personInforList.phoneNum" placeholder="请输入手机"></Input>
            </FormItem>
            <FormItem label="邮件" prop="eMail">
              <Input size="large" v-model="personInforList.eMail" placeholder="请输入邮件"></Input>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="密码修改" name="passSet">
          <Form
            ref="passwordInforList"
            :model="passwordInforList"
            :rules="ruleValidate1"
            :label-width="80"
          >
            <FormItem label="旧密码" prop="oldPassword">
              <Input
                size="large"
                type="password"
                v-model="passwordInforList.oldPassword"
                placeholder="请输入旧密码"
              ></Input>
            </FormItem>
            <FormItem label="新密码" prop="newPassword">
              <Input
                size="large"
                type="password"
                v-model="passwordInforList.newPassword"
                placeholder="请输入新密码"
              ></Input>
            </FormItem>
            <FormItem label="确认密码" prop="surePassword">
              <Input
                size="large"
                type="password"
                v-model="passwordInforList.surePassword"
                placeholder="请再次输入新密码"
              ></Input>
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "layout",
  mounted() {
    this.getNaLeftList();
  },
  computed: {},
  data() {
    //手机验证
    const validatePhomeNUm = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号！"));
      }
      setTimeout(() => {
        if (!this.regphone.test(value)) {
          callback(new Error("请输入正确的手机号格式！"));
        } else {
          callback();
        }
      }, 100);
    };
    //新密码对比
    const validatesurePassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请再次输入新密码！"));
      }
      setTimeout(() => {
        if (value == this.passwordInforList.newPassword) {
          callback();
        } else {
          callback(new Error("与新密码不符合，请再次输入新密码！"));
        }
      }, 100);
    };
    return {
      activeName: "系统管理",
      userModal: false,
      tabValue: "userSet",
      tabType: "userSet",
      regphone: /^1[34578]\d{9}$/, //手机
      loading: true,
      flag: false,
      active: "",
      open: [],
      personInforList: {
        userName: "李四",
        role: "管理员",
        nameU: "",
        sex: "男",
        phoneNum: "",
        eMail: ""
      },
      passwordInforList: {
        oldPassword: "",
        newPassword: "",
        surePassword: ""
      },
      ruleValidate: {
        nameU: [{ required: true, message: "请输入姓名！", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别！", trigger: "change" }],
        eMail: [
          { required: true, message: "请输入邮件！", trigger: "blur" },
          { type: "email", message: "请输入正确的邮件格式！", trigger: "blur" }
        ],
        phoneNum: [
          {
            validator: validatePhomeNUm,
            trigger: "blur"
          }
        ]
      },
      ruleValidate1: {
        oldPassword: [
          {
            required: true,
            message: "请输入旧密码！",
            trigger: "blur"
          }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" }
        ],
        surePassword: [
          {
            validator: validatesurePassword,
            trigger: "blur"
          }
        ]
      },
      navLeftData: []
    };
  },
  methods: {
    //获取登录用户信息
    getpersonalInfor() {
      let that = this;
      that.userModal = true;
      that.GLOBAL.axios({
        url: that.GLOBAL.HEADER + "/user/logged",
        method: "GET"
      }).then(({ data }) => {
        if (data.code === 1) {
          that.personInforList.userName = data.data.userName;
          that.personInforList.role = data.data.roleName;
          that.personInforList.nameU = data.data.name;
          that.personInforList.sex = data.data.sex;
          that.personInforList.phoneNum = data.data.phoneNumber;
          that.personInforList.eMail = data.data.email;
        }
      });
    },
    //修改个人信息
    postpersonalSet() {
      let that = this;
      let tabTypeName = "personInforList";
      //个人设置
      if (that.tabType == "userSet") {
        tabTypeName = "personInforList";
        that.$refs[tabTypeName].validate(valid => {
          if (valid) {
            that.GLOBAL.$http(
              that.GLOBAL.HEADER + "/base/personal/data",
              "PUT",
              function(res) {
                if (res.data.code === 1) {
                  that.GLOBAL.showResult(1, "设置成功！")
                  that.userModal = false;
                } else {
                  that.GLOBAL.showResult(2, res.data.msg)
                }
              },
              {
                email: that.personInforList.eMail,
                name: that.personInforList.nameU,
                phoneNumber: that.personInforList.phoneNum,
                sex: that.personInforList.sex
              }
            );
          } else {
            that.GLOBAL.banSureBut(that)
          }
        });
      } 
      //密码设置
      else {
        tabTypeName = "passwordInforList"
        that.$refs[tabTypeName].validate(valid => {
          if (valid) {        
            that.GLOBAL.$http(
              that.GLOBAL.HEADER + "/base/personal/password",
              "PUT",
              function(res) {
                if (res.data.code === 1) {
                  that.GLOBAL.showResult(1, "密码修改成功！")
                  that.passwordInforList.newPassword = ""
                  that.passwordInforList.oldPassword = ""
                  that.passwordInforList.surePassword = ""
                  that.userModal = false
                } else {
                  that.GLOBAL.showResult(2, res.data.msg)
                  that.GLOBAL.banSureBut(that)
                }
              },
              {
                newPassword: that.passwordInforList.newPassword,
                oldPassword: that.passwordInforList.oldPassword
              }
            );
          } else {
            that.GLOBAL.banSureBut(that)
          }
        });
      }
    },
    //获取tab标注值
    getTabValue(e) {
      this.tabType = e;
    },
    //退出
    signOut() {
      let that = this;
      that.$Modal.confirm({
        title: "提示信息",
        content: "<p>确定退出？</p>",
        loading: true,
        onOk: () => {
          that.GLOBAL.axios({
            url: that.GLOBAL.HEADER + "/login/out",
            method: "POST"
          }).then(({ data }) => {
            if (data.code === 1) {
              setTimeout(() => {
                this.$Modal.remove();
              }, 10);
              sessionStorage.clear("userName");
              that.$router.push({
                path: `/login`
              });
            }
          });
        }
      });
    },
    getNaLeftList() {
      this.GLOBAL.$http(this.GLOBAL.HEADER + `base/tree`, "GET", res => {
        if (res.data.code === 1) {
          this.navLeftData = res.data.data;
          //更新选中和展开状态
          if (sessionStorage.getItem("active")) {
            this.active = sessionStorage.getItem("active");
            this.open = []; //清空选中状态
            if (
              sessionStorage.getItem("open") &&
              JSON.parse(sessionStorage.getItem("open")).length > 0
            ) {
              this.open = JSON.parse(sessionStorage.getItem("open"));
            }
            this.$nextTick(() => {
              this.$refs.side_menu.updateOpened();
              this.$refs.side_menu.updateActiveName();
            });
          }
        } else {
          this.GLOBAL.showResult(res.data.code, res.data.msg);
        }
      });
    },
    getMenuItemName(e) {
      //保存当前选中状态
      this.active = e;
      sessionStorage.setItem("active", e);
    },
    getSubmenuName(e) {
      //保存展开状态
      this.open = e;
      sessionStorage.setItem("open", JSON.stringify(e));
    }
  }
};
</script>

