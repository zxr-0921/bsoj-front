<template>
  <div id="questionsView">
    <!--    搜索栏-->
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="名称" style="min-width: 240px">
        <a-input
          v-model="searchParams.title"
          allow-clear
          placeholder="请输入名称"
        />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 240px">
        <a-input-tag v-model="searchParams.tags" placeholder="请输入标签" />
      </a-form-item>
      <a-form-item>
        <a-space size="large">
          <a-button type="primary" @click="doSubmit">查询</a-button>
          <a-button @click="resetSearch">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
    <a-divider margin="20px 0" />
    <!-- 表格-->
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="pagination"
      @page-change="onPageChange"
    >
      <!-- 标签-->
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="green"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <!--      通过显示率-->
      <template #acceptedRate="{ record }">
        <span class="accept-rate"> {{ calcAcceptRate(record) }} </span>
      </template>
      <!-- 时间格式化优化 -->
      <template #createTime="{ record }">
        {{ formatTime(record.createTime) }}
      </template>
      <!-- 操作按钮优化 -->
      <template #optional="{ record }">
        <a-button
          status="success"
          type="outline"
          @click="toQuestionPage(record)"
        >
          <template #icon>
            <icon-play-arrow />
          </template>
          开始做题
        </a-button>
      </template>

      <!-- 空状态优化 -->
      <template #empty>
        <a-empty class="empty" description="暂无题目">
          <a-button type="primary" @click="resetSearch">重置查询</a-button>
        </a-empty>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import dayjs from "dayjs";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionQueryRequest>({
  title: "",
  tags: [],
  pageSize: 8,
  current: 1,
});
// 时间格式化
const formatTime = (time: string) => dayjs(time).format("YYYY-MM-DD HH:mm");

// 计算通过率
const calcAcceptRate = (record: Question) => {
  if (!record.submitNum) return "0% (0/0)";
  const rate = ((record.acceptedNum / record.submitNum) * 100).toFixed(2);
  return `${rate}% (${record.acceptedNum}/${record.submitNum})`;
};
// 分页配置（计算属性）
const pagination = computed(() => ({
  total: total.value,
  current: searchParams.value.current,
  pageSize: searchParams.value.pageSize,
  showTotal: true,
  showPageSize: true,
  pageSizeOptions: [8, 12, 20, 50],
}));
// 重置查询
const resetSearch = () => {
  searchParams.value.title = "";
  searchParams.value.tags = [];
  searchParams.value.current = 1;
  loadData();
};
const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};
const handleEdit = (item) => {
  console.log("编辑公告:", item);
};
const handleDelete = (id) => {
  console.log("删除公告ID:", id);
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

// {id: "1", title: "A+ D", content: "新的题目内容", tags: "["二叉树"]", answer: "新的答案", submitNum: 0,…}

const columns = [
  {
    title: "题号",
    dataIndex: "id",
  },
  {
    title: "题目名称",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/question/submit/${question.id}`,
  });
};

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>

<style scoped>
#questionsView {
  max-width: 1280px;
  margin: 0 auto;
}

.accept-rate {
  font-family: monospace;
  font-weight: 500;
}
</style>
