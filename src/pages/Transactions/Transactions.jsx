import { useState, useEffect, useCallback } from "react";
import TransactionTable from "./components/TransactionTable";
import TransactionForm from "./components/TransactionForm";
import Modal from "../../components/ui/Modal";
import { getAllTransactions, createTransaction } from "../../services/transactionService";

/* ─── Toast ─── */
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg =
    type === "error"
      ? "bg-red-600"
      : type === "warning"
      ? "bg-amber-500"
      : "bg-[#16A34A]";

  const SuccessIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <polyline
        points="20 6 9 17 4 12"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const WarningIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 9v4M12 17h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

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
      {type === "success" ? <SuccessIcon /> : <WarningIcon />}
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="shrink-0 opacity-75 hover:opacity-100 transition-opacity"
        aria-label="Cerrar"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1l8 8M9 1L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
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

/* ─── Página principal ─── */
const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (message, type = "success") => setToast({ message, type });

  /* ── Cargar ── */
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch {
      notify("No se pudieron cargar las transacciones.", "error");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  /* ── Crear ── */
  const handleCreate = async (payload) => {
    setSaving(true);
    try {
      await createTransaction(payload);
      notify("Transacción registrada correctamente.");
      setFormOpen(false);
      await fetchTransactions();
    } catch (err) {
      const msg = (err.message ?? "").toLowerCase();

      if (msg.includes("saldo") || msg.includes("balance") || msg.includes("insufficient")) {
        notify("Saldo insuficiente para completar la operación.", "warning");
      } else if (msg.includes("activ") || msg.includes("state")) {
        notify("Una de las cuentas no está activa.", "warning");
      } else if (msg.includes("account") || msg.includes("cuenta")) {
        notify("Una de las cuentas indicadas no existe.", "warning");
      } else {
        notify(err.message || "Error al registrar la transacción.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCloseForm = () => {
    if (!saving) setFormOpen(false);
  };

  /* ─── Render ─── */
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Transacciones
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Historial de consignaciones, retiros y transferencias del sistema.
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
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Nueva transacción
          </button>
        </div>

        {/* Tabla */}
        <TransactionTable transactions={transactions} isLoading={loading} />

      </div>

      {/* Modal crear */}
      <Modal isOpen={formOpen} onClose={handleCloseForm} title="Nueva transacción" size="md">
        <TransactionForm
          onSubmit={handleCreate}
          onCancel={handleCloseForm}
          isLoading={saving}
        />
      </Modal>

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

export default Transactions;