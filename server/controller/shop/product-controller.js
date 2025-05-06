const Product = require("../../models/Product");
const Category = require("../../models/categoryList");
const Specification = require("../../models/productSpecification");

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;

        break;
      case "price-hightolow":
        sort.price = -1;

        break;
      case "title-atoz":
        sort.title = -1;

        break;

      case "title-ztoa":
        sort.title = 1;

        break;

      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    const specifications = await Specification.
    find({ productId: product._id }).populate({
      path: 'specId', 
      select: 'specName specUnit', 
      model: 'specificationList'
    }).lean();
    const formattedSpecs = specifications.map((spec) => ({
      name: spec.specId?.specName || "Thông số không xác định",
      value: `${spec.value} ${spec.specId?.specUnit || ""}`.trim(),
    }));
    return res.status(200).json({
      success: true,
      data: {
        ...product.toObject(),
        specifications: formattedSpecs,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};
module.exports = { getFilteredProducts, getProductDetails,getCategories };