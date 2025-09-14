import { create } from "zustand";
import api from "../api.js";

const useAuthStore = create((set) => ({
  user: null,
  isRegistering: false,
  isAuthenticated: false,
  isCheckingAuth: true,

  register: async (name, email, password) => {
    try {
      set({ isRegistering: true });
      const res = await api.post(
        "/user/register",
        { name, email, password },
        { withCredentials: true }
      );
      if (res.data.message === "User registered successfully") {
        set({ user: res.data.user, isAuthenticated: true });
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({ isRegistering: false });
    }
  },

  login: async (email, password) => {
    const res = await api.post(
      "/user/login",
      { email, password },
      { withCredentials: true }
    );
    set({ user: res.data.user, isAuthenticated: true });
    return res.data;
  },

  checkAuth: async () => {
    try {
      const res = await api.get("/user/me", { withCredentials: true });
      set({ user: res.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (err) {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },

  logout: async () => {
      try{
         await api.post("/user/logout", {} , {withCredentials:true})
         set({user: null,isAuthenticated: false})
      }catch(err){
        console.error("error in logging out")
      }
  }
}));

export default useAuthStore;
