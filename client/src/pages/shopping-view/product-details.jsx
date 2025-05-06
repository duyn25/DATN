import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "@/store/shop/product-slice";
//import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

function ProductDetailPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { productDetails } = useSelector((state) => state.shopProduct);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
  }, [dispatch, productId]);

  const handleAddToCart = () => {
    if (!user) {
      toast({ title: "Vui lòng đăng nhập để thêm vào giỏ hàng." });
      return;
    }

    dispatch(
      addToCart({
        userId: user.id,
        productId: productDetails._id,
        quantity: 1,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast({ title: "Đã thêm sản phẩm vào giỏ hàng." });
      }
    });
  };

  if (!productDetails) {
    return <div className="p-10 text-center">Đang tải sản phẩm...</div>;
  }
console.log("productdetail",productDetails)
  const {
    image,
    productName,
    description,
    price,
    salePrice,
    totalStock,
    specifications,
  } = productDetails;

  const hasDiscount = salePrice > 0 && salePrice < price;
  const discountPercent = hasDiscount
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <img
            src={image}
            alt={productName}
            className="w-full h-[400px] rounded-lg border"
          />
          {/* thumbnails hoặc ảnh phụ có thể đặt thêm ở đây */}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{productName}</h1>
          <div>review</div>
          <div className="flex items-center gap-4 mb-4">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-semibold text-muted-foreground line-through">
                  {price.toLocaleString()} đ
                </span>
                <span className="text-3xl font-bold text-red-500">
                  {salePrice.toLocaleString()} đ
                </span>
                <Badge className="bg-red-100 text-red-600">
                  -{discountPercent}%
                </Badge>
              </>
            ) : (
              <span className="text-3xl font-bold text-primary">
                {price.toLocaleString()} đ
              </span>
            )}
          </div>

          {hasDiscount && (
            <div className="mb-4">
              <Badge variant="destructive">Khuyến mãi được hưởng</Badge>
              <ul className="list-disc ml-6 mt-2 text-sm text-muted-foreground">
                <li>Giảm ngay {price - salePrice} đ</li>
              </ul>
            </div>
          )}

          <p className="text-base text-muted-foreground mb-6">
            {description}
          </p>

          <Button
            onClick={handleAddToCart}
            disabled={totalStock === 0}
            className="w-full text-base"
          >
            {totalStock === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
          </Button>
        </div>
        {productDetails.specifications?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Thông số kỹ thuật</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left border-collapse">
              <tbody>
                {productDetails.specifications.map((spec, index) => (
                  <tr key={index} className="even:bg-muted/40 border-b">
                    <td className="px-4 py-3 font-medium text-muted-foreground w-1/3">
                      {spec.name}
                    </td>
                    <td className="px-4 py-3">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
)}
      </div>
    </div>
  );
}

export default ProductDetailPage;
