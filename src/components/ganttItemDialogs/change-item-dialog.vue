<template>
  <k-dialog
    v-if="visibleDialog"
    :width="700"
    :title="title"
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
      <div
        class="conta"
        style="display: flex; justify-content: space-between; width: 100%"
      >
        <dropdownlist
          :label="'Тип элемента'"
          :data-items="types"
          :disabled="true"
          style="padding-right: 20px"
          :text-field="'name'"
          :value-field="'id'"
          v-model="defValue"
          @change="
            ($event) => {
              changeType($event);
            }
          "
        />
        <k-input
          :label="'Название'"
          required
          v-model="name"
          @change="setName($event)"
        ></k-input>
      </div>
      <div style="margin-top: 10px" v-if="taskView">
        <dropdownlist
          v-if="work.projects"
          :label="'Проект'"
          style="width: 285px"
          :data-items="work.projects"
          :text-field="'name'"
          :value-field="'id'"
          :default-value="work.projects[0]"
          v-model="projectLink"
          @change="
            ($event) => {
              changeProject($event);
            }
          "
        />
        <dropdownlist
          style="float: right; width: 385px"
          v-if="work.projects"
          :label="'Этап'"
          :data-items="projectLink.stages"
          :text-field="'name'"
          :value-field="'id'"
          :default-value="projectLink.stages[0]"
          @change="changeStage($event)"
          required
        />
      </div>
      <div v-if="projectView" style="margin-top: 20px">
        <p style="font-size: 18px; margin-bottom: 5px">Информация</p>
        <editor v-model="info" style="height: 460px"></editor>
      </div>
      <div v-if="taskView" style="margin-top: 20px">
        <p style="font-size: 18px; margin-bottom: 5px">Информация</p>
        <editor v-model="info" style="height: 350px"></editor>
      </div>
      <div
        style="
          margin-top: 15px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        "
      >
        <dropdownlist
          v-if="work.projects && stageView"
          :label="'Проект'"
          style="width: 285px"
          :data-items="work.projects"
          :text-field="'name'"
          :value-field="'id'"
          :default-value="work.projects[0]"
          v-model="projectLink"
          @change="
            ($event) => {
              changeProject($event);
            }
          "
        />
        <kendo-daterangepicker
          v-if="stageView || taskView"
          :messages="{ startLabel: 'Старт', endLabel: 'Завершение' }"
          required
          :range="currentRange"
          :format="'dd.MMMM.yyyy'"
          @change="changeRange($event)"
        >
        </kendo-daterangepicker>
        <dropdownlist
          style="float: right"
          v-if="work.workers && taskView"
          :label="'Сотрудник'"
          :data-items="work.workers"
          :text-field="'fullInfo'"
          :value-field="'id'"
          v-model="worker"
          @change="changeWorker($event)"
          required
        />
      </div>
    </div>

    <dialog-actions-bar style="display: flex; justify-content: space-between">
      <button class="btn btn-secondary" @click="closeDialog">Отменить</button>
      <button
        class="btn btn-warning"
        :key="index"
        :disabled="!canSave()"
        @click="saveItem"
      >
        Сохранить
      </button>
    </dialog-actions-bar>
  </k-dialog>
</template>

<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Input } from "@progress/kendo-vue-inputs";
import { defineComponent, getCurrentInstance } from "vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { Editor } from "@progress/kendo-editor-vue-wrapper";
import { DateRangePicker } from "@progress/kendo-dateinputs-vue-wrapper";
import { WorkerClient } from "@/http-clients/worker-client";
import { ProjectClient } from "@/http-clients/project-client";
import { TaskClient } from "@/http-clients/task-client";
import { StageClient } from "@/http-clients/stage-client";
export default defineComponent({
  name: "change-item-dialog",
  components: {
    "k-dialog": Dialog,
    "dialog-actions-bar": DialogActionsBar,
    "k-input": Input,
    dropdownlist: DropDownList,
    editor: Editor,
    "kendo-daterangepicker": DateRangePicker,
  },
  props: ["item", "onSave", "title"],
  setup() {
    let index = 0;
    const instance = getCurrentInstance();
    let work = {};
    const forceUpd = () => {
      const workerClient = new WorkerClient();
      workerClient.getAllWorkers().then((value) => {
        work.workers = value;
        instance.proxy.$forceUpdate();
      });
      const projectClient = new ProjectClient();
      projectClient.getAllProjects().then((value) => {
        work.projects = value;
        instance.proxy.$forceUpdate();
      });
    };
    forceUpd();
    return {
      currentRange: {},
      forceUpd,
      work,
      instance,
      index,
    };
  },
  data() {
    const toRet = {
      types: [
        { id: 0, name: "Проект" },
        { id: 1, name: "Этап" },
        { id: 2, name: "Задача" },
      ],
      projectLink: { stages: [] },
      stageLink: null,
      workers: null,
      visibleDialog: false,
      projectView: true,
      stageView: false,
      taskView: false,
      id: null,
      name: null,
      info: null,
      datesRange: null,
      worker: null,
      defValue: { id: 0 },
      selectedType: 0,
    };

    return toRet;
  },
  methods: {
    canSave() {
      let result = false;
      switch (this.selectedType) {
        case 0:
          result = this.name !== "";
          break;
        case 1:
          result =
            this.name !== "" &&
            this.currentRange.start &&
            this.projectLink?.id &&
            this.currentRange.end;
          break;
        case 2:
          result =
            this.name !== "" &&
            this.currentRange.start &&
            this.stageLink &&
            this.currentRange.end;
          break;
      }
      return result;
    },
    changeRange(e) {
      const range = e?.sender.range();
      this.currentRange = range;
    },
    changeWorker(e) {
      this.worker = e.value;
    },
    setName(e) {
      this.name = e.value;
    },
    setItem(item) {
      this.id = item.supID.slice(1);
      this.name = item.title;
      this.info = item.info;
      this.currentRange.start = item.start;
      this.currentRange.end = item.end;
      this.worker = this.work.workers.find(
        (worker) => worker.id === item.worker?.id
      );
      this.stageLink = item.stage;
      this.projectLink = item.project;
    },
    closeDialog() {
      this.visibleDialog = false;
      this.instance.proxy.$forceUpdate();
    },
    changeProject(e) {
      this.projectLink = e.value;
      this.changeStage({ value: this.projectLink?.stages[0] });
    },
    changeStage(e) {
      this.stageLink = e.value;
    },
    clearData() {
      this.info = "";
      this.changeProject({ value: this.work.projects[0] });
      this.stageLink =
        this.projectLink && this.projectLink.stages
          ? this.projectLink.stages[0]
          : null;
    },
    addKey() {
      this.index += 1;
    },
    openDialog() {
      const letter = this.item?.supID[0];
      this.changeType({
        value: { id: letter === "P" ? 0 : letter === "S" ? 1 : 2 },
      });
      this.changeProject({ value: this.work?.projects[0] });
      this.changeWorker({ value: this.work.workers[0] });
      this.setItem(this.item);

      this.forceUpd();
      this.visibleDialog = true;
      this.instance.proxy.$forceUpdate();
    },
    saveItem() {
      let request = null;
      const projectClient = new ProjectClient();
      const taskClient = new TaskClient();
      const stageClient = new StageClient();
      let dataItem = null;
      switch (this.selectedType) {
        case 0:
          dataItem = {
            id: this.id,
            name: this.name,
            info: this.info,
            fullInfo: "",
          };
          request = projectClient.update(dataItem);
          break;
        case 1:
          dataItem = {
            id: this.id,
            name: this.name,
            projectId: this.projectLink.id,
            dateStart: this.currentRange.start,
            dateEnd: this.currentRange.end,
          };
          request = stageClient.update(dataItem);
          break;
        case 2:
          dataItem = {
            id: this.id,
            name: this.name,
            info: this.info,
            fullInfo: "",
            stageId: this.stageLink.id,
            dateStart: this.currentRange.start,
            dateEnd: this.currentRange.end,
            worker: this.worker,
          };
          request = taskClient.update(dataItem);
          break;
      }

      request.finally(() => {
        this.onSave();
        this.closeDialog();
      });
    },
    changeType(e) {
      this.defValue = this.types.find((item) => item.id === e.value.id);
      this.selectedType = e.value.id;
      switch (this.selectedType) {
        case 0:
          this.stageView = false;
          this.taskView = false;
          this.projectView = true;
          break;
        case 1:
          this.taskView = false;
          this.projectView = false;
          this.stageView = true;
          break;
        case 2:
          this.projectView = false;
          this.stageView = false;
          this.taskView = true;
          break;
      }
      this.index++;
      this.instance.proxy.$forceUpdate();
    },
  },
});
</script>

<style scoped>
.k-floating-label-container {
  width: 100% !important;
}
.conta .k-textbox-container:nth-child(2) {
  width: calc(100% - 10px);
}
</style>
