<template>
  <k-dialog
    v-if="visibleDialog"
    :width="500"
    :title="'Добавить элемент'"
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
      <button class="k-button" @click="createItem">Добавить</button>
    </dialog-actions-bar>
  </k-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Input } from "@progress/kendo-vue-inputs";
export default defineComponent({
  name: "create-item-dialog",
  components: {
    "k-dialog": Dialog,
    "dialog-actions-bar": DialogActionsBar,
    "k-input": Input,
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
    createItem() {
      console.log("Create!");
      this.closeDialog();
    },
  },
});
</script>

<style scoped></style>
