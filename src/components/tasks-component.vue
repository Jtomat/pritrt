<template>
  <Grid
    v-if="data.table"
    ref="grid"
    :style="{
      height: '100%',
      margin: '20px !important',
    }"
    :data-items="data.table"
    :columns="data.tableHeaders"
  >
  </Grid>
</template>

<script>
import { defineComponent, getCurrentInstance } from "vue";
import { TaskClient } from "@/http-clients/task-client";
import { useStore } from "vuex";
import store from "@/store/index.ts";
import { Grid, GridColumn } from "@progress/kendo-vue-grid";

export default defineComponent({
  name: "tasks-component",
  components: {
    Grid: Grid,
  },
  setup() {
    const taskClient = new TaskClient();
    const user = store.getters.getUser;
    let data = {
      show: false,
    };
    const cellFunction = (h, tdElement, props, listeners) => {
      return h(
        "td",
        {
          on: {
            click: function (e) {
              listeners.custom(e);
            },
          },
        },
        h(
          "button",
          {
            onClick: ($event) => console.log(props.dataItem), // TODO: переписать на открытие
            on: {
              click: function (e) {
                listeners.custom(e);
              },
            },
            class: "btn btn-secondary grid-button",
          },
          ["Открыть"]
          // ["custom " + props.dataItem.UnitPrice]
        )
      );
    };
    const instance = getCurrentInstance();

    const tasks = taskClient.getTasksForUser(user.id);
    tasks.then((value) => {
      const props = Object.getOwnPropertyNames(value);
      let predata = [];
      props.forEach((pr) => {
        Object.getOwnPropertyNames(value[pr]).forEach((st) => {
          const proper = value[pr][st];
          if (proper["id"] !== undefined) {
            proper["dateStart"] = new Date(
              proper["dateStart"]
            ).toLocaleDateString();
            proper["dateEnd"] = new Date(
              proper["dateEnd"]
            ).toLocaleDateString();
            const row = proper;
            predata.push(row);
          }
        });
      });
      data.tableHeaders = [
        { title: "ID", field: "id" },
        { title: "Название", field: "name" },
        { title: "Дата начала", field: "dateStart" },
        { title: "Дата завершения", field: "dateEnd" },
        {
          title: "",
          field: "",
          cell: cellFunction,
        },
      ];
      data.table = predata;
      data.show = true;
      instance.proxy.$forceUpdate();
    });

    return { data };
  },
});
</script>

<style scoped>
.grid-button {
  margin: auto;
}
</style>
