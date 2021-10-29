<template>
  <div class="toolbar">
    <button
      class="btn btn-warning"
      @click="this.$refs.createDialog.openDialog()"
    >
      Добавить элемент
    </button>
    <button
      class="btn btn-secondary"
      :disabled="!data.selected"
      @click="this.$refs.changeDialog.openDialog()"
    >
      Изменить элемент
    </button>
    <button
      class="btn btn-secondary"
      @click="this.$refs.deleteDialog.openDialog()"
      :disabled="!data.selected"
    >
      Удалить элемент
    </button>
  </div>
  <div style="height: calc(100% - 115px)">
    <gantt
      v-if="data.show"
      id="gantt"
      :editable-create="false"
      :editable="false"
      :data-source="data.gantt"
      :dependencies="data.deps"
      :columns="data.columns"
      :height="'calc(100% - 15px)'"
      v-on:change="selection($event)"
    >
      <gantt-view :type="'day'"></gantt-view>
      <gantt-view :type="'week'"></gantt-view>
      <gantt-view :type="'month'" :selected="true"></gantt-view>
    </gantt>
  </div>
  <create-item-dialog
    :onSave="
      () => {
        forceUpd();
        clearSelection();
      }
    "
    :width="800"
    :height="780"
    ref="createDialog"
  />
  <change-item-dialog
    :item="data.selected"
    :onSave="
      () => {
        forceUpd();
        clearSelection();
      }
    "
    :title="data.selected?.title"
    :width="800"
    :height="780"
    ref="changeDialog"
  />
  <delete-item-dialog
    :item="data.selected"
    :onSave="
      () => {
        forceUpd();
        clearSelection();
      }
    "
    :width="500"
    :height="280"
    ref="deleteDialog"
  />
  <await-component v-if="data.loading"></await-component>
</template>

<script>
import { Gantt, GanttView } from "@progress/kendo-gantt-vue-wrapper";
import { ProjectClient } from "@/http-clients/project-client";
import { computed, defineComponent, getCurrentInstance } from "vue";
import CreateItemDialog from "@/components/ganttItemDialogs/create-item-dialog";
import ChangeItemDialog from "@/components/ganttItemDialogs/change-item-dialog";
import DeleteItemDialog from "@/components/ganttItemDialogs/delete-item-dialog";
import AwaitComponent from "@/components/await-component";

import "@progress/kendo-ui";
export default defineComponent({
  name: "projects-gantt-view-component",
  components: {
    AwaitComponent,
    ChangeItemDialog,
    CreateItemDialog,
    DeleteItemDialog,
    gantt: Gantt,
    "gantt-view": GanttView,
  },
  setup() {
    const transformToGantt = (value) => {
      const result = [];
      let order = 0;
      let index = 1;
      value.forEach((project) => {
        index++;
        let compl = 0;
        let count = 0;
        project.stages.forEach((st) => {
          compl += st.finished();
          count++;
        });
        const newProjectItem = {
          id: index + 0,
          supID: "P" + project.id,
          title: project.name,
          orderId: order,
          expanded: true,
          percentComplete: count > 0 ? compl / count : 0,
          info: project.info,
          stages: project.stages,
          start: project.dateStart,
          end: project.dateEnd,
        };
        order++;
        result.push(newProjectItem);
        project.stages.forEach((stage) => {
          index++;
          const newStageItem = {
            id: index + 0,
            supID: "S" + stage.id,
            title: stage.name,
            parentId: newProjectItem.id,
            project: project,
            supParentId: "P" + project.id,
            percentComplete: stage.finished(),
            end: stage.dateEnd ? new Date(stage.dateEnd) : new Date(),
            start: stage.dateStart ? new Date(stage.dateStart) : new Date(),
            tasks: stage.tasks,
            orderId: order,
            expanded: true,
          };
          order++;
          result.push(newStageItem);
          stage.tasks.forEach((task) => {
            index++;
            const newTaskItem = {
              id: index + 0,
              supID: "T" + +task.id,
              orderId: order,
              title: task.name,
              resources: [{ name: task.worker.user.name }],
              percentComplete: task.finished ? 1 : 0,
              start: task.dateStart ? new Date(task.dateStart) : new Date(),
              end: task.dateEnd ? new Date(task.dateEnd) : new Date(),
              parentId: newStageItem.id,
              supParentId: "S" + stage.id,
              worker: task.worker,
              stage: stage,
              info: task.info,
              project: project,
            };
            order++;
            result.push(newTaskItem);
          });
        });
      });
      console.log(result);
      return result;
    };

    const data = { gantt: null, deps: null, show: false, loading: true };
    data.deps = [
      {
        predecessorId: 1,
        successorId: 2,
        type: 1,
      },
    ];
    data.columns = [
      {
        field: "title",
        title: "Название",
        editable: false,
        sortable: false,
        width: "150px",
      },
      {
        field: "resources",
        title: "Сотрудник",
        editable: false,
        sortable: false,
        width: "150px",
      },
    ];
    const show = computed(() => data.show);
    const projectsClient = new ProjectClient();
    const instance = getCurrentInstance();
    data.instance = instance;

    const forceUpd = () => {
      const projects = projectsClient.getAllProjects();
      data.selection = false;
      data.gantt = null;
      data.deps = null;
      data.show = false;
      data.loading = true;
      data.selection = false;
      projects.then((value) => {
        instance.proxy.$forceUpdate();
        setTimeout(() => {
          data.gantt = transformToGantt(value);
          data.show = true;
          data.loading = false;
          instance.proxy.$forceUpdate();
        }, 1000);
      });
    };
    forceUpd();
    const selected = computed(() => data.selection);
    return { data, show, selected, forceUpd };
  },
  computed: {
    hasSelected: {
      get() {
        return !this.data.selection;
      },
      set(newValue) {
        this.data.selection = !newValue;
      },
    },
  },
  data() {
    return {
      key: 0,
    };
  },
  methods: {
    selection(e) {
      const instance = e.sender;
      const preselect = instance.dataItem(instance.select());
      this.data.selected = this.data.gantt.find(
        (item) => item.id === preselect.id
      );
      this.hasSelected = false;
      this.data.selection = true;
      this.data.instance.proxy.$forceUpdate();
    },
    clearSelection() {
      this.data.selected = null;
      this.hasSelected = true;
      this.data.selection = false;
      this.data.instance.proxy.$forceUpdate();
    },
  },
});
</script>

<style scoped>
.toolbar {
  padding: 5px;
  height: 45px;
  display: flex;
  flex-direction: row;
  justify-items: start;
}
button {
  margin-right: 5px;
}
</style>
