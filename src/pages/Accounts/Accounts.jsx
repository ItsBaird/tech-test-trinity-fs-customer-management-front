/**
 * Accounts.jsx — página principal de gestión de cuentas.
 *
 * API:
 *   GET    /accounts/api/getAll
 *   POST   /accounts/api/create       { accountType, gmfExempt, customerId }
 *   PATCH  /accounts/api/update/{id}  { accountState?, gmfExempt? }
 *   DELETE /accounts/api/delete/{id}
 */
import { useState, useEffect, useCallback } from "react";
import AccountTable       from "./components/AccountTable";
import AccountForm        from "./components/AccountForm";
import AccountEditModal   from "./components/AccountEditModal";
import AccountDeleteModal from "./components/AccountDeleteModal";
import Modal              from "../../components/ui/Modal";

/* ─── API ─── */
const BASE_URL = "http://localhost:8080";

const api = {
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/accounts/api/getAll`);
    if (!res.ok) throw new Error("Error al obtener las cuentas.");
    return res.json();
  },
  create: async (data) => {
    const res = await fetch(`${BASE_URL}/accounts/api/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? "Error al crear la cuenta.");
    }
    return res.json();
  },
  patch: async (id, data) => {
    const res = await fetch(`${BASE_URL}/accounts/api/update/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? "Error al actualizar la cuenta.");
    }
    return res.json();
  },
  remove: async (id) => {
    const res = await fetch(`${BASE_URL}/accounts/api/delete/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? "Error al eliminar la cuenta.");
    }
  },
};

/* ─── Toast ─── */
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === "error" ? "bg-red-600" : type === "warning" ? "bg-amber-500" : "bg-[#16A34A]";

  const Icon = () => {
    if (type === "success") return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 9v4M12 17h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  };

  return (
    <div
      className={`
        fixed bottom-5 left-1/2 -translate-x-1/2
        sm:left-auto sm:translate-x-0 sm:right-5
        z-[60] flex items-center gap-3
        ${bg} text-white text-sm font-medium
        px-4 py-3 rounded-xl shadow-xl
        w-[calc(100%-2.5rem)] sm:w-auto sm:max-w-sm
      `}
      style={{ animation: "toastIn 0.2s ease-out both" }}
      role="alert"
    >
      <Icon/>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="shrink-0 opacity-75 hover:opacity-100 transition-opacity" aria-label="Cerrar">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1l8 8M9 1L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      <style>{`
        @keyframes toastIn {
          from { opacity:0; transform:translateY(10px) translateX(-50%); }
          to   { opacity:1; transform:translateY(0)    translateX(-50%); }
        }
        @media(min-width:640px){
          @keyframes toastIn {
            from { opacity:0; transform:translateY(10px); }
            to   { opacity:1; transform:translateY(0); }
          }
        }
      `}</style>
    </div>
  );
};

/* ─── Página principal ─── */
const Accounts = () => {
  const [accounts,      setAccounts]      = useState([]);
  const [loading,       setLoading]       = useState(true);

  const [formOpen,      setFormOpen]      = useState(false);
  const [editTarget,    setEditTarget]    = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);

  const [saving,        setSaving]        = useState(false);
  const [deleting,      setDeleting]      = useState(false);

  const [toast,         setToast]         = useState(null);
  const notify = (message, type = "success") => setToast({ message, type });

  /* ── Cargar ── */
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAll();
      setAccounts(data);
    } catch {
      notify("No se pudieron cargar las cuentas.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  /* ── Crear ── */
  const handleCreate = async (payload) => {
    setSaving(true);
    try {
      await api.create(payload);
      notify("Cuenta creada correctamente.");
      setFormOpen(false);
      await fetchAccounts();
    } catch (err) {
      const msg = (err.message ?? "").toLowerCase();
      if (msg.includes("gmf") || msg.includes("exempt")) {
        notify("Este cliente ya tiene una cuenta exenta de GMF.", "warning");
      } else if (msg.includes("customer") || msg.includes("cliente")) {
        notify("El cliente seleccionado no existe.", "warning");
      } else {
        notify(err.message || "Error al crear la cuenta.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  /* ── Editar ── */
  const handleEdit = (account) => setEditTarget(account);

  const handleSaveEdit = async (payload) => {
    setSaving(true);
    try {
      await api.patch(editTarget.id, payload);
      notify("Cuenta actualizada correctamente.");
      setEditTarget(null);
      await fetchAccounts();
    } catch (err) {
      const msg = (err.message ?? "").toLowerCase();
      if (msg.includes("gmf") || msg.includes("exempt")) {
        notify("Este cliente ya tiene una cuenta exenta de GMF.", "warning");
      } else if (msg.includes("cancel") || msg.includes("saldo") || msg.includes("balance")) {
        notify("No se puede cancelar una cuenta con saldo mayor a $0.", "warning");
      } else {
        notify(err.message || "Error al actualizar la cuenta.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  /* ── Eliminar ── */
  const handleDelete = (account) => setDeleteTarget(account);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.remove(deleteTarget.id);
      notify(`Cuenta ${deleteTarget.accountNumber} eliminada.`);
      setDeleteTarget(null);
      await fetchAccounts();
    } catch (err) {
      notify(err.message || "Error al eliminar la cuenta.", "error");
    } finally {
      setDeleting(false);
    }
  };

  /* ─── Render ─── */
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Cuentas
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Administra las cuentas de ahorros y corrientes del sistema.
            </p>
          </div>

          <button
            onClick={() => setFormOpen(true)}
            className="
              inline-flex items-center justify-center gap-2
              px-4 py-2.5 rounded-xl
              bg-[#16A34A] hover:bg-[#166534] active:bg-[#14532d]
              text-white text-sm font-semibold
              shadow-sm shadow-[#16A34A]/20
              transition-colors focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:ring-offset-2
              w-full sm:w-auto
            "
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Nueva cuenta
          </button>
        </div>

        {/* Tabla / Cards */}
        <AccountTable
          accounts={accounts}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      </div>

      {/* Modal crear */}
      <Modal
        isOpen={formOpen}
        onClose={() => { if (!saving) setFormOpen(false); }}
        title="Nueva cuenta"
        size="md"
      >
        <AccountForm
          onSubmit={handleCreate}
          onCancel={() => setFormOpen(false)}
          isLoading={saving}
        />
      </Modal>

      {/* Modal editar */}
      <AccountEditModal
        account={editTarget}
        onSubmit={handleSaveEdit}
        onCancel={() => setEditTarget(null)}
        isLoading={saving}
      />

      {/* Modal eliminar */}
      <AccountDeleteModal
        account={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleting}
      />

      {/* Toast */}
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

export default Accounts;