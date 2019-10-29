import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import axios from 'axios'
import VueAxios from 'vue-axios';
import serverConfig from './../config/config';

// config api requests
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = serverConfig["courses24maker-api-server-dev"];
} else if (process.env.NODE_ENV == 'production') {
  axios.defaults.baseURL = serverConfig["courses24maker-api-server-prod"];
}

Vue.use(VueAxios, axios);
Vue.use(VueRouter);

// configure router
const router = new VueRouter({
  mode: 'history',
  routes, // short for routes: routes
  linkActiveClass: "active"
});

router.beforeEach((to, from, next) => {
  if (to.fullPath != '/login') {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.getItem('jwt') == null) {
        next({
          path: '/login',
          params: {nextUrl: to.fullPath}
        })
      } else {
        let user = localStorage.getItem('user');
        let isAdmin = localStorage.getItem('isAdmin');
        if (to.matched.some(record => record.meta.isAdmin)) {
          if (isAdmin == "true") {
            next();
          } else {
            next({
              path: '/login',
              params: {nextUrl: to.fullPath}
            })
          }
        } else {
          next()
        }
      }
    } else if (to.matched.some(record => record.meta.guest)) {
      if (localStorage.getItem('jwt') == null) {
        next()
      } else {
        next({
          path: '/login',
          params: {nextUrl: to.fullPath}
        })
      }
    } else {
      next()
    }
  } else {
    next();
  }
});

export default router;
