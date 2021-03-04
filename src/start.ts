import express, {Express} from 'express';
import * as CONFIG from './start.cfg.json';
import {graphqlHTTP} from 'express-graphql';
import {schema} from './schemes/_schema';
import {Neo4JDriver} from './utils/Neo4JDriver';

const application: Express = express();

// Initialize neo4J driver (graph database) using configuration from start.cfg.json
Neo4JDriver.createDatabaseConnection(CONFIG.NEO4J.URL, CONFIG.NEO4J.USERNAME, CONFIG.NEO4J.PASSWORD);

// This is our graphql endpoint providing our schema
application.use('/graphql', graphqlHTTP({
    schema,
    pretty  : true,
    graphiql: true
}));

application.listen(CONFIG.SERVER_PORT, () => {
    console.info(`
    GraphQL Server has been started on Port ${CONFIG.SERVER_PORT}.
    GraphiQL IDE: http://localhost:${CONFIG.SERVER_PORT}/graphql`);
});
