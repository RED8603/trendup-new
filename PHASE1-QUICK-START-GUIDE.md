# Phase 1: Web3 Voting - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- ✅ MetaMask or compatible Web3 wallet
- ✅ Ethereum Mainnet connection
- ✅ Some TUP tokens (for testing voting)
- ✅ MongoDB running locally or remotely
- ✅ Node.js 18+ installed

### Backend Setup

1. **Start Backend Server:**
```bash
cd backend
npm run dev
```

2. **Verify Backend is Running:**
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-10-13T...",
  "uptime": 123.45,
  "environment": "development",
  "version": "1.0.0"
}
```

### Frontend Setup

1. **Start Frontend:**
```bash
cd frontend
npm run dev
```

2. **Open Browser:**
```
http://localhost:5173
```

## 🧪 Testing Guide

### 1. Connect Wallet

1. Navigate to `/vote` page
2. Click "Connect Wallet" button
3. Approve MetaMask connection
4. Your wallet address should appear

### 2. Check Token Balance

- Your TUP token balance should display automatically
- Example: "Your Balance: 1000.5 TUP"

### 3. Create Democratic Vote

1. Go to **"Create"** tab
2. Enter vote title (min 2 characters)
3. Click "Submit Vote"
4. Confirm transaction in MetaMask
5. Wait for blockchain confirmation
6. Vote appears in "All Votes" tab

**Backend Storage:**
- Vote data saved to MongoDB
- Transaction hash stored
- User wallet linked to account

### 4. View All Votes

1. Go to **"All Votes"** tab
2. See list of all democratic proposals
3. Each card shows:
   - Vote ID and Title
   - Time remaining
   - Total votes count
   - Yes/No percentages
4. Click any card to see detailed results

### 5. Vote on Proposal

1. Go to **"Vote"** tab
2. Enter a vote ID (e.g., `0`)
3. Proposal details appear
4. Click "Yes" or "No" button
5. Review your voting power
6. Click "Submit Vote"
7. Confirm transaction in MetaMask
8. See success message

**Vote Cooldown:**
- After voting, cooldown period applies
- Timer shows: "Wait 6d 23h 45m"
- Cannot vote again until cooldown expires

### 6. HODL Voting

1. Go to **"HODL"** tab
2. See current HODL status
3. Check if sale restrictions are active
4. Review your balance
5. Click "Vote for HODL"
6. Confirm transaction
7. Cooldown timer starts

**HODL Features:**
- Shows HODL activation timestamp
- Displays days until activation
- Shows sale restriction status
- Real-time balance update

## 📊 API Testing

### Using the Test File

1. **Install REST Client Extension** (VS Code)
   - Extension ID: `humao.rest-client`

2. **Open Test File:**
   ```
   backend/src/modules/voting/test-voting-api.http
   ```

3. **Run Tests:**
   - Click "Send Request" above each request
   - Check responses in the panel

### Example API Calls

**Create Vote:**
```bash
curl -X POST http://localhost:3001/api/v1/voting/democratic/create \
  -H "Content-Type: application/json" \
  -d '{
    "voteId": 0,
    "title": "Test Vote",
    "creator": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "blockchainTxHash": "0x1234...",
    "expiryTimestamp": 1729180800
  }'
```

**Get All Votes:**
```bash
curl http://localhost:3001/api/v1/voting/democratic?page=1&limit=10
```

**Get User History:**
```bash
curl http://localhost:3001/api/v1/voting/user/history/0x742d35Cc6634C0532925a3b844Bc454e4438f44e
```

## 🔍 Troubleshooting

### Issue: Wallet Not Connecting
**Solution:**
- Check MetaMask is installed
- Make sure you're on Ethereum Mainnet
- Refresh page and try again
- Check browser console for errors

### Issue: Transaction Failing
**Solution:**
- Ensure you have enough ETH for gas
- Check you have TUP tokens
- Verify vote ID exists (for voting)
- Check cooldown period hasn't expired

### Issue: Balance Shows 0
**Solution:**
- Make sure wallet is connected
- Verify you have TUP tokens
- Check correct network (Mainnet)
- Token address: `0x52c06a62d9495bee1dadf2ba0f5c0588a4f3c14c`

### Issue: Backend API Errors
**Solution:**
- Check MongoDB is running
- Verify backend server is started
- Check `.env` configuration
- Look at backend console for errors

### Issue: Vote Not Appearing
**Solution:**
- Wait for blockchain confirmation
- Refresh the "All Votes" tab
- Check transaction on Etherscan
- Verify backend received the request

## 🛠️ Development Tools

### Browser Console
```javascript
// Check wallet connection
window.ethereum.selectedAddress

// Check network
window.ethereum.chainId // Should be "0x1" for mainnet

// Manual contract call (in browser console)
// (Advanced - requires wagmi setup)
```

### Backend Logs
```bash
# View backend logs
cd backend
tail -f logs/combined.log

# View errors only
tail -f logs/error.log
```

### MongoDB Queries
```javascript
// Connect to MongoDB
mongosh

// Use database
use trendup

// Check democratic votes
db.democraticvotes.find().pretty()

// Check vote records
db.voterecords.find().pretty()

// Check HODL votes
db.hodlvotes.find().pretty()

// Count votes
db.democraticvotes.countDocuments()
```

## 📈 Expected Flow

### Happy Path: Complete Voting Flow

1. **User connects wallet** ✅
   - MetaMask popup appears
   - Connection approved
   - Balance displays

2. **Create proposal** ✅
   - Enter: "Should we reduce fees?"
   - Transaction sent to blockchain
   - Backend stores vote data
   - Vote ID: 0 assigned

3. **View proposal** ✅
   - Navigate to "All Votes"
   - See new proposal card
   - Shows "0 votes" initially

4. **Vote on proposal** ✅
   - Go to "Vote" tab
   - Enter vote ID: 0
   - Select "Yes"
   - Confirm transaction
   - Success toast appears

5. **View results** ✅
   - Back to "All Votes"
   - See "1 votes" total
   - Shows "100% Yes"
   - Click card for details

6. **Cooldown enforced** ✅
   - Try to vote again
   - See cooldown timer
   - Button disabled
   - "Wait 6d 23h 45m" message

## 🎯 Testing Checklist

### Frontend Tests
- [ ] Wallet connection works
- [ ] Balance displays correctly
- [ ] Can create democratic vote
- [ ] Vote appears in list
- [ ] Can vote on proposal
- [ ] Results update in real-time
- [ ] Cooldown timer counts down
- [ ] HODL voting works
- [ ] Error messages display properly
- [ ] Loading states show

### Backend Tests
- [ ] POST /democratic/create returns 201
- [ ] POST /democratic/vote returns 201
- [ ] GET /democratic/:id returns vote data
- [ ] GET /democratic returns paginated list
- [ ] POST /hodl stores vote
- [ ] GET /hodl/stats returns statistics
- [ ] Duplicate vote returns 409 error
- [ ] Invalid wallet returns 400 error

### Integration Tests
- [ ] Vote created on blockchain appears in UI
- [ ] Vote submission updates backend
- [ ] User history shows all votes
- [ ] Wallet to user linking works
- [ ] Real-time updates work
- [ ] Mobile responsive

## 📱 Mobile Testing

### Responsive Breakpoints
- **Mobile:** < 600px
- **Tablet:** 600px - 960px
- **Desktop:** > 960px

### Mobile-Specific Features
- Tab scroll navigation
- Compact vote cards
- Touch-friendly buttons
- Readable text sizes
- No horizontal scroll

## 🔐 Security Notes

### Frontend
- ✅ Never store private keys
- ✅ All transactions require wallet approval
- ✅ Validate inputs before sending
- ✅ Show transaction details to user

### Backend
- ✅ Validate wallet addresses
- ✅ Verify transaction hashes
- ✅ Prevent duplicate votes
- ✅ Sanitize error messages

## 📚 Resources

### Documentation
- [Wagmi Docs](https://wagmi.sh)
- [Viem Docs](https://viem.sh)
- [MetaMask Docs](https://docs.metamask.io)
- [TrendUp Token Contract](https://etherscan.io/address/0x52c06a62d9495bee1dadf2ba0f5c0588a4f3c14c)

### Support
- Check `PHASE1-WEB3-VOTING-IMPLEMENTATION.md` for technical details
- Review `backend/src/modules/voting/test-voting-api.http` for API examples
- See component code for implementation details

## 🎉 Success Indicators

You'll know Phase 1 is working when:

1. ✅ Wallet connects and shows balance
2. ✅ Can create votes on blockchain
3. ✅ Votes appear in list with real data
4. ✅ Can vote and see percentages update
5. ✅ Cooldown period enforces properly
6. ✅ HODL voting works
7. ✅ Backend stores all vote data
8. ✅ User history shows correctly
9. ✅ No console errors
10. ✅ Mobile UI works smoothly

---

**Ready to test?** Start both servers and follow the testing guide! 🚀

