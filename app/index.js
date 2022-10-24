require('./global');
const app = require('./app');

app.listen({ port: 4000 }, () => logger.info('🚀 Server ready at http://localhost:4000/graphql '));
