"use client";

import { useEffect, useState } from "react";
import { useMsgStore } from '@/store/userMsgStore';
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const {
    msgs,
    fetchMsgs,
    addMsg,
    updateMsg,
    deleteMsg,
    editingId,
    setEditingId,
    loading,
  } = useMsgStore();
  const [content, setContent] = useState("");
  const [updatedText, setUpdatedText] = useState("");

  useEffect(() => {
    fetchMsgs();
  }, [deleteMsg,addMsg]);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-200 via-pink-100 to-yellow-100">


      {/* Input Box Row */}
      <div className="max-w-3xl mx-auto mt-8 bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-xl font-bold text-indigo-600 mb-3">Send Message</h2>

        <div className="flex gap-3">
          <input
            type="text"
            className="flex-1 p-3 border text-black border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your message..."
          />

          <button
            onClick={() => {
              if (!content.trim()) return;
              addMsg(content);
              setContent("");
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Send
          </button>
        </div>
      </div>

      {/* Messages Table */}
      <div className="max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow-xl p-8 border-t-4 border-indigo-500">
        <h2 className="text-2xl font-bold mb-6 text-indigo-600">
          All Messages
        </h2>

        {loading && <p className="animate-pulse text-gray-500">Loading messages...</p>}

        <table className="w-full border-collapse overflow-hidden rounded-xl shadow">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="p-3 text-left">Content</th>
              <th className="p-3 text-center w-40">Actions</th>
            </tr>
          </thead>

          <tbody>
            {msgs && msgs.map((msg) => (
              <tr
                key={msg._id}
                className="border-b hover:bg-indigo-50 text-black transition bg-white"
              >
                <td className="p-3">
                  {editingId === msg._id ? (
                    <input
                      value={updatedText}
                      autoFocus
                      onChange={(e) => setUpdatedText(e.target.value)}
                      onBlur={() => updateMsg(msg._id, updatedText)}
                      className="border text-black border-indigo-300 p-2 rounded-lg w-full focus:ring focus:ring-indigo-400 outline-none"
                    />
                  ) : (
                    <span className="font-medium flex flex-row justify-between">
                      <span className=" block text-wrap flex-wrap ">{msg.content}</span>
                      <span >{ new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  )}
                </td>

                <td className="p-3 flex items-center justify-center gap-3">

                  {/* Update Button */}
                  <button
                    onClick={() => {
                      setEditingId(msg._id);
                      setUpdatedText(msg.content);
                    }}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow"
                  >
                    Update
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={()=>deleteMsg(msg._id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
