<template>
  <k-dialog
    v-if="visibleDialog"
    :title="'Изменить элемент'"
    @close="closeDialog"
    @open="openDialog"
  >
    <p :style="{ margin: '25px', textAlign: 'center' }">
      ИЗМЕНИТЬ
    </p>
    <dialog-actions-bar>
      <button class="k-button" @click="closeDialog">Отменить</button>
      <button class="k-button" @click="saveChanges">Сохранить изменения</button>
    </dialog-actions-bar>
  </k-dialog>
</template>

<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";

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
      console.log('Save!')
      this.closeDialog();
    },
  },
};
</script>

<style scoped></style>
