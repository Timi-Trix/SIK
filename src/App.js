import React, { useState, useEffect } from "react";

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

  const createOrRenewEntry = (isRenewal) => {
    const entry = {
      username: isRenewal ? renewal.username : `test-${Math.random().toString(36).substr(2, 5)}`,
      alias: isRenewal ? "Verlängert" : newEntry.alias,
      password: isRenewal ? renewal.password : Math.random().toString(36).slice(-8),
      notes: isRenewal ? `Verlängert am ${new Date().toLocaleDateString()}` : newEntry.notes,
      type: isRenewal ? renewal.type : newEntry.type,
      createdAt: new Date().toLocaleString(),
      owner: loggedInUser,
      isRenewal,
    };
    setEntries([...entries, entry]);
    isRenewal ? setRenewal({ username: "", password: "", type: "" }) : setNewEntry({ notes: "", type: "", alias: "" });
  };

  const renderEntry = (entry, index) => (
    <div key={index} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}>
      <p><strong>Benutzername:</strong> {entry.username}</p>
      <p><strong>Alias:</strong> {entry.alias}</p>
      <p><strong>Notizen:</strong> {entry.notes}</p>
      <p><strong>Typ:</strong> {entry.type}</p>
      <p><strong>Erstellt am:</strong> {entry.createdAt}</p>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      {!loggedInUser ? (
        <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
          <h2>Login</h2>
          <input type="text" placeholder="Benutzername" id="username" style={{ display: "block", marginBottom: "10px", width: "100%" }} />
          <input type="password" placeholder="Passwort" id="password" style={{ display: "block", marginBottom: "10px", width: "100%" }} />
          <button
            onClick={() =>
              handleLogin(
                document.getElementById("username").value,
                document.getElementById("password").value
              )
            }
            style={{ padding: "10px 20px" }}
          >
            Login
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h1>Willkommen {loggedInUser} ({role})</h1>
            <button onClick={handleLogout} style={{ padding: "5px 10px" }}>Logout</button>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Suche in Einträgen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "10px" }}
            />
          </div>

          <h2>Einträge</h2>
          {entries
            .filter(
              (entry) =>
                entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.alias.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(renderEntry)}

          <div style={{ marginTop: "20px" }}>
            <h3>Neuen Eintrag erstellen</h3>
            <input
              type="text"
              placeholder="Alias"
              value={newEntry.alias}
              onChange={(e) => setNewEntry({ ...newEntry, alias: e.target.value })}
              style={{ display: "block", marginBottom: "10px", width: "100%" }}
            />
            <input
              type="text"
              placeholder="Notizen"
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              style={{ display: "block", marginBottom: "10px", width: "100%" }}
            />
            <button
              onClick={() => createOrRenewEntry(false)}
              style={{ padding: "10px 20px", backgroundColor: "green", color: "white" }}
            >
              Erstellen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
