<template>
  <div class="announcement-list">
    <a-list
      :bordered="false"
      :data="processedAnnouncements"
      :pagination="{ pageSize: 5 }"
      :split="false"
    >
      <template #item="{ item }">
        <a-card class="announcement-item" hoverable>
          <!-- 标题区域 -->
          <div class="header">
            <div class="title-section">
              <h3 class="title">
                {{ item.title }}
              </h3>
              <div class="meta">
                <span class="time">
                  <icon-clock-circle />
                  {{ formatTime(item.publishTime) }}
                </span>
                <a-tag color="green" size="small"> 进行中</a-tag>
              </div>
            </div>
          </div>

          <!-- 内容区域 -->
          <a-collapse
            :bordered="false"
            :default-active-key="item.expand ? ['content'] : []"
          >
            <a-collapse-item
              key="content"
              :show-expand-icon="false"
              header="查看详情"
            >
              <div class="content" v-html="item.content"></div>
            </a-collapse-item>
          </a-collapse>
        </a-card>
      </template>

      <!-- 空状态 -->
      <template #empty>
        <a-empty description="暂无公告" />
      </template>
    </a-list>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import dayjs from "dayjs";
import { IconClockCircle } from "@arco-design/web-vue/es/icon";
import { defineProps } from "vue";

const props = defineProps({
  announcements: {
    type: Array,
    default: () => [],
  },
});

// 处理公告数据
const processedAnnouncements = computed(() => {
  return props.announcements.map((announcement) => ({
    ...announcement,
    expand: false,
  }));
});

// 时间格式化
const formatTime = (time) => {
  return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
};
</script>

<style scoped>
.announcement-list {
  background: var(--color-bg-2);
  border-radius: 8px;
}

.announcement-item {
  margin-bottom: 12px;
  transition: all 0.2s;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }

  &.expired {
    opacity: 0.7;

    .title {
      color: var(--color-text-3);
    }
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.title {
  margin: 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag {
  align-self: flex-start;
  flex-shrink: 0;
}

.meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-text-3);
  font-size: 12px;
}

.time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.content {
  line-height: 1.6;
  color: var(--color-text-2);

  :deep(img) {
    max-width: 100%;
    height: auto;
    margin: 8px 0;
    border-radius: 4px;
  }
}

.attachments {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--color-border-2);
}

.attachment-title {
  color: var(--color-text-3);
  font-size: 12px;
  margin-bottom: 8px;
}
</style>
