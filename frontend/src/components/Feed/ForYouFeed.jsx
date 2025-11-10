import React, { useMemo } from 'react';
import { Box, Container, useTheme, useMediaQuery, Typography, Button } from '@mui/material';
import { useGetForYouFeedQuery, useGetUserPostsQuery } from '@/api/slices/socialApi';
import { useSelector } from 'react-redux';
import FeedList from './FeedList';
import CreatePost from '../CreatePost/CreatePost';
import Loading from '../common/loading';
import { useGuestAwareApi } from '@/hooks/useGuestAwareApi';

const ForYouFeed = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isGuestMode } = useSelector((state) => state.user);
  const { getMockData } = useGuestAwareApi();
  
  // Get main feed data - skip if guest mode
  const { data, error, isLoading, refetch } = useGetForYouFeedQuery(
    { page: 1, limit: 20 },
    { skip: isGuestMode }
  );
  
  // Get user's own posts as fallback - skip if guest mode
  const { data: userPosts, isLoading: userPostsLoading } = useGetUserPostsQuery(
    { userId: user?._id, page: 1, limit: 20 },
    { skip: isGuestMode || !user?._id || (data?.data?.posts?.length > 0) }
  );

  // For guest mode: get mock data and sort by engagement (comments + likes)
  const mockPosts = useMemo(() => {
    if (!isGuestMode) return [];
    const posts = getMockData('posts') || [];
    // Sort by engagement: comments + likes (trending posts)
    return [...posts].sort((a, b) => {
      const engagementA = (a.comments || 0) + (a.likes || 0);
      const engagementB = (b.comments || 0) + (b.likes || 0);
      return engagementB - engagementA; // Descending order
    });
  }, [isGuestMode, getMockData]);

  // Show loading only for authenticated users
  if (!isGuestMode && (isLoading || userPostsLoading)) {
    return <Loading isLoading={true} />;
  }

  // Show error only for authenticated users
  if (!isGuestMode && error) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="error" sx={{ mb: 2 }}>
            Error loading feed: {error.data?.message || 'Something went wrong'}
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => refetch()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  // Determine which posts to show
  const postsToShow = isGuestMode
    ? mockPosts
    : (data?.data?.posts?.length > 0 
        ? data.data.posts 
        : userPosts?.data?.posts || []);
  
  const isShowingUserPosts = !isGuestMode && data?.data?.posts?.length === 0 && userPosts?.data?.posts?.length > 0;

  // Show empty state if no posts available
  if (postsToShow.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <CreatePost />
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No posts available
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        {/* Create Post Component */}
        <CreatePost />
        
        {/* Show indicator for guest mode (trending posts) */}
        {isGuestMode && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 2, 
            px: 3, 
            mb: 2, 
            background: theme.palette.background.paper,
            borderRadius: 2,
            border: `1px solid ${theme.palette.primary.main}`,
          }}>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
              🔥 Showing trending posts (most engagement)
            </Typography>
          </Box>
        )}
        
        {/* Show indicator when displaying user's own posts */}
        {isShowingUserPosts && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 2, 
            px: 3, 
            mb: 2, 
            background: theme.palette.background.paper,
            borderRadius: 2,
            border: `1px solid ${theme.palette.primary.main}`,
          }}>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
              📝 Showing your posts while we build your personalized feed
            </Typography>
          </Box>
        )}

        {/* Feed List */}
        <Box sx={{ mt: 3 }}>
          <FeedList 
            posts={postsToShow} 
            onRefresh={refetch}
            feedType="For You"
            isShowingUserPosts={isShowingUserPosts}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default ForYouFeed;
