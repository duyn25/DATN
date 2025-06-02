import { useDispatch, useSelector } from "react-redux";
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
import {
  fetchAllCategories,
  addNewCategory,
  deleteCategory,
  editCategory,
} from "@/store/admin/cate-slice";
import { fetchAllSpecs } from "@/store/admin/spec-slice";
import { Fragment, useEffect, useState } from "react";
const initialCategory = {
  categoryName: "",
  specifications: [],
};

function AdminCategories() {
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState(initialCategory);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { categoryList } = useSelector((state) => state.adminCategory);
  const { specificationList } = useSelector((state) => state.adminSpecifications);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    currentEditedId !== null
      ? dispatch(
          editCategory({ id: currentEditedId, formData })
        ).then((res) => {
          if (res?.payload?.success) {
            dispatch(fetchAllCategories());
            resetForm();
          }
        })
      : dispatch(addNewCategory(formData)).then((res) => {
          if (res?.payload?.success) {
            dispatch(fetchAllCategories());
            toast({ title: "Thêm danh mục thành công" });
            resetForm();
          }
        });
  }

  function resetForm() {
    setFormData(initialCategory);
    setOpenForm(false);
    setCurrentEditedId(null);
  }

  function handleDelete(id) {
  dispatch(deleteCategory(id)).then((res) => {
    if (res?.payload?.success) {
      toast({
        title: "Xoá danh mục thành công",
      });
      dispatch(fetchAllCategories());
    } else {
      toast({
        title: "Không thể xoá danh mục",
        description: res?.payload?.message || "Danh mục đang được sử dụng hoặc đã xảy ra lỗi.",
        variant: "destructive",
      });
    }
  });
}
  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchAllSpecs());
  }, [dispatch]);
 
  return (
    <Fragment>
          <h1 className="text-2xl font-bold">Danh mục sản phẩm</h1>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenForm(true)}>Thêm danh mục sản phẩm</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Thông số</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoryList.map((cat) => (
            <TableRow key={cat._id}>
              <TableCell>{cat.categoryName}</TableCell>
              <TableCell>
                {cat.specifications?.map((spec) => spec.specName).join(", ")}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setFormData({
                        categoryName: cat.categoryName,
                        specifications: cat.specifications.map((s) => s._id),
                      });
                      setCurrentEditedId(cat._id);
                      setOpenForm(true);
                    }}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(cat._id)}
                  >
                    Xoá
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Sheet
        open={openForm}
        onOpenChange={() => resetForm()}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Sửa danh mục" : "Thêm danh mục"}
            </SheetTitle>
          </SheetHeader>

          <div className="py-6 space-y-4">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Tên danh mục</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={formData.categoryName}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryName: e.target.value })
                  }
                />
              </div>
              <div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Chọn thông số kỹ thuật</label>
                <div className="space-y-2 max-h-130 overflow-y-auto border rounded-md p-2">
                    {specificationList.map((spec) => (
                    <div key={spec._id} className="flex items-center space-x-2">
                        <input
                        type="checkbox"
                        id={spec._id}
                        checked={formData.specifications.includes(spec._id)}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            setFormData((prev) => ({
                            ...prev,
                            specifications: checked
                                ? [...prev.specifications, spec._id]
                                : prev.specifications.filter((id) => id !== spec._id),
                            }));
                        }}
                        />
                        <label htmlFor={spec._id}>{spec.specName}</label>
                </div>
                ))}
            </div>
            </div>

              </div>
              <Button className="w-full" type="submit">
                {currentEditedId !== null ? "Sửa" : "Thêm"}
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminCategories;
