import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/store/shop/product-slice";

export default function MenuItems() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categoryList } = useSelector((state) => state.shopProduct);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/shop/product?categoryId=${categoryId}`);
  };

  return (
    <div className="w-[250px] bg-white rounded-md shadow-lg border border-gray-200">
      <ul className="divide-y divide-gray-200">
        {categoryList.map((cat) => (
          <li
            key={cat._id}
            onClick={() => handleCategoryClick(cat._id)}
            className="px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-primary transition-all"
          >
            {cat.categoryName}
          </li>
        ))}
      </ul>
    </div>
  );
}
