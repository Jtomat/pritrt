<template>
  <k-dialog
    v-if="data.visibleDialog"
    :width="700"
    :title="'Новый элемент'"
    @close="closeDialog"
    @open="openDialog"
  >
    <div
      :style="{
        margin: '25px',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
      }"
    >
      <div style="display: flex; justify-content: space-between">
        <dropdownlist
          :label="'Тип элемента'"
          :data-items="data.types"
          style="padding-right: 20px"
          :text-field="'name'"
          :value-field="'id'"
          :default-value="data.types[0]"
          @change="
            ($event) => {
              changeType($event);
            }
          "
        />
        <k-input
          style="width: calc(100% - 10px)"
          :label="'Название'"
          required
          @change="setName($event)"
        ></k-input>
      </div>
      <div v-if="data.projectView || data.taskView" style="margin-top: 20px">
        <p style="font-size: 18px; margin-bottom: 5px">Информация</p>
        <editor style="height: 350px"></editor>
      </div>
      <div
        style="
          margin-top: 15px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        "
      >
        <kendo-daterangepicker
          v-if="data.stageView || data.taskView"
          :messages="{ startLabel: 'Старт', endLabel: 'Завершение' }"
          :range="currentRange"
          required
          :format="'dd.MMMM.yyyy'"
        >
        </kendo-daterangepicker>
        <dropdownlist
          style="float: right"
          v-if="data.workers && data.taskView"
          :label="'Сотрудник'"
          :data-items="data.workers"
          :text-field="'fullInfo'"
          :value-field="'id'"
          :default-value="data.workers[0]"
          required
        />
      </div>
    </div>

    <dialog-actions-bar style="display: flex; justify-content: space-between">
      <button class="btn btn-secondary" @click="closeDialog">Отменить</button>
      <button class="btn btn-warning" @click="saveItem">Сохранить</button>
    </dialog-actions-bar>
  </k-dialog>
</template>

<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Input } from "@progress/kendo-vue-inputs";
import { computed, defineComponent, getCurrentInstance } from "vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { Editor } from "@progress/kendo-editor-vue-wrapper";
import { DateRangePicker } from "@progress/kendo-dateinputs-vue-wrapper";
import { WorkerClient } from "@/http-clients/worker-client";

export default defineComponent({
  name: "create-item-dialog",
  components: {
    "k-dialog": Dialog,
    "dialog-actions-bar": DialogActionsBar,
    "k-input": Input,
    dropdownlist: DropDownList,
    editor: Editor,
    "kendo-daterangepicker": DateRangePicker,
  },
  props: ["role", "onSave"],
  setup() {
    let index = 0;
    const instance = getCurrentInstance();
    let data = {
      projectView: true,
      stageView: false,
      taskView: false,
      types: [
        { id: 0, name: "Проект" },
        { id: 1, name: "Этап" },
        { id: 2, name: "Задача" },
      ],
      selectedType: 0,
      workers: null,
      visibleDialog: false,
      instance,
    };
    const workerClient = new WorkerClient();
    workerClient.getAllWorkers().then((value) => {
      data.workers = value;
      instance.proxy.$forceUpdate();
    });
    return {
      id: null,
      name: "",
      info: "",
      currentRange: null,
      selectedType: 0,
      data,
      index,
      taskView: false,
      stageView: false,
      projectView: true,
    };
  },
  methods: {
    setName(e) {
      this.name = e.value;
    },
    closeDialog() {
      this.data.visibleDialog = false;
      this.data.instance.proxy.$forceUpdate();
    },
    openDialog() {
      /*
      this.data = {
        role: this.role() ? this.role() : { id: null, name: "", rate: 0 },
      };*/
      this.name = "";
      this.id = null;
      this.info = "";
      this.currentRange = null;
      this.changeType({ value: { id: 0 } });
      this.data.visibleDialog = true;
      this.data.instance.proxy.$forceUpdate();
    },
    saveItem() {
      /*
      const roleClient = new WorkerRoleClient();
      let request = null;
      if (this.role() && this.role().id) {
        request = roleClient.updateRole(this.data.role);
      } else {
        request = roleClient.addRole(this.data.role);
      }*/

      this.closeDialog();
      // request.finally(() => this.onSave());
    },
    changeType(e) {
      this.data.selectedType = e.value.id;
      switch (this.data.selectedType) {
        case 0:
          this.data.stageView = false;
          this.data.taskView = false;
          this.data.projectView = true;
          break;
        case 1:
          this.data.taskView = false;
          this.data.rojectView = false;
          this.data.stageView = true;
          break;
        case 2: //dsa
          this.data.projectView = false;
          this.data.stageView = false;
          this.data.taskViewV = true;
          break;
      }
      this.index++;
      this.data.instance.proxy.$forceUpdate();
    },
  },
});
</script>

<style scoped>
.k-floating-label-container {
  width: 100% !important;
}
</style>
