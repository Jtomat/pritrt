<template>
  <k-dialog
    v-if="visibleDialog"
    :width="500"
    :title="'Информация о роли'"
    @close="closeDialog"
    @open="openDialog"
  >
    <div :style="{ margin: '25px', textAlign: 'center' }">
      <div class="m-3">
        <p>Название роли</p>
        <k-input v-model="data.role.name" required></k-input>
      </div>
      <div class="m-3">
        <p>Уровень допуска</p>
        <p>
          <k-input v-model="data.role.rate" required type="number" min="0" />
        </p>
      </div>
    </div>
    <dialog-actions-bar style="display: flex; justify-content: space-between">
      <button class="btn btn-secondary" @click="closeDialog">Отменить</button>
      <button
        class="btn btn-warning"
        :disabled="data.role.name === '' || data.role.rate == null"
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
import { defineComponent } from "vue";
import { WorkerRoleClient } from "@/http-clients/worker-role-client";

export default defineComponent({
  name: "add-edit-role-dialog-component",
  components: {
    "k-dialog": Dialog,
    "dialog-actions-bar": DialogActionsBar,
    "k-input": Input,
  },
  props: ["role", "onSave"],
  data() {
    return {
      visibleDialog: false,
      data: { role: { id: null, name: "", rate: 0 } },
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
      this.data = {
        role: this.role() ? this.role() : { id: null, name: "", rate: 0 },
      };

      this.visibleDialog = true;
    },
    saveItem() {
      const roleClient = new WorkerRoleClient();
      let request = null;
      if (this.role() && this.role().id) {
        request = roleClient.updateRole(this.data.role);
      } else {
        request = roleClient.addRole(this.data.role);
      }

      this.closeDialog();
      request.finally(() => this.onSave());
    },
  },
});
</script>

<style scoped></style>
