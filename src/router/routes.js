import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Dashboard from "@/pages/Dashboard.vue";
import CategoryPage from "@/pages/CategoryPage";
import TeamPage from "@/pages/TeamPage";
import ParticipantPage from "@/pages/ParticipantPage";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard
      },
      {
        path: "category",
        name: "categories",
        component: CategoryPage
      },
      {
        path: "team",
        name: "teams",
        component: TeamPage
      },
      {
        path: "participant",
        name: "participants",
        component: ParticipantPage
      }
    ]
  },
  {
    path: "/admin"
  },
  { path: "*", component: NotFound }
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
