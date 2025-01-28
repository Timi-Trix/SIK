import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Dieser Code ist für eine React-App gedacht. Um die Anwendung vollständig bereitzustellen,
 * müssen die Projektdateien wie `package.json`, `index.html`, und andere unterstützende Dateien
 * erstellt und in der richtigen Ordnerstruktur organisiert werden.
 */

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [role, setRole] = useState(null);
  const [entries, setEntries] = useState(() => JSON.parse(localStorage.getItem("entries")) || []);
  const [newEntry, setNewEntry] = useState({ notes: "", type: "", alias: "", isRenewal: false });
  const [renewal, setRenewal] = useState({ username: "", password: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => localStorage.setItem("entries", JSON.stringify(entries)), [entries]);

  const handleLogin = (username, password) => {
    const users = { Admin: "Admin", Test: "Test", Test1: "Test1" };
    if (users[username] === password) {
      setLoggedInUser(username);
      setRole(username === "Admin" ? "Admin" : "Friend");
    } else alert("Invalid credentials");
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setRole(null);
  };

  const calculateRemainingDays = () => {
    const today = new Date();
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    return Math.ceil((endOfYear - today) / (1000 * 60 * 60 * 24));
  };

  const createOrRenewEntry = (isRenewal) => {
    const entry = {
      username: isRenewal ? renewal.username : `${Math.floor(Math.random() * 900) + 100}-testtest-5`,
      alias: isRenewal ? "Verlängert" : newEntry.alias,
      password: isRenewal ? renewal.password : Math.random().toString(36).slice(-8),
      notes: isRenewal ? `Verlängert am ${new Date().toLocaleDateString()}` : newEntry.notes,
      type: isRenewal ? renewal.type : newEntry.type,
      createdAt: new Date().toLocaleString(),
      owner: loggedInUser,
      status: "Inaktiv",
      paid: "Nein",
      remainingDays: null,
      isRenewal,
    };
    setEntries([...entries, entry]);
    isRenewal ? setRenewal({ username: "", password: "", type: "" }) : setNewEntry({ notes: "", type: "", alias: "" });
  };

  const updateEntry = (index, key, value) => {
    const updatedEntries = [...entries];
    updatedEntries[index][key] = value;

    if (key === "status" && value === "Aktiv") {
      updatedEntries[index].remainingDays = calculateRemainingDays();
    } else if (key === "status" && value === "Inaktiv") {
      updatedEntries[index].remainingDays = null;
    }

    setEntries(updatedEntries);
  };

  const deleteEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const countEntriesByOwner = (owner) => entries.filter((entry) => entry.owner === owner).length;

  const filteredEntries = entries.filter(
    (entry) =>
      entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderEntry = (entry, index) => (
    <Card
      key={index}
      className={`mb-2 ${entry.isRenewal ? "bg-yellow-100" : "bg-green-100"} border-2`}
    >
      <CardContent className="p-2">
        <div className="text-sm">
          <p><strong>Benutzername:</strong> {entry.username}</p>
          <p><strong>Alias:</strong> {entry.alias}</p>
          <p><strong>Passwort:</strong> {entry.password}</p>
          <p><strong>Notizen:</strong> {entry.notes}</p>
          <p><strong>Typ:</strong> {entry.type}</p>
          <p><strong>Erstellt am:</strong> {entry.createdAt}</p>
          <p><strong>Restliche Tage:</strong> {entry.remainingDays !== null ? entry.remainingDays : "Nicht verfügbar"}</p>
          <p><strong>Status:</strong> <span style={{ color: entry.status === "Aktiv" ? "green" : "black" }}>{entry.status}</span></p>
          <p><strong>Gezahlt:</strong> <span style={{ color: entry.paid === "Ja" ? "green" : "black" }}>{entry.paid}</span></p>
        </div>
        {role === "Admin" && (
          <div className="mt-2 flex gap-2">
            <Button
              onClick={() => updateEntry(index, "paid", entry.paid === "Ja" ? "Nein" : "Ja")}
              className="bg-blue-500 text-white text-xs"
            >
              {entry.paid === "Ja" ? "Gezahlt zurücksetzen" : "Als gezahlt markieren"}
            </Button>
            <Button
              onClick={() => updateEntry(index, "status", entry.status === "Aktiv" ? "Inaktiv" : "Aktiv")}
              className="bg-green-500 text-white text-xs"
            >
              {entry.status === "Aktiv" ? "Als inaktiv setzen" : "Als aktiv setzen"}
            </Button>
            <Button onClick={() => deleteEntry(index)} className="bg-red-500 text-white text-xs">
              Eintrag löschen
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4">
      {!loggedInUser ? (
        <Card className="max-w-md mx-auto">
          <CardContent>
            <h2 className="text-xl font-bold mb-4">🔐 Login</h2>
            <Input placeholder="👤 Benutzername" id="username" className="mb-2" />
            <Input placeholder="🔑 Passwort" type="password" id="password" className="mb-4" />
            <Button
              onClick={() =>
                handleLogin(
                  document.getElementById("username").value,
                  document.getElementById("password").value
                )
              }
            >
              🚀 Login
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Willkommen {loggedInUser} ({role}) 🎉</h1>
            <Button onClick={handleLogout}>👋 Logout</Button>
          </div>

          <div className="mb-4">
            <Input
              placeholder="🔍 Suche in Einträgen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {role === "Friend" && (
            <div>
              <h2 className="text-blue-500 text-xl font-bold mb-4">🎭 Willkommen bei TESTO</h2>
              <Card className="mb-4">
                <CardContent>
                  <h2 className="text-xl font-bold mb-4">Abonnent anlegen</h2>
                  <Select onValueChange={(value) => setNewEntry({ ...newEntry, type: value })}>
                    <SelectTrigger className="w-2/3">
                      <SelectValue placeholder="Abo auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Spitzname"
                    value={newEntry.alias}
                    onChange={(e) => setNewEntry({ ...newEntry, alias: e.target.value })}
                    className="w-2/3 p-1 border rounded mb-2"
                  />
                  <textarea
                    placeholder="Notizen"
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    className="w-2/3 p-1 border rounded mb-2"
                  />
                  <div className="flex justify-center mt-2">
                    <Button
                      onClick={() => createOrRenewEntry(false)}
                      className="bg-green-500 text-white"
                    >
                      ➕ Abonnent anlegen
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardContent>
                  <h2 className="text-xl font-bold mb-4">Abonnent verlängern</h2>
                  <Input
                    placeholder="Benutzername"
                    value={renewal.username}
                    onChange={(e) => setRenewal({ ...renewal, username: e.target.value })}
                    className="w-2/3 p-1 border rounded mb-2"
                  />
                  <Input
                    placeholder="Passwort"
                    value={renewal.password}
                    onChange={(e) => setRenewal({ ...renewal, password: e.target.value })}
                    className="w-2/3 p-1 border rounded mb-2"
                  />
                  <Select onValueChange={(value) => setRenewal({ ...renewal, type: value })}>
                    <SelectTrigger className="w-2/3">
                      <SelectValue placeholder="Abo auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex justify-center mt-2">
                    <Button
                      onClick={() => createOrRenewEntry(true)}
                      className="bg-yellow-500 text-white"
                    >
                      🔄 Abonnement verlängern
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <h2 className="text-xl font-bold mb-2">Meine Einträge (Gesamt: {countEntriesByOwner(loggedInUser)})</h2>
              {filteredEntries.filter((entry) => entry.owner === loggedInUser).map(renderEntry)}
            </div>
          )}

          {role === "Admin" && (
            <div>
              <h2 className="text-xl font-bold mb-4">📋 Alle Einträge</h2>
              {Array.from(new Set(entries.map((entry) => entry.owner))).map((owner) => (
                <div key={owner} className="mb-6">
                  <h3 className="text-lg font-bold text-blue-600">Benutzer: {owner} (Gesamt: {countEntriesByOwner(owner)})</h3>
                  <div className="ml-4">
                    {filteredEntries.filter((entry) => entry.owner === owner).map(renderEntry)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
