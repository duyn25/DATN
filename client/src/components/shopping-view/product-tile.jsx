import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (

      <Card>
      <div onClick={() => handleGetProductDetails(product?._id)}> 
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.productName}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
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
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px]">
              {product?.productName}
            </span>
            <span className="text-[22px] text-muted-foreground">
              {/* {brandOptionsMap[product?.brand]} */}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through text-red-500" : ""
              } text-lg font-semibold text-primary`}
            >
              {product?.price.toLocaleString()} đ
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-red-500">
                {product?.salePrice.toLocaleString()} đ
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Hết hàng
          </Button>
        ) : (
          <Button
            onClick={() => handleGetProductDetails(product?._id)}
            className="w-full"
          >
            Thêm vào giỏ hàng
          </Button>
        )}
      </CardFooter>
    </Card>

    
  );
}

export default ShoppingProductTile;