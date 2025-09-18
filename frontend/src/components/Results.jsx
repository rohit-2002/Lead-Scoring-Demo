import React, { useCallback, useMemo } from "react";

const Badge = ({ intent }) => {
  const color =
    intent === "High"
      ? "bg-green-100 text-green-800"
      : intent === "Medium"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";

  return <span className={`px-2 py-1 rounded text-sm ${color}`}>{intent}</span>;
};

const Results = ({ results, onRefresh, filter, setFilter }) => {
  const filteredResults = useMemo(() => {
    if (filter === "All") return results;
    return results.filter((r) => r.intent === filter);
  }, [results, filter]);

  const exportCSV = useCallback(() => {
    const header = "name,role,company,industry,intent,score,reasoning";
    const rows = filteredResults.map((r) => {
      const lead = r.lead || {};
      const reasoning = (r.reasoning || "").replace(/"/g, '""');
      return [
        lead.name,
        lead.role,
        lead.company,
        lead.industry,
        r.intent,
        r.score,
        `"${reasoning}"`,
      ].join(",");
    });
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "results.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredResults]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Results</h3>
        <div className="space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="All">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button
            onClick={onRefresh}
            className="px-2 py-1 border rounded hover:bg-gray-100"
          >
            Refresh
          </button>
          <button
            onClick={exportCSV}
            className="px-2 py-1 border rounded hover:bg-gray-100"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Name</th>
              <th>Role</th>
              <th>Company</th>
              <th>Industry</th>
              <th>Intent</th>
              <th>Score</th>
              <th>Reasoning</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((r, i) => {
              const lead = r.lead || {};
              return (
                <tr key={r._id || `${lead.name}-${i}`} className="border-t">
                  <td className="p-2">{lead.name}</td>
                  <td>{lead.role}</td>
                  <td>{lead.company}</td>
                  <td>{lead.industry}</td>
                  <td>
                    <Badge intent={r.intent} />
                  </td>
                  <td>{r.score}</td>
                  <td className="max-w-xs truncate">{r.reasoning}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Results;
