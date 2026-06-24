import { useState, useEffect } from "react";

const IDENTIFICATION_TYPES = [
  { value: "CC", label: "CC (Cédula de Ciudadanía)" },
  { value: "CE", label: "CE (Cédula de Extranjería)" },
  { value: "PA", label: "PA (Pasaporte)" },
];

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const EMPTY = {
  identificationType: "",
  identificationNumber: "",
  names: "",
  surnames: "",
  email: "",
  dateOfBirth: "",
};

const isAdult = (dateStr) => {
  if (!dateStr) return false;
  const birth = new Date(dateStr);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  return age > 18 || (age === 18 && (m > 0 || (m === 0 && today.getDate() >= birth.getDate())));
};

const maxDateOfBirth = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split("T")[0];
};

const validate = (f) => {
  const e = {};
  if (!f.identificationType)          e.identificationType   = "Selecciona un tipo de identificación.";
  if (!f.identificationNumber.trim()) e.identificationNumber = "El número de identificación es requerido.";
  if (!f.names.trim())                e.names    = "Los nombres son requeridos.";
  else if (f.names.trim().length < 2) e.names    = "Mínimo 2 caracteres.";
  if (!f.surnames.trim())                e.surnames = "Los apellidos son requeridos.";
  else if (f.surnames.trim().length < 2) e.surnames = "Mínimo 2 caracteres.";
  if (!f.email.trim())                      e.email = "El correo es requerido.";
  else if (!EMAIL_REGEX.test(f.email.trim())) e.email = "Formato inválido (ej: usuario@dominio.com).";
  if (!f.dateOfBirth)              e.dateOfBirth = "La fecha de nacimiento es requerida.";
  else if (!isAdult(f.dateOfBirth)) e.dateOfBirth = "El cliente debe ser mayor de 18 años.";
  return e;
};

/* ── Componentes de campo ── */
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
   placeholder-gray-400 transition-colors
   focus:outline-none focus:ring-2
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
const CustomerForm = ({ initialData = null, onSubmit, onCancel, isLoading = false }) => {
  const [fields, setFields]   = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFields({
        identificationType:   initialData.identificationType ?? "",
        identificationNumber: String(initialData.identificationNumber ?? ""),
        names:       initialData.names       ?? "",
        surnames:    initialData.surnames    ?? "",
        email:       initialData.email       ?? "",
        dateOfBirth: initialData.dateOfBirth
          ? String(initialData.dateOfBirth).split("T")[0]
          : "",
      });
    } else {
      setFields(EMPTY);
    }
    setErrors({});
    setTouched({});
  }, [initialData]);

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
      identificationType:   fields.identificationType,
      identificationNumber: fields.identificationNumber.trim(),
      names:       fields.names.trim(),
      surnames:    fields.surnames.trim(),
      email:       fields.email.trim(),
      dateOfBirth: fields.dateOfBirth,
    });
  };

  const isEdit = Boolean(initialData);

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Grid 1-col en mobile, 2-col en sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Tipo de identificación */}
        <div>
          <Label>Tipo de identificación</Label>
          <select
            value={fields.identificationType}
            onChange={(e) => set("identificationType", e.target.value)}
            onBlur={() => blur("identificationType")}
            className={inputBase(!!errors.identificationType)}
          >
            <option value="">Seleccionar…</option>
            {IDENTIFICATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <ErrorMsg msg={errors.identificationType} />
        </div>

        {/* Número de identificación */}
        <div>
          <Label>Número de identificación</Label>
          <input
            type="text"
            inputMode="numeric"
            value={fields.identificationNumber}
            onChange={(e) => set("identificationNumber", e.target.value)}
            onBlur={() => blur("identificationNumber")}
            placeholder="Ej: 1234567890"
            className={inputBase(!!errors.identificationNumber)}
          />
          <ErrorMsg msg={errors.identificationNumber} />
        </div>

        {/* Nombres */}
        <div>
          <Label>Nombres</Label>
          <input
            type="text"
            value={fields.names}
            onChange={(e) => set("names", e.target.value)}
            onBlur={() => blur("names")}
            placeholder="Ej: María Fernanda"
            className={inputBase(!!errors.names)}
            autoComplete="given-name"
          />
          <ErrorMsg msg={errors.names} />
        </div>

        {/* Apellidos */}
        <div>
          <Label>Apellidos</Label>
          <input
            type="text"
            value={fields.surnames}
            onChange={(e) => set("surnames", e.target.value)}
            onBlur={() => blur("surnames")}
            placeholder="Ej: Gómez Ruiz"
            className={inputBase(!!errors.surnames)}
            autoComplete="family-name"
          />
          <ErrorMsg msg={errors.surnames} />
        </div>

        {/* Email — ancho completo en sm+ */}
        <div className="sm:col-span-2">
          <Label>Correo electrónico</Label>
          <input
            type="email"
            value={fields.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => blur("email")}
            placeholder="usuario@dominio.com"
            className={inputBase(!!errors.email)}
            autoComplete="email"
            inputMode="email"
          />
          <ErrorMsg msg={errors.email} />
        </div>

        {/* Fecha de nacimiento */}
        <div>
          <Label>Fecha de nacimiento</Label>
          <input
            type="date"
            value={fields.dateOfBirth}
            max={maxDateOfBirth()}
            onChange={(e) => set("dateOfBirth", e.target.value)}
            onBlur={() => blur("dateOfBirth")}
            className={inputBase(!!errors.dateOfBirth)}
          />
          <ErrorMsg msg={errors.dateOfBirth} />
        </div>

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
          disabled={isLoading}
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
          {isLoading ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear cliente"}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;