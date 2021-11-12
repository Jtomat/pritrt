<template>
  <Card
    v-if="data.workers && data.roles"
    style="
      width: calc(100% - 40px);
      height: 75px;
      margin: 5px;
      margin-left: 20px;
      padding: 15px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    "
  >
    <button
      style="width: 200px"
      class="btn btn-warning"
      @click="
        () => {
          add();
          this.$refs.changeDialog.openDialog();
        }
      "
    >
      Добавить роль
    </button>
    <div style="display: flex; justify-content: space-around">
      <dropdownlist
        style="height: 55px; margin-top: -15px; margin-right: 20px"
        :label="'Выбранная роль'"
        :data-items="data.roles"
        :text-field="'name'"
        :value-field="'id'"
        :default-value="data.roles[0]"
        @change="changeSelection($event)"
      >
      </dropdownlist>
      <button
        style="width: 200px; margin-right: 20px"
        class="btn btn-secondary"
        @click="
          () => {
            edit();
            this.$refs.changeDialog.openDialog();
          }
        "
      >
        Изменить роль
      </button>
      <button
        style="width: 200px; margin-right: 20px"
        class="btn btn-secondary"
        @click="
          () => {
            remove();
          }
        "
      >
        Удалить роль
      </button>
    </div>
  </Card>
  <div
    v-if="data.workers"
    style="
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      max-height: calc(100% - 85px);
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
        @click="saveRes(item, item.role)"
      >
        Сохранить
      </button>
    </Card>
  </div>
  <await-component v-if="data.workers == null"></await-component>
  <add-edit-role-dialog-component
    v-model:role="updSelect"
    ref="changeDialog"
    :onSave="forceUpd"
  ></add-edit-role-dialog-component>
</template>

<script>
import { computed, defineComponent, getCurrentInstance } from "vue";
import { WorkerClient } from "@/http-clients/worker-client";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { Card } from "@progress/kendo-vue-layout";
import AwaitComponent from "@/components/await-component";
import AddEditRoleDialogComponent from "@/components/roleItemDialogs/add-edit-role-dialog-component";
import { WorkerRoleClient } from "@/http-clients/worker-role-client";

export default defineComponent({
  name: "resourses-component",
  components: {
    AddEditRoleDialogComponent,
    AwaitComponent,
    dropdownlist: DropDownList,
    Card: Card,
  },
  setup() {
    const workerClient = new WorkerClient();
    let data = {};

    const instance = getCurrentInstance();
    const forceUpd = () => {
      data.selection = null;
      data.usedSelection = null;
      data.workers = null;
      const workers = workerClient.getAllWorkers();
      const roles = workerClient.getAllRoles();
      const res = Promise.all([workers, roles]);
      res.then((value) => {
        instance.proxy.$forceUpdate();
        setTimeout(() => {
          data.workers = value[0];
          data.workers.forEach((worker) => {
            worker.startRole = worker.role.id;
          });
          data.roles = value[1];
          data.selection = data.roles[0];
          instance.proxy.$forceUpdate();
        }, 1000); // слишко быстро загружал, из-за чего не проходило обновление
      });
    };
    forceUpd();
    data.forceUpdate = instance.proxy.$forceUpdate;
    data.change = (e, item) => {
      item.role = e.value;
      instance.proxy.$forceUpdate();
    };
    let showDialog = false;
    const changeSelection = (item) => {
      data.selection = item.value;
    };

    const saveRes = (worker, role) => {
      data.workers = null;
      instance.proxy.$forceUpdate();
      workerClient.updateWorker(worker, role).then(() => forceUpd());
    };

    const add = () => {
      data.usedSelection = null;
      showDialog = true;
      instance.proxy.$forceUpdate();
    };

    const edit = () => {
      data.usedSelection = data.selection;
      showDialog = true;
      instance.proxy.$forceUpdate();
    };

    const close = () => {
      showDialog = false;
      instance.proxy.$forceUpdate();
    };

    const remove = () => {
      const role = new WorkerRoleClient();
      role.delete(data.selection).then(() => {
        changeSelection({ value: data.roles[0] });
        forceUpd();
      });
    };

    let select = computed({
      get: () => data.usedSelection,
      set: (value) => (data.usedSelection = value),
    });

    const rolesFin = computed(() => data.roles);

    return {
      data,
      saveRes,
      changeSelection,
      roles: rolesFin,
      add,
      showDialog,
      close,
      forceUpd,
      edit,
      select,
      remove,
    };
  },
  methods: {
    updSelect() {
      return this.data.usedSelection;
    },
  },
});
</script>

<style scoped></style>
