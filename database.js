// SIMULACIÓN DE LA BASE DE DATOS (MOCK DB)
const CLIENTES_DB = [
    { id: "c-1", nombre: "Corporación Alfa", sector: "Finanzas" },
    { id: "c-2", nombre: "Logística Beta", sector: "Transporte" },
    { id: "c-3", nombre: "Industrias Gamma", sector: "Manufactura" }
];

const FACTURAS_DB = [
    { id: "f-1", clienteId: "c-1", monto: 1500.00 },
    { id: "f-2", clienteId: "c-1", monto: 2300.50 },
    { id: "f-3", clienteId: "c-2", monto: 450.00 },
    { id: "f-4", clienteId: "c-3", monto: 8900.00 }
];

// Helper para simular latencia de red (200ms)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
    async fetchAllClientes() {
        console.log("\x1b[36m%s\x1b[0m", "[DB READ] SELECT * FROM clientes;");
        await delay(200);
        return CLIENTES_DB;
    },

    // Método ingenuo usado en la fase 1 para evidenciar el problema N+1.
    async fetchFacturasByClienteId(clienteId) {
        console.log("\x1b[31m%s\x1b[0m", `[DB READ] SELECT * FROM facturas WHERE cliente_id = '${clienteId}';`);
        await delay(200);
        return FACTURAS_DB.filter(f => f.clienteId === clienteId);
    },

    // Método optimizado: trae las facturas de varios clientes en una sola lectura.
    async fetchFacturasByClienteIdsBatch(clienteIds) {
        console.log(
            "\x1b[32m%s\x1b[0m",
            `[DB BATCH READ] SELECT * FROM facturas WHERE cliente_id IN (${clienteIds.map(id => `'${id}'`).join(', ')});`
        );
        await delay(200);
        return clienteIds.map(clienteId => FACTURAS_DB.filter(f => f.clienteId === clienteId));
    }
};
