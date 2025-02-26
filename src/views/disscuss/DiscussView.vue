<template>
  <div class="discuss-page">
    <!-- 头部和发帖按钮 -->
    <div class="header">
      <a-radio-group v-model="activeTab" type="button" @change="loadPosts">
        <a-radio value="newest">最新</a-radio>
        <a-radio value="hottest">最热</a-radio>
      </a-radio-group>
      <a-button type="primary" @click="showCreateForm">
        <template #icon>
          <icon-plus />
        </template>
        发布帖子
      </a-button>
    </div>
    <!--    帖子表单-->
    <PostCreateDialog v-model:visible="formVisible" @submit="handleSubmit" />
    <!-- 帖子列表 -->
    <a-list
      :data="postList"
      :loading="loading"
      :pagination="pagination"
      @page-change="handlePageChange"
    >
      <template #item="{ item }">
        <a-card class="post-card" hoverable>
          <div class="post-header">
            <div class="meta">
              <a-avatar :size="40">{{ item.userVO.userAvatar }}</a-avatar>
              <div class="info">
                <div class="author">{{ item.userVO.userName }}</div>
                <div class="time">{{ formatTime(item.publishTime) }}</div>
              </div>
            </div>
            <a-space>
              <a-tag v-for="tag in item.tags" :key="tag" color="arcoblue">
                {{ tag }}
              </a-tag>
            </a-space>
          </div>

          <h3 class="title" @click="viewDetail(item)">
            {{ item.title }}
          </h3>

          <div class="stats">
            <a-space :size="20">
              <span><icon-eye /> {{ item.views }}</span>
              <span><icon-like /> {{ item.likes }}</span>
              <span><icon-message /> {{ item.commentsCount }}</span>
            </a-space>
          </div>
        </a-card>
      </template>
    </a-list>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import MdEditor from "@/components/MdEditor.vue";
import { PostsControllerService } from "../../../generated";
import { Posts, PostsVO } from "../generated/model";
import PostCreateDialog from "@/components/PostCreateDialog.vue";

const router = useRouter();

// 表单相关
const formVisible = ref(false);
const isEditMode = ref(false);
const formRef = ref();

// 帖子列表
const postList = ref<PostsVO>([]);
const loading = ref(false);
const activeTab = ref("newest");
// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

// 初始化加载帖子
onMounted(() => {
  loadPosts();
});
// 搜索参数
const searchParams = ref({
  title: "",
  tags: [],
  pageSize: 10,
  current: 1,
});
// 加载帖子列表
const loadPosts = async () => {
  try {
    loading.value = true;
    const res = await PostsControllerService.listPostsByUserUsingPost(
      searchParams.value
    );
    if (res.code == 0) {
      postList.value = res.data.records;
      pagination.total = res.data.length;
    } else {
      Message.error("加载帖子失败");
    }
  } catch (err) {
    Message.error("加载帖子失败");
  } finally {
    loading.value = false;
  }
};

// 显示发帖表单
const showCreateForm = () => {
  formVisible.value = true;
  isEditMode.value = false;
};

// 提交表单
const handleSubmit = async (form) => {
  try {
    const res = await PostsControllerService.creatPostUsingPost(form);
    if (res.code == 0) {
      Message.success("发布成功");
      resetForm();
    }
  } catch (err) {
    Message.error("请正确填写表单");
  }
};

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
  formVisible.value = false;
};

// 分页变化
const handlePageChange = (page: number) => {
  pagination.current = page;
  loadPosts();
};

// 查看详情
const viewDetail = (post: Posts) => {
  router.push(`/post/${post.id}`);
};

// 时间格式化
const formatTime = (time: string) => {
  return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
};
</script>

<style scoped>
.discuss-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.post-card {
  margin-bottom: 16px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 12px;

  .info {
    line-height: 1.4;

    .author {
      font-weight: 500;
    }

    .time {
      font-size: 12px;
      color: var(--color-text-3);
    }
  }
}

.title {
  margin: 12px 0;
  font-size: 18px;
  color: var(--color-text-1);
}

.stats {
  display: flex;
  justify-content: flex-end;
  color: var(--color-text-3);
  font-size: 12px;
}

:deep(.md-editor-preview-only .md-editor-preview-wrapper) {
  padding: 0;
}
</style>
