<template>
  <Grid
    v-if="data.table"
    ref="grid"
    :style="{
      height: '100%',
      margin: '20px !important',
    }"
    :cell-render="'myCellTemplate'"
    :data-items="data.table"
    :columns="data.tableHeaders"
  >
    <template
      v-slot:myCellTemplate="{
        props,
        /* eslint-disable-next-line vue/no-unused-vars */
        listeners,
      }"
    >
      <td
        :class="props.className + (props.dataItem.finished ? ' finished' : '')"
      >
        <b> {{ getNestedValue(props.field, props.dataItem) }}</b>
      </td>
    </template>
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
    <div
      class="disabledField"
      :style="{
        height: 'calc(100% - 30px)',
        margin: '25px',
        marginBottom: '5px',
        textAlign: 'left',
        overflow: 'hidden',
      }"
    >
      <klabel> Название: </klabel>
      <kinput
        v-model="data.selectedRecord.name"
        :disabled="true"
        style="width: calc(100% - 120px); margin-left: 10px"
      />
      <div
        style="
          width: 100%;
          height: calc(78%);
          overflow-y: auto;
          margin-top: 10px;
        "
        v-html="data.selectedRecord.info"
      ></div>
      <div style="float: right; margin-right: -100px; font-weight: bold">
        <klabel> Закрыть до: </klabel>
        <kinput
          v-model="data.selectedRecord.dateEnd"
          :disabled="true"
          style="margin-left: 10px"
        />
      </div>
    </div>
    <dialog-actions-bar
      style="
        display: flex;
        justify-content: space-between;
        flex-direction: row-reverse;
      "
    >
      <button
        class="btn btn-warning"
        :disabled="data.selectedRecord.finished"
        @click="closeTask"
      >
        Завершить
      </button>
    </dialog-actions-bar>
  </k-dialog>
  <await-component v-if="!data.table"></await-component>
</template>

<script>
import { computed, defineComponent, getCurrentInstance } from "vue";
import { TaskClient } from "@/http-clients/task-client";
import { useStore } from "vuex";
import store from "@/store/index.ts";
import { Grid, GridColumn } from "@progress/kendo-vue-grid";
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Label } from "@progress/kendo-vue-labels";
import { Input } from "@progress/kendo-vue-inputs";
import AwaitComponent from "@/components/await-component";

export default defineComponent({
  name: "tasks-component",
  components: {
    Grid: Grid,
    "k-dialog": Dialog,
    "dialog-actions-bar": DialogActionsBar,
    klabel: Label,
    kinput: Input,
    AwaitComponent,
  },
  setup() {
    const taskClient = new TaskClient();
    const user = store.getters.getUser;
    let data = {
      show: false,
      loading: true,
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
          style: props.dataItem.finished ? "background-color: #e2e3e2" : "",
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
        )
      );
    };
    const instance = getCurrentInstance();

    const forceUpd = () => {
      const tasks = taskClient.getTasksForUser(user.id);
      tasks.then((value) => {
        const props = Object.getOwnPropertyNames(value);
        data.table = null;
        instance.proxy.$forceUpdate();
        let predata = [];
        props.forEach((pr) => {
          const proper = value[pr];
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
        setTimeout(() => {
          data.table = predata;
          data.show = true;
          data.loading = false;
          instance.proxy.$forceUpdate();
        }, 1000);
      });
      data.visibleDialog = false;

      data.selectedRecord = null;
    };
    const toggleDialog = () => {
      data.visibleDialog = !data.visibleDialog;
      instance.proxy.$forceUpdate();
    };
    forceUpd();
    return { data, toggleDialog, forceUpd };
  },
  data: function () {
    return {
      customTitleBar: "myTemplate",
    };
  },
  methods: {
    closeTask() {
      const taskClient = new TaskClient();
      taskClient.closeTask(this.data.selectedRecord).finally(() => {
        this.data.visibleDialog = !this.data.visibleDialog;
        this.data.table = null;
        this.$forceUpdate();
        this.forceUpd();
      });
    },
    getNestedValue(fieldName, dataItem) {
      const path = fieldName.split(".");
      let data = dataItem;
      path.forEach((p) => {
        data = data ? data[p] : undefined;
      });
      return data;
    },
  },
});
</script>

<style scoped>
.grid-button {
  margin: auto;
}
.disabledField,
.k-textbox[disabled] {
  color: black !important;
  filter: unset !important;
  opacity: 1 !important;
}
.finished {
  background-color: #e2e3e2;
}
</style>
