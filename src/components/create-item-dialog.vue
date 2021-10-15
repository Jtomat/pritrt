<template>
  <kendo-dialog :modal="false"
                :width="580"
                :title="'Hello Dialog'">
    <kendo-dialog-action :text="'Push!'"></kendo-dialog-action>
    <kendo-dialog-action :text="'Push Now!'"
                         :primary="true"
                         :action="actionMethod">
    </kendo-dialog-action>
  </kendo-dialog>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: "create-item-dialog",
  setup() {
    const data = null;
    return { data }
  }
})
</script>

<style scoped>

</style>
