<template>
  <div class="profile-container">
    <a-card :bordered="false" class="profile-card">
      <!-- 头部标题 -->
      <div class="header">
        <h2>个人中心</h2>
        <a-button :loading="saving" type="primary" @click="handleSave">
          <template #icon>
            <icon-save />
          </template>
          保存修改
        </a-button>
      </div>

      <!-- 个人信息表单 -->
      <a-form :model="formData" class="profile-form" layout="vertical">
        <!--        头像-->
        <a-space :style="{ width: '100%' }" align="center" direction="vertical">
          <a-avatar :size="64" shape="square"
            ><img :src="formData.userAvatar"
          /></a-avatar>
          <a-upload
            :show-file-list="false"
            :with-credentials="true"
            action="http://localhost:8121/api/file/upload/avatar"
            @change="onChange"
            @progress="onProgress"
            @success="onSuccess"
          />
        </a-space>
        <a-form-item
          :rules="[{ required: true, message: '用户名不能为空' }]"
          field="userName"
          label="用户名"
        >
          <a-input
            v-model="formData.userName"
            allow-clear
            placeholder="请输入用户名"
          />
        </a-form-item>

        <a-form-item field="userRole" label="用户角色">
          <a-select
            v-model="formData.userRole"
            :options="roleOptions"
            disabled
            placeholder="选择用户角色"
          />
        </a-form-item>

        <a-form-item field="userProfile" label="个人简介">
          <a-textarea
            v-model="formData.userProfile"
            :auto-size="{ minRows: 3 }"
            max-length="200"
            placeholder="介绍一下你自己..."
            show-word-limit
          />
        </a-form-item>

        <a-form-item field="createTime" label="注册时间">
          <a-input :model-value="formatTime(formData.createTime)" disabled />
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import dayjs from "dayjs";
import { UserControllerService } from "../../../generated";
import { useUserStore } from "@/store/modulers/user";
import message from "@arco-design/web-vue/es/message";

interface UserProfile {
  id: number;
  userName: string;
  userAvatar: string;
  userProfile: string;
  userRole: string;
  createTime: string;
  updateTime: string;
}

const file = ref();

const onChange = (_, currentFile) => {
  file.value = {
    ...currentFile,
    url: URL.createObjectURL(currentFile.file),
  };
};
const onProgress = (currentFile) => {
  file.value = currentFile;
};
const onSuccess = (res) => {
  file.value = {
    ...file.value,
    status: "done",
    url: res.response.data,
  };
  console.log("头像返回的的信息" + file.value.url);
  formData.value.userAvatar = file.value.url;
};
const login = useUserStore();
// 表单数据
const formData = ref<UserProfile>({
  id: 0,
  userName: "",
  userAvatar: "",
  userProfile: "",
  userRole: "",
  createTime: "",
  updateTime: "",
});
file.value = formData.value.userAvatar;
// 角色选项
const roleOptions = [
  { label: "学生", value: "student" },
  { label: "管理员", value: "admin" },
  { label: "教师", value: "teacher" },
];

// 加载状态
const saving = ref(false);

// 加载用户信息
const loadProfile = async () => {
  try {
    const res = await UserControllerService.getLoginUserUsingGet();
    if (res.code == 0) {
      formData.value = res.data;
    } else {
      message.error(res.message);
    }
  } catch (err) {
    message.error("加载用户信息失败");
  }
};

// 保存修改
const handleSave = async () => {
  try {
    saving.value = true;
    const res = await UserControllerService.updateMyUserUsingPost(
      formData.value
    );
    if (res.code === 0) {
      message.success("信息更新成功");
      await loadProfile(); // 重新加载最新数据
      await login.getLoginUser();
    } else {
      message.error(res.message);
    }
  } catch (err) {
    message.error("保存失败");
  } finally {
    saving.value = false;
  }
};

// 时间格式化
const formatTime = (time: string) => {
  return time ? dayjs(time).format("YYYY-MM-DD HH:mm") : "-";
};

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.profile-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-2);
}

.avatar-section {
  text-align: center;
  margin-bottom: 24px;

  .avatar {
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
    }

    :deep(.arco-avatar-trigger-icon-button) {
      background: rgba(0, 0, 0, 0.5);

      .camera-icon {
        font-size: 24px;
        color: white;
      }
    }
  }
}

.profile-form {
  :deep(.arco-form-item-label-col) {
    flex: 0 0 100px;
  }

  :deep(.arco-input-wrapper) {
    border-radius: 6px;
  }
}
</style>
