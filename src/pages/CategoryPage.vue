<template>
  <div class="row">
    <div class="col-12">
      <card class="card">
        <custom-table :tableColumnData="tableColumnData" :tableColumnDataDefault="tableColumnDataDefault" :tableRowData="tableRowData" :loadingEnded="loadingEnded"
                      :modifyInTheTable="false" :tableTitle="tableTitle" :rowIdKey="rowIdKey" :pageName="pageName"
                      @reload="reload" @toggleSpinner="toggleSpinner" @rowToDetail="rowToDetail" @openModalNewRow="openModalNewRow" @openModalUpdateRow="openModalUpdateRow" @tableRowDataFiltered="tableRowDataFilteredToDetail"></custom-table>
      </card>
      <category-modal :categoryIdToUpdate="categoryIdToUpdate" :addNewRowModal="openNewRowModal" :updateRowModal="updateRowModal" :show="showModal"></category-modal>
    </div>
  </div>
</template>
<script>
    import { CustomTable } from "@/components";
    import NotificationTemplate from "./Notifications/NotificationTemplate";
    import CategoryModal from "../components/CategoryModal";

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
            CustomTable,
            CategoryModal
        },
        data() {
            return {
                tableColumnDataDefault: tableColumnDataDefault,
                tableColumnData: tableColumnDataDefault,
                tableRowData: tableRowData,
                tableRowDataFiltered: tableRowData,
                tableTitle: "CATEGORY LIST",
                rowIdKey: rowIdKey,
                pageName: "category",
                loadingEnded: false,
                participantIdToDetail: "",
                categoryIdToUpdate: "",
                openNewRowModal: true,
                updateRowModal: true,
                showModal: false
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

            var promiseCategories = this.axios.request({
                url: "/categories",
                method: "get"
            });
            Promise.all([promiseCategories])
                .then(results => {
                    this.tableRowData = results[0].data.categories;
                })
                .catch(errors => {
                    console.log(errors)
                });
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
            notifyVueSuccess(message) {
                this.$notify({
                    component: NotificationTemplate,
                    horizontalAlign: 'center',
                    verticalAlign: 'top',
                    type: "success",
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
                    .then(response2 => {
                        this.toggleSpinner();
                        this.tableRowData = response2.data.categories;
                        this.notifyVueSuccess("Category updated !");
                        this.showModal = false;
                        this.toggleLoadingValue();
                    })
                })
                .catch(error => {
                    this.toggleSpinner();
                    this.notifyVue(error.response.data.message.en);
                    this.toggleLoadingValue();
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
                            this.notifyVueSuccess("Category added !");
                            this.showModal = false;
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
                            this.notifyVueSuccess("Category and related participants removed for ever !");
                        })
                })
                .catch(error => {
                    this.toggleSpinner();
                    this.notifyVue(error.response.data.message.en);
                })
            },
            openModalNewRow(){
              this.showModal = true;
              if(this.openNewRowModal==true){
                  this.openNewRowModal = false;
              }else{
                  this.openNewRowModal = true;
              }
            },
            openModalUpdateRow(idRow){
                this.showModal = true;
                this.categoryIdToUpdate = idRow;
                if(this.updateRowModal==true){
                    this.updateRowModal = false;
                }else{
                    this.updateRowModal = true;
                }
            },
            rowToDetail(idRow){
                this.participantIdToDetail = idRow;
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
            toggleSpinner() {
                this.$emit('toggleSpinner')
            },
            toggleLoadingValue(){
                if(this.loadingEnded == true){
                    this.loadingEnded = false;
                } else {
                    this.loadingEnded = true;
                }
            },
            tableRowDataFilteredToDetail(el){
                this.tableRowDataFiltered = el;
            }
        }
    };
</script>
<style>
</style>
