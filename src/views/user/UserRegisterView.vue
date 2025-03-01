<template>
  <!--  添加背景图片-->
  <div class="login-container">
    <a-card :bordered="false" class="login-card"
      ><h2 style="text-align: center; margin-bottom: 30px">注册</h2>
      <a-form :model="form" layout="vertical">
        <!-- 账号输入框 -->
        <a-form-item field="userAccount" label="账号">
          <a-input
            v-model="form.userAccount"
            allow-clear
            placeholder="账号不少于4位"
          />
        </a-form-item>
        <!-- 密码输入框 -->
        <a-form-item field="userPassword" label="密码">
          <a-input-password
            v-model="form.userPassword"
            allow-clear
            placeholder="密码不少于8位"
          />
        </a-form-item>
        <a-form-item field="userPassword" label="确认密码">
          <a-input-password
            v-model="form.checkPassword"
            allow-clear
            placeholder="请输入确认密码"
          />
        </a-form-item>
        <a-form-item field="userCode" label="标识码">
          <a-input-password
            v-model="form.userCode"
            allow-clear
            placeholder="老师注册需要输入标识码"
          />
        </a-form-item>
        <!-- 操作按钮 -->
        <div class="button-group">
          <a-button
            :loading="loading"
            long
            type="primary"
            @click="handleRegister"
          >
            注册
          </a-button>
          <!-- 返回登录界面 -->
          <div class="back-login">
            <router-link to="/user/login">返回登录</router-link>
          </div>
        </div>
      </a-form>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modulers/user";
import { UserControllerService } from "../../../generated";
// 表单数据
const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
  // 老师注册需要输入标识码
  userCode: "",
});

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const handleRegister = async () => {
  if (!form.userAccount || !form.userPassword || !form.checkPassword) {
    Message.warning("请输入完整的登录信息");
    return;
  }
  try {
    loading.value = true;
    // 登录接口调用
    const res = await UserControllerService.userRegisterUsingPost(form);
    if (res.code == 0) {
      // 登录成功，跳转到主页
      await userStore.getLoginUser();
      Message.success("注册成功");
      router.push({
        path: "/user/login",
        replace: true,
      });
    } else {
      Message.error(res.message);
    }
  } catch (error) {
    Message.error(error.message);
  } finally {
    loading.value = false;
  }
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

.back-login {
  margin-top: 10px;
  text-align: center;
  color: var(--color-primary);
}
</style>
