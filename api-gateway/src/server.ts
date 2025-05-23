import app from './app';
import * as env from 'dotenv';
env.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`API Gateway is running on port ${port}`);
});
