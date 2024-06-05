import express from 'express';
import { ApolloServer } from '@apollo/server';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4'

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `
        type Query {
            hello: String!
            say(name: String): String
        }
        `,
        resolvers: {
            Query: {
               hello: () => "Hello Word",
               say: (parent, { name }: {name: string}) => `Hello ${name}`
            }
        }
    })
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    await server.start();
    app.use('/graphql', expressMiddleware(server));
    app.listen(4000, () =>
        console.log(`🚀 Server ready at http://localhost:4000`)
    );
}

startServer()