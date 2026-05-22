import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageCard from "../components/PageCard";

export default function ReportsPage() {
  const navigate = useNavigate();

  return (
    <PageCard title="Reports">
      <Stack spacing={2}>
        <Typography>
          This page has one simple programmatic navigation button.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/customers")}>
          Go to Customers
        </Button>

        <Button
          variant="contained"
          onClick={() =>
            navigate("/customers", {
              state: { from: "Reports page button" },
            })
          }
        >
          Go to Customers with state
        </Button>

        <Button
          variant="contained"
          color="warning"
          onClick={() => {
            window.history.pushState(
              { customData: "hello" },
              "",
              "/manual-page",
            );

            console.log("Manual pushState executed");
          }}
        >
          Manual pushState
        </Button>

        <Button
          variant="outlined"
          color="warning"
          onClick={() => {
            window.history.replaceState(
              { customData: "replaced" },
              "",
              "/manual-replaced",
            );

            console.log("Manual replaceState executed");
          }}
        >
          Manual replaceState
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            window.dispatchEvent(
              new PopStateEvent("popstate", {
                state: window.history.state,
              }),
            );

            console.log("Manual popstate event dispatched");
          }}
        >
          Dispatch popstate
        </Button>
      </Stack>
    </PageCard>
  );
}
