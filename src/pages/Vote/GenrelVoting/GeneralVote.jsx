import BoxConatner from "@/components/common/BoxContainer/BoxConatner";
import ButtonMain from "@/components/common/ButtonMain";
import {
  Typography,
  LinearProgress,
  Box,
  Stack,
  useTheme,
  Container,
} from "@mui/material";

export default function VotingComponent() {
  const theme = useTheme();
  return (
    <Container  maxWidth="md">

    <BoxConatner
      sx={{
        maxWidth: "100%",
        width: "100%",
        bgcolor: theme.palette.primary.light,
      }}
    >
      <Box p={2}>
        <Stack spacing={2}>
          {/* Title */}
          <Typography
            variant="h4"
            color={theme.palette.text.secondary}
            sx={{
              fontWeight: 500,
              lineHeight: 1.2,
            }}
          >
            Freeze All Sales for 30 Days
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            color={theme.palette.text.primary}
            sx={{
              fontSize: "1rem",
              fontWeight: 700,
              mb: 1,
            }}
          >
            Requires 40% of holders to vote Yes
          </Typography>

          {/* Progress Section */}
          <Box>
            <Typography
              variant="h1"
              color={theme.palette.text.primary}
              sx={{
                fontWeight: "bold",
                mb: 1,
              }}
            >
              20%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={20}
              sx={{
                height: 15,
                borderRadius: 4,
                backgroundColor: theme.palette.background.paper,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: theme.palette.text.primary,
                  borderRadius: 4,
                },
              }}
            />
          </Box>

          {/* Countdown */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "#a0a0a0",
                mb: 0.5,
              }}
            >
              Voting ends in
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              6 days, 14 h
            </Typography>
          </Box>

          {/* Voting Buttons */}
          <Stack direction="row" spacing={2}>
            <ButtonMain fullWidth>YES</ButtonMain>
            <ButtonMain
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#ff4444",
              }}
            >
              NO
            </ButtonMain>
          </Stack>
        </Stack>
      </Box>
    </BoxConatner>
    </Container>
  );
}
