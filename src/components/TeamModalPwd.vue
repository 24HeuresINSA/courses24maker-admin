<template>
  <div>
    <b-modal id="modal-team-pwd" centered hide-footer hide-header style="padding: 0px;" @hidden="onReset">
      <div class="d-block text-center p-0">
        <h3>Update password for the team {{form.team.team_name}}</h3>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group label="Password*" size="sm">
            <b-form-input v-model="form.team.team_password" type="text" value=""></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="success" @click="">Change</b-button>&nbsp;
          <b-button type="reset" variant="secondary" @click="onReset">Reset</b-button>&nbsp;
          <b-button @click="onCancel">Cancel</b-button>
        </b-form>
      </div>
    </b-modal>
  </div>
</template>

<script>
    export default {
        name: 'team-modal-pwd',
        props: {
          teamIdToUpdate: String,
          updateRowModal: Boolean,
          show: Boolean
        },
        data() {
            return {
                form: {team: {}},
            }
        },
        computed: {
        },
        watch: {
            updateRowModal: function(n, o){
                var promiseTeams = this.axios.request({
                    url: "/teams/"+this.teamIdToUpdate+"?participants=false&category=false&manager=false",
                    method: "get"
                });
                Promise.all([promiseTeams])
                    .then(results => {
                        this.form.team = results[0].data.team
                        this.$bvModal.show('modal-team-pwd');
                    })
                    .catch(errors => {
                        console.log(errors)
                    });
            },
            show: function(n, o){
                if (!n) {
                    this.$bvModal.hide('modal-team-pwd');
                } else {
                    this.$bvModal.show('modal-team-pwd');
                }
            },
            teamIdToUpdate: function(n, o){
                this.teamIdToUpdate = n;
            }
        },
        methods: {
            onSubmit(evt) {
                evt.preventDefault();
                this.$parent.toggleSpinner();
                this.$parent.validChangePwd(this.form.team.team_password, this.teamIdToUpdate);
            },
            onReset(evt) {
                evt.preventDefault();
                this.form = {team: {}};
            },
            onCancel(evt){
                this.$bvModal.hide('modal-team-pwd');
            }
        }
    }
</script>
