import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";
import { generateToken } from "./generateToken.js";
import jwt from "jsonwebtoken";

const SECRET = "super-secret-key";

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

// Context function to check token
async function context({ req }) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    throw new Error("Unauthorized - missing token");
  }

  try {
    const user = jwt.verify(token, SECRET); // verify token
    return { user }; // available in resolvers
  } catch (err) {
    throw new Error("Unauthorized - invalid token");
  }
}

console.log("Your token:", generateToken()); // JWT string for testing

const { url } = await startStandaloneServer(server, {
  context, // add context here
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);
