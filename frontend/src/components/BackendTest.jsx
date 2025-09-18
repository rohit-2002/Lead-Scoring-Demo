import React, { useState, useEffect } from "react";
import { apiUrl } from "../utils/api.js";

const BackendTest = () => {
  const [status, setStatus] = useState("Testing...");
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const testBackend = async () => {
      try {
        const healthUrl = apiUrl("/health");
        console.log("Testing backend health at:", healthUrl);

        const response = await fetch(healthUrl);
        const data = await response.json();

        setStatus("✅ Backend is working!");
        setDetails(data);
      } catch (error) {
        console.error("Backend test failed:", error);
        setStatus("❌ Backend connection failed");
        setDetails({ error: error.message });
      }
    };

    testBackend();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded mb-4">
      <h3 className="font-bold">Backend Status: {status}</h3>
      {details && (
        <pre className="text-xs mt-2 bg-white p-2 rounded overflow-auto">
          {JSON.stringify(details, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default BackendTest;
