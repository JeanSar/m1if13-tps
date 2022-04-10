import { createRouter, createWebHashHistory } from 'vue-router'
import LoginPage from "@/views/LoginPage";
import HomePage from "@/views/HomePage";

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomePage
  },
  {
    path: '/',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: LoginPage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
