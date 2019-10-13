<template>
    <div class="row">
      <div class="col-12">
        <card class="card">
          <custom-table :tableColumnData="tableColumnData" :tableColumnDataDefault="tableColumnDataDefault" :tableRowData="tableRowData" :loadingEnded="loadingEnded"
                        :modifyInTheTable="true" :tableTitle="tableTitle" :rowIdKey="rowIdKey" :pageName="pageName"
                        @reload="reload" @toggleSpinner="toggleSpinner" @rowToDetail="rowToDetail"></custom-table>
        </card>
      </div>
    </div>
</template>
<script>
import { CustomTable } from "@/components";
import NotificationTemplate from "./Notifications/NotificationTemplate";

const tableColumnDataDefault = {
    category_id: {label: "Id", display: false, editable: false},
    category_label: {label: "Label", display: true, editable: true},
    category_description: {label: "Description", display: true, editable: true},
    category_nb_max: {label: "Nb max", display: false, editable: true},
    category_full: {label: "Full ?", display: true, editable: true},
    category_type: {label: "Type", display: false, editable: true},
    category_nb_total: {label: "Nb total", display: false, editable: true},
    category_price_regular: {label: "Regular price", display: true, editable: true},
    category_price_student: {label: "Student price", display: true, editable: true},
    updatedAt: {label: "UPDATED", display: false, editable: false},
    createdAt: {label: "CREATED", display: false, editable: false}
  };
const tableRowData = [];
const rowIdKey = "category_id";

export default {
    components: {
      CustomTable
    },
    data() {
      return {
        tableColumnDataDefault: tableColumnDataDefault,
        tableColumnData: tableColumnDataDefault,
        tableRowData: tableRowData,
        tableTitle: "CATEGORIES LIST",
        rowIdKey: rowIdKey,
        pageName: "category",
        loadingEnded: false
      };
    },
    mounted(){
      if (localStorage.tableColumnData) {
        if(JSON.parse(localStorage.tableColumnData)[this.pageName]){
            this.tableColumnData = JSON.parse(localStorage.tableColumnData)[this.pageName];
        }
      } else {
          var updatedLocalStorage = {};
          updatedLocalStorage[this.pageName] = this.tableColumnDataDefault;
          localStorage.tableColumnData = JSON.stringify(updatedLocalStorage)
      }

      this.axios.request({
        url: "/categories",
        method: "get"
      })
        .then(response => {
          this.tableRowData = response.data.categories;
        })
    },
    methods: {
        notifyVue(message) {
            this.$notify({
                component: NotificationTemplate,
                horizontalAlign: 'center',
                verticalAlign: 'top',
                type: "danger",
                message: message,
                timeout: 5000
            });
        },
        validChange(updatedRow, idRow){
            this.axios.request({
                url: "/categories/"+idRow,
                method: "put",
                data: {
                    category: updatedRow
                }
            })
            .then(response => {
                this.axios.request({
                    url: "/categories",
                    method: "get"
                })
                .then(response => {
                    this.toggleSpinner();
                    this.tableRowData = response.data.categories;
                    this.loadingEnded = true;
                })
            })
            .catch(error => {
                this.toggleSpinner();
                this.notifyVue(error.response.data.message.en);
                this.loadingEnded = true;
            })
        },
        newRow(newRow){
            this.axios.request({
                url: "/categories/",
                method: "post",
                data: {
                    category: newRow
                }
            })
            .then(response => {
                this.axios.request({
                    url: "/categories",
                    method: "get"
                })
                .then(response => {
                    this.toggleSpinner();
                    this.tableRowData = response.data.categories;
                })
            })
            .catch(error => {
                this.toggleSpinner();
                this.notifyVue(error.response.data.message.en);
            })
        },
        removeRow(idRow){
            this.axios.request({
                url: "/categories/"+idRow,
                method: "delete",
            })
            .then(response => {
                this.axios.request({
                    url: "/categories",
                    method: "get"
                })
                .then(response => {
                    this.toggleSpinner();
                    this.tableRowData = response.data.categories;
                })
            })
            .catch(error => {
                this.toggleSpinner();
                this.notifyVue(error.response.data.message.en);
            })
        },
        reload(){
            if (localStorage.tableColumnData) {
                if(JSON.parse(localStorage.tableColumnData)[this.pageName]){
                    this.tableColumnData = JSON.parse(localStorage.tableColumnData)[this.pageName];
                } else {
                    var updatedLocalStorage = JSON.parse(localStorage.tableColumnData);
                    updatedLocalStorage[this.pageName] = this.tableColumnDataDefault;
                    localStorage.tableColumnData = JSON.stringify(updatedLocalStorage)
                }
            }
        },
        rowToDetail(idRow){
            console.log(idRow);
        },
        toggleSpinner() {
            this.$emit('toggleSpinner')
        },
        loadingEndedFalse(){
            this.loadingEnded = false;
        }
    }
};
</script>
<style>
</style>
