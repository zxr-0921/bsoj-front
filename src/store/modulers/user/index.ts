import { defineStore } from "pinia";
import AccessEnum from "@/access/accessEnum";
import { userState } from "@/store/modulers/user/types";
import { UserControllerService } from "../../../../generated";

export const useUserStore = defineStore("user", {
  // 请求接口获取当前用户信息
  state: () => {
    return {
      // 用户信息
      loginUser: {
        userName: "未登录",
        userRole: AccessEnum.NOT_LOGIN,
        userAvatar: "",
        userProfile: "",
      } as userState["loginUser"],
    };
  },
  persist: {
    enabled: true,
  },
  actions: {
    //获取当前用户
    async getLoginUser() {
      const res = await UserControllerService.getLoginUserUsingGet();
      console.log("登录信息返回", res);
      if (res.code === 0) {
        this.loginUser.userName = <string>res.data?.userName;
        this.loginUser.userRole = <string>res.data?.userRole;
        this.loginUser.userAvatar = <string>res.data?.userAvatar;
        this.loginUser.userProfile = <string>res.data?.userProfile;
      }
    },
  },
  getters: {},
});
