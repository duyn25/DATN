import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice';
import adminSpecificationReducer from './admin/spec-slice';
import shopAdressSlice from './shop/address-slice'
import adminCategoryReducer from './admin/cate-slice'


const store = configureStore({
    reducer:{
        auth:authReducer,
        adminSpecifications:adminSpecificationReducer,
        adminCategory:adminCategoryReducer,
        shopAdress: shopAdressSlice,
    },
});

export default store; 