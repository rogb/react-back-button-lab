import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

type TabPanelProps = {
  children: React.ReactNode;
  selectedTab: string;
  value: string;
};

const tabValues = ["notes", "counter", "settings"] as const;
type TabValue = (typeof tabValues)[number];

const storageKey = "mui-persistent-tabs-history-state";

type PersistedTabState = {
  notes: string;
  count: number;
  name: string;
  colour: string;
};

const initialTabState: PersistedTabState = {
  notes: "",
  count: 0,
  name: "",
  colour: "blue",
};

function isTabValue(value: string | null): value is TabValue {
  return value !== null && tabValues.includes(value as TabValue);
}

function readPersistedTabState(): PersistedTabState {
  try {
    const storedValue = window.sessionStorage.getItem(storageKey);

    if (!storedValue) {
      return initialTabState;
    }

    return {
      ...initialTabState,
      ...JSON.parse(storedValue),
    };
  } catch {
    return initialTabState;
  }
}

function usePersistedTabState() {
  const [tabState, setTabState] = useState<PersistedTabState>(
    readPersistedTabState,
  );

  useEffect(() => {
    window.sessionStorage.setItem(storageKey, JSON.stringify(tabState));
  }, [tabState]);

  return [tabState, setTabState] as const;
}

// ---------------------------------------------------------------------
function TabPanel({ children, selectedTab, value }: TabPanelProps) {
  return (
    <Box
      role="tabpanel"
      aria-hidden={selectedTab !== value}
      sx={{
        display: selectedTab === value ? "block" : "none",
        pt: 2,
      }}
    >
      {children}
    </Box>
  );
}

// ---------------------------------------------------------------------
function NotesTab({
  notes,
  setNotes,
}: {
  notes: string;
  setNotes: (value: string) => void;
}) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Notes</Typography>
      <TextField
        label="Notes"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        multiline
        minRows={4}
      />
    </Stack>
  );
}

// ---------------------------------------------------------------------
function CounterTab({
  count,
  setCount,
}: {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
      <Typography variant="h6">Counter</Typography>
      <Typography>Count: {count}</Typography>
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          onClick={() => setCount((value) => value + 1)}
        >
          Increment
        </Button>
        <Button variant="outlined" onClick={() => setCount(0)}>
          Reset
        </Button>
      </Stack>
    </Stack>
  );
}

// ---------------------------------------------------------------------
function SettingsTab({
  name,
  colour,
  setName,
  setColour,
}: {
  name: string;
  colour: string;
  setName: (value: string) => void;
  setColour: (value: string) => void;
}) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Settings</Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <TextField
        label="Favourite colour"
        value={colour}
        onChange={(event) => setColour(event.target.value)}
      />
    </Stack>
  );
}

// ---------------------------------------------------------------------
export default function MuiPersistentTabsHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabState, setTabState] = usePersistedTabState();
  const selectedTab = isTabValue(searchParams.get("tab"))
    ? searchParams.get("tab")!
    : "notes";

  const handleTabChange = (_event: React.SyntheticEvent, value: TabValue) => {
    setSearchParams({ tab: value });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Notes" value="notes" />
        <Tab label="Counter" value="counter" />
        <Tab label="Settings" value="settings" />
      </Tabs>

      <TabPanel selectedTab={selectedTab} value="notes">
        <NotesTab
          notes={tabState.notes}
          setNotes={(notes) =>
            setTabState((currentState) => ({ ...currentState, notes }))
          }
        />
      </TabPanel>
      <TabPanel selectedTab={selectedTab} value="counter">
        <CounterTab
          count={tabState.count}
          setCount={(count) =>
            setTabState((currentState) => ({
              ...currentState,
              count:
                typeof count === "function" ? count(currentState.count) : count,
            }))
          }
        />
      </TabPanel>
      <TabPanel selectedTab={selectedTab} value="settings">
        <SettingsTab
          name={tabState.name}
          colour={tabState.colour}
          setName={(name) =>
            setTabState((currentState) => ({ ...currentState, name }))
          }
          setColour={(colour) =>
            setTabState((currentState) => ({ ...currentState, colour }))
          }
        />
      </TabPanel>
    </Box>
  );
}
