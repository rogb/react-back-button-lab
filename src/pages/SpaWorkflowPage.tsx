import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import PageCard from "../components/PageCard";
import { useSearchParams } from "react-router-dom";

const steps = ["Choose customer", "Select service", "Confirm"];

export default function SpaWorkflowPage() {
  const [localStep, setLocalStep] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const step = searchParams.get("step") ?? "1";

  return (
    <PageCard title="SPA Workflow">
      <Stack spacing={3}>
        <Typography>
          This page keeps its workflow step in normal React local state only.
        </Typography>

        <Box>
          <Typography variant="h6">Local workflow</Typography>
          <Typography>
            Current step: {localStep + 1} — {steps[localStep]}
          </Typography>
          <Typography variant="h6">Current workflow step: {step}</Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              disabled={localStep === 0}
              onClick={() => setLocalStep(localStep - 1)}
            >
              Previous step
            </Button>
            <Button
              variant="contained"
              disabled={localStep === steps.length - 1}
              onClick={() => setLocalStep(localStep + 1)}
            >
              Next step
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant={step === "1" ? "contained" : "outlined"}
              onClick={() => setSearchParams({ step: "1" })}
            >
              Step 1
            </Button>

            <Button
              variant={step === "2" ? "contained" : "outlined"}
              onClick={() => setSearchParams({ step: "2" })}
            >
              Step 2
            </Button>

            <Button
              variant={step === "3" ? "contained" : "outlined"}
              onClick={() => setSearchParams({ step: "3" })}
            >
              Step 3
            </Button>

            <Button
              variant={step === "3" ? "contained" : "outlined"}
              onClick={() => setSearchParams({ step: "3" }, { replace: true })}
            >
              Step 3 - REPLACE!
            </Button>
          </Stack>
        </Box>
      </Stack>
    </PageCard>
  );
}
