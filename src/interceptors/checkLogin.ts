// 假设你有一个 axios 实例
import axios from "axios";
import { useUserStore } from "@/store/modulers/user";

const userStore = useUserStore();
// 请求拦截器
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 40100) {
      // 清除 Pinia 中的用户信息
      userStore.$reset();
      // 重定向到登录页面
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
