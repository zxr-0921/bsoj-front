<template>
  <a-modal
    :mask-closable="false"
    :visible="visible"
    title="新建公告"
    width="800px"
    @cancel="handleCancel"
    @before-ok="handleSubmit"
  >
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <!-- 标题 -->
      <a-form-item
        :validate-trigger="['change', 'input']"
        field="title"
        label="公告标题"
      >
        <a-input
          v-model="form.title"
          allow-clear
          placeholder="请输入公告标题"
        />
      </a-form-item>

      <!-- 富文本内容 -->
      <a-form-item field="content" label="公告内容">
        <a-textarea
          v-model="form.content"
          :max-length="100"
          allow-clear
          placeholder="请输入你的内容"
          show-word-limit
        />
      </a-form-item>

      <!-- 时间范围 -->
      <a-form-item field="timeRange" label="生效时间">
        <a-range-picker
          v-model="form.timeRange"
          :placeholder="['开始时间', '结束时间']"
          format="YYYY-MM-DD HH:mm:ss"
          show-time
          style="width: 100%"
        />
      </a-form-item>

      <!-- 发布状态 -->
      <a-form-item field="status" label="发布状态">
        <a-radio-group v-model="form.status" type="button">
          <a-radio value="1">立即发布</a-radio>
          <a-radio value="0">存为草稿</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
    {{ form }}
  </a-modal>
</template>

<script setup>
import { reactive, ref } from "vue";
import { Message } from "@arco-design/web-vue";

const props = defineProps({
  visible: Boolean,
});

const emit = defineEmits(["submit", "update:visible"]);

// 表单数据
const form = reactive({
  title: "",
  content: "",
  timeRange: [],
  status: "0",
});

// 表单校验规则
const rules = {
  title: [
    { required: true, message: "标题不能为空" },
    { max: 50, message: "标题最长50个字符" },
  ],
  content: [
    {
      validator: (value) => {
        const cleanValue = value.replace(/<[^>]+>/g, "").trim();
        return cleanValue.length >= 10;
      },
      message: "内容至少需要10个有效字符",
    },
  ],
  timeRange: [
    {
      validator: (value) => {
        if (!value || value.length < 2) return false;
        return value[1] > value[0];
      },
      message: "结束时间必须晚于开始时间",
    },
  ],
};

// 提交处理
const formRef = ref(null);
const handleSubmit = async (done) => {
  try {
    // 表单验证
    await formRef.value.validate();
    // 构建提交数据
    const submitData = {
      ...form,
      startTime: form.timeRange[0],
      endTime: form.timeRange[1],
    };
    emit("submit", submitData);
    done(true);
  } catch (err) {
    done(false);
    Message.error("请检查表单填写");
  }
};

// 取消处理
const handleCancel = () => {
  formRef.value.resetFields();
  emit("update:visible", false);
};
</script>
