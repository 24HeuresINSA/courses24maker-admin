<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/dashboard" name="Dashboard" icon="ti-panel"/>
        <sidebar-link to="/category" name="Categories" icon="ti-cup"/>
        <sidebar-link to="/team" name="Teams" icon="ti-hand-open"/>
        <sidebar-link to="/participant" name="Participants" icon="ti-user"/>
      </template>
      <mobile-menu>
        <li class="nav-item">
          <a href="/logout" class="nav-link">
            <i class="ti-power-off"></i>
            <p>Logout</p>
          </a>
        </li>
        <li class="divider"></li>
      </mobile-menu>
    </side-bar>
    <div class="main-panel" style="z-index: 0" id="main-panel-dashboard-layout">
      <top-navbar></top-navbar>
      <dashboard-content @click.native="toggleSidebar" @toggleSpinner="toggleSpinner">
      </dashboard-content>
      <content-footer></content-footer>
      <spinner v-show="showSpinner"></spinner>
    </div>
  </div>
</template>
<style>
</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
import Spinner from "./Spinner";
import $ from 'jquery';
export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu,
    Spinner
  },
  data(){
      return {
          showSpinner: false
      };
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    toggleSpinner() {
        $('#main-panel-dashboard-layout').toggleClass('overflow-hidden');
        if (this.showSpinner) {
            this.showSpinner = false;
        } else {
            this.showSpinner = true;
        }
    }
  }
};
</script>
