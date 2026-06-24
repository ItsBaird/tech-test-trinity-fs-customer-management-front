const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);

const sumByType = (transactions, type) =>
  transactions
    .filter((t) => t.transactionType === type)
    .reduce((acc, t) => acc + Number(t.amount ?? 0), 0);

const SUMMARY_CONFIG = [
  {
    type:       'CONSIGNACION',
    label:      'Total consignado',
    icon:       'ti-arrow-down',
    iconBg:     'bg-green-100',
    iconColor:  'text-green-700',
    valueColor: 'text-green-700',
  },
  {
    type:       'RETIRO',
    label:      'Total retirado',
    icon:       'ti-arrow-up',
    iconBg:     'bg-amber-100',
    iconColor:  'text-amber-700',
    valueColor: 'text-amber-700',
  },
  {
    type:       'TRANSFERENCIA',
    label:      'Total transferido',
    icon:       'ti-arrows-exchange',
    iconBg:     'bg-blue-100',
    iconColor:  'text-blue-700',
    valueColor: 'text-blue-700',
  },
];

const SummaryRow = ({ transactions = [] }) => (
  <div className="grid grid-cols-3 gap-3 mb-5">
    {SUMMARY_CONFIG.map(({ type, label, icon, iconBg, iconColor, valueColor }) => (
      <div
        key={type}
        className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <i className={`ti ${icon} text-lg ${iconColor}`} aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className={`text-base font-semibold mt-0.5 ${valueColor}`}>
            {formatCurrency(sumByType(transactions, type))}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default SummaryRow;