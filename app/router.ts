import Vue from "vue";
import Router from "vue-router";

// import Home from "./views/Home";

// import Accueil from "./views/Accueil";
const Accueil = () => import(/* webpackChunkName: "home" */ "./views/Accueil");
const Demo = () => import(/* webpackChunkName: "about" */ "./views/Demo");
const GettingStarted = () =>
  import(/* webpackChunkName: "getting-started" */ "./views/GettingStarted");

Vue.use(Router);

export default new Router({
  routes: [
    // {
    //   component: Home,
    //   name: "home",
    //   path: "/"
    // },
    {
        component: Accueil,
        name: "accueil",
        path: "/"
      },
    {
      component: GettingStarted,
      name: "getting-started",
      path: "/getting-started"
    },
    {
      component: Demo,
      name: "demo",
      path: "/demo"
    }
  ]
});
