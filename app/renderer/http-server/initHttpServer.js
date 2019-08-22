const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

const thisPackage = require('../../../package.json');
const mainRoute = require('./mainRoute');

const routes = [mainRoute];

const PORT = 37740;

const initHttpServer = async () => {
  const server = Hapi.server({
    port: PORT,
    host: 'localhost',
  });

  const swaggerOptions = {
    info: {
      title: 'Catalog Web Clipper API',
      version: thisPackage.version,
    },
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  server.route(routes);

  try {
    await server.start();
    console.log('Web Clipper HTTP Server: running at:', server.info.uri);
  } catch (err) {
    if (err.code === 'EADDRINUSE') {
      throw new Error(`Couldn't start HTTP server since port ${PORT} is unavailable`);
    } else {
      throw err;
    }
  }
};

process.on('unhandledRejection', (err) => {
  console.log('Web Clipper HTTP Server: unhandledRejection:', err);
  process.exit(1);
});

module.exports = initHttpServer;
