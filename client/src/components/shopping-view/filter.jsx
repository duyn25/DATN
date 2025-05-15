import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductFilter = ({ filters, handleFilter }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filterFields, setFilterFields] = useState([]);
  const selectedCategory = filters?.categoryId || "";

  const specRangePresets = {
    "680ad9e2bf49fe283ffc91ec": [ 
      { id: "0-500", label: "Dưới 500W" },
      { id: "501-1000", label: "500W - 1000W" },
      { id: "1001-999999", label: "Trên 1000W" },
    ],
     "681a8098608d859da8b3c85c": [ 
    { id: "0-5", label: "Dưới 5 lít" },
    { id: "5-10", label: "5 - 10 lít" },
    { id: "10-999", label: "Trên 10 lít" },
  ],
   
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/category/get')
      .then(res => setCategories(res.data.data))
      .catch(err => console.error('Lỗi khi tải danh mục', err));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/shop/product/get')
      .then(res => {
        const allBrands = res.data.data.map(p => p.brand).filter(Boolean);
        const uniqueBrands = [...new Set(allBrands)].map(b => ({ id: b, label: b }));
        setBrands(uniqueBrands);
      })
      .catch(err => console.error('Lỗi khi tải thương hiệu', err));
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    axios.get(`http://localhost:5000/api/shop/product/filters?categoryId=${selectedCategory}`)
      .then(res => setFilterFields(res.data.data))
      .catch(err => console.error('Lỗi khi tải thông số lọc', err));
  }, [selectedCategory]);

  const staticPriceRanges = [
    { id: "0-500000", label: "Dưới 500.000đ" },
    { id: "500000-1000000", label: "500.000đ - 1.000.000đ" },
    { id: "1000000-2000000", label: "1.000.000đ - 2.000.000đ" },
    { id: "2000000-999999999", label: "Trên 2.000.000đ" },
  ];

  const handleCheckboxChange = (sectionId, value) => {
    handleFilter(sectionId, value);
  };

  return (
    <aside className="w-full md:w-60 p-4 bg-white rounded-md shadow space-y-4">
      <div>
        <h4 className="font-bold mb-2">Danh mục</h4>
        <select
          className="w-full border rounded px-2 py-1"
          value={selectedCategory}
          onChange={(e) => handleFilter("categoryId", e.target.value)}
        >
          <option value=''>-- Chọn danh mục --</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name || c.categoryName}</option>
          ))}
        </select>
      </div>

      <div>
        <h4 className="font-bold mb-2">Thương hiệu</h4>
        {brands.map(b => (
          <label key={b.id} className="block text-sm mb-1">
            <input
              type="checkbox"
              checked={filters?.brand?.includes(b.id) || false}
              onChange={() => handleCheckboxChange('brand', b.id)}
              className="mr-2"
            />
            {b.label}
          </label>
        ))}
      </div>

      <div>
        <h4 className="font-bold mb-2">Mức giá</h4>
        {staticPriceRanges.map(r => (
          <label key={r.id} className="block text-sm mb-1">
            <input
              type="checkbox"
              checked={filters?.priceRange?.includes(r.id) || false}
              onChange={() => handleCheckboxChange('priceRange', r.id)}
              className="mr-2"
            />
            {r.label}
          </label>
        ))}
      </div>

      {filterFields.map(spec => (
  <div key={spec._id}>
    <h4 className="font-bold mb-2">{spec.specName}</h4>

    {spec.specType === "number" && specRangePresets[spec._id]
      ? specRangePresets[spec._id].map((range) => (
          <label key={range.id} className="block text-sm mb-1">
            <input
              type="checkbox"
              checked={filters?.[spec._id]?.includes(range.id) || false}
              onChange={() => handleCheckboxChange(spec._id, range.id)}
              className="mr-2"
            />
            {range.label}
          </label>
        ))
      : (spec.values || []).map((val, idx) => (
          <label key={idx} className="block text-sm mb-1">
            <input
              type="checkbox"
              checked={filters?.[spec._id]?.includes(val) || false}
              onChange={() => handleCheckboxChange(spec._id, val)}
              className="mr-2"
            />
            {val}
            {spec.specUnit ? ` ${spec.specUnit}` : ""}
          </label>
        ))}
  </div>
))}

    </aside>
  );
};

export default ProductFilter;
