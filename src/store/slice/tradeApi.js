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
    // log d'une user existant
    signUserIn: builder.mutation({
      query: (payload) => ({
        url: "/users/signin",
        method: "POST",
        body: payload,
      }),
      providesTags: ["Auth"],
      transformResponse: (response, meta, arg) => {
        return { response: response, status: meta.response.status };
      },
    }),

    // autolog par remember d'un utilisateur
    logByRemember: builder.query({
      query: () => `users/logByRemenber`,
      providesTags: ["Auth"],
      transformResponse: (response, meta, arg) => {
        return { response: response, status: meta.response.status };
      },
    }),

    // demande d'un nouvel utilisateur
    signUserUp: builder.mutation({
      query: (payload) => ({
        url: "/users/signup",
        method: "POST",
        body: payload,
      }),
    }),

    // la liste des portfolios pour un user
    getPortfoliosByUser: builder.query({
      query: (id) => `/portfolios/user/${id}`,
      providesTags: ["Portfolio"],
    }),

    // passage en idle d'un portfolio
    idlePortfolio: builder.mutation({
      query: (id) => ({
        url: `/portfolios/${id}/idle`,
        method: "PUT",
      }),
      invalidatesTags: ["GlobalDatas", "Portfolio"],
    }),

    // la synthèses des portfolios pour un user
    getGlobalDashBoardByUser: builder.query({
      query: (id) => `/portfolios/dashboard/user/${id}`,
      providesTags: ["GlobalDatas"],
    }),

    // le dashboard d'un portfolio particulier par id de portfolio
    getPortfolioDashboardById: builder.query({
      query: (id) => `/portfolios/${id}/dashboard`,
      providesTags: ["GlobalDatas", "PortfolioByUser"],
    }),

    // le détail d'un portefeuille par id de portefeuille
    getDetailPortfolioById: builder.query({
      query: (id) => `/portfolios/${id}/details`,
      providesTags: ["GlobalDatas"],
    }),

    // nouveau portfolio
    newPortfolio: builder.mutation({
      query: (payload) => ({
        url: "/portfolios/new",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GlobalDatas", "Portfolio"],
    }),

    // liste des strategies par user
    getStategiesByUserId: builder.query({
      query: (id) => `strategies/user/${id}`,
      providesTags: ["strategy"],
    }),

    //recherhce des stocks
    searchStocks: builder.query({
      query: (title) => `/stocks/${title}/find`,
    }),

    //dernier cours d'un stock
    lastQuote: builder.query({
      query: (item) => `/stocks/${item.isin}&${item.place}/last`,
    }),

    // le trade en cours pour un stock et un portfolio
    checkIfActiveTrade: builder.query({
      query: (params) =>
        `/trades/checkIfActive/${params.stockId}&${params.portfolioId}`,
      providesTags: ["CheckActive"],
    }),

    // devises disponibles
    getCurrencies: builder.query({
      query: () => `/currencies/`,
      providesTags: ["Currencies"],
    }),

    // nouveau trade
    newTrade: builder.mutation({
      query: (payload) => ({
        url: "/trades/newEntry",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GlobalDatas", "CheckActive"],
    }),

    prepare: builder.query({
      query: (id) => `/trades/${id}/prepare`,
      providesTags: ["Prepare"],
    }),

    // exit Process
    exitProcess: builder.mutation({
      query: (payload) => ({
        url: `/trades/exitProcess`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GlobalDatas", "CheckActive", "Prepare"],
    }),

    // reEnter Process
    reEnter: builder.mutation({
      query: (payload) => ({
        url: `/trades/reEnter`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GlobalDatas", "CheckActive", "Prepare"],
    }),

    // mouvement de fonds -> deposit
    depositFunds: builder.mutation({
      query: (payload) => ({
        url: "/portfolios/deposit",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GlobalDatas", "Prepare"],
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
  useGetCurrenciesQuery,
  useNewPortfolioMutation,
  useDepositFundsMutation,
  useIdlePortfolioMutation,
  useLogByRememberQuery,

} = tradeApi;
