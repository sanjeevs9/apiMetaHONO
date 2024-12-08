import { Hono } from 'hono'
import { createYoga, createSchema, YogaServer } from 'graphql-yoga';
import { TYPE_DEFS } from './graphql/type';
import { QUERY } from './graphql/resolver';


const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})


const schema = createSchema({
  typeDefs: TYPE_DEFS,
  resolvers: QUERY,
})

// Create GraphQL Yoga server
const yogaServer = createYoga({
  schema,
  graphiql: true,
  context:async()=>{}
});

// Add the `/graphql` route for Yoga
app.use('/graphql', async (c) => {
  const response = await yogaServer.handleRequest(c.req.raw,{});
  return response;
});


export default app;