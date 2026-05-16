import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

function MonthlyChart({ transactions }) {
  const [selectCurrency, setSelectCurrency] = useState("USD");

  const monthlyData = transactions.reduce((acc, transaction) => {
    const currency = transaction.currency;
    const month = new Date(transaction.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (!acc[currency]) {
      acc[currency] = {};
    }
    if (!acc[currency][month]) {
      acc[currency][month] = { income: 0, expense: 0 };
    }
    acc[currency][month][transaction.type] += transaction.amount;
    return acc;
  }, {});

  const chartData = Object.keys(monthlyData[selectCurrency] || {})
    .map((month) => ({
      month,
      income: monthlyData[selectCurrency][month].income,
      expense: monthlyData[selectCurrency][month].expense,
    }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Monthly {selectCurrency} Overview
        </h2>
        <select
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={selectCurrency}
          onChange={(e) => setSelectCurrency(e.target.value)}
        >
          {Object.entries(monthlyData).map(([currency]) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            cursor={{ fill: "#f9fafb" }}
          />
          <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "16px" }} />
          <Bar
            dataKey="income"
            name="Income"
            fill="#6366f1"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expense"
            name="Expense"
            fill="#f87171"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyChart;
