<style scoped lang="less">
@rpmBorder: 1px solid #dddee1;
@perLeft: 20px; // 每个权限项目的左边距
.content {
  padding: 32px;
  .createList {
    width: 100%;
  }
  .table-wrap {
    width: 100%;
    margin-top: 32px;
    .card-title {
      width: 100%;
      height: 52px;
      background-color: #d5e8fc;
      text-align: center;
      line-height: 52px;
      color: #343436;
      font-size: 16px;
      font-weight: bold;
    }
    .card-body {
      height: 540px;
      overflow-y: scroll;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      border: @rpmBorder;
      li {
        list-style: none;
      }
      li:last-of-type {
        border-bottom: none;
      }
      > li {
        position: relative;
        width: 100%;
        padding-left: 1%;
        border-bottom: @rpmBorder;
        > label {
          line-height: 100px;
          font-size: 18px;
        }
        > ul {
          position: absolute;
          height: 100%;
          width: 85%;
          top: 0;
          left: 0;
          border-left: @rpmBorder;
          margin-left: 15%;
          > li {
            position: relative;
            display: flex;
            padding-left: 20px;
            border-bottom: @rpmBorder;
            .rp-list {
              position: absolute;
              display: flex;
              flex-wrap: wrap;
              height: 100%;
              margin-left: 200px;
              border-left: @rpmBorder;
              li {
                margin-left: @perLeft;
              }
            }
          }
        }
        .first-rpl,
        .first-rpl1 {
          display: flex;
          padding-left: 220px;
          li {
            display: flex;
            justify-content: flex-start;
            border: none;
            flex-direction: row;
            align-items: center;
            padding-left: @perLeft;
            &:first-of-type {
              border-left: @rpmBorder;
            }
          }
        }
        .first-rpl1 {
          padding-left: 20px;
        }
        .ivu-checkbox-wrapper1 {
          > label {
            width: 172px;
            display: inline-block;
          }
        }
      }
    }
    .submit-per {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: 32px;
      button {
        margin-left: auto;
        margin-right: auto;
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
    >系统管理 ＞ 角色权限管理</div>
    <div slot="content" class="content">
      <div class="createList">角色名称:
        <Select
          v-model="roleSelectModel"
          style="width:200px"
          placeholder="请选择角色名称"
          @on-change="getSelectedRole(roleSelectModel)"
        >
          <Option v-for="item in roleSelectList" :value="item.id " :key="item.name">{{ item.rName }}</Option>
        </Select>
      </div>
      <div class="table-wrap">
        <div class="card-title">角色权限管理列表</div>
        <ul class="card-body">
          <!--一级模块层级-->
          <li v-for="(mod,index) of rpm.rpmList" :key="mod.name" class="role-manage-list">
            <Checkbox
              size="large"
              v-model="mod.checked"
              @on-change="getAllChecked($event,index)"
            >{{mod.name}}</Checkbox>
            <!--有二级页面层级-->
            <ul v-if="mod.child.length && mod.child[0].level === 2">
              <li v-for="(page,index1) of mod.child" :key="page.name" class="ivu-checkbox-wrapper1">
                <Checkbox
                  size="large"
                  v-model="page.checked"
                  @on-change="getPageChecked($event,page.name,page.id,index)"
                >{{page.name}}</Checkbox>
                <!--显示权限-->
                <ul class="first-rpl1">
                  <li>
                    <Checkbox
                      v-for="(pagelist,index2) of mod.child[index1].child"
                      :key="pagelist.name"
                      size="large"
                      v-model="pagelist.checked"
                      @on-change="getCheckboxes($event,pagelist.id,index2,index,index1)"
                    >{{pagelist.name}}</Checkbox>
                  </li>
                </ul>
              </li>
            </ul>
            <!--无二级页面层级，显示权限-->
            <ul v-else-if="mod.child.length && mod.child[0].level === 3" class="first-rpl">
              <li>
                <Checkbox
                  v-for="(page,index3) of mod.child"
                  :key="page.name"
                  size="large"
                  v-model="page.checked"
                  @on-change="getCheckboxes($event,page.id,index3,index)"
                >{{page.name}}</Checkbox>
              </li>
            </ul>
          </li>
        </ul>
        <div class="submit-per">
          <Button size="large" type="primary" @click="submitPer()">确认</Button>
        </div>
      </div>
    </div>
  </layOut>
</template>
<script>
import layOut from "./../components/Layout.vue";
export default {
  mounted() {
    this.getOperationUser();
  },
  computed: {},
  data() {
    return {
      rpm: {
        roleNames: [],
        rpmList: [],
        resourcesId: [], //被勾选的资源
        resourcesIdItem: [], //存储二级资源id，用于判断一级是否被选择
        jurisdictionIdItem: [], //存储权限id，用于判断er级是否被选择
        checkedList: [], // 被勾选的权限
        pageList: [] // 二级页面
      },
      roleSelectList: [],
      roleSelectModel: ""
    };
  },
  methods: {
    //获取角色名称
    getOperationUser() {
      this.GLOBAL.axios({
        url: this.GLOBAL.HEADER + "/permissionRole/role/list"
      }).then(({ data }) => {
        this.roleSelectList = data.data;
        this.roleSelectModel = this.roleSelectList[0].id;
        this.getSelectedRole(this.roleSelectModel);
      });
    },
    // 获取选择的角色id
    getSelectedRole(id) {
      this.roleSelectModel = id;
      this.rpm.checkedList = [];
      this.getRpm();
    },
    // 全选/全不选(模块)
    getAllChecked(e, index) {
      if (e) {
        if (this.rpm.rpmList[index].child.length) {
          if (!this.rpm.resourcesId.includes(this.rpm.rpmList[index].id)) {
            this.rpm.resourcesId.push(this.rpm.rpmList[index].id);
          }
          // 如果没有子页面(二级)
          if (this.rpm.rpmList[index].child[0].level === 3) {
            for (let item of this.rpm.rpmList[index].child) {
              item.checked = e;
              this.rpm.checkedList.push(item.id);
            }
          }
          //// 如果有子页面
          if (this.rpm.rpmList[index].child[0].level === 2) {
            for (let page of this.rpm.rpmList[index].child) {
              page.checked = e;
              if (!this.rpm.resourcesId.includes(page.id)) {
                this.rpm.resourcesId.push(page.id);
              }
              if (!this.rpm.resourcesIdItem.includes(page.id)) {
                this.rpm.resourcesIdItem.push(page.id);
              }
              for (let item of page.child) {
                item.checked = e;
                this.rpm.checkedList.push(item.id);
              }
            }
          }
        }
      } else {
        if (this.rpm.rpmList[index].child.length) {
          this.rpm.resourcesId.splice(
            this.rpm.resourcesId.indexOf(this.rpm.rpmList[index].id),
            1
          );
          // 如果没有子页面
          if (this.rpm.rpmList[index].child[0].level === 3) {
            for (let item of this.rpm.rpmList[index].child) {
              if (item.checked) {
                this.rpm.checkedList.splice(
                  this.rpm.checkedList.indexOf(item.id),
                  1
                );
              }
              item.checked = e;
            }
          }
          //// 如果有子页面
          if (this.rpm.rpmList[index].child[0].level === 2) {
            for (let page of this.rpm.rpmList[index].child) {
              if (page.checked) {
                this.rpm.resourcesId.splice(
                  this.rpm.resourcesId.indexOf(page.id),
                  1
                );
              }
              page.checked = e;
              for (let item of page.child) {
                if (item.checked) {
                  this.rpm.checkedList.splice(
                    this.rpm.checkedList.indexOf(item.id),
                    1
                  );
                }
                item.checked = e;
              }
            }
          }
        }
      }
    },
    // 全选/全不选(子页面)  index一级资源的index
    getPageChecked(e, name, id, index) {
      for (let page of this.rpm.pageList) {
        if (name === page.name) {
          if (e) {
            // 全选
            //当二级资源被选择，一级资源也选择，存储一级id
            this.rpm.rpmList[index].checked = e;
            if (!this.rpm.resourcesId.includes(this.rpm.rpmList[index].id)) {
              this.rpm.resourcesId.push(this.rpm.rpmList[index].id);
            }
            if (!this.rpm.resourcesId.includes(id)) {
              this.rpm.resourcesId.push(id);
            }
            if (!this.rpm.resourcesIdItem.includes(id)) {
              this.rpm.resourcesIdItem.push(id);
            }
            for (let item of page.child) {
              item.checked = e;
              // 只加入原来没勾选的权限
              if (!this.rpm.checkedList.includes(item.id)) {
                this.rpm.checkedList.push(item.id);
              }
            }
          } else {
            // 全不选
            this.rpm.resourcesId.splice(this.rpm.resourcesId.indexOf(id), 1);
            this.rpm.resourcesIdItem.splice(
              this.rpm.resourcesIdItem.indexOf(id),
              1
            );
            if (this.rpm.resourcesIdItem.length == 0) {
              //当二级资源全不不选，一级资源去掉勾选和id
              this.rpm.rpmList[index].checked = e;
              this.rpm.resourcesId.splice(
                this.rpm.resourcesId.indexOf(this.rpm.rpmList[index].id),
                1
              );
            }
            for (let item of page.child) {
              if(item.checked){
                this.rpm.checkedList.splice(
                    this.rpm.checkedList.indexOf(item.id),
                    1
                );
              }
              item.checked = e             
            }
          }
        }
      }
    },
    // 获取勾选ID(角色权限管理)
    getCheckboxes(e, id, index3, index, index2) {
      //index3权限，index一级资源，index2二级资源
      // 推入或删除勾选的权限ID
      if (e) {
        this.rpm.checkedList.push(id);
        //一级选择，资源存储id
        this.rpm.rpmList[index].checked = e;
        if (!this.rpm.resourcesId.includes(this.rpm.rpmList[index].id)) {
          this.rpm.resourcesId.push(this.rpm.rpmList[index].id);
        }
        //二级选择，资源存储id
        if (index2 + "" != "undefined") {
          this.rpm.rpmList[index].child[index2].checked = e;
          if (
            !this.rpm.resourcesId.includes(
              this.rpm.rpmList[index].child[index2].id
            )
          ) {
            this.rpm.resourcesId.push(this.rpm.rpmList[index].child[index2].id);
          }
          if (
            !this.rpm.resourcesIdItem.includes(
              this.rpm.rpmList[index].child[index2].id
            )
          ) {
            this.rpm.resourcesIdItem.push(
              this.rpm.rpmList[index].child[index2].id
            );
          }
        }
      } else {
        this.rpm.checkedList.splice(this.rpm.checkedList.indexOf(id), 1);
        if (index2 + "" != "undefined") {
          //有二级
          //权限选择
          let itemList = [];
          for (let item of this.rpm.pageList[index2].child) {
            if (item.checked) {
              itemList.push(item.id);
            }
          }
          if (itemList.length == 0) {
            this.rpm.pageList[index2].checked = e;
            this.rpm.resourcesId.splice(
              this.rpm.resourcesId.indexOf(this.rpm.pageList[index2].id),
              1
            );
            //权限全部选择，一，二级资源也不选择
            let resourcesItemList = [];
            for (let item of this.rpm.rpmList[index].child) {
              if (item.checked) {
                resourcesItemList.push(item.id);
              }
            }
            if (resourcesItemList.length == 0) {
              this.rpm.rpmList[index].checked = e;
              this.rpm.resourcesId.splice(
                this.rpm.resourcesId.indexOf(this.rpm.rpmList[index].id),
                1
              );
            }
          }
        } else {
          //无二级
          let itemList = [];
          for (let item of this.rpm.rpmList[index].child) {
            if (item.checked) {
              itemList.push(item.id);
            }
          }
          if (itemList.length == 0) {
            this.rpm.rpmList[index].checked = e;
            this.rpm.resourcesId.splice(
              this.rpm.resourcesId.indexOf(this.rpm.rpmList[index].id),
              1
            );
          }
        }
      }
    },

    // 获取角色权限列表
    getRpm() {
      let that = this;
      that.GLOBAL.axios({
        url: that.GLOBAL.HEADER + "/permissionRole/" + that.roleSelectModel
      }).then(({ data }) => {
        that.rpm.resourcesId = [];
        that.rpm.checkedList = [];
        that.rpm.pageList = [];
        that.rpm.rpmList = data.data;
        // 本来已经具有的权限, 一开始就要加入到数组中
        for (let item of that.rpm.rpmList) {
          if (item.checked) {
            if (!this.rpm.resourcesId.includes(item.id)) {
              this.rpm.resourcesId.push(item.id);
            }
          }
          //一级
          if (item.child.length) {
            // 如果模块下有子页面
            let truePages = 0; // 用来记录子页面是否全选
            if (item.child[0].level === 2) {
              //二级
              that.rpm.pageList = that.rpm.pageList.concat(item.child);
              for (let itemTow of item.child) {
                // 遍历二级页面
                let trueNum = 0; // 用来记录获得权限的数量
                if (itemTow.checked) {
                  //记录点击的二级名字
                  if (!this.rpm.resourcesIdItem.includes(itemTow.id)) {
                    this.rpm.resourcesIdItem.push(itemTow.id);
                  }
                  if (!this.rpm.resourcesId.includes(itemTow.id)) {
                    this.rpm.resourcesId.push(itemTow.id);
                  }
                }
                for (let itemThree of itemTow.child) {
                  // 遍历页面下的权限
                  if (itemThree.checked) {
                    that.rpm.checkedList.push(itemThree.id); //储存已选的
                    trueNum += 1;
                  }
                  // 让二级页面显示为全选
                  if (trueNum === itemTow.child.length) {
                    itemTow.checked = true;
                    truePages += 1;
                  }
                }
              }
            }
            if (truePages === item.child.length) {
              item.checked = true;
            }
            if (item.child[0].level === 3) {
              //权限
              let trueNum = 0;
              for (let itemThree of item.child) {
                // 遍历页面下的权限
                if (itemThree.checked) {
                  that.rpm.checkedList.push(itemThree.id); //储存已选的
                  trueNum += 1;
                }
              }
              if (trueNum === item.child.length) {
                item.checked = true;
              }
            }
          }
        }
      });
    },
    // 提交角色权限
    submitPer() {
      let that = this;
      that.GLOBAL.axios({
        method: "put",
        url: that.GLOBAL.HEADER + "permissionRole",
        params: {
          roleId: that.roleSelectModel,
          permissionIds: that.rpm.checkedList,
          resourcesIds: that.rpm.resourcesId
        }
      }).then(function(res) {
        if (res.data.code === 1) {
          that.GLOBAL.showResult(res.data.code, res.data.msg);
          that.getRpm();
        } else {
          that.GLOBAL.showResult(res.data.code, res.data.msg);
        }
      });
    }
  },
  components: {
    layOut
  }
};
</script>

