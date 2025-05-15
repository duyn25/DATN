const Category = require("../../models/categorySpec");
const specificationList = require("../../models/specificationList");

const normalizeAllowedValues = (raw) => {
  if (!raw) return [];

  if (Array.isArray(raw)) return raw.map(val => val.trim()).filter(Boolean);

  if (typeof raw === "string") {
    return raw
      .split(/\r?\n|,/) 
      .map(val => val.trim())
      .filter(Boolean);
  }

  return [];
};


const addSpec = async (req, res) => {
  try {
    const {
      specName,
      specDescription,
      specType,
      specUnit,
      allowedValues,
    } = req.body;

    const normalizedValues = normalizeAllowedValues(allowedValues);

    const newlyCreatedSpec = new specificationList({
      specName,
      specDescription,
      specType,
      specUnit,
      allowedValues: specType === 'select' ? normalizedValues : [],
    });

    await newlyCreatedSpec.save();
    res.status(201).json({
      success: true,
      message: "Thêm thông số thành công",
      data: newlyCreatedSpec,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi thêm thông số",
    });
  }
};

const fetchAllSpecs = async (req, res) => {
  try {
    const listOfSpecs = await specificationList.find({});
    res.status(200).json({
      success: true,
      data: listOfSpecs,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy thông số",
    });
  }
};

const editSpec = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      specName,
      specDescription,
      specType,
      specUnit,
      allowedValues,
    } = req.body;

    const findSpec = await specificationList.findById(id);
    if (!findSpec)
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông số",
      });

    findSpec.specName = specName || findSpec.specName;
    findSpec.specDescription = specDescription || findSpec.specDescription;
    findSpec.specType = specType || findSpec.specType;
    findSpec.specUnit = specUnit || findSpec.specUnit;

    if (specType === "select") {
      findSpec.allowedValues = normalizeAllowedValues(allowedValues);
    } else {
      findSpec.allowedValues = [];
    }

    await findSpec.save();
    res.status(200).json({
      success: true,
      data: findSpec,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật thông số",
    });
  }
};

const deleteSpec = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryUsingSpec = await Category.findOne({ specId: id });
    if (categoryUsingSpec) {
      return res.status(400).json({
        success: false,
        message: "Không thể xoá vì thông số đang được sử dụng",
      });
    }

    const spec = await specificationList.findByIdAndDelete(id);
    if (!spec)
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông số để xoá",
      });

    res.status(200).json({
      success: true,
      message: "Xoá thông số thành công",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi xoá thông số",
    });
  }
};

module.exports = {
  addSpec,
  editSpec,
  fetchAllSpecs,
  deleteSpec,
};
