// App.jsx
import { useState } from "react";

export default function App() {
  const [data, setData] = useState([]);
  const [commodity, setCommodity] = useState("Soyabean");
  const [state, setState] = useState("Maharashtra");

  const API_KEY = "579b464db66ec23bdd00000183ee1027015a4cf26fd984c7ca5691ee";

  const fetchData = async () => {
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&limit=20&filters[state]=${state}&filters[commodity]=${commodity}`;
    const res = await fetch(url);
    const json = await res.json();
    setData(json.records || []);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Market Price</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="p-2 rounded border"
        >
          <option>Maharashtra</option>
          <option>Andhra Pradesh</option>
          <option>Madhya Pradesh</option>
          <option>Uttar Pradesh</option>
        </select>

        <select
          value={commodity}
          onChange={(e) => setCommodity(e.target.value)}
          className="p-2 rounded border"
        >
          <option>Soyabean</option>
          <option>Onion</option>
          <option>Wheat</option>
          <option>Tomato</option>
          <option>Cotton</option>
        </select>

        <button
          onClick={fetchData}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <table className="w-full border bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">District</th>
            <th className="p-2 border">Market</th>
            <th className="p-2 border">Commodity</th>
            <th className="p-2 border">Variety</th>
            <th className="p-2 border">Min Price</th>
            <th className="p-2 border">Max Price</th>
            <th className="p-2 border">Modal Price</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="p-2 border">{row.district}</td>
              <td className="p-2 border">{row.market}</td>
              <td className="p-2 border">{row.commodity}</td>
              <td className="p-2 border">{row.variety}</td>
              <td className="p-2 border">{row.min_price}</td>
              <td className="p-2 border">{row.max_price}</td>
              <td className="p-2 border">{row.modal_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
