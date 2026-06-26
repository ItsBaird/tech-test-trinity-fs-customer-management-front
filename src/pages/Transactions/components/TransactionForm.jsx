import { useState, useEffect } from "react";
import { getAllAccounts } from "../../../services/accountService";

const TRANSACTION_TYPES = [
  {
    value: "CONSIGNACION",
    label: "Consignación",
    description: "Depositar dinero en una cuenta destino",
    requiresSource: false,
    requiresDest: true,
  },
  {
    value: "RETIRO",
    label: "Retiro",
    description: "Retirar dinero de una cuenta origen",
    requiresSource: true,
    requiresDest: false,
  },
  {
    value: "TRANSFERENCIA",
    label: "Transferencia",
    description: "Mover dinero entre dos cuentas",
    requiresSource: true,
    requiresDest: true,
  },
];

const INITIAL_FORM = {
  transactionType:      "",
  amount:               "",
  sourceAccountId:      "",
  destinationAccountId: "",
};

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0,
  }).format(n ?? 0);

/* ── Helpers visuales ── */
const ErrorMsg = ({ msg }) =>
  msg ? (
    <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
        <circle cx="6" cy="6" r="5.5" stroke="currentColor"/>
        <path d="M6 3.5v3M6 8h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      {msg}
    </p>
  ) : null;

const inputBase = (hasError) =>
  [
    "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 bg-white",
    "placeholder-gray-400 transition-colors focus:outline-none focus:ring-2",
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/40"
      : "border-gray-200 focus:border-[#16A34A] focus:ring-[#16A34A]/20",
  ].join(" ");

const Label = ({ children }) => (
  <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
    {children}
  </label>
);

/* ── Selector de tipo con radio buttons estilizados ── */
const TypeOption = ({ type, selected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(type.value)}
    className={[
      "flex items-start gap-3 px-3 py-2.5 rounded-xl border text-left w-full",
      "transition-colors focus:outline-none focus:ring-2 focus:ring-[#16A34A]",
      selected
        ? "border-[#16A34A] bg-[#F0FDF4]"
        : "border-gray-200 hover:border-gray-300 bg-white",
    ].join(" ")}
  >
    <span className={[
      "mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
      selected ? "border-[#16A34A]" : "border-gray-300",
    ].join(" ")}>
      {selected && <span className="w-2 h-2 rounded-full bg-[#16A34A]"/>}
    </span>
    <div>
      <p className="text-sm font-medium text-gray-900">{type.label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
    </div>
  </button>
);

/* ── Badge estado cuenta ── */
const StateBadge = ({ state }) => {
  const styles = {
    ACTIVA:    "bg-[#DCFCE7] text-[#166534]",
    BLOQUEADA: "bg-amber-50 text-amber-700",
    CANCELADA: "bg-red-50 text-red-700",
  };
  const labels = { ACTIVA: "Activa", BLOQUEADA: "Bloqueada", CANCELADA: "Cancelada" };
  return (
    <span className={`
      inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium
      ${styles[state] ?? "bg-gray-100 text-gray-600"}
    `}>
      {labels[state] ?? state}
    </span>
  );
};

const AccountSelector = ({
  label,
  accounts,
  loadingAccounts,
  accountsError,
  selectedId,
  onSelect,
  onClear,
  error,
  excludeId,       
}) => {
  const [search,       setSearch]       = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedAccount = accounts.find((a) => String(a.id) === String(selectedId));

  /* Filtrar por número de cuenta o tipo */
  const filtered = accounts.filter((a) => {
    if (excludeId && String(a.id) === String(excludeId)) return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      String(a.accountNumber).includes(q) ||
      a.accountType.toLowerCase().includes(q)
    );
  });

  if (loadingAccounts) return (
    <div>
      <Label>{label}</Label>
      <div className="w-full rounded-lg border border-gray-200 px-3 py-2.5 bg-gray-50 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2"/>
      </div>
    </div>
  );

  if (accountsError) return (
    <div>
      <Label>{label}</Label>
      <p className="text-xs text-red-500 mt-1">
        No se pudieron cargar las cuentas. Recarga la página.
      </p>
    </div>
  );

  return (
    <div>
      <Label>{label}</Label>

      {selectedAccount ? (
        /* Pill — cuenta seleccionada */
        <div className={`
          flex items-center justify-between gap-2
          rounded-lg border px-3 py-2.5 bg-white
          ${error
            ? "border-red-300 bg-red-50/40"
            : "border-[#16A34A] bg-[#DCFCE7]/40"
          }
        `}>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 font-mono">
              {selectedAccount.accountNumber}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-gray-500">
                {selectedAccount.accountType === "AHORROS" ? "Ahorros" : "Corriente"}
              </p>
              <StateBadge state={selectedAccount.accountState}/>
              <p className="text-xs text-gray-500">{fmt(selectedAccount.balance)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { onClear(); setSearch(""); }}
            className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Cambiar cuenta"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      ) : (
        /* Buscador con dropdown */
        <div className="relative">
          <div className="relative">
            <svg
              width="15" height="15" viewBox="0 0 24 24" fill="none"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            >
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setDropdownOpen(true); }}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
              placeholder="Buscar por número o tipo…"
              className={`${inputBase(!!error)} pl-9`}
            />
          </div>

          {dropdownOpen && (
            <ul className="
              absolute z-20 mt-1 w-full
              bg-white border border-gray-200 rounded-xl shadow-lg
              max-h-48 overflow-y-auto
            ">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-xs text-gray-400 text-center">
                  Sin resultados
                </li>
              ) : (
                filtered.map((a) => (
                  <li
                    key={a.id}
                    onMouseDown={() => { onSelect(a); setSearch(""); setDropdownOpen(false); }}
                    className={[
                      "flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer transition-colors",
                      a.accountState !== "ACTIVA"
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#DCFCE7]/60",
                    ].join(" ")}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 font-mono">
                        {a.accountNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {a.accountType === "AHORROS" ? "Ahorros" : "Corriente"} · {fmt(a.balance)}
                      </p>
                    </div>
                    <StateBadge state={a.accountState}/>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}

      <ErrorMsg msg={error}/>
    </div>
  );
};

/* ── Advertencia GMF ── */
const GmfWarning = () => (
  <div className="flex gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-amber-600 shrink-0 mt-0.5">
      <path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
    <p className="text-xs text-amber-700 leading-relaxed">
      Si la cuenta origen no está exenta, se aplicará un{" "}
      <strong>GMF del 0.4%</strong> sobre el monto. El débito total puede ser
      mayor al valor ingresado.
    </p>
  </div>
);


const TransactionForm = ({ onSubmit, onCancel, isLoading }) => {
  const [form,   setForm]   = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const [accounts,        setAccounts]        = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [accountsError,   setAccountsError]   = useState(false);

  /* Cargar cuentas */
  useEffect(() => {
    const fetch_ = async () => {
      try {
        const data = await getAllAccounts();
        setAccounts(Array.isArray(data) ? data : []);
      } catch {
        setAccountsError(true);
      } finally {
        setLoadingAccounts(false);
      }
    };
    fetch_();
  }, []);

  const selectedType = TRANSACTION_TYPES.find((t) => t.value === form.transactionType);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleTypeSelect = (value) => {
    setForm({ ...INITIAL_FORM, transactionType: value });
    setErrors({});
  };

  const validate = () => {
    const e = {};
    if (!form.transactionType) e.transactionType = "Selecciona un tipo de transacción.";
    const amount = parseFloat(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0)
      e.amount = "Ingresa un monto válido mayor a $0.";
    if (selectedType?.requiresSource && !form.sourceAccountId)
      e.sourceAccountId = "Selecciona la cuenta origen.";
    if (selectedType?.requiresDest && !form.destinationAccountId)
      e.destinationAccountId = "Selecciona la cuenta destino.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSubmit({
      transactionType:      form.transactionType,
      amount:               parseFloat(form.amount),
      sourceAccountId:      form.sourceAccountId      ? Number(form.sourceAccountId)      : null,
      destinationAccountId: form.destinationAccountId ? Number(form.destinationAccountId) : null,
    });
  };

  const showGmfWarning =
    selectedType?.value === "RETIRO" || selectedType?.value === "TRANSFERENCIA";

  return (
    <div className="space-y-5">

      {/* Tipo de transacción */}
      <div>
        <Label>Tipo de transacción</Label>
        <div className="grid grid-cols-1 gap-2 mt-1">
          {TRANSACTION_TYPES.map((type) => (
            <TypeOption
              key={type.value}
              type={type}
              selected={form.transactionType === type.value}
              onSelect={handleTypeSelect}
            />
          ))}
        </div>
        <ErrorMsg msg={errors.transactionType}/>
      </div>

      {/* Monto */}
      <div>
        <Label>Monto</Label>
        <p className="text-xs text-gray-400 mb-1.5">Ingresa el valor en pesos colombianos (COP).</p>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 select-none pointer-events-none">
            $
          </span>
          <input
            type="number"
            min="1"
            step="1"
            placeholder="0"
            value={form.amount}
            onChange={(e) => setField("amount", e.target.value)}
            className={`${inputBase(!!errors.amount)} pl-7`}
          />
        </div>
        <ErrorMsg msg={errors.amount}/>
      </div>

      {/* Cuenta origen */}
      {selectedType?.requiresSource && (
        <AccountSelector
          label="Cuenta origen"
          accounts={accounts}
          loadingAccounts={loadingAccounts}
          accountsError={accountsError}
          selectedId={form.sourceAccountId}
          onSelect={(a) => setField("sourceAccountId", String(a.id))}
          onClear={() => setField("sourceAccountId", "")}
          error={errors.sourceAccountId}
          excludeId={form.destinationAccountId}
        />
      )}

      {/* Cuenta destino */}
      {selectedType?.requiresDest && (
        <AccountSelector
          label="Cuenta destino"
          accounts={accounts}
          loadingAccounts={loadingAccounts}
          accountsError={accountsError}
          selectedId={form.destinationAccountId}
          onSelect={(a) => setField("destinationAccountId", String(a.id))}
          onClear={() => setField("destinationAccountId", "")}
          error={errors.destinationAccountId}
          excludeId={form.sourceAccountId}
        />
      )}

      {/* Advertencia GMF */}
      {showGmfWarning && <GmfWarning/>}

      {/* Acciones */}
      <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="
            flex-1 px-4 py-2.5 rounded-xl border border-gray-200
            text-sm font-medium text-gray-700
            hover:bg-gray-50 active:bg-gray-100
            transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="
            flex-1 inline-flex items-center justify-center gap-2
            px-4 py-2.5 rounded-xl
            bg-[#16A34A] hover:bg-[#166534] active:bg-[#14532d]
            text-white text-sm font-semibold
            shadow-sm shadow-[#16A34A]/20
            transition-colors focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:ring-offset-2
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
              </svg>
              Procesando…
            </>
          ) : (
            "Registrar transacción"
          )}
        </button>
      </div>
    </div>
  );
};

export default TransactionForm;