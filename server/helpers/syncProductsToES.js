const mongoose = require("mongoose");
const Product = require("../models/Product");
const esClient = require("./esClient");

async function syncProducts() {
  await mongoose.connect('mongodb+srv://ngduytttb:ngduytttb@cluster0.mtfljp9.mongodb.net/'); 

  const products = await Product.find({});
  for (const product of products) {
    await esClient.index({
      index: 'products',
      id: product._id.toString(),
      document: {
        productId: product._id.toString(),
        productName: product.productName,
        description: product.description,
        brand: product.brand,
        price: product.price,
        salePrice: product.salePrice,
        image: product.image,
        sold: product.sold
      }
    });
  }
  console.log('Sync xong!');
  process.exit();
}

syncProducts();
