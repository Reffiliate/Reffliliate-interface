import React, { useState } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import { useDispatch } from "react-redux";
import { setMode } from "state";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  InputBase,
  Toolbar,
  useTheme,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { trimPublicKey } from "utils/utils";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { chains, switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const { address, chainId, isConnected } = useAccount();
  const { data: balance } = useBalance();

  const { connectors, connect } = useConnect();
  const connectWallet = () => {
    connect({ connector: connectors[0] });
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    connectWallet();
  };
  const handleClose = () => setAnchorEl(null);
  const handleLogOut = () => {
    handleClose();
    disconnect();
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          <FlexBetween
            backgroundColor={theme.palette.background.alt}
            borderRadius="9px"
            gap="3rem"
            p="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        </FlexBetween>
        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton>
            <SettingsOutlined sx={{ fontSize: "25px" }}></SettingsOutlined>
          </IconButton>
          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
                border: "1px solid lightgrey",
                paddingLeft: "2rem",
                paddingRight: "2rem",
              }}
            >
              <Box>
                {isConnected ? (
                  <>
                    <Box>
                      <Typography
                        fontWeight="bold"
                        fontSize="1rem"
                        sx={{ color: theme.palette.secondary[100] }}
                      >
                        {trimPublicKey(address)}
                      </Typography>
                      <Typography
                        fontSize="0.75rem"
                        sx={{ color: theme.palette.secondary[100] }}
                      >
                        {!!balance
                          ? balance.value.toString() + " " + balance.symbol
                          : 0}
                      </Typography>{" "}
                    </Box>
                  </>
                ) : (
                  <Typography
                    fontWeight="bold"
                    fontSize="1rem"
                    sx={{ color: theme.palette.secondary[100] }}
                  >
                    Connect
                  </Typography>
                )}
              </Box>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
