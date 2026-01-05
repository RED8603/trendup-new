module.exports = {
    count: 5,
    next: null,
    previous: null,
    results: [
        {
            kind: "news",
            domain: "coindesk.com",
            source: { title: "CoinDesk", region: "en", path: null, domain: "coindesk.com" },
            title: "Bitcoin Surges Past $100k as Institutional Adoption Grows (Mock Data)",
            published_at: new Date().toISOString(),
            slug: "bitcoin-surges-past-100k",
            id: 1,
            url: "https://coindesk.com",
            created_at: new Date().toISOString(),
            votes: { negative: 0, positive: 10, important: 5, liked: 15, disliked: 0, lol: 2, toxic: 0, saved: 5, comments: 0 },
        },
        {
            kind: "news",
            domain: "cointelegraph.com",
            source: { title: "CoinTelegraph", region: "en", path: null, domain: "cointelegraph.com" },
            title: "Ethereum 2.0 Final Upgrade Completed Successfully (Mock Data)",
            published_at: new Date().toISOString(),
            slug: "ethereum-upgrade-complete",
            id: 2,
            url: "https://cointelegraph.com",
            created_at: new Date().toISOString(),
            votes: { negative: 1, positive: 20, important: 10, liked: 25, disliked: 0, lol: 0, toxic: 0, saved: 8, comments: 2 },
        },
        {
            kind: "news",
            domain: "decrypt.co",
            source: { title: "Decrypt", region: "en", path: null, domain: "decrypt.co" },
            title: "Solana Transaction Speed Breaks Records (Mock Data)",
            published_at: new Date().toISOString(),
            slug: "solana-speed-record",
            id: 3,
            url: "https://decrypt.co",
            created_at: new Date().toISOString(),
            votes: { negative: 2, positive: 15, important: 3, liked: 10, disliked: 1, lol: 1, toxic: 0, saved: 2, comments: 1 },
        }
    ]
};
