import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/product-slice";
import { fetchAllCategories } from "@/store/admin/cate-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductForm from "@/components/admin-view/product-form";
import axios from "axios";

const initialFormData = {
  image: null,
  productName: "",
  description: "",
  categoryId: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
  specifications: {}, 
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const { categoryList } = useSelector((state) => state.adminCategory);
  const [selectedCategorySpecs, setSelectedCategorySpecs] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProduct);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Lấy danh mục và sản phẩm
  useEffect(() => {
    dispatch(fetchAllProducts());
    if (categoryList.length === 0) {
      dispatch(fetchAllCategories());
    }
  }, [dispatch]);

  // Lấy thông số kỹ thuật khi chọn/đổi danh mục
  useEffect(() => {
    if (formData.categoryId) {
      axios
        .get(`http://localhost:5000/api/shop/product/filters?categoryId=${formData.categoryId}`)
        .then(res => {
          setSelectedCategorySpecs(res.data.data); 
        })
        .catch(err => console.error("Lỗi khi tải thông số", err));
    } else {
      setSelectedCategorySpecs([]);
    }
  }, [formData.categoryId]);

  // Khi bấm "Sửa", cập nhật đầy đủ specs và image
  const handleEditProduct = (product) => {
    setOpenCreateProductsDialog(true);
    setCurrentEditedId(product?._id);

    // Đưa specifications về dạng object {specId: value}
    const specsObj = {};
    product.specifications?.forEach((spec) => {
      const id = spec.specId?._id || spec.specId || spec._id;
      specsObj[id] = spec.value;
    });

    setFormData({
      ...product,
      specifications: specsObj,
    });

    setUploadedImageUrl(product.image || "");
    setImageFile(null);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (parseFloat(formData.salePrice) >= parseFloat(formData.price)) {
      toast({
        title: "Giá sau giảm phải nhỏ hơn giá gốc",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      ...formData,
      image: uploadedImageUrl,
    };

    if (currentEditedId !== null) {
      dispatch(editProduct({ id: currentEditedId, formData: payload })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          resetForm();
        }
      });
    } else {
      dispatch(addNewProduct(payload)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          resetForm();
          toast({ title: "Thêm sản phẩm thành công" });
        }
      });
    }
  };

  const handleDelete = (productId) => {
    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  };

  const resetForm = () => {
    setOpenCreateProductsDialog(false);
    setCurrentEditedId(null);
    setFormData(initialFormData);
    setImageFile(null);
    setUploadedImageUrl("");
    setSelectedCategorySpecs([]);
  };

  return (
    <Fragment>
      <h1 className="text-2xl font-bold">Tất cả sản phẩm</h1>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Thêm sản phẩm
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {productList?.length > 0 &&
          productList.map((productItem) => (
            <AdminProductTile
              key={productItem._id}
              setFormData={setFormData}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setCurrentEditedId={setCurrentEditedId}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageFile={setImageFile}
              product={productItem}
              handleEdit={() => handleEditProduct(productItem)}
              handleDelete={handleDelete}
            />
          ))}
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={resetForm}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          <div className="py-6">
            <ProductForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Sửa" : "Thêm"}
              formControls={addProductFormElements(categoryList, selectedCategorySpecs)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
