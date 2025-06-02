
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
import Swal from "sweetalert2";
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
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const [searchKeyword, setSearchKeyword] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { categoryList } = useSelector((state) => state.adminCategory);
  const { productList } = useSelector((state) => state.adminProduct);

  const [selectedCategorySpecs, setSelectedCategorySpecs] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllProducts());
    if (categoryList.length === 0) {
      dispatch(fetchAllCategories());
    }
  }, [dispatch]);

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

  const handleEditProduct = (product) => {
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
          toast({
        title: "Sửa sản phẩm thành công",
      });
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

  const handleDelete = async (productId) => {
  const result = await Swal.fire({
    title: "Xác nhận xoá?",
    text: "Bạn có chắc chắn muốn xoá sản phẩm này?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
  });

  if (!result.isConfirmed) return;

  const data = dispatch(deleteProduct(productId));

  if (data?.payload?.success) {
    toast({
      title: "Xoá sản phẩm thành công",
    });
    dispatch(fetchAllProducts());
  } else {
    toast({
      title: "Không thể xoá sản phẩm",
      description: data?.payload?.message || "Đã xảy ra lỗi khi xoá.",
      variant: "destructive",
    });
  }
};

  const resetForm = () => {
    setOpenCreateProductsDialog(false);
    setCurrentEditedId(null);
    setFormData(initialFormData);
    setImageFile(null);
    setUploadedImageUrl("");
    setSelectedCategorySpecs([]);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const filteredProducts = productList?.filter((product) => {
    const matchKeyword = product.productName
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());

    const matchCategory = selectedCategory
      ? product.categoryId === selectedCategory
      : true;

    return matchKeyword && matchCategory;
  });

  return (
    <Fragment>
      <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Tìm theo tên sản phẩm..."
          className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Tất cả danh mục</option>
          {categoryList.map((cate) => (
            <option key={cate._id} value={cate._id}>
              {cate.categoryName}
            </option>
          ))}
        </select>

        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Thêm sản phẩm
        </Button>
      </div>
            <p className="text-sm text-gray-600 mb-2">
            Tìm thấy <span className="font-semibold">{filteredProducts.length}</span> sản phẩm
            </p>

      <div className="overflow-auto border rounded-lg">
        <Table >
          <TableHeader >
            <TableRow>
              <TableHead className="p-2">Ảnh</TableHead>
              <TableHead className="p-2">Tên sản phẩm</TableHead>
              <TableHead className="p-2">Giá</TableHead>
              <TableHead className="p-2">Giá khuyến mãi</TableHead>
              <TableHead className="p-2">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts
              ?.slice(0, visibleCount)
              .map((productItem) => (
                <AdminProductTile
                  key={productItem._id}
                  product={productItem}
                  handleEditProduct={handleEditProduct}
                  handleDelete={handleDelete}
                />
              ))}
          </TableBody>
        </Table>
      </div>

      {visibleCount < filteredProducts?.length && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={handleLoadMore}>
            Xem thêm
          </Button>
        </div>
      )}

      <Sheet open={openCreateProductsDialog} onOpenChange={resetForm}>
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
