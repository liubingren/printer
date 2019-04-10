<style scoped lang="less">
.login-bar {
  width: 400px;
  height: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -250px;
  margin-left: -240px;
  background-color: #fff;
  z-index: 999;
  border-radius: 8px;
  border: 1px solid silver;
  box-shadow: 0 1px 10px #959393;
  .bar-item {
    width: 360px;
    margin: 0 auto;
    margin-bottom: 20px;
    // border-bottom: 1px solid #d9d9d9;
    div {
      font-size: 16px;
      color: #838383;
    }
    input {
      width: 100%;
      height: 40px;
      padding: 4px 0;
    }
    input::-webkit-input-placeholder {
      /* WebKit browsers */
      color: #d9d9d9;
    }
    input:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #d9d9d9;
    }
    input::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #d9d9d9;
    }
    input:-ms-input-placeholder {
      /* Internet Explorer 10+ */
      color: #d9d9d9;
    }
    input:focus {
      outline: none;
    }

    .yanzhengma_input {
      width: 69%;
      display: inline-block;
    }
    .verification {
      width: 30%;
      display: inline-block;
      text-align: center;
      font-size: 22px;
      height: 38px;
      letter-spacing: 8px;
      background-color: #f2f2f2;
      cursor: pointer;
      border-radius: 4px;
      color: #2d8cf0;
    }
  }
  .bar-item-logo,
  .bar-item-btn {
    margin: 30px auto;
    border: none;
  }
  .bar-item-logo {
    height: 81px;
    padding-left: 76px;
    background: url("../assets/login-logo.png") no-repeat;
    line-height: 76px;
    color: #2d8cf0;
    font-size: 24px;
  }
  .bar-item-btn {
    text-align: center;
    color: #fff;
    background-color: #d9d9d9;
    font-size: 18px;
    padding: 10px 0;
    border-radius: 4px;
    cursor: pointer;
  }
  .bar-item-btn:hover {
    background-color: #2d8cf0;
  }
}
.login-bg {
  width: 100%;
  min-height: 765px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .top-bar {
    width: 100%;
    height: 500px;
    background-image: url("../assets/login-top.png");
  }
  .bottom-bar {
    width: 100%;
    height: 100px;
    background-color: #343436;
    font-size: 16px;
    text-align: center;
    line-height: 100px;
    color: #fff;
  }
}

</style>
<template>
  <div id="login" style="backgroundColor:#f2f2f2">
    <div class="login-bar">
      <div class="bar-item bar-item-logo">高温喷墨打印机云平台</div>
      <Form ref="formInfor" :model="formInfor" :rules="ruleformInfor">
        <FormItem prop="user" class="bar-item">
          <div>用户名</div>
          <Input type="text" size="large" v-model="formInfor.user" placeholder="请输入用户名"></Input>
        </FormItem>
        <FormItem prop="password" class="bar-item">
          <div>密码</div>
          <Input type="password" size="large" v-model="formInfor.password" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem prop="picLyanzhengma" class="bar-item">
          <div>验证码</div>
          <Input
            type="text"
            size="large"
            placeholder="请输入验证码"
            class="yanzhengma_input"
            v-model="formInfor.picLyanzhengma"
            @on-keyup.enter="postUserInfor('formInfor')"
          ></Input>
          <span @click="createCode" class="verification">{{ checkCode }}</span>
        </FormItem>
      </Form>
      <div class="bar-item bar-item-btn" @click="postUserInfor('formInfor')">登录</div>
    </div>
    <div class="login-bg" :style="{height:loginHeight+'px'}">
      <div class="top-bar"></div>
      <div class="bottom-bar">版权所有©广州瓦良格机器人科技有限公司</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    const yanzhengmaCheck = (rule, value, callback) => {
        if(!value){
            return callback(new Error("验证码不能为空！"));
        }// 模拟异步验证效果
        setTimeout(() => {
            if (value.toLocaleLowerCase() !== this.checkCode.toLocaleLowerCase()) {
              callback(new Error('验证码错误！'));
            } else {
              callback();
            }
        }, 100);
    }
    return {
      loginHeight: 0,
      checkCode: "",
      formInfor: {
        user: "",
        password: "",
        picLyanzhengma: ""
      },
      ruleformInfor: {
        user: [
          {
            required: true,
            message: "用户名不能为空！",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空！",
            trigger: "blur"
          }
        ],
        picLyanzhengma: [
          {
            validator: yanzhengmaCheck,
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
    this.createCode();
  },
  methods: {
    //提交登录信息校验
    postUserInfor(name) {
      let that = this;
      that.$refs[name].validate((valid) => {
          if (valid) {
            that.GLOBAL.axios({
              method: 'post',
              url:that.GLOBAL.HEADER +'/login/in',
              params: {
                userName: that.formInfor.user,
                passWord:  that.formInfor.password
              }
            }).then(function(res){
              if(res.data.code === 1){
                  sessionStorage.setItem('userName',that.formInfor.user)
                  
                  that.$router.push({
                    path: `/`
                  })
                }
                else{
                  that.GLOBAL.showResult(2,res.data.msg)
                }
              })
          } 
      })
    },
    //设置login-bg高度
    getHeight() {
      // 获取浏览器可视区域高度
      this.loginHeight = `${document.documentElement.clientHeight}`;
    },
    //验证码
    createCode() {
      //先清空验证码的输入
      this.code = "";
      this.checkCode = "";
      this.picLyanzhengma = "";
      //验证码的长度
      let codeLength = 4;
      //随机数
      let random = new Array(
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        0,
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      );
      for (let i = 0; i < codeLength; i++) {
        //取得随机数的索引（0~35）
        let index = Math.floor(Math.random() * 36);
        //根据索引取得随机数加到code上
        this.code += random[index];
      }
      //把code值赋给验证码
      this.checkCode = this.code;
    }
  },

  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  }
};
</script>
