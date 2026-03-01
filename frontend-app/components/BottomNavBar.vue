<template>
  <u-tabbar :list="tabbarList" @change="onTabbarChange"></u-tabbar>
</template>

<script setup>
import { ref } from 'vue'

// 底部导航栏数据
const tabbarList = ref([
  {
    icon: 'user-filled',
    text: '我的',
    pagePath: '/pages/mine/mine'
  }
])

// 切换导航栏事件
const onTabbarChange = (index) => {
  uni.switchTab({
    url: tabbarList.value[index].pagePath
  })
}
</script>