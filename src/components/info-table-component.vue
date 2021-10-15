<template>
  <Grid
    v-if="data.table"
    ref="grid"
    :style="{
      height: '100%',
      margin: '20px !important',
    }"
    :data-items="data.table"
    :columns="data.tableHeaders"
  >
    <toolbar>
      <button
        title="Export to Excel"
        class="btn btn-warning"
        @click="exportExcel"
      >
        Export to Excel
      </button>
    </toolbar>
    <template v-slot:headerTemplate="{ props }">
      <span>{{ props.field }}</span>
    </template>
  </Grid>
</template>

<script>
import { ProjectClient } from "@/http-clients/project-client";
import { Grid, GridToolbar } from "@progress/kendo-vue-grid";
import { saveExcel } from "@progress/kendo-vue-excel-export";
import { defineComponent, getCurrentInstance } from "vue";

export default defineComponent({
  name: "info-table-component",
  components: {
    Grid: Grid,
    toolbar: GridToolbar,
  },
  setup() {
    const data = {};
    const projectsClient = new ProjectClient();
    const tableData = projectsClient.getTableData();
    const exportExcel = () => {
      saveExcel({
        data: data.table,
        fileName: "myFile",
        columns: data.tableHeaders,
      });
    };

    const instance = getCurrentInstance();
    tableData.then((value) => {
      const props = Object.getOwnPropertyNames(value[0]);
      const headers = [];
      props.forEach((prop, index) => {
        if (prop !== "length")
          headers.push({ field: prop, title: value[0][index] });
      });
      data.tableHeaders = headers;
      data.table = value.slice(1, value.length);
      instance.proxy.$forceUpdate();
    });
    return { data, exportExcel };
  },
});
</script>

<style scoped></style>
