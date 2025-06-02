import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeatureImages } from "@/store/common-slice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [topSelling, setTopSelling] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [hotSales, setHotSales] = useState([]);

  const { featureImageList } = useSelector((state) => state.commonFeature);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/shop/product/home-products`).then((res) => {
      setTopSelling(res.data.data.topSelling || []);
      setNewProducts(res.data.data.newProducts || []);
      setHotSales(res.data.data.hotSales || []);
    });
  }, []);

  useEffect(() => {
    if (!featureImageList?.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  function handleGetProductDetails(id) {
    navigate(`/shop/product/${id}`);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner */}
      <div className="container mx-auto px-4 mt-2">
        <div className="relative w-full h-[350px] overflow-hidden rounded-2xl">
          {featureImageList && featureImageList.length > 0
            ? featureImageList.map((slide, index) => (
                <img
                  src={slide?.image}
                  key={index}
                  className={`${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
                  alt={`banner-${index}`}
                />
              ))
            : null}
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentSlide(
                (prevSlide) =>
                  (prevSlide - 1 + featureImageList.length) % featureImageList.length
              )
            }
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)
            }
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>


      {/* Top bán chạy */}
      <SectionProduct
        title="Sản phẩm bán chạy"
        products={topSelling}
        handleGetProductDetails={handleGetProductDetails}
      />

      {/* Sản phẩm mới */}
      <SectionProduct
        title="Sản phẩm mới"
        products={newProducts}
        handleGetProductDetails={handleGetProductDetails}
      />

      {/* Sale */}
      <SectionProduct
        title="Giảm giá sốc"
        products={hotSales}
        handleGetProductDetails={handleGetProductDetails}
      />
    </div>
  );
}

function SectionProduct({ title, products, handleGetProductDetails }) {
  if (!products || products.length === 0) return null;
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-5">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ShoppingProductTile
              key={product._id}
              product={product}
              handleGetProductDetails={handleGetProductDetails}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShoppingHome;
