import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useNavigate, useSearchParams } from "react-router-dom";

function SearchProducts() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const navigate = useNavigate();

  useEffect(() => {
    if (keyword && keyword.trim() !== "") {
      dispatch(getSearchResults(keyword));
    } else {
      dispatch(resetSearchResults());
    }
  }, [keyword, dispatch]);

  function handleGetProductDetails(getCurrentProductId) {
    navigate(`/shop/product/${getCurrentProductId}`);
  }

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      {/* Thông báo số lượng kết quả */}
      {keyword && searchResults.length > 0 && (
        <h2 className="text-xl font-semibold mb-4 text-center">
          Tìm thấy <span className="text-red-500">{searchResults.length}</span> sản phẩm cho từ khoá: "<span className="text-blue-600">{keyword}</span>"
        </h2>
      )}

      {keyword && !searchResults.length ? (
        <h1 className="text-2xl font-bold text-center">Không tìm thấy sản phẩm nào!</h1>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item, idx) => (
          <ShoppingProductTile
            key={item.productId || idx}
            product={item}
            handleGetProductDetails={() => handleGetProductDetails(item.productId)}
          />
        ))}
      </div>
    </div>
  );
}

export default SearchProducts;
