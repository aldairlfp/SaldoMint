import { useState, useEffect } from "react";
import TransactionList from "../Components/TransactionList";
import TransactionForm from "../Components/TransactionForm";
import authFetch from "../utils/authFetch";
import Modal from "../Components/Modal";

function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  function refreshData() {
    authFetch("transactions")
      .then((r) => r.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    refreshData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="max-w-2xl mx-auto mt-4 flex justify-end">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 transition-colors"
          onClick={() => setShowModal(true)}
        >
          + Add Transaction
        </button>
      </div>
      <TransactionList transactions={transactions} refreshData={refreshData} />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <TransactionForm
          onTransactionAdded={() => {
            refreshData();
            setShowModal(false);
          }}
        />
      </Modal>
    </>
  );
}

export default TransactionPage;
