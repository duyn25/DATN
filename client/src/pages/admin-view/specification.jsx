import { useDispatch, useSelector } from "react-redux";
import CommonForm from "@/components/common/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addSpecFormElements } from "@/config";
import {
  fetchAllSpecs,
  addNewSpec,
  editSpec,
  deleteSpec,
} from "@/store/admin/spec-slice";
import { Fragment, useEffect, useState } from "react";
import AdminSpecTile from "@/components/admin-view/spec-tile";
const initialSpec = {
  specName: "",
  specType: "",
  specDescription:"",
  specUnit: "",
  
};

function AdminSpecifications() {
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState(initialSpec);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const {specificationList} = useSelector((state) => state.adminSpecifications);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    currentEditedId !== null
      ? dispatch(
          editSpec({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          console.log(data, "edit");

          if (data?.payload?.success) {
            dispatch(fetchAllSpecs());
            setFormData(initialSpec);
            setOpenForm(false);
            setCurrentEditedId(null);
          }
        })
      : dispatch(
          addNewSpec({
            ...formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllSpecs());
            setOpenForm(false);
            setFormData(initialSpec);
            toast({
              title: "Thêm thông số thành công",
            });
          }
        });
  }
  function handleDelete(getCurrentSpecId) {
    dispatch(deleteSpec(getCurrentSpecId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllSpecs());
      }
    });
  }
  

  useEffect(() => {
    dispatch(fetchAllSpecs());
  }, [dispatch]);

  console.log(formData, "specList");

  return (
    <Fragment>
    <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenForm(true)}>
        Thêm thông số sản phẩm
        </Button>
    </div>
    <Table>
  <TableHeader>
    <TableRow>
      <TableHead>Tên</TableHead>
      <TableHead>Mô tả</TableHead>
      <TableHead>Kiểu dữ liệu</TableHead>
      <TableHead>Đơn vị</TableHead>
      
    </TableRow>
  </TableHeader>
  <TableBody>
    {specificationList.map((specItem) => (
      <AdminSpecTile
        key={specItem._id}
        specification={specItem}
        setFormData={setFormData}
        setOpenForm={setOpenForm}
        setCurrentEditedId={setCurrentEditedId}
        handleDelete={handleDelete}
      />
    ))}
  </TableBody>
</Table>
    <Sheet
        open={openForm}
        onOpenChange={() => {
        setOpenForm(false);
        setCurrentEditedId(null);
        setFormData(initialSpec);
        }}
    >
        <SheetContent side="right" className="overflow-auto">
        <SheetHeader>
            <SheetTitle>
            {currentEditedId !== null ? "Sửa thông số" : "Thêm thông số"}
            </SheetTitle>
        </SheetHeader>
        
        <div className="py-6">
            <CommonForm
            onSubmit={onSubmit}
            formData={formData}
            setFormData={setFormData}
            buttonText={currentEditedId !== null ? "Sửa" : "Thêm"}
            formControls={addSpecFormElements}
            />
        </div>
        </SheetContent>
    </Sheet>
    </Fragment>
    );
}

export default AdminSpecifications;
