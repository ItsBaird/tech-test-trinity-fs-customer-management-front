import { useNavigate } from 'react-router-dom';
import SectionCard from '../../../components/ui/SectionCard';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(amount ?? 0));

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('es-CO', {
    day:    '2-digit',
    month:  'short',
    hour:   '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
};

const TYPE_CONFIG = {
  CONSIGNACION: {
    label:       'Consignación',
    icon:        'ti-arrow-down',
    iconBg:      'bg-green-100',
    iconColor:   'text-green-700',
    amountColor: 'text-green-700',
    prefix:      '+',
  },
  RETIRO: {
    label:       'Retiro',
    icon:        'ti-arrow-up',
    iconBg:      'bg-amber-100',
    iconColor:   'text-amber-700',
    amountColor: 'text-red-600',
    prefix:      '-',
  },
  TRANSFERENCIA: {
    label:       'Transferencia',
    icon:        'ti-arrows-exchange',
    iconBg:      'bg-blue-100',
    iconColor:   'text-blue-700',
    amountColor: 'text-blue-700',
    prefix:      '',
  },
};

const getAccountRef = (txn) => {
  switch (txn.transactionType) {
    case 'CONSIGNACION':
      return `Cta. ${txn.destinationAccountId ?? '—'}`;
    case 'RETIRO':
      return `Cta. ${txn.sourceAccountId ?? '—'}`;
    case 'TRANSFERENCIA':
      return `${txn.sourceAccountId ?? '—'} → ${txn.destinationAccountId ?? '—'}`;
    default:
      return '—';
  }
};

const RecentTransactions = ({ transactions = [] }) => {
  const navigate = useNavigate();

  const recent = [...transactions]
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
    .slice(0, 5);

  const action = (
    <button
      onClick={() => navigate('/transactions')}
      className="text-xs text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
    >
      Ver todas
      <i className="ti ti-arrow-right text-sm" aria-hidden="true" />
    </button>
  );

  return (
    <SectionCard title="Transacciones recientes" action={action}>
      {recent.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          Sin transacciones registradas.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {recent.map((txn) => {
            const config = TYPE_CONFIG[txn.transactionType] ?? TYPE_CONFIG.CONSIGNACION;
            return (
              <li key={txn.id} className="flex items-center gap-3 py-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
                  <i className={`ti ${config.icon} text-sm ${config.iconColor}`} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{config.label}</p>
                  <p className="text-xs text-gray-400 truncate">{getAccountRef(txn)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-semibold ${config.amountColor}`}>
                    {config.prefix}{formatCurrency(txn.amount)}
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(txn.transactionDate)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
};

export default RecentTransactions;