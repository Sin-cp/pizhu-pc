
var Home = {
  template: document.querySelector("#home").innerHTML,
  data() {
    return {
      activeIndex: 'class-manage',
      loading: false,
    }
  },
  created(){
    this.activeIndex = this.$route.name
  },
  methods: {
    handleSelect(...args) {
      console.log(args)
    }

  }

}

