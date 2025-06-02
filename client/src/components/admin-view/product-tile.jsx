import { Button } from "../ui/button";

function AdminProductTile({
  product,
  handleEditProduct,
  handleDelete,
}) {
  return (
    <tr className="border-b hover:bg-gray-50 transition-colors text-sm">
      <td className="p-2">
        <img
          src={product?.image}
          alt={product?.productName}
          className="w-16 h-16 object-cover rounded"
        />
      </td>
      <td className="p-2 font-medium">{product?.productName}</td>
      <td className="p-2 text-primary">
        {product?.price.toLocaleString()} đ
      </td>
      <td className="p-2 font-bold text-red-600">
        {product?.salePrice > 0 ? `${product.salePrice.toLocaleString()} đ` : "-"}
      </td>
      <td className="p-2 space-x-2">
        <Button size="sm" onClick={() => handleEditProduct(product)}>
          Sửa
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDelete(product?._id)}
        >
          Xoá
        </Button>
      </td>
    </tr>
  );
}

export default AdminProductTile;
