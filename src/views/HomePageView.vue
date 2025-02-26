<template>
  <div class="home-container">
    <!-- 顶部轮播图 -->
    <a-carousel
      :autoPlay="true"
      :style="{
        width: '100%',
        height: '240px',
      }"
      animation-name="card"
      indicator-position="outer"
      show-arrow="never"
    >
      <a-carousel-item
        v-for="(banner, index) in banners"
        :key="index"
        :style="{ width: '60%' }"
      >
        <img
          :src="banner.image"
          :style="{
            width: '100%',
          }"
          class="banner-image"
        />
        <div class="banner-mask">
          <h2 class="banner-title">{{ banner.title }}</h2>
          <p class="banner-desc">{{ banner.description }}</p>
        </div>
      </a-carousel-item>
    </a-carousel>
    <!-- 统计信息 -->
    <a-row :gutter="20" class="stats" justify="center">
      <a-col :span="10">
        <div>
          <a-statistic
            :value="totalProblems"
            :value-from="0"
            animation
            title="总题目数"
          />
        </div>
      </a-col>

      <a-col :span="10">
        <div>
          <a-statistic
            :value="dailySubmissions"
            :value-from="0"
            animation
            title="今日提交"
          />
        </div>
      </a-col>
    </a-row>
    <!-- 主要内容区域 -->
    <a-row :gutter="20" class="main-content">
      <!-- 右侧侧边栏 -->
      <a-col :span="8">
        <!-- 快速入口 -->
        <a-card :bordered="false" class="quick-access" title="快速入口">
          <a-space direction="vertical" fill>
            <a-button long type="primary" @click="goToProblemSet">
              <template #icon>
                <icon-book />
              </template>
              开始刷题
            </a-button>
          </a-space>
        </a-card>
      </a-col>
      <!-- 左侧区域 -->
      <a-col :span="16">
        <!-- 公告栏 -->
        <a-card :bordered="false" class="announcement-card" title="最新公告">
          <announcement-list :announcements="announcements" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";
import { IconBook } from "@arco-design/web-vue/es/icon";
import dayjs from "dayjs";
import AnnouncementList from "@/components/AnnouncementList.vue";
import { useRouter } from "vue-router";
import {
  AnnouncementControllerService,
  QuestionControllerService,
} from "../../generated";

// 轮播图数据
const banners = ref([
  {
    image:
      "http://8.138.10.224:9121/bsoj-image/user_avatar/1881247832371113985/M0JWu8PX-banner1.png",
    title: "春季编程大赛火热报名中",
    description: "参与即有机会获得万元奖金和名企内推机会",
  },
  {
    image:
      "http://8.138.10.224:9121/bsoj-image/user_avatar/1881247832371113985/SJaKHkSq-新增LeetCode经典题目200+.png",
    title: "全新算法题库上线",
    description: "新增LeetCode经典题目200+",
  },
  {
    image:
      "http://8.138.10.224:9121/bsoj-image/user_avatar/1881247832371113985/zbdMeQHJ-招聘.png",
    title: "BSOJ团队招新",
    description: "欢迎加入我们的团队，一起打造更好的OJ系统",
  },
]);

// 公告数据
const announcements = ref([
  {
    title: "系统维护通知",
    content: "计划于3月15日凌晨2:00-4:00进行系统维护",
    startTime: "2024-03-01",
    endTime: "2024-03-15",
    status: "published",
  },
]);
// 统计信息
const totalProblems = ref(0);
const dailySubmissions = ref(0);
// 后端获取公告信息
const announce = async () => {
  const res =
    await AnnouncementControllerService.listAnnouncementForUserUsingPost({
      current: 1,
      pageSize: 10,
    });
  if (res.code === 0) {
    announcements.value = res.data.records;
  }
};

// 获取题目总数
const qeustionCount = async () => {
  const res = await QuestionControllerService.getQuestionCountUsingGet();
  if (res.code === 0) {
    // 转换成数字
    res.data = Number(res.data);
    totalProblems.value = res.data;
    console.log(totalProblems.value);
  } else {
    totalProblems.value = 0;
  }
};

// 获取提交总数
const submissionCount = async () => {
  const res = await QuestionControllerService.getQuestionSubmitCountUsingGet();
  if (res.code === 0) {
    res.data = Number(res.data);
    dailySubmissions.value = res.data;
  } else {
    dailySubmissions.value = 0;
  }
};
//页面加载时获取
watchEffect(() => {
  announce();
  qeustionCount();
  submissionCount();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  announce();
  qeustionCount();
});
// 比赛数据
const contests = ref([
  {
    name: "周赛第128场",
    startTime: "2024-03-10 14:00",
    endTime: "2024-03-10 17:00",
    participants: 2345,
  },
]);

// 排行榜数据
const rankings = ref([
  { username: "CodeMaster", solved: 15 },
  { username: "算法新人", solved: 12 },
  { username: "Vue爱好者", solved: 10 },
]);

// 时间格式化
const formatTime = (time) => {
  return dayjs(time).format("YYYY-MM-DD HH:mm");
};

const router = useRouter();
// 路由跳转方法
const goToProblemSet = () => {
  // 实际项目中用 router.push
  router.push({
    path: "/question/view",
  });
  console.log("跳转到题库");
};

const goToContests = () => {
  console.log("跳转到比赛列表");
};

const goToRanking = () => {
  console.log("跳转到排行榜");
};
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.banner-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.banner-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
}

.banner-title {
  margin: 0 0 8px 0;
  font-size: 24px;
}

.banner-desc {
  margin: 0;
  opacity: 0.9;
}

.announcement-card,
.contest-card,
.quick-access,
.ranking-card {
  margin-bottom: 20px;
}

.contest-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.contest-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.contest-name {
  font-weight: 500;
}

.contest-time {
  color: var(--color-text-3);
  font-size: 12px;
}

.stats {
  margin-top: 30px;
}

:deep(.arco-statistic) {
  background: var(--color-bg-2);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

:deep(.arco-statistic-title) {
  font-size: 14px;
  color: var(--color-text-2);
}
</style>
