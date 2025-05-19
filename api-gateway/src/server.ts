import app from './app';
import * as env from 'dotenv';
env.config();

app.listen(process.env.PORT, () => {
    console.log(`API Gateway is running on port ${process.env.PORT}`);
});
