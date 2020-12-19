


var ClassComponent = {
  template: document.querySelector('#class_manage').outerHTML,
  data() {
    return {
      addClassModel: false,
      ClassInfoModel: false,
      className: '',
	  classMessage:[],
      form: {
        id: '',
        class: '',
        num: 0,
        kouhao: '',
        mubiao: '',
      },
      tableData: [{
        id: Math.random() + '',
        class: '一班',
        num: 15,
        kouhao: '口号123',
        mubiao: '目标123',
      }, {
        id: Math.random() + '',
        class: '二班',
        num: 20,
        kouhao: '口号123',
        mubiao: '目标123',
      }, {
        id: Math.random() + '',
        class: '三班',
        num: 22,
        kouhao: '口号123',
        mubiao: '目标123',
      }, {
        id: Math.random() + '',
        class: '四班',
        num: 19,
        kouhao: '口号123',
        mubiao: '目标123',

      }]
    }
  },
  methods: {
    StuInfo() {
      this.$router.push('/home/student-manage')
    },
    closeAdd() {
      this.$refs.form.resetFields()
      this.addClassModel = false
    },
    showAdd() {
      this.addClassModel = true
    },
    onSubmit() {
      this.form.id = Math.random() + ''
      // this.tableData.push(JSON.parse(JSON.stringify(this.form)))
      var that = this
        // $.ajax({          这里应该写的是添加班级，但是由于我们分工后没有进行交流，
        //   type: 'get',
        //   // async:false,    
        //   url: '添加班级接口',
        //   // dataType: 'JSONP',
        //   data: {},
        //   success: function(res) {
        //     that.tableData = res.data.items;
        //     console.log('return', that.tableData)
        //   },
        //   error: function(e) {
        //     console.log(e);
        //   }
        // });
      this.$message({
        type: 'success',
        message: '班级创建成功!'
      });
      this.closeAdd()
    },
    handleClick(row) {
      this.$set(this, 'form', row)
      this.ClassInfoModel = true
    },
    handleDelete(row) {
      this.$confirm('您确定要删除' + row.class + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.tableData = this.tableData.filter(item => item.id !== row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  created(){
	  var that = this
	$.ajax({
		type: 'get',
		// async:false,
		url: 'http://118.178.185.168:8080/commentsystem/student/getall',
		// dataType: 'JSONP',
		data: {
		},
		success: function(res) {
			
			that.classMessage = res.data.items;
			console.log('return', that.classMessage)
		},
		error: function(e) {
			console.log(e);
		}
	});
  }
}

