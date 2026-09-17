import React, { useState } from "react";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import betService from "../../../services/bet.service";

const Notices = () => {
  const [userNotice, setUserNotice] = useState("");
  const [adminNotice, setAdminNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      userNotice,
      adminNotice,
    };

    try {
      const res: AxiosResponse<any> = await betService.notice(data);

      if (res.data?.error === false) {
        toast.success(
          res.data.message || "Notice submitted successfully!"
        );
        setUserNotice("");
        setAdminNotice("");
      } else {
        toast.error(res.data.message || "Failed to send notices.");
      }
    } catch (error) {
      console.error("Error sending notices:", error);
      toast.error("Failed to send notices.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        padding: "24px 12px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background: "#172b4d",
            padding: "18px 22px",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            Send Notices
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              color: "#cbd5e1",
              fontSize: "13px",
            }}
          >
            Send notice messages to users and admins
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "22px",
          }}
        >
          {/* USER NOTICE */}
          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              User Notice
            </label>

            <textarea
              value={userNotice}
              onChange={(e) => setUserNotice(e.target.value)}
              placeholder="Enter notice for users..."
              required
              rows={4}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#111827",
                background: "#ffffff",
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(37,99,235,0.10)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d1d5db";
                e.currentTarget.style.boxShadow = "none";
              }}
            />

            <div
              style={{
                textAlign: "right",
                fontSize: "11px",
                color: "#9ca3af",
                marginTop: "4px",
              }}
            >
              {userNotice.length} characters
            </div>
          </div>

          {/* ADMIN NOTICE */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Admin Notice
            </label>

            <textarea
              value={adminNotice}
              onChange={(e) => setAdminNotice(e.target.value)}
              placeholder="Enter notice for admins..."
              required
              rows={4}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#111827",
                background: "#ffffff",
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(37,99,235,0.10)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d1d5db";
                e.currentTarget.style.boxShadow = "none";
              }}
            />

            <div
              style={{
                textAlign: "right",
                fontSize: "11px",
                color: "#9ca3af",
                marginTop: "4px",
              }}
            >
              {adminNotice.length} characters
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "8px",
              padding: "13px 18px",
              background: loading ? "#94a3b8" : "#2563eb",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "0.2s",
            }}
          >
            {loading ? "Sending Notices..." : "Send Notices"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Notices;