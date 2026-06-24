const BASE_URL = 'http://localhost:8080';

export const getAllAccounts = async () => {
  const res = await fetch(`${BASE_URL}/accounts/api/getAll`);
  if (!res.ok) throw new Error('Error al obtener cuentas');
  return res.json();
};