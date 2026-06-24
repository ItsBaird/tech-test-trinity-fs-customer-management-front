/**
 * AccountTable — tabla desktop / cards mobile para cuentas.
 *
 * Props:
 *   accounts   {array}
 *   onEdit     {function}   recibe el objeto account
 *   onDelete   {function}   recibe el objeto account
 *   isLoading  {boolean}
 */

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0,
  }).format(n ?? 0);

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-CO", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

/* ── Badges ── */
const StateBadge = ({ state }) => {
  const styles = {
    ACTIVA:    "bg-[#DCFCE7] text-[#166534] border-[#16A34A]/20",
    BLOQUEADA: "bg-amber-50 text-amber-700 border-amber-200",
    CANCELADA: "bg-red-50   text-red-700   border-red-200",
  };
  const labels = { ACTIVA: "Activa", BLOQUEADA: "Bloqueada", CANCELADA: "Cancelada" };
  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 rounded-md
      text-xs font-semibold tracking-wide border
      ${styles[state] ?? "bg-gray-100 text-gray-600 border-gray-200"}
    `}>
      {labels[state] ?? state}
    </span>
  );
};

const TypeBadge = ({ type }) => {
  const styles = {
    AHORROS:   "bg-sky-50 text-sky-700 border-sky-200",
    CORRIENTE: "bg-violet-50 text-violet-700 border-violet-200",
  };
  const labels = { AHORROS: "Ahorros", CORRIENTE: "Corriente" };
  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 rounded-md
      text-xs font-semibold tracking-wide border
      ${styles[type] ?? "bg-gray-100 text-gray-600 border-gray-200"}
    `}>
      {labels[type] ?? type}
    </span>
  );
};

const GmfBadge = ({ exempt }) =>
  exempt ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#16A34A]">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Exenta
    </span>
  ) : (
    <span className="text-xs text-gray-400">No exenta</span>
  );

/* ── Icons ── */
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── Skeleton ── */
const SkeletonRow = () => (
  <tr className="border-b border-gray-100 animate-pulse">
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="px-4 py-3.5">
        <div className="h-3 rounded-full bg-gray-100" style={{ width: i === 7 ? "3rem" : "75%" }}/>
      </td>
    ))}
  </tr>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse space-y-3">
    <div className="flex justify-between">
      <div className="h-3 w-24 bg-gray-100 rounded-full"/>
      <div className="h-5 w-16 bg-gray-100 rounded-md"/>
    </div>
    <div className="h-4 w-1/2 bg-gray-100 rounded-full"/>
    <div className="h-3 w-2/3 bg-gray-100 rounded-full"/>
  </div>
);

/* ── Empty ── */
const EmptyState = ({ colSpan }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#16A34A]">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-600">Sin cuentas registradas</p>
        <p className="text-xs text-gray-400">Crea la primera con el botón "Nueva cuenta".</p>
      </div>
    </td>
  </tr>
);

const EmptyStateCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#16A34A]">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-600">Sin cuentas registradas</p>
      <p className="text-xs text-gray-400">Crea la primera con el botón "Nueva cuenta".</p>
    </div>
  </div>
);

/* ── Card mobile ── */
const AccountCard = ({ account: a, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
    <div className="flex items-start justify-between gap-2 mb-3">
      <div className="min-w-0">
        <p className="font-mono font-semibold text-gray-900 text-sm">{a.accountNumber}</p>
        <p className="text-xs text-gray-400 mt-0.5">#{a.id}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <TypeBadge type={a.accountType}/>
        <StateBadge state={a.accountState}/>
      </div>
    </div>

    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4">
      <div>
        <dt className="text-gray-400 uppercase tracking-wide font-medium">Saldo</dt>
        <dd className="font-semibold text-gray-800 mt-0.5">{fmt(a.balance)}</dd>
      </div>
      <div>
        <dt className="text-gray-400 uppercase tracking-wide font-medium">GMF</dt>
        <dd className="mt-0.5"><GmfBadge exempt={a.gmfExempt}/></dd>
      </div>
      <div>
        <dt className="text-gray-400 uppercase tracking-wide font-medium">Cliente ID</dt>
        <dd className="text-gray-700 mt-0.5">#{a.customerId}</dd>
      </div>
      <div>
        <dt className="text-gray-400 uppercase tracking-wide font-medium">Creación</dt>
        <dd className="text-gray-500 mt-0.5">{formatDate(a.createdAt)}</dd>
      </div>
    </dl>

    <div className="flex gap-2 pt-3 border-t border-gray-100">
      <button
        onClick={() => onEdit(a)}
        className="
          flex-1 flex items-center justify-center gap-2 py-2 rounded-lg
          text-sm font-medium text-[#16A34A] bg-[#DCFCE7] hover:bg-[#bbf7d0]
          transition-colors focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30
        "
      >
        <EditIcon/> Editar
      </button>
      <button
        onClick={() => onDelete(a)}
        className="
          flex-1 flex items-center justify-center gap-2 py-2 rounded-lg
          text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100
          transition-colors focus:outline-none focus:ring-2 focus:ring-red-300
        "
      >
        <DeleteIcon/> Eliminar
      </button>
    </div>
  </div>
);

/* ── Componente principal ── */
const COLUMNS = ["ID", "Número", "Tipo", "Estado", "Saldo", "GMF", "Cliente", "Creación", ""];

const AccountTable = ({ accounts = [], onEdit, onDelete, isLoading = false }) => (
  <>
    {/* MOBILE */}
    <div className="md:hidden space-y-3">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i}/>)
        : accounts.length === 0
          ? <EmptyStateCard/>
          : accounts.map((a) => (
              <AccountCard key={a.id} account={a} onEdit={onEdit} onDelete={onDelete}/>
            ))
      }
    </div>

    {/* DESKTOP */}
    <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {COLUMNS.map((col, i) => (
              <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i}/>)
            : accounts.length === 0
              ? <EmptyState colSpan={COLUMNS.length}/>
              : accounts.map((a, idx) => (
                  <tr
                    key={a.id}
                    className={`
                      group border-b border-gray-100 last:border-0
                      transition-colors hover:bg-[#DCFCE7]/30
                      ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}
                    `}
                  >
                    <td className="px-4 py-3.5 text-gray-400 font-mono text-xs tabular-nums">#{a.id}</td>
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-gray-800 whitespace-nowrap tabular-nums">{a.accountNumber}</td>
                    <td className="px-4 py-3.5"><TypeBadge type={a.accountType}/></td>
                    <td className="px-4 py-3.5"><StateBadge state={a.accountState}/></td>
                    <td className="px-4 py-3.5 font-semibold text-gray-800 whitespace-nowrap tabular-nums">{fmt(a.balance)}</td>
                    <td className="px-4 py-3.5"><GmfBadge exempt={a.gmfExempt}/></td>
                    <td className="px-4 py-3.5 text-gray-500 font-mono text-xs tabular-nums">#{a.customerId}</td>
                    <td className="px-4 py-3.5 text-gray-400 whitespace-nowrap text-xs tabular-nums">{formatDate(a.createdAt)}</td>
                    <td className="px-4 py-3.5">
                      <div className="
                        flex items-center gap-0.5 justify-end
                        opacity-0 group-hover:opacity-100
                        translate-x-1 group-hover:translate-x-0
                        transition-all duration-150
                      ">
                        <button
                          onClick={() => onEdit(a)}
                          title="Editar cuenta"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#16A34A] hover:text-[#166534] hover:bg-[#DCFCE7] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30"
                        >
                          <EditIcon/>
                        </button>
                        <button
                          onClick={() => onDelete(a)}
                          title="Eliminar cuenta"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                          <DeleteIcon/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
          }
        </tbody>
      </table>

      {!isLoading && accounts.length > 0 && (
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/60">
          <p className="text-xs text-gray-400">
            {accounts.length} cuenta{accounts.length !== 1 ? "s" : ""} registrada{accounts.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  </>
);

export default AccountTable;