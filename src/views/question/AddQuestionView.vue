<template>
  <div id="addQuestionView">
    <div>
      <h2 v-if="updatePage">更新题目</h2>
      <h2 v-else>创建题目</h2>
    </div>

    <!-- AI生成侧边栏 -->
    <a-drawer
      :visible="showAIPanel"
      title="AI智能生成"
      width="400px"
      @cancel="closePanel"
    >
      <a-form>
        <a-form-item field="keywords" label="标题">
          <a-input v-model="aiForm.title" allow-clear placeholder="输入标题" />
        </a-form-item>
        <a-form-item field="keywords" label="知识点">
          <a-input-tag
            v-model="aiForm.type"
            allow-clear
            placeholder="输入知识点后回车"
          />
        </a-form-item>
        <a-form-item field="difficulty" label="难度等级">
          <a-radio-group v-model="aiForm.difficulty" type="button">
            <a-radio
              v-for="item in difficultyOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-button
          :loading="generating"
          long
          type="primary"
          @click="handleGenerate"
        >
          <template #icon>
            <icon-robot />
          </template>
          立即生成
        </a-button>
      </a-form>
      {{ aiForm }}

      <!-- 生成结果 -->
      <div v-if="aiResult" class="ai-result">
        <h3>生成建议</h3>
        <MdViewer :value="aiResult" />
      </div>
    </a-drawer>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="标题">
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag v-model="form.tags" allow-clear placeholder="请选择标签" />
      </a-form-item>
      <a-form-item field="content" label="题目内容">
        <MdEditor :handle-change="onContentChange" :value="form.content" />
      </a-form-item>
      <a-form-item field="answer" label="答案">
        <MdEditor :handle-change="onAnswerChange" :value="form.answer" />
      </a-form-item>
      <a-form-item :content-flex="false" :merge-props="false" label="判题配置">
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              min="0"
              mode="button"
              placeholder="请输入时间限制"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              min="0"
              mode="button"
              placeholder="请输入内存限制"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="堆栈限制">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              min="0"
              mode="button"
              placeholder="请输入堆栈限制"
              size="large"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item
        :content-flex="false"
        :merge-props="false"
        label="测试用例配置"
      >
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :key="index"
          no-style
        >
          <a-space direction="vertical" style="min-width: 640px">
            <a-form-item
              :key="index"
              :field="`form.judgeCase[${index}].input`"
              :label="`输入用例-${index}`"
            >
              <a-input
                v-model="judgeCaseItem.input"
                placeholder="请输入测试输入用例"
              />
            </a-form-item>
            <a-form-item
              :key="index"
              :field="`form.judgeCase[${index}].output`"
              :label="`输出用例-${index}`"
            >
              <a-input
                v-model="judgeCaseItem.output"
                placeholder="请输入测试输出用例"
              />
            </a-form-item>
            <a-button status="danger" @click="handleDelete(index)">
              删除
            </a-button>
          </a-space>
        </a-form-item>
        <div style="margin-top: 32px">
          <a-button status="success" type="outline" @click="handleAdd"
            >新增测试用例
          </a-button>
        </div>
      </a-form-item>
      <div style="margin-top: 16px" />
      <a-form-item>
        <a-space size="large">
          <a-button type="primary" @click="doSubmit">提交</a-button>
          <a-button status="success" type="outline" @click="showPanel">
            <template #icon>
              <icon-robot />
            </template>
            AI智能生成
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import {
  AiControllerService,
  AIGenerateQuestionRequest,
  QuestionControllerService,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";
import MdViewer from "@/components/MdViewer.vue";

const route = useRoute();
const router = useRouter();
// 如果页面地址包含 update，视为更新页面
const updatePage = route.path.includes("update");

let form = ref({
  title: "",
  tags: [],
  answer: "",
  content: "",
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
});

/**
 * 根据题目 id 获取老的数据
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    // json 转 js 对象
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const doSubmit = async () => {
  console.log(form.value);
  // 区分更新还是创建
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("更新成功");
    } else {
      message.error("更新失败，" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("创建成功");
      router.push("/question/view");
    } else {
      message.error("创建失败，" + res.message);
    }
  }
};

/**
 * 新增判题用例
 */
const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};

/**
 * 删除判题用例
 */
const handleDelete = (index: number) => {
  form.value.judgeCase.splice(index, 1);
};

const onContentChange = (value: string) => {
  form.value.content = value;
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};
// AI生成相关状态
const showAIPanel = ref(false);
const generating = ref(false);
const aiResult = ref(null);
const showPanel = () => {
  showAIPanel.value = true;
};

const closePanel = () => {
  showAIPanel.value = false;
};

const aiForm = reactive({
  type: [],
  difficulty: "中等",
  title: "",
} as AIGenerateQuestionRequest);

const aiQuestionTypes = [
  { label: "算法题", value: "algorithm" },
  {
    label: "数据库",
    value: "database",
  },
  { label: "Shell脚本", value: "shell" },
];
const difficultyOptions = [
  { label: "简单", value: "简单" },
  { label: "中等", value: "中等" },
  {
    label: "困难",
    value: "困难",
  },
];

// 生成处理
const handleGenerate = async () => {
  try {
    generating.value = true;
    const res = await AiControllerService.generateQuestionUsingPost(aiForm);
    if (res.code === 0) {
      aiResult.value = res.data;
      message.success("生成成功");
    } else {
      message.error("生成失败: " + res.message);
    }
  } catch (err) {
    message.error("生成失败: " + err.message);
  } finally {
    generating.value = false;
  }
};
</script>

<style scoped>
#addQuestionView {
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.ai-result {
  margin-top: 24px;

  .result-item {
    margin-bottom: 16px;

    label {
      display: block;
      margin-bottom: 8px;
      color: var(--color-text-2);
      font-weight: 500;
    }

    .judge-config {
      padding-left: 20px;
      color: var(--color-text-3);

      li {
        margin: 8px 0;
      }
    }
  }
}

:deep(.arco-drawer-footer) {
  display: flex;
  gap: 12px;
}
</style>
