const Product = require("../../models/Product");
const CategorySpec = require("../../models/categorySpec");
const Category = require("../../models/categoryList");
const Specification = require("../../models/productSpecification");
const SpecDefinition = require("../../models/specificationList");

const getFilteredProducts = async (req, res) => {
  try {
    const {
      categoryId,
      brand,
      minPrice,
      maxPrice,
      specs: specsRaw,
      sortBy,
    } = req.query;

    const query = {};

    // Bộ lọc theo category
    if (categoryId && categoryId !== "") {
      query.categoryId = categoryId;
    }

    // Bộ lọc theo hãng
    if (brand && typeof brand === "string" && brand.trim() !== "") {
      query.brand = { $in: brand.split(',') };
    }

    // Bộ lọc theo giá
    if (minPrice || maxPrice) {
      const min = parseFloat(minPrice || 0);
      const max = parseFloat(maxPrice || Infinity);

      query.$or = [
        { salePrice: { $gt: 0, $gte: min, $lte: max } }, 
        {
          $and: [
            { $or: [{ salePrice: 0 }, { salePrice: null }] }, 
            { price: { $gte: min, $lte: max } },              g
          ],
        },
      ];
    }


    // Xử lý sắp xếp
    const sortMap = {
      "price-lowtohigh": { price: 1 },
      "price-hightolow": { price: -1 },
      "title-atoz": { productName: 1 },
      "title-ztoa": { productName: -1 },
    };
    const sortQuery = sortMap[sortBy] || {};

    let products = await Product.find(query).sort(sortQuery);

    // Lọc theo thông số kỹ thuật
    if (specsRaw) {
      let parsedSpecs = {};
      try {
        parsedSpecs = JSON.parse(specsRaw);
      } catch (err) {
        parsedSpecs = {};
      }

     
const validSpecConditions = Object.entries(parsedSpecs)
  .filter(([specId, values]) =>
    /^[a-fA-F0-9]{24}$/.test(specId) &&
    Array.isArray(values) &&
    values.length > 0
  )
  .flatMap(([specId, values]) =>
    values.map((val) => {
      const isNumericRange = /^\d+(\.\d+)?\s*-\s*\d+(\.\d+)?$/.test(val);
      if (isNumericRange) {
        const [min, max] = val.split("-").map(Number);
        return {
          $expr: {
            $and: [
              { $eq: ["$specId", { $toObjectId: specId }] },
              {
                $gte: [
                  {
                    $convert: {
                      input: "$value",
                      to: "double",
                      onError: null,
                      onNull: null,
                    },
                  },
                  min,
                ],
              },
              {
                $lte: [
                  {
                    $convert: {
                      input: "$value",
                      to: "double",
                      onError: null,
                      onNull: null,
                    },
                  },
                  max,
                ],
              },
            ],
          },
        };
      }

      // Trường hợp value là chuỗi (select/text)
      return {
        specId,
        value: val,
      };
    })
  );



      if (validSpecConditions.length > 0 && products.length > 0) {
        const productIds = products.map((p) => p._id);

        const matchingSpecs = await Specification.find({
          productId: { $in: productIds },
          $or: validSpecConditions,
        });

        const matchedProductIds = matchingSpecs.map((m) =>
          m.productId.toString()
        );

        products = products.filter((p) =>
          matchedProductIds.includes(p._id.toString())
        );
      }
    }

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Lỗi khi lọc sản phẩm:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
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

    const specifications = await Specification
      .find({ productId: product._id })
      .populate({
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

const getFilterFieldsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;
    if (!categoryId) {
      return res.status(400).json({ success: false, message: "Thiếu categoryId" });
    }

    const products = await Product.find({ categoryId }).select("_id").lean();
    const productIds = products.map((p) => p._id);

    const catSpecs = await CategorySpec.find({ categoryId }).lean();
    const specIds = catSpecs.map(cs => cs.specId);

    const specs = await SpecDefinition.find({ _id: { $in: specIds } }).lean();

    const specValues = await Specification.find({
      productId: { $in: productIds },
      specId: { $in: specIds }
    }).lean();

    const valueMap = {};
    specValues.forEach(spec => {
      const id = spec.specId.toString();
      const rawValue = (spec.value || "").toString().trim();
      if (!rawValue) return;
      if (!valueMap[id]) valueMap[id] = new Set();
      valueMap[id].add(rawValue);
    });

    const generateSmartBuckets = (values, desiredBuckets = 4) => {
      const nums = values
        .map(v => parseFloat(v))
        .filter(n => !isNaN(n))
        .sort((a, b) => a - b);

      if (nums.length < 2) return [];

      const min = Math.floor(nums[0]);
      const max = Math.ceil(nums[nums.length - 1]);
      const range = max - min;

      if (range === 0) return [];

      const rawStep = range / desiredBuckets;

      const niceSteps = [1, 5, 10, 20, 50, 100, 200, 500, 1000];
      const step = niceSteps.find(s => s >= rawStep) || 4000;

      const buckets = [];
      let current = Math.floor(min / step) * step;

      while (current < max) {
        const from = current;
        const to = current + step;
        buckets.push({
          id: `${from}-${to}`,
          label: `${from} - ${to}`,
          min: from,
          max: to
        });
        current = to;
      }

      if (nums[nums.length - 1] > buckets[buckets.length - 1].max) {
        const lastMax = buckets[buckets.length - 1].max;
        buckets.push({
          id: `${lastMax}+`,
          label: `Trên ${lastMax}`,
          min: lastMax,
          max: Infinity
        });
      }

      return buckets;
    };

    const enrichedSpecs = specs.map(spec => {
      const rawValues = Array.from(valueMap[spec._id.toString()] || []).sort();
      let rangePresets = [];
      if (spec.specType === "number") {
        rangePresets = generateSmartBuckets(rawValues);
      }

      return {
        ...spec,
        values: rawValues,
        rangePresets
      };
    });

    res.status(200).json({ success: true, data: enrichedSpecs });
  } catch (error) {
    console.error("Lỗi khi lấy thông số lọc:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const homeProducts = async (req, res) => {
  try {
    const topSelling = await Product.find({})
      .sort({ sold: -1 })
      .limit(5);

    const newProducts = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    const saleProducts = await Product.aggregate([
      { $match: { salePrice: { $gt: 0 } } },
      { $addFields: { salePercent: { $subtract: [100, { $multiply: [{ $divide: ["$salePrice", "$price"] }, 100] }] } } },
      { $sort: { salePercent: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        topSelling,
        newProducts,
        hotSales: saleProducts
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Server error"
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

module.exports = {
  getFilteredProducts,
  getFilterFieldsByCategory,
  getProductDetails,
  getCategories,
  homeProducts,
};
