<template>
  <k-dialog
    v-if="visibleDialog"
    :title="'Добавить элемент'"
    @close="closeDialog"
    @open="openDialog"
  >
    <p :style="{ margin: '25px', textAlign: 'center' }">
      ДОБАВИТЬ
    </p>
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
  data() {
    return {
      visibleDialog: false
    }
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
