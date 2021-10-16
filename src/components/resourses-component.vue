<template>
  <Card
    style="
      width: 800px;
      height: 75px;
      margin: 5px;
      margin-left: 20px;
      padding: 15px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    "
  >
    <button style="width: 200px" class="btn btn-warning">Добавить роль</button>
    <button style="width: 200px" class="btn btn-secondary">Изменть роль</button>
    <button style="width: 200px" class="btn btn-secondary">Удалить роль</button>
  </Card>
  <div
    v-if="data.workers"
    style="
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      height: calc(100% - 85px);
      overflow: auto;
    "
  >
    <Card
      v-for="item in data.workers"
      style="
        margin: 20px;
        width: calc(50% - 40px);
        height: 80px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        justify-items: center;
        padding: 20px;
      "
      :key="item.user"
    >
      <div style="justify-content: center">
        <h4>{{ item.user.name }}</h4>
      </div>
      <dropdownlist
        style="margin-top: -20px"
        :label="'Роль'"
        :data-items="data.roles"
        :text-field="'name'"
        :value-field="'id'"
        :default-value="item.role"
        @change="data.change($event, item)"
      >
      </dropdownlist>
      <button
        class="btn btn-warning"
        :disabled="item.role.id === item.startRole"
      >
        Сохранить
      </button>
    </Card>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance } from "vue";
import { WorkerClient } from "@/http-clients/worker-client";
import { FloatingLabel } from "@progress/kendo-vue-labels";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { Card, CardHeader } from "@progress/kendo-vue-layout";

export default defineComponent({
  name: "resourses-component",
  components: {
    dropdownlist: DropDownList,
    Card: Card,
  },
  setup() {
    const workerClient = new WorkerClient();
    const workers = workerClient.getAllWorkers();
    const roles = workerClient.getAllRoles();
    const data = {};

    const instance = getCurrentInstance();
    Promise.all([workers, roles]).then((value) => {
      data.workers = value[0];
      data.workers.forEach((worker) => {
        worker.startRole = worker.role.id;
      });
      console.log(workers);
      data.roles = value[1];

      instance.proxy.$forceUpdate();
    });
    data.forceUpdate = instance.proxy.$forceUpdate;
    data.change = (e, item) => {
      item.role = e.value;
      instance.proxy.$forceUpdate();
    };
    return { data };
  },
});
</script>

<style scoped></style>
