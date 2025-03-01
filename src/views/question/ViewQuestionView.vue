<template>
  <!--  居中-->

  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title">
              <a-descriptions
                :column="{ xs: 1, md: 2, lg: 3 }"
                title="判题条件"
              >
                <a-descriptions-item label="时间限制">
                  {{ question.judgeConfig.timeLimit ?? "" }}
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  {{ question.judgeConfig.memoryLimit ?? "" }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ question.judgeConfig.stackLimit ?? "" }}
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer :value="question.content || ''" />
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <!-- 题解-->
          <a-tab-pane
            key="answer"
            :disabled="!languageList.question_submit_language[0].preview"
            title="题解"
          >
            <a-form-item style="height: 10px">
              <a-input-search
                allow-clear
                placeholder="输入标题关键词搜索"
                size="small"
                @search="(value:any) => doSearch(value)"
              />
              <!-- Todo： 需要通过通过题目才可以发布题解-->
              <a-button type="primary" @click="showSolutionDialog"
                >发布题解
              </a-button>
            </a-form-item>
            <!--            当前题目的题解列表-->
            <a-list
              :bordered="false"
              :data="dataSource"
              :loading="loadingList"
              :paginationProps="paginationProps"
              class="list-demo-action-layout aListDataItem"
            >
              <template #item="{ item }">
                <a-list-item
                  action-layout="vertical"
                  class="list-demo-item"
                  @click="lookSolution(item)"
                >
                  <template #actions>
                    <span
                      ><icon-heart />{{
                        parseInt(item.likes as any, 10) + 1
                      }}</span
                    >
                    <span><icon-eye />{{ item.views }}</span>
                    <span><icon-message />{{ item.commentsCount }}</span>
                    <span><icon-schedule />{{ item.publishTime }}</span>
                  </template>
                  <a-list-item-meta :description="item.content">
                    <template #title>
                      <div style="text-align: left">
                        <span style="font-weight: bold; font-size: 17px">
                          {{ item.title }}
                        </span>
                      </div>
                    </template>
                    <template #avatar>
                      <a-avatar shape="square">
                        <img :src="item.userVO.userAvatar" alt="avatar" />
                      </a-avatar>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </a-tab-pane>

          <!-- AI分析-->
          <a-tab-pane title="AI思路">
            <a-scrollbar style="overflow: auto">
              <div style="height: 600px; width: 2000px">
                <!--            垂直排列-->
                <a-space direction="vertical">
                  <MdViewer v-if="aiIdea" :value="aiIdea" />
                  <a-button v-else type="outline" @click="doAiIdea"
                    >一键分析
                  </a-button>
                  <a-spin v-if="spinloding" tip="分析中，请稍等..."></a-spin>
                </a-space>
              </div>
            </a-scrollbar>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-form :model="form" layout="inline">
          <a-form-item
            field="language"
            label="编程语言"
            style="min-width: 240px"
          >
            <a-select
              v-model="form.language"
              :style="{ width: '320px' }"
              placeholder="选择编程语言"
            >
              <a-option
                v-for="(item, index) of languageList.question_submit_language"
                :key="index"
                >{{ item.name }}
              </a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          :handle-change="changeCode"
          :language="form.language"
          :value="form.code as string"
        />
        <a-divider size="0" />
        <a-space size="large">
          <a-button type="primary" @click="doSubmit"> 提交代码</a-button>
          <!-- 代码优化按钮 -->
          <a-button :loading="loading" type="outline" @click="optimizeCode">
            代码优化
          </a-button>
        </a-space>
      </a-col>
      <!-- 优化结果展示 -->
    </a-row>
    <a-row>
      <a-alert
        v-if="optimizedCode"
        closable
        title="优化结果"
        type="success"
        @close="clearResult"
      >
        <div class="code-result">
          <pre><code>{{ optimizedCode }}</code></pre>
          <!--    <a-button type="link" @click="copyToClipboard">复制代码</a-button>-->
        </div>
      </a-alert>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref, withDefaults } from "vue";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import {
  AiControllerService,
  AIQuestionAnalysisRequest,
  Posts,
  PostsControllerService,
  QuestionControllerService,
} from "../../../generated";
import { useRouter } from "vue-router";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), { id: () => "" });

// 将传递过来的id转换为number类型
const question = ref();
console.log("传递过来的id", props.id);

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败，" + res.message);
  }
};
const showSolutionDialog = () => {
  router.push({
    path: `/solution/add/${props.id}`,
  });
};
// 查看详情
const lookSolution = (post: Posts) => {
  router.push(`/post/${post.id}`);
};
const loadingList = ref(false);

const spinloding = ref(false);
const router = useRouter();

const aiIdea = ref();
const dataSource = ref([]);
const searchParams = ref({
  pageSize: 10,
  current: 1,
});
const paginationProps = {
  pageSize: searchParams.value.pageSize,
  current: searchParams.value.current,
  total: dataSource.value.length,
};

//查询题解
const doSearch = async (value: string) => {
  const res = await PostsControllerService.listSolutionPostsUsingPost({
    problemId: props.id,
    ...searchParams.value,
    title: value,
  });
  if (res.code === 0) {
    dataSource.value = res.data.records;
    message.success("查询成功");
  } else {
    message.error("查询失败," + res.message);
  }
};

// ai分析
const doAiIdea = async () => {
  // 如果未登录不能使用
  if (sessionStorage.getItem("user") === null) {
    message.error("请先登录");
    return;
  }
  spinloding.value = true;
  const anlysis = ref({
    title: question.value?.title,
    content: question.value?.content,
  } as AIQuestionAnalysisRequest);

  const res = await AiControllerService.getAnswerUsingPost(anlysis.value);
  if (res.code === 0) {
    aiIdea.value = res.data;
    spinloding.value = false;
  } else {
    message.error("AI思路生成失败," + res.message);
    spinloding.value = false;
  }
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
const form = ref({
  language: "java",
  code: "",
});
// 控制加载状态
/**
 * 提交代码
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }

  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    message.success("提交成功，3秒后跳转提交列表界面...");
    // 三秒后跳转到提交列表
    setTimeout(() => {
      router.push("/question/submitList");
    }, 3000);
  } else {
    message.error("提交失败," + res.message);
  }
};
const loading = ref(false); // 控制加载状态
const optimizedCode = ref(""); // 存储优化后的代码

const optimizeCode = async () => {
  if (sessionStorage.getItem("user") === null) {
    message.error("请先登录");
    return;
  }
  visible.value = true;
  loading.value = true;
  // 如果代码为空，返回
  if (!form.value.code) {
    message.error("请输入代码");
    loading.value = false;
    return;
  }
  const res = await AiControllerService.codeOptimizeUsingPost(form.value.code);
  if (res.code === 0) {
    optimizedCode.value = res.data;
    message.success("代码优化成功");
  } else {
    message.error("代码优化失败," + res.message);
  }
  loading.value = false;
};

const visible = ref(false);
const handleClick = () => {
  visible.value = true;
};
const handleOk = () => {
  visible.value = false;
  clearResult();
};
const handleCancel = () => {
  visible.value = false;
  clearResult();
};
const clearResult = () => {
  optimizedCode.value = ""; // 清空优化结果
};
/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
  doSearch("");
});

const changeCode = (value: string) => {
  form.value.code = value;
};
</script>

<style>
#viewQuestionView {
  max-width: 1400px;
  margin: 0 auto;
}

#viewQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}
</style>
