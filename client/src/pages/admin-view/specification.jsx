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
  specDescription: "",
  specUnit: "",
  allowedValues: "", 
};

function AdminSpecifications() {
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState(initialSpec);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { specificationList } = useSelector((state) => state.adminSpecifications);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    let processedForm = { ...formData };

    if (formData.specType === "select") {
      if (typeof formData.allowedValues === "string") {
        processedForm.allowedValues = formData.allowedValues
          .split(/[\n,]/) 
          .map((v) => v.trim())
          .filter(Boolean);
      }
    } else {
      delete processedForm.allowedValues;
    }

    const action = currentEditedId !== null
      ? editSpec({ id: currentEditedId, formData: processedForm })
      : addNewSpec(processedForm);

    dispatch(action).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllSpecs());
        setOpenForm(false);
        setFormData(initialSpec);
        setCurrentEditedId(null);
        toast({
          title: currentEditedId ? "Đã cập nhật thông số" : "Thêm thông số thành công",
        });
      }
    });
  }

  function handleDelete(getCurrentSpecId) {
  const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá thông số này?");
  if (!confirmDelete) return;

  dispatch(deleteSpec(getCurrentSpecId)).then((res) => {
    if (res?.payload?.success) {
      toast({
        title: "Xoá thông số thành công",
      });
      dispatch(fetchAllSpecs());
    } else {
      toast({
        title: "Không thể xoá",
        description: res?.payload?.message || "Thông số đang được sử dụng.",
        variant: "destructive",
      });
    }
  });
}


  function handleEdit(spec) {
        console.log("allowedValues raw:", spec.allowedValues);

    setCurrentEditedId(spec._id);
    setOpenForm(true);
    setFormData({
      specName: spec.specName || "",
      specType: spec.specType || "",
      specDescription: spec.specDescription || "",
      specUnit: spec.specUnit || "",
      allowedValues: Array.isArray(spec.allowedValues)
        ? spec.allowedValues.join("\n")
        : (spec.allowedValues || ""),
    });
  }

  useEffect(() => {
    dispatch(fetchAllSpecs());
  }, [dispatch]);

  return (
    <Fragment>
      <h1 className="text-2xl font-bold">Thông số sản phẩm</h1>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenForm(true)}>Thêm thông số sản phẩm</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Mô tả</TableHead>
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
              handleEdit={handleEdit}
            />
          ))}
        </TableBody>
      </Table>

      <Sheet
        open={openForm}
        onOpenChange={() => {
          setOpenForm(false);
          setFormData(initialSpec);
          setCurrentEditedId(null);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId ? "Sửa thông số" : "Thêm thông số"}
            </SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId ? "Sửa" : "Thêm"}
              formControls={addSpecFormElements}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminSpecifications;
