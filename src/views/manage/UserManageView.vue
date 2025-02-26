<template>
  <!--  <div id="userListView">-->
  <!--    查询栏-->
  <a-form :model="searchParams" layout="inline">
    <a-form-item field="uname" label="用户名" style="min-width: 240px">
      <a-input v-model="searchParams.userName" placeholder="请输入用户名" />
    </a-form-item>
    <a-form-item field="urole" label="角色" style="min-width: 240px">
      <a-select
        v-model="searchParams.userRole"
        allow-search
        placeholder="请选择角色"
      >
        <a-option :value="ACCESS_ENUM.ADMIN"> 管理员</a-option>
        <a-option :value="ACCESS_ENUM.TEACHER"> 教师</a-option>
        <a-option :value="ACCESS_ENUM.USER"> 学生</a-option>
        <a-option value="">不限</a-option>
      </a-select>
    </a-form-item>
    <a-form-item>
      <a-button :loading="loadingSubmit" type="primary" @click="doSubmit"
        >查询
      </a-button>
    </a-form-item>
  </a-form>
  <a-divider size="0" />
  <!--    表格-->
  <a-table
    :ref="tableRef"
    :columns="columns"
    :data="dataList"
    :loading="loadingList"
    :pagination="{
      showTotal: true,
      pageSize: searchParams.pageSize,
      current: searchParams.current,
      total,
    }"
    @page-change="onPageChange"
  >
    <template #index="{ rowIndex }">
      {{ rowIndex + 1 }}
    </template>
    <template #userAvatar="{ rowIndex }">
      <a-avatar :size="40" shape="square">
        <a-image :src="dataList[rowIndex].userAvatar" />
      </a-avatar>
    </template>
    <template #userProfile="{ rowIndex }">
      <a-space wrap>
        <a-tooltip
          :content="dataList[rowIndex].userProfile"
          background-color="#165DFF"
        >
          <a-button type="text">查看</a-button>
        </a-tooltip>
      </a-space>
    </template>
    <template #userRole="{ rowIndex }">
      <a-space wrap>
        <a-tag
          v-if="dataList[rowIndex].userRole === ACCESS_ENUM.ADMIN"
          color="#7816ff"
        >
          管理员
        </a-tag>
        <a-tag
          v-if="dataList[rowIndex].userRole === ACCESS_ENUM.USER"
          color="#00b42a"
        >
          学生
        </a-tag>
        <a-tag
          v-if="dataList[rowIndex].userRole === ACCESS_ENUM.TEACHER"
          color="#168cff"
        >
          教师
        </a-tag>
      </a-space>
    </template>
    <!--      封禁按钮-->
    <template #status="{ rowIndex }">
      <a-tag v-if="dataList[rowIndex].status == 1" bordered color="orangered"
        >封禁
      </a-tag>
      <a-tag v-if="dataList[rowIndex].status == 0" bordered color="green"
        >正常
      </a-tag>
    </template>
    <template #optional="{ record }">
      <a-space>
        <a-button status="warning" type="primary" @click="doUpdate(record)"
          >修改
        </a-button>
        <a-button
          v-if="!record.status"
          :loading="loadingDelete"
          status="danger"
          @click="doBan(record)"
          >封号
        </a-button>
        <a-button
          v-if="record.status"
          :loading="loadingDelete"
          status="success"
          @click="doFree(record)"
          >解封
        </a-button>
      </a-space>
    </template>
  </a-table>
  <!--信息修改对话框-->
  <a-modal
    v-model:visible="visible"
    :ok-loading="loadingOk"
    title="信息修改"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >
    <a-form :model="form">
      <a-form-item field="name" label="用户名" tooltip="用户名不多于 6 位">
        <a-input v-model="form.name" />
      </a-form-item>
      <a-form-item field="userRole" label="用户角色">
        <!--          更改用户角色-->
        <a-select v-model="form.userRole" allow-search placeholder="请选择角色">
          <a-option :value="ACCESS_ENUM.ADMIN">管理员</a-option>
          <a-option :value="ACCESS_ENUM.TEACHER">教师</a-option>
          <a-option :value="ACCESS_ENUM.USER"> 学生</a-option>
        </a-select>
      </a-form-item>
      <a-form-item
        field="userProfile"
        label="个人简介"
        tooltip="简介字数不得超过50"
      >
        <a-textarea
          v-model="form.profile"
          :auto-size="{
            minRows: 4,
            maxRows: 7,
          }"
          :max-length="50"
          allow-clear
          placeholder="请输入你的简介..."
          show-word-limit
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <!--  </div>-->
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";
import {
  User,
  UserControllerService,
  UserQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import ACCESS_ENUM from "@/access/accessEnum";
// import RESPONSE_ENUM from "@/common/enum/responseEnum";

/**
 * loading等状态
 */
const loadingList = ref(false);
const loadingSubmit = ref(false);
const loadingOk = ref(false);
const loadingDelete = ref(false);

const tableRef = ref();
const checkStatus = (status: string) => {
  return status ? "true" : "false";
};
const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  pageSize: 10,
  current: 1,
  userName: "",
  userRole: "",
} as UserQueryRequest);

const loadData = async () => {
  loadingList.value = true;
  const res = await UserControllerService.listUserByPageUsingPost(
    searchParams.value
  );
  loadingList.value = false;
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "序号",
    slotName: "index",
  },
  {
    title: "头像",
    dataIndex: "userAvatar",
    slotName: "userAvatar",
  },
  {
    title: "用户名",
    dataIndex: "userName",
  },
  {
    title: "账号",
    dataIndex: "userAccount",
  },
  {
    title: "简介",
    dataIndex: "userProfile",
    slotName: "userProfile",
  },
  {
    title: "角色",
    dataIndex: "userRole",
    slotName: "userRole",
  },
  //
  {
    title: "封禁",
    dataIndex: "status",
    slotName: "status",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  loadingSubmit.value = true;
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
  loadingSubmit.value = false;
};

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};
// 封号
const doBan = async (user: User) => {
  // 不能封禁自己
  const loginUser = JSON.parse(sessionStorage.getItem("user") as string);
  console.log(loginUser.loginUser.userId);
  if (loginUser?.loginUser.userId === user.id) {
    message.error("不能封禁自己！");
    return;
  }
  loadingDelete.value = true;
  const res = await UserControllerService.banUserUsingPost(user.id as number);
  loadingDelete.value = false;
  if (res.code === 0) {
    message.success("封禁成功！");
    await loadData();
  } else {
    message.error("封禁失败," + res.message);
  }
};
// 解封
const doFree = async (user: User) => {
  loadingDelete.value = true;
  const res = await UserControllerService.unbanUserUsingPost(user.id as number);
  loadingDelete.value = false;
  if (res.code === 0) {
    message.success("解封成功！");
    await loadData();
  } else {
    message.error("解封失败," + res.message);
  }
};

const visible = ref(false);
const form = ref({
  id: 0,
  name: "",
  // password: "",
  profile: "",
  userRole: "",
});
const handleBeforeOk = async () => {
  // 格式校验
  if (
    !form.value.name ||
    form.value.name?.trim() === "" ||
    form.value.name.length > 6
  ) {
    message.error("用户名不合规范！");
    return;
  }
  // 正式修改
  loadingOk.value = true;
  const res = await UserControllerService.updateUserUsingPost({
    id: form.value.id,
    userName: form.value.name,
    // userPassword: form.value.password,
    userRole: form.value.userRole,
    userProfile: form.value.profile,
  });
  loadingOk.value = false;
  if (res.code === 0) {
    message.success("修改成功！");
    visible.value = false;
    loadData();
  } else {
    message.error("修改失败," + res.message);
  }
};
const handleCancel = () => {
  visible.value = false;
};

const doUpdate = (user: User) => {
  form.value = {
    id: user.id as number,
    name: user.userName as string,
    pwd: "",
    profile: user.userProfile as string,
    // createRights: user.createRights as string,
  };
  visible.value = true;
};
</script>

<style scoped>
#userListView {
  max-width: 90%;
  margin: 0 auto;
}

.arco-image-with-footer-inner .arco-image-footer {
  background: linear-gradient(
    360deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0) 0%
  ) !important;
}
</style>
