import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";

export default function TabsHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = searchParams.get("tab") ?? "overview";

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    // setSearchParams({ tab: newValue });
    setSearchParams(
      { tab: newValue },
      {
        replace: newValue === "settings",
      },
    );
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Tab History Demo
      </Typography>

      <Tabs value={currentTab} onChange={handleTabChange}>
        <Tab label="Overview" value="overview" />
        <Tab label="Users" value="users" />
        <Tab label="Settings" value="settings" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        <Typography>Current tab: {currentTab}</Typography>
      </Box>
    </Box>
  );
}
