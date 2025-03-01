<template>
  <!--  居中分布-->
  <div>
    <h2 style="margin: auto">发布题解</h2>
    <a-form :model="solutionForm" layout="horizontal">
      <a-form-item
        :rules="[{ required: true, message: '请输入标题' }]"
        field="title"
        label="标题"
      >
        <a-input v-model="solutionForm.title" placeholder="请输入题解标题" />
      </a-form-item>
      <a-form-item field="content" label="内容">
        <MdEditor
          :handle-change="onContentChange"
          :value="solutionForm.content"
        />
      </a-form-item>

      <a-form-item label="编程语言">
        <a-select
          v-model="solutionForm.language"
          :style="{ width: '100%' }"
          placeholder="选择编程语言"
        >
          <a-option>java</a-option>
          <a-option>python</a-option>
        </a-select>
      </a-form-item>

      <a-form-item field="code" label="代码">
        <MdEditor :handle-change="onCodeChange" :value="solutionForm.code" />
      </a-form-item>

      <a-form-item label="标签">
        <a-input-tag
          v-model="solutionForm.tags"
          allow-clear
          placeholder="输入标签后回车确认"
        />
      </a-form-item>
      <!--      确认和返回按钮-->
      <a-form-item>
        <a-button type="primary" @click="submitSolution">确认</a-button>
        <a-button @click="resetSolutionForm">返回</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { PostsControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { withDefaults } from "vue";
import { defineProps } from "vue";
interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), { id: "" });

// 接受父组件传递的题目id

// 题解模态框是否可见
const solutionDialogVisible = ref(false);
// 题解表单
const solutionForm = reactive({
  title: "",
  content: "",
  language: "java",
  code: "",
  tags: [],
  problemId: props.id,
  type: "solution_post",
});

const onContentChange = (value: string) => {
  solutionForm.content = value;
};

const onCodeChange = (value: string) => {
  solutionForm.code = value;
};
const resetSolutionForm = () => {
  solutionForm.title = "";
  solutionForm.content = "";
  solutionForm.language = "java";
  solutionForm.tags = [];
  solutionDialogVisible.value = false;
};

const submitSolution = async () => {
  if (!solutionForm.title || !solutionForm.content) {
    message.error("请填写完整的题解信息");
    return;
  }
  const res = await PostsControllerService.creatSolutionPostUsingPost(
    solutionForm
  );
  if (res.code === 0) {
    message.success("题解发布成功");
    resetSolutionForm();
    // 重新加载题解列表
  } else {
    message.error("题解发布失败," + res.message);
  }
};
</script>
<style scoped></style>
