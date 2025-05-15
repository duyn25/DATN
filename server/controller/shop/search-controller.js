const esClient = require("../../helpers/esClient");

// 1. Tìm kiếm sản phẩm chính xác hơn
const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be in string format",
      });
    }

    const result = await esClient.search({
      index: 'products',
      size: 20,
      query: {
        bool: {
          should: [
            {
              match_phrase: {
                productName: {
                  query: keyword,
                  slop: 2
                }
              }
            },
            {
              multi_match: {
                query: keyword,
                fields: ["productName^2", "description", "brand"],
                fuzziness: "auto"
              }
            }
          ]
        }
      }
    });

    const hits = result.hits?.hits?.map(hit => hit._source) || [];
    res.status(200).json({ success: true, data: hits });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error",
      error: error.message
    });
  }
};

const suggestProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    if (!keyword) {
      return res.status(200).json({ success: true, products: [] });
    }
    const result = await esClient.search({
      index: 'products',
      size: 10,
      query: {
        bool: {
          should: [
            {
              match_phrase: {
                productName: {
                  query: keyword,
                  slop: 2
                }
              }
            },
            {
              multi_match: {
                query: keyword,
                fields: ["productName^2", "brand"],
                fuzziness: "auto"
              }
            }
          ]
        }
      },
      sort: [
        { sold: { order: "desc" } }
      ],
      _source: ["productName", "brand", "productId", "image", "price", "salePrice", "sold"]
    });

    const products = [];
    const seenNames = new Set();

    for (const hit of result.hits?.hits || []) {
      const { productName, brand, productId, image, price, salePrice, sold } = hit._source;
      if (productName && !seenNames.has(productName)) {
        products.push({ productName, brand, productId, image, price, salePrice, sold });
        seenNames.add(productName);
      }
      if (products.length === 3) break;
    }

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error",
      error: error.message,
      products: []
    });
  }
};

module.exports = { searchProducts, suggestProducts };
