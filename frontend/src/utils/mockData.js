export const mockPosts = [
    {
        _id: 'mock-post-1',
        author: {
            _id: 'mock-user-1',
            username: 'CryptoEnthusiast',
            profileImage: null,
        },
        content: 'Bitcoin just hit a new all-time high! 🚀 What do you think is driving this surge?',
        likes: 245,
        comments: 42,
        shares: 18,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isLiked: false,
        reactions: {
            like: 120,
            love: 80,
            fire: 45,
        },
    },
    {
        _id: 'mock-post-2',
        author: {
            _id: 'mock-user-2',
            username: 'BlockchainDev',
            profileImage: null,
        },
        content: 'Just deployed my first smart contract on Ethereum! The future is decentralized 🌐',
        likes: 189,
        comments: 31,
        shares: 12,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        isLiked: false,
        reactions: {
            like: 95,
            love: 60,
            fire: 34,
        },
    },
    {
        _id: 'mock-post-3',
        author: {
            _id: 'mock-user-3',
            username: 'DeFiTrader',
            profileImage: null,
        },
        content: 'The DeFi space is evolving rapidly. What protocols are you most excited about? 💎',
        likes: 312,
        comments: 58,
        shares: 25,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        isLiked: false,
        reactions: {
            like: 150,
            love: 100,
            fire: 62,
        },
    },
];

export const mockVotes = [
    {
        _id: 'mock-vote-1',
        title: 'Should we implement a new tokenomics model?',
        description: 'Proposal to update the current tokenomics to include staking rewards and governance mechanisms.',
        options: [
            { text: 'Yes, implement it', votes: 1250 },
            { text: 'No, keep current model', votes: 450 },
            { text: 'Need more discussion', votes: 300 },
        ],
        totalVotes: 2000,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: {
            _id: 'mock-user-3',
            username: 'DAOGovernor',
        },
        hasVoted: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        _id: 'mock-vote-2',
        title: 'Which feature should we prioritize next?',
        description: 'Community vote on the next major feature development.',
        options: [
            { text: 'Mobile App', votes: 890 },
            { text: 'Advanced Analytics', votes: 650 },
            { text: 'NFT Marketplace', votes: 460 },
        ],
        totalVotes: 2000,
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: {
            _id: 'mock-user-4',
            username: 'ProductLead',
        },
        hasVoted: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

export const mockComments = [
    {
        _id: 'mock-comment-1',
        author: {
            _id: 'mock-user-4',
            username: 'Web3Builder',
            profileImage: null,
        },
        content: 'Great point! I totally agree with this perspective.',
        likes: 12,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        isLiked: false,
    },
    {
        _id: 'mock-comment-2',
        author: {
            _id: 'mock-user-5',
            username: 'CryptoAnalyst',
            profileImage: null,
        },
        content: 'This is exactly what the community needs. Well thought out!',
        likes: 8,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isLiked: false,
    },
];

