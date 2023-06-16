import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseTradeUrl = process.env.REACT_APP_TRADE_URL;

export const tradeApi = createApi({
  reducerPath: "tradeApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseTradeUrl }),
  endpoints: (builder) => ({

    signUserIn: builder.mutation({
      query: (payload) => ({
        url: "/user/signin",
        method: "POST",
        body: payload,
      }),
    }),

    signUserUp: builder.mutation({
      query: (payload) => ({
        url: "/user/signup",
        method: "POST",
        body: payload,
      }),
    }),

  }),
});

export const { useSignUserInMutation, useSignUserUpMutation  } = tradeApi;
