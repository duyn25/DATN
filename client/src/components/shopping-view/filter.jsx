import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b pb-2 mb-2">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between cursor-pointer font-semibold mb-1"
      >
        <span>{title}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      {open && <div className="space-y-1">{children}</div>}
    </div>
  );
};

const ProductFilter = ({ filters, handleFilter }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filterFields, setFilterFields] = useState([]);

  const selectedCategory = filters?.categoryId || "";

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/category/get")
      .then(res => setCategories(res.data.data))
      .catch(err => console.error("Lỗi khi tải danh mục", err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/shop/product/get")
      .then(res => {
        const brands = res.data.data
          .map(p => p.brand)
          .filter(Boolean);
        const unique = [...new Set(brands)].map(b => ({ id: b, label: b }));
        setBrands(unique);
      })
      .catch(err => console.error("Lỗi khi tải thương hiệu", err));
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    axios.get(`http://localhost:5000/api/shop/product/filters?categoryId=${selectedCategory}`)
      .then(res => setFilterFields(res.data.data))
      .catch(err => console.error("Lỗi khi tải thông số lọc", err));
  }, [selectedCategory]);

  const staticPriceRanges = [
    { id: "0-500000", label: "Dưới 500.000đ" },
    { id: "500000-1000000", label: "500.000đ - 1.000.000đ" },
    { id: "1000000-2000000", label: "1.000.000đ - 2.000.000đ" },
    { id: "2000000-999999999", label: "Trên 2.000.000đ" },
  ];

  const handleCheckboxChange = (key, value) => {
    handleFilter(key, value);
  };

  return (
    <aside className="w-full md:w-60 p-4 bg-white rounded-md shadow space-y-4 text-sm">
      {/* Danh mục */}
      <div>
        <h4 className="font-bold mb-2">Danh mục</h4>
        <select
          className="w-full border rounded px-2 py-1"
          value={selectedCategory}
          onChange={(e) => handleFilter("categoryId", e.target.value)}
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name || c.categoryName}</option>
          ))}
        </select>
      </div>

      {/* Thương hiệu */}
      <FilterSection title="Hãng sản xuất">
        {brands.map(b => (
          <label key={b.id} className="block mb-1">
            <input
              type="checkbox"
              checked={(filters?.brand || []).includes(b.id)}
              onChange={() => handleCheckboxChange("brand", b.id)}
              className="mr-2"
            />
            {b.label}
          </label>
        ))}
      </FilterSection>

      {/* Mức giá */}
      <FilterSection title="Mức giá">
        {staticPriceRanges.map(r => (
          <label key={r.id} className="block mb-1">
            <input
              type="checkbox"
              checked={(filters?.priceRange || []).includes(r.id)}
              onChange={() => handleCheckboxChange("priceRange", r.id)}
              className="mr-2"
            />
            {r.label}
          </label>
        ))}
      </FilterSection>

      {/* Thông số kỹ thuật */}
      {selectedCategory && filterFields.length > 0 && filterFields.map(spec => (
  <FilterSection key={spec._id} title={spec.specName}>
    {(spec.specType === "number" && spec.rangePresets?.length > 0)
      ? spec.rangePresets.map(range => (
        <label key={range.id} className="block mb-1">
          <input
            type="checkbox"
            checked={(filters?.[spec._id] || []).includes(range.id)}
            onChange={() => handleCheckboxChange(spec._id, range.id)}
            className="mr-2"
          />
          {range.label} {spec.specUnit || ""}
        </label>
      ))
      : (spec.values || []).map((val, idx) => (
        <label key={idx} className="block mb-1">
          <input
            type="checkbox"
            checked={(filters?.[spec._id] || []).includes(val)}
            onChange={() => handleCheckboxChange(spec._id, val)}
            className="mr-2"
          />
          {val} {spec.specUnit || ""}
        </label>
      ))}
  </FilterSection>
))}

    </aside>
  );
};

export default ProductFilter;
