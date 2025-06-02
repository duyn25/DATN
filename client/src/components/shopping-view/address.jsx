import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAdress);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user.id));
    }
  }, [dispatch, user]);

  const isFormValid = () =>
    Object.values(formData).every((val) => val.trim() !== "");

  const handleManageAddress = (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast({ title: "Vui lòng điền đầy đủ thông tin", variant: "destructive" });
      return;
    }

    if (addressList.length >= 3 && currentEditedId === null) {
      toast({ title: "Bạn chỉ được thêm tối đa 3 địa chỉ", variant: "destructive" });
      setFormData(initialAddressFormData);
      return;
    }

    if (currentEditedId !== null) {
      dispatch(
        editaAddress({
          userId: user.id,
          addressId: currentEditedId,
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          toast({ title: "Cập nhật địa chỉ thành công" });
          resetForm();
        }
      });
    } else {
      dispatch(
        addNewAddress({
          ...formData,
          userId: user.id,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          toast({ title: "Thêm địa chỉ thành công" });
          resetForm();
        }
      });
    }
  };

  const resetForm = () => {
    setFormData(initialAddressFormData);
    setCurrentEditedId(null);
    dispatch(fetchAllAddresses(user.id));
  };

  const handleDeleteAddress = (addressItem) => {
    setFormData(initialAddressFormData);
    dispatch(
      deleteAddress({ userId: user.id, addressId: addressItem._id })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Xoá địa chỉ thành công" });
        dispatch(fetchAllAddresses(user.id));
      }
    });
  };

  const handleEditAddress = (addressItem) => {
    setCurrentEditedId(addressItem._id);
    setFormData({
      address: addressItem.address || "",
      city: addressItem.city || "",
      phone: addressItem.phone || "",
      notes: addressItem.notes || "",
    });
  };

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList?.length > 0 &&
          addressList.map((item) => (
            <AddressCard
              key={item._id}
              selectedId={selectedId}
              addressInfo={item}
              handleDeleteAddress={handleDeleteAddress}
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          ))}
      </div>

      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Sửa" : "Thêm mới"}
          onSubmit={handleManageAddress}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
