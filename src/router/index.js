import Vue from 'vue'
import Router from 'vue-router'
// 全加载
// import Index from '../components/Index'
// 懒加载
const Index = () => import('../pages/Index.vue')
const Layout = () => import('../components/Layout.vue')
const printerManagement = () => import('../pages/printerManagement.vue')
const deviceAnomalyDetection = () => import('../pages/deviceAnomalyDetection.vue')
const Login = () => import('../pages/Login.vue')
const homePage = () => import('../pages/homePage.vue')
const manage_user = () => import('../pages/manage_user.vue')
const roleManagement = () => import('../pages/roleManagement.vue')
const privilegeManagement = () => import('../pages/privilegeManagement.vue')
const resourceManagement = () => import('../pages/resourceManagement.vue')
const rolePermissionManagement = () => import('../pages/rolePermissionManagement.vue')
const manage_unit = () => import('../pages/manage_unit.vue')
const manage_log = () => import('../pages/manage_log.vue')

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    component: homePage
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/printerManagement',
    component: printerManagement
  }, {
    path: '/deviceAnomalyDetection/:id',
    component: deviceAnomalyDetection
  }, {
    path: '/manage_user',
    component: manage_user
  }, {
    path: '/manage_unit',
    component: manage_unit
  }, {
    path: '/manage_log',
    component: manage_log
  }, {
    path: '/roleManagement',
    component: roleManagement
  }, {
    path: '/privilegeManagement',
    component: privilegeManagement
  }, {
    path: '/rolePermissionManagement',
    component: rolePermissionManagement
  }, {
    path: '/resourceManagement',
    component: resourceManagement
  }]
})