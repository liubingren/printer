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
    >系统管理 ＞ 资源管理</div>

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
          <Table :columns="resourceColumns" :data="resourceColumnsData" border></Table>
           <Page class="page-bar" :total="totalPage" show-total :current="thisPage" show-elevator @on-change="getCurrentPage($event)"/>
        </div>
      </div>
      <Modal
        width="400px"
        ref="actionModal"
        class-name="centerModal allModle"
        v-model="resourceModal"
        :title="modalTitle"
        @on-ok="addOrUpdateList('resourceInforList')"
      >
        <Form
          ref="resourceInforList"
          :model="resourceInforList"
          :rules="ruleValidate"
          :label-width="80"
        >
          <FormItem label="父菜单" class="ivu-form-item-label1" prop="fatherMenu">
            <Input
              size="large"
              v-model="resourceInforList.fatherMenu"
              disabled
            ></Input>
          </FormItem>
          <FormItem label="资源名称" prop="resourceName">
            <Input size="large" v-model="resourceInforList.resourceName" placeholder="请输入资源名称"></Input>
          </FormItem>
          <FormItem label="模块名称值" prop="modelName">
            <Input size="large" v-model="resourceInforList.modelName" placeholder="请输入模块名称值"></Input>
          </FormItem>

          <FormItem label="资源URL" prop="resourceURL">
            <Input size="large" v-model="resourceInforList.resourceURL" placeholder="请输入资源URL"></Input>
          </FormItem>
          <FormItem label="顺序编号" prop="numList">
            <Input size="large" v-model="resourceInforList.numList" placeholder="请输入顺序编号"></Input>
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
    this.initTree()
    this.getList()
  },
  computed: {},
  data() {
    const numListCheck = (rule, value, callback) => {
        if(!value){
            return callback(new Error("请输入顺序编号！"));
        }// 模拟异步验证效果
        setTimeout(() => {
          let reg = /^[1-9]\d*$/
          if (!reg.test(value)) {
              callback(new Error('顺序编号为整数！'));
            } else {
              callback();
            }
        }, 100);
    }
    return {
      modalTitle: "新建资源",
      resourceModal: false,
      totalPage:0,
      thisPage:1,
      treeId:0,
      resourceInforList: {
        id:'',
        numList: "",
        modelName: "",
        resourceName: "",
        resourceURL: "",
        fatherMenu: "",

        newresourceName:'主菜单'
      },
      ruleValidate: {
        
        modelName: [
          { required: true, message: "请输入模块名称值！", trigger: "blur" }
        ],
        numList: [
          { 
            validator: numListCheck,
            trigger: "change"
          }
        ],
        resourceName: [
          { required: true, message: "请输入资源名称！", trigger: "blur" }
        ],
        resourceURL: [
          { required: true, message: "请输入资源UR！", trigger: "blur" }
        ]
      },
      treeData: [
        {
          title: "主菜单",
          expand: true,
          loading: false,
          selected: true,
          children: []
        }
      ],
      resourceColumns: [
        {
          title: "顺序编号",
          align: "center",
          key: "number"
        },
        {
          title: "资源名称",
          align: "center",
          key: "name"
        },
        {
          title: "模块名称值",
          align: "center",
          key: "model"
        },

        {
          title: "资源URL",
          align: "center",
          key: "url"
        },
        {
          title: "父菜单",
          align: "center",
          key: "parentName"
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
      resourceColumnsData: []
    };
  },
  methods: {
    //获取列表
    getList(){
      let that = this
      that.GLOBAL.$http(that.GLOBAL.HEADER+'/resources','GET',(res)=>{
          if(res.data.code === 1){
            that.resourceColumnsData = res.data.data.list
            that.totalPage = res.data.data.total;
            that.thisPage = res.data.data.pageNum;
          }else{          
              that.GLOBAL.showResult(res.data.code,res.data.msg)
          }
          },{
              pageNum:that.thisPage,
              pageSize:10,
              parentId:that.treeId
          })
    },
      //添加///编辑
    addOrUpdateList(name){
      let that = this
      that.$refs[name].validate(valid => {
        if (valid) {
          if(that.modalTitle === '新建资源'){
            that.GLOBAL.$http(that.GLOBAL.HEADER+'resources','POST',(res)=>{
                if(res.data.code===1){                    
                  that.GLOBAL.showResult(res.data.code,res.data.msg)
                  that.treeData[0].children = []
                  that.initTree();
                  that.getList();
                }else{          
                    that.GLOBAL.showResult(res.data.code,res.data.msg)
                }
                },{
                  model:that.resourceInforList.modelName,
                  name:that.resourceInforList.resourceName,
                  number:that.resourceInforList.numList,
                  parentId:that.treeId,
                  url:that.resourceInforList.resourceURL
                })
          }else{
            that.GLOBAL.$http(that.GLOBAL.HEADER+'resources','PUT',(res)=>{
                if(res.data.code===1){  
                  that.treeData[0].children = []
                  that.getList()  
                  that.initTree()                
                  that.GLOBAL.showResult(res.data.code,res.data.msg)
                }else{          
                    that.GLOBAL.showResult(res.data.code,res.data.msg)
                }
                },{
                    id:that.resourceInforList.id,
                    model:that.resourceInforList.modelName,
                    name:that.resourceInforList.resourceName,
                    number:that.resourceInforList.numList,
                    parentId:that.treeId,
                    url:that.resourceInforList.resourceURL
                })
          }
      } else {
          that.$refs.actionModal.visible = true;
          that.resourceModal = true;
        }
      });
    },
    // 加载树形图
    initTree() {
      let that = this;
      that.GLOBAL.$http(
        that.GLOBAL.HEADER + "/resources/tree",
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
        },{});
    },
     // 获取树形图节点ID
    getNodeId(e) {
      if(e.length){
        this.resourceInforList.newresourceName = e[0].title     
        if (this.resourceInforList.newresourceName === '主菜单') {
          this.treeId = 0
        } else {
          this.treeId = e[0].id
        }
        this.getList();
      }else{
        this.resourceInforList.newresourceName =''
      }
    },
    // 打开新建弹框
    openAddModle() {
        if(this.resourceInforList.newresourceName){
          this.resourceModal = true;
          this.modalTitle = "新建资源";
          this.resourceInforList.fatherMenu = this.resourceInforList.newresourceName
          this.resourceInforList.modelName = ""
          this.resourceInforList.resourceName = ""
          this.resourceInforList.resourceURL = ""
          this.resourceInforList.numList = ""
        }else{
          this.GLOBAL.showResult(2,'请先选择左侧资源！')
        }
    },
    //打开编辑弹框
    openupdateModle(index) {
      this.resourceModal = true;
      this.modalTitle = "编辑资源";
      this.resourceInforList.fatherMenu = this.resourceColumnsData[index].parentName
      this.resourceInforList.modelName = this.resourceColumnsData[index].model
      this.resourceInforList.resourceName = this.resourceColumnsData[index].name
      this.resourceInforList.resourceURL = this.resourceColumnsData[index].url
      this.resourceInforList.numList = this.resourceColumnsData[index].number
      this.resourceInforList.id = this.resourceColumnsData[index].id
    },
    //删除
    deleteRow(index) {
      this.$Modal.confirm({
        title: "提示信息",
        content: "<p>确定删除该资源信息？</p>",
        loading: true,
        onOk: () => {
          this.GLOBAL.$http(this.GLOBAL.HEADER+'resources','DELETE',(res)=>{
              if(res.data.code===1){
                  this.treeData[0].children = []
                  this.initTree();
                  this.getList()
                  this.GLOBAL.showResult(res.data.code,res.data.msg)
                  setTimeout(() => {
                      this.$Modal.remove();
                  }, 1000);
              }else{
                  this.GLOBAL.showResult(res.data.code,res.data.msg)
              }
          },{
              id:this.resourceColumnsData[index].id
          })
        }
      });
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
