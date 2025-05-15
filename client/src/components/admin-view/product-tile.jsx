import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const handleEdit = () => {
    setOpenCreateProductsDialog(true);
    setCurrentEditedId(product?._id);

    const specsObj = {};
    product.specifications?.forEach((spec) => {
      const id = spec.specId?._id || spec.specId || spec._id;
      specsObj[id] = spec.value;
    });

    setFormData({
      ...product,
      specifications: specsObj,
    });
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.productName}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              {product?.price.toLocaleString()} đ
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold">
                {product?.salePrice.toLocaleString()} đ
              </span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button onClick={handleEdit}>Sửa</Button>
          <Button onClick={() => handleDelete(product?._id)}>Xoá</Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
