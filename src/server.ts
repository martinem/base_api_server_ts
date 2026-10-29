import express, { Request, Response } from 'express';
import morgan from 'morgan';

async function start() {
    const app = express();

    app.use((_request, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
        );
        next();
    });

    app.use(morgan('dev'));
    app.use(express.json());

    app.get('/', async (req: Request, res: Response) => {
        console.log('MockAPI server');
       // console.log('req: ', req);
        const resp = {
            status: 200,
            data: 'Welcome to the MockAPI server'
        };
        return res.status(resp.status).send(resp.data);
    });

    app.listen('9003', () => console.log(`MockAPI server started on port 9003!`));
}

start().catch(e => {
    console.log(e, 'Failed :(');
    process.exit(1);
});