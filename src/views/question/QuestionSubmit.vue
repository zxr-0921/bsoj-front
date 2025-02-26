<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item
        v-if="loginUser.loginUser.userRole === ACCESS_ENUM.ADMIN"
        field="userId"
        label="用户id"
        style="min-width: 240px"
      >
        <a-input v-model="searchParams.userId" placeholder="请输入" />
      </a-form-item>
      <a-form-item field="questionId" label="题号" style="min-width: 240px">
        <a-input v-model="searchParams.questionId" placeholder="请输入" />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 240px">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '320px' }"
          placeholder="选择编程语言"
        >
          <a-option
            v-for="(item, index) of languageList.question_submit_language"
            :key="index"
            >{{ item.name }}
          </a-option>
          <a-option key="default" value="">不限</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button :loading="loadingSubmit" type="primary" @click="doSubmit"
          >搜索
        </a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :loading="languageList"
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
      <template #submitId="{ record }">
        <a-button type="text" @click="toQuestionSubmitInfoPage(record)"
          >{{ record.id }}
        </a-button>
      </template>
      <template #judgeInfo="{ record }">
        <a-space wrap>
          <a-tag
            v-if="record.judgeInfo.message === JUDGE_INFO_ENUM.ACCEPTED"
            color="green"
            >{{ record.judgeInfo.message }}
          </a-tag>
          <a-tag
            v-else-if="
              record.judgeInfo.message === JUDGE_INFO_ENUM.WRONG_ANSWER
            "
            color="red"
            >{{ record.judgeInfo.message }}
          </a-tag>
          <a-tag v-else color="orange"
            >{{ record.judgeInfo.message ?? JUDGE_INFO_ENUM.WAITING }}
          </a-tag>
        </a-space>
      </template>
      <template #timeCost="{ record }">
        {{ record.judgeInfo.time }}
      </template>
      <template #memoryCost="{ record }">
        {{ record.judgeInfo.memory }}
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitQueryRequest,
  QuestionSubmitVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import ACCESS_ENUM from "@/access/accessEnum";
import JUDGE_INFO_ENUM from "@/enum/judgeInfoEnum";

/**
 * loading等状态
 */
const loadingList = ref(false);
const loadingSubmit = ref(false);

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});
const loginUser = JSON.parse(sessionStorage.getItem("user") as string);
const loadData = async () => {
  loadingList.value = true;
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime",
      order: "descend",
    }
  );
  loadingList.value = false;
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
    console.log("用户角色", loginUser);
    // 过滤列
    if (loginUser.loginUser.userRole !== ACCESS_ENUM.ADMIN) {
      columns = columns.filter((col) => col.dataIndex !== "userId");
    }
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

let columns = [
  {
    title: "序号",
    slotName: "index",
  },
  {
    title: "提交号",
    slotName: "submitId",
  },
  {
    title: "题号",
    dataIndex: "questionId",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题结果",
    slotName: "judgeInfo",
  },
  {
    title: "执行用时(ms)",
    slotName: "timeCost",
  },
  {
    title: "消耗内存(kb)",
    slotName: "memoryCost",
  },
  // {
  //   title: "判题状态",
  //   slotName: "status",
  // },
  {
    title: "提交者 id",
    dataIndex: "userId",
  },
  {
    title: "提交时间",
    dataIndex: "createTime",
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
const toQuestionSubmitInfoPage = (item: QuestionSubmitVO) => {
  router.push({
    path: `/question/submit/info/${item.id}`,
  });
};

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

const languageList = ref({
  question_submit_language: [
    {
      name: "java",
      preview: true,
    },
    {
      name: "python",
      preview: true,
    },
  ],
});
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
