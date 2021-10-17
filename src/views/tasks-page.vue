<template>
  <tasks-component></tasks-component>
</template>
<script>
import TasksComponent from "@/components/tasks-component";
import { defineComponent } from "vue";
export default defineComponent({
  name: "tasks-view",
  components: { TasksComponent },
  setup() {
    return {};
  },
});
</script>

<style scoped>
</style>
