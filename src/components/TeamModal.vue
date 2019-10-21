<template>
  <div>
    <b-modal id="modal-team-new" centered hide-footer hide-header style="padding: 0px;" @hidden="onReset">
      <div class="d-block text-center p-0">
        <h3>{{titleModal}}</h3>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group label="Name*" size="sm">
            <b-form-input v-model="form.team.team_name" type="text" value=""></b-form-input>
          </b-form-group>
          <b-form-group label="Password*" size="sm" v-if="newRow">
            <b-form-input v-model="form.team.team_password" type="password" value=""></b-form-input>
          </b-form-group>
          <b-form-group label="Team validity" size="sm">
            <b-form-radio-group v-model="form.team.team_valid" :options="optionsModal.team_validity" buttons :button-variant="team_validity_button_color" size="sm" name="radio-btn-outline"></b-form-radio-group>
          </b-form-group>
          <b-form-group label="Category*" size="sm">
            <b-form-select v-model="form.team.team_category_id" :options="optionsModal.categories" class="form-control"></b-form-select>
          </b-form-group>
          <b-form-group label="Manager*" size="sm" v-if="!newRow">
            <b-form-select v-model="form.team.team_manager_id" :options="optionsModal.managers" class="form-control"></b-form-select>
          </b-form-group>
          <b-form-group label="Manager Name*" size="sm" v-if="newRow">
            <b-form-input v-model="form.team_manager.participant_name" type="text" value=""></b-form-input>
          </b-form-group>
          <b-form-group label="Manager Surname*" size="sm" v-if="newRow">
            <b-form-input v-model="form.team_manager.participant_surname" type="text" value=""></b-form-input>
          </b-form-group>
          <b-form-group label="Manager Birthdate*" size="sm" v-if="newRow">
            <b-form-input v-model="form.team_manager.participant_birthdate" type="date" value=""></b-form-input>
          </b-form-group>
          <b-form-group label="Manager Email*" size="sm" v-if="newRow">
            <b-form-input v-model="form.team_manager.participant_email" type="email" value=""></b-form-input>
          </b-form-group>
          <b-form-group label="Manager Telephone*" size="sm" v-if="newRow">
            <b-form-input v-model="form.team_manager.participant_telephone" type="tel" value=""></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="success" @click="">{{buttonAdd}}</b-button>&nbsp;
          <b-button type="reset" variant="secondary" @click="onReset" v-show="buttonResetDisplay">Reset</b-button>&nbsp;
          <b-button @click="onCancel">Cancel</b-button>
        </b-form>
      </div>
    </b-modal>
  </div>
</template>

<script>
    export default {
        name: 'team-modal',
        props: {
          teamIdToUpdate: String,
          addNewRowModal: Boolean,
          updateRowModal: Boolean,
          show: Boolean
        },
        data() {
            return {
                form: {team: {}, team_manager: {}},
                optionsModal: {
                    categories: [],
                    managers: [],
                    team_validity: [{value:0, text:'To check'},{value:1, text:'Valid'},{value:2, text:'Rejected'}, {value:3, text:'Incomplete'}],
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
            Promise.all([promiseCategories])
                .then(results => {
                    this.optionsModal.categories = [];
                    results[0].data.categories.forEach(el =>{
                        this.optionsModal.categories.push({value: el.category_id ,text: el.category_label})
                    });
                })
                .catch(errors => {
                    console.log(errors)
                });
        },
        computed: {
            team_validity_button_color: function(){
                switch(this.form.team.team_valid){
                    case 0:
                        return "outline-primary";
                        break;
                    case 1:
                        return "outline-success";
                        break;
                    case 2:
                        return "outline-danger";
                        break;
                    case 3:
                        return "outline-warning";
                        break;
                    default:
                        return "";
                        break;
                }
            },
        },
        watch: {
            addNewRowModal: function(n, o){
                this.titleModal = "New team";
                this.newRow = true;
                this.buttonResetDisplay = true;
                this.buttonAdd = "Add";
                var promiseCategories = this.axios.request({
                    url: "/categories",
                    method: "get"
                });
                Promise.all([promiseCategories])
                    .then(results => {
                        this.optionsModal.categories = [];
                        results[0].data.categories.forEach(el =>{
                            this.optionsModal.categories.push({value: el.category_id ,text: el.category_label})
                        });
                        this.$bvModal.show('modal-team-new');
                    })
                    .catch(errors => {
                        console.log(errors)
                    });
            },
            updateRowModal: function(n, o){
                this.newRow = false;
                this.titleModal = "Update team";
                this.buttonResetDisplay = false;
                this.buttonAdd = "Update";
                var promiseCategories = this.axios.request({
                    url: "/categories",
                    method: "get"
                });
                var promiseTeams = this.axios.request({
                    url: "/teams/"+this.teamIdToUpdate+"?participants=true&category=true&manager=true",
                    method: "get"
                });
                Promise.all([promiseCategories, promiseTeams])
                    .then(results => {
                        this.optionsModal.categories = [];
                        results[0].data.categories.forEach(el =>{
                            this.optionsModal.categories.push({value: el.category_id, text: el.category_label});
                        });
                        this.optionsModal.managers = [];
                        results[1].data.team.team_participants.forEach(el =>{
                            this.optionsModal.managers.push({value: el.participant_id, text: el.participant_name+" "+el.participant_surname});
                        });
                        this.form.team = results[1].data.team
                        delete this.form.team.createdAt;
                        delete this.form.team.updatedAt;
                        Object.keys(this.form.team).filter(el => {
                            if(this.form.team[el] === null){
                                delete this.form.team[el];
                            }
                        });
                        this.$bvModal.show('modal-team-new');
                    })
                    .catch(errors => {
                        console.log(errors)
                    });
            },
            show: function(n, o){
                if (!n) {
                    this.$bvModal.hide('modal-team-new');
                } else {
                    this.$bvModal.show('modal-team-new');
                }
            },
            teamIdToUpdate: function(n, o){
                this.teamIdToUpdate = n;
            }
        },
        methods: {
            onSubmit(evt) {
                evt.preventDefault();
                delete this.form.team.createdAt;
                delete this.form.team.updatedAt;
                delete this.form.team.team_manager;
                delete this.form.team.team_participants;
                delete this.form.team.team_category;
                if (this.newRow == true) {
                    console.log(this.form)
                    this.$parent.toggleSpinner();
                    this.$parent.newRow(this.form);
                } else {
                    this.$parent.toggleSpinner();
                    this.$parent.validChange(this.form.team, this.teamIdToUpdate);
                }
            },
            onReset(evt) {
                evt.preventDefault();
                this.form = {team: {}, team_manager: {}};
            },
            onCancel(evt){
                this.$bvModal.hide('modal-team-new');
            }
        }
    }
</script>
