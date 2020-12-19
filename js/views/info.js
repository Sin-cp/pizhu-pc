var InfoComponent = {
  template: document.querySelector("#InfoManage").outerHTML,
  data() {
    return {
      dataForm:{
        nickName: '超级管理员',
        phone: '173567777777',
        email: '123456@qq.com'
      },
      u_dataForm: {}
    }
  },
  created() {
    this.u_dataForm = JSON.parse(JSON.stringify(this.dataForm))
  },
  methods: {
    update() {
      this.dataForm = JSON.parse(JSON.stringify(this.u_dataForm))
    }
  }
} 