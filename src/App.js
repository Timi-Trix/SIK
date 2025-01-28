import React, { useState, useEffect } from "react";

// Dummy components to resolve missing imports
export const Card = ({ children, className }) => <div className={`card ${className}`}>{children}</div>;
export const CardContent = ({ children }) => <div className="card-content">{children}</div>;
export const Button = ({ children, onClick, className }) => (
  <button onClick={onClick} className={`button ${className}`}>{children}</button>
);
export const Input = ({ placeholder, value, onChange, id, type = "text", className }) => (
  <input
    id={id}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`input ${className}`}
  />
);
export const Select = ({ children, onValueChange }) => (
  <select onChange={(e) => onValueChange(e.target.value)} className="select">
    {children}
  </select>
);
export const SelectTrigger = ({ children }) => <div className="select-trigger">{children}</div>;
export const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;
export const SelectContent = ({ children }) => <div className="select-content">{children}</div>;
export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [role, setRole] = useState(null);
  const [entries, setEntries] = useState(() => JSON.parse(localStorage.getItem("entries")) || []);
  const [newEntry, setNewEntry] = useState({ notes: "", type: "", alias: "" });
  const [renewal, setRenewal] = useState({ username: "", password: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => localStorage.setItem("entries", JSON.stringify(entries)), [entries]);

  const handleLogin = (username, password) => {
    const users = { Admin: "Admin", Test: "Test" };
    if (users[username] === password) {
      setLoggedInUser(username);
      setRole(username === "Admin" ? "Admin" : "Friend");
    } else alert("Invalid credentials");
  };

  const createEntry = (isRenewal) => {
    const entry = {
      username: isRenewal ? renewal.username : `user-${Date.now()}`,
      alias: isRenewal ? "Renewed" : newEntry.alias,
      password: isRenewal ? renewal.password : Math.random().toString(36).slice(-8),
      notes: isRenewal ? `Renewed on ${new Date().toLocaleDateString()}` : newEntry.notes,
      type: isRenewal ? renewal.type : newEntry.type,
      createdAt: new Date().toLocaleString(),
      owner: loggedInUser,
      status: "Inactive",
      paid: "No",
      remainingDays: null,
    };
    setEntries([...entries, entry]);
    isRenewal ? setRenewal({ username: "", password: "", type: "" }) : setNewEntry({ notes: "", type: "", alias: "" });
  };

  const updateEntry = (index, key, value) => {
    const updatedEntries = [...entries];
    updatedEntries[index][key] = value;
    if (key === "status" && value === "Active") {
      updatedEntries[index].remainingDays = Math.ceil((new Date(new Date().getFullYear(), 11, 31) - new Date()) / (1000 * 60 * 60 * 24));
    } else if (key === "status") {
      updatedEntries[index].remainingDays = null;
    }
    setEntries(updatedEntries);
  };

  const deleteEntry = (index) => setEntries(entries.filter((_, i) => i !== index));

  const filteredEntries = entries.filter(
    (entry) =>
      entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderEntry = (entry, index) => (
    <Card key={index} className={`mb-2 ${entry.status === "Active" ? "bg-green-100" : "bg-yellow-100"} border-2`}>
      <CardContent className="p-2">
        <div className="text-sm">
          <p><strong>User:</strong> {entry.username}</p>
          <p><strong>Alias:</strong> {entry.alias}</p>
          <p><strong>Status:</strong> {entry.status}</p>
          <p><strong>Paid:</strong> {entry.paid}</p>
        </div>
        {role === "Admin" && (
          <div className="mt-2 flex gap-2">
            <Button onClick={() => updateEntry(index, "paid", entry.paid === "Yes" ? "No" : "Yes")} className="bg-blue-500 text-white text-xs">
              {entry.paid === "Yes" ? "Mark Unpaid" : "Mark Paid"}
            </Button>
            <Button onClick={() => updateEntry(index, "status", entry.status === "Active" ? "Inactive" : "Active")} className="bg-green-500 text-white text-xs">
              {entry.status === "Active" ? "Deactivate" : "Activate"}
            </Button>
            <Button onClick={() => deleteEntry(index)} className="bg-red-500 text-white text-xs">
              Delete
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
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <Input placeholder="Username" id="username" className="mb-2" />
            <Input placeholder="Password" type="password" id="password" className="mb-4" />
            <Button
              onClick={() =>
                handleLogin(
                  document.getElementById("username").value,
                  document.getElementById("password").value
                )
              }
            >
              Login
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Welcome {loggedInUser} ({role})</h1>
            <Button onClick={() => setLoggedInUser(null)}>Logout</Button>
          </div>

          <Input
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 w-full p-2 border rounded"
          />

          {role === "Friend" && (
            <Card className="mb-4">
              <CardContent>
                <h2 className="text-xl font-bold mb-4">Create Entry</h2>
                <Input
                  placeholder="Alias"
                  value={newEntry.alias}
                  onChange={(e) => setNewEntry({ ...newEntry, alias: e.target.value })}
                  className="mb-2"
                />
                <textarea
                  placeholder="Notes"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  className="mb-2 w-full p-2 border rounded"
                />
                <Select onValueChange={(value) => setNewEntry({ ...newEntry, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => createEntry(false)} className="mt-4 bg-green-500 text-white">
                  Create
                </Button>
              </CardContent>
            </Card>
          )}

          <div>
            {filteredEntries.map(renderEntry)}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
