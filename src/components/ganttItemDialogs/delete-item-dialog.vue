<template>
  <k-dialog
    v-if="visibleDialog"
    :title="'Пожалуйста, подтвердите'"
    @close="closeDialog"
    @open="openDialog"
  >
    <div
      :style="{ margin: '25px', textAlign: 'stretch' }"
      style="text-align: justify; font-size: 16px"
    >
      <p>Вы действительно хотитие удалить элемент?</p>
      <p>Все связанные с ним элементы, также будут удалены.</p>
    </div>
    <dialog-actions-bar style="display: flex; justify-content: space-between">
      <button class="btn btn-secondary" @click="closeDialog">Отменить</button>
      <button class="btn btn-warning" @click="removeItem">Удалить</button>
    </dialog-actions-bar>
  </k-dialog>
</template>

<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { StageClient, StageModel } from "@/http-clients/stage-client";
import { TaskClient } from "@/http-clients/task-client";
import { ProjectClient, ProjectModel } from "@/http-clients/project-client";

export default {
  name: "delete-item-dialog",
  components: {
    "k-dialog": Dialog,
    "dialog-actions-bar": DialogActionsBar,
  },
  props: ["item", "onSave"],
  data() {
    return {
      visibleDialog: false,
    };
  },
  mounted() {
    this.visibleDialog = this.visible;
  },
  methods: {
    closeDialog() {
      this.visibleDialog = false;
    },
    openDialog() {
      console.log(this.item);
      this.visibleDialog = true;
    },
    getTasksRequests(stage) {
      const result = [];
      stage.tasks.forEach((task) => {
        const taskClient = new TaskClient();
        result.push(taskClient.remove(task));
      });
      return result;
    },
    getStageRequests(project) {
      let result = [];
      project.stages.forEach((stage) => {
        const stageClient = new StageClient();
        result.push(stageClient.remove(stage));
        result = result.concat(this.getTasksRequests(stage));
      });
      return result;
    },
    getProjectRequest(project) {
      const projectClient = new ProjectClient();
      return [projectClient.remove(project)].concat(
        this.getStageRequests(project)
      );
    },
    removeItem() {
      const itemType = this.item.supID[0];
      const item = { ...this.item, id: this.item.supID.slice(1) };
      let requests = [];
      switch (itemType) {
        case "P":
          requests = this.getProjectRequest(item);
          break;
        case "S":
          requests = this.getStageRequests({ stages: [item] });
          break;
        case "T":
          requests = this.getTasksRequests({ tasks: [item] });
          break;
      }
      Promise.all(requests).finally(this.end);
    },
    end() {
      this.onSave();
      this.closeDialog();
    },
  },
};
</script>

<style scoped></style>
