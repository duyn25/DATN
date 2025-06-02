import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XIcon } from "lucide-react";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  const handleUploadFeatureImage = () => {
    if (!uploadedImageUrl) return;

    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  };

  const handleDeleteFeatureImage = (id) => {
    dispatch(deleteFeatureImage(id)).then((res) => {
      if (res?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Thêm ảnh nổi bật</h2>

      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />

      <Button
        onClick={handleUploadFeatureImage}
        className="mt-5 w-full"
        disabled={!uploadedImageUrl || imageLoadingState}
      >
        {imageLoadingState ? "Đang tải..." : "Upload"}
      </Button>

      {featureImageList?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Danh sách ảnh nổi bật</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featureImageList.map((item) => (
              <div
                key={item._id}
                className="relative rounded overflow-hidden border group"
              >
                <img
                  src={item.image}
                  alt="Ảnh nổi bật"
                  className="w-full h-[300px] object-cover"
                />
                <button
                  onClick={() => handleDeleteFeatureImage(item._id)}
                  className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-600 hover:bg-white shadow transition-opacity opacity-0 group-hover:opacity-100"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
