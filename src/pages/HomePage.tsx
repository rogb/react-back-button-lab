import { Alert, Stack, Typography, Button } from "@mui/material";
import PageCard from "../components/PageCard";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <PageCard title="Home">
      <Stack spacing={2}>
        <Typography>
          This is a stripped-down React + TypeScript + MUI app with a few simple
          routed pages.
        </Typography>
        <Alert severity="info">
          There is no custom back-button handling in this version.
        </Alert>
        <Typography>
          Use the navigation buttons above to move between pages. We will add
          browser history and back-button concepts one step at a time.
        </Typography>

        <Button variant="contained" onClick={() => navigate("/customers")}>
          Customers
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/reports")}
          sx={{ ml: 2 }}
        >
          Reports
        </Button>
      </Stack>
    </PageCard>
  );
}
