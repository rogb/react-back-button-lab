import { Box, TextField, Typography, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useBlocker, useNavigate } from "react-router-dom";

export default function UnsavedFormPage() {
  const [notes, setNotes] = useState("");
  const [showBackDialog, setShowBackDialog] = useState(false);
  const navigate = useNavigate();
  const guardPushed = useRef(false);

  const hasUnsavedChanges = notes.trim().length > 0;

  // Push a guard entry once on mount so the back button has something to pop
  // before leaving the page. Store the state key so we can identify it later.
  useEffect(() => {
    if (!guardPushed.current) {
      window.history.pushState({ __unsavedGuard: true }, "");
      guardPushed.current = true;
    }
  }, []);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (!hasUnsavedChanges) {
        // No unsaved changes — let it go, but re-navigate via React Router
        // so the router state stays in sync.
        navigate(-1);
        return;
      }

      // The guard entry was just popped. Re-push it so the page doesn't move,
      // then show the dialog.
      window.history.pushState({ __unsavedGuard: true }, "");
      setShowBackDialog(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [hasUnsavedChanges, navigate]);

  // useBlocker covers Link clicks and programmatic navigation (navigate(...))
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname,
  );

  const isBlocked = blocker.state === "blocked" || showBackDialog;

  const handleLeave = () => {
    setNotes("");
    if (blocker.state === "blocked") {
      blocker.proceed();
    } else {
      // Back button path: discard the re-pushed guard entry, then go back
      setShowBackDialog(false);
      window.history.go(-2); // -1 for the guard we just re-pushed, -1 for the real page
    }
  };

  const handleStay = () => {
    if (blocker.state === "blocked") {
      blocker.reset();
    } else {
      setShowBackDialog(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Unsaved Form Demo
      </Typography>

      <TextField
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        fullWidth
        multiline
        minRows={4}
      />

      <Typography sx={{ mt: 2 }}>
        Unsaved changes: {hasUnsavedChanges ? "YES" : "NO"}
      </Typography>

      {isBlocked && (
        <Box sx={{ mt: 2 }}>
          <Typography color="error" sx={{ mb: 1 }}>
            You have unsaved changes. Leave this page?
          </Typography>

          <Button variant="contained" color="error" onClick={handleLeave}>
            Leave page
          </Button>

          <Button variant="outlined" sx={{ ml: 1 }} onClick={handleStay}>
            Stay here
          </Button>
        </Box>
      )}
    </Box>
  );
}
