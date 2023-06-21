import express from 'express';
import { port } from './config/config.js';
import { oidc } from './config/provider.js'
import { configuration } from './config/configuration.js';

const provider = oidc('http://localhost:3000', configuration);

const app = express();
app.use('/oidc', provider.callback());

app.listen(port, () => {
    console.log(`Identity server is running on port ${port} ...`);
});