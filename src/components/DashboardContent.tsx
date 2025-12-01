"use client";

import { useEffect, useState } from "react";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { useMsgStore } from '@/store/userMsgStore';
// Assuming your useMsgStoreMock or actual store is used here
// const { msgs, fetchMsgs, addMsg, updateMsg, deleteMsg, editingId, setEditingId, loading } = useMsgStoreMock();

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
  }, [fetchMsgs]);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-linear-to-br from-purple-200 via-pink-100 to-yellow-100">

      {/* Input Box */}
      <div className="max-w-4xl mx-auto mt-4 sm:mt-8 bg-white shadow-2xl rounded-xl p-4 sm:p-6">
        <h2 className="text-xl font-bold text-indigo-700 mb-3">Send Message</h2>
        <div className="flex gap-2 sm:gap-4">
          <input
            type="text"
            className="flex-1 p-3 border text-gray-800 border-indigo-300 rounded-xl focus:ring-4 focus:ring-indigo-500/50 outline-none transition duration-150"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your message..."
            aria-label="New message content"
          />
          <button
            onClick={() => {
              if (!content.trim()) return;
              addMsg(content);
              setContent("");
            }}
            className="px-4 py-3 sm:px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.02] shadow-md flex items-center justify-center"
            disabled={!content.trim()}
          >
            <span className="hidden sm:inline">Send</span>
            <svg className="sm:hidden w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="max-w-4xl mx-auto mt-6 sm:mt-10 bg-white rounded-xl shadow-2xl p-4 sm:p-8 border-t-8 border-indigo-600">
        <h2 className="text-2xl font-extrabold mb-6 text-indigo-700">Message History</h2>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-4">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-500">Loading messages...</p>
          </div>
        )}

        {/* Mobile Cards */}
        <div className="block sm:hidden space-y-4">
          {msgs && msgs.map(msg => (
            <div key={msg._id} className={`bg-white border p-4 rounded-xl shadow-lg transition duration-300 ${editingId === msg._id ? 'border-indigo-500 shadow-indigo-300/50' : 'border-gray-200 hover:border-indigo-300'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-gray-500">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {editingId !== msg._id && (
                  <button onClick={() => { setEditingId(msg._id); setUpdatedText(msg.content); }} className="p-1 text-indigo-500 hover:text-indigo-700 transition" title="Edit" aria-label="Edit Message">
                    <FiEdit className="w-5 h-5" />
                  </button>
                )}
              </div>

              {editingId === msg._id ? (
                <input
                  value={updatedText}
                  autoFocus
                  onChange={(e) => setUpdatedText(e.target.value)}
                  onBlur={() => {
                    if (updatedText.trim() && updatedText !== msg.content) updateMsg(msg._id, updatedText);
                    else { setEditingId(null); setUpdatedText(""); }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      (e.target as HTMLInputElement).blur(); 
                    }
                  }}
                  className="border text-gray-800 border-indigo-400 p-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none transition duration-150 wrap-break-words"
                  placeholder="Tap outside to save"
                />
              ) : (
                <p className="text-gray-800 wrap-break-words whitespace-pre-wrap">{msg.content}</p>
              )}

              {editingId !== msg._id && (
                <div className="flex justify-end mt-2">
                  <button onClick={() => deleteMsg(msg._id)} className="p-1 text-red-500 hover:text-red-700 transition" title="Delete" aria-label="Delete Message">
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {msgs && msgs.length === 0 && !loading && (
            <p className="text-center text-gray-500 py-4">No messages found. Start by sending one above!</p>
          )}
        </div>

        {/* Desktop / Table view */}
        <div className="hidden sm:block">
          <table className="w-full border-collapse overflow-hidden rounded-xl shadow-lg">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="p-4 text-left w-2/3">Content</th>
                <th className="p-4 text-left w-1/6 hidden md:table-cell">Time</th>
                <th className="p-4 text-center w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {msgs && msgs.map(msg => (
                <tr key={msg._id} className="border-b last:border-b-0 hover:bg-indigo-50 text-gray-800 transition bg-white">
                  <td className="p-4 wrap-break-words">{editingId === msg._id ? (
                    <input
                      value={updatedText}
                      autoFocus
                      onChange={(e) => setUpdatedText(e.target.value)}
                      onBlur={() => {
                        if (updatedText.trim() && updatedText !== msg.content) updateMsg(msg._id, updatedText);
                        else { setEditingId(null); setUpdatedText(""); }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          (e.target as HTMLInputElement).blur(); 
                        }
                      }}
                      className="border text-gray-800 border-indigo-400 p-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none transition duration-150 wrap-break-words"
                    />
                  ) : msg.content}</td>
                  <td className="p-4 text-gray-500 font-mono hidden md:table-cell">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="p-4 flex items-center justify-center gap-3">
                    {editingId === msg._id ? <span className="text-sm text-indigo-500 font-semibold">Saving...</span> : (
                      <>
                        <button onClick={() => { setEditingId(msg._id); setUpdatedText(msg.content); }} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-md transition duration-150 transform hover:scale-105">
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteMsg(msg._id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition duration-150 transform hover:scale-105">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
