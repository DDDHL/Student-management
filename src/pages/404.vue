<template>
  <div class="bg-purple">
    <div class="central-body">
      <img class="image-404" src="../assets/images/404/404.svg" width="300px" />
      <a href="/" class="btn-go-home" target="_self">返回首页</a>
    </div>
    <div class="objects">
      <img
        class="object_rocket"
        src="../assets/images/404/rocket.svg"
        width="40px"
      />
      <div class="earth-moon">
        <img
          class="object_earth"
          src="../assets/images/404/earth.svg"
          width="100px"
        />
        <img
          class="object_moon"
          src="../assets/images/404/moon.svg"
          width="80px"
        />
      </div>
      <div class="box_astronaut">
        <img
          class="object_astronaut"
          src="../assets/images/404/astronaut.svg"
          width="140px"
        />
      </div>
    </div>
    <div class="glowing_stars">
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
}
</script>

<style src="../assets/css/404style.css" scoped>
</style>