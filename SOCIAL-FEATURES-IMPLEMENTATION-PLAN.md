# TrendUp Social Platform - Complete Implementation Plan

## Overview
Build a feature-rich social platform with innovative engagement mechanics, reputation system, and algorithmic content discovery. Each phase is independently testable.

---

## ✅ Phase 1: Core Post System & Database Schema (COMPLETED)

### Backend Models

**Post Model** (`backend/src/modules/social/models/Post.model.js`) ✅
- Fields: userId, content (text), postType (text/image/video/poll/prediction), mediaUrls[], category, hashtags[], status (pending/approved/flagged/removed), visibility (public/followers/private)
- Engagement: likesCount, commentsCount, sharesCount, viewsCount, engagementScore (calculated)
- Timestamps: createdAt, updatedAt, scheduledAt, expiresAt (for predictions)
- Indexes: userId, category, hashtags, createdAt, engagementScore
- **Features**: Hashtag auto-extraction, soft delete, trending posts method

**Reaction Model** (`backend/src/modules/social/models/Reaction.model.js`) ✅
- Multi-dimensional reactions: BULLISH 🚀, BEARISH 📉, FIRE 🔥, GEM 💎, MOON 🌙, RUGGED 💀, WAGMI, NGMI, ROCKET 🎯, DIAMOND 💎, THINKING 🤔, HEART ❤️, LIKE 👍, LAUGH 😂, SURPRISED 😮, ANGRY 😡, SAD 😢, CELEBRATE 🎉, CLAP 👏, HANDS 🙌
- Fields: userId, postId/commentId, reactionType, weight (calculated from user karma)
- Aggregated reaction counts on posts with weighted scores
- **Features**: Weight calculation based on user karma, unique constraints

**Comment Model** (`backend/src/modules/social/models/Comment.model.js`) ✅
- Fields: userId, postId, parentCommentId (for nested replies), content, likesCount, replyCount
- Support for threaded conversations (max 3 levels deep)
- **Features**: Level calculation, reply counting, soft delete

### Backend Routes & Controllers ✅

**POST /api/v1/social/posts** - Create post (text/image/video/poll/prediction)
**GET /api/v1/social/posts** - Get feed (with pagination, filters)
**GET /api/v1/social/posts/:id** - Get single post with comments
**PATCH /api/v1/social/posts/:id** - Update own post
**DELETE /api/v1/social/posts/:id** - Delete own post
**POST /api/v1/social/posts/:id/react** - Add/remove reaction
**GET /api/v1/social/posts/:id/reactions** - Get reaction breakdown

Validation: Content length limits, media file types/sizes, hashtag format

### Testing Results ✅
- All models created and tested successfully
- Hashtag extraction working correctly
- Database connectivity verified
- Model relationships functioning properly

---

## 🔄 Phase 2: Karma & Reputation System (IN PROGRESS)

### Karma Model (`backend/src/modules/social/models/Karma.model.js`)
- Fields: userId, totalKarma, karmaHistory[] (with reasons), level, badges[], multiplier
- Karma levels: Newbie (0-100), Explorer (100-500), Contributor (500-1500), Influencer (1500-5000), Legend (5000-15000), Titan (15000+)
- Each level unlocks new reactions and badges

### Karma Service (`backend/src/modules/social/services/karma.service.js`)
```
Karma Earning Rules:
- Post receives reaction: +1-5 karma (weighted by reactor's level)
- Post receives comment: +2 karma
- Post is shared: +5 karma
- Post trends (high engagement): +20-100 karma
- Comment receives reactions: +1-3 karma
- Daily active bonus: +5 karma
- Prediction correct: +50-500 karma (based on stakes)
- Prediction wrong: -25% of staked karma

Karma Weight Formula:
reactionWeight = baseValue * (1 + reactorKarmaLevel * 0.1)
```

### Badge System
- Badges for milestones: First Post, 100 Reactions, Viral Post (10k views), Prediction Master (10 correct), etc.
- Display badges on user profiles and next to usernames

### User Model Updates
Add fields: karmaScore, karmaLevel, badges[], unlockedReactions[]

---

## 📋 Phase 3: Follow/Follower System

### Follow Model (`backend/src/modules/social/models/Follow.model.js`)
- Fields: followerId, followingId, createdAt
- Compound index on (followerId, followingId) for uniqueness

### Routes
**POST /api/v1/social/follow/:userId** - Follow user
**DELETE /api/v1/social/follow/:userId** - Unfollow user
**GET /api/v1/social/followers/:userId** - Get followers list
**GET /api/v1/social/following/:userId** - Get following list
**GET /api/v1/social/suggestions** - Get follow suggestions (based on interests, mutual follows)

### User Stats Updates
Update User model methods to increment/decrement followersCount and followingCount atomically

---

## 💬 Phase 4: Comments & Nested Replies

### Backend
**POST /api/v1/social/posts/:postId/comments** - Add comment
**GET /api/v1/social/posts/:postId/comments** - Get comments (paginated, nested structure)
**POST /api/v1/social/comments/:commentId/reply** - Reply to comment
**PATCH /api/v1/social/comments/:id** - Edit comment
**DELETE /api/v1/social/comments/:id** - Delete comment
**POST /api/v1/social/comments/:id/react** - React to comment

### Frontend Components
- `CommentThread.jsx` - Nested comment display with expand/collapse
- `CommentInput.jsx` - Rich text input with emoji picker
- Real-time comment count updates

---

## 🏷️ Phase 5: Categories, Hashtags & Topics

### Category System
Predefined categories: Crypto News, DeFi, NFTs, Trading Signals, Market Analysis, Memes, Technology, Tutorials, AMA, Events

### Hashtag Extraction
Auto-extract hashtags from post content, store in array, create indexes for search

### Topic/Community Model (future-ready structure)
- Basic fields: name, description, creatorId, membersCount, category, rules
- For now: read-only, populated by admins
- Later: user-created communities with moderation

### Interest Tracking
Track user interests based on:
- Categories of posts they interact with
- Hashtags they use/engage with
- Topics they view
Store in User model: interests[] with weights

---

## 🧠 Phase 6: Algorithmic Feed System

### Feed Service (`backend/src/modules/social/services/feed.service.js`)

**Algorithm Components:**
```javascript
Post Score = (
  engagementScore * 0.3 +
  recencyScore * 0.2 +
  interestMatchScore * 0.25 +
  followingScore * 0.15 +
  authorKarmaScore * 0.1
)

engagementScore = (reactions * 2 + comments * 3 + shares * 5) / timeDecay
recencyScore = exponential decay (100 at 0 hours, 50 at 6 hours, 10 at 24 hours)
interestMatchScore = overlap between user interests and post category/hashtags
followingScore = 100 if author is followed, 0 otherwise (boosted)
authorKarmaScore = (authorKarma / 10000) * 100 (capped at 100)
```

### Feed Endpoints
**GET /api/v1/social/feed/for-you** - Personalized algorithmic feed
**GET /api/v1/social/feed/following** - Chronological from followed users
**GET /api/v1/social/feed/trending** - Top posts by engagement (24h/7d/30d)
**GET /api/v1/social/feed/category/:category** - Category-specific feed
**GET /api/v1/social/feed/hashtag/:hashtag** - Hashtag-specific feed

### Caching Strategy
- Redis cache for feed results (5-minute TTL)
- Pre-compute trending posts every 15 minutes
- User interest profiles cached for 1 hour

---

## 📸 Phase 7: Media Upload (Images & Videos)

### Backend Media Service
**POST /api/v1/social/media/upload** - Upload to S3
- Image: Resize/optimize (max 2MB, multiple sizes for responsive)
- Video: Validate format, duration (max 60 seconds for now), size (max 50MB)
- Generate thumbnails for videos
- Return media URLs

### S3 Folder Structure
```
posts/images/{userId}/{postId}/{filename}
posts/videos/{userId}/{postId}/{filename}
posts/thumbnails/{userId}/{postId}/{filename}
```

### Frontend
- `MediaUploader.jsx` - Drag-drop upload with preview
- `VideoPlayer.jsx` - Custom player with controls
- `ImageGallery.jsx` - Multi-image posts with carousel

---

## 🗳️ Phase 8: Poll & Prediction Posts

### Poll Features
- Create poll with 2-6 options
- Vote once (unless allowMultipleVotes enabled)
- Real-time vote percentage display
- Expiry date/time
- Anonymous voting

### Prediction Features
- User stakes karma on prediction
- Set target date/event
- Other users can agree/disagree (also stake karma)
- Resolution: Admin/moderator marks outcome
- Karma distribution: Winners split losers' karma proportionally

### Routes
**POST /api/v1/social/polls/:pollId/vote** - Vote on poll
**GET /api/v1/social/polls/:pollId/results** - Get results
**POST /api/v1/social/predictions/:predictionId/stake** - Stake on prediction
**POST /api/v1/social/predictions/:predictionId/resolve** - Resolve prediction (moderators only)

---

## 🛡️ Phase 9: Content Moderation System

### Flag Model (`backend/src/modules/social/models/Flag.model.js`)
- Fields: postId/commentId, reporterId, flagType (spam/inappropriate/misinformation/scam/harassment/other), reason, status (pending/reviewed/resolved), reviewedBy, reviewedAt
- Flag types with descriptions for user selection

### Moderation Queue
**GET /api/v1/moderation/queue** - Get flagged content (moderator/admin only)
**POST /api/v1/moderation/review/:flagId** - Review flag (approve/reject/remove content)
**GET /api/v1/moderation/stats** - Moderation statistics

### Auto-Moderation (Future AI filters placeholder)
- Profanity filter (basic word list)
- Spam detection (duplicate content, rapid posting)
- Link validation (malicious URL check)

### User Actions
**POST /api/v1/social/posts/:postId/flag** - Flag post
**POST /api/v1/social/comments/:commentId/flag** - Flag comment

### Moderator Powers (for users with role: 'moderator')
- Review flagged content
- Remove posts/comments
- Warn/suspend users (add to User model: warnings[], suspendedUntil)

---

## 🎨 Phase 10: Frontend - Post Creation & Display

### Components
**`CreatePostModal.jsx`** - Modal with tabs for text/image/video/poll/prediction
- Rich text editor with hashtag autocomplete
- Category selector dropdown
- Media upload zone
- Poll option builder (add/remove options)
- Prediction builder (text + date picker + karma stake slider)

**`PostCard.jsx`** - Unified post display
- Author info with karma level badge
- Post content with hashtag highlighting
- Media display (image gallery / video player)
- Poll results with animated bars
- Prediction status indicator
- Multi-dimensional reaction bar (horizontally scrollable icons)
- Comment count, share button
- Timestamp with "trending" indicator

**`ReactionPicker.jsx`** - Popup reaction selector
- Show available reactions based on user karma level
- Display locked reactions with level requirement
- Animated reaction selection

**`PollCard.jsx`** - Poll-specific display
- Vote options with progress bars
- Vote button / "Already voted" state
- Expiry countdown

**`PredictionCard.jsx`** - Prediction-specific display
- Prediction details and stakes
- Agree/Disagree buttons with karma stake input
- Resolution status (pending/correct/incorrect)
- Participant count and karma pool

---

## 📱 Phase 11: Frontend - Feed Views

### Feed Pages
**`FeedLayout.jsx`** - Main layout with tabs
- For You (algorithmic)
- Following (chronological)
- Trending (engagement-based)
- Explore (by category)

**`InfiniteScrollFeed.jsx`** - Lazy loading with intersection observer
- Load more on scroll
- Pull-to-refresh
- Loading skeletons

**`FilterBar.jsx`** - Category/hashtag/time range filters
- Category chips (all/crypto/defi/nfts/etc.)
- Trending hashtags sidebar
- Time filter (today/week/month) for trending

---

## 💬 Phase 12: Frontend - Comments & Interactions

### Components
**`CommentSection.jsx`** - Full comment thread
- Load comments on demand (don't auto-load for performance)
- Nested reply structure (max 3 levels)
- Reaction support on comments
- Sort by: Top (most reactions), Newest, Oldest

**`CommentInput.jsx`** - Comment composer
- Emoji picker
- Mention autocomplete (@username)
- Character counter (max 500 chars)

**`ShareModal.jsx`** - Share post functionality
- Copy link
- Share to Twitter/Telegram (with tracking for karma rewards)

---

## 🏆 Phase 13: Frontend - User Profile & Karma

### Profile Updates
**`UserProfile.jsx`** enhancements:
- Display karma score with level badge
- Show earned badges in grid
- Post/Comment tabs
- Interests/categories tags
- Karma history timeline (major events)

**`KarmaDisplay.jsx`** - Visual karma indicator
- Progress bar to next level
- Tooltip showing level perks
- Animated on karma gain

**`BadgeShowcase.jsx`** - Badge gallery with tooltips explaining how each was earned

---

## 👥 Phase 14: Frontend - Follow System UI

### Components
**`FollowButton.jsx`** - Smart follow/unfollow button
- Show follow status
- Loading state
- Optimistic UI updates

**`FollowersList.jsx`** / **`FollowingList.jsx`** - User lists with search
- Show karma levels
- Quick follow/unfollow actions
- Link to profiles

**`SuggestedUsers.jsx`** - Follow suggestions sidebar
- Based on interests and mutual follows
- Dismiss suggestions

---

## 🔌 Phase 15: API Integration & State Management

### React Query Hooks
Create hooks in `frontend/src/api/slices/socialApi.js`:
- usePosts, useCreatePost, useUpdatePost, useDeletePost
- useReactToPost, useFeed
- useComments, useCreateComment
- useFollowUser, useUnfollowUser
- useKarmaStats, useBadges
- useFlagContent

### Zustand Store
Update store for:
- Current user karma/level
- Unlocked reactions
- Feed preferences (selected categories)
- Draft posts (persist in localStorage)

---

## ⚡ Phase 16: Real-time Features with Socket.io

### Socket.io Setup & Integration

**Backend Socket Server** (`backend/src/core/socket/socket.js`)
- Initialize Socket.io with Express server
- Authentication middleware for socket connections
- Room management (post rooms, user rooms)
- Event handlers for all real-time features

### Real-time Events Implementation

**1. Real-time Reactions**
- Event: `post:reaction:add` / `post:reaction:remove`
- Broadcast to all users viewing the post
- Update reaction counts instantly
- Show animated reaction flying effect on UI

**2. Real-time Comments**
- Event: `post:comment:new` / `comment:reply:new`
- Broadcast new comments to post viewers
- Update comment count in real-time
- Show "typing..." indicator when users are composing comments

**3. Live Poll Results**
- Event: `poll:vote:cast`
- Broadcast updated vote percentages immediately
- Animated progress bar updates
- Show real-time vote count changes

**4. Karma Gain Animations**
- Event: `user:karma:earned`
- Personal notification to user who earned karma
- Animated karma counter with +X popup
- Trigger confetti/celebration effects on level-up
- Real-time badge unlock notifications

**5. Notification System Foundation**
- Event: `notification:new`
- Types: reaction, comment, follow, mention, karma milestone, badge earned
- Real-time notification badge counter
- Toast notifications for important events
- Sound effects (optional, user-configurable)

### Socket Rooms Strategy
```javascript
// User joins their personal room for notifications
socket.join(`user:${userId}`)

// User joins post room when viewing a post
socket.join(`post:${postId}`)

// User joins feed room for general updates
socket.join(`feed:global`)
```

### Backend Implementation

**Socket Event Handlers:**
- `connection` - Authenticate and join user room
- `post:view` - Join post room
- `post:leave` - Leave post room
- `typing:start` / `typing:stop` - Comment typing indicators
- `disconnect` - Cleanup and leave rooms

**Service Integration:**
- Emit socket events from existing services (post.service, reaction.service, karma.service)
- Inject io instance into services for event broadcasting
- Queue system for high-traffic events (Redis pub/sub)

### Frontend Socket Client

**Socket Context** (`frontend/src/context/SocketContext.jsx`)
- Initialize socket connection with auth token
- Reconnection logic with exponential backoff
- Event listeners management
- Connection status indicator

**Socket Hooks** (`frontend/src/hooks/useSocket.js`)
- `useSocketEvent` - Subscribe to specific events
- `usePostRoom` - Auto join/leave post rooms
- `useTypingIndicator` - Handle typing status

**Real-time UI Components:**
- `RealtimeReactionCounter.jsx` - Animated reaction counts
- `LiveCommentFeed.jsx` - Streaming comments
- `KarmaGainToast.jsx` - Karma notification popups
- `TypingIndicator.jsx` - "User is typing..." display
- `ConnectionStatus.jsx` - Socket connection indicator

### Notification System (Phase 16.5)

**Notification Model** (`backend/src/modules/social/models/Notification.model.js`)
- Fields: userId, type, title, message, metadata (postId, commentId, etc.), read, createdAt
- Types: reaction, comment, reply, follow, mention, karma_milestone, badge_earned, prediction_resolved
- Indexes on userId and createdAt for efficient queries

**Notification Routes:**
- GET `/api/v1/notifications` - Get user notifications (paginated)
- PATCH `/api/v1/notifications/:id/read` - Mark as read
- PATCH `/api/v1/notifications/read-all` - Mark all as read
- DELETE `/api/v1/notifications/:id` - Delete notification
- GET `/api/v1/notifications/unread-count` - Get unread count

**Notification Service Logic:**
- Create notification in DB + emit socket event simultaneously
- Batch notifications (e.g., "5 people reacted to your post")
- User preferences for notification types (enable/disable)
- Notification retention (auto-delete after 30 days)

**Frontend Notification Center:**
- `NotificationBell.jsx` - Bell icon with unread badge
- `NotificationDropdown.jsx` - Dropdown with recent notifications
- `NotificationItem.jsx` - Individual notification card
- Link directly to relevant post/comment
- Mark as read on view
- Infinite scroll for notification history

---

## 🧪 Phase 17: Testing & Polish

### Backend Tests
- Post CRUD operations
- Reaction weighting calculations
- Karma earning/deduction
- Feed algorithm accuracy
- Follow/unfollow atomicity
- Flag and moderation workflows

### Frontend Tests
- Post creation flows (all types)
- Reaction interactions
- Comment threading
- Feed filtering and sorting
- Media upload validation

### End-to-End Testing
- Create post → Receive reactions → Gain karma → Unlock reaction
- Follow user → See their posts in feed
- Flag post → Moderator review → Content removal
- Create prediction → Stake karma → Resolve → Distribute rewards

### Performance Optimization
- Lazy load images/videos
- Virtualize long feeds
- Debounce search/filter inputs
- Optimize DB queries (add missing indexes)
- Implement Redis caching for hot data

---

## 🚀 Future Integrations (Room for Expansion)

- **Pages & Groups**: Community spaces with their own feeds
- **Token Rewards**: Convert karma to TrendUp tokens
- **AI Moderation**: Automated content filtering
- **Live Streaming**: Long-form video content
- **Direct Messaging**: Private conversations
- **Notifications**: Push notifications for interactions
- **Analytics Dashboard**: User insights and post performance
- **NFT Integration**: Mint posts as NFTs
- **DAO Governance**: Vote on platform decisions with staked tokens

---

## 🛠️ Technical Stack Summary

**Backend:**
- Node.js + Express
- MongoDB (Mongoose models)
- Redis (caching)
- S3 (media storage)
- Socket.io (real-time)

**Frontend:**
- React + Material-UI
- React Query (API state)
- Zustand (global state)
- Framer Motion (animations)

**Key Files Created:**
- 15+ new models (Post, Comment, Reaction, Karma, Follow, Flag, Poll, Prediction, etc.)
- 50+ API endpoints across multiple route files
- 30+ React components
- 5+ service files with business logic
- Feed algorithm implementation
- Karma calculation system

---

## 📊 Progress Tracking

### ✅ Completed Phases:
- **Phase 1**: Core Post System & Database Schema (100% Complete)
  - ✅ Post, Reaction, Comment models with full schemas
  - ✅ CRUD API endpoints with authentication
  - ✅ Validation, services, and controllers
  - ✅ Server integration and testing
  - ✅ MongoDB and Redis connections working

- **Phase 2**: Karma & Reputation System (100% Complete)
  - ✅ Karma Model with 7 levels (NEWBIE → TITAN)
  - ✅ Badge System with achievements and rarity
  - ✅ Unlockable Reactions based on karma level
  - ✅ Weighted Reactions system (1x to 4x multiplier)
  - ✅ Karma earning/deduction logic
  - ✅ Level progression and privilege system
  - ✅ Complete API endpoints and controllers
  - ✅ All endpoints tested and working

- **Phase 3**: Follow/Follower System (100% Complete)
  - ✅ Follow Model with relationships and status tracking
  - ✅ Follow/unfollow functionality with limits and validation
  - ✅ User discovery and suggestions algorithm
  - ✅ Follow statistics and trending users
  - ✅ Mute/block functionality for user management
  - ✅ Follow feed for personalized content
  - ✅ Complete API endpoints and controllers
  - ✅ All endpoints tested and working

- **Phase 4**: Comments & Nested Replies (100% Complete)
  - ✅ Comment Model with threading support (up to 3 levels)
  - ✅ Comment CRUD operations with validation
  - ✅ Nested replies and comment threading
  - ✅ Comment reactions and engagement tracking
  - ✅ Comment moderation and flagging system
  - ✅ Comment analytics and trending system
  - ✅ Comment search and filtering
  - ✅ Complete API endpoints and controllers
  - ✅ All endpoints tested and working

- **Phase 5**: Categories, Hashtags & Topics (100% Complete)
  - ✅ Category Model with hierarchy and organization
  - ✅ Hashtag Model with trending and analytics
  - ✅ Topic Model with community features
  - ✅ Complete CRUD operations for all models
  - ✅ Search and discovery functionality
  - ✅ Statistics and analytics
  - ✅ Trending and popular content
  - ✅ All API endpoints working and properly protected
  - ✅ All endpoints tested and working

- **Phase 6**: Algorithmic Feed System (100% Complete)
  - ✅ Feed Model with caching and personalization
  - ✅ Advanced scoring algorithm with multiple factors
  - ✅ Multiple feed types (Following, Trending, Category, Topic, Hashtag, Discover)
  - ✅ Personalized content delivery based on user interests
  - ✅ Feed preferences and customization
  - ✅ Feed recommendations and discovery
  - ✅ Performance metrics and statistics
  - ✅ All API endpoints working and properly protected
  - ✅ All endpoints tested and working

- **Phase 7**: Media Upload (Images & Videos) (100% Complete)
  - ✅ Media Model with comprehensive metadata and organization
  - ✅ AWS S3 integration for cloud storage
  - ✅ Image processing with thumbnails and optimization
  - ✅ Video processing with compression and streaming support
  - ✅ File upload middleware with multer and validation
  - ✅ Media management and organization features
  - ✅ Search and discovery functionality
  - ✅ Statistics and analytics
  - ✅ All API endpoints working and properly protected
  - ✅ All endpoints tested and working

### 🔄 Current Phase:
- **Phase 8**: Poll & Prediction Posts (Ready to Start)

### 📋 Upcoming Phases:
- Phase 9: Content Moderation System
- Phase 10: Frontend - Post Creation & Display
- Phase 11: Frontend - Feed Views
- Phase 12: Frontend - Comments & Interactions
- Phase 13: Frontend - User Profile & Karma
- Phase 14: Frontend - Follow System UI
- Phase 15: API Integration & State Management
- Phase 16: Real-time Features with Socket.io
- Phase 17: Testing & Polish

---

## 🎯 Next Steps

1. **Start Phase 8**: Implement Poll & Prediction Posts
2. **Create Poll Model**: Interactive voting system
3. **Build Prediction System**: Crypto price predictions
4. **Create Poll API**: Endpoints for polls and predictions
5. **Test Poll System**: Verify voting and prediction functionality

---

*Last Updated: October 18, 2025*
*Status: Phase 1, 2, 3, 4, 5, 6 & 7 Complete, Phase 8 Ready to Begin*
