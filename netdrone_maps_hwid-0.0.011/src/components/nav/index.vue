<template>
  <ul class="c-nav">
    <li class="rubberBand">
      <router-link :to="{ name: 'home' }">首页</router-link>
      <router-link :to="{ name: 'example' }">Example</router-link>
    </li>
  </ul>
</template>
<style scoped>
.rubberBand {
  font-size: 18px;
  font-weight: 600;
  padding: 10px;
}
</style>
