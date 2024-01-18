
require('dotenv').config()
// change the path when in production:
// require('dotenv').config({path: '/home/ubuntu/Dicoding_Belajar-Membuat-Aplikasi-Back-End-untuk-Pemula/notes-app-back-end/env'});

const Hapi = require('@hapi/hapi');

// notes
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');

// users
const users = require('./api/users')
const UsersValidator = require('./validator/users');
const UsersService = require('./services/postgres/UsersService');

// authentications
const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/postgres/AuthenticationsService')
const TokenManager = require('./tokenize/TokenManager')
const AuthenticationsValidator = require('./validator/authentications')

// collaborations
const collaborations = require('./api/collaborations')
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations')

// Exports
const _exports = require('./api/exports')
const ProducerService = require('./services/rabbitmq/ProducerService')
const ExportsValidator = require('./validator/exports')

// uploads
const uploads = require('./api/uploads')
const StorageService = require('./services/S3/StorageService')
const UploadsValidator = require('./validator/uploads')

// cache
const CacheService = require('./services/redis/cacheService')

const ClientError = require('./exceptions/ClientError');
const Jwt = require('@hapi/jwt');
const path = require('path')
const Inert = require('@hapi/inert')


const init = async () => {
    const cacheService = new CacheService()
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const collaborationsService = new CollaborationsService(cacheService)
    const notesService = new NotesService(collaborationsService, cacheService)
    // const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images')) //local storageService
    const storageService = new StorageService()
    


    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0', //process.env.HOST,
        routes: {
            cors:{
                origin: ['*']
            }
        }
    });

    await server.register([
        {
            plugin: Jwt
        },
        {
            plugin: Inert
        }
    ])
    
    server.auth.strategy('notesapp_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        })
    })
    
    await server.register([
        {
            plugin: notes,
            options: {
                service: notesService,
                validator: NotesValidator
            }
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator
            }
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator
            }
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService,
                notesService,
                validator: CollaborationsValidator
            }
        },
        {
            plugin: _exports,
            options: {
                service: ProducerService,
                validator: ExportsValidator
            }
        },
        {
            plugin: uploads,
            options: {
                service: storageService,
                validator: UploadsValidator
            }
        }
    ])

    server.ext('onPreResponse', (request, h) => {
        const {response} = request

        if(response instanceof ClientError){
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }

        return h.continue;
    })

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);

}

init();