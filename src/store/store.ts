import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import productsListReducer from "./products/productsListSlice";
import productDetailReducer from "./products/productDetailSlice";
import pottersListReducer from "./potters/pottersListSlice";
import potterDetailReducer from "./potters/potterDetailSlice";
import authReducer from "./authSlice";
import uiReducer from "./uiSlice";
import settingsReducer from "./settingsSlice";
import notificationReducer from "./notificationSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,

    // products feature
    productsList: productsListReducer,
    productDetail: productDetailReducer,

    // potters feature
    pottersList: pottersListReducer,
    potterDetail: potterDetailReducer,

    // other features
    auth: authReducer,
    ui: uiReducer,
    settings: settingsReducer,
    notification: notificationReducer,
  },
  // ... preloadedState & subscribe() for cart remains unchanged
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
