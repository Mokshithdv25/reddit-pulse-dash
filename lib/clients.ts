// Multi-client configuration
// Each client has a unique ID and display metadata

export interface Client {
  id: string;
  name: string;
  industry: string;
}

export const clients: Client[] = [
  { id: "acme-corp", name: "Acme Corp", industry: "SaaS" },
  { id: "globex-inc", name: "Globex Inc", industry: "E-Commerce" },
];

export function getClientById(id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}
