<template>
  <a-layout style="height: 400px">
    <a-layout>
      <a-layout-sider
        :collapsed="collapsed"
        :width="220"
        breakpoint="lg"
        collapsible
        theme="dark"
        @collapse="onCollapse"
      >
        <div class="logo" />
        <a-menu
          :defaultOpenKeys="['1']"
          :defaultSelectedKeys="['0_2']"
          @menuItemClick="onClickMenuItem"
        >
          <a-menu-item key="0_1" disabled>
            <IconHome />
            主页
          </a-menu-item>
          <a-sub-menu key="user">
            <template #title
              ><span><IconCalendar />用户管理</span></template
            >
            <a-menu-item key="student">学生管理</a-menu-item>
            <a-menu-item key="teacher">教师管理</a-menu-item>
          </a-sub-menu>
          <a-menu-item key="question">
            <IconCalendar />
            题目管理
          </a-menu-item>
          <a-menu-item key="post">
            <IconCalendar />
            帖子管理
          </a-menu-item>
          <a-menu-item key="notice">
            <IconCalendar />
            公告管理
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
    <!--    <a-layout-footer>Footer</a-layout-footer>-->
  </a-layout>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";

const router = useRouter();
const collapsed = ref(false);
const onCollapse = (val, type) => {
  const content = type === "responsive" ? "触发响应式收缩" : "点击触发收缩";
  Message.info({
    content,
    duration: 2000,
  });
  collapsed.value = val;
};
// 菜单点击事件
// const onClickMenuItem = (key) => {
//   // Message.info({ content: `You select ${key}`, showIcon: true });
//   router.push({
//     path: key
//   });
// };
const onClickMenuItem = (key: any) => {
  // 使用 router.push 进行页面跳转
  router.push({
    path: `/admin/${key}`,
  });
};
</script>
<style scoped>
.layout-demo {
  height: 500px;
  background: var(--color-fill-2);
  border: 1px solid var(--color-border);
}

.layout-demo :deep(.arco-layout-sider) .logo {
  height: 32px;
  margin: 12px 8px;
  background: rgba(255, 255, 255, 0.2);
}

.layout-demo :deep(.arco-layout-sider-light) .logo {
  background: var(--color-fill-2);
}

.layout-demo :deep(.arco-layout-header) {
  height: 64px;
  line-height: 64px;
  background: var(--color-bg-3);
}

.layout-demo :deep(.arco-layout-footer) {
  height: 48px;
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  line-height: 48px;
}

.layout-demo :deep(.arco-layout-content) {
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  background: var(--color-bg-3);
}

.layout-demo :deep(.arco-layout-footer),
.layout-demo :deep(.arco-layout-content) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--color-white);
  font-size: 16px;
  font-stretch: condensed;
  text-align: center;
}
</style>
