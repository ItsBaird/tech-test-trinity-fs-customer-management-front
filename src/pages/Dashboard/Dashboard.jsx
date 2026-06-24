import { useEffect, useState } from 'react';
import { getAllCustomers }    from '../../services/customerService';
import { getAllAccounts }     from '../../services/accountService';
import { getAllTransactions } from '../../services/transactionService';
import StatCard               from '../../components/ui/StatCard';
import SummaryRow             from './components/SummaryRow';
import RecentTransactions     from './components/RecentTransaction';
import RecentCustomers        from './components/RecentCustomers';


const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-CO', {
    style:                'currency',
    currency:             'COP',
    maximumFractionDigits: 0,
  }).format(amount);

const today = new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(new Date());

const Dashboard = () => {
  const [customers,    setCustomers]    = useState([]);
  const [accounts,     setAccounts]     = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [c, a, t] = await Promise.all([
          getAllCustomers(),
          getAllAccounts(),
          getAllTransactions(),
        ]);
        setCustomers(c);
        setAccounts(a);
        setTransactions(t);
      } catch {
        setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en localhost:8080.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // — Métricas —
  const totalCustomers    = customers.length;
  const activeAccounts    = accounts.filter((a) => a.accountState === 'ACTIVA').length;
  const inactiveAccounts  = accounts.filter((a) => a.accountState === 'INACTIVA').length;
  const totalTransactions = transactions.length;
  const totalBalance      = accounts
    .filter((a) => a.accountState === 'ACTIVA')
    .reduce((sum, a) => sum + Number(a.balance ?? 0), 0);

  // — Estados de carga —
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <i className="ti ti-loader-2 text-2xl animate-spin" aria-hidden="true" />
          <span className="text-sm">Cargando datos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2">
        <i className="ti ti-wifi-off text-3xl text-red-400" aria-hidden="true" />
        <p className="text-sm text-red-500 text-center max-w-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Resumen general del sistema — {today}
        </p>
      </div>

      {/* 4 métricas principales */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard
          label="Total clientes"
          value={totalCustomers}
          subtitle="Clientes registrados en el sistema"
          icon="ti-users"
          iconBg="bg-primary-light"
          iconColor="text-primary"
        />
        <StatCard
          label="Cuentas activas"
          value={activeAccounts}
          subtitle={`${inactiveAccounts} inactiva${inactiveAccounts !== 1 ? 's' : ''}`}
          icon="ti-credit-card"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Transacciones totales"
          value={totalTransactions}
          subtitle="Total de movimientos registrados"
          icon="ti-arrows-exchange"
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
        <StatCard
          label="Saldo total en sistema"
          value={formatCurrency(totalBalance)}
          subtitle="Suma de cuentas activas"
          icon="ti-cash"
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
        />
      </div>

      {/* Resumen por tipo de transacción */}
      <SummaryRow transactions={transactions} />

      {/* Actividad reciente */}
      <div className="grid grid-cols-2 gap-4">
        <RecentTransactions transactions={transactions} />
        <RecentCustomers    customers={customers} />
      </div>
    </div>
  );
};

export default Dashboard;