import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, editaAddress, fetchAllAddresses } from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";

const initialAddressFormData ={
    address:'',
    city:'',
    phone:'',
    notes: '',
}

function Address({setCurrentSelectedAddress, selectedId}) {

    const[formData, setFormData] = useState(initialAddressFormData)
    const dispatch = useDispatch();
    const [curretnEditedId, setCurrentEditedId] = useState(null);
    const {user} = useSelector(state=>state.auth);
    const {addressList} = useSelector(state=>state.shopAdress);
    const {toast} = useToast();
    function handleManageAddress(event){
        event.preventDefault();

        if(addressList.length >= 3 && curretnEditedId === null){
            setFormData(initialAddressFormData);
            toast({
                title: "Bạn chỉ được thêm tối đa 3 địa chỉ",
                variant:'destructive',
            });
            return;
        }
        
        curretnEditedId !==null ? dispatch(editaAddress({
            userId: user?.id, addressId: curretnEditedId, formData
        })).then(data=>{
            if(data?.payload?.success){
                dispatch(fetchAllAddresses(user?.id))
                setCurrentEditedId(null)
                setFormData(initialAddressFormData)
                toast({
                    title: "Cập nhật địa chỉ thành công",
                })
                    
                
            }
        }):

        dispatch(addNewAddress({
            ...formData,
            userId : user?.id
        })).then(data=>{
            if(data?.payload?.success){
                dispatch(fetchAllAddresses(user?.id))
                setFormData(initialAddressFormData);
                toast({
                    title: "Thêm địa chỉ thành công",
                })
            }
        })
    }

    function handleDeleteAddress(getCurrentAddress){
        setFormData(initialAddressFormData)
        dispatch(deleteAddress({userId:user?.id, addressId:getCurrentAddress._id})).then(data =>{
            if(data?.payload?.success){
                dispatch(fetchAllAddresses(user?.id))
                toast({
                    title: "Xoá địa chỉ thành công",
                })
            }
        })
    }

    function handleEditAddress(getCurrentAddress){
        setCurrentEditedId(getCurrentAddress?._id)
        setFormData({
            ...formData,
            address:getCurrentAddress?.address,
            city: getCurrentAddress?.city,
            phone:getCurrentAddress?.phone,
            notes: getCurrentAddress?.notes,
        })
    }
    function isFormValid(){
        return Object.keys(formData).map((key) => formData[key].trim() !=="").every((item)=>item);
    }
    useEffect(() => {
        dispatch(fetchAllAddresses(user?.id));
      }, [dispatch]);

    console.log(addressList, "addressList");
    return ( 
        <Card>
            <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {
                addressList && addressList.length > 0
                ? addressList.map((singleAddressItem) => (
                    <AddressCard     
                        selectedId={selectedId}
                        addressInfo={singleAddressItem}   
                        handleDeleteAddress={handleDeleteAddress}    
                        handleEditAddress = {handleEditAddress}
                        setCurrentSelectedAddress={setCurrentSelectedAddress}
                    />
                    ))
                : null}
            </div>
            <CardHeader>
                <CardTitle>
                    {
                        curretnEditedId !==null ?'Sửa địa chỉ' : 'Thêm địa chỉ mới'
                    }
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <CommonForm
                formControls={addressFormControls}
                formData={formData}
                setFormData={setFormData}
                buttonText={curretnEditedId !==null ?'Sửa' : 'Thêm mới'
                }
                onSubmit={handleManageAddress}
                />
            </CardContent>
        </Card>

    );
}

export default Address;