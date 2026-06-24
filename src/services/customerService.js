const BASE_URL = 'http://localhost:8080';

export const getAllCustomers = async () => {
  const res = await fetch(`${BASE_URL}/customers/api/getAll`);
  if (!res.ok) throw new Error('Error al obtener clientes');
  return res.json();
};