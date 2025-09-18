import React, { useState } from "react";

const CSVUpload = ({ api }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const upload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please choose a CSV file first.");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    try {
      setLoading(true);
      setMessage("");
      const res = await api.post("/leads/upload", fd);
      setMessage(`Uploaded ${res.data?.count || 0} leads successfully.`);
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage(`Upload failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={upload} className="bg-white p-4 rounded shadow space-y-2">
      <h2 className="font-semibold">Upload Leads (CSV)</h2>

      <label
        htmlFor="csvFile"
        className="block text-sm font-medium text-gray-700"
      >
        Select CSV File
      </label>
      <input
        id="csvFile"
        type="file"
        accept=".csv"
        onChange={({ target }) => setFile(target.files[0])}
        className="mb-2 block w-full text-sm"
      />

      <div className="text-xs text-gray-600">
        CSV headers:{" "}
        <code>name, role, company, industry, location, linkedin_bio</code>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`px-3 py-2 rounded text-white ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && <div className="text-sm mt-1 text-gray-800">{message}</div>}
    </form>
  );
};

export default CSVUpload;
