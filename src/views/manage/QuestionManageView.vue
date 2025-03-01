<template>
  <!--  <div id="manageQuestionListView" style="width: 100%">-->
  <a-form :model="searchParams" layout="inline">
    <a-form-item field="f1" label="编号" style="min-width: 200px">
      <a-input v-model="searchParams.id" placeholder="请输入题号" />
    </a-form-item>
    <a-form-item field="f2" label="名称" style="min-width: 200px">
      <a-input v-model="searchParams.title" placeholder="请输入名称" />
    </a-form-item>
    <a-form-item label="标签" style="min-width: 200px">
      <a-input-tag
        v-model="searchParams.tags"
        allow-clear
        placeholder="输入标签后回车确认"
      />
    </a-form-item>
    <a-form-item>
      <a-button :loading="loadingSubmit" type="primary" @click="doSubmit"
        >查询
      </a-button>
    </a-form-item>
    <a-button type="primary" @click="handleClick">创建题目</a-button>
  </a-form>

  <a-divider size="0" />
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
    <template #index="{ rowIndex }"> {{ rowIndex + 1 }}</template>
    <template #title="{ record }">
      <div style="width: 80%">
        <a-button type="text">{{ record.title }}</a-button>
        <!--          <span>{{ record.title }}</span>-->
      </div>
    </template>
    <template #tags="{ record }">
      <a-space>
        <a-tag
          v-for="tag in parseToArray(record.tags)"
          :key="tag"
          :color="colors[Math.min(tag.length, colors.length - 1)]"
          >{{ tag }}
        </a-tag>
      </a-space>
    </template>
    <template #judgeConfig="{ record }">
      <span>{{ formatJudgeConfig(record.judgeConfig) }}</span>
    </template>
    <template #judgeCase="{ record }">
      <span>{{ formatJudgeCase(record.judgeCase) }}</span>
    </template>
    <template #userId="{ record }">
      <a-tag
        :color="colors[Math.min(record.userId.length, colors.length - 1)]"
        class="creator"
        size="medium"
        @click="goAuthorUserInfo(record.userId)"
        >{{ record.userId }}
      </a-tag>
    </template>
    <!--      操作-->
    <template #optional="{ record }">
      <a-space>
        <a-button status="warning" @click="doUpdate(record)"> 修改</a-button>
        <a-popconfirm
          :onOk="() => doDelete(record)"
          content="确定要删除吗?"
          type="warning"
        >
          <a-button :loading="loadingDelete" status="danger">删除</a-button>
        </a-popconfirm>
      </a-space>
    </template>
  </a-table>
  <!--  </div>-->
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modulers/user";
import accessEnum from "@/access/accessEnum";

/**
 * loading等状态
 */
const loadingList = ref(false);
const loadingDelete = ref(false);

const tableRef = ref();
const dataList = ref([]);
const total = ref(0);
// 搜索参数
const searchParams = ref({
  pageSize: 8,
  current: 1,
  id: undefined,
  title: "",
  tags: [],
});

const userStore = useUserStore();
// 页面加载时，请求数据
const loadData = async () => {
  loadingList.value = true;
  // 管理员加载所有题目，教师加载自己创建的题目
  if (userStore.loginUser.userRole === accessEnum.ADMIN) {
    const res = await QuestionControllerService.listQuestionByPageUsingPost(
      searchParams.value
    );
    loadingList.value = false;
    if (res.code === 0) {
      dataList.value = res.data.records;
      total.value = res.data.total;
    } else {
      message.error("加载失败，" + res.message);
    }
  } else {
    const res =
      await QuestionControllerService.listQuestionByPageTeacherUsingPost({
        ...searchParams.value,
        userId: userStore.loginUser.userId,
      });
    loadingList.value = false;
    if (res.code === 0) {
      dataList.value = res.data.records;
      total.value = res.data.total;
    } else {
      message.error("加载失败，" + res.message);
    }
  }
};

// 创建题目
const handleClick = () => {
  router.push({
    path: "/add/question",
  });
};

// 标签格式化
const parseToArray = (str: string) => {
  const matches = str.match(/"(.*?)"/g);
  return matches ? matches.map((item) => item.slice(1, -1).trim()) : [];
};

// 修改题目
const doUpdate = (question: Question) => {
  router.push({
    path: "/question/update",
    query: {
      id: question.id,
    },
  });
};
// 监听页码变化
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

// 跳转到用户详情页
const router = useRouter();
const goAuthorUserInfo = (userId: number) => {
  router.push({
    path: "/user/info",
    query: {
      id: userId,
    },
  });
};

/**
 * 确认搜索，重新加载数据
 */
const loadingSubmit = ref(false);
const doSubmit = () => {
  loadingSubmit.value = true;
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
  loadingSubmit.value = false;
};

// 删除题目
const doDelete = async (question: Question) => {
  const res = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });
  if (res.code === 0) {
    message.success("删除成功");
    await loadData();
  } else {
    message.error("删除失败," + res.message);
  }
};
// 格式化判题配置
const judgeConfigMap = {
  timeLimit: "时间限制（ms）",
  memoryLimit: "内存限制（kb）",
  stackLimit: "堆栈限制（kb）",
};

const formatJudgeConfig = (config: any) => {
  //{"timeLimit":1000,"memoryLimit":1000,"stackLimit":1000}

  // 获取字符串中的键值对
  const configObj = JSON.parse(config);
  return Object.keys(configObj)
    .map((key) => `${judgeConfigMap[key]}: ${configObj[key]}`)
    .join(", ");
};

// 格式化判题用例
//[{"input":"1 2","output":"3"},{"input":"3 4","output":"7"}]
const formatJudgeCase = (cases: any) => {
  // 获取数组中的字符串
  const caseArr = JSON.parse(cases);
  console.log("caseArr", typeof caseArr, caseArr);
  // 遍历数组，将每个对象的input和output拼接成字符串，每个判题用例之间用逗号隔开,显示每组判题用例的序号
  return caseArr
    .map((item, index) => {
      return `用例 ${index + 1}: 输入： ${item.input} 输出： ${item.output}`;
    })
    .join(",\n");
};

/**  * 页面加载时，请求数据  */
onMounted(() => {
  loadData();
});

/**  * 监听 searchParams 变量，改变时触发页面的重新加载  */
watchEffect(() => {
  loadData();
});

// 表格列配置
const columns = [
  { title: "序号", slotName: "index" },
  {
    title: "名称",
    dataIndex: "title",
    slotName: "title",
  },
  {
    title: "标签",
    slotName: "tags",
    dataIndex: "tags",
  },
  {
    title: "内容",
    dataIndex: "content",
    slotName: "content",
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
  },

  {
    title: "判题配置",
    dataIndex: "judgeConfig",
    slotName: "judgeConfig",
  },
  {
    title: "判题用例",
    dataIndex: "judgeCase",
    slotName: "judgeCase",
  },
  {
    title: "创建者",
    dataIndex: "userId",
    slotName: "userId",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];
/**
 * 标签显示
 */
const colors = ref([
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "arcoblue",
  "purple",
  "pinkpurple",
  "magenta",
  "gray",
]);
</script>

<style scoped>
#manageQuestionListView {
  max-width: 70%;
  margin: 0 auto;
}

.creator:hover {
  cursor: pointer;
}
</style>
