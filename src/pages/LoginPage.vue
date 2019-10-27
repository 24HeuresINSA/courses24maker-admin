<template>
  <div>
    <div class="row">
      <card class="m-auto">
        <b-form-group label="User" size="sm">
          <b-form-input v-model="form.user" type="text" value=""></b-form-input>
        </b-form-group>
        <b-form-group label="Password" size="sm">
          <b-form-input v-model="form.password" type="password" value=""></b-form-input>
        </b-form-group>
        <div class="text-center">
          <b-button class="m-auto text-center" @click="loginApi">Login</b-button>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
import NotificationTemplate from "./Notifications/NotificationTemplate";

export default {
  components: {
  },

  data() {
    return {
        form: {category: {}},
    };
  },
  methods: {
      loginApi() {

          this.axios.request({
              url: "/authentication/login",
              method: "post",
              data: this.form
          })
          .then(response => {
            localStorage.setItem("jwt", response.data.jwt);
            localStorage.setItem("user", response.data.user);
            localStorage.setItem("isAdmin", response.data.isAdmin);
            window.location.href = '/dashboard';
          })
          .catch(error => {
              if(error.hasOwnProperty("response")) {
                  this.$notify({
                      component: NotificationTemplate,
                      horizontalAlign: 'center',
                      verticalAlign: 'top',
                      type: "danger",
                      message: error.response.data.message.en,
                      timeout: 5000
                  });
              }
          });

      }
  }
};
</script>
<style>
</style>
