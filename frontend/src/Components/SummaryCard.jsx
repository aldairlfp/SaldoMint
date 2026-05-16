const CURRENCY_SYMBOL = { USD: "$", EUR: "€", CUP: "CUP" };

function CurrencySection({ currency, data }) {
  const symbol = CURRENCY_SYMBOL[currency] ?? currency;
  const fmt = (n) =>
    Number(n).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const balance = Number(data.net_balance);

  return (
    <div className="bg-white shadow-md rounded-xl p-5 flex-1 min-w-60">
      <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold uppercase px-2 py-1 rounded mb-4">
        {currency}
      </span>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Income</p>
          <p className="text-green-500 font-semibold">
            {symbol} {fmt(data.total_income)}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Expenses</p>
          <p className="text-red-500 font-semibold">
            {symbol} {fmt(data.total_expense)}
          </p>
        </div>
        <div className="border-t pt-3 flex justify-between items-center">
          <p className="text-sm font-medium text-gray-700">Net Balance</p>
          <p
            className={`font-bold text-lg ${balance >= 0 ? "text-blue-600" : "text-red-600"}`}
          >
            {symbol} {fmt(balance)}
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ summary }) {
  const currencies = Object.entries(summary);

  if (currencies.length === 0) {
    return <p className="text-gray-500">No data available.</p>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-gray-700 mb-4">
        Financial Summary
      </h2>
      <div className="flex flex-wrap gap-4">
        {currencies.map(([currency, data]) => (
          <CurrencySection key={currency} currency={currency} data={data} />
        ))}
      </div>
    </div>
  );
}

export default SummaryCard;
