import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Container, Tab } from "@mui/material";
import React, { useState } from "react";
import GenrelVoting from "./GenrelVoting/GenrelVoting";

const Vote = () => {
    const [tabId, setTabId] = useState(1);

    const handleChange = (event, newValue) => {
        setTabId(newValue);
    };
    return (
        <Container>
            <TabContext value={tabId}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList onChange={handleChange} aria-label="Voting tabs">
                        <Tab label="Genrel" value={1} />
                        <Tab label="Democratic" value={2} />
                        <Tab label="HODL" value={3} />
                    </TabList>
                </Box>
                <TabPanel value={1} sx={{ px: { md: 2, xs: 0 } }}>
                    <GenrelVoting />{" "}
                </TabPanel>
                <TabPanel value={2}>Item Two</TabPanel>
                <TabPanel value={3}>Item Three</TabPanel>
            </TabContext>
        </Container>
    );
};

export default Vote;
