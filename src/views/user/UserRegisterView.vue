<template>
  <!--  注册页面-->
  <a-form
    ref="formRef"
    :model="form"
    :rules="rules"
    :style="{ width: '600px' }"
    @submit="handleSubmit"
  >
    <a-form-item
      :rules="[{ match: /one/, message: 'must select one' }]"
      field="radio"
      label="角色"
    >
      <a-radio-group v-model="form.role">
        <a-radio value="student">学生</a-radio>
        <a-radio value="teacher">教师</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item field="name" label="账号" validate-trigger="blur">
      <a-input
        v-model="form.userAccount"
        placeholder="please enter your username..."
      />
    </a-form-item>
    <a-form-item field="password" label="密码" validate-trigger="blur">
      <a-input-password
        v-model="form.userPassword"
        placeholder="please enter your password..."
      />
    </a-form-item>
    <a-form-item field="password2" label="确认密码" validate-trigger="blur">
      <a-input-password
        v-model="form.checkPassword"
        placeholder="please confirm your password..."
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button html-type="submit">Submit</a-button>
        <a-button @click="$refs.formRef.resetFields()">Reset</a-button>
      </a-space>
    </a-form-item>
  </a-form>
  {{ form }}
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modulers/user";
import message from "@arco-design/web-vue/es/message";

/**
 * 注册表单数据
 */
const form = reactive({
  checkPassword: "",
  role: "",
  userAccount: "",
  userPassword: "",
} as UserRegisterRequest);

const router = useRouter();

// 注册
const handleSubmit = async () => {
  const res = await UserControllerService.userRegisterUsingPost(form);
  // 注册成功，跳转到登录页面
  if (res.code === 0) {
    message.success("注册成功，请登录");
    // 跳转到登录页面
    router.push({
      path: "/user/login",
      replace: true,
    });
  } else {
    message.error("注册失败" + res.message);
  }
};

// 表单验证规则
const rules = {
  userAccount: [
    {
      required: true,
      message: "账号不能为空",
    },
  ],
  userPassword: [
    {
      required: true,
      message: "密码不能为空",
    },
  ],
  checkPassword: [
    {
      required: true,
      message: "确认密码不能为空",
    },
    {
      validator: (value, cb) => {
        if (value !== form.userPassword) {
          cb("两次密码不一致");
        } else {
          cb();
        }
      },
    },
  ],
  match: [
    {
      required: true,
      validator: (value, cb) => {
        return new Promise((resolve) => {
          if (!value) {
            cb("Please enter match");
          }
          if (value !== "match") {
            cb("match must be match!");
          }
          resolve();
        });
      },
    },
  ],
};
</script>
