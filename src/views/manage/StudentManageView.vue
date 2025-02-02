<template>
  <a-space direction="vertical" fill size="large">
    <div>
      <span>OnlyCurrent: </span>
      <a-switch v-model="rowSelection.onlyCurrent" />
    </div>
    <a-table
      v-model:selectedKeys="selectedKeys"
      :columns="columns"
      :data="data"
      :pagination="{
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      :row-selection="rowSelection"
      row-key="name"
    />
  </a-space>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watchEffect } from "vue";
import { UserControllerService, UserQueryRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";

const selectedKeys = ref(["Jane Doe", "Alisa Ross"]);

// 分页查询
const searchParams = ref<UserQueryRequest>({
  pageSize: 10,
  current: 1,
});
// 总数
const total = ref(0);
const rowSelection = reactive({
  type: "checkbox",
  showCheckedAll: true,
  onlyCurrent: false,
});

// 用户数据
const data = ref([]);
const loadData = async () => {
  const res = await UserControllerService.listUserByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    data.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
  //    "records": [
  //    {
  //    "id": "1881247832371113985",
  //    "userAccount": "18688505189",
  //    "userPassword": "afe04a42f367ede2a56576ad5d208a69",
  //    "unionId": null,
  //    "mpOpenId": null,
  //    "userName": null,
  //    "userAvatar": null,
  //    "userProfile": null,
  //    "userRole": "admin",
  //    "createTime": "2025-01-20T07:50:09.000+00:00",
  //    "updateTime": "2025-01-20T07:52:26.000+00:00",         "isDelete": 0       }     ],
  // 表格列
};
const columns = [
  { title: "账号", dataIndex: "userAccount" },
  {
    title: "头像",
    dataIndex: "userAvatar",
  },
  { title: "用户名", dataIndex: "userName" },
  { title: "角色", dataIndex: "userRole" },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  { title: "更新时间", dataIndex: "updateTime" },
];
/**  * 监听 searchParams 变量，改变时触发页面的重新加载  */ watchEffect(() => {
  loadData();
});
/**  * 页面加载时，请求数据  */ onMounted(() => {
  loadData();
});
</script>
