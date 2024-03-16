import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  ld,
  styled,
  useTheme,
} from "@mui/material";
import Header from "components/Header";
import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { DAPP_ADDRESSES, FACTORY_ADDRESSES } from "../../constants/addresses";
import { maxUint256, parseEther } from "viem";

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#A0AAB4",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#B2BAC2",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#E0E3E7",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6F7E8C",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    color: "white",
  },
});

const FACTORY_ABI = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createCampaign",
    inputs: [
      {
        name: "ownerAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "dAppAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getCampaign",
    inputs: [
      {
        name: "ownerAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "dAppAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOwner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setOwner",
    inputs: [
      {
        name: "_owner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "CreatedCampaign",
    inputs: [
      {
        name: "ownerAddress",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "dAppAddress",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
];

const CAMPAIGN_ABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_owner",
        type: "address",
        internalType: "address",
      },
      {
        name: "_dApp",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "RATIO",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint24",
        internalType: "uint24",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "addFund",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addReferral",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "referrer",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addTransaction",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "gasUsed",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claimReward",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "dApp",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "endCampaign",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "executeTransaction",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "fund",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getInfomation",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "totalFund",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "remainFund",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getReward",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isRunning",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "referralReward",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "startCampaign",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "address",
      },
      {
        name: "_fund",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_transactionReward",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_referralReward",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "token",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalReward",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transactionReward",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "AddFund",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AddReferral",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "referrer",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AddTransaction",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "gasUsed",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EndCampaign",
    inputs: [
      {
        name: "totalAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "StartCampaign",
    inputs: [
      {
        name: "token",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "fund",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "transactionReward",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "referralReward",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AddressEmptyCode",
    inputs: [
      {
        name: "target",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "AddressInsufficientBalance",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "FailedInnerCall",
    inputs: [],
  },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
    ],
  },
];

const ERC20ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];

const ManageCampaigns = () => {
  const theme = useTheme();

  const { address, chainId } = useAccount();

  const [ownerAddress, setOwnerAddress] = useState("");
  const [dAppAddress, setDAppAddress] = useState("");
  const [transactionReward, setTransactionReward] = useState(0);
  const [fund, setFund] = useState(0);
  const [referralReward, setReferralReward] = useState(0);
  const [tokenAddress, setTokenAddress] = useState("");
  const { writeContractAsync } = useWriteContract();
  const { data: campaignAddress, isLoading: isCampaignAddressLoading } =
    useReadContract({
      abi: FACTORY_ABI,
      address: FACTORY_ADDRESSES[chainId],
      functionName: "getCampaign",
      args: [address, dAppAddress],
    });

  const { data: allowance, isLoading: isAllowanceLoading } = useReadContract({
    abi: ERC20ABI,
    address: tokenAddress,
    functionName: "allowance",
    args: [address, campaignAddress],
  });

  // console.log(isLoading, FACTORY_ADDRESSES[chainId]);
  // console.log(campaignAddress, address);

  const createCampaign = async () => {
    const FACTORY_ADDRESS = FACTORY_ADDRESSES[chainId];
    if (!FACTORY_ADDRESS) {
      alert("Invalid chainId");
      return;
    }
    if (
      isAllowanceLoading ||
      isCampaignAddressLoading ||
      campaignAddress === undefined ||
      allowance === undefined
    ) {
      return;
    }
    writeContractAsync({
      abi: FACTORY_ABI,
      address: FACTORY_ADDRESS,
      functionName: "createCampaign",
      args: [ownerAddress, dAppAddress],
    });
  };

  const startCampaign = async () => {
    const FACTORY_ADDRESS = FACTORY_ADDRESSES[chainId];
    if (!FACTORY_ADDRESS) {
      alert("Invalid chainId");
      return;
    }
    if (allowance.toString() === "0") {
      console.log(tokenAddress, maxUint256.toString());
      try {
        await writeContractAsync({
          abi: ERC20ABI,
          address: tokenAddress,
          functionName: "approve",
          args: [campaignAddress, maxUint256.toString()],
        });
      } catch (err) {
        console.log("Approve Failed :", err);
      }
    }
    const args = [
      tokenAddress,
      parseEther(fund).toString(),
      parseEther(transactionReward).toString(),
      parseEther(referralReward).toString(),
    ];

    writeContractAsync({
      abi: CAMPAIGN_ABI,
      address: campaignAddress,
      functionName: "startCampaign",
      args,
    });
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Add Campaign" subtitle="Add a new Campaign"></Header>
      <Grid
        container
        spacing={3}
        mt="40px"
        height="40vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <Grid item xs={3} spacing={2}>
          <Card
            sx={{
              backgroundImage: "none",
              backgroundColor: theme.palette.background.alt,
              borderRadius: "0.55rem",
            }}
          >
            <CardContent>
              <Typography
                sx={{ fontSize: 24 }}
                color={theme.palette.secondary[300]}
                gutterBottom
              >
                Create a new campaign
              </Typography>
              <br />
              <CssTextField
                label="Enter Owner Address"
                required
                variant="outlined"
                onChange={(e) => {
                  setOwnerAddress(e.target.value);
                }}
              ></CssTextField>
              <br />
              <br />
              <CssTextField
                required
                label="Enter DApp Address"
                variant="outlined"
                onChange={(e) => {
                  setDAppAddress(e.target.value);
                }}
              ></CssTextField>
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={createCampaign}
              >
                <Typography
                  sx={{
                    color: theme.palette.secondary[300],
                    fontWeight: "bold",
                    padding: "0.5rem 2rem",
                  }}
                >
                  Create Campaign
                </Typography>
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3} spacing={2}>
          <Card
            sx={{
              backgroundImage: "none",
              backgroundColor: theme.palette.background.alt,
              borderRadius: "0.55rem",
            }}
          >
            <CardContent>
              <Typography
                sx={{ fontSize: 24 }}
                color={theme.palette.secondary[300]}
                gutterBottom
              >
                Start the campaign
              </Typography>
              <br />
              <CssTextField
                required
                label="Enter Dapp Address"
                variant="outlined"
                onChange={(e) => {
                  setDAppAddress(e.target.value);
                }}
              ></CssTextField>
              <br />
              <br />
              <CssTextField
                required
                label="Enter Token Address"
                variant="outlined"
                onChange={(e) => {
                  setTokenAddress(e.target.value);
                }}
              ></CssTextField>
              <br />
              <br />
              <CssTextField
                required
                label="Deposit fund amount"
                variant="outlined"
                onChange={(e) => {
                  setFund(e.target.value);
                }}
              ></CssTextField>
              <br />
              <br />
              <CssTextField
                required
                label="Enter Transaction Reward"
                variant="outlined"
                onChange={(e) => {
                  setTransactionReward(e.target.value);
                }}
              ></CssTextField>
              <br />
              <br />
              <CssTextField
                required
                label="Enter Referral Reward"
                variant="outlined"
                onChange={(e) => {
                  setReferralReward(e.target.value);
                }}
              ></CssTextField>
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  startCampaign();
                }}
              >
                <Typography
                  sx={{
                    color: theme.palette.secondary[300],
                    fontWeight: "bold",
                    padding: "0.5rem 2rem",
                  }}
                >
                  Start Campaign
                </Typography>
              </Button>
            </CardContent>
          </Card>
        </Grid>{" "}
        <Grid item xs={3} spacing={2}>
          <Card
            sx={{
              backgroundImage: "none",
              backgroundColor: theme.palette.background.alt,
              borderRadius: "0.55rem",
            }}
          >
            <CardContent>
              <Typography
                sx={{ fontSize: 24 }}
                color={theme.palette.secondary[300]}
                gutterBottom
              >
                Stop the campaign
              </Typography>
              <br />
              <CssTextField
                required
                label="Enter Dapp Reward"
                variant="outlined"
                onChange={(e) => {
                  setDAppAddress(e.target.value);
                }}
              ></CssTextField>
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  createCampaign(
                    address,
                    dAppAddress,
                    tokenAddress,
                    fund,
                    transactionReward,
                    referralReward
                  );
                }}
              >
                <Typography
                  sx={{
                    color: theme.palette.secondary[300],
                    fontWeight: "bold",
                    padding: "0.5rem 2rem",
                  }}
                >
                  Stop Campaign
                </Typography>
              </Button>
            </CardContent>
          </Card>
        </Grid>{" "}
        <Grid item xs={3} spacing={2}>
          <Card
            sx={{
              backgroundImage: "none",
              backgroundColor: theme.palette.background.alt,
              borderRadius: "0.55rem",
            }}
          >
            <CardContent>
              <Typography
                sx={{ fontSize: 24 }}
                color={theme.palette.secondary[300]}
                gutterBottom
              >
                Add fund to campaign
              </Typography>
              <br />
              <CssTextField
                required
                label="Deposit fund amount"
                variant="outlined"
                onChange={(e) => {
                  setFund(e.target.value);
                }}
              ></CssTextField>
              <br />
              <br />
              <CssTextField
                required
                label="Enter DApp Address"
                variant="outlined"
                onChange={(e) => {
                  setDAppAddress(e.target.value);
                }}
              ></CssTextField>
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  createCampaign(
                    address,
                    dAppAddress,
                    tokenAddress,
                    fund,
                    transactionReward,
                    referralReward
                  );
                }}
              >
                <Typography
                  sx={{
                    color: theme.palette.secondary[300],
                    fontWeight: "bold",
                    padding: "0.5rem 2rem",
                  }}
                >
                  Add fund
                </Typography>
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default ManageCampaigns;
