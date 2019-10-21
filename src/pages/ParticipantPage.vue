<template>
  <div class="row">
    <div class="col-12">
      <card class="card">
        <custom-table :tableColumnData="tableColumnData" :tableColumnDataDefault="tableColumnDataDefault" :tableRowData="tableRowData" :loadingEnded="loadingEnded"
                      :modifyInTheTable="false" :tableTitle="tableTitle" :rowIdKey="rowIdKey" :pageName="pageName"
                      @reload="reload" @toggleSpinner="toggleSpinner" @rowToDetail="rowToDetail" @openModalNewRow="openModalNewRow" @openModalUpdateRow="openModalUpdateRow" @tableRowDataFiltered="tableRowDataFilteredToDetail"></custom-table>
      </card>
      <b-row class="" style="">
        <b-col class="m-auto">
          <card style="background-color: white">
            <div class="text-center h3" style="color: #000033">PARTICIPANT DETAILS</div>
            <b-col cols="12" sm="6" lg="4" xl="3" class="pt-0 pb-1 d-inline-block" v-for="(item, index) in this.tableRowDataFiltered">
              <participant-card-detail :key="index" :participantData="item" :participantId="participantIdToDetail" @openModalUpdateRow="openModalUpdateRow"></participant-card-detail>
            </b-col>
          </card>
        </b-col>
      </b-row>
      <participant-modal :participantIdToUpdate="participantIdToUpdate" :addNewRowModal="openNewRowModal" :updateRowModal="updateRowModal" :show="showModal"></participant-modal>
    </div>
  </div>
</template>
<script>
    import { CustomTable } from "@/components";
    import NotificationTemplate from "./Notifications/NotificationTemplate";
    import ParticipantCardDetail from "../components/ParticipantCardDetail";
    import ParticipantModal from "../components/ParticipantModal";

    const tableColumnDataDefault = {
        participant_id: {label: "Id", display: false, editable: false},
        participant_name: {label: "Name", display: true, editable: true},
        participant_surname: {label: "Surname", display: true, editable: true},
        participant_team_name: {label: "Team Name", display: true, editable: false},
        participant_birthdate: {label: "Birthdate", display: true, editable: true},
        participant_student: {label: "Student ?", display: true, editable: true},
        participant_medical_certificate_valid: {label: "Certificate ?", display: true, editable: true},
        participant_medical_certificate_file: {label: "Certificate", display: false, editable: true},
        participant_payment: {label: "Payment ?", display: true, editable: true},
        participant_tee_shirt_size: {label: "Tee-shirt Size", display: true, editable: true},
        participant_comment: {label: "Comment", display: false, editable: true},
        participant_message: {label: "Message", display: false, editable: true},
        participant_telephone: {label: "Phone", display: true, editable: true},
        participant_email: {label: "Mail", display: true, editable: true},
        updatedAt: {label: "UPDATED", display: false, editable: false},
        createdAt: {label: "CREATED", display: false, editable: false}
    };
    const tableRowData = [];
    const rowIdKey = "participant_id";

    export default {
        components: {
            CustomTable,
            ParticipantCardDetail,
            ParticipantModal
        },
        data() {
            return {
                tableColumnDataDefault: tableColumnDataDefault,
                tableColumnData: tableColumnDataDefault,
                tableRowData: tableRowData,
                tableRowDataFiltered: tableRowData,
                tableTitle: "PARTICIPANT LIST",
                rowIdKey: rowIdKey,
                pageName: "participant",
                loadingEnded: false,
                participantIdToDetail: "",
                participantIdToUpdate: "",
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

            var promiseParticipants =  this.axios.request({
                url: "/participants/?team=true",
                method: "get"
            });
            Promise.all([promiseParticipants])
                .then(results => {
                    this.tableRowData = results[0].data.participants.filter(el => {
                        if(el.participant_team.team_name) {
                            el.participant_team_name = el.participant_team.team_name;
                        }
                        return el;
                    });
                })
                .catch(errors => {
                    console.log('err')
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
                    url: "/participants/"+idRow,
                    method: "put",
                    data: {
                        participant: updatedRow
                    }
                })
                .then(response => {
                    this.axios.request({
                        url: "/participants/?team=true",
                        method: "get"
                    })
                    .then(response2 => {
                        this.toggleSpinner();
                        var tableRowData1 = response2.data.participants;
                        this.tableRowData = tableRowData1.filter(el => {
                            if(el.participant_team.team_name) {
                                el.participant_team_name = el.participant_team.team_name;
                            }
                            return el;
                        });
                        this.notifyVueSuccess("Participant updated !");
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
                    url: "/participants/",
                    method: "post",
                    data: {
                        participant: newRow
                    }
                })
                    .then(response => {
                        this.axios.request({
                            url: "/participants/?team=true",
                            method: "get"
                        })
                            .then(response => {
                                this.toggleSpinner();
                                var tableRowData1 = response.data.participants;
                                this.tableRowData = tableRowData1.filter(el => {
                                    if(el.participant_team.team_name) {
                                        el.participant_team_name = el.participant_team.team_name;
                                    }
                                    return el;
                                })
                                this.notifyVueSuccess("Participant added !");
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
                    url: "/participants/"+idRow,
                    method: "delete",
                })
                .then(response => {
                    this.axios.request({
                        url: "/participants/?team=true",
                        method: "get"
                    })
                        .then(response => {
                            this.toggleSpinner();
                            var tableRowData1 = response.data.participants;
                            this.tableRowData = tableRowData1.filter(el => {
                                if(el.participant_team.team_name) {
                                    el.participant_team_name = el.participant_team.team_name;
                                }
                                return el;
                            })
                            this.notifyVueSuccess("Participant removed for ever !");
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
                this.participantIdToUpdate = idRow;
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
