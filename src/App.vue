<template>
  <ag-grid-vue
    style="width: 500px; height: 500px"
    class="ag-theme-alpine"
    rowSelection="multiple"
    :columnDefs="columnDefs"
    :rowData="rowData"
  >
  </ag-grid-vue>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      columnDefs: null,
      rowData: null,
    };
  },
  components: {
    AgGridVue,
  },
  beforeMount() {
    this.columnDefs = [
      {
        field: "make",
        sortable: true,
        filter: true,
        checkboxSelection: true,
      },
      { field: "model", sortable: true, filter: true },
      { field: "price", sortable: true, filter: true },
    ];
  },
  mounted() {
    axios
      .get("https://www.ag-grid.com/example-assets/row-data.json")
      .then((res) => {
        this.rowData = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style lang="scss">
@import "~ag-grid-community/dist/styles/ag-grid.css";
@import "~ag-grid-community/dist/styles/ag-theme-alpine.css";
</style>
