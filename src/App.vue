<template>
  <div id="app">
    <!--登录组件-->
    <router-view></router-view>
  </div>
</template>

<script>
import {Login} from './api'
export default {
  name: 'App',
  data(){
    return{
      data:''
    }
  },
  methods: {
    async getData(){
      try{
        let a  = await Login()
        console.log(a);
        
      }catch{
        console.log('失败')
      }
      
    }
  },
}
</script>