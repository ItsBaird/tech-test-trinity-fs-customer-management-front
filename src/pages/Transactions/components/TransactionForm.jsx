import { useState } from "react";

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
  transactionType: "",
  amount: "",
  sourceAccountId: "",
  destinationAccountId: "",
};

/* ─── Field wrapper ─── */
const Field = ({ label, hint, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {hint && <p className="text-xs text-gray-400 -mt-1">{hint}</p>}
    {children}
    {error && (
      <p className="text-xs text-red-600 flex items-center gap-1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

const inputClass = (hasError) =>
  [
    "w-full px-3 py-2.5 rounded-xl border text-sm text-gray-900 bg-white",
    "placeholder:text-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent",
    "transition-colors",
    hasError ? "border-red-400 bg-red-50/40" : "border-gray-200 hover:border-gray-300",
  ].join(" ");

/* ─── Type selector button ─── */
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
    <span
      className={[
        "mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
        selected ? "border-[#16A34A]" : "border-gray-300",
      ].join(" ")}
    >
      {selected && <span className="w-2 h-2 rounded-full bg-[#16A34A]" />}
    </span>
    <div>
      <p className="text-sm font-medium text-gray-900">{type.label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
    </div>
  </button>
);

/* ─── GMF warning ─── */
const GmfWarning = () => (
  <div className="flex gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="text-amber-600 shrink-0 mt-0.5"
    >
      <path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <p className="text-xs text-amber-700 leading-relaxed">
      Si la cuenta origen no está exenta, se aplicará un{" "}
      <strong>GMF del 0.4%</strong> sobre el monto. El débito total puede ser
      mayor al valor ingresado.
    </p>
  </div>
);

/* ─── Main component ─── */
const TransactionForm = ({ onSubmit, onCancel, isLoading }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

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

    if (!form.transactionType) {
      e.transactionType = "Selecciona un tipo de transacción.";
    }

    const amount = parseFloat(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0) {
      e.amount = "Ingresa un monto válido mayor a $0.";
    }

    if (selectedType?.requiresSource && !form.sourceAccountId) {
      e.sourceAccountId = "Ingresa el ID de la cuenta origen.";
    }

    if (selectedType?.requiresDest && !form.destinationAccountId) {
      e.destinationAccountId = "Ingresa el ID de la cuenta destino.";
    }

    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    onSubmit({
      transactionType: form.transactionType,
      amount: parseFloat(form.amount),
      sourceAccountId: form.sourceAccountId ? parseInt(form.sourceAccountId, 10) : null,
      destinationAccountId: form.destinationAccountId
        ? parseInt(form.destinationAccountId, 10)
        : null,
    });
  };

  const showGmfWarning =
    selectedType?.value === "RETIRO" || selectedType?.value === "TRANSFERENCIA";

  return (
    <div className="space-y-5">
      {/* Tipo */}
      <Field label="Tipo de transacción" error={errors.transactionType}>
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
      </Field>

      {/* Monto */}
      <Field
        label="Monto"
        hint="Ingresa el valor en pesos colombianos (COP)."
        error={errors.amount}
      >
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
            className={`${inputClass(!!errors.amount)} pl-7`}
          />
        </div>
      </Field>

      {/* Cuenta origen */}
      {selectedType?.requiresSource && (
        <Field label="ID cuenta origen" error={errors.sourceAccountId}>
          <input
            type="number"
            min="1"
            placeholder="Ej: 12"
            value={form.sourceAccountId}
            onChange={(e) => setField("sourceAccountId", e.target.value)}
            className={inputClass(!!errors.sourceAccountId)}
          />
        </Field>
      )}

      {/* Cuenta destino */}
      {selectedType?.requiresDest && (
        <Field label="ID cuenta destino" error={errors.destinationAccountId}>
          <input
            type="number"
            min="1"
            placeholder="Ej: 7"
            value={form.destinationAccountId}
            onChange={(e) => setField("destinationAccountId", e.target.value)}
            className={inputClass(!!errors.destinationAccountId)}
          />
        </Field>
      )}

      {/* GMF warning */}
      {showGmfWarning && <GmfWarning />}

      {/* Botones */}
      <div className="flex gap-2.5 pt-1">
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
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                <path
                  d="M12 2a10 10 0 0110 10"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
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