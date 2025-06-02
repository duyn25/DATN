import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  
  return (

      <Card className="h-full flex flex-col justify-between">
      <div onClick={() => handleGetProductDetails(product?._id)}> 
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.productName}
            className="w-60 h-60 object-cover rounded-t-lg"
          />

          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-gray-500 hover:bg-gray-600">
              Hết hàng
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Chỉ còn ${product?.totalStock} sản phẩm`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                Giảm giá
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">          
          <div className="flex flex-col mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through !text-muted-foreground" : ""
              } text-lg font-semibold text-primary`}
            >
              {product?.price.toLocaleString()} đ
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold">
                {product?.salePrice.toLocaleString()} đ
              </span>
            ) : null}
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px]">
              {product?.productName}
            </span>
          </div>
        </CardContent>
      </div>
    </Card>

    
  );
}

export default ShoppingProductTile;