const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-center">
        <p className="text-xs text-gray-400">
          © {year} FinanceApp. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;