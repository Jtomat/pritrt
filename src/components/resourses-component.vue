<template>
  <div>
    <Card>
      <card-header></card-header>
    </Card>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Card, CardHeader } from "@progress/kendo-vue-layout";
import { WorkerClient } from "@/http-clients/worker-client";
import * as _ from "lodash";

export default defineComponent({
  name: "resourses-component",
  components: {
    Card: Card,
    CardHeader: CardHeader,
  },
  setup() {
    const workerClient = new WorkerClient();
    const workers = workerClient.getAllWorkers();
    const roles = workerClient.getAllRoles();
    Promise.all([workers, roles]).then((value) => {
      console.log(value);
    });

    return {};
  },
});
</script>

<style scoped></style>
