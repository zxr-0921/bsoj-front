<template>
  <div>
    <a-space direction="inline" size="medium">
      <!--    查询-->
      <a-form layout="inline" @submit="handleSearch">
        <a-form-item label="公告标题">
          <a-input v-model="searchParams.title" placeholder="请输入公告标题" />
        </a-form-item>
        <a-form-item label="公告类别">
          <a-select
            v-model="searchParams.category"
            allow-clear
            placeholder="请选择公告类别"
          >
            <a-option value="system_announcement">系统公告</a-option>
            <a-option value="system_notice">系统通知</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="公告状态">
          <a-select
            v-model="searchParams.status"
            allow-clear
            placeholder="请选择公告状态"
          >
            <a-option value="draft">草稿</a-option>
            <a-option value="published">已发布</a-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space size="medium">
            <a-button html-type="submit" type="primary">查询</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
      <!--    新建-->
      <a-button type="primary" @click="openCreateModal">新建公告</a-button>
    </a-space>

    <a-divider size="3" />
    <!--    公告列表-->
    <a-table
      :columns="columns"
      :data="filteredAnnouncements"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #category="{ record }">
        <a-tag v-if="record.category === 'system_announcement'" color="arcoblue"
          >系统公告
        </a-tag>
        <a-tag v-else color="blue">系统通知</a-tag>
      </template>
      <template #status="{ record }">
        <a-tag v-if="record.status === 'draft'" color="gray">草稿</a-tag>
        <a-tag v-else-if="record.status === 'withdrawn'" color="gray"
          >撤销</a-tag
        >
        <a-tag v-else color="green">已发布</a-tag>
      </template>
      <template #operations="{ record }">
        <a-space>
          <a-button status="normal" type="outline" @click="handleEdit(record)"
            >编辑
          </a-button>
          <a-button
            status="danger"
            type="outline"
            @click="handlePublish(record)"
            >发布
          </a-button>
          <a-button status="warning" type="outline" @click="handRevoke(record)">
            撤销
          </a-button>
          <a-button status="danger" type="outline" @click="handleDelete(record)"
            >删除
          </a-button>
        </a-space>
      </template>
    </a-table>
    <!--  表单-->
    <a-modal
      :title="update ? '编辑公告' : '新建公告'"
      :visible="isCreateModalVisible"
      @cancel="resetCreateForm"
      @ok="handleCreate"
    >
      <a-form :model="createForm" layout="vertical">
        <a-form-item label="公告类别" prop="category">
          <a-select v-model="createForm.category" placeholder="请选择公告类别">
            <a-option value="system_announcement">系统公告</a-option>
            <a-option value="system_notice">系统通知</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="公告标题" prop="title">
          <a-input v-model="createForm.title" placeholder="请输入公告标题" />
        </a-form-item>
        <a-form-item label="公告内容" prop="content">
          <a-textarea
            v-model="createForm.content"
            :rows="4"
            placeholder="请输入公告内容"
          />
        </a-form-item>
        <a-form-item label="公告状态" prop="status">
          <a-select v-model="createForm.status" placeholder="请选择公告状态">
            <a-option value="published">发布</a-option>
            <a-option value="draft">草稿</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";
import { AnnouncementControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";

// region 查询公告
// 搜索参数
const searchParams = ref({
  title: "",
  category: "",
  status: "",
  current: 1,
  pageSize: 8,
});
// 查询
const handleSearch = async () => {
  const res = await AnnouncementControllerService.listAnnouncementUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    filteredAnnouncements.value = res.data.records;
  } else {
    message.error("加载失败，" + res.message);
  }
};

// endregion

// region 新建公告
// 新建公告表单
const createForm = ref({
  id: 0,
  category: "",
  title: "",
  content: "",
  status: "",
});
// 新建公告
const handleCreate = async () => {
  const form = createForm.value;
  if (update.value) {
    const res = await AnnouncementControllerService.editAnnouncementUsingPost(
      form
    );
    if (res.code === 0) {
      message.success("编辑成功");
      await loadDate();
      isCreateModalVisible.value = false;
      resetCreateForm();
    } else {
      message.error("编辑失败，" + res.message);
    }
    update.value = false;
  } else {
    const res = await AnnouncementControllerService.createAnnouncementUsingPost(
      form
    );
    if (res.code === 0) {
      message.success("创建成功");
      isCreateModalVisible.value = false;
      resetCreateForm();
      await loadDate();
    } else {
      message.error("创建失败，" + res.message);
    }
  }
};
// endregion
// 分页
const onPageChange = (page: number) => {
  searchParams.value = { ...searchParams.value, current: page };
};
const update = ref(false);
// 重置表单
const resetCreateForm = () => {
  createForm.value = { category: "", title: "", content: "", status: "" };
  isCreateModalVisible.value = false;
};
const isCreateModalVisible = ref(false); // 控制新建公告弹窗的显
const openCreateModal = () => {
  isCreateModalVisible.value = true;
};
const handleReset = () => {
  searchParams.value = {
    title: "",
    category: "",
    status: "",
  };
};

const filteredAnnouncements = ref();
const total = ref(0);
const loadDate = async () => {
  const res = await AnnouncementControllerService.listAnnouncementUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    filteredAnnouncements.value = res.data.records;
    total.value = res.data.total;
    message.success("加载成功");
  } else {
    message.error("加载失败，" + res.message);
  }
};

// 监听 searchParams 变量，改变时触发页面的重新加载
watchEffect(() => {
  loadDate();
});
onMounted(() => {
  loadDate();
});

// 编辑
const handleEdit = async (record) => {
  // alert("编辑");
  isCreateModalVisible.value = true;
  update.value = true;
  const res = await AnnouncementControllerService.getAnnouncementUsingGet(
    record.id
  );
  if (res.code === 0) {
    createForm.value = res.data;
  } else {
    message.error("获取公告详情失败，" + res.message);
  }
};
// 发布
const handlePublish = async (record) => {
  // 将字符串转为数字
  const res = await AnnouncementControllerService.publishAnnouncementUsingPost(
    record.id
  );
  if (res.code == 0) {
    message.success("发布成功");
    console.log("发布成功");
    await loadDate();
  } else {
    message.error("发布失败，" + res.message);
    console.log("发布失败");
  }
};
// 撤销
const handRevoke = async (record) => {
  const res = await AnnouncementControllerService.revokeAnnouncementUsingPost(
    record.id
  );
  if (res.code == 0) {
    message.success("撤销成功");
    console.log("撤销成功");
    await loadDate();
  } else {
    message.error("撤销失败，" + res.message);
    console.log("撤销失败");
  }
};
// 删除
const handleDelete = async (record) => {
  const res = await AnnouncementControllerService.deleteAnnouncementUsingDelete(
    record.id
  );
  if (res.code == 0) {
    message.success("删除成功");
    console.log("删除成功");
    loadDate();
  } else {
    message.error("删除失败，" + res.message);
    console.log("删除失败");
  }
};
// 表格列
const columns = [
  { title: "发布类别", dataIndex: "category", slotName: "category" },
  {
    title: "公告标题",
    dataIndex: "title",
  },
  { title: "公告内容", dataIndex: "content" },
  { title: "发布人", dataIndex: "publisherName" },
  {
    title: "公告状态",
    dataIndex: "status",
    slotName: "status",
  },
  { title: "发布时间", dataIndex: "releaseTime" },
  {
    title: "操作",
    dataIndex: "operations",
    slotName: "operations",
  },
];
</script>

<style scoped>
.a-form-item {
  margin-right: 20px;
}
</style>
