<template>
    <card :style="{backgroundColor: color}">
      <h6 class="m-1 d-none"><b-badge variant="light">Id</b-badge>&nbsp;<b-badge>{{participantData.participant_id}}</b-badge></h6>
      <h5 class="m-1 "><b-badge variant="light"><font-awesome-icon icon="user"/></b-badge> <span class="font-weight-bold">{{participantData.participant_name}} {{participantData.participant_surname}}</span></h5>
      <h6 class="m-1" style="text-transform: none"><b-badge variant="light"><font-awesome-icon icon="at"/></b-badge> {{participantData.participant_email}}</h6>
      <h6 class="m-1 "><b-badge variant="light"><font-awesome-icon icon="phone"/></b-badge> {{participantData.participant_telephone}}</h6>
      <h6 class="m-1 "><b-badge variant="light"><font-awesome-icon icon="birthday-cake"/></b-badge> {{participantData.participant_birthdate}} &nbsp;|&nbsp; {{participant_age}} yo</h6>
      <h6 class="m-1 "><b-badge variant="light"><font-awesome-icon icon="dollar-sign"/></b-badge>&nbsp;<b-badge :variant="payment_status.color">{{payment_status.label}}</b-badge></h6>
      <h6 class="m-1 "><b-badge variant="light"><font-awesome-icon icon="graduation-cap"/></b-badge>&nbsp;<b-badge :variant="student_status.color">{{student_status.label}}</b-badge></h6>
      <h6 class="m-1 "><b-badge variant="light"><font-awesome-icon icon="file-medical"/></b-badge>&nbsp;<b-badge :variant="certificate_status.color" id="certificate-status">{{certificate_status.label}}</b-badge></h6>
      <h6 class="m-1 "><b-badge variant="light"><font-awesome-icon icon="tshirt"/></b-badge>&nbsp;{{participantData.participant_tee_shirt_size}}</h6>
      <h6 class="m-1 " style="text-transform: none"><b-badge variant="light"><font-awesome-icon icon="comment"/></b-badge>&nbsp;{{participantData.participant_comment}}</h6>
      <h6 class="m-1 " style="text-transform: none"><b-badge variant="light"><font-awesome-icon icon="reply-all"/></b-badge>&nbsp;{{participantData.participant_message}}</h6>
    </card>
</template>
<script>
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
export default {
  components: {
      FontAwesomeIcon
  },
  name: 'participant-of-team-card-detail',
  props:{
      participantData: Object,
      manager: Boolean
  },
  data(){
      return {
          color: "white"
      }
  },
  mounted(){
      if (this.manager) {
          this.color = "#EEEEEE";//rgb(65, 184, 131, 0.25)"
      }
  },
  computed: {
      participant_age: function(){
          return Math.abs(new Date(Date.now()-Date.parse(this.participantData.participant_birthdate)).getFullYear()-1970);
      },
      payment_status: function(){
          switch(this.participantData.participant_payment){
              case 0: return {color:"danger" ,label:"Unpaid"}; break;
              case 1: return {color:"success" ,label:"Ok"}; break;
              case 2: return {color:"warning" ,label:"Incomplete"}; break;
              default: return "Error";
          }
      },
      certificate_status: function(){
          switch(this.participantData.participant_medical_certificate_valid){
              case 0: return {color:"danger" ,label:"Not uploaded"}; break;
              case 1: return {color:"success" ,label:"Valid"}; break;
              case 2: return {color:"danger" ,label:"Unvalid/Fake"}; break;
              default: return "Error";
          }
      },
      student_status: function(){
          switch(this.participantData.participant_student){
              case 0: return {color:"light" ,label:"Not a student"}; break;
              case 1: return {color:"primary" ,label:"Student"}; break;
              default: return "Error";
          }
      },
  },
  watch: {
      manager: function(n, o){
          if(n == true){
              this.color = "#DDDDDD";//rgb(65, 184, 131, 0.25)";
          } else {
              this.color = "white";
          }
      }
  },
  methods: {
  }
};
</script>
<style>
</style>
