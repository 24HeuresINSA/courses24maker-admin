import Vue from "vue";
import App from "./App";
import router from "./router/index";
import axios from 'axios'
import VueAxios from 'vue-axios'
import BootstrapVue from 'bootstrap-vue'
import JsonCSV from 'vue-json-csv'
import VueSessionStorage from 'vue-sessionstorage'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import vSelect from 'vue-select'

import PaperDashboard from "./plugins/paperDashboard";
import "vue-notifyjs/themes/default.css";
import 'vue-select/dist/vue-select.css';
import 'vue-search-select/dist/VueSearchSelect.css'

library.add(fas);
library.add(fab);

Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(VueSessionStorage);
Vue.component('v-select', vSelect)
Vue.component('downloadCsv', JsonCSV);
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.axios.defaults.headers = { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjb3Vyc2VzLWFwaS0yNGhpbnNhIiwiYXVkIjoiY291cnNlcy1hZG1pbi0yNGhpbnNhIiwic3ViIjoiY291cnNlcy1hZG1pbi0yNGhpbnNhIiwic2NvcGUiOiJhZG1pbiIsImlhdCI6MTU2NDQ4NDMzMX0.7COv0CGADczXXOqlP0b1AutT0EoSBlSwSjeC8RUOOIM' };
Vue.config.productionTip = false;

Vue.use(PaperDashboard);

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
