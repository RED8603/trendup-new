import React, { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Container, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import VotingComponent from "./GenrelVoting/GeneralVote";
import DemoCrating from "./DemoCrating/DemoCrating";
import HodleVoting from "./Hodl/HodlVoting";
import { EmojiPeopleIcon, HowToVoteIcon, SecurityIcon } from "@/assets/icons";

const getIcon = (label) => {
    switch (label) {
        case "Genrel":
            return <HowToVoteIcon />;
        case "Democratic":
            return <EmojiPeopleIcon />;
        case "HODL":
            return <SecurityIcon />;
        default:
            return null;
    }
};

const GradientTab = styled(Tab, {
    shouldForwardProp: (prop) => prop !== "selected",
})(({ theme, selected }) => ({
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: 600,
    color: selected ? "#fff" : "#555",
    background: selected ? "linear-gradient(135deg, #e12e24, #a61d66)" : "transparent",
    transition: "all 0.3s ease",
    "& .MuiTab-iconWrapper": {
        marginRight: 8,
    },

    // 👇 Responsive minWidth
    minWidth: 120,
    [theme.breakpoints.up("md")]: {
        minWidth: 140,
    },

    minHeight: 48,
}));

const Vote = () => {
    const [tabId, setTabId] = useState("1");

    const handleChange = (event, newValue) => {
        setTabId(newValue);
    };

    const tabs = [
        { label: "Genrel", value: "1" },
        { label: "Democratic", value: "2" },
        { label: "HODL", value: "3" },
    ];

    return (
        <Container>
            <TabContext value={tabId}>
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        display: "flex",
                        justifyContent: { xs: "center", md: "left" },
                        mb: 2,
                    }}
                >
                    <TabList
                        onChange={handleChange}
                        aria-label="Voting tabs"
                        sx={{
                            ".MuiTabs-indicator": {
                                display: "none",
                            },
                        }}
                    >
                        {tabs.map((tab) => (
                            <GradientTab
                                key={tab.value}
                                icon={getIcon(tab.label)}
                                label={tab.label}
                                value={tab.value}
                                selected={tabId === tab.value}
                            />
                        ))}
                    </TabList>
                </Box>

                <TabPanel value="1" sx={{ px: 0 }}>
                    <VotingComponent />
                </TabPanel>
                <TabPanel value="2" sx={{ px: 0 }}>
                    <DemoCrating />
                </TabPanel>
                <TabPanel value="3" sx={{ px: 0 }}>
                    <HodleVoting />
                </TabPanel>
            </TabContext>
        </Container>
    );
};

export default Vote;
