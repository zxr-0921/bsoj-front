<template>
  <div>
    <div class="add-post">
      <a-button shape="round" type="primary" @click="addPost"
        >发布帖子
      </a-button>
    </div>
    <ListPost class="listPost" />
  </div>
</template>

<script lang="ts" setup>
import ListPost from "@/components/ListPost.vue";
import { useRouter } from "vue-router";

const router = useRouter();
// 发布帖子
const addPost = () => {
  router.push("/add/post");
};
</script>

<style scoped>
.add-post {
  text-align: left;
}

.listPost {
  margin-top: 20px;
}
</style>
