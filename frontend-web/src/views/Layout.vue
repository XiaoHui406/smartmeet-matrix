<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom,
    Comment,
    Menu,
    View,
    Bell,
    List
} from '@element-plus/icons-vue'
import avatar from '../assets/default.png'
import { userInfoService } from '../api/use'
import { userInfoStore } from '../stores/userInfo'
const usersInfoStore = userInfoStore();
import { useRouter } from 'vue-router';
const router = useRouter();
import { ElMessage, ElMessageBox } from 'element-plus';
import { useTokenStore } from '../stores/token'
const tokenStore = useTokenStore();
//调用函数，获取用户详细信息
const getUserInfo = async () => {
    //调用接口
    let result = await userInfoService();
    console.log(result);
    //数据存储到pinia中
    usersInfoStore.setInfo(result.data);

}
getUserInfo();

//头部下拉单
const handleCommand = (command) => {
    switch (command) {
        case 'info':
            router.push('/user/info');
            break;
        case 'avatar':
            router.push('/user/avatar');
            break;
        case 'password':
            router.push('/user/password');
            break;
        case 'logout':
            //退出登录
            //提示框
            ElMessageBox.confirm(
                '确认要退出吗?',
                '温馨提示',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
                .then(async () => {
                    tokenStore.removeToken();
                    usersInfoStore.removeInfo();
                    //跳转到登录页面
                    router.push('/login');

                    ElMessage({
                        type: 'success',
                        message: '退出登录成功',
                    })
                })
                .catch(() => {
                    ElMessage({
                        type: 'info',
                        message: '取消退出登录',
                    })
                })
            break;
    }
}

</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单  -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <el-menu active-text-color="#483D8B" background-color="#00BFFF" text-color="#fff" router>

                <el-menu-item index="/home">
                    <el-icon>
                        <Menu />
                    </el-icon>
                    <span>首页</span>
                </el-menu-item>

                <el-sub-menu>
                    <template #title>
                        <el-icon>
                            <Comment />
                        </el-icon>
                        <span>会议</span>
                    </template>
                    <el-menu-item index="/meet/manage">
                        <el-icon>
                            <Promotion />
                        </el-icon>
                        <span>会议管理</span>
                    </el-menu-item>
                    <el-menu-item index="/meet/category">
                        <el-icon>
                            <Management />
                        </el-icon>
                        <span>组织管理</span>
                    </el-menu-item>
                    <el-menu-item index="/meet/browse">
                        <el-icon>
                            <View />
                        </el-icon>
                        <span>参会管理</span>
                    </el-menu-item>
                    <el-menu-item index="/meet/infoDetail">
                        <el-icon>
                            <List />
                        </el-icon>
                        <span>消息管理</span>
                    </el-menu-item>
                </el-sub-menu>

                <el-sub-menu>
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/user/info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/user/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>更换头像</span>
                    </el-menu-item>
                    <el-menu-item index="/user/password">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div> 当前登录：<strong>{{ usersInfoStore.info.username }}</strong> </div>

                <div>
                    <el-dropdown placement="bottom-end" @command="handleCommand">
                        <span class="el-dropdown__box">
                            <el-avatar :src="usersInfoStore.info.userPic ? usersInfoStore.info.userPic : avatar" />
                            <el-icon>
                                <CaretBottom />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
                                <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                                <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
                                <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </el-header>
            <el-main>
                <router-view></router-view>` `
            </el-main>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;
    background: linear-gradient(160deg, rgba(230, 247, 255, 0.5) 80%, rgba(214, 242, 255, 0.8) 40%);

    .el-aside {
        background-color: #00BFFF;

        &__logo {
            height: 120px;
            background: url('../assets/1111.png') no-repeat center / 210px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }

    .item {
        margin-right: 15px;margin-top: 15px;
    }
}
</style>