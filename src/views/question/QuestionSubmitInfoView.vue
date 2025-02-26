<template>
  <div id="questionSubmitInfoView">
    <a-card>
      <template #title>
        <div
          :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }"
        >
          <a-avatar :size="24" :style="{ marginRight: '8px' }" shape="round">
            <a-image :src="questionSubmitVo.userVO?.userAvatar"></a-image>
          </a-avatar>
          <a-typography-text
            ><span style="font-size: 25px"
              >{{ questionSubmitVo.userVO?.userName }}
            </span>
            提交于{{ questionSubmitVo.createTime }}
          </a-typography-text>
        </div>
      </template>
      <template #extra>
        <a-space>
          <a-button
            v-if="
              questionSubmitVo.judgeInfo?.message ===
                JUDGE_INFO_ENUM.ACCEPTED ||
              loginUser.userRole === ACCESS_ENUM.ADMIN
            "
            status="success"
            type="primary"
            @click="goWriteSolutionPage"
          >
            <template #icon>
              <icon-pen />
            </template>
            <template #default>
              <div @click="addQuestionsolution">写题解</div>
            </template>
          </a-button>
        </a-space>
      </template>
      <a-card :style="{ marginBottom: '20px' }" title="评测结果">
        <a-list :bordered="false">
          <template #header>
            <a-space wrap>
              <a-tag
                v-if="
                  questionSubmitVo.judgeInfo?.message ===
                  JUDGE_INFO_ENUM.ACCEPTED
                "
                color="green"
                >{{ questionSubmitVo.judgeInfo?.message }}
              </a-tag>
              <a-tag
                v-else-if="
                  questionSubmitVo.judgeInfo?.message ===
                  JUDGE_INFO_ENUM.WRONG_ANSWER
                "
                color="red"
                >{{ questionSubmitVo.judgeInfo?.message }}
              </a-tag>
              <a-tag v-else color="orange"
                >{{ questionSubmitVo.judgeInfo?.message }}
              </a-tag>
            </a-space>
          </template>
          <a-list-item>
            <icon-compass size="15" />
            判题状态：<span v-if="questionSubmitVo.status == 0">等待中</span
            ><span v-if="questionSubmitVo.status == 1"
              ><a-tag bordered color="orange">判题中</a-tag></span
            ><span v-if="questionSubmitVo.status == 2"
              ><a-tag bordered color="green">成功</a-tag></span
            ><span v-if="questionSubmitVo.status == 3"
              ><a-tag bordered color="red">失败</a-tag></span
            ></a-list-item
          >
          <a-list-item>
            <icon-clock-circle size="15" />
            执行用时：<span style="font-weight: bold; font-size: 20px">{{
              questionSubmitVo.judgeInfo?.time
            }}</span>
            MS
          </a-list-item>
          <a-list-item>
            <icon-dashboard size="15" />
            消耗内存：
            <span style="font-weight: bold; font-size: 20px">{{
              questionSubmitVo.judgeInfo?.memory
            }}</span>
            KB
          </a-list-item>
        </a-list>
      </a-card>
      <a-card title="我的答案">
        <span v-if="questionSubmitVo.language !== 'plaintext'"
          >使用语言：<a-tag
            :color="
              colors[
                Math.min(questionSubmitVo.language?.length as number, colors.length - 1)
              ]
            "
            >{{ questionSubmitVo.language }}</a-tag
          ></span
        >
        <br />
        <a-typography-text
          :copy-delay="1000"
          :copyable="true"
          style="font-size: 18px"
        >
          <MdViewer :value="answer"></MdViewer>
        </a-typography-text>
      </a-card>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref, withDefaults } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  QuestionControllerService,
  QuestionSubmitVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import MdViewer from "@/components/MdViewer.vue";
import { IconPen } from "@arco-design/web-vue/es/icon";

import ACCESS_ENUM from "@/access/accessEnum";
import JUDGE_INFO_ENUM from "@/enum/judgeInfoEnum";

/**
 * 用户信息
 */
let loginUser = JSON.parse(sessionStorage.getItem("user") as string);

const router = useRouter();

const addQuestionsolution = () => {
  router.push({
    path: `/solution/add/${questionSubmitVo.value.questionId}`,
  });
};
const answer = ref("```plaintext\n" + "wo shi tiancai\n" + "```");

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const questionSubmitVo = ref({} as QuestionSubmitVO);

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionSubmitByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    questionSubmitVo.value = res.data as QuestionSubmitVO;
    answer.value =
      "```" +
      questionSubmitVo.value.language +
      "\n" +
      questionSubmitVo.value.code +
      "\n" +
      "```";
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 去官方题解页面
 */
// const goOfficialSolutionPage = async () => {
//   loadingSubmit.value = true;
//   const res =
//     await ArticleMicroControllerService.getOfficialSolutionByQuestionIdUsingGet(
//       questionSubmitVo.value.questionId as any
//     );
//   loadingSubmit.value = false;
//   if (res.code === RESPONSE_ENUM.SUCCESS) {
//     if (res.data != null) {
//       router.push({
//         path: `/solution/view/${res.data.id}`,
//       });
//     } else {
//       message.warning("暂无官方题解");
//     }
//   } else {
//     message.error("加载失败，" + res.message);
//   }
// };

/**
 * 去写题解页面
 */
// const goWriteSolutionPage = () => {
//   router.push({
//     path: "/solution/add",
//     query: {
//       id: questionSubmitVo.value.questionId,
//     },
//   });
// };

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

/**
 * 标签颜色
 */
const colors = [
  "orangered",
  "gold",
  "lime",
  "cyan",
  "blue",
  "arcoblue",
  "purple",
  "pinkpurple",
  "magenta",
  "gray",
];
</script>

<style>
#questionSubmitInfoView {
  max-width: 1400px;
  margin: 0 auto;
}

#questionSubmitInfoView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}
</style>
