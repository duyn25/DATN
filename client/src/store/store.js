import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice';
import adminSpecificationReducer from './admin/spec-slice';
import shopAdressSlice from './shop/address-slice'


const store = configureStore({
    reducer:{
        auth:authReducer,
        adminSpecifications:adminSpecificationReducer,
        shopAdress: shopAdressSlice,
    },
});

export default store; 