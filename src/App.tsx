import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useNavigationType,
} from "react-router-dom";
import HistoryLabPanel from "./components/HistoryLabPanel";
import { useBrowserHistoryLogger } from "./hooks/useBrowserHistoryLogger";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/customers", label: "Customers" },
  { to: "/reports", label: "Reports" },
  { to: "/spa-workflow", label: "SPA Workflow" },
  { to: "/tabs-history", label: "Tabs History" },
  { to: "/mui-persistent-tabs", label: "MUI Persistent Tabs" },
  { to: "/mui-persistent-tabs-history", label: "MUI Persistent Tabs History" },
  { to: "/unsaved-form", label: "Unsaved Form" },
  { to: "/upload-streaming", label: "Upload Streaming" },
];

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  const [navigationCount, setNavigationCount] = useState(0);
  const [lastNavigationMessage, setLastNavigationMessage] = useState("");
  const [navigationLog, setNavigationLog] = useState<string[]>([]);
  const [stackPointer, setStackPointer] = useState(0);
  const [historyStack, setHistoryStack] = useState<string[]>([]);

  useBrowserHistoryLogger();

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log("RAW popstate event fired!");
      console.log("event.state:", event.state);
      console.log("Current URL:", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    setNavigationCount((count) => count + 1);

    if (navigationType === "POP") {
      const thisUrl = `${location.pathname}${location.search}`;
      const historyState = window.history.state;

      console.log(
        "%cPOP navigation detected!",
        "color: #f87171; font-weight: bold;",
      );
      console.log("Location pathname:", location.pathname);
      console.log("Location search:", location.search);
      console.log("Constructed URL:", thisUrl);
      console.log("History state on POP:", historyState);
      console.log("---------------------------------------------------");

      // ***************************************************
      // *** DEMO: Auto-redirect from /reports to /tabs-history on POP navigation ***
      // This simulates a scenario where the user tries to navigate back to a page that has been removed or replaced,
      // and we want to redirect them to a valid page instead of showing an error or blank page.
      // ***************************************************
      // if (location.pathname === "/reports") {
      //   navigate("/tabs-history", { replace: true });
      // }
    }

    if (navigationType === "POP") {
      setLastNavigationMessage("Browser BACK or FORWARD was used");
    } else if (navigationType === "PUSH") {
      setLastNavigationMessage("Normal app navigation was used");
    } else if (navigationType === "REPLACE") {
      setLastNavigationMessage("Current history entry was replaced");
    }

    setNavigationLog((log) =>
      [
        `${navigationType}: ${location.pathname}${location.search}`,
        ...log,
      ].slice(0, 1000),
    );

    setHistoryStack((stack) => {
      const currentUrl = `${location.pathname}${location.search}`;

      if (navigationType === "PUSH") {
        const trimmedStack = stack.slice(0, stackPointer + 1);
        setStackPointer(trimmedStack.length);
        return [...trimmedStack, currentUrl];
      }

      if (navigationType === "REPLACE") {
        if (stack.length === 0) {
          setStackPointer(0);
          return [currentUrl];
        }

        const updatedStack = [...stack];
        updatedStack[stackPointer] = currentUrl;
        return updatedStack;
      }

      if (navigationType === "POP") {
        const existingIndex = stack.indexOf(currentUrl);

        if (existingIndex >= 0) {
          setStackPointer(existingIndex);
          return stack;
        }

        setStackPointer(0);
        return [currentUrl];
      }

      return stack;
    });
  }, [location, navigate, navigationType]);

  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            React Routing Lab
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth={false}
        sx={{
          py: 3,
          px: { xs: 2, sm: 3, lg: 4 },
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gap: 3,
            alignItems: "start",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1.2fr) minmax(360px, 0.8fr)",
            },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                mt: 1,
                p: 1.25,
                borderRadius: 2,
                bgcolor: "#111827",
                border: "1px solid #374151",
                fontFamily: "monospace",
                boxShadow: 2,
                mb: 2,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#22c55e",
                  mb: 0.75,
                  display: "block",
                  fontWeight: "bold",
                  letterSpacing: 1,
                  fontSize: "0.7rem",
                }}
              >
                DEBUG PANEL
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      color: "#9ca3af",
                      minWidth: 140,
                      fontSize: "0.72rem",
                    }}
                  >
                    Current path:
                  </Typography>
                  <Typography sx={{ color: "#f9fafb", fontSize: "0.72rem" }}>
                    {location.pathname}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      color: "#9ca3af",
                      minWidth: 140,
                      fontSize: "0.72rem",
                    }}
                  >
                    Search/query:
                  </Typography>
                  <Typography sx={{ color: "#fbbf24", fontSize: "0.72rem" }}>
                    {location.search || "(none)"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      color: "#9ca3af",
                      minWidth: 140,
                      fontSize: "0.72rem",
                    }}
                  >
                    location object:
                  </Typography>
                  <Typography
                    sx={{
                      color: "#fbbf24",
                      fontSize: "0.72rem",
                      fontFamily: "monospace",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {location ? JSON.stringify(location) : "(none)"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      color: "#9ca3af",
                      minWidth: 140,
                      fontSize: "0.72rem",
                    }}
                  >
                    Nav count:
                  </Typography>
                  <Typography
                    sx={{
                      color: "#60a5fa",
                      fontWeight: "bold",
                      fontSize: "0.72rem",
                    }}
                  >
                    {navigationCount}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      color: "#9ca3af",
                      minWidth: 140,
                      fontSize: "0.72rem",
                    }}
                  >
                    Nav type:
                  </Typography>
                  <Typography
                    sx={{
                      color:
                        navigationType === "POP"
                          ? "#f87171"
                          : navigationType === "PUSH"
                            ? "#4ade80"
                            : "#c084fc",
                      fontWeight: "bold",
                      fontSize: "0.72rem",
                    }}
                  >
                    {navigationType}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      color: "#9ca3af",
                      minWidth: 140,
                      fontSize: "0.72rem",
                    }}
                  >
                    Last navigation:
                  </Typography>
                  <Typography
                    sx={{
                      color: "#60a5fa",
                      fontWeight: "bold",
                      fontSize: "0.72rem",
                    }}
                  >
                    {lastNavigationMessage}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                  mt: 1,
                }}
              >
                <Typography
                  sx={{ color: "#9ca3af", minWidth: 140, fontSize: "0.72rem" }}
                >
                  Navigation log:
                </Typography>

                <Stack
                  spacing={0.5}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    maxHeight: 220,
                    overflowY: "auto",
                    pr: 0.5,
                  }}
                >
                  {navigationLog.map((entry, index) => (
                    <Box
                      key={index}
                      sx={{
                        px: 0.8,
                        py: 0.4,
                        borderRadius: 1,
                        bgcolor: "rgba(255, 255, 255, 0.03)",
                        borderLeft: "3px solid #07dbf7",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          color: "#d1d5db",
                          fontSize: "0.6rem",
                          lineHeight: 1.3,
                          fontFamily: "monospace",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {entry}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ mt: 1.5 }}>
                <Typography
                  sx={{ color: "#9ca3af", fontSize: "0.72rem", mb: 0.5 }}
                >
                  Visual history stack:
                </Typography>

                <Stack
                  spacing={0.5}
                  sx={{
                    maxHeight: 220,
                    overflowY: "auto",
                    pr: 0.5,
                  }}
                >
                  {historyStack.map((entry, index) => {
                    const isCurrent = index === stackPointer;

                    return (
                      <Box
                        key={`${entry}-${index}`}
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: isCurrent
                            ? "#7f1d1d"
                            : "rgba(255,255,255,0.04)",
                          border: isCurrent
                            ? "1px solid #ef4444"
                            : "1px solid #374151",
                        }}
                      >
                        <Typography
                          sx={{
                            color: isCurrent ? "#fecaca" : "#d1d5db",
                            fontSize: "0.68rem",
                            fontFamily: "monospace",
                            fontWeight: isCurrent ? "bold" : "normal",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {isCurrent ? "-> " : "  "}[{index}] {entry}{" "}
                          {isCurrent ? `(${navigationType})` : ""}
                        </Typography>
                      </Box>
                    );
                  })}

                  {stackPointer < historyStack.length - 1 && (
                    <Typography
                      sx={{
                        color: "#fbbf24",
                        fontSize: "0.68rem",
                        mt: 0.75,
                        fontFamily: "monospace",
                      }}
                    >
                      Forward history exists. A new PUSH will discard entries
                      above the pointer.
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap" }}>
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  variant="outlined"
                  sx={{
                    "&.active": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            <Outlet />
          </Box>

          <Card
            variant="outlined"
            sx={{ minWidth: 0, position: { lg: "sticky" }, top: { lg: 88 } }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                History Lab
              </Typography>
              <HistoryLabPanel />
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
