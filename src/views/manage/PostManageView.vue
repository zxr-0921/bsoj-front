<template>
  <!-- 弹窗组件 -->
  <PostCreateDialog v-model:visible="dialogVisible" @submit="handleSubmit" />
  <a-space>
    <!--    查询-->
    <a-form layout="inline" @submit="handleSearch">
      <a-form-item label="帖子标题">
        <a-input v-model="searchParams.title" placeholder="请输入帖子标题" />
      </a-form-item>
      <a-form-item label="帖子类别">
        <a-select
          v-model="searchParams.type"
          allow-clear
          placeholder="请选择帖子类别"
        >
          <a-option value="solution_post">题解</a-option>
          <a-option value="common_post">普通</a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="帖子状态">
        <a-select
          v-model="searchParams.status"
          allow-clear
          placeholder="请选择帖子状态"
        >
          <a-option value="draft">待审核</a-option>
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
    <!--   新增用户按钮-->
    <a-button type="primary" @click="showDialog">新增帖子</a-button>
  </a-space>

  <a-divider size="3" />
  <!--    帖子列表-->
  <a-space direction="vertical" fill size="large">
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
    >
      <template #content="{ record }">
        <a-space wrap>
          <a-tooltip :content="record.content" background-color="#165DFF">
            <a-button type="text">查看</a-button>
          </a-tooltip>
        </a-space>
      </template>
      <template #code="{ record }">
        <a-space wrap>
          <a-tooltip :content="record.code" background-color="#165DFF">
            <a-button type="text">查看</a-button>
          </a-tooltip>
        </a-space>
      </template>
      <template #type="{ record }">
        <a-tag v-if="record.type === 'solution_post'" color="orange"
          >题解
        </a-tag>
        <a-tag v-else color="green">普通</a-tag>
      </template>
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag
            v-for="(tag, index) of parseToArray(record.tags)"
            :key="index"
            color="green"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #status="{ record }">
        <a-tag v-if="record.status === 'draft'" color="grey">待审核</a-tag>
        <a-tag v-else color="green">已发布</a-tag>
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="doUpdate(record)">通过</a-button>
          <a-button status="danger" @click="doDelete(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </a-space>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watchEffect } from "vue";
import message from "@arco-design/web-vue/es/message";
import {
  AiControllerService,
  PostsControllerService,
} from "../../../generated";
import PostCreateDialog from "@/components/PostCreateDialog.vue";
// 选中的key
const selectedKeys = ref([]);
// 搜索参数
const searchParams = ref({
  title: "",
  type: "",
  status: "",
  pageSize: 10,
  current: 1,
});
// 重置
const handleReset = () => {
  searchParams.value = {
    title: "",
    type: "",
    status: "",
    pageSize: 10,
    current: 1,
  };
};

const parseToArray = (str: string) => {
  const matches = str.match(/"(.*?)"/g);
  return matches ? matches.map((item) => item.slice(1, -1).trim()) : [];
};
// 帖子数据
const data = ref([]);
// 总数
const total = ref(0);

const loadData = async () => {
  const res = await PostsControllerService.listPostsUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    data.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

// 查询
const handleSearch = async () => {
  const res = await PostsControllerService.listPostsUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    data.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

// 表格行选择配置
const rowSelection = reactive({
  type: "checkbox",
  showCheckedAll: true,
  onlyCurrent: false,
});

//{   "code": "",   "content": "",   "current": 0,   "endTime": "",   "id": 0,   "language": "",   "order": "",   "pageSize": 0,   "problemId": 0,   "sortField": "",   "startTime": "",   "status": "",   "tags": [],   "title": "",   "type": "",   "userId": 0,   "version": "" }
// 创建帖子
const dialogVisible = ref(false);
const showDialog = () => {
  dialogVisible.value = true;
};
// 提交处理
const handleSubmit = async (form) => {
  console.log("提交数据:", form);
  // API调用
  const res = await PostsControllerService.creatPostUsingPost(form);
  if (res.code === 0) {
    message.success("帖子创建成功");
    dialogVisible.value = false;
    await loadData();
  } else {
    message.error(res.message);
  }
};

//endregion
//删除帖子
const doDelete = async (post) => {
  //是否确认删除
  const res = await PostsControllerService.deletePostUsingPut(post.id);
  if (res.code === 0) {
    message.success("删除成功");
    await loadData();
  } else {
    message.error("删除失败");
  }
};
const doUpdate = async (post) => {
  //审核
  const res = await PostsControllerService.checkPostUsingPut(post.id);
  if (res.code === 0) {
    message.success("发布成功");
    await loadData();
  } else {
    message.error("发布失败");
  }
  //调用AI生成接口
  AiControllerService.answerUsingGet(post.id);
};
// 表格列
const columns = [
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "内容",
    dataIndex: "content",
    slotName: "content",
  },
  {
    title: "代码",
    dataIndex: "code",
    slotName: "code",
  },
  {
    title: "标签",
    slotName: "tags",
    dataIndex: "tags",
  },
  {
    title: "帖子类别",
    dataIndex: "type",
    slotName: "type",
  },
  {
    title: "发表的用户",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    dataIndex: "publishTime",
  },
  {
    title: "状态",
    dataIndex: "status",
    slotName: "status",
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
/**  * 监听 searchParams 变量，改变时触发页面的重新加载  */
watchEffect(() => {
  loadData();
});
/**  * 页面加载时，请求数据  */ onMounted(() => {
  loadData();
});
</script>
