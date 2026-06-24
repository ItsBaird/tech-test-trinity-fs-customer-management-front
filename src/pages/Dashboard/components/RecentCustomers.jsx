import { useNavigate } from 'react-router-dom';
import SectionCard from '../../../components/ui/SectionCard';

const getInitials = (names = '', surnames = '') =>
  ((names.trim()[0] ?? '') + (surnames.trim()[0] ?? '')).toUpperCase();

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('es-CO', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  }).format(new Date(dateStr));
};

const RecentCustomers = ({ customers = [] }) => {
  const navigate = useNavigate();

  const recent = [...customers]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const action = (
    <button
      onClick={() => navigate('/customers')}
      className="text-xs text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
    >
      Ver todos
      <i className="ti ti-arrow-right text-sm" aria-hidden="true" />
    </button>
  );

  return (
    <SectionCard title="Clientes recientes" action={action}>
      {recent.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          Sin clientes registrados.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {recent.map((customer) => (
            <li key={customer.id} className="flex items-center gap-3 py-3">
              <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-primary-dark">
                  {getInitials(customer.names, customer.surnames)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {customer.names} {customer.surnames}
                </p>
                <p className="text-xs text-gray-400">
                  {customer.identificationType} · {customer.identificationNumber}
                </p>
              </div>
              <p className="text-xs text-gray-400 flex-shrink-0">
                {formatDate(customer.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
};

export default RecentCustomers;