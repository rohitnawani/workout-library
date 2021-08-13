import Vue from "vue";
import VueRouter from "vue-router";
import Register from "../views/auth/Register";
import Login from "../views/auth/Login";
import WorkoutDashboard from "../views/WorkoutDashboard";
import ExerciseDashboard from "../views/ExerciseDashboard";
import store from "../store/index";
import About from "../views/About";
import RandomGenerator from "../views/RandomGenerator";

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
    path: "/workout-dashboard",
    name: "WorkoutDashboard",
    component: WorkoutDashboard,
    meta: {
      auth: true,
    },
  },
  {
    path: "/exercise-dashboard",
    name: "ExerciseDashboard",
    component: ExerciseDashboard,
    meta: {
      auth: true,
    },
  },
  {
    path: "/why-not",
    name: "RandomGenerator",
    component: RandomGenerator,
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
      next("/workout-dashboard");
    } else {
      next("/about");
    }
  }

  if (requiresAuth && !ifIsAuth) {
    next("/login");
  } else if (to.path === "/workout-dashboard") {
    // fetch all dashboard data before loadin dashboard component
    store.dispatch("fetchWorkoutCollection");
    store.dispatch("fetchTagsCollection");
    next();
  } else {
    next();
  }
});

export default router;
