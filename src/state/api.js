import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const useGetCustomersQuery = () => {
  return {
    data: [],
    isLoading: false,
  };
};
const useGetUserQuery = () => {
  return {
    data: [],
    isLoading: false,
  };
};
const useGetTransactionsQuery = () => {
  return {
    data: [],
    isLoading: false,
  };
};
const useGetCampaignsQuery = () => {
  return {
    data: [
      {
        name: "Airdrop $SV",
        fund: "100",
        remainingFund: "50",
        transactionReward: "5",
        referralReward: "10",
      },
    ],
    isLoading: false,
  };
};

export {
  useGetUserQuery,
  useGetCampaignsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
};
