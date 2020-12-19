var StudentComponent = {
	template: document.querySelector('#student_manage').outerHTML,
	data() {
		return {
			addClassModel: false,
			form: {},  // 表单数据 使用v-modal进行双向绑定
			tableData: []
		}
	},
	methods: {
		closeAdd() {
			this.$refs.form.resetFields()
			this.addClassModel = false
		},
		showAdd() {
			this.addClassModel = true
		},
		onSubmit() {
			var that = this
			this.form.id = this.getID()
			console.log('aa', this.form)
			// this.tableData.push(JSON.parse(JSON.stringify(this.form)))
			var clas =  parseInt(this.form.clas)   // 添加失败，我怀疑是数据类型的问题，后台clas字段写的是int类型。但是这里我使用
			console.log(clas)					 // parseInt想将我获取的string类型转换成int 并且打印了他的数据类型发现是number  
												// 
			$.ajax({
				type: 'POST',
				// async:false,
				url: 'http://118.178.185.168:8080/commentsystem/student/add',
				// dataType: 'JSONP',
				data: {   //使用v-modal进行双向绑定 拿到想要的数据
					clas: clas,
					name: this.form.name,  
					password: this.form.password,
					stuNumber: this.form.sex
				},
				success: function(res) {
					this.$message({
						type: 'success',
						message: '学生添加成功!'
					});
				},
				error: function(e) {
					console.log(e);
				}
			});

			this.closeAdd()
		},
		handleDelete(row) {

			this.$confirm('您确定要将 “' + row.name + '” 学生移除本班 ?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				$.ajax({
					type: 'DELETE',
					// async:false,
					url: 'http://118.178.185.168:8080/commentsystem/student/delete/{id}',
					// dataType: 'JSONP',
					data: {
						id:row.id
					},
					success: function(res) {
						this.$message({
							type: 'success',
							message: '移除成功!'
						});
					},
					error: function(e) {
						console.log(e);
					}
				});
				this.tableData = this.tableData.filter(item => item.id !== row.id)
			}).catch(() => {

			});
		}

	},
	created() {   //  vue的created方法，页面加载前先执行这个方法  使用ajax进行请求  type是请求类型  url请求路径  data请求参数  最后将数据存储在tableData中  渲染到页面上 
		var that = this
		$.ajax({
			type: 'get',
			// async:false,
			url: 'http://118.178.185.168:8080/commentsystem/student/getall',
			// dataType: 'JSONP',
			data: {},
			success: function(res) {
				that.tableData = res.data.items;
				console.log('return', that.tableData)
			},
			error: function(e) {
				console.log(e);
			}
		});
	}

}
