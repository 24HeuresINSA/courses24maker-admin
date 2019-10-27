<template>
    <card :style="{backgroundColor: color}" class="text-center">
      <h6 class="m-1 d-none"><b-badge variant="light">Id</b-badge>&nbsp;<b-badge>{{teamData.team_id}}</b-badge></h6>
      <h5 class="m-1 "><b-badge variant="light"><font-awesome-icon icon="users"/></b-badge> <span class="font-weight-bold">{{teamData.team_name}}</span></h5>
      <h6 class="m-1" style="text-transform: none"><b-badge variant="light"><font-awesome-icon icon="trophy"/></b-badge> {{teamData.team_category_label}}</h6
      <h6 class="m-1 mb-2"><b-badge variant="light"><font-awesome-icon icon="check-double"/></b-badge>&nbsp;<b-badge :variant="team_status.color">{{team_status.label}}</b-badge></h6>
      <h6 class="text-center m-2"><button class="btn btn-sm btn-primary m-auto btn-modify-row mt-1" @click="modifyRow"><span class="ti-pencil"> </span> Edit</button>&nbsp;
      <button class="btn btn-sm btn-primary m-auto btn-modify-row mt-1" @click="modifyRowPwd"><span class="ti-pencil"> </span> Change pwd</button></h6>
      <b-col cols="12" sm="6" lg="4" xl="3" class="pt-0 pb-1 d-inline-block" v-for="(item, index) in this.teamData.team_participants">
        <participant-of-team-card-detail :key="index" :participantData="item" :manager="item.participant_id == teamData.team_manager_id"></participant-of-team-card-detail>
      </b-col>
    </card>
</template>
<script>
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ParticipantOfTeamCardDetail from "./ParticipantOfTeamCardDetail";
import ParticipantCardDetail from "./ParticipantCardDetail";
export default {
  components: {
      ParticipantOfTeamCardDetail,
      ParticipantCardDetail,
      FontAwesomeIcon
  },
  name: 'team-card-detail',
  props:{
      teamData: Object,
      teamId: String
  },
  data(){
      return {
          color: "rgb(255, 252, 244)"
      }
  },
  computed: {
      team_status: function(){
          switch(this.teamData.team_valid){
              case 0: return {color:"primary" ,label:"To check"}; break;
              case 1: return {color:"success" ,label:"Valid"}; break;
              case 2: return {color:"danger" ,label:"Rejected"}; break;
              case 3: return {color: "warning", label: "Incomplete"}
              default: return "Error";
          }
      }
  },
  watch: {
      teamId: function(n, o){
          if(n == this.teamData.team_id){
              this.color = "rgba(158, 233, 244, 0.3)";
          } else {
              this.color = "rgb(255, 252, 244)";
          }
      }
  },
  methods: {
      modifyRow: function(el){
          this.$emit("openModalUpdateRow", this.teamData.team_id);
      },
      modifyRowPwd: function(el){
          this.$emit("openModalUpdateRowPwd", this.teamData.team_id);
      }
  }
};
</script>
<style>
</style>
