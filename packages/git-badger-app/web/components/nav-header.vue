<template>
    <el-menu :default-active="defaultActive" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="0"><img style="height: 50%;" src="/git-badger-logo.png"></el-menu-item>
        <el-menu-item index="1"><a href="/badges" target="_blank">Badges</a></el-menu-item>
        <el-menu-item index="2"><a href="/projects" target="_blank">Projects</a></el-menu-item>
        <el-menu-item index="3"><a href="/about" target="_blank">About</a></el-menu-item>
    </el-menu>
</template>
<<script>
const map = [
    '/',
    '/badges',
    '/projects',
    '/about'
]
export default {
  data() {
      return {
        activeIndex: '0'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        window.location = map[key];
      }
    },
    created() {
        this.defaultActive = String(map.indexOf(location.pathname));

    }
}
</script>
