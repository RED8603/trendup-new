import Hidden from "@mui/material/Hidden";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import React, { Fragment, useState } from "react";

import { Link as ScrollLink } from "react-scroll";
import { IconButton, Paper, Stack, Typography } from "@mui/material";

import ButtonBorder from "@components/common/ButtonBorder";
import { darkLogo, lightLogo } from "@/assets";
import { useGenrelContext } from "@/context/GenrelContext";

const array = [
    {
        name: "Home",
        link1: "home",
    },
    {
        name: "About TUP",
        link1: "about",
    },
    {
        name: "Buy TRD",
        link1: "buytup",
    },
    {
        name: "Democratic Vote",
        link1: "vote",
    },
    {
        name: "Hold Vote",
        link1: "holdvote",
    },
    {
        name: "FAQs",
        link1: "faq",
    },
];

export default function Header({ children }) {
    const [state, setState] = useState({ left: false });

    const { address, isDarkMode } = useGenrelContext();

    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };
    const list = (anchor) => (
        <Box
            sx={(theme) => ({
                width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
                background: theme.palette.primary.main,
            })}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            {children}

            <Stack direction="column" alignItems="center" gap={"0px"} justifyContent={"center"}>
                <img src={isDarkMode ? darkLogo : lightLogo} alt="logo" srcSet="" width="100px" />
                <Typography fontWeight="700" fontSize="14px" sx={(theme) => ({ color: theme.palette.text.secondary })}>
                    {" "}
                    Trend Up{" "}
                </Typography>
            </Stack>

            <List sx={{ mt: 5, px: 2 }}>
                {array.map(({ link1, name }, index) => {
                    return (
                        <Box key={index}>
                            <ScrollLink
                                onClick={toggleDrawer(anchor, false)}
                                to={link1}
                                style={{
                                    textDecoration: "none",
                                    textTransform: "capitalize",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    fontSize: "20px",
                                    color: "#fff ",
                                    fontFamily: "Poppins",
                                    display: "flex",
                                    gap: "20px",
                                    alignItems: "center",
                                }}
                                spy
                                smooth
                                offset={-100}
                                duration={1000}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: "Poppins",
                                        textAlign: "center",
                                        width: "100%",
                                    }}
                                >
                                    {name}
                                </Typography>
                            </ScrollLink>
                        </Box>
                    );
                })}

                <a
                    href="/whitePaper.pdf"
                    style={{
                        textDecoration: "none",
                        textTransform: "capitalize",
                        padding: "10px",
                        borderRadius: "5px",
                        fontSize: "20px",
                        color: "#fff ",
                        fontFamily: "Poppins",
                        display: "flex",
                        gap: "20px",
                        alignItems: "center",
                    }}
                    className="cool-link"
                    target="_blanck"
                >
                    <Typography
                        sx={{
                            fontFamily: "Poppins",
                            textAlign: "center",
                            width: "100%",
                        }}
                    >
                        {" "}
                        WHITE PAPER{" "}
                    </Typography>
                </a>

                <a
                    href="/audit.pdf"
                    style={{
                        textDecoration: "none",
                        textTransform: "capitalize",
                        padding: "10px",
                        borderRadius: "5px",
                        fontSize: "20px",
                        color: "#fff ",
                        fontFamily: "Poppins",
                        display: "flex",
                        gap: "20px",
                        alignItems: "center",
                    }}
                    className="cool-link"
                    target="_blanck"
                >
                    <Typography
                        sx={{
                            fontFamily: "Poppins",
                            textAlign: "center",
                            width: "100%",
                        }}
                    >
                        {" "}
                        AUDIT
                    </Typography>
                </a>

                <Box
                    sx={{
                        mt: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "0px 20px",
                    }}
                >
                    {address ? (
                        <ButtonBorder
                            // onClick={open}
                            className="hvr-bounce-to-right-sign"
                            sx={{ textTransform: "capitalize", fontSize: "14px" }}
                        >
                            {/* {account.slice(0, 4) + "...." + account.slice(-4)} */}
                            <appkit-button balance="hide" />
                        </ButtonBorder>
                    ) : (
                        <ButtonBorder
                            // onClick={open}
                            className="hvr-bounce-to-right-sign"
                            sx={{ textTransform: "capitalize", fontSize: "14px" }}
                        >
                            connect wallet
                            <appkit-button balance="hide" />
                        </ButtonBorder>
                    )}
                </Box>
            </List>
        </Box>
    );
    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                sx={{
                    backgroundColor: "transparent",
                }}
            >
                <Box sx={{ width: "100%" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Hidden lgUp>
                            {["left"].map((anchor) => (
                                <React.Fragment key={anchor}>
                                    <Stack direction="row" alignItems="center" gap={"0px"}>
                                        <img
                                            src={isDarkMode ? darkLogo : lightLogo}
                                            alt="logo"
                                            srcSet=""
                                            width="40px"
                                        />
                                        <Typography fontWeight="700" fontSize="14px">
                                            {" "}
                                            Trend Up{" "}
                                        </Typography>
                                    </Stack>

                                    <IconButton onClick={toggleDrawer(anchor, true)}>
                                        <MenuIcon
                                            sx={{
                                                fontSize: "25px",
                                                cursor: "pointer",
                                                color: "#000",
                                            }}
                                        />
                                    </IconButton>
                                    <SwipeableDrawer
                                        anchor={anchor}
                                        open={state[anchor]}
                                        onClose={toggleDrawer(anchor, false)}
                                        onOpen={toggleDrawer(anchor, true)}
                                    >
                                        {list(anchor)}
                                    </SwipeableDrawer>
                                </React.Fragment>
                            ))}
                            {/* {["left"].map((anchor) => (
                                <Fragment key={anchor}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "100%",
                                            borderRadius: "5px",
                                            p: 3,
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={isDarkMode ? darkLogo : lightLogo}
                                            alt="logo"
                                            width="30px "
                                        />

                                     

                                        <IconButton onClick={toggleDrawer(anchor, true)}>
                                            <MenuIcon
                                                sx={{
                                                    fontSize: "25px",
                                                    cursor: "pointer",

                                                    color: "#000",
                                                }}
                                            />
                                        </IconButton>
                                    </Box>
                                    <Paper>
                                        <SwipeableDrawer
                                            classes={{ paper: classes.paper }}
                                            anchor={anchor}
                                            open={state[anchor]}
                                            onClose={toggleDrawer(anchor, false)}
                                            onOpen={toggleDrawer(anchor, true)}
                                        >
                                            <Box
                                                sx={{
                                                    height: "100vh",
                                                    width: "100%",
                                                    background: "#3bb143",
                                                }}
                                            >
                                                {list(anchor)}
                                            </Box>
                                        </SwipeableDrawer>
                                    </Paper>
                                </Fragment>
                            ))} */}
                        </Hidden>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
