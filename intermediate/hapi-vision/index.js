const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Handlebars = require('handlebars');

const init = async () => {
    const server = Hapi.Server({
      host: 'localhost',
      port: 3000,
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);

    await server.register(Vision);

    server.views({
        engines: {
        hbs: Handlebars
        },
        path: __dirname + '/views',
    })

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
          // Rendering an hbs view with Handlebars
          return h.view('index', {
            title: 'Hapi.js with Handlebars',
            message: 'Ini adalah template rendering engine menggunakan handlebars dan plugin vision'
          });
        },
      });

  };
   
  init();