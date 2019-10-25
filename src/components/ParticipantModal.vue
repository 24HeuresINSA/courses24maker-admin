<template>
  <div>
    <b-modal id="modal-participant-new" centered hide-footer hide-header style="padding: 0px;" @hidden="onReset">
      <div class="d-block text-center p-0">
        <h3>{{titleModal}}</h3>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group label="Name*" size="sm">
            <b-form-input v-model="form.participant.participant_name" type="text" value=""></b-form-input>
          </b-form-group>
          <b-form-group label="Surname*" size="sm">
            <b-form-input v-model="form.participant.participant_surname" type="text" value=""></b-form-input>
          </b-form-group>
          <b-form-group label="Birthdate*" size="sm">
            <b-form-input v-model="form.participant.participant_birthdate" type="date" value=""></b-form-input>
          </b-form-group>
          <b-form-group label="Email*" size="sm">
            <b-form-input v-model="form.participant.participant_email" type="email" value=""></b-form-input>
          </b-form-group>
          <b-form-group label="Telephone*" size="sm">
            <b-form-input v-model="form.participant.participant_telephone" type="tel" value=""></b-form-input>
          </b-form-group>
          <b-form-group label="Team*" size="sm">
            <b-form-select v-model="form.participant.participant_team_id" :options="optionsModal.teams" class="form-control"></b-form-select>
          </b-form-group>
          <b-form-group label="Student" size="sm">
            <b-form-radio-group v-model="form.participant.participant_student" :options="optionsModal.student" buttons :button-variant="student_button_color" size="sm" name="radio-btn-outline"></b-form-radio-group>
          </b-form-group>
          <b-form-group label="Student certificate validity" size="sm">
            <b-form-radio-group v-model="form.participant.participant_student_certificate_valid" :options="optionsModal.certificate_student_validity" buttons :button-variant="certificate_student_validity_button_color" size="sm" name="radio-btn-outline"></b-form-radio-group>
          </b-form-group>
          <b-form-group label="Medical certificate validity" size="sm">
            <b-form-radio-group v-model="form.participant.participant_medical_certificate_valid" :options="optionsModal.certificate_validity" buttons :button-variant="certificate_validity_button_color" size="sm" name="radio-btn-outline"></b-form-radio-group>
          </b-form-group>
          <b-form-group label="Payment validity" size="sm">
            <b-form-radio-group v-model="form.participant.participant_payment" :options="optionsModal.payment_validity" buttons :button-variant="payment_validity_button_color" size="sm" name="radio-btn-outline"></b-form-radio-group>
          </b-form-group>
          <b-form-group label="Tee shirt size" size="sm">
            <b-form-radio-group v-model="form.participant.participant_tee_shirt_size" :options="optionsModal.teeshirt_size" buttons :button-variant="teeshirt_size_button_color" size="sm" name="radio-btn-outline"></b-form-radio-group>
          </b-form-group>
          <b-form-group label="Comment from the participant" size="sm">
            <b-form-textarea disabled="disabled" v-model="form.participant.participant_comment" type="text" value=""></b-form-textarea>
          </b-form-group>
          <b-form-group label="Message to the participant" size="sm">
            <b-form-textarea v-model="form.participant.participant_message" type="text" value=""></b-form-textarea>
          </b-form-group>
          <b-button type="submit" variant="success" @click="">{{buttonAdd}}</b-button>&nbsp;
          <b-button type="reset" variant="secondary" @click="onReset" v-show="buttonResetDisplay">Reset</b-button>&nbsp;
          <b-button @click="onCancel">Cancel</b-button>
        </b-form>
      </div>
    </b-modal>
  </div>
</template>
<style>

</style>
<script>
    export default {
        name: 'participant-modal',
        props: {
          participantIdToUpdate: String,
          addNewRowModal: Boolean,
          updateRowModal: Boolean,
          show: Boolean
        },
        data() {
            return {
                form: {participant: {}},
                optionsModal: {
                    categories: [],
                    teams: [],
                    student: [{value:0, text:'No'}, {value:1, text:'Yes'}],
                    certificate_validity: [{value:0, text:'Not uploaded'},{value:1, text:'Valid'},{value:2, text:'Rejected'}, {value:3, text:'To check'}],
                    certificate_student_validity: [{value:0, text:'Not uploaded'},{value:1, text:'Valid'},{value:2, text:'Rejected'},{value:3, text:'To check'}, {value:4, text:'Not necessary'}],
                    payment_validity: [{value:0, text:'Not provided'},{value:1, text:'Valid'},{value:2, text:'Partial'}, {value: 3, text:'To check'}],
                    teeshirt_size: [{value:"NO", text:"NO"},{value:"S", text:"S"},{value:"M", text:"M"},{value:"L", text:"L"},{value:"XL", text:"XL"}],
                },
                titleModal: "",
                buttonAdd: "",
                buttonResetDisplay: false,
                newRow: false
            }
        },
        created: function(){
            var promiseCategories = this.axios.request({
                url: "/categories",
                method: "get"
            });
            var promiseTeams = this.axios.request({
                url: "/teams?participants=false&category=false&manager=false",
                method: "get"
            });
            Promise.all([promiseCategories, promiseTeams])
                .then(results => {
                    this.optionsModal.categories = [];
                    results[0].data.categories.forEach(el =>{
                        this.optionsModal.categories.push({value: el.category_id ,text: el.category_label})
                    });
                    this.optionsModal.teams = []
                    results[1].data.teams.forEach(el =>{
                        this.optionsModal.teams.push({value: el.team_id ,text: el.team_name})
                    });
                })
                .catch(errors => {
                    console.log(errors)
                });
        },
        computed: {
            certificate_validity_button_color: function(){
                switch(this.form.participant.participant_medical_certificate_valid){
                    case 0:
                        return "outline-danger";
                        break;
                    case 1:
                        return "outline-success";
                        break;
                    case 2:
                        return "outline-danger";
                        break;
                    case 3:
                        return "outline-primary";
                        break;
                    default:
                        return "";
                        break;
                }
            },
            certificate_student_validity_button_color: function(){
                switch(this.form.participant.participant_student_certificate_valid){
                    case 0:
                        return "outline-danger";
                        break;
                    case 1:
                        return "outline-success";
                        break;
                    case 2:
                        return "outline-danger";
                        break;
                    case 3:
                        return "outline-primary";
                        break;
                    case 4:
                        return "outline-success";
                        break;
                    default:
                        return "";
                        break;
                }
            },
            student_button_color: function(){
                switch(this.form.participant.participant_student){
                    case 0:
                        return "outline-primary";
                        break;
                    case 1:
                        return "outline-primary";
                        break;
                    default:
                        return "";
                        break;
                }
            },
            payment_validity_button_color: function(){
                switch(this.form.participant.participant_payment){
                    case 0:
                        return "outline-danger";
                        break;
                    case 1:
                        return "outline-success";
                        break;
                    case 2:
                        return "outline-warning";
                        break;
                    case 3:
                        return "outline-primary";
                        break;
                    default:
                        return "";
                        break;
                }
            },
            teeshirt_size_button_color: function(){
                switch(this.form.participant.participant_tee_shirt_size){
                    case "NO":
                        return "outline-warning";
                        break;
                    case "S":
                        return "outline-primary";
                        break;
                    case "M":
                        return "outline-primary";
                        break;
                    case "L":
                        return "outline-primary";
                        break;
                    case "XL":
                        return "outline-primary";
                        break;
                    default:
                        return "";
                        break;
                }
            }
        },
        watch: {
            addNewRowModal: function(n, o){
                this.titleModal = "New participant";
                this.newRow = true;
                this.buttonResetDisplay = true;
                this.buttonAdd = "Add";
                var promiseCategories = this.axios.request({
                    url: "/categories",
                    method: "get"
                });
                var promiseTeams = this.axios.request({
                    url: "/teams?participants=false&category=false&manager=false",
                    method: "get"
                });
                Promise.all([promiseCategories, promiseTeams])
                    .then(results => {
                        this.optionsModal.categories = [];
                        results[0].data.categories.forEach(el =>{
                            this.optionsModal.categories.push({value: el.category_id ,text: el.category_label})
                        });
                        this.optionsModal.teams = []
                        results[1].data.teams.forEach(el =>{
                            this.optionsModal.teams.push({value: el.team_id ,text: el.team_name})
                        });
                        this.$bvModal.show('modal-participant-new');
                    })
                    .catch(errors => {
                        console.log(errors)
                    });
            },
            updateRowModal: function(n, o){
                this.newRow = false;
                this.titleModal = "Update participant";
                this.buttonResetDisplay = false;
                this.buttonAdd = "Update";
                var promiseCategories = this.axios.request({
                    url: "/categories",
                    method: "get"
                });
                var promiseTeams = this.axios.request({
                    url: "/teams?participants=false&category=false&manager=false",
                    method: "get"
                });
                var promiseParticipant = this.axios.request({
                    url: "/participants/"+this.participantIdToUpdate+"?team=true",
                    method: "get"
                });
                Promise.all([promiseCategories, promiseTeams, promiseParticipant])
                    .then(results => {
                        this.optionsModal.categories = [];
                        results[0].data.categories.forEach(el =>{
                            this.optionsModal.categories.push({value: el.category_id ,text: el.category_label})
                        });
                        this.optionsModal.teams = []
                        results[1].data.teams.forEach(el =>{
                            this.optionsModal.teams.push({value: el.team_id ,text: el.team_name})
                        });
                        this.form.participant = results[2].data.participant;
                        this.form.participant.participant_team_id = this.form.participant.participant_team.team_id;
                        delete this.form.participant.createdAt;
                        delete this.form.participant.updatedAt;
                        delete this.form.participant.participant_team;
                        Object.keys(this.form.participant).filter(el => {
                            if(this.form.participant[el] === null){
                                delete this.form.participant[el];
                            }
                        });
                        this.$bvModal.show('modal-participant-new');
                    })
                    .catch(errors => {
                        console.log(errors)
                    });
            },
            show: function(n, o){
                if (!n) {
                    this.$bvModal.hide('modal-participant-new');
                } else {
                    this.$bvModal.show('modal-participant-new');
                }
            },
            participantIdToUpdate: function(n, o){
                this.participantIdToUpdate = n;
            }
        },
        methods: {
            onSubmit(evt) {
                evt.preventDefault();
                delete this.form.participant.createdAt;
                delete this.form.participant.updatedAt;
                delete this.form.participant.participant_team;
                if (this.newRow == true) {
                    this.$parent.toggleSpinner();
                    this.$parent.newRow(this.form.participant);
                } else {
                    this.$parent.toggleSpinner();
                    this.$parent.validChange(this.form.participant, this.participantIdToUpdate);
                }
            },
            onReset(evt) {
                evt.preventDefault();
                this.form = {participant: {}}
            },
            onCancel(evt){
                this.$bvModal.hide('modal-participant-new');
            }
        }
    }
</script>
