import { useState } from "react";
import authFetch from "../utils/authFetch";

function TransactionForm({ onTransactionAdded, transaction }) {
  const [type, setType] = useState(transaction?.type || "income");
  const [amount, setAmount] = useState(transaction?.amount || 0);
  const [category, setCategory] = useState(transaction?.category || "salary");
  const [currency, setCurrency] = useState(transaction?.currency || "CUP");
  const [description, setDescription] = useState(
    transaction?.description || "",
  );
  const [date, setDate] = useState(transaction?.date || "");

  function handleSubmit(e) {
    e.preventDefault();
    console.log(category);
    const transaction_body = {
      type,
      amount,
      category,
      currency,
      description,
      date,
    };
    const method = transaction?.id ? "PUT" : "POST";
    const url = transaction?.id
      ? `transactions/${transaction.id}`
      : "transactions";
    authFetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction_body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(`Operation ${method} successful:`, data);
        onTransactionAdded(); // Notify parent component to refresh data
        setType("income");
        setAmount(0);
        setCategory("food");
        setCurrency("CUP");
        setDescription("");
        setDate("");
      })
      .catch((error) =>
        console.error(`Error during ${method} operation:`, error),
      );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold text-gray-700 mb-4">
        {transaction ? "Edit Transaction" : "Add Transaction"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <select
          className="border rounded p-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          className="border rounded p-2"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          placeholder="Amount"
        />
        <select
          className="border rounded p-2"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            if (type === "income" && e.target.value === "food")
              setCategory("salary");
            if (type === "expense" && e.target.value === "salary")
              setCategory("food");
          }}
        >
          {type === "income" ? (
            <>
              <option value="salary">Salary</option>
              <option value="other">Other</option>
            </>
          ) : (
            <>
              <option value="food">Food</option>
              <option value="transportation">Transportation</option>
              <option value="entertainment">Entertainment</option>
              <option value="utilities">Utilities</option>
              <option value="other">Other</option>
            </>
          )}
        </select>
        <select
          className="border rounded p-2"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="CUP">CUP</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        <input
          className="border rounded p-2"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          className="border rounded p-2"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded p-2"
          type="submit"
        >
          {transaction ? "Update Transaction" : "Add Transaction"}
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;
