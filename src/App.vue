<template>
  <Navigation />
  <router-view />
  <Bottom />
</template>
<script>
import Navigation from "@/components/Nav";
//import "@progress/kendo-theme-default/dist/all.css";
export default { components: Navigation };
</script>
<style>
@import "~@progress/kendo-theme-material/dist/all.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.k-task-single {
  color: black;
  background-color: #ffc107 !important;
}
.k-animation-container {
  z-index: 12000;
}
.k-task-milestone {
  color: black;
  background-color: #cb8105 !important;
  border-color: #cb8105 !important;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
