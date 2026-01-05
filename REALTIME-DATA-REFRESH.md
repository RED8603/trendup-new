# Real-Time Data Refresh System

This document explains how real-time data updates work in the TrendUp application without requiring page refreshes.

---

## Overview

The application uses **RTK Query polling** to automatically fetch fresh data at regular intervals. This provides a seamless real-time experience for users viewing crypto news and market data.

---

## Components with Real-Time Updates

### 1. Crypto Market List (Price Updates)

**File:** `frontend/src/pages/Home/CryptoMarketList/CryptoMarketList.jsx`

**Update Interval:** Every **15 seconds**

**Features:**
- ✅ Automatic polling every 15 seconds
- ✅ Countdown timer showing seconds until next update
- ✅ Manual refresh button for instant updates
- ✅ Price change animations (green flash for up, red for down)
- ✅ Trending arrows showing price direction
- ✅ Live indicator with "Updating..." status

**Configuration:**
```javascript
const { data, isLoading, error, isFetching, refetch } = useGetCryptoMarketQuery(undefined, {
    pollingInterval: 15000, // 15 seconds
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
});
```

---

### 2. Crypto News List

**File:** `frontend/src/pages/Home/CryptoNewsList/CryptoNewsList.jsx`

**Update Interval:** Every **30 seconds**

**Features:**
- ✅ Automatic polling every 30 seconds
- ✅ "NEW" badge on fresh news items (visible for 5 seconds)
- ✅ Live indicator with timestamp
- ✅ Smooth animations for new items entering

**Configuration:**
```javascript
const { data, isLoading, error, isFetching } = useGetCryptoNewsQuery(undefined, {
    pollingInterval: 30000, // 30 seconds
    skip: isGuestMode,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
});
```

---

## RTK Query Configuration

### Base API Setup

**File:** `frontend/src/api/coinGeckoApi.js`

```javascript
export const cryptoMarketApi = createApi({
    reducerPath: "cryptoMarketApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.coingecko.com/api/v3/",
    }),
    keepUnusedDataFor: 10, // Cache for only 10 seconds
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    endpoints: () => ({}),
});
```

### Store Setup

**File:** `frontend/src/store/srore.js`

```javascript
import { setupListeners } from "@reduxjs/toolkit/query";

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);
```

---

## How It Works

### Polling Mechanism

1. **Initial Load:** Data is fetched when the component mounts
2. **Polling:** RTK Query automatically refetches data at the specified interval
3. **Background Updates:** Updates happen silently without blocking the UI
4. **Visual Feedback:** Components show "Updating..." status during fetch

### Automatic Refetch Triggers

| Trigger | Description |
|---------|-------------|
| `pollingInterval` | Fetches data at regular intervals (15s for market, 30s for news) |
| `refetchOnFocus` | Refetches when user returns to the browser tab |
| `refetchOnReconnect` | Refetches when internet connection is restored |
| `refetchOnMountOrArgChange` | Refetches when component mounts or query args change |

### Price Change Detection

```javascript
// Track price changes
useEffect(() => {
    if (data) {
        const changes = {};
        Object.entries(data).forEach(([coin, info]) => {
            const prevPrice = previousPricesRef.current[coin];
            if (prevPrice !== undefined && prevPrice !== info.usd) {
                changes[coin] = info.usd > prevPrice ? "up" : "down";
            }
        });
        
        if (Object.keys(changes).length > 0) {
            setPriceChanges(changes);
            // Clear indicators after 2 seconds
            setTimeout(() => setPriceChanges({}), 2000);
        }
        
        previousPricesRef.current = newPrices;
    }
}, [data]);
```

---

## Visual Indicators

### Live Status Indicator
- 🟢 **Green dot** - Connected and live
- 🟠 **Orange dot (pulsing)** - Currently updating

### Price Change Animations
- 📈 **Green flash + up arrow** - Price increased
- 📉 **Red flash + down arrow** - Price decreased

### News Updates
- 🆕 **"NEW" badge** - Fresh news item (visible for 5 seconds)
- ✨ **Green border highlight** - New item indication

---

## API Endpoints

### CoinGecko (Market Data)
```
GET https://api.coingecko.com/api/v3/simple/price
    ?ids=bitcoin,ethereum,solana,...
    &vs_currencies=usd
    &include_24hr_change=true
```

### Crypto News (via Backend)
```
GET /api/v1/news/crypto
```
Backend proxies to CryptoPanic API with Redis caching (15 min cache).

---

## Customizing Update Intervals

To change the polling interval, modify the `pollingInterval` value in the respective component:

```javascript
// For faster updates (not recommended - may hit rate limits)
pollingInterval: 10000, // 10 seconds

// For slower updates (saves API calls)
pollingInterval: 60000, // 60 seconds
```

**Note:** CoinGecko free API has rate limits. Polling too frequently may result in blocked requests.

---

## Troubleshooting

### Data not updating?

1. **Check browser console** for API errors
2. **Verify backend is running** on port 3001
3. **Check network tab** for failed requests
4. **Try manual refresh** using the refresh button

### Rate limiting?

CoinGecko free tier has limits. If you see 429 errors:
- Increase `pollingInterval` to 30000 or higher
- Consider using CoinGecko Pro API

---

## Summary

| Feature | Market Data | Crypto News |
|---------|-------------|-------------|
| Update Interval | 15 seconds | 30 seconds |
| Manual Refresh | ✅ Yes | ❌ No |
| Countdown Timer | ✅ Yes | ❌ No |
| Change Indicators | ✅ Price arrows | ✅ NEW badge |
| Refetch on Focus | ✅ Yes | ✅ Yes |
| Refetch on Reconnect | ✅ Yes | ✅ Yes |
