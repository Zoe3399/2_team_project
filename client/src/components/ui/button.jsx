// src/components/ui/button.jsx
import React from "react";

export function Button({ children, ...props }) {
  return (
    <button
      style={{
        padding: "8px 16px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
      }}
      {...props}
    >
      {children}
    </button>
  );
}