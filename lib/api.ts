export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchProperties(params: Record<string, any>) {
  if (!API_BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL not set");
  
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== "" && v !== undefined && v !== null)
  );
  
  const qs = new URLSearchParams(cleaned as any).toString();
  const res = await fetch(`${API_BASE}/properties?${qs}`, { 
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  if (!res.ok) {
    throw new Error(`API ${res.status}`);
  }
  
  return res.json(); // { data: [...], pagination: {...} }
}

export async function fetchNeighborhoodInsights(params: Record<string, any>) {
  if (!API_BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL not set");
  
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== "" && v !== undefined && v !== null)
  );
  
  const qs = new URLSearchParams(cleaned as any).toString();
  const res = await fetch(`${API_BASE}/neighborhoods?${qs}`, { 
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  if (!res.ok) {
    throw new Error(`API ${res.status}`);
  }
  
  return res.json();
}
