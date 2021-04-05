import supertest from 'supertest';
import app from '../app/app';
import http from 'http';
import { seedAdmin } from '../test-setup/seed';
import { clearDatabase, closeDatabase } from '../test-setup/db-config';

let server, request, seededAdmin;

beforeAll(async () => {
    server = http.createServer(app);
    await server.listen();
    request = supertest(server);
});

beforeEach(async () => {
    seededAdmin = await seedAdmin();
});