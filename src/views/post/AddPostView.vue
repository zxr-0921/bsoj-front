<template>
  <a-form :model="form" :style="{ width: '800px' }" @submit="handleSubmit">
    <a-form-item field="title" label="标题" tooltip="请输入你的帖子标题">
      <a-input v-model="form.title" placeholder="请输入你的帖子标题" />
    </a-form-item>
    <a-form-item field="tags" label="标签">
      <a-input-tag v-model="form.tags" allow-clear placeholder="请选择标签" />
    </a-form-item>
    <a-form-item field="content" label="帖子内容">
      <MdEditor :handle-change="onContentChange" :value="form.content" />
    </a-form-item>
    <a-form-item>
      <a-button style="min-width: 200px" type="primary" @click="doSubmit"
        >发布
      </a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { PostControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import MdEditor from "@/components/MdEditor.vue";
import { useRouter } from "vue-router";

let form = ref({
  title: "",
  tags: [],
  content: "",
});
const router = useRouter();
const doSubmit = async () => {
  console.log(form.value);
  const res = await PostControllerService.addPostUsingPost(form.value);
  if (res.code === 0) {
    message.success("发布成功");
    // 发布成功后，跳转到讨论区
    await router.push("/discuss");
  } else {
    message.error("发布失败，" + res.message);
  }
};

const onContentChange = (value: string) => {
  form.value.content = value;
};
</script>
