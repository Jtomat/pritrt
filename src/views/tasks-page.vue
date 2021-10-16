<template>
  <div>
    <h1>ЗАДАЧИ</h1>
    <tasks-component /></div>
</template>
<script>
import TasksComponent from "@/components/tasks-component";
export default {
  name: "tasks-view",
  components: { TasksComponent },
};
</script>

<style scoped></style>
