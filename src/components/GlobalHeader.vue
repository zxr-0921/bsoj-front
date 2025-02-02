<!--导航栏组件-->
<template>
  <a-row id="globalHeader" :wrap="false" align="center">
    <a-col flex="auto">
      <a-menu
        :selected-keys="selectedKeys"
        mode="horizontal"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img alt="logo" class="logo" src="../assets/oj-logo.svg" />
            <div class="title">BSOJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div v-if="loginUser.userRole !== AccessEnum.NOT_LOGIN">
        <a-dropdown trigger="click">
          <a-avatar
            :size="32"
            :style="{ marginRight: '8px', cursor: 'pointer' }"
            ><img :src="loginUser.userAvatar" alt="avatar"
          /></a-avatar>
          <template #content>
            <a-doption @click="$router.push({ name: 'Info' })">
              <!-- todo:页面还未开发-->
              <a-space>
                <icon-user />
                <span> 用户中心 </span></a-space
              >
            </a-doption>
            <a-doption @click="$router.push({ name: 'Setting' })">
              <a-space>
                <icon-settings />
                <span> 用户设置 </span></a-space
              >
            </a-doption>
            <a-doption @click="handleLogout">
              <a-space>
                <icon-export />
                <span> 退出登录 </span></a-space
              >
            </a-doption>
          </template>
        </a-dropdown>
        {{ viewName }}
      </div>
      <!-- 登录注册-->
      <a-button v-else type="text">
        <router-link class="no-underline" to="/user/login">登录</router-link>
      </a-button>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import checkAccess from "@/access/checkAccess";
import { useUserStore } from "@/store/modulers/user";
import AccessEnum from "@/access/accessEnum";
import { IconUser } from "@arco-design/web-vue/es/icon";
import { UserControllerService } from "../../generated";

const userStore = useUserStore();
const router = useRouter();
let loginUser = userStore.loginUser;
// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (!checkAccess(loginUser, item?.meta?.access as string)) {
      return false;
    }
    return true;
  });
});
// 退出登录
const handleLogout = async () => {
  // 退出登录
  const res = await UserControllerService.userLogoutUsingPost();
  if (res.code === 0) {
    // 清空用户信息
    userStore.$reset();
    // 跳转到登录页面
    router.push({ path: "/user/login", replace: true });
  }
};
// 用户视图名称
const viewName = computed(() => {
  if (loginUser.userRole !== AccessEnum.NOT_LOGIN) {
    if (loginUser.userName) {
      return loginUser.userName;
    } else {
      return "momo";
    }
  }
  return "";
});

// 默认主页
const selectedKeys = ref(["/"]);

// 路由跳转后，更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

console.log();

/*setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "鱼皮管理员",
    userRole: ACCESS_ENUM.ADMIN,
  });
}, 3000);*/

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
</script>

<style scoped>
.no-underline {
  text-decoration: none;
}

.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
