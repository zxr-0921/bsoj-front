import { RouteRecordRaw } from "vue-router";
import NoAuthView from "@/views/NoAuthView.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import QuestionManageView from "@/views/manage/QuestionManageView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import ViewQuestionView from "@/views/question/ViewQuestionView.vue";
import UserManageView from "@/views/manage/UserManageView.vue";
import PostManageView from "@/views/manage/PostManageView.vue";
import UserProfile from "@/views/user/UserProfile.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import HomePageView from "@/views/HomePageView.vue";
import DiscussView from "@/views/disscuss/DiscussView.vue";
import PostDetailView from "@/views/post/PostDetailView.vue";
import AnnouncementManage from "@/views/manage/AnnouncementManage.vue";
import QuestionSubmit from "@/views/question/QuestionSubmit.vue";
import QuestionSubmitInfoView from "@/views/question/QuestionSubmitInfoView.vue";
import AddPostSolutionView from "@/views/post/AddPostSolutionView.vue";
import QuestionSolutionInfoView from "@/views/post/QuestionSolutionInfoView.vue";

export const routes: Array<RouteRecordRaw> = [
  // 主页
  {
    path: "/",
    name: "主页",
    component: HomePageView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/noAuth",
    name: "无权限",
    component: NoAuthView,
    meta: { hideInMenu: true },
  },
  // 讨论
  {
    path: "/discuss",
    name: "讨论",
    component: DiscussView,
    meta: { hideInMenu: true },
  },

  // 用户
  {
    path: "/user",
    name: "用户模块",
    children: [
      {
        path: "/user/login",
        name: "用户登录",
        component: UserLoginView,
        meta: {
          hideInMenu: true,
        },
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: UserRegisterView,
        meta: { hideInMenu: true },
      },
      {
        path: "/user/info",
        name: "用户信息",
        component: UserProfile,
        meta: {
          hideInMenu: true,
          access: ACCESS_ENUM.USER,
        },
      },
    ],
    meta: {
      hideInMenu: true,
    },
  },

  // 题目模块
  {
    path: "/question",
    name: "题目",
    children: [
      {
        path: "/question/view",
        name: "题目中心",
        component: QuestionsView,
        meta: {
          hideInMenu: false,
        },
      },
      {
        path: "/question/submitList",
        name: "提交列表",
        component: QuestionSubmit,
        meta: {
          hideInMenu: false,
          access: ACCESS_ENUM.USER,
        },
      },
      {
        path: "/question/submit/info/:id",
        name: "提交详情",
        component: QuestionSubmitInfoView,
        props: true,
        meta: {
          hideInMenu: true,
        },
      },
      {
        path: "/question/submit/:id",
        name: "在线做题",
        component: ViewQuestionView,
        props: true,
        meta: {
          // access: ACCESS_ENUM.USER,
          hideInMenu: true,
        },
      },
      {
        path: "/add/question",
        name: "创建题目",
        component: AddQuestionView,
        meta: {
          hideInMenu: true,
          access: ACCESS_ENUM.TEACHER,
        },
      },
      // 应对路由跳转拦截
      {
        path: "/question/create",
        name: "新建题目",
        component: AddQuestionView,
        meta: {
          access: ACCESS_ENUM.TEACHER,
          hideInMenu: true,
        },
      },
      {
        path: "/question/update",
        name: "更新题目",
        component: AddQuestionView,
        meta: {
          access: ACCESS_ENUM.TEACHER,
          hideInMenu: true,
        },
      },
      // 应对路由跳转拦截
      {
        path: "/question/edit",
        name: "编辑题目",
        component: AddQuestionView,
        meta: {
          access: ACCESS_ENUM.TEACHER,
          hideInMenu: true,
        },
      },
      {
        path: "/question/manage",
        name: "我的题目",
        component: QuestionManageView,
        meta: {
          hideInMenu: false,
          access: ACCESS_ENUM.TEACHER,
        },
      },
      // {
      //   path: "/question/solution/my",
      //   name: "我的题解",
      //   component: ArticleListView,
      //   meta: {
      //     access: ACCESS_ENUM.USER,
      //     hideInMenu: false,
      //   },
      // },
    ],
    meta: {
      hideInMenu: false,
    },
  },

  // 题解模块
  {
    path: "/solution",
    name: "题解",
    children: [
      {
        path: "/solution/add/:id",
        name: "新建题解",
        component: AddPostSolutionView,
        props: true,
        meta: {
          access: ACCESS_ENUM.USER,
          hideInMenu: true,
        },
      },
    ],
    meta: {
      hideInMenu: true,
      oneLevelMenu: false,
    },
  },

  {
    path: "/post/:id",
    name: "帖子详情",
    component: PostDetailView,
    meta: {
      hideInMenu: true,
    },
  },

  {
    path: "/admin",
    name: "管理员",
    meta: {
      access: ACCESS_ENUM.ADMIN,
      hideInMenu: false,
    },
    children: [
      {
        path: "/admin/user",
        name: "用户管理",
        component: UserManageView,
      },
      {
        path: "/admin/question",
        name: "题目管理",
        component: QuestionManageView,
      },
      // 帖子管理
      {
        path: "/admin/post",
        name: "帖子管理",
        component: PostManageView,
      },
      // 公告管理
      {
        path: "/admin/notice",
        name: "公告管理",
        component: AnnouncementManage,
      },
    ],
  },
];
