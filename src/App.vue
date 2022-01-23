<template>
  <div>
    <h3>{{data}}</h3>
    <button @click="getData">点我发送请求</button>
  </div>
</template>

<script>
import {test} from './api'
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
        let a  = await test()
        console.log(a);
        
      }catch{
        console.log('失败')
      }
      
    }
  },
}
</script>