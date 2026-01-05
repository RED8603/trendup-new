import React from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import { useGetDiscoverFeedQuery } from '@/api/slices/socialApi';
import { useSelector } from 'react-redux';
import FeedList from './FeedList';
import CreatePost from '../CreatePost/CreatePost';
import Loading from '../common/loading';
import GuestFeedError from '../common/GuestFeedError';

const DiscoverFeed = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isGuestMode } = useSelector((state) => state.user);
  const { data, error, isLoading, refetch } = useGetDiscoverFeedQuery(
    { page: 1, limit: 20 },
    { skip: isGuestMode }
  );

  if (isLoading && !isGuestMode) {
    return <Loading isLoading={true} />;
  }

  // Show guest error message for guest users or when error is "No token provided"
  if (isGuestMode || (error && (error.data?.message?.includes('token') || error.data?.message?.includes('Token') || error.data?.message?.includes('No token')))) {
    return <GuestFeedError featureName="the Discover feed" />;
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <p>Error loading feed: {error.data?.message || 'Something went wrong'}</p>
        <button onClick={() => refetch()}>Retry</button>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        {/* Create Post Component */}
        <CreatePost />
        
        {/* Feed List */}
        <Box sx={{ mt: 3 }}>
        <FeedList 
          posts={data?.data?.posts || []} 
          onRefresh={refetch}
          feedType="Discover"
          isShowingUserPosts={false}
        />
        </Box>
      </Box>
    </Container>
  );
};

export default DiscoverFeed;
