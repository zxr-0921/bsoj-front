import { RouteRecordRaw } from "vue-router";
import UserLayout from "@/layouts/UserLayout.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import QuestionSubmitView from "@/views/question/QuestionSubmitView.vue";
import ViewQuestionView from "@/views/question/ViewQuestionView.vue";
import DiscussView from "@/views/DisscussView.vue";
import AddPostView from "@/views/post/AddPostView.vue";
import AdminView from "@/layouts/AdminLayout.vue";
import TeacherManageView from "@/views/manage/TeacherManageView.vue";
import StudentManageView from "@/views/manage/StudentManageView.vue";
import NoticeManageView from "@/views/manage/NoticeManageView.vue";
import PostManageView from "@/views/manage/PostManageView.vue";

export const routes: Array<RouteRecordRaw> = [
  // 用户
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "/user/login",
        name: "用户登录",
        component: UserLoginView,
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: UserRegisterView,
      },
    ],
    meta: {
      hideInMenu: true,
    },
  },
  // 题目
  {
    path: "/",
    name: "主页",
    component: QuestionsView,
  },
  // {
  //   path: "/questions",
  //   name: "浏览题目",
  //   component: QuestionsView,
  // },
  {
    path: "/question_submit",
    name: "浏览题目提交",
    component: QuestionSubmitView,
  },
  {
    path: "/view/question/:id",
    name: "在线做题",
    component: ViewQuestionView,
    props: true,
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/add/question",
    name: "创建题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.TEACHER,
    },
  },
  {
    path: "/update/question",
    name: "更新题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.TEACHER,
      hideInMenu: true,
    },
  },
  {
    path: "/manage/question/",
    name: "管理题目",
    component: ManageQuestionView,
    meta: {
      access: ACCESS_ENUM.TEACHER,
    },
  },

  // 讨论
  {
    path: "/discuss",
    name: "讨论",
    component: DiscussView,
    children: [],
  },
  // 创建帖子
  {
    path: "/add/post",
    name: "创建帖子",
    component: AddPostView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/admin",
    name: "管理员",
    component: AdminView,
    // meta: {
    //   access: ACCESS_ENUM.ADMIN,
    // },
    children: [
      {
        path: "/admin/student",
        name: "学生管理",
        component: StudentManageView,
      },
      {
        path: "/admin/teacher",
        name: "教师管理",
        component: TeacherManageView,
      },
      {
        path: "/admin/question",
        name: "题目管理",
        component: ManageQuestionView,
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
        component: NoticeManageView,
      },
    ],
  },

  {
    path: "/noAuth",
    name: "无权限",
    component: NoAuthView,
    meta: {
      hideInMenu: true,
    },
  },
  // {
  //   path: "/admin",
  //   name: "管理员可见",
  //   component: AdminView,
  //   meta: {
  //     access: ACCESS_ENUM.ADMIN,
  //   },
  // },
  // {
  //   path: "/about",
  //   name: "关于我的",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  // },
];
