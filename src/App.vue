<template>
  <div id="app" class="bg-dark">
    <div class="container h-100 d-flex flex-column">
      <h1 class="text-white">
        運輸資料流通服務平臺 (Transport Data eXchange, TDX)
      </h1>
      <b-button-group>
        <b-button variant="outline-warning" @click="onBtnExport"
          >匯出 CSV 檔</b-button
        >
        <b-button variant="outline-warning">Button</b-button>
        <b-button variant="outline-warning">Button</b-button>
        <b-button variant="outline-warning">Button</b-button>
      </b-button-group>
      <ag-grid-vue
        style="width: 100%; height: 100%"
        rowSelection="multiple"
        class="ag-theme-alpine"
        :rowDragManaged="true"
        :animateRows="true"
        :suppressExcelExport="true"
        :columnDefs="columnDefs"
        :rowData="rowData"
        @grid-ready="onGridReady"
      >
      </ag-grid-vue>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import colomnDefs from "./assets/colomnDefs.json";
import getData from "./assets/tdxApi.js";

export default {
  name: "App",
  components: {
    AgGridVue,
  },
  data() {
    return {
      columnDefs: [],
      rowData: [],
      // gridApi: null,
      // columnApi: null,
    };
  },
  methods: {
    onGridReady(params) {
      console.log(params);
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      this.gridApi.sizeColumnsToFit();
    },
    onBtnExport() {
      this.gridApi.exportDataAsCsv();
    },
  },
  beforeMount() {
    this.columnDefs = colomnDefs.data;
  },
  mounted() {
    getData("https://ptx.transportdata.tw/MOTC/v2/Rail/TRA/Station")
      .then((res) => {
        res.data.forEach((value, index) => {
          this.rowData.push({
            編號: index + 1,
            縣市: value.LocationCity,
            區域: value.LocationTown,
            站名: value.StationName.Zh_tw,
            "站名 (英)": value.StationName.En,
            代號: value.StationUID,
            地址: value.StationAddress,
            電話: value.StationPhone,
          });
        });
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

#app {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;

  button {
    margin: 10px 0px;
  }
}
</style>
