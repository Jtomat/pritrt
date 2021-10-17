<template>
  <div class="toolbar">
    <button class="btn btn-warning">Добавить элемент</button>
    <button class="btn btn-secondary" :disabled="!selected">
      Изменить элемент
    </button>
    <button class="btn btn-secondary" :disabled="!selected">
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
  <create-item-dialog></create-item-dialog>
</template>

<script>
import { Gantt, GanttView } from "@progress/kendo-gantt-vue-wrapper";
import { ProjectClient } from "@/http-clients/project-client";
import { computed, defineComponent, getCurrentInstance } from "vue";
import kendo from "@progress/kendo-ui";
import CreateItemDialog from "@/components/create-item-dialog";

export default defineComponent({
  name: "projects-gantt-view-component",
  components: {
    CreateItemDialog,
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
        let minDate = new Date();
        minDate.setFullYear(2100);
        project.stages.forEach((stage) => {
          if (stage.dateStart < minDate) minDate = stage.dateStart;
        });
        let maxDate = new Date();
        maxDate.setFullYear(1900);
        project.stages.forEach((stage) => {
          if (stage.dateEnd > maxDate) maxDate = stage.dateEnd;
        });
        console.log(minDate.toLocaleDateString(), maxDate.toLocaleDateString());
        const newProjectItem = {
          id: index + 0,
          supID: "P" + project.id,
          title: project.name,
          orderId: order,
          expanded: true,
          start: minDate ? minDate : new Date(),
          end: maxDate ? maxDate : new Date(),
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
            supParentId: "P" + project.id,
            end: stage.dateEnd ? new Date(stage.dateEnd) : new Date(),
            start: stage.dateStart ? new Date(stage.dateStart) : new Date(),
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

              start: task.dateStart ? new Date(task.dateStart) : new Date(),
              end: task.dateEnd ? new Date(task.dateEnd) : new Date(),
              parentId: newStageItem.id,
              supParentId: "S" + stage.id,
            };
            order++;
            result.push(newTaskItem);
          });
        });
      });
      console.log(result);
      return result;
    };

    const data = { gantt: null, deps: null, show: false };
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
    const projects = projectsClient.getAllProjects();
    const instance = getCurrentInstance();
    data.instance = instance;
    data.selection = false;
    projects.then((value) => {
      data.gantt = transformToGantt(value);
      data.show = true;
      instance.proxy.$forceUpdate();
    });
    data.selection = false;
    const selected = computed(() => data.selection);
    return { data, show, selected };
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
  methods: {
    selection(e) {
      const instance = e.sender;
      this.data.selected = instance.dataItem(instance.select());
      this.hasSelected = false;
      this.data.selection = true;
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
