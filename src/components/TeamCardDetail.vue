<template>
  <div>
    <card :style="{backgroundColor: bgColorTeam}" v-if="teamId">
      <div class="text-center h3" style="color: #000033">{{tableTitle}}</div>
      <div>
        <h5 class="m-1"><b-badge variant="light">Id : </b-badge>&nbsp;<b-badge>{{teamData.team_id}}</b-badge></h5>
        <h5 class="m-1"><b-badge variant="light">Name : </b-badge>&nbsp;<b-badge >Test</b-badge></h5>
        <h5 class="m-1"><b-badge variant="light">Category : </b-badge>&nbsp;<b-badge >Test</b-badge></h5>
        <h5 class="m-1"><b-badge variant="light">Validity : </b-badge>&nbsp;<b-badge >Test</b-badge></h5>
        <h5 class="m-1"><b-badge variant="light">Created at : </b-badge>&nbsp;<b-badge >Test</b-badge></h5>
        <h5 class="m-1"><b-badge variant="light">Updated at : </b-badge>&nbsp;<b-badge >Test</b-badge></h5>
      </div>
      <div class="mt-3">
        <card style="background-color: rgba(64, 184, 131, 0.21);"><b-input v-model="updateValue"></b-input></card>
        <card style="background-color: rgba(64, 184, 131, 0.21);">sd</card>
        <card style="background-color: rgba(64, 184, 131, 0.21);">qs</card>
      </div>

    </card>
  </div>
</template>
<script>
import $ from 'jquery';
export default {
  components: {
  },
  name: 'team-card-detail',
  props: {
      tableTitle: String,
      teamId: String
  },
  data(){
      return {
          bgColorTeam: "rgba(64, 184, 131, 0.21)",
          teamData: {}
      }
  },
  computed: {
  },
  watch: {
          teamId: function(n, o){
            this.axios.request({
                url: "/teams/"+this.teamId+"?participants=true&category=true&manager=true",
                method: "get"
            })
            .then(response => {
                console.log(response.data)
                this.teamData = response.data.team;
            })
      }
  },
  methods: {
  }
};
</script>
<style>
</style>
