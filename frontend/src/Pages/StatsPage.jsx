import SummaryCard from "../Components/SummaryCard";
import MonthlyChart from "../Components/MonthlyChart";
import useFetch from "../hooks/useFetch";

function StatsPage() {
  const {
    data: summary,
    loading: summaryLoading,
    error: summaryError,
  } = useFetch("stats/summary");

  const {
    data: transactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useFetch("transactions");

  if (summaryLoading || transactionsLoading) {
    return <p>Loading...</p>;
  }

  if (summaryError) {
    return <p>Error loading summary data: {summaryError.message}</p>;
  }

  if (transactionsError) {
    return <p>Error loading transactions data: {transactionsError.message}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Statistics</h1>
      <SummaryCard summary={summary} />
      <MonthlyChart transactions={transactions} />
    </div>
  );
}

export default StatsPage;
