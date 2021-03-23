import Vue from "vue";
import VueRouter from "vue-router";
import Register from "../views/auth/Register";
import Login from "../views/auth/Login";
import Dashboard from "../views/Dashboard";
import store from "../store/index";
import About from "../views/About";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      auth: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((x) => x.meta.auth);
  const ifIsAuth = store.getters.ifIsAuth;

  // redirect routes from main app
  if (to.path === "/") {
    if (ifIsAuth) {
      next("/dashboard");
    } else {
      next("/about");
    }
  }

  if (requiresAuth && !ifIsAuth) {
    next("/login");
  } else if (to.path === "/dashboard") {
    // fetch all dashboard data before loadin dashboard component
    store.dispatch("fetchWorkoutCollection");
    store.dispatch("fetchTagsCollection");
    next();
  } else {
    next();
  }
});

export default router;
