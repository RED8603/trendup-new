export const mockNotifications = [
    {
        id: 1,
        avatar: "https://i.pravatar.cc/150?img=10",
        title: "Bitcoin crossed $60K!",
        description: "BTC is booming again. Check the market now.",
        time: "2 mins ago",
    },
    {
        id: 2,
        avatar: "https://i.pravatar.cc/150?img=15",
        title: "ETH gas fees dropped",
        description: "Now is a good time for some DeFi transactions.",
        time: "10 mins ago",
    },
    {
        id: 3,
        avatar: "https://i.pravatar.cc/150?img=7",
        title: "Solana transaction failed",
        description: "Retrying might help. Check your wallet.",
        time: "30 mins ago",
    },
    {
        id: 4,
        avatar: "https://i.pravatar.cc/150?img=9",
        title: "New proposal on your DAO",
        description: "Vote before 6 PM today to have your say.",
        time: "1 hour ago",
    },
];

export const emojiIcon= ["😀", "😂", "😍", "🤔", "👍", "👎", "❤️", "🔥", "💯", "😢", "😡", "🎉", "👏", "🙌", "💪", "🤝"];

export const users = [
    {
        id: "general",
        name: "# general",
        avatar: "/abstract-geometric-shapes.png",
        color: "#5865F2",
        status: "online",
    },
    {
        id: "alice",
        name: "Alice",
        avatar: "/alice-in-wonderland.png",
        color: "#ff6b6b",
        status: "online",
    },
    {
        id: "bob",
        name: "Bob",
        avatar: "/bob-portrait.png",
        color: "#4ecdc4",
        status: "away",
    },
    {
        id: "charlie",
        name: "Charlie",
        avatar: "/abstract-figure-charlie.png",
        color: "#45b7d1",
        status: "online",
    },
    {
        id: "david",
        name: "David",
        avatar: "/abstract-colorful-swirls.png",
        color: "#f39c12",
        status: "busy",
    },
    {
        id: "eve",
        name: "Eve",
        avatar: abstract_design_elements,
        color: "#e74c3c",
        status: "offline",
        lastSeen: new Date(Date.now() - 3600000),
    },
];

import abstract_design_elements from "../assets/images/abstract-design-elements.png"

// Initial conversations
export const initialConversations = [
    {
        userId: "general",
        unreadCount: 0,
        messages: [
            {
                id: "1",
                user: { name: "Alice", avatar: "/alice-in-wonderland.png", color: "#ff6b6b" },
                content: "Hey everyone! How's it going?",
                timestamp: new Date(Date.now() - 3600000),
                reactions: [
                    { emoji: "👋", count: 3, users: ["Bob", "Charlie", "David"] },
                    { emoji: "😊", count: 1, users: ["Bob"] },
                ],
            },
            {
                id: "2",
                user: { name: "Bob", avatar: "/bob-portrait.png", color: "#4ecdc4" },
                content: "Pretty good! Just working on some new features.",
                timestamp: new Date(Date.now() - 3000000),
                reactions: [{ emoji: "💪", count: 2, users: ["Alice", "Charlie"] }],
            },
            {
                id: "3",
                user: { name: "Charlie", avatar: "/abstract-figure-charlie.png", color: "#45b7d1" },
                content: "Check out this cool design I made!",
                timestamp: new Date(Date.now() - 1800000),
                reactions: [
                    { emoji: "🔥", count: 4, users: ["Alice", "Bob", "David", "Eve"] },
                    { emoji: "👏", count: 2, users: ["Alice", "David"] },
                ],
                attachments: [
                    { name: "design-mockup.png", url: abstract_design_elements, type: "image", size: 245760 },
                ],
            },
        ],
    },
    {
        userId: "alice",
        unreadCount: 2,
        messages: [
            {
                id: "alice-1",
                user: { name: "Alice", avatar: "/alice-in-wonderland.png", color: "#ff6b6b" },
                content: "Hey! How are you doing?",
                timestamp: new Date(Date.now() - 1800000),
                reactions: [],
            },
            {
                id: "alice-2",
                user: { name: "Alice", avatar: "/alice-in-wonderland.png", color: "#ff6b6b" },
                content: "I wanted to ask you about that project we discussed.",
                timestamp: new Date(Date.now() - 1200000),
                reactions: [],
            },
            {
                id: "alice-1-1",
                user: { name: "You", avatar: "/abstract-geometric-shapes.png", color: "#5865F2" },
                content: "Hey alice, how's the development going?",
                timestamp: new Date(Date.now() - 2400000),
                reactions: [],
            },{
                id: "alice-1-1",
                user: { name: "You", avatar: "/abstract-geometric-shapes.png", color: "#5865F2" },
                content: "Hey alice, how's the chat  going?",
                timestamp: new Date(Date.now() - 2500000),
                reactions: [],
            },
        ],
    },
    {
        userId: "bob",
        unreadCount: 0,
        messages: [
            {
                id: "bob-1",
                user: { name: "You", avatar: "/abstract-geometric-shapes.png", color: "#5865F2" },
                content: "Hey Bob, how's the development going?",
                timestamp: new Date(Date.now() - 2400000),
                reactions: [],
            },  {
                id: "bob-1",
                user: { name: "You", avatar: "/abstract-geometric-shapes.png", color: "#5865F2" },
                content: "Hey Bob, how's the development going?",
                timestamp: new Date(Date.now() - 2400000),
                reactions: [],
            },
            {
                id: "bob-2",
                user: { name: "Bob", avatar: "/bob-portrait.png", color: "#4ecdc4" },
                content: "Going well! Almost finished with the new features.",
                timestamp: new Date(Date.now() - 2100000),
                reactions: [{ emoji: "👍", count: 1, users: ["You"] }],
            },
        ],
    },
];


export const dummyPost =  [
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