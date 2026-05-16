import { useState } from "react";
import authFetch from "../utils/authFetch";
import Modal from "./Modal";
import TransactionForm from "./TransactionForm";

function TransactionList({ transactions, refreshData }) {
  const [editingId, setEditingId] = useState(null);
  const [doubleCheckDeleteId, setDoubleCheckDeleteId] = useState(null);

  function handleDelete(id) {
    authFetch(`transactions/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        refreshData(); // Notify parent component to refresh data
      })
      .catch((error) => console.error("Error deleting transaction:", error));
  }

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">Transactions</h1>
      <div className="flex flex-col gap-3">
        {[...transactions]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white shadow rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-700">
                    {transaction.description || "No description"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.category} · {transaction.date}
                  </p>
                  <p
                    className={`font-bold ${
                      transaction.type === "income"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {transaction.amount} {transaction.currency}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                    onClick={() => {
                      console.log("Editing transaction:", transaction);
                      setEditingId(transaction.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded"
                    onClick={() => setDoubleCheckDeleteId(transaction.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      <Modal isOpen={!!editingId} onClose={() => setEditingId(null)}>
        <TransactionForm
          transaction={transactions.find((t) => t.id === editingId)}
          onTransactionAdded={() => {
            refreshData();
            setEditingId(null);
          }}
        />
      </Modal>
      <Modal
        isOpen={!!doubleCheckDeleteId}
        onClose={() => setDoubleCheckDeleteId(null)}
      >
        <div className="bg-white shadow rounded-lg p-6 max-w-sm mx-auto mt-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Confirm Deletion
          </h2>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this transaction?
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
              onClick={() => setDoubleCheckDeleteId(null)}
            >
              Cancel
            </button>
            <button
              className="text-sm bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded"
              onClick={() => {
                handleDelete(doubleCheckDeleteId);
                setDoubleCheckDeleteId(null);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TransactionList;
