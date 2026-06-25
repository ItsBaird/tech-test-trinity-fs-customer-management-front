import { useState, useEffect, useCallback } from "react";
import CustomerTable        from "./components/CustomerTable";
import CustomerForm         from "./components/CustomerForm";
import CustomerDeleteModal  from "./components/CustomerDeleteModal";
import Modal from "../../components/ui/Modal";
import {
  getAllCustomers,
  createCustomer,
  patchCustomer,
  deleteCustomer,
} from "../../services/customerService";



/* ─── Toast ──────────────────────────────────────────────────────── */
const TOAST_STYLES = {
  success: { bg: "bg-[#16A34A]",  icon: "✓" },
  warning: { bg: "bg-amber-500",  icon: "!" },
  error:   { bg: "bg-red-600",    icon: "✕" },
};

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const { bg } = TOAST_STYLES[type] ?? TOAST_STYLES.success;

  const Icon = () => {
    if (type === "success") return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
    if (type === "warning") return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 9v4M12 17h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
        <path d="M12 8v5M12 16h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  };

  return (
    <div
      className={`
        fixed bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5
        z-[60] flex items-center gap-3
        ${bg} text-white text-sm font-medium
        px-4 py-3 rounded-xl shadow-xl
        w-[calc(100%-2.5rem)] sm:w-auto sm:max-w-sm
      `}
      style={{ animation: "toastIn 0.2s ease-out both" }}
      role="alert"
    >
      <Icon />
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="shrink-0 w-5 h-5 flex items-center justify-center opacity-75 hover:opacity-100 transition-opacity"
        aria-label="Cerrar"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1l8 8M9 1L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(10px) translateX(-50%); }
          to   { opacity: 1; transform: translateY(0)    translateX(-50%); }
        }
        @media (min-width: 640px) {
          @keyframes toastIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        }
      `}</style>
    </div>
  );
};

/* ─── Página principal ───────────────────────────────────────────── */
const Customers = () => {
  const [customers,   setCustomers]   = useState([]);
  const [loading,     setLoading]     = useState(true);

  const [formOpen,    setFormOpen]    = useState(false);
  const [editTarget,  setEditTarget]  = useState(null);
  const [deleteTarget,setDeleteTarget]= useState(null);

  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(false);

  const [toast,       setToast]       = useState(null);
  const notify = (message, type = "success") => setToast({ message, type });

  /* ── Cargar ── */
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch {
      notify("No se pudieron cargar los clientes.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  /* ── Crear ── */
  const handleNew = () => { setEditTarget(null); setFormOpen(true); };

  /* ── Editar ── */
  const handleEdit = (c) => { setEditTarget(c); setFormOpen(true); };

  /* ── Guardar (crear o editar) ── */
  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editTarget) {
        await patchCustomer(editTarget.id, payload);
        notify("Cliente actualizado correctamente.");
      } else {
        await createCustomer(payload);
        notify("Cliente creado correctamente.");
      }
      setFormOpen(false);
      setEditTarget(null);
      await fetchCustomers();
    } catch (err) {
      const msg = (err.message ?? "").toLowerCase();
      if (msg.includes("identificaci") || msg.includes("already exists")) {
        notify("Ya existe un cliente con esa identificación.", "warning");
      } else if (msg.includes("email")) {
        notify("El correo electrónico ya está registrado.", "warning");
      } else {
        notify(err.message || "Ocurrió un error al guardar.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  /* ── Eliminar ── */
  const handleDelete        = (c) => setDeleteTarget(c);
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCustomer(deleteTarget.id);
      notify(`${deleteTarget.names} ${deleteTarget.surnames} fue eliminado.`);
      setDeleteTarget(null);
      await fetchCustomers();
    } catch (err) {
      const msg = (err.message ?? "").toLowerCase();
      if (msg.includes("account") || msg.includes("cuenta")) {
        notify("No se puede eliminar: el cliente tiene cuentas asociadas.", "warning");
      } else {
        notify(err.message || "Error al eliminar el cliente.", "error");
      }
    } finally {
      setDeleting(false);
    }
  };

  const closeForm = () => { if (!saving) { setFormOpen(false); setEditTarget(null); } };

  /* ─── Render ─── */
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Clientes
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Gestiona el registro de clientes del sistema.
            </p>
          </div>

          <button
            onClick={handleNew}
            className="
              inline-flex items-center justify-center gap-2
              px-4 py-2.5 rounded-xl
              bg-[#16A34A] hover:bg-[#166534] active:bg-[#14532d]
              text-white text-sm font-semibold
              shadow-sm shadow-[#16A34A]/20
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:ring-offset-2
              w-full sm:w-auto
            "
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Nuevo cliente
          </button>
        </div>

        {/* ── Tabla / Cards ── */}
        <CustomerTable
          customers={customers}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      </div>

      {/* ── Modal crear / editar ── */}
      <Modal
        isOpen={formOpen}
        onClose={closeForm}
        title={editTarget ? "Editar cliente" : "Nuevo cliente"}
        size="lg"
      >
        <CustomerForm
          initialData={editTarget}
          onSubmit={handleSave}
          onCancel={closeForm}
          isLoading={saving}
        />
      </Modal>

      {/* ── Modal eliminar ── */}
      <CustomerDeleteModal
        customer={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleting}
      />

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Customers;