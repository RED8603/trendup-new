import React, { useState } from "react";
import { TabContext, TabPanel } from "@mui/lab";
import { Box } from "@mui/material";
import VotingComponent from "./GenrelVoting/GeneralVote";
import HodleVoting from "./Hodl/HodlVoting";
import { EmojiPeopleIcon, HowToVoteIcon, SecurityIcon } from "@/assets/icons";
import CustomTabs from "@/components/common/CustomTabs/CustomTabs";
import CustomTab from "@/components/common/CustomTabs/CustomTab";
import DemocraticVoting from "./DemocraticVoting/DemocraticVoting";

const Vote = () => {
    const [tabId, setTabId] = useState("1");

    const handleChange = (event, newValue) => {
        setTabId(newValue);
    };

    return (
  
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
                    <CustomTabs onChange={handleChange} aria-label="home tabs">
                        <CustomTab
                            icon={<HowToVoteIcon />}
                            label="Genrel"
                            value={"1"}
                            selected={tabId}
                            sx={{ minWidth: { xs: "120", md: "140px" } }}
                        />
                        <CustomTab
                            icon={<EmojiPeopleIcon />}
                            label="Democratic"
                            value={"2"}
                            selected={tabId}
                            sx={{ minWidth: { xs: "120", md: "140px" } }}
                        />
                        <CustomTab
                            icon={<SecurityIcon />}
                            label="HODL"
                            value={"3"}
                            selected={tabId}
                            sx={{ minWidth: { xs: "120", md: "140px" } }}
                        />
                    </CustomTabs>
                </Box>

                <TabPanel value="1" sx={{ px: { md: 2, xs: 0 }, py: 2 }}>
                    <VotingComponent />
                </TabPanel>
                <TabPanel value="2" sx={{ px: { md: 2, xs: 0 }, py: 2 }}>
                    <DemocraticVoting />
                </TabPanel>
                <TabPanel value="3" sx={{ px: { md: 2, xs: 0 }, py: 2 }}>
                    <HodleVoting />
                </TabPanel>
            </TabContext>
      
    );
};

export default Vote;
