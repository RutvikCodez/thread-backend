import express from "express";
import { ApolloServer } from "@apollo/server";
import bodyParser from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
        type Query {
            hello: String!
            say(name: String): String
        }

        type Mutation {
            createUser(firstName: String!,lastName: String!,email: String!, password: String!) : Boolean
        }
        `,
    resolvers: {
      Query: {
        hello: () => "Hello Word",
        say: (parent, { name }: { name: string }) => `Hello ${name}`,
      },
      Mutation: {
        createUser: async (
          _,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          }
        ) => {
          await prismaClient.user.create({
            data: {
              email,
              firstName,
              lastName,
              password,
              salt: "random_salt",
            },
          });
          return true;
        },
      },
    },
  });
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  await server.start();
  app.use("/graphql", expressMiddleware(server));
  app.listen(4000, () =>
    console.log(`🚀 Server ready at http://localhost:4000`)
  );
}

startServer();
