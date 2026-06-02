import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

type TabPanelProps = {
  children: React.ReactNode;
  selectedTab: number;
  value: number;
};

// --------------------------------------------------------------
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

// --------------------------------------------------------------
function NotesTab() {
  const [notes, setNotes] = useState("");

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

// --------------------------------------------------------------
function CounterTab() {
  const [count, setCount] = useState(0);

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

// --------------------------------------------------------------
function SettingsTab() {
  const [name, setName] = useState("");
  const [colour, setColour] = useState("blue");

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

// =============================================================
export default function MuiPersistentTabsExample() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <Box sx={{ p: 3 }}>
      <Tabs
        value={selectedTab}
        onChange={(_event, value: number) => setSelectedTab(value)}
      >
        <Tab label="Notes" value={0} />
        <Tab label="Counter" value={1} />
        <Tab label="Settings" value={2} />
      </Tabs>

      <TabPanel selectedTab={selectedTab} value={0}>
        <NotesTab />
      </TabPanel>
      <TabPanel selectedTab={selectedTab} value={1}>
        <CounterTab />
      </TabPanel>
      <TabPanel selectedTab={selectedTab} value={2}>
        <SettingsTab />
      </TabPanel>
    </Box>
  );
}
