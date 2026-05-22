import {
  Alert,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  clearHistoryLog,
  getHistoryLog,
  HistoryLogEvent,
} from "../hooks/useBrowserHistoryLogger";

export default function HistoryLabPanel() {
  const [log, setLog] = useState<HistoryLogEvent[]>(getHistoryLog());

  useEffect(() => {
    const refresh = () => setLog(getHistoryLog());
    window.addEventListener("history-log-changed", refresh);
    return () => window.removeEventListener("history-log-changed", refresh);
  }, []);

  return (
    <Stack spacing={2}>
      <Alert severity="info">
        This logs pushState, replaceState and popstate. Use the tab examples,
        then return here to inspect what happened.
      </Alert>

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }} useFlexGap>
        <Button variant="contained" onClick={() => history.back()}>
          history.back()
        </Button>
        <Button variant="contained" onClick={() => history.forward()}>
          history.forward()
        </Button>
        <Button
          variant="outlined"
          onClick={() =>
            history.pushState(
              { manualTab: "billing" },
              "",
              "/query-tabs?tab=billing",
            )
          }
        >
          Raw pushState to query tab
        </Button>
        <Button
          variant="outlined"
          onClick={() =>
            history.replaceState(
              { manualTab: "activity" },
              "",
              "/query-tabs?tab=activity",
            )
          }
        >
          Raw replaceState to query tab
        </Button>
        <Button
          color="error"
          variant="outlined"
          onClick={() => {
            clearHistoryLog();
            setLog([]);
          }}
        >
          Clear log
        </Button>
      </Stack>

      <Typography variant="body2">
        Warning: raw history.pushState changes the URL but does not notify
        React Router in the same way as navigate(). In real apps, prefer React
        Router navigation APIs.
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>State</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {log.map((entry, index) => (
            <TableRow key={`${entry.at}-${index}`}>
              <TableCell>{entry.at}</TableCell>
              <TableCell>{entry.type}</TableCell>
              <TableCell>{entry.url}</TableCell>
              <TableCell>
                <code>{JSON.stringify(entry.state)}</code>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}
