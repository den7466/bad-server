import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { constants } from 'http2';
import { rateLimit } from 'express-rate-limit';
import { DB_ADDRESS, ORIGIN_ALLOW } from './config';
import errorHandler from './middlewares/error-handler';
import serveStatic from './middlewares/serverStatic';
import routes from './routes';

const { PORT = 3000 } = process.env;
const app = express();
const limiter = rateLimit({
    windowMs: 120 * 60 * 1000,
    max: 20,
    handler: (_req, res) => {
        res.status(constants.HTTP_STATUS_TOO_MANY_REQUESTS).json({
            message: 'Был превышен лимит запросов',
        })
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
})

app.use(cookieParser());

// app.use(cors());
app.use(cors({
    origin: ORIGIN_ALLOW,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(serveStatic(path.join(__dirname, 'public')));

app.use(urlencoded({ extended: true }));
app.use(mongoSanitize());

app.use(json({ limit: 1048576}));
// app.use(limiter);

app.options('*', cors());
app.use(routes);
app.use(errors());
app.use(errorHandler);

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS);
        await app.listen(PORT, () => console.log('ok'));
    } catch (error) {
        console.error(error);
    }
}

bootstrap();
