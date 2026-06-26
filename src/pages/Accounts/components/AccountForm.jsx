import { useState, useEffect } from "react";
import { getAllCustomers } from "../../../services/customerService";

const ACCOUNT_TYPES = [
  { value: "AHORROS",   label: "Cuenta de Ahorros" },
  { value: "CORRIENTE", label: "Cuenta Corriente" },
];

const EMPTY = {
  accountType: "",
  gmfExempt:   false,
  customerId:  "",
};

const validate = (f) => {
  const e = {};
  if (!f.accountType) e.accountType = "Selecciona el tipo de cuenta.";
  if (!f.customerId)  e.customerId  = "Selecciona un cliente.";
  return e;
};

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
  `w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 bg-white
   placeholder-gray-400 transition-colors focus:outline-none focus:ring-2
   ${hasError
     ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/40"
     : "border-gray-200 focus:border-[#16A34A] focus:ring-[#16A34A]/20"
   }`;

const Label = ({ children }) => (
  <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
    {children}
  </label>
);

/* ── Componente principal ── */
const AccountForm = ({ onSubmit, onCancel, isLoading = false }) => {
  const [fields,           setFields]           = useState(EMPTY);
  const [errors,           setErrors]           = useState({});
  const [touched,          setTouched]          = useState({});
  const [customers,        setCustomers]        = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [customersError,   setCustomersError]   = useState(false);
  const [search,           setSearch]           = useState("");
  const [dropdownOpen,     setDropdownOpen]     = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
      } catch {
        setCustomersError(true);
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  /* Filtrar por número de identificación, nombre o apellido */
  const filtered = search.trim()
    ? customers.filter((c) =>
        c.identificationNumber.includes(search.trim()) ||
        `${c.names} ${c.surnames}`.toLowerCase().includes(search.trim().toLowerCase())
      )
    : customers;

  const selectedCustomer = customers.find((c) => String(c.id) === String(fields.customerId));

  const selectCustomer = (c) => {
    const next = { ...fields, customerId: String(c.id) };
    setFields(next);
    setSearch("");
    setDropdownOpen(false);
    if (touched.customerId) {
      setErrors((prev) => ({ ...prev, customerId: validate(next).customerId }));
    }
  };

  const clearCustomer = () => {
    const next = { ...fields, customerId: "" };
    setFields(next);
    setSearch("");
    if (touched.customerId) {
      setErrors((prev) => ({ ...prev, customerId: validate(next).customerId }));
    }
  };

  const set = (key, value) => {
    const next = { ...fields, [key]: value };
    setFields(next);
    if (touched[key]) {
      setErrors((prev) => ({ ...prev, [key]: validate(next)[key] }));
    }
  };

  const blur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: validate(fields)[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(fields).map((k) => [k, true]));
    setTouched(allTouched);
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({
      accountType: fields.accountType,
      gmfExempt:   fields.gmfExempt,
      customerId:  Number(fields.customerId),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Tipo de cuenta */}
        <div>
          <Label>Tipo de cuenta</Label>
          <select
            value={fields.accountType}
            onChange={(e) => set("accountType", e.target.value)}
            onBlur={() => blur("accountType")}
            className={inputBase(!!errors.accountType)}
          >
            <option value="">Seleccionar…</option>
            {ACCOUNT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <ErrorMsg msg={errors.accountType} />
        </div>

        {/* Cliente con búsqueda*/}
        <div className="sm:col-span-2">
          <Label>Cliente titular</Label>

          {loadingCustomers ? (
            <div className="w-full rounded-lg border border-gray-200 px-3 py-2.5 bg-gray-50 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ) : customersError ? (
            <p className="text-xs text-red-500 mt-1">
              No se pudieron cargar los clientes. Recarga la página.
            </p>
          ) : selectedCustomer ? (
            /* Cliente ya seleccionado — mostrar pill con opción de limpiar */
            <div className={`
              flex items-center justify-between gap-2
              rounded-lg border px-3 py-2.5 bg-white
              ${errors.customerId
                ? "border-red-300 bg-red-50/40"
                : "border-[#16A34A] bg-[#DCFCE7]/40"
              }
            `}>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {selectedCustomer.names} {selectedCustomer.surnames}
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  {selectedCustomer.identificationType} {selectedCustomer.identificationNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={clearCustomer}
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                title="Cambiar cliente"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ) : (
            /* Buscador y dropdown */
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
                  onBlur={() => {
                    setTimeout(() => {
                      setDropdownOpen(false);
                      setTouched((prev) => ({ ...prev, customerId: true }));
                      setErrors((prev) => ({ ...prev, customerId: validate(fields).customerId }));
                    }, 150);
                  }}
                  placeholder="Buscar por cédula o nombre…"
                  className={`${inputBase(!!errors.customerId)} pl-9`}
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
                    filtered.map((c) => (
                      <li
                        key={c.id}
                        onMouseDown={() => selectCustomer(c)}
                        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[#DCFCE7]/60 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {c.names} {c.surnames}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            {c.identificationType} {c.identificationNumber}
                          </p>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          )}

          <ErrorMsg msg={errors.customerId} />
        </div>

        {/* GMF Exento */}
        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={fields.gmfExempt}
                onChange={(e) => set("gmfExempt", e.target.checked)}
                className="sr-only peer"
              />
              <div className="
                w-10 h-6 rounded-full border-2 border-gray-200 bg-gray-100
                peer-checked:bg-[#16A34A] peer-checked:border-[#16A34A]
                transition-colors
                peer-focus:ring-2 peer-focus:ring-[#16A34A]/30
              "/>
              <div className="
                absolute top-0.5 left-0.5
                w-4 h-4 rounded-full bg-white shadow
                transition-transform
                peer-checked:translate-x-4
              "/>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Exenta de GMF</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Solo se permite una cuenta exenta de GMF por cliente.
              </p>
            </div>
          </label>
        </div>

      </div>

      {/* Nota informativa */}
      <div className="mt-4 flex gap-2 rounded-lg bg-[#DCFCE7] px-3 py-2.5">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-[#16A34A] shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p className="text-xs text-[#166534] leading-relaxed">
          El número de cuenta, estado inicial (Activa) y saldo ($0) son
          asignados automáticamente por el sistema.
        </p>
      </div>

      {/* Acciones */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="
            w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium
            text-gray-600 border border-gray-200
            hover:bg-gray-50 hover:border-gray-300
            transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300
            disabled:opacity-50
          "
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || loadingCustomers}
          className="
            w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-white
            bg-[#16A34A] hover:bg-[#166534] active:bg-[#14532d]
            transition-colors focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:ring-offset-2
            disabled:opacity-60 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {isLoading && (
            <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
              <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
            </svg>
          )}
          {isLoading ? "Creando…" : "Crear cuenta"}
        </button>
      </div>
    </form>
  );
};

export default AccountForm;