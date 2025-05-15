const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");
const ProductSpecification = require('../../models/productSpecification');
const Category = require('../../models/categoryList');
const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};
   
const addProduct = async (req, res) => {
  try {
    const {
      image,
      productName,
      description,
      categoryId,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
      specifications,
    } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại." });
    }
    const newProduct = new Product({
      image,
      productName,
      description,
      categoryId,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    });
    const savedProduct = await newProduct.save();
    if (specifications && specifications.length > 0) {
      for (const spec of specifications) {
        await ProductSpecification.create({
          productId: savedProduct._id,
          specId: spec.specId,
          value: spec.value,
         
        });
      }
    }
    res.status(201).json({
      success: true,
      data: newProduct,
      
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};


const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});

    const productsWithSpecs = await Promise.all(
      listOfProducts.map(async (product) => {
        const specifications = await ProductSpecification.find({ productId: product._id }).populate({
          path: 'productId', 
          select: 'categoryId', 
          model: 'Product'
        });

       
        return {
          ...product.toObject(), 
          specifications, 
        };
      })
    );

    res.status(200).json({
      success: true,
      data: productsWithSpecs, 
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      productName,
      description,
      categoryId,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
      specifications = [],
    } = req.body;
    
    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.productName = productName || findProduct.productName;
    findProduct.description = description || findProduct.description;
    findProduct.categoryId = categoryId || findProduct.categoryId;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice = salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    console.log("findProduct.image",req.body)
    findProduct.averageReview = averageReview || findProduct.averageReview;
    await findProduct.save();
    await ProductSpecification.deleteMany({ productId: id });
    if (specifications.length > 0) {
      for (const spec of specifications) {
        await ProductSpecification.create({
          productId: id,
          specId: spec.specId,
          value: spec.value,
        });
      }
    }
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
      await ProductSpecification.deleteMany({ productId: id });
    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};