var router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path:'/',
      component: Login 
    },
    {
      path:'/home',
      component: Home,
      redirect: '/home/class-manage',
      children: [
        {
          name: 'class-manage',
          path: 'class-manage',
          component: ClassComponent
        },
        {
          name: 'student-manage',
          path: 'student-manage',
          component: StudentComponent
        },
        {
          name: 'job-manage',
          path: 'job-manage',
          component: JobComponent
        },
        {
          name: 'mark-job',
          path: 'mark-job',
          component: MarkJobComponent
        },
        {
          name: 'info',
          path: 'info',
          component: InfoComponent
        }
      ]
    }
  ]
})