import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "@/store/shop/product-slice";
import { useDispatch, useSelector } from "react-redux";

export default function MenuItems() {
  const navigate = useNavigate();
  const { categoryList } = useSelector((state) => state.shopProduct);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  console.log("catelist: ",categoryList)
  const handleCategoryClick = (categoryId) => {
    navigate(`/shop/product?category=${categoryId}`);
  };

  return (
    <div className="flex w-[250px] border shadow-xl bg-gray-100">
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
