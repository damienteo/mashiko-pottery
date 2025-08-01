import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartReducer, { cartPersistenceMiddleware } from "./cartSlice";
import { loadCartFromStorage } from "./localStorage";
import { initialState as cartInitialState } from "./cartSlice";
import adminPotterReducer from "./admin/potterSlice";
import productsListReducer from "./products/productsListSlice";
import productDetailReducer from "./products/productDetailsSlice";
import pottersListReducer from "./potters/pottersListSlice";
import potterDetailReducer from "./potters/potterDetailsSlice";
import authReducer from "./user/authSlice";
import userReducer from "./user/userSlice";
import uiReducer from "./uiSlice";
import settingsReducer from "./settingsSlice";
import notificationReducer from "./notificationSlice";
import ordersListReducer from "./orders/ordersListSlice";
import orderDetailsReducer from "./orders/orderDetailsSlice";
import payoutsListReducer from "./payouts/payoutsListSlice";
import payoutDetailsReducer from "./payouts/payoutDetailsSlice";
import sellerProfileReducer from "./seller/sellerSlice";
import sellerInventoryReducer from "./seller/sellerInventorySlice";
import sellerPayoutListReducer from "./seller/sellerPayoutListSlice";
import sellerPayoutDetailsReducer from "./seller/sellerPayoutDetailsSlice";

const rootReducer = combineReducers({
  // admin features
  adminPotter: adminPotterReducer,

  cart: cartReducer,

  // products feature
  productsList: productsListReducer,
  productDetails: productDetailReducer,

  // potters feature
  pottersList: pottersListReducer,
  potterDetails: potterDetailReducer,

  // other features
  auth: authReducer,
  user: userReducer,
  ui: uiReducer,
  settings: settingsReducer,
  notification: notificationReducer,

  // orders feature split into list and detail
  ordersList: ordersListReducer,
  orderDetails: orderDetailsReducer,

  // payouts feature split into list and detail
  payoutsList: payoutsListReducer,
  payoutDetails: payoutDetailsReducer,

  // seller profile
  seller: sellerProfileReducer,
  sellerInventory: sellerInventoryReducer,
  sellerPayoutList: sellerPayoutListReducer,
  sellerPayoutDetails: sellerPayoutDetailsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    cart: {
      ...cartInitialState,
      items: loadCartFromStorage(),
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartPersistenceMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
