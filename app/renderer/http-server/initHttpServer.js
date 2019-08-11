const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

const thisPackage = require('../../../package.json');
const mainRoute = require('./mainRoute');

const routes = [mainRoute];

const initHttpServer = async () => {
  const server = Hapi.server({
    port: 37740,
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
    console.log(err);
  }
};

process.on('unhandledRejection', (err) => {
  console.log('Web Clipper HTTP Server: unhandledRejection:', err);
  process.exit(1);
});

module.exports = initHttpServer;
