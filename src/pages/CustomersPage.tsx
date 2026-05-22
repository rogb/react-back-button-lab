import {
  Button,
  Card,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import PageCard from "../components/PageCard";
import { useLocation } from "react-router-dom";

export default function CustomersPage() {
  const location = useLocation();
  return (
    <PageCard title="Customers">
      <Typography sx={{ mb: 2 }}>This is a plain routed page.</Typography>
      <List dense>
        {["Acme Corp", "Southern Telco", "Example Industries"].map((name) => (
          <ListItem key={name}>
            <ListItemText primary={name} secondary="Fake customer row" />
          </ListItem>
        ))}
      </List>

      <Card variant="outlined" sx={{ mt: 2 }}>
        <Typography sx={{ mt: 2 }}>
          Location state: {JSON.stringify(location.state)}
        </Typography>
      </Card>
    </PageCard>
  );
}
