const SectionCard = ({ title, action, children }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      {action && <div>{action}</div>}
    </div>
    {children}
  </div>
);

export default SectionCard;