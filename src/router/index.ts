import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import LoginPage from "@/views/login-page.vue";
import RegisterPage from "@/views/register-page.vue";
import HomePage from "@/views/home-page.vue";
import ResultsPage from "@/views/results-page.vue";
import ProjectsPage from "@/views/projects-page.vue";
import TasksPage from "@/views/tasks-page.vue";
import ResoursesPage from "@/views/resourses-page.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/tasks",
    name: "Tasks",
    component: TasksPage,
  },
  {
    path: "/resources",
    name: "Tasks",
    component: ResoursesPage,
  },
  {
    path: "/login",
    name: "Login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: LoginPage,
  },
  {
    path: "/Register",
    name: "Register",
    component: RegisterPage,
  },
  {
    path: "/Results",
    name: "Results",
    component: ResultsPage,
  },
  {
    path: "/Projects",
    name: "Projects",
    component: ProjectsPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
