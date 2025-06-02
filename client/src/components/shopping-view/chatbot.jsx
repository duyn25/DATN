import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageSquare, X } from "lucide-react";
import { Link } from "react-router-dom";

function ChatBotBox() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);

    const conversation = updatedMessages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    try {
      const res = await axios.post("http://localhost:5000/api/shop/chatbot/chat", {
        message,
        conversation,
      });

      const { reply, products } = res.data;

      const botMessage = {
        sender: "bot",
        text: reply || "Xin lỗi, tôi chưa có thông tin phù hợp.",
        products: products || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Xin lỗi, chatbot đang gặp sự cố." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg z-50"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-4 right-4 w-[360px] max-h-[500px] bg-white shadow-xl rounded-md border flex flex-col z-50">
          <div className="flex items-center justify-between p-3 border-b bg-red-600 text-white rounded-t-md">
            <h2 className="font-semibold text-sm">Tư vấn sản phẩm</h2>
            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] px-3 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "ml-auto bg-blue-100 text-right"
                    : "mr-auto bg-white border text-left"
                }`}
              >
                <span className="block font-medium text-gray-800 mb-1">
                  {msg.sender === "user" ? "Bạn" : "Chatbot"}
                </span>

                <span className="block whitespace-pre-line mb-2">{msg.text}</span>

                {msg.products?.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {msg.products.map((p, i) => (
                    <Link
                      to={`/shop/product/${p._id}`}
                      key={i}
                      className="border rounded-lg bg-white shadow-sm p-2 flex flex-col items-center hover:shadow-md transition cursor-pointer"
                    >
                      <img
                        src={p.images}
                        alt={p.name}
                        className="w-20 h-20 object-cover rounded mb-1"
                      />
                      <div className="text-xs font-medium text-gray-800 text-center line-clamp-2 h-[32px]">
                        {p.name}
                      </div>
                      <div className="text-sm mt-1 text-center">
                          {p.salePrice > 0 ? (
                            <>
                              <div className="text-gray-500 line-through text-xs">
                                {p.price?.toLocaleString()}₫
                              </div>
                              <div className="text-red-600 font-semibold">
                                {p.salePrice?.toLocaleString()}₫
                              </div>
                            </>
                          ) : (
                            <div className="text-red-600 font-semibold">
                              {p.price?.toLocaleString()}₫
                            </div>
                          )}
                        </div>

                    </Link>
                  ))}
                </div>
              )}

              </div>
            ))}

            {loading && <div className="text-gray-500 italic">Đang trả lời...</div>}
            <div ref={scrollRef} />
          </div>

          <div className="border-t p-2 bg-white flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Bạn cần hỗ trợ gì?"
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBotBox;
