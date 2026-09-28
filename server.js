import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import DataLoader from 'dataloader';
import { db } from './database.js';

// 1. DEFINICIÓN DEL ESQUEMA (SDL)
const typeDefs = `#graphql
  type Cliente {
    id: ID!
    nombre: String!
    sector: String!
    facturas: [Factura!]!
  }

  type Factura {
    id: ID!
    monto: Float!
  }

  type Query {
    clientes: [Cliente!]!
  }
`;

// 2. RESOLUTORES OPTIMIZADOS CON DATALOADER
const resolvers = {
    Query: {
        clientes: async () => await db.fetchAllClientes(),
    },
    Cliente: {
        facturas: async (parent, _args, context) => {
            return await context.loaders.facturasByClienteId.load(parent.id);
        }
    }
};

// 3. INICIALIZACIÓN DEL SERVIDOR
const server = new ApolloServer({ typeDefs, resolvers });
const port = Number(process.env.PORT) || 4000;

const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async () => ({
        loaders: {
            facturasByClienteId: new DataLoader(clienteIds => db.fetchFacturasByClienteIdsBatch(clienteIds))
        }
    })
});

console.log(`🚀 Servidor Académico listo en: ${url}`);
