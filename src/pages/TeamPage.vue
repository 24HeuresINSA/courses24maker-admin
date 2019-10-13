<template>
  <div class="row">
    <div class="col-12">
      <card class="card">
        <custom-table :tableColumnData="tableColumnData" :tableColumnDataDefault="tableColumnDataDefault" :tableRowData="tableRowData" :loadingEnded="loadingEnded"
                      :modifyInTheTable="false" :tableTitle="tableTitle" :rowIdKey="rowIdKey" :pageName="pageName"
                      @reload="reload" @toggleSpinner="toggleSpinner" @rowToDetail="rowToDetail"></custom-table>
      </card>
      <team-card-detail :teamId="teamIdToDetail" tableTitle="DETAIL OF A TEAM"></team-card-detail>
    </div>
    <card class="card">

    </card>
  </div>
</template>
<script>
    import { CustomTable } from "@/components";
    import NotificationTemplate from "./Notifications/NotificationTemplate";
    import TeamCardDetail from "../components/TeamCardDetail";

    const tableColumnDataDefault = {
        team_id: {label: "Id", display: false, editable: false},
        team_name: {label: "Team name", display: true, editable: true},
        team_category_label: {label: "Category", display: true, editable: false},
        team_valid: {label: "Valid", display: true, editable: true},
        team_manager_name: {label: "Manager Name", display: true, editable: false},
        team_manager_surname: {label: "Manager Surname", display: true, editable: false},
        team_manager_telephone: {label: "Manager Phone", display: true, editable: false},
        team_manager_email: {label: "Manager Email", display: true, editable: false},
        updatedAt: {label: "UPDATED", display: false, editable: false},
        createdAt: {label: "CREATED", display: false, editable: false}
    };
    const tableRowData = [];
    const rowIdKey = "team_id";

    export default {
        components: {
            TeamCardDetail,
            CustomTable
        },
        data() {
            return {
                tableColumnDataDefault: tableColumnDataDefault,
                tableColumnData: tableColumnDataDefault,
                tableRowData: tableRowData,
                tableTitle: "TEAM LIST",
                rowIdKey: rowIdKey,
                pageName: "team",
                loadingEnded: false,
                teamIdToDetail: ""
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
                url: "/teams",
                method: "get"
            })
                .then(response => {
                    var tableRowData1 = response.data.teams;
                    this.tableRowData = tableRowData1.filter(el => {
                        el.team_category_label = el.team_category.category_label;
                        if(el.team_manager) {
                            el.team_manager_name = el.team_manager.participant_name;
                            el.team_manager_surname = el.team_manager.participant_surname;
                            el.team_manager_telephone = el.team_manager.participant_telephone;
                            el.team_manager_email = el.team_manager.participant_email;
                        }
                        return el;
                    })
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
                    url: "/teams/"+idRow,
                    method: "put",
                    data: {
                        team: updatedRow
                    }
                })
                    .then(response => {
                        this.axios.request({
                            url: "/teams",
                            method: "get"
                        })
                            .then(response => {
                                this.toggleSpinner();
                                var tableRowData1 = response.data.teams;
                                this.tableRowData = tableRowData1.filter(el => {
                                    el.team_category_label = el.team_category.category_label;
                                    if(el.team_manager) {
                                        el.team_manager_name = el.team_manager.participant_name;
                                        el.team_manager_surname = el.team_manager.participant_surname;
                                        el.team_manager_telephone = el.team_manager.participant_telephone;
                                        el.team_manager_email = el.team_manager.participant_email;
                                    }
                                    return el;
                                })
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
                    url: "/teams/",
                    method: "post",
                    data: {
                        team: newRow
                    }
                })
                    .then(response => {
                        this.axios.request({
                            url: "/teams",
                            method: "get"
                        })
                            .then(response => {
                                this.toggleSpinner();
                                var tableRowData1 = response.data.teams;
                                this.tableRowData = tableRowData1.filter(el => {
                                    el.team_category_label = el.team_category.category_label;
                                    if(el.team_manager) {
                                        el.team_manager_name = el.team_manager.participant_name;
                                        el.team_manager_surname = el.team_manager.participant_surname;
                                        el.team_manager_telephone = el.team_manager.participant_telephone;
                                        el.team_manager_email = el.team_manager.participant_email;
                                    }
                                    return el;
                                })
                            })
                    })
                    .catch(error => {
                        this.toggleSpinner();
                        this.notifyVue(error.response.data.message.en);
                    })
            },
            removeRow(idRow){
                this.axios.request({
                    url: "/teams/"+idRow,
                    method: "delete",
                })
                    .then(response => {
                        this.axios.request({
                            url: "/teams",
                            method: "get"
                        })
                            .then(response => {
                                this.toggleSpinner();
                                var tableRowData1 = response.data.teams;
                                this.tableRowData = tableRowData1.filter(el => {
                                    el.team_category_label = el.team_category.category_label;
                                    if(el.team_manager) {
                                        el.team_manager_name = el.team_manager.participant_name;
                                        el.team_manager_surname = el.team_manager.participant_surname;
                                        el.team_manager_telephone = el.team_manager.participant_telephone;
                                        el.team_manager_email = el.team_manager.participant_email;
                                    }
                                    return el;
                                })
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
            toggleSpinner() {
                this.$emit('toggleSpinner')
            },
            loadingEndedFalse(){
                this.loadingEnded = false;
            },
            rowToDetail(idRow){
                this.teamIdToDetail = idRow
            }
        }
    };
</script>
<style>
</style>
