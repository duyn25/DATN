
const specificationList = require("../../models/specificationList");

const addSpec = async (req, res) => {
  try {
    const {
        specName,
        specDescription,
        specType,
        specUnit,
    } = req.body;
    
    console.log(req.body, "Request Body");
    

    const newlyCreatedSpec = new specificationList({
      specName,
      specDescription,
      specType,
      specUnit,
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
      message: "Error occured",
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
      message: "Error occured",
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
    } = req.body;
    
    let findSpec = await specificationList.findById(id);
    if (!findSpec)
      return res.status(404).json({
        success: false,
        message: "Spec not found",
      });

    findSpec.specName = specName || findSpec.specName;
    findSpec.specDescription = specDescription || findSpec.specDescription;
    findSpec.specType = specType || findSpec.specType;
    findSpec.specUnit = specUnit || findSpec.specUnit;
    await findSpec.save();
    res.status(200).json({
      success: true,
      data: findSpec,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

const deleteSpec = async (req, res) => {
  try {
    const { id } = req.params;
    const spec = await specificationList.findByIdAndDelete(id);

    if (!spec)
      return res.status(404).json({
        success: false,
        message: "Spec not found",
      });

    res.status(200).json({
      success: true,
      message: "Speccification delete successfully",
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
  addSpec,
  editSpec,
  fetchAllSpecs,
  deleteSpec,
};