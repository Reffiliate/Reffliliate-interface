import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Header from "components/Header";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetCampaignsQuery } from "state/api";

const Campaign = ({
  name,
  fund,
  remainingFund,
  transactionReward,
  referralReward,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 20 }}
          color={theme.palette.secondary[700]}
          gutterBottom
        >
          {name}
        </Typography>
        <Typography variant="h5" component="div">
          Funds
        </Typography>
        <br />
        <Typography sx={{ fontSize: "1rem" }} color="lightblue">
          Initial Fund: ${fund}
        </Typography>
        <Typography sx={{ mb: "1rem", fontSize: "1rem" }} color="lightgreen">
          Remaining Fund ${remainingFund}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          See More
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        sx={{ color: theme.palette.neutral[300] }}
      >
        <CardContent>
          <Typography
            sx={{ mb: "0.5rem", color: theme.palette.secondary[400] }}
          >
            Description: <br></br>
            <Typography
              sx={{ mb: "0.5rem", color: theme.palette.secondary[700] }}
            >
              {transactionReward}
            </Typography>
          </Typography>
          <Typography
            sx={{ mb: "0.5rem", color: theme.palette.secondary[400] }}
          >
            Note: <br></br>
            <Typography
              sx={{ mb: "0.5rem", color: theme.palette.secondary[700] }}
            >
              {referralReward}
            </Typography>
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Campaigns = () => {
  const userId = useSelector((state) => state.global.userId);
  const { data, isLoading } = useGetCampaignsQuery(userId);
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Campaigns"
        subtitle="All of your Campaigns are here"
      ></Header>
      {data || !isLoading ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": {
              gridColumn: isNonMobile ? undefined : "span 4",
            },
          }}
        >
          {data.map(
            ({
              name,
              fund,
              remainingFund,
              transactionReward,
              referralReward,
            }) => (
              <Campaign
                name={name}
                fund={fund}
                remainingFund={remainingFund}
                transactionReward={transactionReward}
                referralReward={referralReward}
              ></Campaign>
            )
          )}
        </Box>
      ) : (
        <>Loading</>
      )}
    </Box>
  );
};

export default Campaigns;
