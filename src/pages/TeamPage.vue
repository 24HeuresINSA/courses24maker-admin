<template>
  <div class="row">
    <div class="col-12">
      <card class="card">
        <custom-table :tableColumnData="tableColumnData" :tableColumnDataDefault="tableColumnDataDefault" :tableRowData="tableRowData" :loadingEnded="loadingEnded"
                      :modifyInTheTable="false" :tableTitle="tableTitle" :rowIdKey="rowIdKey" :pageName="pageName"
                      @reload="reload" @toggleSpinner="toggleSpinner" @rowToDetail="rowToDetail" @openModalNewRow="openModalNewRow"
                      @openModalUpdateRow="openModalUpdateRow" @tableRowDataFiltered="tableRowDataFilteredToDetail">
        </custom-table>
      </card>
      <b-row class="" style="">
        <b-col class="m-auto">
          <card style="background-color: white">
            <div class="text-center h3" style="color: #000033">TEAM DETAILS</div>
            <b-col cols="12" class="pt-0 pb-1 d-inline-block" v-for="(item, index) in this.tableRowDataFiltered">
              <team-card-detail :key="index" :teamData="item" :teamId="teamIdToDetail" @openModalUpdateRow="openModalUpdateRow" @openModalUpdateRowPwd="openModalUpdateRowPwd"></team-card-detail>
            </b-col>
          </card>
        </b-col>
      </b-row>
      <team-modal :teamIdToUpdate="teamIdToUpdate" :addNewRowModal="openNewRowModal" :updateRowModal="updateRowModal" :show="showModal"></team-modal>
      <team-modal-pwd :teamIdToUpdate="teamIdToUpdate" :updateRowModal="updateRowModalPwd" :show="showModalPwd"></team-modal-pwd>
    </div>
  </div>
</template>
<script>
    import { CustomTable } from "@/components";
    import NotificationTemplate from "./Notifications/NotificationTemplate";
    import TeamCardDetail from "../components/TeamCardDetail";
    import TeamModal from "../components/TeamModal";
    import TeamModalPwd from "../components/TeamModalPwd";

    const tableColumnDataDefault = {
        team_id: {label: "Id", display: false, editable: false},
        team_name: {label: "Team name", display: true, editable: true},
        team_category_label: {label: "Category", display: true, editable: false},
        team_number_participant: {label: "Participant Nb", display: true, editable: false},
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
            CustomTable,
            TeamCardDetail,
            TeamModal,
            TeamModalPwd
        },
        data() {
            return {
                tableColumnDataDefault: tableColumnDataDefault,
                tableColumnData: tableColumnDataDefault,
                tableRowData: tableRowData,
                tableRowDataFiltered: tableRowData,
                tableTitle: "TEAM LIST",
                rowIdKey: rowIdKey,
                pageName: "team",
                loadingEnded: false,
                teamIdToDetail: "",
                teamIdToUpdate: "",
                openNewRowModal: false,
                updateRowModal: false,
                updateRowModalPwd: false,
                showModal: false,
                showModalPwd: false
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

            var promiseTeams = this.axios.request({
                url: "/teams/?participants=true&category=true&manager=true",
                method: "get"
            });
            Promise.all([promiseTeams])
                .then(results => {
                    this.tableRowData = results[0].data.teams.filter(el => {
                        el.team_category_label = el.team_category.category_label;
                        if(el.team_manager) {
                            el.team_manager_name = el.team_manager.participant_name;
                            el.team_manager_surname = el.team_manager.participant_surname;
                            el.team_manager_telephone = el.team_manager.participant_telephone;
                            el.team_manager_email = el.team_manager.participant_email;
                        }
                        if(el.team_participants) {
                            el.team_number_participant = el.team_participants.length;
                        }
                        return el;
                    });
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
                    url: "/teams/"+idRow,
                    method: "put",
                    data: {
                        team: updatedRow
                    }
                })
                .then(response => {
                    this.axios.request({
                        url: "/teams/?participants=true&category=true&manager=true",
                        method: "get"
                    })
                    .then(response2 => {
                        this.toggleSpinner();
                        this.tableRowData = response2.data.teams.filter(el => {
                            el.team_category_label = el.team_category.category_label;
                            if(el.team_manager) {
                                el.team_manager_name = el.team_manager.participant_name;
                                el.team_manager_surname = el.team_manager.participant_surname;
                                el.team_manager_telephone = el.team_manager.participant_telephone;
                                el.team_manager_email = el.team_manager.participant_email;
                            }
                            if(el.team_participants) {
                                el.team_number_participant = el.team_participants.length;
                            }
                            return el;
                        });
                        this.notifyVueSuccess("Team updated !");
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
            validChangePwd(updatedRowPwd, idRow){
                this.axios.request({
                    url: "/teams/"+idRow,
                    method: "put",
                    data: {
                        team: {team_password: updatedRowPwd}
                    }
                })
                    .then(response => {
                        this.axios.request({
                            url: "/teams/?participants=true&category=true&manager=true",
                            method: "get"
                        })
                            .then(response2 => {
                                this.toggleSpinner();
                                this.tableRowData = response2.data.teams.filter(el => {
                                    el.team_category_label = el.team_category.category_label;
                                    if(el.team_manager) {
                                        el.team_manager_name = el.team_manager.participant_name;
                                        el.team_manager_surname = el.team_manager.participant_surname;
                                        el.team_manager_telephone = el.team_manager.participant_telephone;
                                        el.team_manager_email = el.team_manager.participant_email;
                                    }
                                    if(el.team_participants) {
                                        el.team_number_participant = el.team_participants.length;
                                    }
                                    return el;
                                });
                                this.notifyVueSuccess("Team password updated !");
                                this.showModalPwd = false;
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
                    url: "/teams/",
                    method: "post",
                    data: {
                        team: newRow.team,
                        team_manager: newRow.team_manager
                    }
                })
                    .then(response => {
                        this.axios.request({
                            url: "/teams/?participants=true&category=true&manager=true",
                            method: "get"
                        })
                            .then(response2 => {
                                this.toggleSpinner();
                                this.tableRowData = response2.data.teams.filter(el => {
                                    el.team_category_label = el.team_category.category_label;
                                    if(el.team_manager) {
                                        el.team_manager_name = el.team_manager.participant_name;
                                        el.team_manager_surname = el.team_manager.participant_surname;
                                        el.team_manager_telephone = el.team_manager.participant_telephone;
                                        el.team_manager_email = el.team_manager.participant_email;
                                    }
                                    if(el.team_participants) {
                                        el.team_number_participant = el.team_participants.length;
                                    }
                                    return el;
                                });
                                this.notifyVueSuccess("Team added !");
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
                    url: "/teams/"+idRow,
                    method: "delete",
                })
                .then(response => {
                    this.axios.request({
                        url: "/teams/?participants=true&category=true&manager=true",
                        method: "get"
                    })
                    .then(response2 => {
                        this.toggleSpinner();
                        this.tableRowData = response2.data.teams.filter(el => {
                            el.team_category_label = el.team_category.category_label;
                            if(el.team_manager) {
                                el.team_manager_name = el.team_manager.participant_name;
                                el.team_manager_surname = el.team_manager.participant_surname;
                                el.team_manager_telephone = el.team_manager.participant_telephone;
                                el.team_manager_email = el.team_manager.participant_email;
                            }
                            if(el.team_participants) {
                                el.team_number_participant = el.team_participants.length;
                            }
                            return el;
                        });
                        this.notifyVueSuccess("Team removed for ever !");
                    })
                })
                .catch(error => {
                    this.toggleSpinner();
                    this.notifyVue(error.response.data.message.en);
                })
            },
            openModalNewRow(){
              this.showModal = true;
              if (this.openNewRowModal == true) {
                  this.openNewRowModal = false;
              } else {
                  this.openNewRowModal = true;
              }
            },
            openModalUpdateRow(idRow){
                this.showModal = true;
                this.teamIdToUpdate = idRow;
                if(this.updateRowModal==true){
                    this.updateRowModal = false;
                }else{
                    this.updateRowModal = true;
                }
            },
            openModalUpdateRowPwd(idRow){
                this.showModalPwd = true;
                this.teamIdToUpdate = idRow;
                if(this.updateRowModalPwd==true){
                    this.updateRowModalPwd = false;
                }else{
                    this.updateRowModalPwd = true;
                }
            },
            rowToDetail(idRow){
                this.teamIdToDetail = idRow;
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
