import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Select,
  MenuItem,
  Fade,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BackupIcon from "@mui/icons-material/Backup";

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${d.getFullYear()}`;
};

// Funktion zum Generieren eines Benutzernamens
const generateUsername = (owner) => {
  const randomNum = Math.floor(100 + Math.random() * 900); // Generiert eine zufällige dreistellige Zahl
  if (owner === "Test") {
    return `${randomNum}-siksuk-4`;
  } else if (owner === "Test1") {
    return `${randomNum}-siksuk-5`;
  }
  return `${randomNum}-siksuk`; // Standardfall, falls kein passender Ersteller gefunden wird
};

// Debounce-Funktion
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const EntryList = ({ entries, setEntries, role, loggedInUser }) => {
  const [openCreateEntryDialog, setOpenCreateEntryDialog] = useState(false);
  const [openManualEntryDialog, setOpenManualEntryDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(""); // Für die Benutzerfilterung
  const [newEntry, setNewEntry] = useState({
    username: "",
    password: "",
    aliasNotes: "",
    type: "Premium",
    status: "Inaktiv",
    paymentStatus: "Nicht gezahlt",
    createdAt: formatDate(new Date()),
    validUntil: `31.12.${new Date().getFullYear()}`,
  });
  const [manualEntry, setManualEntry] = useState({
    username: "",
    password: "",
    aliasNotes: "",
    validUntil: formatDate(new Date()), // Feld für "Gültig bis"
  });

  // Snackbar Zustände
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Debounce-Suchterm
  const debouncedSearch = useDebounce(searchTerm, 300); // 300ms Debounce

  useEffect(() => {
    setDebouncedSearchTerm(debouncedSearch);
  }, [debouncedSearch]);

  const handleOpenCreateEntryDialog = () => {
    const username = generateUsername(loggedInUser); // Benutzername generieren
    const randomPassword = Math.random().toString(36).slice(-8);
    setNewEntry({
      username: username,
      password: randomPassword,
      aliasNotes: "",
      type: "Premium",
      status: "Inaktiv",
      paymentStatus: "Nicht gezahlt",
      createdAt: formatDate(new Date()),
      validUntil: `31.12.${new Date().getFullYear()}`,
      owner: loggedInUser,
    });
    setOpenCreateEntryDialog(true);
  };

  const handleOpenManualEntryDialog = () => {
    setManualEntry({
      username: "",
      password: "",
      aliasNotes: "",
      validUntil: formatDate(new Date()), // Standardwert für "Gültig bis"
    });
    setOpenManualEntryDialog(true);
  };

  const createEntry = () => {
    if (!newEntry.aliasNotes.trim()) {
      alert("Bitte Spitzname, Notizen etc. eingeben.");
      return;
    }
    const entry = {
      ...newEntry,
      id: Date.now(),
    };
    setEntries((prevEntries) => [entry, ...prevEntries]);
    setOpenCreateEntryDialog(false);

    // Snackbar anzeigen
    setSnackbarMessage("Neuer Abonnent erfolgreich angelegt!");
    setSnackbarOpen(true);
  };

  const handleAddManualEntry = () => {
    if (
      !manualEntry.username ||
      !manualEntry.password ||
      !manualEntry.aliasNotes ||
      !manualEntry.validUntil
    ) {
      alert("Bitte füllen Sie alle Felder aus.");
      return;
    }
    const newManualEntry = {
      ...manualEntry,
      id: Date.now(),
      status: "Aktiv",
      paymentStatus: "Gezahlt",
      owner: loggedInUser,
      createdAt: formatDate(new Date()),
      note: "Dieser Abonnent besteht bereits",
    };
    setEntries((prevEntries) => [newManualEntry, ...prevEntries]);
    setOpenManualEntryDialog(false);

    // Snackbar anzeigen
    setSnackbarMessage("Bestehender Abonnent erfolgreich eingepflegt!");
    setSnackbarOpen(true);
  };

  const changeStatus = (entryId, status) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === entryId ? { ...entry, status } : entry
      )
    );
  };

  const changePaymentStatus = (entryId, paymentStatus) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === entryId ? { ...entry, paymentStatus } : entry
      )
    );
  };

  const deleteEntry = (entryId) => {
    setEntries((prevEntries) =>
      prevEntries.filter((entry) => entry.id !== entryId)
    );
  };

  const getStatusColor = (status) => {
    return status === "Aktiv"
      ? "green"
      : status === "Inaktiv"
      ? "red"
      : "black";
  };

  const getPaymentStatusColor = (paymentStatus) => {
    return paymentStatus === "Gezahlt"
      ? "green"
      : paymentStatus === "Nicht gezahlt"
      ? "red"
      : "black";
  };

  // Filterfunktion für Einträge
  const filterEntries = () => {
    return entries
      .filter((entry) => {
        if (role === "Admin") {
          return selectedUser ? entry.owner === selectedUser : true; // Filter nach Ersteller
        }
        return entry.owner === loggedInUser;
      })
      .filter((entry) => {
        return (
          entry.username.includes(debouncedSearchTerm) ||
          entry.aliasNotes.includes(debouncedSearchTerm)
        ); // Suchfunktion
      });
  };

  // Einzigartige Ersteller für den Filter
  const uniqueOwners = [...new Set(entries.map((entry) => entry.owner))];

  // Zähle die Einträge pro Benutzer
  const countEntriesByOwner = (owner) => {
    return entries.filter((entry) => entry.owner === owner).length;
  };

  // Funktion zum Exportieren von Einträgen als JSON
  const exportEntries = () => {
    const dataStr = JSON.stringify(entries, null, 2); // Formatieren der Daten
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup_entries.json"; // Dateiname
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // Entfernen des Links
    URL.revokeObjectURL(url); // Freigeben des Blob-URL
  };

  // Snackbar schließen
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Box
        sx={{
          marginBottom: 3,
          marginTop: 3,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Button
            onClick={handleOpenCreateEntryDialog}
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
          >
            Abonnent anlegen
          </Button>
          <Button
            onClick={handleOpenManualEntryDialog}
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
          >
            Bestehenden Abonnenten einpflegen
          </Button>
        </Box>

        {/* Backup-Button für den Admin */}
        {role === "Admin" && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<BackupIcon />}
            onClick={exportEntries}
          >
            Backup erstellen
          </Button>
        )}

        {/* Zählung der Einträge oben rechts mit Emojis */}
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h6">
            🎉 Du hast {countEntriesByOwner(loggedInUser)} Einträge erstellt!
          </Typography>
          {countEntriesByOwner(loggedInUser) >= 10 && (
            <Fade in={true} timeout={1000}>
              <Typography variant="body2" color="success.main">
                🌟 Weiter so! Du hast bald deine 10 Einträge erreicht!
              </Typography>
            </Fade>
          )}
        </Box>
      </Box>

      {/* Benutzerfilter für den Admin */}
      {role === "Admin" && (
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6">Ersteller filtern:</Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {uniqueOwners.map((owner, index) => (
              <Button
                key={index}
                variant="outlined"
                onClick={() => setSelectedUser(owner)}
                color={selectedUser === owner ? "primary" : "default"}
              >
                {owner} ({countEntriesByOwner(owner)}){" "}
                {/* Anzeige der Zählung */}
              </Button>
            ))}
            <Button variant="outlined" onClick={() => setSelectedUser("")}>
              Alle anzeigen
            </Button>
          </Box>
        </Box>
      )}

      <TextField
        label="🔍 Suchen nach Benutzername oder Spitzname"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: 3 }}
      />
      <Divider style={{ margin: "20px 0" }} />

      {filterEntries().length > 0 ? (
        filterEntries().map((entry, index) => (
          <Accordion key={index} sx={{ marginBottom: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                <strong>Erstellt von:</strong> {entry.owner}
                <br />
                <strong> Benutzername:</strong> {entry.username} |
                <strong> Passwort:</strong> {entry.password} |
                <strong> Spitzname:</strong> {entry.aliasNotes}
                {entry.note && (
                  <span style={{ color: "red" }}> ({entry.note})</span>
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography style={{ color: "black" }}>
                <strong>Typ:</strong> {entry.type}
              </Typography>
              <Typography style={{ color: getStatusColor(entry.status) }}>
                <strong>Status:</strong> {entry.status}
              </Typography>
              <Typography
                style={{ color: getPaymentStatusColor(entry.paymentStatus) }}
              >
                <strong>Zahlung:</strong> {entry.paymentStatus}
              </Typography>
              <Typography style={{ color: "black" }}>
                <strong>Erstellt am:</strong> {entry.createdAt}
              </Typography>
              <Typography style={{ color: "black" }}>
                <strong>Gültig bis:</strong>{" "}
                <TextField
                  type="date"
                  value={entry.validUntil}
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
              </Typography>
              {role === "Admin" && (
                <Box sx={{ marginTop: 2 }}>
                  <Button
                    onClick={() =>
                      changeStatus(
                        entry.id,
                        entry.status === "Aktiv" ? "Inaktiv" : "Aktiv"
                      )
                    }
                    variant="contained"
                    color="secondary"
                    sx={{ marginRight: 1 }}
                  >
                    {entry.status === "Aktiv" ? "Setze Inaktiv" : "Setze Aktiv"}
                  </Button>
                  <Button
                    onClick={() =>
                      changePaymentStatus(
                        entry.id,
                        entry.paymentStatus === "Gezahlt"
                          ? "Nicht gezahlt"
                          : "Gezahlt"
                      )
                    }
                    variant="contained"
                    color="secondary"
                    sx={{ marginRight: 1 }}
                  >
                    {entry.paymentStatus === "Gezahlt"
                      ? "Setze Nicht gezahlt"
                      : "Setze Gezahlt"}
                  </Button>
                  <Button
                    onClick={() => deleteEntry(entry.id)}
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                  >
                    Löschen
                  </Button>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography>🚀 Keine passenden Einträge gefunden.</Typography>
      )}

      {/* Snackbar für Benachrichtigungen */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Dialog für "Abonnent anlegen" */}
      <Dialog
        open={openCreateEntryDialog}
        onClose={() => setOpenCreateEntryDialog(false)}
      >
        <DialogTitle>Neuen Abonnenten anlegen</DialogTitle>
        <DialogContent>
          <TextField
            label="Spitzname, Notizen etc."
            fullWidth
            margin="normal"
            sx={{ backgroundColor: "#f0f8ff", borderRadius: "5px" }}
            value={newEntry.aliasNotes}
            onChange={(e) =>
              setNewEntry({ ...newEntry, aliasNotes: e.target.value })
            }
          />
          <Select
            fullWidth
            margin="normal"
            value={newEntry.type}
            onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value })}
          >
            <MenuItem value="Premium">Premium</MenuItem>
            <MenuItem value="Basic">Basic</MenuItem>
          </Select>
          <TextField
            label="Benutzername"
            fullWidth
            margin="normal"
            value={newEntry.username}
            disabled
          />
          <TextField
            label="Passwort"
            fullWidth
            margin="normal"
            type="password"
            value={newEntry.password}
            disabled
          />
          <Typography variant="caption" color="textSecondary">
            Benutzername und Passwort werden automatisch generiert.
          </Typography>{" "}
          {/* Infozeile */}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenCreateEntryDialog(false)}
            color="secondary"
          >
            Abbrechen
          </Button>
          <Button onClick={createEntry} color="primary">
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog für "Bestehenden Abonnenten einpflegen" */}
      <Dialog
        open={openManualEntryDialog}
        onClose={() => setOpenManualEntryDialog(false)}
      >
        <DialogTitle>Bestehenden Abonnenten einpflegen</DialogTitle>
        <DialogContent>
          <TextField
            label="Benutzername"
            fullWidth
            margin="normal"
            value={manualEntry.username}
            onChange={(e) =>
              setManualEntry({ ...manualEntry, username: e.target.value })
            }
          />
          <TextField
            label="Passwort"
            fullWidth
            margin="normal"
            type="password"
            value={manualEntry.password}
            onChange={(e) =>
              setManualEntry({ ...manualEntry, password: e.target.value })
            }
          />
          <TextField
            label="Spitzname, Notizen etc."
            fullWidth
            margin="normal"
            value={manualEntry.aliasNotes}
            onChange={(e) =>
              setManualEntry({ ...manualEntry, aliasNotes: e.target.value })
            }
          />
          <TextField
            label="Gültig bis"
            fullWidth
            margin="normal"
            type="date"
            value={manualEntry.validUntil}
            onChange={(e) =>
              setManualEntry({ ...manualEntry, validUntil: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <Typography variant="caption" color="textSecondary">
            Hier trägst du deine bereits aktiven Mitglieder ein.
          </Typography>{" "}
          {/* Infozeile */}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenManualEntryDialog(false)}
            color="secondary"
          >
            Abbrechen
          </Button>
          <Button onClick={handleAddManualEntry} color="primary">
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EntryList;
