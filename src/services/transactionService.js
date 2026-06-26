const BASE_URL = 'https://tech-test-trinity-fs-customer-management.onrender.com';

export const getAllTransactions = async () => {
  const res = await fetch(`${BASE_URL}/transactions/api/getAll`);
  if (!res.ok) throw new Error('Error al obtener transacciones');
  return res.json();
};

export const getTransactionById = async (id) => {
  const res = await fetch(`${BASE_URL}/transactions/api/getById/${id}`);
  if (!res.ok) throw new Error('Transacción no encontrada');
  return res.json();
};

export const createTransaction = async (payload) => {
  const res = await fetch(`${BASE_URL}/transactions/api/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Error al crear la transacción');
  }

  return res.json();
};