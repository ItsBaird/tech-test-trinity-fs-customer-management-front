import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/',             label: 'Dashboard',    icon: 'ti-layout-dashboard' },
  { to: '/customers',    label: 'Customers',    icon: 'ti-users'            },
  { to: '/accounts',     label: 'Accounts',     icon: 'ti-credit-card'      },
  { to: '/transactions', label: 'Transactions', icon: 'ti-arrows-exchange'  },
];

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 h-14 flex items-center px-6 sticky top-0 z-10 relative">

      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <i className="ti ti-building-bank text-white text-base" aria-hidden="true" />
        </div>
        <span className="text-sm font-semibold text-gray-900 tracking-tight">
          FinanceApp
        </span>
      </div>

      {/* Nav links — centrados absolutamente */}
      <ul className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
        {navItems.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors duration-150
                ${isActive
                  ? 'bg-primary-light text-primary-dark font-medium'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                }`
              }
            >
              <i className={`ti ${icon} text-base`} aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

    </nav>
  );
};

export default Navbar;