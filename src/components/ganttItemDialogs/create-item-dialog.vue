<template>
  <k-dialog
    :modal="false"
    :width="580"
    :title="'Добавить элемент'"
    @close="closeDialog"
    @open="openDialog"
  >
    <dialog-actions-bar>
      <button class="k-button" @click="closeDialog">Отменить</button>
      <button class="k-button" @click="createItem">Добавить</button>
    </dialog-actions-bar>
  </k-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";

export default defineComponent({
  name: "create-item-dialog",
  components: {
    "k-dialog": Dialog,
    "dialog-actions-bar": DialogActionsBar,
  },
  setup() {
    return { visibleDialog: false };
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
