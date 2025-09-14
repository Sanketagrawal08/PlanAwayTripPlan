import React, { useState } from "react";
import api from "../api";

const AddContactModal = ({ isOpen, onClose, onContactAdded }) => {
  const [newContact, setNewContact] = useState({ name: "", number: "", email: "" });
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/user/update-contacts", { contact: newContact });
      onContactAdded(newContact);
      setNewContact({ name: "", number: "", email: "" });
      onClose();
    } catch (err) {
      console.error(err);
      setMessage("Error adding contact");
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: "#1e1e2f",
        padding: "25px 30px",
        borderRadius: "12px",
        width: "400px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.6)",
        position: "relative",
        color: "#eee",
      }}>
        <h3 style={{ marginBottom: "20px" }}>Add New Contact</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={newContact.name}
            onChange={handleInputChange}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #555",
              backgroundColor: "#2a2a3d",
              color: "#eee",
            }}
          />
          <input
            type="text"
            name="number"
            placeholder="Enter number"
            value={newContact.number}
            onChange={handleInputChange}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #555",
              backgroundColor: "#2a2a3d",
              color: "#eee",
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={newContact.email}
            onChange={handleInputChange}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #555",
              backgroundColor: "#2a2a3d",
              color: "#eee",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "#fff",
              cursor: "pointer",
              fontSize: "16px",
              transition: "0.2s",
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#4CAF50"}
          >
            Add Contact
          </button>
        </form>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "20px",
            color: "#eee",
            cursor: "pointer",
          }}
        >
          ✖
        </button>
        {message && <p style={{ color: "#ff5555", fontWeight: "bold", marginTop: "10px" }}>{message}</p>}
      </div>
    </div>
  );
};

export default AddContactModal;
