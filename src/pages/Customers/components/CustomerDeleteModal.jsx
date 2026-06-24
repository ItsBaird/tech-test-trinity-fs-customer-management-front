/**
 * CustomerDeleteModal — confirmación de eliminación.
 *
 * Props:
 *   customer   {object|null}
 *   onConfirm  {function}
 *   onCancel   {function}
 *   isLoading  {boolean}
 */
import Modal from "../../../components/ui/Modal";

const CustomerDeleteModal = ({ customer, onConfirm, onCancel, isLoading = false }) => {
  if (!customer) return null;

  const fullName = `${customer.names} ${customer.surnames}`;

  return (
    <Modal
      isOpen={Boolean(customer)}
      onClose={onCancel}
      title="Eliminar cliente"
      size="sm"
    >
      <div className="flex flex-col items-center text-center gap-4">
        {/* Ícono */}
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center shrink-0">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-red-500">
            <path
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm text-gray-700 leading-relaxed">
            Estás a punto de eliminar a{" "}
            <span className="font-semibold text-gray-900">{fullName}</span>.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Esta acción no se puede deshacer. Si el cliente tiene cuentas
            asociadas, no podrá eliminarse.
          </p>
        </div>
      </div>

      {/* Botones: apilados en mobile, lado a lado en sm+ */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
        <button
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
          onClick={onConfirm}
          disabled={isLoading}
          className="
            flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white
            bg-red-600 hover:bg-red-700 active:bg-red-800
            transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
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
          {isLoading ? "Eliminando…" : "Sí, eliminar"}
        </button>
      </div>
    </Modal>
  );
};

export default CustomerDeleteModal;