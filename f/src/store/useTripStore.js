import { create } from "zustand";
import api from "../api";

const useTripStore = create((set) => ({
  loading: false,

  generateTrip: async (formData) => {
    set({ loading: true });
    try {
      const res = await api.post("/trip/overview", formData);
      return res.data?.overview?.trip_outline || [];
    } catch (err) {
      console.error("Error generating trip:", err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  

  
}));

export default useTripStore;
