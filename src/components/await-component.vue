<template>
  <k-dialog
    :width="500"
    :title="'Пожалуйста подождите'"
    @close="closeDialog"
    @open="openDialog"
  >
    <div
      :style="{ margin: '25px', textAlign: 'center' }"
      class="d-flex justify-content-center"
    >
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </k-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Input } from "@progress/kendo-vue-inputs";

export default defineComponent({
  name: "await-component",
  components: {
    "k-dialog": Dialog,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
