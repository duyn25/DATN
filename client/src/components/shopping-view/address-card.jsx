import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : undefined
      }
      className={`cursor-pointer transition-all rounded-xl border-2 shadow-sm 
      ${isSelected
        ? "border-red-600 bg-red-50"
        : "border-gray-200 hover:border-red-300 hover:shadow-md"
      }`}

    >
      <CardContent className="p-4 space-y-1 text-sm text-gray-800">
        <p>
          <span className="font-semibold">Địa chỉ:</span> {addressInfo?.address}
        </p>
        <p>
          <span className="font-semibold">Tỉnh/TP:</span> {addressInfo?.city}
        </p>
        <p>
          <span className="font-semibold">SĐT:</span> {addressInfo?.phone}
        </p>
        {addressInfo?.notes && (
          <p>
            <span className="font-semibold">Ghi chú:</span> {addressInfo?.notes}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2 px-4 pb-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
        >
          Sửa
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
        >
          Xoá
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
