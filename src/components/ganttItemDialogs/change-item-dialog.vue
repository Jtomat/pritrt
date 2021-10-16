<template>
  <k-dialog
    v-if="visibleDialog"
    :title="'Изменить элемент'"
    @close="closeDialog"
    @open="openDialog"
  >
    <div :style="{ margin: '25px', textAlign: 'center' }">
      <div class="m-3">
        <p>Название задачи</p>
        <k-input></k-input>
      </div>
      <div class="m-3">
        <p>Начало выполнения</p>
        <p><k-input type="time" /><k-input type="date" /></p>
      </div>
      <div class="m-3">
        <p>Конец выполнения</p>
        <p><k-input type="time" /><k-input type="date" class="m-2" /></p>
      </div>
    </div>
    <dialog-actions-bar>
      <button class="k-button" @click="closeDialog">Отменить</button>
      <button class="k-button" @click="saveChanges">Сохранить изменения</button>
    </dialog-actions-bar>
  </k-dialog>
</template>

<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Input } from "@progress/kendo-vue-inputs";
export default {
  name: "change-item-dialog",
  components: {
    "k-dialog": Dialog,
    "dialog-actions-bar": DialogActionsBar,
  },
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
      this.visibleDialog = true;
    },
    saveChanges() {
      console.log("Save!");
      this.closeDialog();
    },
  },
};
</script>

<style scoped></style>
