<template>
  <k-dialog
    v-if="visibleDialog"
    :title="'Пожалуйста, подтвердите'"
    @close="closeDialog"
    @open="openDialog"
  >
    <p :style="{ margin: '25px', textAlign: 'center' }">
      Вы действительно хотитие удалить элемент?
    </p>
    <dialog-actions-bar>
      <button class="k-button" @click="closeDialog">Отменить</button>
      <button class="k-button" @click="deleteItem">Подтвердить</button>
    </dialog-actions-bar>
  </k-dialog>
</template>

<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";

export default {
  name: "delete-item-dialog",
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
    deleteItem() {
      console.log("Delete!");
      this.closeDialog();
    },
  },
};
</script>

<style scoped></style>
