<template>
    <card :style="{backgroundColor: color}">
      <h6 class="m-1 d-none"><b-badge variant="light">Id</b-badge>&nbsp;<b-badge>{{participantData.participant_id}}</b-badge></h6>
      <h5 class="m-1 "><b-badge variant="light"><font-awesome-icon icon="user"/></b-badge> <span class="font-weight-bold">{{participantData.participant_name}} {{participantData.participant_surname}}</span></h5>
      <h6 class="m-1" style="text-transform: none"><b-badge variant="light"><font-awesome-icon icon="at"/></b-badge> {{participantData.participant_email}}</h6>
      <h6 class="m-1 "><b-badge variant="light"><font-awesome-icon icon="phone"/></b-badge> {{participantData.participant_telephone}}</h6>
      <h6 class="m-1 "><b-badge variant="light"><font-awesome-icon icon="birthday-cake"/></b-badge> {{participantData.participant_birthdate}} &nbsp;|&nbsp; {{participant_age}} yo</h6>
      <h6 class="m-1 "><b-badge variant="light"><font-awesome-icon icon="dollar-sign"/></b-badge>&nbsp;<b-badge :variant="payment_status.color">{{payment_status.label}}</b-badge></h6>
      <h6 class="m-1 "><b-badge variant="light"><font-awesome-icon icon="graduation-cap"/></b-badge>&nbsp;<b-badge :variant="student_status.color">{{student_status.label}}</b-badge></h6>
      <h6 class="m-1 "><b-badge variant="light"><font-awesome-icon icon="graduation-cap"/></b-badge>&nbsp;<b-badge :variant="certificate_student_status.color">{{certificate_student_status.label}}</b-badge></h6>
      <h6 class="m-1 "><b-badge variant="light"><font-awesome-icon icon="file-medical"/></b-badge>&nbsp;<b-badge :variant="certificate_status.color" id="certificate-status">{{certificate_status.label}}</b-badge></h6>
      <h6 class="m-1 "><b-badge variant="light"><font-awesome-icon icon="tshirt"/></b-badge>&nbsp;{{participantData.participant_tee_shirt_size}}</h6>
      <h6 class="m-1 " style="text-transform: none"><b-badge variant="light"><font-awesome-icon icon="users"/></b-badge>&nbsp;{{team_of_participant.name}} <span class="font-italic" style="color: #5e5e5e">({{team_of_participant.category}})</span></h6>
      <h6 class="m-1 " style="text-transform: none"><b-badge variant="light"><font-awesome-icon icon="comment"/></b-badge>&nbsp;{{participantData.participant_comment}}</h6>
      <h6 class="m-1 " style="text-transform: none"><b-badge variant="light"><font-awesome-icon icon="reply-all"/></b-badge>&nbsp;{{participantData.participant_message}}</h6>
      <h6 class="text-center">
        <button class="btn btn-sm btn-primary m-auto btn-modify-row" @click="modifyRow"><span class="ti-pencil"> </span> Edit</button>&nbsp;
        <button v-show="participantData.participant_medical_certificate_file" class="btn btn-sm btn-secondary m-auto" @click="openMedicalCertificate"><font-awesome-icon icon="file-medical"/> MC</button>&nbsp;
        <button v-show="participantData.participant_student_certificate_file" class="btn btn-sm btn-secondary m-auto" @click="openStudentCertificate"><font-awesome-icon icon="graduation-cap"/> SC</button>&nbsp;
      </h6>
    </card>
</template>
<script>
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
export default {
  components: {
      FontAwesomeIcon
  },
  name: 'participant-card-detail',
  props:{
      participantData: Object,
      participantId: String
  },
  data(){
      return {
          color: "rgb(255, 252, 244)",
          categoriesData: {}
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
              case 3: return {color:"primary" ,label:"To check"}; break;
              default: return "Error";
          }
      },
      certificate_status: function(){
          switch(this.participantData.participant_medical_certificate_valid){
              case 0: return {color:"danger" ,label:"Not uploaded"}; break;
              case 1: return {color:"success" ,label:"Valid"}; break;
              case 2: return {color:"danger" ,label:"Unvalid/Fake"}; break;
              case 3: return {color:"primary" ,label:"To check"}; break;
              default: return "Error";
          }
      },
      certificate_student_status: function(){
          switch(this.participantData.participant_student_certificate_valid){
              case 0: return {color:"danger" ,label:"Not uploaded"}; break;
              case 1: return {color:"success" ,label:"Valid"}; break;
              case 2: return {color:"danger" ,label:"Unvalid/Fake"}; break;
              case 3: return {color:"primary" ,label:"To check"}; break;
              case 4: return {color:"success" ,label:"Not necessary"}; break;
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
      team_of_participant: function(){
          var res = {
              name: this.participantData.participant_team.team_name,
              category: this.participantData.participant_team.team_category.category_label
          };
          switch(this.participantData.participant_team.team_valid){
              case 0: res.status = {color:"primary" ,label:"In progress"}; break;
              case 1: res.status = {color:"success" ,label:"Valid"}; break;
              case 2: res.status = {color:"danger" ,label:"Rejected"}; break;
              default: break;
          }
          return res;
      }
  },
  watch: {
      participantId: function(n, o){
          if(n == this.participantData.participant_id){
              this.color = "rgba(158, 233, 244, 0.3)";
          } else {
              this.color = "rgb(255, 252, 244)";
          }
      }
  },
  methods: {
      modifyRow: function(el){
          this.$emit("openModalUpdateRow", this.participantData.participant_id);
      },
      openMedicalCertificate: function(el){
          this.axios.request({
              url: "/participants/medical-certificate-file/"+this.participantData.participant_id,
              responseType: 'blob',
              method: "get",
          })
          .then(response => {
              var fileURL = window.URL.createObjectURL(new Blob([response.data], {type: response.headers["content-type"]}));
              var win = window.open(fileURL, "_blank");
          })
          .catch(err => {
              console.log(err);
          });
      },
      openStudentCertificate: function(el){
          this.axios.request({
              url: "/participants/student-certificate-file/"+this.participantData.participant_id,
              responseType: 'blob',
              method: "get",
          })
              .then(response => {
                  var fileURL = window.URL.createObjectURL(new Blob([response.data], {type: response.headers["content-type"]}));
                  var win = window.open(fileURL, "_blank");
              })
              .catch(err => {
                  console.log(err);
              });
      }
  }
};
</script>
<style>
</style>
