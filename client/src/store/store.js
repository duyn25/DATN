import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice';
import adminSpecificationReducer from './admin/spec-slice';
import adminProductsReducer from './admin/product-slice';
import shopAdressSlice from './shop/address-slice'
import shopProductSlice from './shop/product-slice'
import adminCategoryReducer from './admin/cate-slice'
import commonFeatureSlice from "./common-slice";



const store = configureStore({
    reducer:{
        auth:authReducer,
        adminSpecifications:adminSpecificationReducer,
        adminCategory:adminCategoryReducer,
        adminProduct:adminProductsReducer,
        shopProduct:shopProductSlice,
        shopAdress: shopAdressSlice,
        commonFeature: commonFeatureSlice,

    },
});

export default store; 