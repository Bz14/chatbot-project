import { useState } from "react";
import axios from "axios";

interface ChatMessage {
  role: string;
  content: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message: input,
      });
      const botMessage = { role: "bot", content: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error communicating with the bot:", error);
    }
    setInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md">
        <div className="p-4 h-96 overflow-y-auto border-b border-gray-200">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${
                msg.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <p
                className={`inline-block px-4 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
                {msg.content}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center p-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
