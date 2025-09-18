import React, { useState, useEffect, useCallback, useMemo } from "react";
import OfferForm from "./components/OfferForm";
import CSVUpload from "./components/CSVUpload";
import Results from "./components/Results";
import IntentChart from "./components/IntentChart";
import Login from "./components/Login";
import axios from "axios";
import { apiUrl } from "./utils/api.js";

const api = axios.create({ baseURL: apiUrl("/api") });

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [offerId, setOfferId] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");

  const withLoading = async (fn) => {
    setLoading(true);
    try {
      await fn();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    setOfferId(null);
    setResults([]);
  }, []);

  const filteredResults = useMemo(() => {
    if (filter === "All") return results;
    return results.filter((r) => r.intent === filter);
  }, [results, filter]);

  const createOffer = useCallback(async (data) => {
    await withLoading(async () => {
      const { data: res } = await api.post("/offer", data);
      setOfferId(res.offer._id);
      alert("Offer saved. Now upload leads and click Run Scoring.");
    });
  }, []);

  const fetchResults = useCallback(async () => {
    if (!token) return;

    try {
      await withLoading(async () => {
        const { data } = await api.get("/results");
        setResults(data.results || []);
      });
    } catch (error) {
      console.error("Error fetching results:", error);
      if (error.response?.status === 403) {
        console.log("Authentication failed, logging out");
        handleLogout();
      }
    }
  }, [token, handleLogout]);

  const runScoring = useCallback(async () => {
    if (!offerId) return alert("Create an offer first.");
    await withLoading(async () => {
      await api.post("/score", { offerId });
      await fetchResults();
    });
  }, [offerId, fetchResults]);

  const clearAllData = useCallback(async () => {
    if (
      !confirm(
        "Are you sure you want to delete all leads and results? This action cannot be undone."
      )
    ) {
      return;
    }

    await withLoading(async () => {
      try {
        const { data } = await api.delete("/leads");
        setResults([]);
        alert(data.message || "All data cleared successfully");
      } catch (error) {
        console.error("Error clearing data:", error);
        alert("Failed to clear data. Please try again.");
      }
    });
  }, []);

  useEffect(() => {
    if (token) {
      fetchResults();
    }
  }, [token, fetchResults]);

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Lead Scoring Demo</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OfferForm onSave={createOffer} />
          <CSVUpload api={api} />
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-3">
            <button
              onClick={runScoring}
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Running..." : "Run Scoring"}
            </button>
            <button
              onClick={clearAllData}
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                loading
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              Clear All Data
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <IntentChart results={filteredResults} />

        <div className="mt-6">
          <Results
            results={filteredResults}
            onRefresh={fetchResults}
            filter={filter}
            setFilter={setFilter}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
