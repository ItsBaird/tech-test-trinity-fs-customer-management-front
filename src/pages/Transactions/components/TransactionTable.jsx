const TYPE_BADGE = {
  CONSIGNACION: {
    label: "Consignación",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  RETIRO: {
    label: "Retiro",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  TRANSFERENCIA: {
    label: "Transferencia",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
};

/* ─── Skeleton row ─── */
const SkeletonRow = () => (
  <tr className="border-b border-gray-100 last:border-0">
    {[...Array(5)].map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div
          className="h-4 bg-gray-100 rounded-md animate-pulse"
          style={{ width: `${60 + (i % 3) * 20}%` }}
        />
      </td>
    ))}
  </tr>
);

/* ─── Empty state ─── */
const EmptyState = () => (
  <tr>
    <td colSpan={5}>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gray-400">
            <path
              d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-700">Sin transacciones</p>
        <p className="text-xs text-gray-400 mt-1">
          Registra la primera transacción con el botón de arriba.
        </p>
      </div>
    </td>
  </tr>
);

/* ─── Desktop row ─── */
const TransactionRow = ({ tx }) => {
  const badge = TYPE_BADGE[tx.transactionType] ?? {
    label: tx.transactionType,
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
  };

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">

      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
          {badge.label}
        </span>
      </td>

      <td className="px-4 py-3 font-semibold text-gray-900 tabular-nums whitespace-nowrap">
        {formatCurrency(tx.amount)}
      </td>

      <td className="px-4 py-3 text-gray-600 tabular-nums">
        {tx.sourceAccountNumber ?? <span className="text-gray-300">—</span>}
      </td>

      <td className="px-4 py-3 text-gray-600 tabular-nums">
        {tx.destinationAccountNumber ?? <span className="text-gray-300">—</span>}
      </td>

      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
        {formatDate(tx.transactionDate)}
      </td>
    </tr>
  );
};

/* ─── Mobile card ─── */
const TransactionCard = ({ tx }) => {
  const badge = TYPE_BADGE[tx.transactionType] ?? {
    label: tx.transactionType,
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-base font-semibold text-gray-900">
            {formatCurrency(tx.amount)}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
          {badge.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-400 mb-0.5">Cuenta origen</p>
          <p className="font-medium text-gray-700">{tx.sourceAccountNumber ?? "—"}</p>
        </div>
        <div>
          <p className="text-gray-400 mb-0.5">Cuenta destino</p>
          <p className="font-medium text-gray-700">{tx.destinationAccountNumber ?? "—"}</p>
        </div>
      </div>

      <div className="text-xs text-gray-400 pt-1 border-t border-gray-100">
        {formatDate(tx.transactionDate)}
      </div>
    </div>
  );
};

/* ─── Mobile skeleton ─── */
const MobileSkeletonCard = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 animate-pulse">
    <div className="flex justify-between">
      <div className="space-y-1.5">
        <div className="h-5 w-28 bg-gray-100 rounded" />
      </div>
      <div className="h-6 w-24 bg-gray-100 rounded-full" />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="h-8 bg-gray-100 rounded" />
      <div className="h-8 bg-gray-100 rounded" />
    </div>
    <div className="h-3 w-32 bg-gray-100 rounded" />
  </div>
);

/* ─── Mobile empty ─── */
const MobileEmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-gray-200 rounded-xl">
    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gray-400">
        <path
          d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <p className="text-sm font-medium text-gray-700">Sin transacciones</p>
    <p className="text-xs text-gray-400 mt-1">Registra la primera con el botón de arriba.</p>
  </div>
);

/* ─── Main component ─── */
const HEADERS = ["Tipo", "Monto", "Cuenta origen", "Cuenta destino", "Fecha"];

const TransactionTable = ({ transactions = [], isLoading = false }) => {
  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:block bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                {HEADERS.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : transactions.length === 0 ? (
                <EmptyState />
              ) : (
                transactions.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:hidden space-y-3">
        {isLoading ? (
          [...Array(4)].map((_, i) => <MobileSkeletonCard key={i} />)
        ) : transactions.length === 0 ? (
          <MobileEmptyState />
        ) : (
          transactions.map((tx) => <TransactionCard key={tx.id} tx={tx} />)
        )}
      </div>
    </>
  );
};

export default TransactionTable;