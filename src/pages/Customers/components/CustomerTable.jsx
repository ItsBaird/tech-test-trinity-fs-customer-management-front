const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
};

/* Badge tipo de identificación — paleta basada en el verde primario */
const TypeBadge = ({ type }) => {
  const styles = {
    CC: "bg-[#DCFCE7] text-[#166534] border border-[#16A34A]/20",
    CE: "bg-amber-50 text-amber-700 border border-amber-200",
    PA: "bg-sky-50 text-sky-700 border border-sky-200",
  };
  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 rounded-md
      text-xs font-semibold tracking-wide
      ${styles[type] ?? "bg-gray-100 text-gray-600 border border-gray-200"}
    `}>
      {type}
    </span>
  );
};

/* ── Skeleton ── */
const SkeletonRow = () => (
  <tr className="border-b border-gray-100 animate-pulse">
    {Array.from({ length: 9 }).map((_, i) => (
      <td key={i} className="px-4 py-3.5">
        <div className="h-3 rounded-full bg-gray-100" style={{ width: i === 8 ? "3rem" : "75%" }} />
      </td>
    ))}
  </tr>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse space-y-3">
    <div className="flex justify-between items-center">
      <div className="h-3 w-8 bg-gray-100 rounded-full" />
      <div className="h-5 w-10 bg-gray-100 rounded-md" />
    </div>
    <div className="h-4 w-2/3 bg-gray-100 rounded-full" />
    <div className="h-3 w-1/2 bg-gray-100 rounded-full" />
    <div className="h-3 w-3/4 bg-gray-100 rounded-full" />
  </div>
);

/* ── Estado vacío ── */
const EmptyState = ({ colSpan }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#16A34A]">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-600">Sin clientes registrados</p>
        <p className="text-xs text-gray-400">Crea el primero con el botón "Nuevo cliente".</p>
      </div>
    </td>
  </tr>
);

const EmptyStateCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
    <div className="flex flex-col items-center gap-3 text-gray-400">
      <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#16A34A]">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-600">Sin clientes registrados</p>
      <p className="text-xs text-gray-400">Crea el primero con el botón "Nuevo cliente".</p>
    </div>
  </div>
);

/* ── Fila de acción — dos botones ── */
const ActionBtn = ({ onClick, title, variant, children }) => {
  const base = "w-8 h-8 flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2";
  const variants = {
    edit:   "text-[#16A34A] hover:text-[#166534] hover:bg-[#DCFCE7] focus:ring-[#16A34A]/30",
    delete: "text-red-400 hover:text-red-600 hover:bg-red-50 focus:ring-red-300",
  };
  return (
    <button onClick={onClick} title={title} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
};

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

/* ══════════════════════════════════════════════
   VISTA MOBILE: tarjetas apiladas
   ══════════════════════════════════════════════ */
const CustomerCard = ({ customer: c, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
    {/* Header de la card */}
    <div className="flex items-start justify-between gap-2 mb-3">
      <div className="min-w-0">
        <p className="font-semibold text-gray-900 truncate">
          {c.names} {c.surnames}
        </p>
        <p className="text-xs text-gray-400 font-mono mt-0.5">#{c.id}</p>
      </div>
      <TypeBadge type={c.identificationType} />
    </div>

    {/* Datos en grid 2 col */}
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4">
      <div>
        <dt className="text-gray-400 uppercase tracking-wide font-medium">Número ID</dt>
        <dd className="text-gray-700 font-mono mt-0.5">{c.identificationNumber}</dd>
      </div>
      <div>
        <dt className="text-gray-400 uppercase tracking-wide font-medium">Nacimiento</dt>
        <dd className="text-gray-700 mt-0.5">{formatDate(c.dateOfBirth)}</dd>
      </div>
      <div className="col-span-2">
        <dt className="text-gray-400 uppercase tracking-wide font-medium">Correo</dt>
        <dd className="text-gray-700 mt-0.5 truncate">{c.email}</dd>
      </div>
      <div>
        <dt className="text-gray-400 uppercase tracking-wide font-medium">Creación</dt>
        <dd className="text-gray-500 mt-0.5">{formatDate(c.createdAt)}</dd>
      </div>
    </dl>

    {/* Acciones siempre visibles en mobile */}
    <div className="flex gap-2 pt-3 border-t border-gray-100">
      <button
        onClick={() => onEdit(c)}
        className="
          flex-1 flex items-center justify-center gap-2
          py-2 rounded-lg text-sm font-medium
          text-[#16A34A] bg-[#DCFCE7] hover:bg-[#bbf7d0]
          transition-colors focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30
        "
      >
        <EditIcon /> Editar
      </button>
      <button
        onClick={() => onDelete(c)}
        className="
          flex-1 flex items-center justify-center gap-2
          py-2 rounded-lg text-sm font-medium
          text-red-600 bg-red-50 hover:bg-red-100
          transition-colors focus:outline-none focus:ring-2 focus:ring-red-300
        "
      >
        <DeleteIcon /> Eliminar
      </button>
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════════════════════ */
const COLUMNS = ["ID", "Tipo ID", "Número ID", "Nombres", "Apellidos", "Correo", "Nacimiento", "Creación", ""];

const CustomerTable = ({ customers = [], onEdit, onDelete, isLoading = false }) => {
  return (
    <>
      {/* ── MOBILE (< md): tarjetas ── */}
      <div className="md:hidden space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : customers.length === 0
            ? <EmptyStateCard />
            : customers.map((c) => (
                <CustomerCard key={c.id} customer={c} onEdit={onEdit} onDelete={onDelete} />
              ))
        }
      </div>

      {/* ── DESKTOP (≥ md): tabla ── */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {COLUMNS.map((col, i) => (
                <th
                  key={i}
                  className="
                    px-4 py-3 text-left text-xs font-semibold
                    text-gray-500 uppercase tracking-wider whitespace-nowrap
                  "
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : customers.length === 0
                ? <EmptyState colSpan={COLUMNS.length} />
                : customers.map((c, idx) => (
                    <tr
                      key={c.id}
                      className={`
                        group border-b border-gray-100 last:border-0
                        transition-colors hover:bg-[#DCFCE7]/30
                        ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}
                      `}
                    >
                      {/* ID */}
                      <td className="px-4 py-3.5 text-gray-400 font-mono text-xs tabular-nums">
                        #{c.id}
                      </td>
                      {/* Tipo ID */}
                      <td className="px-4 py-3.5">
                        <TypeBadge type={c.identificationType} />
                      </td>
                      {/* Número */}
                      <td className="px-4 py-3.5 font-mono text-xs text-gray-700 tabular-nums whitespace-nowrap">
                        {c.identificationNumber}
                      </td>
                      {/* Nombres */}
                      <td className="px-4 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                        {c.names}
                      </td>
                      {/* Apellidos */}
                      <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">
                        {c.surnames}
                      </td>
                      {/* Email */}
                      <td className="px-4 py-3.5 text-gray-600 max-w-[200px]">
                        <span className="block truncate" title={c.email}>{c.email}</span>
                      </td>
                      {/* Nacimiento */}
                      <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap tabular-nums text-xs">
                        {formatDate(c.dateOfBirth)}
                      </td>
                      {/* Creación */}
                      <td className="px-4 py-3.5 text-gray-400 whitespace-nowrap tabular-nums text-xs">
                        {formatDate(c.createdAt)}
                      </td>
                      {/* Acciones — revelar en hover */}
                      <td className="px-4 py-3.5">
                        <div className="
                          flex items-center gap-0.5 justify-end
                          opacity-0 group-hover:opacity-100
                          translate-x-1 group-hover:translate-x-0
                          transition-all duration-150
                        ">
                          <ActionBtn onClick={() => onEdit(c)} title="Editar cliente" variant="edit">
                            <EditIcon />
                          </ActionBtn>
                          <ActionBtn onClick={() => onDelete(c)} title="Eliminar cliente" variant="delete">
                            <DeleteIcon />
                          </ActionBtn>
                        </div>
                      </td>
                    </tr>
                  ))
            }
          </tbody>
        </table>

        {/* Footer conteo */}
        {!isLoading && customers.length > 0 && (
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/60">
            <p className="text-xs text-gray-400">
              {customers.length} cliente{customers.length !== 1 ? "s" : ""} registrado{customers.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerTable;