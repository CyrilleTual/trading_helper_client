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
      providesTags: ["Autolog"],
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

    // la liste des portfolios pour un user + caratèristiques
    getPortfoliosByUser: builder.query({
      query: (id) => `/portfolios/user/${id}`,
      providesTags: ["Portfolio"],
    }),

    // retourne tous les trades ouverts détaillés pour un user
    getTradesActivesByUser: builder.query({
      query: (id) => `trades/activesByUser/${id}`,
      providesTags: ["DetailActivesTrades"],
    }),

    // retourne un objet avec tous les mouvements sur un trade
    getMovementsByTradeId: builder.query({
      query: (id) => `trades/${id}/movements`,
      providesTags: ["Movements"],
    }),

    // passage en idle d'un portfolio
    idlePortfolio: builder.mutation({
      query: ({ id, status }) => ({
        url: `/portfolios/${id}/idle`,
        method: "PUT",
        body: { id: id, status: status },
      }),
      invalidatesTags: ["Portfolio"],
    }),

    // la synthèses des portfolios pour un user
    getGlobalDashBoardByUser: builder.query({
      query: (id) => `/portfolios/dashboard/user/${id}`,
      providesTags: ["GlobalDatas"],
    }),

    // nouveau portfolio
    newPortfolio: builder.mutation({
      query: (payload) => ({
        url: "/portfolios/new",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Portfolio", "GlobalDatas"],
    }),

    // liste des strategies par user
    getStategiesByUserId: builder.query({
      query: (id) => `strategies/user/${id}`,
      providesTags: ["Strategy"],
    }),

    // creation d'une stratégie
    newStrategy: builder.mutation({
      query: (payload) => ({
        url: "strategies/new",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Strategy"],
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
      providesTags: ["CheckIfTradeIsActive"],
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
      invalidatesTags: [
        "GlobalDatas",
        "CheckIfTradeIsActive",
        "PortfolioByUser",
        "PortfolioById",
        "DetailActivesTrades",
      ],
    }),

    // delete un trade
    deleteTrade: builder.mutation({
      query: (id) => ({
        url: `/trades/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "GlobalDatas",
        "CheckIfTradeIsActive",
        "PortfolioByUser",
        "PortfolioById",
        "DetailActivesTrades",
      ],
    }),

    // exit Process
    exitProcess: builder.mutation({
      query: (payload) => ({
        url: `/trades/exitProcess`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "GlobalDatas",
        "CheckIfTradeIsActive",
        "Prepare",
        "PortfolioByUser",
        "PortfolioById",
        "DetailActivesTrades",
        "Movements",
      ],
    }),

    // reEnter Process
    reEnter: builder.mutation({
      query: (payload) => ({
        url: `/trades/reEnter`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "GlobalDatas",
        "CheckIfTradeIsActive",
        "Prepare",
        "PortfolioByUser",
        "PortfolioById",
        "DetailActivesTrades",
        "Movements",
      ],
    }),

    // adjust Process
    adjustment: builder.mutation({
      query: (payload) => ({
        url: `/trades/adjustment`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "GlobalDatas",
        "CheckIfTradeIsActive",
        "Prepare",
        "PortfolioByUser",
        "PortfolioById",
        "DetailActivesTrades",
        "Movements",
      ],
    }),

    // mouvement de fonds -> deposit
    depositFunds: builder.mutation({
      query: (payload) => ({
        url: "/portfolios/deposit",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GlobalDatas", "Prepare", "PortfolioByUser"],
    }),
  }),
});

export const {
  useSignUserInMutation,
  useSignUserUpMutation,
  useGetPortfoliosByUserQuery,
  useGetGlobalDashBoardByUserQuery,
  useGetStategiesByUserIdQuery,
  useNewStrategyMutation,
  useSearchStocksQuery,
  useLastQuoteQuery,
  useNewTradeMutation,
  useExitProcessMutation,
  useReEnterMutation,
  useCheckIfActiveTradeQuery,
  useGetCurrenciesQuery,
  useNewPortfolioMutation,
  useDepositFundsMutation,
  useIdlePortfolioMutation,
  useLogByRememberQuery,
  useAdjustmentMutation,
  useGetTradesActivesByUserQuery,
  useGetMovementsByTradeIdQuery,
  useDeleteTradeMutation,

} = tradeApi;
