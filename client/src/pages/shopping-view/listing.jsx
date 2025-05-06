import ProductFilter from "@/components/shopping-view/filter";
import { DropdownMenu,  DropdownMenuTrigger} from "../../components/ui/dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/product-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useSearchParams } from "react-router-dom";
//import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";


function createSearchParamsHelper(filterParams) {
    const queryParams = [];
  
    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");
  
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }
  
    console.log(queryParams, "queryParams");
  
    return queryParams.join("&");
  }

function ShoppingListing() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {productList} = useSelector(state=>state.shopProduct);
    //const { cartItems } = useSelector((state) => state.shopCart);
    const {user} = useSelector(state=>state.auth);
    const [filters, setFilters] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const[sort, setSort]= useState(null);
    const categorySearchParam = searchParams.get("category");
    const {toast} = useToast();

    function handleSort(value){
        setSort(value);
    }

    function handleFilter(getSectionId, getCurrentOption) {
        let cpyFilters = { ...filters };
        const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);
    
        if (indexOfCurrentSection === -1) {
          cpyFilters = {
            ...cpyFilters,
            [getSectionId]: [getCurrentOption],
          };
        } else {
          const indexOfCurrentOption =
            cpyFilters[getSectionId].indexOf(getCurrentOption);
    
          if (indexOfCurrentOption === -1)
            cpyFilters[getSectionId].push(getCurrentOption);
          else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
        }
    
        setFilters(cpyFilters);
        sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
      }

      function handleGetProductDetails(getCurrentProductId) {
        navigate(`/shop/product/${getCurrentProductId}`);
    }
    
    function handleAddtoCart(getCurrentProductId, getTotalStock) {
      console.log(cartItems);
      let getCartItems = cartItems.items || [];
  
      if (getCartItems.length) {
        const indexOfCurrentItem = getCartItems.findIndex(
          (item) => item.productId === getCurrentProductId
        );
        if (indexOfCurrentItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Chỉ thêm được ${getQuantity} sản phẩm này`,
              variant: "destructive",
            });
  
            return;
          }
        }
      }
  
      dispatch(
        addToCart({
          userId: user?.id,
          productId: getCurrentProductId,
          quantity: 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast({
            title: "Sản phẩm đã được thêm vào giỏ hàng",
          });
        }
      });
    }
    

    useEffect(()=>{
    dispatch(fetchAllFilteredProducts())
    },[dispatch])
    useEffect(() => {
        setSort("price-lowtohigh");
        setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
      }, [categorySearchParam]);
    
      useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {
          const createQueryString = createSearchParamsHelper(filters);
          setSearchParams(new URLSearchParams(createQueryString));
        }
      }, [filters]);
    
      useEffect(() => {
        if (filters !== null && sort !== null)
          dispatch(
            fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
          );
      }, [dispatch, sort, filters]);
    

    return ( 
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
        <ProductFilter filters={filters} handleFilter={handleFilter}/>
        <div className="bg-background w-full rounded-lg shadow-sm">
            <div className="p-4 border-b flex  items-center justify-between">
                <h2 className="text-lg font-extrabold ">
                    Tất cả sản phẩm
                </h2>
                <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{productList?.length} sản phẩm</span>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <ArrowUpDownIcon className="w-4 h-4"/>
                            <span>Sắp xếp</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[300px]">
                        <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                            {
                                sortOptions.map((sortItem) => (
                                <DropdownMenuRadioItem 
                                value={sortItem.id}
                                key={sortItem.id}>
                                    {sortItem.label}
                                </DropdownMenuRadioItem>
                                ))
                            }
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
    </div>
    );
}

export default ShoppingListing;