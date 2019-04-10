<style scoped lang="less">
.content {
  width: 100%;
  height: 100%;
  background-color: #f5f7f9 !important;
  display: flex;
  justify-content: flex-start;
  .content-l {
    width: 280px;
    min-width: 280px;
    background-color: #fff;
    display: inline-block;
    border-radius: 8px;
    padding: 32px 16px;
    height: calc(80vh);
    margin-right: 16px;
  }
  .content-r {
    width: 100%;
    padding: 32px;
    height: calc(80vh);
    background-color: #fff;
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
}
</style>
<template>
  <layOut v-cloak>
    <div
      slot="page-title"
      class="page-title"
      :style="{color:'#343436',fontSize:'18px',marginBottom:'15px'}"
    >系统管理 ＞ 权限管理</div>

    <div slot="content" class="content">
      <div class="content-l">
        <Tree :data="treeData" @on-select-change="getNodeId($event)"></Tree>
      </div>

      <div class="content-r">
        <div class="createList">
          <Button type="primary" @click="openAddModle()">新建</Button>
        </div>
        <div
          class="table-wrap"
          :style="{minWidth:'calc(1349px - 612px)',width:'calc(100vw - 612px)'}"
        >
          <Table :columns="privilegeColumns" :data="privilegeColumnsData" border></Table>
          <Page class="page-bar" :total="totalPage" :current="thisPage" show-total show-elevator  @on-change="getCurrentPage($event)"/>
        </div>
      </div>
      <Modal
        width="400px"
        ref="actionModal"
        class-name="centerModal allModle"
        v-model="privilegeModal"
        :title="modalTitle"
        @on-ok="addOrUpdateList('privilegeInforList')"
      >
        <Form
          ref="privilegeInforList"
          :model="privilegeInforList"
          :label-width="80"
        >
          <FormItem label="模块名称">
            <Input size="large" v-model="privilegeInforList.modelName" disabled></Input>
          </FormItem>         
          <FormItem label="权限名称">
            <Select size="large" v-model="privilegeInforList.privilegeVal"  @on-change="getSelectPer($event)"  placeholder="请选择权限名称">
                <Option v-for="item of privilegeInforList.privilegeValList"
                              :key="item.id" :value="item.value">
                        {{item.name}}</Option>
            </Select>
            <!-- <Input size="large" v-model="privilegeInforList.privilegeName" placeholder="请输入权限名称"></Input> -->
          </FormItem>  
           <FormItem label="权限名称值" class="ivu-form-item-label1">
            
            <Input size="large" v-model="privilegeInforList.privilegeVal" disabled placeholder="请输入权限名称值"></Input>
          </FormItem>     
        </Form>
      </Modal>
    </div>
  </layOut>
</template>
<script>
import layOut from "./../components/Layout.vue";

export default {
  mounted() {
    this.initTree();
    this.getOperationAuthority();
  },
  computed: {},
  data() {
    return {
      modalTitle: "新建权限",
      privilegeModal: false,
      totalPage: 0,
      thisPage: 1,
      treeId:'',
      privilegeInforList: {
        id:'',
        modelName: "",
        privilegeName: "",
        privilegeVal: "",
        privilegeValList:'',

        newModelName:"主菜单"
      },
      // ruleValidate: {
      //   // privilegeName: [
      //   //   { required: true, message: "请选择权限名称！", trigger: "change" }
      //   // ],
      //   privilegeVal: [
      //     { required: true, message: "请输入权限名称值！", trigger: "blur" }
      //   ]
      // },
      treeData: [
        {
          title: "主菜单",
          expand: true,
          loading: false,
          selected: true,
          children: []
        }
      ],
      privilegeColumns: [
        {
          title: "模块名称",
          align: "center",
          key: "resourcesName"
        },
        {
          title: "权限名称",
          align: "center",
          key: "rName"
        },
        {
          title: "权限名称值",
          align: "center",
          key: "name"
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
      privilegeColumnsData: []
    };
  },
  methods: {
    //获取列表
    getList() {
      let that = this;
      that.GLOBAL.$http(
        that.GLOBAL.HEADER + "/permission",
        "GET",
        res => {
          if (res.data.code === 1) {
            that.totalPage = res.data.data.total;
            that.thisPage = res.data.data.pageNum;
            that.privilegeColumnsData = res.data.data.list;
          } else {
            that.GLOBAL.showResult(res.data.code, res.data.msg);
          }
        },
        {
          pageNum: that.thisPage,
          pageSize: 10,
          resourcesId:that.treeId
        }
      );
    },
    //添加///编辑
    addOrUpdateList(name) {
      let that = this;
        if(that.privilegeInforList.privilegeName != ''){
          if (that.modalTitle === "新建权限") {
            that.GLOBAL.$http(
              that.GLOBAL.HEADER + "/permission",
              "POST",
              res => {
                if (res.data.code === 1) {
                  that.GLOBAL.showResult(res.data.code, res.data.msg);
                  that.getList();
                } else {
                  that.GLOBAL.showResult(res.data.code, res.data.msg);
                }
              },
              {
               resourcesId:that.treeId,
               rName:that.privilegeInforList.privilegeName,
                name: that.privilegeInforList.privilegeVal
              }
            );
          } else {
            that.GLOBAL.$http(
              that.GLOBAL.HEADER + "/permission",
              "PUT",
              res => {
                if (res.data.code === 1) {
                  that.getList();
                  that.GLOBAL.showResult(res.data.code, res.data.msg);
                } else {
                  that.GLOBAL.showResult(res.data.code, res.data.msg);
                }
              },
              {
                id: that.privilegeInforList.id,
                resourcesId:that.treeId,
                rName:that.privilegeInforList.privilegeName,
                name: that.privilegeInforList.privilegeVal
              }
            );
          }
        }else{
          that.$refs.actionModal.visible = true;
          that.privilegeModal = true;
          that.GLOBAL.showResult(2, '请选择权限名称！');      
        }
    },
    // 打开新建弹框
    openAddModle() {
      if(this.privilegeInforList.newModelName != '主菜单'){
        this.privilegeModal = true;
        this.modalTitle = "新建权限";
        this.privilegeInforList.modelName = this.privilegeInforList.newModelName
        this.privilegeInforList.privilegeName = ""
        this.privilegeInforList.privilegeVal = ""
      }else{
          this.GLOBAL.showResult(2,'请先选择左侧模块名称！')
        }
      
    },
    //打开编辑弹框
    openupdateModle(index) {
      this.privilegeModal = true;
      this.modalTitle = "编辑权限";
      this.privilegeInforList.modelName = this.privilegeColumnsData[index].resourcesName;
      this.privilegeInforList.privilegeName = this.privilegeColumnsData[index].rName;
      this.privilegeInforList.privilegeVal = this.privilegeColumnsData[index].name;
      this.privilegeInforList.id = this.privilegeColumnsData[index].id;

    },
    deleteRow(index) {
      this.$Modal.confirm({
        title: "提示信息",
        content: "<p>确定删除该权限信息？</p>",
        loading: true,
        onOk: () => {
          this.GLOBAL.$http(this.GLOBAL.HEADER+'permission','DELETE',(res)=>{
              if(res.data.code===1){
                  this.getList()
                  this.GLOBAL.showResult(res.data.code,res.data.msg)
                  setTimeout(() => {
                      this.$Modal.remove();
                  }, 1000);
              }else{
                  this.GLOBAL.showResult(res.data.code,res.data.msg)
              }
          },{
              id:this.privilegeColumnsData[index].id
          })
        }
      });
    },
    //获取权限名称
    getOperationAuthority() {
       this.GLOBAL.axios({
          url: this.GLOBAL.HEADER + '/permission/operating'
        })
        .then(({
          data
        }) => {
          this.privilegeInforList.privilegeValList = data.data
        })
    },
    //根据所选名称获取名称值
    getSelectPer(e) {
      setTimeout(() => {
        this.privilegeInforList.privilegeName = document.querySelector('.ivu-select-selected-value').innerText
      }, 1)
      this.privilegeInforList.privilegeVal = e
    },
    // 加载树形图
    initTree() {
      let that = this;
      that.GLOBAL.$http(
        that.GLOBAL.HEADER + "permission/resources/tree",
        "GET",
        res => {
          if (res.data.code === 1) {
            let rlist = res.data.data;
            for (let item of rlist) {
              let mItem = {
                title: item.name,
                id: item.id,
                children: []
              };
              if (item.child.length) {
                for (let i of item.child) {
                  let sItem = {
                    title: i.name,
                    id: i.id
                  };
                  mItem.children.push(sItem);
                }
              }
              that.treeData[0].children.push(mItem);
            }
          } else {
          }
        },
        {}
      );
    },
     // 获取树形图节点ID
    getNodeId(e) {
      if(e.length){
        if(e[0].title === '主菜单'){
          this.privilegeInforList.newModelName ='主菜单'
          this.treeId = 0
        }else{
          this.privilegeInforList.newModelName = e[0].title
          this.treeId = e[0].id                 
        }
        this.getList();      
      }else{
        this.privilegeInforList.newModelName =''
      }
    },
    getCurrentPage(e) {
      this.thisPage = e;
      this.getList();
    }
  },
  components: {
    layOut
  }
};
</script>
