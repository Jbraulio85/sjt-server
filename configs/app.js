'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import 'dotenv/config';
import userModel from '../src/users/user.model.js'
import authRoutes from '../src/auth/auth.routes.js';
import postRoutes from '../src/posts/post.routes.js';
import commentRoutes from '../src/comments/comment.routes.js';
import { handleErrors } from '../middlewares/handle-errors.js';

const middlewares = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({extended: false}))
    app.use(cors({
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        crossOriginEmbedderPolicy: false
    }));
    app.use(morgan('dev'));
}

const routes = (app) => {
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/posts', postRoutes);
    app.use('/api/v1/comments', commentRoutes);
}

const conectarDB = async () => {
    try{
        await dbConnection();
    }catch(error){
        console.log(`Error al conectar la db: ${error.message}`)
    }
}

export const initServer = async () => {
    const app = express();

    if (process.env.VERCEL) {
        app.set('trust proxy', 1);
    }

    try{
        middlewares(app)
        routes(app)
        app.use(handleErrors)
        await conectarDB()
        app.listen(process.env.PORT, () =>{
            console.log(`Server running on port: ${process.env.PORT}`)
        })
    }catch(error){
        console.log(`Error al iniciar el servidor: ${error}`);
    }
}
