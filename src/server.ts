import express, { Request, Response } from 'express';
import morgan from 'morgan';
import * as fs from 'fs';
import * as path from 'path';

interface APIResponse {
    status: number;
    data: any;
}

async function loadJsonFile(filePath: string): Promise<Record<string, {}>> {
    const rawJson = fs.readFileSync(path.resolve(filePath), 'utf-8');

    return JSON.parse(rawJson);
}

async function start() {
    const app = express();
    let apiMock: Record<string, any>;

    apiMock = await loadJsonFile('./apiResponses.json')

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

    app.get('/{*path}', async (req: Request, res: Response) => {
        const url = req.url;
        let resp: APIResponse;
    
        if (url === '/') {
            resp = {
                status: 200,
                data: 'Welcome to the MockAPI server'
            };
        } else {
            const key = url.slice(1);
            console.log({key});
            resp = {
                status: apiMock[key].status,
                data: apiMock[key].data || apiMock[key].error
            }
        }
        return res.status(resp.status).send(resp.data);
    });

    app.listen('9003', () => console.log(`MockAPI server started on port 9003!`));
}

start().catch(e => {
    console.log(e, 'Failed :(');
    process.exit(1);
});