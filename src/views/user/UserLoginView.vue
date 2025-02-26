<template>
  <!--  添加背景图片-->
  <div class="login-container">
    <a-card :bordered="false" class="login-card"
      ><h2 style="text-align: center; margin-bottom: 30px">
        在线编程题目评测系统
      </h2>
      <a-form :model="form" layout="vertical">
        <!-- 账号输入框 -->
        <a-form-item field="userAccount" label="账号">
          <a-input
            v-model="form.userAccount"
            allow-clear
            placeholder="请输入账号"
          />
        </a-form-item>
        <!-- 密码输入框 -->
        <a-form-item field="userPassword" label="密码">
          <a-input-password
            v-model="form.userPassword"
            allow-clear
            placeholder="请输入密码"
          />
        </a-form-item>
        <!-- 操作按钮 -->
        <div class="button-group">
          <a-button :loading="loading" long type="primary" @click="handleLogin">
            登录
          </a-button>
          <a-button
            long
            style="margin-top: 10px"
            type="outline"
            @click="handleRegister"
          >
            注册
          </a-button>
        </div>
      </a-form>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { UserControllerService } from "../../../generated";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modulers/user";
import message from "@arco-design/web-vue/es/message";
// 表单数据
const form = reactive({
  userAccount: "",
  userPassword: "",
});

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const handleLogin = async () => {
  if (!form.userAccount || !form.userPassword) {
    message.warning("请输入完整的登录信息");
    return;
  }
  try {
    loading.value = true;
    // 登录接口调用
    const res = await UserControllerService.userLoginUsingPost(form);
    if (res.code == 0) {
      // 登录成功，跳转到主页
      await userStore.getLoginUser();
      message.success("登录成功");
      router.push({
        path: "/",
        replace: true,
      });
    } else {
      message.error(res.message);
    }
  } catch (error) {
    message.error(error.message);
  } finally {
    loading.value = false;
  }
};
const handleRegister = () => {
  // 跳转到注册页面或显示注册弹窗
  message.info("前往注册");
  router.push({
    path: "/user/register",
    replace: false,
  });
};
</script>
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-fill-2);
  background-image: url("@/assets/00.jpg");
  background-size: cover;
}

.login-card {
  width: 380px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.button-group {
  margin-top: 30px;
}
</style>
