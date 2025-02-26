<template>
  <!-- 发帖模态框 -->
  <a-modal
    :title="isEditMode ? '编辑帖子' : '新建帖子'"
    :visible="visible"
    width="800px"
    @cancel="resetForm"
    @ok="handleSubmit"
  >
    <a-form ref="formRef" :model="form" layout="vertical">
      <a-form-item
        :rules="[{ required: true, message: '请输入标题' }]"
        field="title"
        label="标题"
      >
        <a-input v-model="form.title" placeholder="请输入帖子标题" />
      </a-form-item>
      <a-form-item
        :rules="[{ required: true, message: '请输入内容' }]"
        field="content"
        label="内容"
      >
        <MdEditor :handle-change="onContentChange" :value="form.content" />
      </a-form-item>
      <a-form-item
        :rules="[{ required: true, message: '至少添加一个标签' }]"
        field="tags"
        label="标签"
      >
        <a-input-tag
          v-model="form.tags"
          allow-clear
          placeholder="输入标签后回车确认"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import MdEditor from "@/components/MdEditor.vue";
import { reactive, ref } from "vue";
import { defineProps, defineEmits } from "vue";
/**  * 定义组件属性类型  */
const props = defineProps({
  visible: String,
  isEditMode: String,
});
const emit = defineEmits("submit");
const isEditMode = ref(false);
const formRef = ref();
// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
  emit("update:visible", false);
};
const form = reactive({
  title: "",
  content: "",
  tags: [],
  type: "common_post",
});

// 提交表单
const handleSubmit = async () => {
  emit("submit", form);
};
// 内容变化
const onContentChange = (value: string) => {
  form.content = value;
};
</script>
