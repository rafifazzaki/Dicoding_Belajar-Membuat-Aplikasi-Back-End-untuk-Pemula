// urutan pada HAPI tidak berpengaruh, tapi di Express.js NGARUH
const routes = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Homepage'
        }
    },{
        method: '*',
        path: '/',
        handler: (request, h) => {
            return 'Halaman tidak dapat diakses dengan method tersebut';
        }
    },
    {
        method: 'GET',
        path: '/about',
        handler: (request, h) => {
            return 'About page'
        }
    },
    {
        method: '*',
        path: '/about',
        handler: (request, h) => {
            return 'Halaman tidak dapat diakses dengan method tersebut';
        }
    },
    {
        method: '*',
        path: '/{any*}',
        handler: (request, h) => {
            return 'Halaman tidak ditemukan';
        }
    },
    {
         //curl -X GET http://localhost:5000/users
        method: 'GET',
        path: '/hello/{username?}',
        handler: (request, h) => {
            const {username = 'stranger'} = request.params; //default nilai: stranger
            const {lang} = request.query;

            if(lang ==='id'){
                return `Halo, ${username}!`;
            }

            return `Hello, ${username}!`;
        }
    },
    {
        //curl -X GET http://localhost:5000/users
       method: 'POST',
       path: '/login',
       handler: (request, h) => {
           const {username, password} = request.payload;
           return `${username} + ${password}`;
       }
   },
   {
    method: 'POST',
    path: '/response',
    handler: (request, h) => {
        return h.response('created').code(201); // h sama dengan res pd express/node
    },
}
];

module.exports = routes;