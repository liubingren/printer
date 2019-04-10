<style scoped lang="less">
.content {
  padding: 32px;
  .createList {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .table-wrap {
    margin-top: 32px;
    .page-bar {
      margin-top: 32px;
      text-align: center;
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
    >系统管理 ＞ 角色管理</div>
    <div slot="content" class="content">
      <div class="createList">
        <Button type="primary" @click="openAddModle()">新建</Button>
      </div>
      <div class="table-wrap">
        <Table :columns="roleColumns" :data="roleColumnsData" border></Table>
        <Page
          class="page-bar"
          show-total
          :total="totalPage"
          :current="thisPage"
          show-elevator
          @on-change="getCurrentPage($event)"
        />
      </div>
      <Modal
        width="400px"
        class-name="centerModal allModle"
        v-model="roleModal"
        ref="actionModal"
        :title="modalTitle"
        @on-ok="addOrUpdateUserRole('roleInforList')"
      >
        <Form ref="roleInforList" :model="roleInforList" :rules="ruleValidate" :label-width="80">
          <FormItem label="角色名称" prop="roleName">
            <Input size="large" v-model="roleInforList.roleName" placeholder="请输入角色名称"></Input>
          </FormItem>
          <FormItem label="角色名称值" prop="roleVal">
            <Input size="large" v-model="roleInforList.roleVal" placeholder="请输入角色名称值"></Input>
          </FormItem>
          <FormItem label="备注" class="ivu-form-item-label1" prop="markInput">
            <Input size="large" v-model="roleInforList.markInput" placeholder="请输入备注"></Input>
          </FormItem>
        </Form>
      </Modal>
    </div>
  </layOut>
</template>
<script>
import layOut from "./../components/Layout.vue";
export default {
  name: "index",
  mounted() {
    this.getUserRole();
  },
  computed: {},
  data() {
    return {
      roleModal: false,
      modalTitle: "新建角色",
      totalPage: 0,
      thisPage: 1,
      roleInforList: {
        id: "",
        roleName: "",
        roleVal: "",
        markInput: ""
      },
      ruleValidate: {
        roleName: [
          { required: true, message: "请输入角色名称！", trigger: "blur" }
        ],
        roleVal: [
          { required: true, message: "请输入角色名称值！", trigger: "blur" }
        ]
      },
      roleColumns: [
        {
          title: "角色名称",
          align: "center",
          key: "rName"
        },
        {
          title: "角色名称值",
          key: "name",
          align: "center"
        },
        {
          title: "备注",
          key: "remark",
          align: "center"
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
                      this.openupdateModle(params.index);
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
      ],
      roleColumnsData: []
    };
  },
  methods: {
    //获取列表
    getUserRole() {
      let that = this;
      that.GLOBAL.$http(
        that.GLOBAL.HEADER + "/role",
        "GET",
        res => {
          if (res.data.code === 1) {
            that.roleColumnsData = res.data.data.list;
            that.totalPage = res.data.data.total;
            that.thisPage = res.data.data.pageNum;
          } else {
            that.GLOBAL.showResult(res.data.code, res.data.msg);
          }
        },
        {
          pageNum: that.thisPage,
          pageSize: 10
        }
      );
    },
    //添加///编辑
    addOrUpdateUserRole(name) {
      let that = this;
      that.$refs[name].validate(valid => {
        if (valid) {
          if (that.modalTitle === "新建角色") {
            that.GLOBAL.$http(
              that.GLOBAL.HEADER + "/role",
              "POST",
              res => {
                if (res.data.code === 1) {
                  that.GLOBAL.showResult(res.data.code, res.data.msg);
                  that.getUserRole();
                } else {
                  that.GLOBAL.showResult(res.data.code, res.data.msg);
                }
              },
              {
                name: that.roleInforList.roleVal,
                rName: that.roleInforList.roleName,
                remark: that.roleInforList.markInput
              }
            );
          } else {
            that.GLOBAL.$http(
              that.GLOBAL.HEADER + "/role",
              "PUT",
              res => {
                if (res.data.code === 1) {
                  that.getUserRole();
                  that.GLOBAL.showResult(res.data.code, res.data.msg);
                } else {
                  that.GLOBAL.showResult(res.data.code, res.data.msg);
                }
              },
              {
                name: that.roleInforList.roleVal,
                rName: that.roleInforList.roleName,
                remark: that.roleInforList.markInput,
                id: that.roleInforList.id
              }
            );
          }
        } else {
          that.$refs.actionModal.visible = true;
          that.roleModal = true;
        }
      });
    },
    // 打开新建弹框
    openAddModle() {
      this.roleModal = true;
      this.modalTitle = "新建角色";
      this.roleInforList.roleName = "";
      this.roleInforList.roleVal = "";
      this.roleInforList.markInput = "";
    },
    //打开编辑弹框
    openupdateModle(index) {
      this.roleModal = true;
      this.modalTitle = "编辑角色";
      this.roleInforList.roleName = this.roleColumnsData[index].rName;
      this.roleInforList.roleVal = this.roleColumnsData[index].name;
      this.roleInforList.markInput = this.roleColumnsData[index].remark;
      this.roleInforList.id = this.roleColumnsData[index].id;
    },
    deleteRow(index) {
      let that = this;
      that.$Modal.confirm({
        title: "提示信息",
        content: "<p>确定删除该角色？</p>",
        loading: true,
        onOk: () => {
          that.GLOBAL.$http(
            that.GLOBAL.HEADER + "role",
            "DELETE",
            res => {
              if (res.data.code === 1) {
                that.getUserRole();
                that.GLOBAL.showResult(res.data.code, res.data.msg);
                setTimeout(() => {
                  that.$Modal.remove();
                }, 1000);
              } else {
                that.GLOBAL.showResult(res.data.code, res.data.msg);
              }
            },
            {
              id: that.roleColumnsData[index].id
            }
          );
        }
      });
    },
    getCurrentPage(e) {
      this.thisPage = e;
      this.getUserRole();
    }
  },
  components: {
    layOut
  }
};
</script>
