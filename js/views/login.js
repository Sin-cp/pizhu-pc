



var Login = {
  template: document.querySelector('#login').outerHTML,
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      loading: false,
    }
  },
  methods: {
    handleLogin() {
      var that = this
    $.ajax({
      type: 'POST',
      // async:false,
      url: 'http://118.178.185.168:8080/commentsystem/login',
      // dataType: 'JSONP',
      data: {
        number:this.loginForm.username,
        password:this.loginForm.password
      },
      success: function(res) {
      },
      error: function(e) {
        console.log(e);
      }
    });
      if (this.loginForm.username == 'admin' && this.loginForm.password == 'admin') {
        this.$message({
          type: "success",
          message: "登录成功"
        })
        this.$router.push('/home')
      } else {
        this.$message({
          type: "error",
          message: "账号或密码错误"
        })
      }
    },

  },
  created(){
    
  }

}

