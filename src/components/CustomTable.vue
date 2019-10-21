<template>
  <div>
    <div class="text-center h3" style="color: #000033">{{tableTitle}}</div>
    <div class="pb-2 pt-2 text-center">
      <b-form-input size="sm" class="ml-0 mb-1 mt-1" v-model="search" placeholder="Filter" style="display: inline; max-width: 250px;"></b-form-input>
      <b-badge pill variant="light" id="searchResultNumberBadge">{{this.tableRowData.length}}</b-badge>&nbsp;
      <b-form-select v-model="selectedColumnFilter" :options="getOptionsColumnFilter" class="form-control form-control-sm" size="sm" style="display: inline; max-width: 180px;"></b-form-select>&nbsp;
      <b-form-checkbox v-model="caseColumnFilter" value="true" unchecked-value="false" checked class="d-inline-block">Match case</b-form-checkbox>
    </div>
    <div style="overflow:auto">
      <table class="table mt-1" style="overflow-y:scroll">
        <thead :style="styleTableHead">
          <th v-for="column in Object.keys(tableColumnData)" :key="column" v-show="tableColumnData[column].display" @click="sortBy(column)" style="cursor:grab;">
            {{tableColumnData[column].label}}</th>
          <th width="auto" class="font-italic" style="color: lightgrey;">Manage</th>
        </thead>
        <tbody>
          <tr v-for="(item, index) in getTableRowData" :key="index" :rowId="item[rowIdKey]" style="background-color: #fffcf4" @click="rowToDetail">
            <td v-for="(column, index) in Object.keys(tableColumnData)" :style="tableColumnData[column].styleTableBody ? tableColumnData[column].styleTableBody : styleTableBody"
                :key="index" :columnId="column" :editable="tableColumnData[column].editable"
                v-if="hasValue(item, column) && tableColumnData[column].display==true">
              {{itemValue(item, column)}}
            </td>
            <td class="text-center" style="white-space: nowrap;">
              <button class="btn btn-sm btn-primary mr-1 ml-1 btn-modify-row" @click="modifyRow"><span class="ti-pencil"></span></button>
              <button class="btn btn-sm btn-success mr-1 ml-1 btn-valid-row d-none" @click="validChangeRow"><span class="ti-check" id="btnValidCheckLogo"></span>
                <span class="spinner-border spinner-border-sm d-none" id="btnValidSpinnerLogo" role="status" aria-hidden="true"></span>
              </button>
              <button class="btn btn-sm btn-danger mr-1 ml-1 btn-remove-row" @click="removeRow"><span class="ti-trash"></span></button>
              <button class="btn btn-sm btn-danger mr-1 ml-1 btn-cancel-row d-none" @click="cancelChangeRow"><span class="ti-close"></span></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="text-center p-2 mb-2">
      Column displayed&nbsp;:
      <button type="button" class="btn btn-sm m-1 btn-warning" @click="toggleColumnDisplayReset">Reset</button>
      <button v-for="column in Object.keys(tableColumnData)" :key="column" :customid="column" type="button" class="btn btn-sm m-1"
              :class="{'btn-outline-secondary':!tableColumnData[column].display, 'text-dark':!tableColumnData[column].display}" @click="toggleColumnDisplay">{{tableColumnData[column].label}}</button>
    </div>
    <div class="text-center m-auto">
      <button type="button" class="btn btn-sm m-1 btn-primary" @click="openModalNewRow">Add a new record</button>
      <download-csv :data="getTableRowData" :name="tableTitle+'.csv'" style="display: inline-block">
        <button type="button" class="btn btn-sm m-1 btn-warning" @click="exportToCSV">Export in CSV</button>
      </download-csv>
    </div>
    <div>
      <b-modal id="modalAddRow" centered hide-footer hide-header class="p-0">
        <div class="d-block text-center">
          <row-form :tableColumnData="tableColumnData" @addNewRow="addRow"></row-form>
        </div>
        <b-button class="mt-3" block @click="$bvModal.hide('modalAddRow')">Close Me</b-button>
      </b-modal>
    </div>
    <div>
      <b-modal id="modalRemoveRow" centered hide-footer hide-header class="p-0">
        <div class="d-block text-center">
          Are you sure you want to remove that row ?&nbsp;
          No rollback possible.
          <button class="mt-3 p-1 btn btn-danger" block @click="confirmRemove(true)">Remove anymore</button>&nbsp;
          <button class="mt-3 p-1 btn btn-primary" block @click="confirmRemove(false)">Don't remove</button>
        </div>
      </b-modal>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
import RowForm from "../layout/dashboard/RowForm";
export default {
  components: {
      RowForm
  },
  name: 'custom-table',
  props: {
    tableColumnDataDefault: Object,
    tableColumnData: Object,
    tableRowData: Array,
    tableTitle: String,
    pageName: String,
    styleTableHead: {
        type: Object,
        default: function() {
            return {
                color: "white",
                backgroundColor: "black",
                textAlign: "center"
            }
        }
    },
    styleTableBody: {
        type: Object,
        default: function() {
            return {
                textAlign: "center"
            }
        }
    },
    rowIdKey: String,
    loadingEnded: Boolean,
    searchResultNumber: Number,
    modifyInTheTable: Boolean
  },
  data(){
      return {
          search: "",
          sortKey: "",
          orderSort: "asc",
          selectedColumnFilter: "all",
          optionsColumnFilter: "",
          caseColumnFilter: true
      }
  },
  computed: {
      getTableRowData() {
          var res1 = _.orderBy(this.tableRowData.filter(item => {
              var res = false;
              if (this.selectedColumnFilter == "all") {
                  Object.values(item).forEach(ii => {
                      if (this.caseColumnFilter == "false") {
                          if(String(ii).toLowerCase().includes(this.search.toLowerCase())){
                              res=true;
                          }
                      } else {
                          if(String(ii).includes(this.search)){
                              res=true;
                          }
                      }
                  });
              } else if (this.selectedColumnFilter) {
                  if (this.caseColumnFilter == "false") {
                      if (String(item[this.selectedColumnFilter]).toLowerCase().includes(this.search.toLowerCase())) {
                          res=true;
                      }
                  } else {
                      if (String(item[this.selectedColumnFilter]).includes(this.search)) {
                          res=true;
                      }
                  }
              }
              return res;
          }), this.sortKey, this.orderSort);
          $('#searchResultNumberBadge').html(res1.length);
          this.$emit("rowToDetail", "0");
          this.$emit("tableRowDataFiltered", res1);
          return res1;
      },
      getOptionsColumnFilter(){
          var res = [{value: "all", text: "-All Columns-"}];
          for(var i=0; i<Object.keys(this.tableColumnData).length; i++){
              if (this.tableColumnData[Object.keys(this.tableColumnData)[i]].display == true) {
                  res.push({
                      value: Object.keys(this.tableColumnData)[i],
                      text: this.tableColumnData[Object.keys(this.tableColumnData)[i]].label
                  });
              }
          }
          return res;
      }
  },
  watch: {
      loadingEnded: function(n, o){
          if(n){
              this.$emit('loadingEndedEvent');
          }
      }
  },
  methods: {
      hasValue(item, column){
          return item[column.toLowerCase()] !== "undefined";
      },
      itemValue(item, column) {
          return item[column];
      },
      sortBy: function(sortKey) {
          if(this.orderSort == "asc"){
              this.orderSort = "desc";
          }else{
              this.orderSort = "asc";
          }
          if(this.sortKey != sortKey){
              this.orderSort="asc";
          }
          this.sortKey = sortKey;
      },
      toggleColumnDisplay(el){
          $(el.srcElement).toggleClass("btn-outline-secondary");
          $(el.srcElement).toggleClass("text-dark");
          if(this.tableColumnData.hasOwnProperty($(el.srcElement).attr("customid"))){
              if (this.tableColumnData[$(el.srcElement).attr("customid")].display == true) {
                  this.tableColumnData[$(el.srcElement).attr("customid")].display = false;
                  var updatedLocalStorage = JSON.parse(localStorage.tableColumnData);
                  updatedLocalStorage[this.pageName][$(el.srcElement).attr("customid")].display = false;
                  localStorage.tableColumnData = JSON.stringify(updatedLocalStorage);
              } else {
                  this.tableColumnData[$(el.srcElement).attr("customid")].display = true;
                  var updatedLocalStorage = JSON.parse(localStorage.tableColumnData);
                  updatedLocalStorage[this.pageName][$(el.srcElement).attr("customid")].display = true;
                  localStorage.tableColumnData = JSON.stringify(updatedLocalStorage);
              }
          }
      },
      toggleColumnDisplayReset(el){
          var updatedLocalStorage = JSON.parse(localStorage.tableColumnData);
          updatedLocalStorage[this.pageName] = this.tableColumnDataDefault;
          localStorage.tableColumnData = JSON.stringify(updatedLocalStorage);
          this.$emit('reload');
      },
      addRow(el){
        this.$emit('toggleSpinner');
        this.$bvModal.hide('modalAddRow');
        this.$parent.$parent.newRow(el);
      },
      modifyRow(el){
          var element;
          if ($(el.target).is("button")) {
              element = $(el.target);
          } else{
              element = $(el.target).parent();
          }
          var idRow = element.parent().parent().attr("rowId");

          if (this.modifyInTheTable) {
              element.addClass("d-none");
              element.parent().children(".btn-valid-row").removeClass("d-none");
              element.parent().children(".btn-remove-row").addClass("d-none");
              element.parent().children(".btn-cancel-row").removeClass("d-none");

              var cells = element.parent().parent().children();
              for (var i = 0; i < cells.length - 1; i++) {
                  if ($(cells[i]).attr("editable")) {
                      $(cells[i]).html("<input type='text' class='form-control' name='" + $(cells[i]).attr("columnId") + "' value='" + $(cells[i]).html().trim() + "' style='min-width: 90px;'>")
                  }
              }
          } else {
              console.log(element.parent().parent().parent().children());
              element.parent().parent().parent().children("tr").css("background-color", "rgb(255, 252, 244)");
              element.parent().parent().css("background-color","rgba(158, 233, 244, 0.3)");
              this.$emit("rowToDetail", idRow);
              this.$emit("openModalUpdateRow", idRow);
          }
      },
      confirmRemove(confirmOrNot){
          this.$emit('confirmRemove', confirmOrNot);
      },
      removeRow(el){
          var element;
          if($(el.srcElement).is("button")){
              element = $(el.srcElement);
          }else{
              element = $(el.srcElement).parent();
          }
          var idRow = element.parent().parent().attr("rowId");
          this.$bvModal.show('modalRemoveRow');
          this.$on('confirmRemove', function(confirmOrNot){
              this.$bvModal.hide('modalRemoveRow');
              if(confirmOrNot){
                  this.$emit('toggleSpinner');
                  this.$parent.$parent.removeRow(idRow);
              }
          });
      },
      validChangeRow(el){
          var element;
          if($(el.srcElement).is("button")){
              element = $(el.srcElement);
          }else{
              element = $(el.srcElement).parent();
          }

          var updatedRow = {};
          var idRow = element.parent().parent().attr("rowId");
          var cells = element.parent().parent().children();

          for (var i=0; i<cells.length-1; i++) {
              if (this.tableColumnData.hasOwnProperty($(cells[i]).attr("columnId"))) {
                  if (this.tableColumnData[$(cells[i]).attr("columnId")].editable) {
                      updatedRow[$(cells[i]).attr("columnId")] = $(cells[i]).children("input").val();
                  }
              }
          }
          this.$emit('toggleSpinner');
          this.$parent.validChange(updatedRow, idRow);
          this.$on('loadingEndedEvent', function(){
              for(var i=0; i<this.tableRowData.length; i++) {
                  if(this.tableRowData[i][this.rowIdKey]==idRow){
                      for (var j=0; j<cells.length-1; j++) {
                          if (this.tableColumnData.hasOwnProperty($(cells[j]).attr("columnId"))) {
                              if (this.tableColumnData[$(cells[j]).attr("columnId")].editable) {
                                  $(cells[j]).html(this.tableRowData[i][$(cells[j]).attr("columnId")])
                              }
                          }
                      }
                      break;
                  }
              }
              element.addClass("d-none");
              element.parent().children(".btn-modify-row").removeClass("d-none");
              element.parent().children(".btn-remove-row").removeClass("d-none");
              element.parent().children(".btn-cancel-row").addClass("d-none");
              this.$parent.toggleLoadingValue();
          });
      },
      cancelChangeRow(el){
          var element;
          if($(el.srcElement).is("button")){
              element = $(el.srcElement);
          }else{
              element = $(el.srcElement).parent();
          }

          var idRow = element.parent().parent().attr("rowId");
          var cells = element.parent().parent().children();
          for(var i=0; i<this.tableRowData.length; i++) {
              if(this.tableRowData[i][this.rowIdKey]==idRow){
                  for (var j=0; j<cells.length-1; j++) {
                      if (this.tableColumnData.hasOwnProperty($(cells[j]).attr("columnId"))) {
                          if (this.tableColumnData[$(cells[j]).attr("columnId")].editable) {
                              $(cells[j]).html(this.tableRowData[i][$(cells[j]).attr("columnId")])
                          }
                      }
                  }
                  break;
              }
          }
          element.addClass("d-none");
          element.parent().children(".btn-modify-row").removeClass("d-none");
          element.parent().children(".btn-remove-row").removeClass("d-none");
          element.parent().children(".btn-valid-row").addClass("d-none");
      },
      exportToCSV(){
      },
      openModalNewRow(){
        this.$emit('openModalNewRow');
      },
      rowToDetail(el){
        if (!$(el.target).is("button") && !$(el.target).parent().is("button")) {
            $(el.target).parent().parent().children("tr").css("background-color", "rgb(255, 252, 244)");
            $(el.target).parent().css("background-color", "rgba(158, 233, 244, 0.3)");
            var idRow = $(el.target).parent().attr("rowId");
        } else {
            var element;
            if ($(el.target).is("button")) {
                element = $(el.target);
            } else{
                element = $(el.target).parent();
            }
            var idRow = element.parent().parent().attr("rowId");
        }
        this.$emit("rowToDetail", idRow);
      }
  }
};
</script>
<style>
</style>
