const BASE_URL = 'http://localhost:8080';

export const getAllTransactions = async () => {
  const res = await fetch(`${BASE_URL}/transactions/api/getAll`);
  if (!res.ok) throw new Error('Error al obtener transacciones');
  return res.json();
};