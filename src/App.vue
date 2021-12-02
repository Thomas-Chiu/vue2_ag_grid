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
        <b-button variant="outline-warning" @click="onAddRows"
          >新增 2 列</b-button
        >
        <b-button variant="outline-warning" @click="onDelRows"
          >刪除資料</b-button
        >
        <b-button variant="outline-warning" @click="onResetState"
          >全部復原</b-button
        >
      </b-button-group>
      <ag-grid-vue
        style="width: 100%; height: 100%"
        rowSelection="multiple"
        class="ag-theme-alpine"
        :rowDragManaged="true"
        :rowDragMultiRow="true"
        :animateRows="true"
        :suppressExcelExport="true"
        :defaultColDef="defaultColDef"
        :rowClassRules="rowClassRules"
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
      gridApi: null,
      columnApi: null,
      defaultColDef: {
        resizable: true,
        editable: true,
        sortable: true,
        filter: true,
      },
      rowClassRules: null,
      count: 2,
    };
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      this.gridApi.sizeColumnsToFit();
    },
    onBtnExport() {
      this.gridApi.exportDataAsCsv();
    },
    onAddRows() {
      for (let i = 0; i < this.count; i++) {
        let currentIndex = this.rowData.length;
        let randomCount = Math.floor(Math.random() * currentIndex);
        let addItem = this.rowData[randomCount];
        this.rowData.splice(0, 0, addItem);
      }
    },
    onDelRows() {
      let delItem = this.gridApi.getSelectedRows();
      let delItemUid = delItem.map((item) => {
        return item.UID;
      });
      if (delItem == null || delItem.length <= 0) {
        alert("請先勾選資料");
        return;
      }

      for (let item of delItemUid) {
        let delItemIndex = this.rowData.findIndex((e) => e.UID === item);
        this.rowData.splice(delItemIndex, 1);
      }
    },
    onResetState() {
      this.columnApi.resetColumnState();
      this.gridApi.setFilterModel(null);
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
            id: index + 1,
            縣市: value.LocationCity,
            區域: value.LocationTown,
            站名: value.StationName.Zh_tw,
            "站名 (英)": value.StationName.En,
            UID: value.StationUID,
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
