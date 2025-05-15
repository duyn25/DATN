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
    <div className="flex w-[250px] border rounded-xl shadow-xl bg-gray-100">
      <ul className="w-full">
        {categoryList.map((cat) => (
          <li
            key={cat._id}
            onClick={() => handleCategoryClick(cat._id)}
            className="p-4 text-sm cursor-pointer hover:text-blue-400 hover:bg-white"
          >
            {cat.categoryName}
          </li>
        ))}
      </ul>
    </div>
  );
}
