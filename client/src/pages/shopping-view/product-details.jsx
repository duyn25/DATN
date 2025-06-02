import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "@/store/shop/product-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { addReview, getReviews } from "@/store/shop/review-slice";
import StarRatingComponent from "@/components/common/star-rating";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShoppingCart, StarIcon } from "lucide-react";

function ProductDetailPage() {
  const { productId } = useParams();
  const [reviewMsg, setReviewMsg] = useState("");
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const { productDetails } = useSelector((state) => state.shopProduct);
  const { reviews } = useSelector((state) => state.shopReview);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Thêm đánh giá thành công",
        });
      }
    });
  }

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

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
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white gap-10 p-4">
        <div className="flex justify-center w-full h-[400px] rounded-lg border">
          <img src={image} alt={productName} className="items-center" />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{productName}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarIcon className="fill-yellow-400" />
            </div>
            <span className="text-muted-foreground">
              {averageReview.toFixed(2)} {productDetails?.totalReviews} đánh giá
            </span>
          </div>
          <div className="flex flex-col gap-4 mb-4 mt-7">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold text-red-500">
                  {salePrice.toLocaleString()} đ
                </span>
                <span className="font-semibold text-muted-foreground line-through">
                  {price.toLocaleString()} đ{' '}
                  <Badge className="bg-red-100 text-red-600">
                    -{discountPercent}%
                  </Badge>
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-primary">
                {price.toLocaleString()} đ
              </span>
            )}
          </div>

          {hasDiscount && (
            <div className="mb-4">
              <ul className="list-disc ml-6 mt-2 text-sm text-muted-foreground">
                <li>Giảm ngay {price - salePrice} đ</li>
              </ul>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleAddToCart}
              disabled={totalStock === 0}
              className="w-full text-base h-[45px] bg-red-500 hover:bg-red-600"
            >
              <ShoppingCart /> Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      </div>

      {(productDetails.specifications?.length > 0 || description) && (
        <div className="mt-10 bg-white px-4 py-4 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {productDetails.specifications?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Thông số kỹ thuật</h3>
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
            <div>
              <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
              <p className="text-muted-foreground">
                {description ? description : "Không có mô tả."}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-h-[500px] overflow-auto mt-[20px] bg-white px-4 py-4 rounded-2xl">
        <h2 className="text-xl font-bold mb-4">Đánh giá</h2>
        <div className="grid gap-6">
          {reviews && reviews.length > 0 ? (
            reviews.map((reviewItem) => (
              <div className="flex gap-4">
                <Avatar className="w-10 h-10 border">
                  <AvatarFallback>
                    {reviewItem?.userName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{reviewItem?.userName}</h3>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <StarRatingComponent rating={reviewItem?.reviewValue} />
                  </div>
                  <p className="text-muted-foreground">
                    {reviewItem.reviewMessage}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h1>Chưa có đánh giá</h1>
          )}
        </div>
        <div className="mt-10 flex-col flex gap-2">
          <Label>Đánh giá</Label>
          <div className="flex gap-1">
            <StarRatingComponent
              rating={rating}
              handleRatingChange={handleRatingChange}
            />
          </div>
          <Input
            name="reviewMsg"
            value={reviewMsg}
            onChange={(event) => setReviewMsg(event.target.value)}
            placeholder="Viết đánh giá..."
          />
          <Button onClick={handleAddReview} disabled={reviewMsg.trim() === ""}>
            Gửi
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
