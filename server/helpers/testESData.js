const client = require('./esClient'); // đường dẫn đến esClient.js

async function getNoiLauDien() {
  try {
    const result = await client.search({
      index: 'products',
      size: 50, // tùy số lượng bạn muốn lấy
      query: {
        match_phrase: {
          productName: {
            query: "nồi lẩu điện",
            slop: 2 // cho phép cách nhau 1–2 từ
          }
        }
      }
    });

    const hits = result.hits.hits;
    console.log(`Tìm thấy ${hits.length} sản phẩm nồi lẩu điện:`);
    for (const hit of hits) {
      console.log("- " + hit._source.productName);
    }

  } catch (error) {
    console.error("❌ Lỗi khi tìm sản phẩm nồi lẩu điện:", error.message);
  }
}

getNoiLauDien();
