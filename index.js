import { config } from 'dotenv';
import { createApp } from './configs/app.js';
import { dbConnection } from './configs/db.js';

config();

const app = createApp();
await dbConnection();

export default app;

if (!process.env.VERCEL) {
    const port = process.env.PORT ?? 3000;
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`);
    });
}
