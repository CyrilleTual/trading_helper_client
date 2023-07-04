import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseTradeUrl = process.env.REACT_APP_TRADE_URL;

export const tradeApi = createApi({
  reducerPath: "tradeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseTradeUrl,
    prepareHeaders: async (headers) => {
      // get auth token and append headers
      const token = localStorage.getItem("auth42titi@");
      headers.set("x-access-token", token);
      return headers;
    },
  }),
  tagTypes: ["Auth", "Portfolio", "GlobalDatas"],
  endpoints: (builder) => ({
    signUserIn: builder.mutation({
      query: (payload) => ({
        url: "/user/signin",
        method: "POST",
        body: payload,
      }),
      providesTags: ["Auth"],
      transformResponse: (response, meta, arg) => {
        return { response: response, status: meta.response.status };
      },
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
      providesTags: ["Portfolio"],
    }),

    // la synthèses des portfolios
    getGlobalDashBoardByUser: builder.query({
      query: (id) => `/portfolio/dashboard/user/global/${id}`,
      providesTags: ["GlobalDatas"],
    }),

    // le dashboard d'un portfolio particulier par id de portfolio
    getPortfolioDashboardById: builder.query({
      query: (id) => `/portfolio/dashboard/${id}`,
      providesTags: ["GlobalDatas"],
    }),

    // le détail d'un portefeuille par id de portefeuille
    getDetailPortfolioById: builder.query({
      query: (id) => `/portfolio/details/${id}`,
      providesTags: ["GlobalDatas"],
    }),

    // liste des strategies par user
    getStategiesByUserId: builder.query({
      query: (id) => `strategies/user/${id}`,
      providesTags: ["strategy"],
    }),

    //recherhce des stocks
    searchStocks: builder.query({
      query: (title) => `/stock/find/${title}`,
    }),

    //dernier cours d'un stock
    lastQuote: builder.query({
      query: (item) => `/stock/last/${item.isin}&${item.place}`,
    }),

    // le trade en cours pour un stock et un portfolio
    checkIfActiveTrade: builder.query({
      query: (params) =>
        `/trade/checkIfActive/${params.stockId}&${params.portfolioId}`,
      providesTags: ["CheckActive"],
    }),

    // nouveau trade
    newTrade: builder.mutation({
      query: (payload) => ({
        url: "/trade/newEntry",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GlobalDatas", "CheckActive"],
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
      invalidatesTags: ["GlobalDatas", "CheckActive"],
    }),

    // reEnter Process
    reEnter: builder.mutation({
      query: (payload) => ({
        url: `/trade/reEnter`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GlobalDatas", "CheckActive"],
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
  useReEnterMutation,
  useCheckIfActiveTradeQuery,

} = tradeApi;
