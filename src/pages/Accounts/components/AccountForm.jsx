/**
 * AccountForm — formulario para CREAR una cuenta.
 * Solo campos del AccountCreateRequest: accountType, gmfExempt, customerId.
 * El número, estado y balance los genera el backend automáticamente.
 *
 * Props:
 *   onSubmit    {function}  payload validado { accountType, gmfExempt, customerId }
 *   onCancel    {function}
 *   isLoading   {boolean}
 */
import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:8080";

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
  if (!f.accountType)  e.accountType  = "Selecciona el tipo de cuenta.";
  if (!f.customerId)   e.customerId   = "Selecciona un cliente.";
  return e;
};

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
  const [fields,   setFields]   = useState(EMPTY);
  const [errors,   setErrors]   = useState({});
  const [touched,  setTouched]  = useState({});
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [customersError,   setCustomersError]   = useState(false);

  /* Cargar clientes para el select */
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/customers/api/getAll`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCustomers(data);
      } catch {
        setCustomersError(true);
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

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

        {/* Cliente — ancho completo */}
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
          ) : (
            <select
              value={fields.customerId}
              onChange={(e) => set("customerId", e.target.value)}
              onBlur={() => blur("customerId")}
              className={inputBase(!!errors.customerId)}
            >
              <option value="">Seleccionar cliente…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.names} {c.surnames} — {c.identificationType} {c.identificationNumber}
                </option>
              ))}
            </select>
          )}
          <ErrorMsg msg={errors.customerId} />
        </div>

        {/* GMF Exento — toggle checkbox estilizado */}
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