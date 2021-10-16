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
  <k-dialog
    :width="800"
    :height="600"
    v-if="data.visibleDialog"
    @close="toggleDialog"
    :title-render="customTitleBar"
  >
    <template
      v-slot:myTemplate="{
        /* eslint-disable-next-line vue/no-unused-vars */
        props,
        /* eslint-disable-next-line vue/no-unused-vars */
        listeners,
      }"
    >
      <div
        :style="{
          fontSize: '18px',
          lineHeight: '1.3em',
        }"
      >
        <span class="k-icon k-i-edit" />{{ data.selectedRecord.name }}
      </div>
    </template>
    <p :style="{ margin: '25px', textAlign: 'center' }">
      TODO: надо сделать форму
    </p>
    <dialog-actions-bar>
      <button class="k-button" @click="toggleDialog">No</button>
      <button class="k-button" @click="toggleDialog">Yes</button>
    </dialog-actions-bar>
  </k-dialog>
</template>

<script>
import { computed, defineComponent, getCurrentInstance } from "vue";
import { TaskClient } from "@/http-clients/task-client";
import { useStore } from "vuex";
import store from "@/store/index.ts";
import { Grid, GridColumn } from "@progress/kendo-vue-grid";
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";

export default defineComponent({
  name: "tasks-component",
  components: {
    Grid: Grid,
    "k-dialog": Dialog,
    "dialog-actions-bar": DialogActionsBar,
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
            onClick: ($event) => {
              data.selectedRecord = props.dataItem;
              toggleDialog();
            },
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
    data.visibleDialog = false;

    data.selectedRecord = null;
    const toggleDialog = () => {
      data.visibleDialog = !data.visibleDialog;
      instance.proxy.$forceUpdate();
    };

    return { data, toggleDialog };
  },
  data: function () {
    return {
      customTitleBar: "myTemplate",
    };
  },
});
</script>

<style scoped>
.grid-button {
  margin: auto;
}
</style>
