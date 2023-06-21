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

    // le détail d'un portefeuille par id de portefeuille
    getDetailPortfolioById: builder.query({
      query: (id) => `/portfolio/details/${id}`,
    }),

    // liste des strategies par user
    getStategiesByUserId: builder.query({
      query: (id) => `strategies/user/${id}`,
    }),

    //recherhce des stocks
    searchStocks: builder.query({
      query: (title) => `/stock/find/${title}`,
    }),

    //dernier cours d'un stock
    lastQuote: builder.query({
      query: (item) => `/stock/last/${item.isin}&${item.place}`,
    }),

    // nouveau trade
    newTrade: builder.mutation({
      query: (payload) => ({
        url: "/trade/newEntry",
        method: "POST",
        body: payload,
      }),
    }),

    // preparation exit / re-enter
    prepare: builder.query({
      query: (id) => `/trade/prepare/${id}`,
    }),

    // exit Process
    exitProcess: builder.mutation({
      query: (payload) => ({
        url: `/trade/exitProcess`,
        method: "POST",
        body: payload,
      }),
    }),


  }),
});

export const {
  useSignUserInMutation,
  useSignUserUpMutation,
  useGetPortfoliosByUserQuery,
  useGetGlobalDashBoardByUserQuery,
  useGetPortfolioDashboardByIdQuery,
  useGetDetailPortfolioByIdQuery,
  useGetStategiesByUserIdQuery,
  useSearchStocksQuery,
  useLastQuoteQuery,
  useNewTradeMutation,
  useExitProcessMutation,
  usePrepareQuery,

} = tradeApi;
