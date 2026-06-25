import { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";

const ACCOUNT_STATES = [
  { value: "ACTIVA",    label: "Activa",    color: "text-[#16A34A]" },
  { value: "BLOQUEADA", label: "Bloqueada", color: "text-amber-600"  },
  { value: "CANCELADA", label: "Cancelada", color: "text-red-600"    },
];

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
   transition-colors focus:outline-none focus:ring-2
   ${hasError
     ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/40"
     : "border-gray-200 focus:border-[#16A34A] focus:ring-[#16A34A]/20"
   }`;

const Label = ({ children }) => (
  <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
    {children}
  </label>
);

const AccountEditModal = ({ account, onSubmit, onCancel, isLoading = false }) => {
  const [accountState, setAccountState] = useState("");
  const [gmfExempt,    setGmfExempt]    = useState(false);
  const [errors,       setErrors]       = useState({});
  const [touched,      setTouched]      = useState({});

  /* Precargar valores al abrir */
  useEffect(() => {
    if (account) {
      setAccountState(account.accountState ?? "");
      setGmfExempt(account.gmfExempt ?? false);
      setErrors({});
      setTouched({});
    }
  }, [account]);

  const validate = () => {
    const e = {};
    if (!accountState) e.accountState = "Selecciona un estado.";
    return e;
  };

  const blur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, ...validate() }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ accountState: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({ accountState, gmfExempt });
  };

  /* Advertencia de cancelación */
  const isCancelling = accountState === "CANCELADA" &&
    account?.accountState !== "CANCELADA";

  const hasBalance = account?.balance &&
    parseFloat(account.balance) !== 0;

  return (
    <Modal
      isOpen={Boolean(account)}
      onClose={onCancel}
      title="Editar cuenta"
      size="sm"
    >
      <form onSubmit={handleSubmit} noValidate>

        {/* Info de la cuenta */}
        <div className="mb-4 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
            Cuenta
          </p>
          <p className="text-sm font-mono font-semibold text-gray-800">
            {account?.accountNumber}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {account?.accountType === "AHORROS" ? "Cuenta de Ahorros" : "Cuenta Corriente"}
          </p>
        </div>

        <div className="space-y-4">

          {/* Estado */}
          <div>
            <Label>Estado de la cuenta</Label>
            <select
              value={accountState}
              onChange={(e) => {
                setAccountState(e.target.value);
                if (touched.accountState)
                  setErrors((prev) => ({ ...prev, accountState: undefined }));
              }}
              onBlur={() => blur("accountState")}
              className={inputBase(!!errors.accountState)}
            >
              <option value="">Seleccionar…</option>
              {ACCOUNT_STATES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <ErrorMsg msg={errors.accountState} />
          </div>

          {/* Advertencia cancelación con saldo */}
          {isCancelling && hasBalance && (
            <div className="flex gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-red-500 shrink-0 mt-0.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p className="text-xs text-red-700 leading-relaxed">
                No se puede cancelar una cuenta con saldo mayor a $0. Retira el
                saldo antes de cancelar.
              </p>
            </div>
          )}

          {/* Advertencia cancelación sin saldo */}
          {isCancelling && !hasBalance && (
            <div className="flex gap-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-amber-500 shrink-0 mt-0.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p className="text-xs text-amber-700 leading-relaxed">
                Esta acción cancelará la cuenta permanentemente.
              </p>
            </div>
          )}

          {/* GMF Exento */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={gmfExempt}
                  onChange={(e) => setGmfExempt(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="
                  w-10 h-6 rounded-full border-2 border-gray-200 bg-gray-100
                  peer-checked:bg-[#16A34A] peer-checked:border-[#16A34A]
                  transition-colors peer-focus:ring-2 peer-focus:ring-[#16A34A]/30
                "/>
                <div className="
                  absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow
                  transition-transform peer-checked:translate-x-4
                "/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Exenta de GMF</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Solo una cuenta por cliente puede tener esta exención.
                </p>
              </div>
            </label>
          </div>

        </div>

        {/* Acciones */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6 pt-5 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="
              flex-1 px-4 py-2.5 rounded-xl text-sm font-medium
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
            disabled={isLoading || (isCancelling && hasBalance)}
            className="
              flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white
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
            {isLoading ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AccountEditModal;