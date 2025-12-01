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

  // GET all messages
  fetchMsgs: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/api/getMessages");
      const filtered = res.data.msg.filter((m: any) => m.isDelete === false);

      set({ msgs: filtered });  // <-- Fixed
    } finally {
      set({ loading: false });
    }
  },

  // POST create message
  addMsg: async (content) => {
    const res = await axios.post("/api/sendMsg", { content });

    set((state) => ({
      msgs: [...state.msgs, res.data.msg], // <-- Correct key
    }));
  },

  // PUT update message
  updateMsg: async (id, content) => {
    await axios.put(`/api/msgUpdate/${id}`, { content });

    set((state) => ({
      msgs: state.msgs.map((m) =>
        m._id === id ? { ...m, content } : m
      ),
      editingId: null,
    }));
  },

  // DELETE message
  deleteMsg: async (id) => {
    await axios.patch(`/api/msgDelete/${id}`);

    set((state) => ({
      msgs: state.msgs.filter((m) => m.isDelete !== true),
    }));
  },
}));
