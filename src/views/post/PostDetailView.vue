<template>
  <div class="post-detail-container">
    <!-- 帖子内容区 -->
    <a-card class="post-card">
      <!-- 头部信息 -->
      <div class="post-header">
        <a-space direction="vertical" fill size="large">
          <div class="meta">
            <a-avatar :image-url="postData.userVO?.userAvatar" :size="48">
              {{ postData.userVO?.userName?.charAt(0) }}
            </a-avatar>

            <div class="author-info">
              <div class="username">{{ postData.userVO?.userName }}</div>
              <div class="post-time">
                {{ formatTime(postData.publishTime) }}
                <span v-if="postData.updateTime"
                  >（编辑于 {{ formatTime(postData.updateTime) }}）</span
                >
              </div>
            </div>
            <!-- 在卡片的右上方 -->
            <!--            右对齐-->
            <div
              class="right"
              style="right: 30px; position: absolute"
              @click="$router.go(-1)"
            >
              <icon-double-left style="color: cornflowerblue" />
              返回上一页
            </div>
          </div>
          <h1 class="title">{{ postData.title }}</h1>

          <a-space class="tags">
            <a-tag
              v-for="tag in postData.tags"
              :key="tag"
              class="tag"
              color="arcoblue"
            >
              {{ tag }}
            </a-tag>
          </a-space>
        </a-space>
      </div>

      <!-- 内容区域 -->
      <div class="content">
        <MdViewer :value="postData.content || ''" />
      </div>
      <div v-if="postData.code">
        <md-viewer :value="postData.code || ''" />
      </div>

      <!-- 操作栏 -->
      <div class="action-bar">
        <a-space :size="24">
          <a-tooltip content="点赞">
            <a-button
              :type="hasLiked ? 'primary' : 'outline'"
              @click="handleLike"
            >
              <template #icon>
                <icon-like :fill="hasLiked ? 'currentColor' : 'none'" />
              </template>
              {{ postData.likes || "点赞" }}
            </a-button>
          </a-tooltip>

          <a-tooltip content="收藏">
            <a-button type="outline">
              <template #icon>
                <icon-star />
              </template>
              {{ postData.favorites || "收藏" }}
            </a-button>
          </a-tooltip>

          <a-tooltip content="分享">
            <a-button type="outline">
              <template #icon>
                <icon-share-external />
              </template>
              分享
            </a-button>
          </a-tooltip>
        </a-space>

        <div class="view-count">
          <icon-eye />
          <span>{{ postData.views }} 次浏览</span>
        </div>
      </div>
    </a-card>
    <!--    ai回答界面-->
    <a-card>
      <a-space direction="vertical" size="large">
        <h3>AI回答</h3>
        <a-divider />
        <div>
          <MdViewer :value="aiAnswer || '暂未生成回答'" />
        </div>
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { useUserStore } from "@/store/modulers/user";
import { PostsControllerService } from "../../../generated";
import MdViewer from "@/components/MdViewer.vue";

const route = useRoute();

// 帖子数据
const postData = ref({});

const onContentChange = (value: string) => {
  commentContent.value = value;
};
// 评论相关
const commentList = ref([]);
const commentContent = ref("");
const commentSort = ref("time");
const commentSubmitting = ref(false);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
});

// 获取帖子详情
const loadPostDetail = async () => {
  try {
    const res = await PostsControllerService.getPostVoByIdUsingGet(
      route.params.id
    );
    if (res.code === 0) {
      postData.value = res.data;
      // 更新浏览数
      postData.value.views += 1;
    }
  } catch (error) {
    console.error("加载帖子失败:", error);
  }
};

const aiAnswer = ref();
const getAiAnswer = async () => {
  try {
    const res = await PostsControllerService.getAiAnswerUsingGet(
      route.params.id
    );
    if (res.code === 0) {
      aiAnswer.value = res.data;
    }
  } catch (error) {
    console.error("加载AI回答失败:", error);
  }
};

// 工具函数
const formatTime = (time: string) => {
  return dayjs(time).format("YYYY-MM-DD HH:mm");
};

onMounted(async () => {
  await loadPostDetail();
  // await loadComments();
  await getAiAnswer();
});
</script>

<style scoped>
.post-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.post-header {
  margin-bottom: 24px;

  .meta {
    display: flex;
    align-items: center;
    gap: 16px;

    .author-info {
      line-height: 1.4;

      .username {
        font-size: 16px;
        font-weight: 500;
      }

      .post-time {
        color: var(--color-text-3);
        font-size: 12px;
      }
    }
  }

  .title {
    margin: 0;
    font-size: 24px;
  }

  .tags {
    margin-top: 12px;
  }
}

.content {
  margin: 24px 0;
  min-height: 200px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-2);

  .view-count {
    color: var(--color-text-3);
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.comment-section {
  margin-top: 32px;

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .comment-input {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;

    .editor {
      flex: 1;
    }

    .submit-btn {
      align-self: flex-end;
    }
  }

  .comment-list {
    border-top: 1px solid var(--color-border-2);
    padding-top: 16px;
  }
}

.comment-content {
  :deep(img) {
    max-width: 100%;
    border-radius: 4px;
    margin: 8px 0;
  }
}

.comment-actions {
  margin-top: 8px;
}
</style>
