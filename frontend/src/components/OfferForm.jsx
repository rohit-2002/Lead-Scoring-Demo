import React, { useState } from "react";

const OfferForm = ({ onSave }) => {
  const [form, setForm] = useState({
    name: "",
    valueProps: "",
    useCases: "",
  });

  const handleChange = ({ target: { name, value } }) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const parseLines = (text) =>
    text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: form.name.trim(),
      value_props: parseLines(form.valueProps),
      ideal_use_cases: parseLines(form.useCases),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Offer</h2>

      <label htmlFor="name" className="block text-sm">
        Name
      </label>
      <input
        id="name"
        name="name"
        required
        value={form.name}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <label htmlFor="valueProps" className="block text-sm">
        Value props (one per line)
      </label>
      <textarea
        id="valueProps"
        name="valueProps"
        required
        value={form.valueProps}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        rows={4}
      />

      <label htmlFor="useCases" className="block text-sm">
        Ideal use cases (one per line)
      </label>
      <textarea
        id="useCases"
        name="useCases"
        required
        value={form.useCases}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        rows={3}
      />

      <button
        type="submit"
        className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Save Offer
      </button>
    </form>
  );
};

export default OfferForm;
