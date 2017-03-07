import anonymousRoutes from './instagram/instagram.routes'

export default function (app) {
    app.use('/instagram', anonymousRoutes());
};
