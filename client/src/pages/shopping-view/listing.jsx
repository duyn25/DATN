import ProductFilter from "@/components/shopping-view/filter";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/product-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useSearchParams, useNavigate } from "react-router-dom";
import { sortOptions } from "@/config";

export function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      queryParams.push(`${key}=${encodeURIComponent(value.join(","))}`);
    } else if (typeof value === "string" && value) {
      queryParams.push(`${key}=${encodeURIComponent(value)}`);
    }
  }

  return queryParams.join("&");
}

function ShoppingListing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.shopProduct);
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("price-lowtohigh");
  const categoryId = searchParams.get("categoryId");

  // Gán categoryId từ URL (nếu có) ngay khi load lần đầu
  useEffect(() => {
    if (categoryId) {
      setFilters((prev) => ({ ...prev, categoryId }));
    }
  }, [categoryId]);

  // Cập nhật URL mỗi khi filters thay đổi
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const queryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(queryString));
    }
  }, [filters]);

  // Gọi API khi filters hoặc sort thay đổi
  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
  }, [filters, sort, dispatch]);

  const handleSort = (value) => setSort(value);

  const handleFilter = (sectionId, option) => {
    setFilters((prev) => {
      const updated = { ...prev };

      if (sectionId === "categoryId") {
        updated[sectionId] = option; 
      } else {
        if (!updated[sectionId]) {
          updated[sectionId] = [option];
        } else {
          const index = updated[sectionId].indexOf(option);
          if (index > -1) {
            updated[sectionId].splice(index, 1);
          } else {
            updated[sectionId].push(option);
          }
        }
      }

      return { ...updated };
    });
  };

  const handleGetProductDetails = (productId) => {
    navigate(`/shop/product/${productId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">
            Tìm thấy {productList?.length} sản phẩm
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ArrowUpDownIcon className="w-4 h-4" />
                <span>Sắp xếp</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                {sortOptions.map((sortItem) => (
                  <DropdownMenuRadioItem key={sortItem.id} value={sortItem.id}>
                    {sortItem.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {productList?.map((product) => (
            <ShoppingProductTile
              key={product._id}
              product={product}
              handleGetProductDetails={handleGetProductDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShoppingListing;
