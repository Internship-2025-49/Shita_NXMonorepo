/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getAuthToken() {
  const loginResponse = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'nxUser', password: 'nx123' })
  });
  const loginData = await loginResponse.json();
  if (!loginData.token) {
      throw new Error('Login gagal, token tidak ditemukan');
  }
  return loginData.token;
}

export async function getApiKey(token: any) {
  const response = await fetch('http://localhost:3000/api/users/nx', {
      headers: {
          'Authorization': `Bearer ${token}`
      }
  });
  
  const data = await response.json();
  if (!data.key) {
      throw new Error('Gagal mendapatkan API Key');
  }
  return data.key;
}