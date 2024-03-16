import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const useGetUserQuery = () => {
  return {
    data: [
      
    ],
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
        name: "Airdrop $SV #0",
        fund: "100",
        remainingFund: "50",
        transactionReward: "5",
        referralReward: "10",
      },
      {
        name: "Airdrop $SV #1",
        fund: "200",
        remainingFund: "50",
        transactionReward: "5",
        referralReward: "10",
      },
      {
        name: "Airdrop $SV #2",
        fund: "500",
        remainingFund: "50",
        transactionReward: "5",
        referralReward: "10",
      },
    ],
    isLoading: false,
  };
};

export { useGetUserQuery, useGetCampaignsQuery, useGetTransactionsQuery };
