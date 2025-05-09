import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice';
import adminSpecificationReducer from './admin/spec-slice';
import adminProductsReducer from './admin/product-slice';
import shopAdressSlice from './shop/address-slice'
import shopProductSlice from './shop/product-slice'
import adminCategoryReducer from './admin/cate-slice'
import adminOrderSlice from "./admin/order-slice";
import shopCartSlice from './shop/cart-slice';
import commonFeatureSlice from "./common-slice";
import shopSearchSlice from "./shop/search-slice";
import shopOrderSlice from "./shop/order-slice"
import shopReviewSlice from "./shop/review-slice";




const store = configureStore({
    reducer:{
        auth:authReducer,
        adminSpecifications:adminSpecificationReducer,
        adminCategory:adminCategoryReducer,
        adminOrder: adminOrderSlice,
        adminProduct:adminProductsReducer,
        shopProduct:shopProductSlice,
        shopAdress: shopAdressSlice,
        shopCart: shopCartSlice,
        shopOrder:shopOrderSlice,
        shopSearch: shopSearchSlice,
        commonFeature: commonFeatureSlice,
        shopReview: shopReviewSlice,

    },
});

export default store; 