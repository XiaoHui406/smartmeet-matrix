import {createRouter,createWebHistory} from 'vue-router';
import LoginVue from '../views/Login.vue';
import Layout from '../views/Layout.vue';
import MeetCategory from '../views/meet/MeetCategory.vue';
import MeetManage from '../views/meet/MeetManage.vue';
import UserInfo from '../views/user/UserInfo.vue';
import UserAvatar from '../views/user/UserAvatar.vue';
import UserResetPassword from '../views/user/UserResetPassword.vue';
import Home from '../views/Home.vue'
import Browse from '../views/meet/MeetBrowse.vue'
import MeetDetail from '../views/meet/meetDetail.vue'
import MeetUpdate from '@/views/meet/MeetUpdate.vue'
import MeetAdd from '@/views/meet/MeetAdd.vue'
import infoDetail from '@/views/meet/infoDetail.vue'

const routes = [
{path:'/login',component:LoginVue},
{    path:'/',
    component:Layout,
    //重定向
    redirect: '/home',
    children:[
        {path:'/home',component:Home},
        {path:'/meet/category',component:MeetCategory},
        {path:'/meet/manage',component:MeetManage},
        {path:'/user/info',component:UserInfo},
        {path:'/user/avatar',component:UserAvatar},
        {path:'/meet/browse',component:Browse},
        { path: '/meet/:id',name: 'MeetDetail', component: MeetDetail,props: true},
        { path: '/meet/update/:id',name: 'MeetUpdate', component: MeetUpdate,props: true},
        { path: '/meet/add',name: 'MeetAdd', component: MeetAdd },
        { path: '/meet/infoDetail',component: infoDetail },
        {path:'/user/password',component:UserResetPassword}
    ]


}
]

const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

export default router;