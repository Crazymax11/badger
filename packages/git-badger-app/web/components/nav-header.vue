<template>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">Here will be a logo</el-menu-item>
        <el-menu-item index="2"><a href="/badges" target="_blank">Badges</a></el-menu-item>
        <el-menu-item index="3"><a href="/projects" target="_blank">Projects</a></el-menu-item>
        <el-menu-item index="4"><a href="/about" target="_blank">About</a></el-menu-item>
    </el-menu>
</template>
<<script>
export default {
  data() {
      return {
        activeIndex: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
        this.activeIndex = key;
      }
    }
}
</script>
