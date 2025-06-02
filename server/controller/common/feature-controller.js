const Feature = require("../../models/Feature");

// [POST] /api/common/feature/add
const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Thiếu đường dẫn ảnh.",
      });
    }

    const newFeature = new Feature({ image });
    await newFeature.save();

    res.status(201).json({
      success: true,
      data: newFeature,
    });
  } catch (e) {
    console.error("Lỗi khi thêm ảnh nổi bật:", e);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi thêm ảnh.",
    });
  }
};

// [GET] /api/common/feature/get
const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    console.error("Lỗi khi lấy danh sách ảnh:", e);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy ảnh.",
    });
  }
};

// [DELETE] /api/common/feature/delete/:id
const deleteFeatureImage = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Feature.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ảnh để xoá.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Đã xoá ảnh thành công.",
    });
  } catch (e) {
    console.error("Lỗi khi xoá ảnh:", e);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi xoá ảnh.",
    });
  }
};

module.exports = {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
};
