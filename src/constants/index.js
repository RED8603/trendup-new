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