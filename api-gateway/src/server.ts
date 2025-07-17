import app from './app';
import * as env from 'dotenv';
env.config();

process.env.NODE_DEBUG = 'tls,http,net';

const port = process.env.PORT || 3000;

console.log(`API port ${port}`);

app.listen(port, () => {
    
    console.log(`API Gateway is running on port ${port}`);
});
