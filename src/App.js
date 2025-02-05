import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  AppBar,
  Toolbar,
  Button,
  Divider,
  Snackbar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/system";
import LoginForm from "./LoginForm";
import EntryList from "./EntryList";

// 🔹 Styling
const StyledContainer = styled(Container)({
  backgroundColor: "#e0e7ff",
  minHeight: "100vh",
  padding: "20px",
  color: "#333",
});

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#3b82f6",
});

// 🔹 Benutzer-Emojis
const userEmojis = {
  Admin: "👑",
  Test: "🚀",
  Test1: "🎩",
};

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [role, setRole] = useState(null);
  const [entries, setEntries] = useState(
    () => JSON.parse(localStorage.getItem("entries")) || []
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  // 🔹 Login-Logik
  const handleLogin = (username, password) => {
    const users = { Admin: "Admin", Test: "Test", Test1: "Test1" };
    if (users[username] === password) {
      setLoggedInUser(username);
      setRole(username === "Admin" ? "Admin" : "Friend");
    } else {
      alert("❌ Ungültige Zugangsdaten");
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setRole(null);
  };

  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  return (
    <StyledContainer>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6">Eintragsverwaltung</Typography>
          {loggedInUser && (
            <Typography
              variant="h6"
              style={{ marginLeft: "auto", marginRight: "20px" }}
            >
              {userEmojis[loggedInUser]} {loggedInUser}
            </Typography>
          )}
          {loggedInUser && (
            <Button onClick={handleLogout} color="inherit">
              🔓 Logout
            </Button>
          )}
        </Toolbar>
      </StyledAppBar>

      {!loggedInUser ? (
        <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
          <Grid item xs={12} sm={6} md={4}>
            <LoginForm handleLogin={handleLogin} />
          </Grid>
        </Grid>
      ) : (
        <EntryList
          entries={entries}
          setEntries={setEntries}
          role={role}
          loggedInUser={loggedInUser}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </StyledContainer>
  );
};

export default App;
