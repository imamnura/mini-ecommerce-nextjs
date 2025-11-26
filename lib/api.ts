const BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || response.statusText);
  }
  return response.json() as Promise<T>;
}

export async function loginApi(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });

  return handleResponse<{
    id: number;
    username: string;
    token: string;
    email: string;
  }>(res);
}
