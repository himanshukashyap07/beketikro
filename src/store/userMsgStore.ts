"use client";

import { create } from "zustand";
import axios from "axios";

interface Message {
  _id: string;
  content: string;
  owner: string;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MsgStore {
  msgs: Message[];
  editingId: string | null;
  loading: boolean;

  setEditingId: (id: string | null) => void;
  fetchMsgs: () => Promise<void>;
  addMsg: (content: string) => Promise<void>;
  updateMsg: (id: string, content: string) => Promise<void>;
  deleteMsg: (id: string) => Promise<void>;
}

export const useMsgStore = create<MsgStore>((set, get) => ({
  msgs: [],
  editingId: null,
  loading: false,

  setEditingId: (id) => set({ editingId: id }),

  // 🔥 GET + SORT newest → oldest
  fetchMsgs: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/api/getMessages");

      const filtered = res.data.msg
        .filter((m: any) => m.isDelete === false)
        .sort(
          (a: Message, b: Message) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      set({ msgs: filtered });
    } finally {
      set({ loading: false });
    }
  },

  // 🔥 ADD + AUTO REFRESH
  addMsg: async (content) => {
    await axios.post("/api/sendMsg", { content });

    // force update after add
    await get().fetchMsgs();
  },

  // 🔥 UPDATE + AUTO REFRESH
  updateMsg: async (id, content) => {
    await axios.put(`/api/msgUpdate/${id}`, { content });

    await get().fetchMsgs(); // refresh again with newest order
    set({ editingId: null });
  },

  // 🔥 DELETE + AUTO REFRESH
  deleteMsg: async (id) => {
    await axios.patch(`/api/msgDelete/${id}`);

    await get().fetchMsgs(); // refresh list after delete
  },
}));
