// ici on est dans le store  Redux

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { tradeApi } from "./slice/tradeApi";
import { userReducer } from "./slice/user.js";
import { rtkQueryErrorLogger } from "./errorCatchingMiddleware.js";
 


export const store = configureStore ({
    reducer: {
        [tradeApi.reducerPath]: tradeApi.reducer,
        user: userReducer, 
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tradeApi.middleware, rtkQueryErrorLogger),
})

setupListeners(store.dispatch);