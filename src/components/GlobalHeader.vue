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
            <img alt="logo" class="logo" src="../assets/logo.jpg" />
            <div class="title">BSOJ</div>
          </div>
        </a-menu-item>
        <a-menu-item key="/" class="item"> 首页</a-menu-item>
        <a-menu-item key="/discuss"> 讨论</a-menu-item>
        <a-sub-menu v-for="item in visibleRoutes" :key="item.path">
          <template #title>{{ item.name }}</template>
          <a-menu-item v-for="ele in filterSonMenu(item)" :key="ele.path">
            {{ ele.name }}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-col>
    <!--头像-->
    <a-col :style="{ padding: 0, marginRight: '50px' }" flex="150px">
      <a-button-group>
        <a-button
          v-if="loginUser.userRole === AccessEnum.NOT_LOGIN"
          status="normal"
          type="text"
          @click="goLogin"
          >登录
        </a-button>
        <a-button
          v-if="loginUser.userRole === AccessEnum.NOT_LOGIN"
          status="warning"
          type="text"
          @click="goRegister"
          >注册
        </a-button>
        <a-button
          v-if="loginUser.userRole !== AccessEnum.NOT_LOGIN"
          status="success"
          type="text"
          @click="goLogin"
          >重新登录
        </a-button>
        <a-popconfirm
          v-if="loginUser.userRole !== AccessEnum.NOT_LOGIN"
          :onOk="() => handleLogout()"
          content="确定要退出登录吗?"
          type="warning"
        >
          <a-button status="danger" type="text">退出登录</a-button>
        </a-popconfirm>
        <a-popover
          position="top"
          v-if="loginUser.userRole !== AccessEnum.NOT_LOGIN"
        >
          <template #content>点击查看详情</template>
          <a-space :style="{ marginLeft: '10px' }" size="large">
            <a-avatar
              id="avatar"
              :imageUrl="loginUser?.userAvatar"
              @click="goUserInfo"
            ></a-avatar>
          </a-space>
        </a-popover>
      </a-button-group>
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
const goRegister = () => {
  router.push({
    path: "/user/register",
    replace: true,
  });
};
// 过滤二级子菜单
const filterSonMenu = (item: any) => {
  if (item.children) {
    item.children = item.children.filter((child: any) => {
      // 过滤掉那些 meta.hideMenu 为 true 的子菜单项
      if (child.meta?.hideInMenu) {
        return false;
      }
      // 权限过滤
      if (!checkAccess(loginUser, child.meta?.access as string)) {
        return false;
      }
      return true;
    });
  }
  return item.children;
};

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
const goLogin = () => {
  router.push({ path: "/user/login", replace: true });
};
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
const toPersonalCenter = () => {
  router.push({ path: "/user/info" });
};
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
const goUserInfo = () => {
  router.push({
    path: "/user/info",
    replace: false,
  });
};
// 页面刷新时获取用户信息
// onMounted(async () => {
//   userStore.getLoginUser();
// });
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

.item {
  color: #f08ee6;
}
</style>
