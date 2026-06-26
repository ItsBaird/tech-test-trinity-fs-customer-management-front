const BASE_URL = 'https://tech-test-trinity-fs-customer-management.onrender.com';

export const getAllAccounts = async () => {
  const res = await fetch(`${BASE_URL}/accounts/api/getAll`);
  if (!res.ok) throw new Error('Error al obtener las cuentas.');
  return res.json();
};

export const createAccount = async (data) => {
  const res = await fetch(`${BASE_URL}/accounts/api/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Error al crear la cuenta.');
  }
  return res.json();
};

export const patchAccount = async (id, data) => {
  const res = await fetch(`${BASE_URL}/accounts/api/update/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Error al actualizar la cuenta.');
  }
  return res.json();
};

export const deleteAccount = async (id) => {
  const res = await fetch(`${BASE_URL}/accounts/api/delete/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Error al eliminar la cuenta.');
  }
};