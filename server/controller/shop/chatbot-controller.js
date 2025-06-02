const axios = require("axios");
const Product = require("../../models/Product");

function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}


const chatWithBot = async (req, res) => {
  const { message, conversation = [] } = req.body;

  try {
    const convertedConversation = conversation
      .filter((msg) => !!msg.text?.trim())
      .map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text.trim(),
      }));

    const extractRes = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
          {
            role: "system",
            content:
              `Bạn là trợ lý bán hàng. Trích xuất từ khóa chính xác về sản phẩm người dùng cần tìm. Trả về JSON: { "keywords": "..." }`,
          },
          ...convertedConversation,
          { role: "user", content: message },
        ],
        temperature: 0.5,
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer f7392edf09d78806c701f327ec170eadbc92fa7316d060a5eb8f867fed3ac1e0`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = extractRes?.data?.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      return res.json({
        reply: "Tôi chưa hiểu rõ yêu cầu của bạn. Bạn có thể nói rõ hơn không?",
      });
    }

    const { keywords } = JSON.parse(jsonMatch[0]);
    if (!keywords || typeof keywords !== "string") {
      return res.json({
        reply: "Bạn có thể mô tả rõ hơn sản phẩm bạn cần không ạ?",
      });
    }

    const normalizedKeyword = removeVietnameseTones(keywords).toLowerCase();
    const allProducts = await Product.find();

    const matchedProducts = allProducts.filter((p) => {
      const name = removeVietnameseTones(p.productName || "").toLowerCase();
      const desc = removeVietnameseTones(p.description || "").toLowerCase();
      return name.includes(normalizedKeyword) || desc.includes(normalizedKeyword);
    });

    if (matchedProducts.length === 0) {
      return res.json({
        reply: "Hiện mình chưa tìm thấy sản phẩm phù hợp với yêu cầu của bạn.",
        products: [],
      });
    }

    const topProducts = matchedProducts.slice(0, 5);

    const productText = topProducts
      .map((p, i) =>
        `${i + 1}. ${p.productName} - Giá: ${
          p.salePrice > 0
            ? `${p.salePrice.toLocaleString()}đ (giảm giá)`
            : `${p.price.toLocaleString()}đ`
        }`
      )
      .join("\n");

    const answerRes = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
          {
            role: "system",
            content: `Bạn là nhân viên bán hàng điện máy. Chỉ dựa vào danh sách sản phẩm dưới đây để tư vấn.`,
          },
          {
            role: "user",
            content: `Khách hàng cần: "${message}". Đây là danh sách sản phẩm:\n\n${productText}`,
          },
        ],
        temperature: 0.6,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer f7392edf09d78806c701f327ec170eadbc92fa7316d060a5eb8f867fed3ac1e0`,
          "Content-Type": "application/json",
        },
      }
    );

    const finalReply =
      answerRes?.data?.choices?.[0]?.message?.content ||
      "Hiện mình chưa có gợi ý cụ thể. Bạn có thể mô tả thêm không?";

    const products = topProducts.map((p) => ({
      _id: p._id,
      name: p.productName,
      price: p.salePrice,
      salePrice : p.salePrice,
      images: p.image || [],
    }));

    return res.json({
      reply: finalReply,
      products,
    });
  } catch (err) {
    console.error("❌ Chatbot error:", err);
    return res.status(500).json({
      reply: "Chatbot đang gặp sự cố. Vui lòng thử lại sau.",
    });
  }
};

module.exports = { chatWithBot };
