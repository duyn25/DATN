const mongoose = require("mongoose");
const Product = require("../models/Product");
const esClient = require("../helpers/esClient"); 

async function syncProducts() {
  await mongoose.connect('mongodb+srv://ngduytttb:ngduytttb@cluster0.mtfljp9.mongodb.net/');

  const noiChienMongo = await Product.find({ productName: /nồi chiên/i });
  console.log("MongoDB có sản phẩm 'nồi chiên':", noiChienMongo.length);

  const exists = await esClient.indices.exists({ index: 'products' });
  if (exists) {
    await esClient.indices.delete({ index: 'products' });
    console.log(" Đã xoá index cũ 'products'");
  }

  await esClient.indices.create({
    index: 'products',
    body: {
      settings: {
        analysis: {
          analyzer: {
            vi_analyzer: {
              tokenizer: "standard",
              filter: ["lowercase", "asciifolding"]
            }
          }
        }
      },
      mappings: {
        properties: {
          productId: { type: "keyword" },
          productName: { type: "text", analyzer: "vi_analyzer" },
          description: { type: "text", analyzer: "vi_analyzer" },
          brand: { type: "text", analyzer: "vi_analyzer" },
          price: { type: "float" },
          salePrice: { type: "float" },
          image: { type: "keyword" },
          sold: { type: "integer" }
        }
      }
    }
  });

  const products = await Product.find({});
  console.log(`Đang đồng bộ ${products.length} sản phẩm sang Elasticsearch...`);

  const bulkOps = products.flatMap(product => [
    { index: { _index: 'products', _id: product._id.toString() } },
    {
      productId: product._id.toString(),
      productName: product.productName,
      description: product.description,
      brand: product.brand,
      price: product.price,
      salePrice: product.salePrice,
      image: product.image,
      sold: product.sold
    }
  ]);

  await esClient.bulk({ refresh: true, operations: bulkOps });

  console.log(' Đã đồng bộ toàn bộ sản phẩm thành công!');
  process.exit();
}

syncProducts().catch(err => {
  console.error("❌ Sync failed:", err);
  process.exit(1);
});
