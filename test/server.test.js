const tap = require('tap');
const supertest = require('supertest');
const app = require('../app');
const server = supertest(app);
const { newsCache } = require('../routes/data');

const mockUser = {
    name: 'Clark Kent',
    email: 'clark@superman.com',
    password: 'Krypt()n8',
    preferences: ['us', 'general']
};

let token = '';

// Auth tests
tap.test('POST /api/auth/users/signup', async (t) => {
    const res = await server.post('/api/auth/users/signup').send(mockUser);
    t.equal(res.status, 200);
    t.end();
});

tap.test('POST /api/auth/users/signup missing email', async (t) => {
    const res = await server.post('/api/auth/users/signup').send({
        name: mockUser.name,
        password: mockUser.password
    });
    t.equal(res.status, 400);
    t.end();
});

tap.test('POST /api/auth/users/login', async (t) => {
    const res = await server.post('/api/auth/users/login').send({
        email: mockUser.email,
        password: mockUser.password
    });
    t.equal(res.status, 200);
    t.hasOwnProp(res.body, 'token');
    token = res.body.token;
    t.end();
});

tap.test('POST /api/auth/users/login wrong password', async (t) => {
    const res = await server.post('/api/auth/users/login').send({
        email: mockUser.email,
        password: 'wrongpassword'
    });
    t.equal(res.status, 401);
    t.end();
});

// Preferences tests
tap.test('GET /api/preferences with token', async (t) => {
    const res = await server.get('/api/preferences').set('Authorization', `Bearer ${token}`);
    t.equal(res.status, 200);
    t.hasOwnProp(res.body, 'preferences');
    t.same(res.body.preferences, mockUser.preferences);
    t.end();
});

tap.test('GET /api/preferences without token', async (t) => {
    const res = await server.get('/api/preferences');
    t.equal(res.status, 401);
    t.end();
});

tap.test('PUT /api/preferences', async (t) => {
    const res = await server.put('/api/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({ preferences: ['us', 'technology'] });
    t.equal(res.status, 200);
    t.same(res.body.preferences, ['us', 'technology']);
    t.end();
});

tap.test('Check PUT /api/preferences', async (t) => {
    const res = await server.get('/api/preferences').set('Authorization', `Bearer ${token}`);
    t.equal(res.status, 200);
    t.same(res.body.preferences, ['us', 'technology']);
    t.end();
});

// News tests
tap.test('GET /api/news first request (API)', async (t) => {
    // Clear cache
    newsCache.data = null;
    newsCache.timestamp = null;

    const res = await server.get('/api/news').set('Authorization', `Bearer ${token}`);
    t.equal(res.status, 200);
    t.hasOwnProp(res.body, 'news');
    t.equal(res.body.source, 'api');
    t.ok(newsCache.data, 'Cache should be populated');
    t.end();
});

tap.test('GET /api/news second request (cache)', async (t) => {
    const res = await server.get('/api/news').set('Authorization', `Bearer ${token}`);
    t.equal(res.status, 200);
    t.hasOwnProp(res.body, 'news');
    t.equal(res.body.source, 'cache');
    t.end();
});

tap.test('GET /api/news without token', async (t) => {
    const res = await server.get('/api/news');
    t.equal(res.status, 401);
    t.end();
});

tap.teardown(() => process.exit(0));
