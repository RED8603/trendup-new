import React, { useState } from "react";
import { TabContext, TabPanel } from "@mui/lab";
import { Box, Container } from "@mui/material";
import CustomTabs from "@/components/common/CustomTabs/CustomTabs";
import CustomTab from "@/components/common/CustomTabs/CustomTab";

import StreamIcon from "@mui/icons-material/Podcasts";
import ExploreIcon from "@mui/icons-material/TravelExplore";
import FollowingIcon from "@mui/icons-material/PeopleAlt";
import ForYouIcon from "@mui/icons-material/Stars";

import Posts from "@/components/Post/Posts";

const postData = [
    {
        id: 1,
        username: "CryptoNerd",
        userImage: "https://i.pravatar.cc/150?img=1",
        description: "Bitcoin is holding strong despite market volatility. Could a bull run be coming? 📈🚀 #Bitcoin",
        postImage: "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg",
        date: "2025-08-07",
        type: "post",
    },
    {
        id: 2,
        username: "EtherQueen",
        userImage: "https://i.pravatar.cc/150?img=2",
        description: "Ethereum’s gas fees drop as layer 2 adoption rises. Is it time to dive in? ⚙️🔥 #Ethereum",
        postImage: "https://images.pexels.com/photos/6771900/pexels-photo-6771900.jpeg",
        date: "2025-08-06",
        type: "poll",
    },
    {
        id: 3,
        username: "AltcoinDaily",
        userImage: "https://i.pravatar.cc/150?img=3",
        description: "Solana breaks past resistance. Is SOL ready to flip Ethereum? 🌊 #Solana #CryptoNews",
        postImage: "https://images.pexels.com/photos/30855424/pexels-photo-30855424.jpeg",
        date: "2025-08-05",
        type: "post",
    },
    {
        id: 4,
        username: "DeFiWizard",
        userImage: "https://i.pravatar.cc/150?img=4",
        description: "DeFi platforms are reshaping traditional banking. Which one do you trust most?",
        postImage: "https://images.pexels.com/photos/5980751/pexels-photo-5980751.jpeg",
        date: "2025-08-05",
        type: "post",
    },
    {
        id: 5,
        username: "StableSteve",
        userImage: "https://i.pravatar.cc/150?img=5",
        description: "USDT vs USDC — which stablecoin is your go-to for trading security? 💵🔐",
        postImage: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
        date: "2025-08-04",
        type: "poll",
    },
    {
        id: 6,
        username: "DegenDoge",
        userImage: "https://i.pravatar.cc/150?img=6",
        description: "Dogecoin just surged 12% on Elon’s tweet. Never underestimate meme power! 🐶🚀 #DOGE",
        postImage: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
        date: "2025-08-04",
        type: "poll",
    },
    {
        id: 7,
        username: "CryptoGuru",
        userImage: "https://i.pravatar.cc/150?img=7",
        description: "Which coin will dominate the AI + blockchain space in 2025? Cast your vote now! 🤖💰",
        postImage: "https://assets.coingecko.com/coins/images/13397/large/graph.png",
        date: "2025-08-03",
        type: "poll",
    },
    {
        id: 8,
        username: "NFT_Nancy",
        userImage: "https://i.pravatar.cc/150?img=8",
        description: "NFTs are more than JPEGs — they're smart contracts in disguise. 🎨💡 #NFTCommunity",
        postImage: "https://assets.coingecko.com/coins/images/12885/large/flow_logo.png",
        date: "2025-08-02",
        type: "post",
    },
    {
        id: 9,
        username: "LiteLegend",
        userImage: "https://i.pravatar.cc/150?img=9",
        description: "Litecoin halves again! Historically, this has triggered rallies. Will history repeat? ⛏️📉",
        postImage: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
        date: "2025-08-01",
        type: "post",
    },
    {
        id: 10,
        username: "XRPFanatic",
        userImage: "https://i.pravatar.cc/150?img=10",
        description: "XRP lawsuit nearly settled. Could this be the start of an explosive breakout? ⚖️🚀",
        postImage: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
        date: "2025-07-31",
        type: "poll",
    },
];
const postData2 = [
    {
        id: 1,
        username: "AltcoinDaily",
        userImage: "https://i.pravatar.cc/150?img=3",
        description: "Solana breaks past resistance. Is SOL ready to flip Ethereum? 🌊 #Solana #CryptoNews",
        postImage: "https://images.pexels.com/photos/30855424/pexels-photo-30855424.jpeg",
        date: "2025-08-05",
        type: "post",
    },
    {
        id: 2,
        username: "DeFiWizard",
        userImage: "https://i.pravatar.cc/150?img=4",
        description: "DeFi platforms are reshaping traditional banking. Which one do you trust most?",
        postImage: "https://images.pexels.com/photos/5980751/pexels-photo-5980751.jpeg",
        date: "2025-08-05",
        type: "post",
    },
    {
        id: 3,
        username: "CryptoNerd",
        userImage: "https://i.pravatar.cc/150?img=1",
        description: "Bitcoin is holding strong despite market volatility. Could a bull run be coming? 📈🚀 #Bitcoin",
        postImage: "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg",
        date: "2025-08-07",
        type: "post",
    },
    {
        id: 4,
        username: "EtherQueen",
        userImage: "https://i.pravatar.cc/150?img=2",
        description: "Ethereum’s gas fees drop as layer 2 adoption rises. Is it time to dive in? ⚙️🔥 #Ethereum",
        postImage: "https://images.pexels.com/photos/6771900/pexels-photo-6771900.jpeg",
        date: "2025-08-06",
        type: "poll",
    },

    {
        id: 5,
        username: "StableSteve",
        userImage: "https://i.pravatar.cc/150?img=5",
        description: "USDT vs USDC — which stablecoin is your go-to for trading security? 💵🔐",
        postImage: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
        date: "2025-08-04",
        type: "poll",
    },
    {
        id: 6,
        username: "CryptoGuru",
        userImage: "https://i.pravatar.cc/150?img=7",
        description: "Which coin will dominate the AI + blockchain space in 2025? Cast your vote now! 🤖💰",
        postImage: "https://assets.coingecko.com/coins/images/13397/large/graph.png",
        date: "2025-08-03",
        type: "poll",
    },
    {
        id: 7,
        username: "NFT_Nancy",
        userImage: "https://i.pravatar.cc/150?img=8",
        description: "NFTs are more than JPEGs — they're smart contracts in disguise. 🎨💡 #NFTCommunity",
        postImage: "https://assets.coingecko.com/coins/images/12885/large/flow_logo.png",
        date: "2025-08-02",
        type: "post",
    },
    {
        id: 8,
        username: "DegenDoge",
        userImage: "https://i.pravatar.cc/150?img=6",
        description: "Dogecoin just surged 12% on Elon’s tweet. Never underestimate meme power! 🐶🚀 #DOGE",
        postImage: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
        date: "2025-08-04",
        type: "poll",
    },
    {
        id: 9,
        username: "XRPFanatic",
        userImage: "https://i.pravatar.cc/150?img=10",
        description: "XRP lawsuit nearly settled. Could this be the start of an explosive breakout? ⚖️🚀",
        postImage: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
        date: "2025-07-31",
        type: "poll",
    },

    {
        id: 10,
        username: "LiteLegend",
        userImage: "https://i.pravatar.cc/150?img=9",
        description: "Litecoin halves again! Historically, this has triggered rallies. Will history repeat? ⛏️📉",
        postImage: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
        date: "2025-08-01",
        type: "post",
    },
];

const TrendingTabs = () => {
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
                    justifyContent: { xs: "center", md: "center" },
                    mb: 1,
                    mt: 2,
                }}
            >
                <CustomTabs onChange={handleChange} aria-label="trending tabs">
                    <CustomTab icon={<StreamIcon />} label="Stream" value="1" selected={tabId} />
                    <CustomTab icon={<ExploreIcon />} label="Explore" value="2" selected={tabId} />
                    <CustomTab icon={<FollowingIcon />} label="Following" value="3" selected={tabId} />
                    <CustomTab icon={<ForYouIcon />} label="For You" value="4" selected={tabId} />
                </CustomTabs>
            </Box>

            {tabId === "1" && (
                <TabPanel value="1" sx={{ p: 0 }}>
                    <Posts postData={postData} />
                </TabPanel>
            )}
            {tabId === "2" && (
                <TabPanel value="2" sx={{ p: 0 }}>
                    <Posts postData={postData2} />
                </TabPanel>
            )}
            {tabId === "3" && (
                <TabPanel value="3" sx={{ p: 0 }}>
                    <Posts postData={postData} />
                </TabPanel>
            )}
            {tabId === "4" && (
                <TabPanel value="4" sx={{ p: 0 }}>
                    <Posts postData={postData2} />
                </TabPanel>
            )}
        </TabContext>
    );
};

export default TrendingTabs;
