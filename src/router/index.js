import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import axios from 'axios'
import VueAxios from 'vue-axios';

// config api requests
axios.defaults.baseURL = "http://localhost:3020/";
axios.defaults.headers.common['Authorization'] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjb3Vyc2VzLWFwaS0yNGhpbnNhIiwiYXVkIjoiY291cnNlcy1hZG1pbi0yNGhpbnNhIiwic3ViIjoiY291cnNlcy1hZG1pbi0yNGhpbnNhIiwic2NvcGUiOiJhZG1pbiIsImlhdCI6MTU2ODg5NDU2Nn0.cSgrgkzC0amaXZ7_oinXaOMynmdbskvLqbJy_1TeU-o";

Vue.use(VueAxios, axios);
Vue.use(VueRouter);

// configure router
const router = new VueRouter({
  mode: 'history',
  routes, // short for routes: routes
  linkActiveClass: "active"
});

export default router;
