const BASE_URL = 'https://tech-test-trinity-fs-customer-management.onrender.com';

export const getAllCustomers = async () => {
  const res = await fetch(`${BASE_URL}/customers/api/getAll`);
  if (!res.ok) throw new Error('Error al obtener los clientes.');
  return res.json();
};

export const createCustomer = async (data) => {
  const res = await fetch(`${BASE_URL}/customers/api/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Error al crear el cliente.');
  }
  return res.json();
};

export const patchCustomer = async (id, data) => {
  const res = await fetch(`${BASE_URL}/customers/api/update/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Error al actualizar el cliente.');
  }
  return res.json();
};

export const deleteCustomer = async (id) => {
  const res = await fetch(`${BASE_URL}/customers/api/delete/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Error al eliminar el cliente.');
  }
};