const StatCard = ({ label, value, subtitle, icon, iconColor, iconBg }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs text-gray-500">{label}</span>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
        <i className={`ti ${icon} text-base ${iconColor}`} aria-hidden="true" />
      </div>
    </div>
    <p className="text-2xl font-semibold text-gray-900 leading-tight">{value}</p>
    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
  </div>
);

export default StatCard;