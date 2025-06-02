const categoryList = require('../../models/categoryList');
const categorySpec = require('../../models/categorySpec');
const specificationList = require("../../models/specificationList");
const Product = require("../../models/Product");
const addCategory = async (req, res) => {
  try {
    const { categoryName, specifications } = req.body;

    const existCategory = await categoryList.findOne({ categoryName });
    if (existCategory) {
      return res.status(400).json({ message: "Danh mục đã tồn tại" });
    }

    const newCategory = new categoryList({ categoryName });
    await newCategory.save();

    if (specifications && specifications.length > 0) {
      const specPromises = specifications.map((specId) => {
        const categorySpecs = new categorySpec({
          categoryId: newCategory._id,
          specId: specId,
        });
        return categorySpecs.save();
      });
      await Promise.all(specPromises);
    }

    const specs = await categorySpec
      .find({ categoryId: newCategory._id })
      .populate({
        path: "specId",
        select: "specName",
        model: "specificationList",
      });

    const responseCategory = {
      _id: newCategory._id,
      categoryName: newCategory.categoryName,
      specifications: specs.map((item) => item.specId),
    };

    res.status(201).json({
      success: true,
      message: "Danh mục đã được tạo!",
      data: responseCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo danh mục",
      error: error.message,
    });
  }
};


const fetchAllCategories = async (req, res) => {
  try {
    const categories = await categorySpec.find()
      .populate({
        path: 'categoryId', 
        select: 'categoryName', 
        model: 'categoryList'
      })
      .populate({
        path: 'specId', 
        select: 'specName', 
         model: 'specificationList'
      })
      const categoryMap = new Map();

      categories.forEach((item) => {
        const categoryId = item.categoryId._id.toString();
        if (!categoryMap.has(categoryId)) {
          categoryMap.set(categoryId, {
            _id: categoryId,
            categoryName: item.categoryId.categoryName,
            specifications: [],
          });
        }
        categoryMap.get(categoryId).specifications.push({
          _id: item.specId._id,
          specName: item.specId.specName,
        });
      });
      
      const result = Array.from(categoryMap.values());

    res.status(200).json({ message: "Danh mục đã được lấy thành công.", data: result });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh mục", error: error.message });
  }
};


const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, specifications } = req.body;

    const category = await categoryList.findByIdAndUpdate(
      id,
      { categoryName },
      { new: true } 
    );

    if (!category) {
      return res.status(404).json({ message: "Danh mục không tìm thấy" });
    }

    await categorySpec.deleteMany({ categoryId: category._id });

    if (specifications && specifications.length > 0) {
      const specPromises = specifications.map((specId) => {
        const categorySpecs = new categorySpec({
          categoryId: category._id,
          specId,
        });
        return categorySpecs.save();
      });
      await Promise.all(specPromises);
    }

    const specs = await categorySpec
      .find({ categoryId: category._id })
      .populate({
        path: "specId",
        select: "specName",
        model: "specificationList",
      });

    const responseCategory = {
      _id: category._id,
      categoryName: category.categoryName,
      specifications: specs.map((item) => item.specId),
    };

    res.status(200).json({
      success: true,
      message: "Danh mục đã được cập nhật.",
      data: responseCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật danh mục",
      error: error.message,
    });
  }
};

 const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const categoryToDelete = await categoryList.findById(id);
    if (!categoryToDelete) {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại.",
      });
    }

    // Kiểm tra xem có sản phẩm nào đang sử dụng danh mục này không
    const isUsedByProduct = await Product.exists({ categoryId: id });
    if (isUsedByProduct) {
      return res.status(400).json({
        success: false,
        message: "Không thể xoá vì danh mục đang được sử dụng bởi sản phẩm.",
      });
    }

    // Xoá các bản ghi liên kết trong categorySpec
    const result = await categorySpec.deleteMany({ categoryId: id });
    console.log("Đã xoá thông số liên kết:", result.deletedCount);

    // Xoá danh mục
    await categoryToDelete.deleteOne();

    res.status(200).json({
      success: true,
      message: "Danh mục đã được xoá thành công.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi xoá danh mục.",
      error: error.message,
    });
  }
};
  
  module.exports = {
    addCategory,
    fetchAllCategories,
    editCategory,
    deleteCategory
  };