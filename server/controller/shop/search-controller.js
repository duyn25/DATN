const esClient = require("../../helpers/esClient");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({ success: false, message: "Keyword is required" });
    }
    const result = await esClient.search({
      index: 'products',
      size: 50,
      query: {
        function_score: {
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
                    fields: ["productName^3", "description^2", "brand"],
                    fuzziness: "AUTO",
                    operator: "and"
                  }
                }
              ],
              minimum_should_match: 1
            }
          },
          boost_mode: "sum",
          functions: [
            {
              filter: { match: { productName: keyword } },
              weight: 2
            }
          ]
        }
      }
    });

    const hits = result.hits?.hits?.map(hit => hit._source) || [];
    res.status(200).json({ success: true, data: hits });

  } catch (error) {
    console.error("ES search error:", error.message);
    res.status(500).json({ success: false, message: "Search failed", error: error.message });
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
          must: [
            {
              match_phrase: {
                productName: { query: keyword, slop: 2 }
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
    const seen = new Set();

    for (const hit of result.hits?.hits || []) {
      const p = hit._source;
      if (!seen.has(p.productName)) {
        products.push(p);
        seen.add(p.productName);
      }
      if (products.length === 3) break;
    }

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("ES suggest error:", error.message);
    res.status(500).json({ success: false, message: "Suggest failed", error: error.message });
  }
};

module.exports = { searchProducts, suggestProducts };
