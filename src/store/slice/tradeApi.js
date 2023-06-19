import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseTradeUrl = process.env.REACT_APP_TRADE_URL;

export const tradeApi = createApi({
  reducerPath: "tradeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseTradeUrl,
    prepareHeaders: async (headers) => {
      // get auth token and append headers
      const token = localStorage.getItem("auth");
      headers.set("x-access-token", token);
      return headers;
    },
  }),
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

    // la liste des portfolios pour un user
    getPortfoliosByUser: builder.query({
      query: (id) => `/portfolio/user/${id}`,
    }),

    // la synthèses des portfolios
    getGlobalDashBoardByUser: builder.query({
      query: (id) => `/portfolio/dashboard/user/global/${id}`,
    }),

    // le dashboard d'un portfolio particulier par id de portfolio
    getPortfolioDashboardById: builder.query({
      query: (id) => `/portfolio/dashboard/${id}`,
    }),
  }),
});

export const {
  useSignUserInMutation,
  useSignUserUpMutation,
  useGetPortfoliosByUserQuery,
  useGetGlobalDashBoardByUserQuery,
  useGetPortfolioDashboardByIdQuery,
} = tradeApi;
