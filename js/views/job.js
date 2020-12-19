


var JobComponent = {
  template: document.querySelector("#job_manage").outerHTML,
  data() {
    return {
      InfoModel: false,
      PublishModel: false,
      UpdateModel: false,
      update_form: {},
      publishType: 'self',
      publish_form: {},
      form: {},
      fileList: [],
      tableData: []
    }
  },

  created() {
    var that = this
    $.ajax({
      type: 'get',
      // async:false,
      url: 'http://118.178.185.168:8080/commentsystem/article/getall',
      // dataType: 'JSONP',
      data: {
      },
      success: function (res) {
        that.tableData = res.data.items;
        console.log('retuaaarn', that.tableData)
      },
      error: function (e) {
        console.log(e);
      }
    });
  },
  methods: {
    Update() {
      if (this.fileList.length > 0)
        this.update_form.fileList = this.fileList
      var data = JSON.parse(JSON.stringify(this.update_form))
      this.$message({
        type: 'success',
        message: '修改成功'
      })
      this.UpdateModel = false
    },
    ShowUpdateModel() {
      this.UpdateModel = true

      this.update_form = JSON.parse(JSON.stringify(this.form))
      console.log(this.update_form)
      this.fileList = this.update_form.fileList || []


    },
    UploadChange(file) {
      this.fileList.push({ name: file.name, url: file.url })
    },
    Publish() {
      var that = this
      $.ajax({
        type: 'POST',
        // async:false,
        url: 'http://118.178.185.168:8080/commentsystem/article/add',
        // dataType: 'JSONP',
        data: {   //使用v-modal进行双向绑定 拿到想要的数据 
          endTime: this.publish_form.date,
          filePath: this.publish_form.desc,
          title: this.publish_form.name,
          uploader: this.publish_form.class
        },
        success: function (res) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
        },
        error: function (e) {
          console.log(e);
        }
      });
      this.PublishModel = false
      this.publish_form.fileList = this.fileList
      // this.tableData.push(JSON.parse(JSON.stringify(this.publish_form)))
    },
    showAdd(type) {
      this.publishType = type
      this.form = {}
      this.fileList = []
      this.publish_form = {}
      this.PublishModel = true
      // if(type == 'self') {

      // } else if(type == 'affix') {

      // }
    },
    handleClick(row) {

      this.form = row
      console.log('aaa', this.form)
      this.InfoModel = true
    },
    handleDelete(row) {
      var that = this
      this.$confirm('您确定要将作业 "' + row.class + '" 删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $.ajax({
          type: 'DELETE',
          // async:false,
          url: 'http://118.178.185.168:8080/commentsystem/article/delete/{id}',
          // dataType: 'JSONP',
          data: {   //使用v-modal进行双向绑定 拿到想要的数据 
            id:row.id
          },
          success: function (res) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
          },
          error: function (e) {
            console.log(e);
          }
        });
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        // this.tableData = this.tableData.filter(item => item.id !== row.id)
      }).catch(() => {

      });
    },
  }

}



var MarkJobComponent = {
  template: document.querySelector("#mark_job").outerHTML,
  data() {
    return {
      DetailModel: false,
      tableData: [],
      form: {

      },
      data: [{
        annoId: "6279502074796511",
        annoTateContent: "123123",
        createDate: "2020-08-22 15:37:32",
        endAdd: 30,
        insId: 1598081852273,
        selectText: " 度想想周末去上课时不用跟别人",
        startAdd: 16,
        userImage: "images/no-userphoto.png",
        userName: "admin",
      }],
    }
  },
  created() {
    var that = this
    $.ajax({
      type: 'get',
      // async:false,
      url: 'http://118.178.185.168:8080/commentsystem/article/getall',
      // dataType: 'JSONP',
      data: {
      },
      success: function (res) {
        that.tableData = res.data.items;
        console.log('return', that.tableData)
      },
      error: function (e) {
        console.log(e);
      }
    });
  },
  methods: {
    close(el, id) {
      console.log(el, id)
    },
    showAdd() { },
    comment() {

    },
    // 格式化数字为两位数
    getNow: function (s) {
      return s < 10 ? '0' + s : s;
    },
    // 获取当前时间
    getNowDate() {
      var myDate = new Date();
      // 获取当前年
      var year = myDate.getFullYear();
      // 获取当前月
      var month = myDate.getMonth() + 1;
      // 获取当前日
      var date = myDate.getDate();
      var h = myDate.getHours(); // 获取当前小时数(0-23)
      var m = myDate.getMinutes(); // 获取当前分钟数(0-59)
      var s = myDate.getSeconds();
      return year + '-' + this.getNow(month) + "-" + this.getNow(date) + " " + this.getNow(h) + ':' + this.getNow(m) + ":" + this.getNow(s);

    },
    getData() {
      this.data = this.annotate.getAnnotateData()
    },
    handleClick(row) {
      console.log(row)
      this.form = {
        name: row.title,
        desc: row.filePath,
        time: row.endTime
      }
      this.DetailModel = true;
      this.$nextTick(() => {


        this.annotate = $("#container").skyeyeAnnotate({
          data: this.data,
        })

        console.log(this.annotate);
        console.log(this.annotate.getAnnotateData());


      })
    },


  },

}


