<template>
  <a-list
    :bordered="false"
    :data="dataSource"
    :pagination-props="paginationProps"
    class="list-demo-action-layout"
  >
    <template #item="{ item }">
      <a-list-item action-layout="vertical" class="list-demo-item">
        <a-list-item-meta :description="item.content" :title="item.title">
        </a-list-item-meta>
        <template #actions>
          <span :key="item.id" class="action" @click="onLikeChange(item.id)">
            <span v-if="like">
              <IconHeartFill :style="{ color: '#f53f3f' }" />
            </span>
            <span v-else> <IconHeart /> </span>
            {{ like ? item.thumbNum + like : item.thumbNum }}
          </span>
          <span :key="item.id" class="action" @click="onStarChange(item.id)">
            <span v-if="star">
              <IconStarFill
                :style="{
                  color: '#ffb400',
                }"
              />
            </span>
            <span v-else> <IconStar /> </span>
            {{ star ? item.favourNum + star : item.favourNum }}
          </span>
          <span><icon-message />评论</span></template
        >
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts" setup>
import {
  PostControllerService,
  PostFavourControllerService,
  PostThumbControllerService,
} from "../../generated";
import { onMounted, ref, watchEffect } from "vue";
// 点赞收藏
const like = ref(0);
const star = ref(0);
// 点赞事件
const onLikeChange = async (id: number) => {
  const res = await PostThumbControllerService.doThumbUsingPost({ postId: id });
  if (res.code == 0) {
    console.log("点赞成功");
    like.value = res.data;
    console.log(res.data);
  } else {
    console.log("点赞失败");
  }
};
// 收藏事件
const onStarChange = async (id: number) => {
  const res = await PostFavourControllerService.doPostFavourUsingPost({
    postId: id,
  });
  if (res.code == 0) {
    console.log("收藏成功");
    star.value = res.data;
  } else {
    console.log("收藏失败");
  }
};

// 帖子列表
const dataSource = ref([]);
const total = ref(0);
// 查询参数
const searchParams = ref({ pageSize: 10, current: 1 });
// 分页参数
const paginationProps = ref({
  current: searchParams.value.current,
  pageSize: searchParams.value.pageSize,
  total: total,
});

const loadData = async () => {
  const res = await PostControllerService.listPostVoByPageUsingPost(
    searchParams.value
  );
  if (res.code == 0) {
    dataSource.value = res.data.records;
    total.value = res.data.total;
  }
};
/**  * 监听 searchParams 变量，改变时触发页面的重新加载  */
watchEffect(() => {
  loadData();
});
/**  * 页面加载时，请求数据  */ onMounted(() => {
  loadData();
});
</script>

<style scoped>
.list-demo-action-layout {
}

.list-demo-action-layout .image-area {
  width: 183px;
  height: 119px;
  border-radius: 2px;
  overflow: hidden;
}

.list-demo-action-layout .list-demo-item {
  margin: 20px 0;
  padding: 20px 0;
  border-bottom: 1px solid var(--color-fill-3);
  background-color: #f3f3f3; /* 灰白色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

.list-demo-action-layout .image-area img {
  width: 100%;
}

.list-demo-action-layout .arco-list-item-action .arco-icon {
  margin: 0 4px;
}
</style>
