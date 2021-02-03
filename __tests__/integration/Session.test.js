const request = require('supertest');

const app = require('../../src/app');

const truncate = require('../utils/truncate');
const factories = require('../factories');

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate();
  })

  it('should authenticate with valid credentials', async () => {
    const password = '123123';

    const user = await factories.create('User', { password });

    const response = await request(app).post('/sessions').send({
      email: user.email,
      password
    });
    expect(response.status).toBe(200);
  });

  it('should not authenticate with invalid credentials', async () => {
    const user = await factories.create('User', { password: '123123' });

    const response = await request(app).post('/sessions').send({
      email: user.email,
      password: '123456'
    });
    expect(response.status).toBe(401);
  });

  it('should not authenticate with a user who does not exist', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'someone@domain.com',
      password: '123456'
    });
    expect(response.status).toBe(401);
  });

  it('should return a JWT token when authenticated', async () => {
    const user = await factories.create('User');

    const response = await request(app).post('/sessions').send({
      email: user.email,
      password: user.password,
    });
    expect(response.body).toHaveProperty('token');
  });

  it('should be able to access private routes when there is a user authenticated', async () => {
    const user = await factories.create('User');

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('should not be able to access private routes when there is no an token been sent', async () => {
    const user = await factories.create('User');

    const response = await request(app)
      .get('/dashboard');

    expect(response.status).toBe(401);
  });

  it('should not be able to access private routes when there is an invalid token been sent', async () => {
    const user = await factories.create('User');

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', '43143214321432142143214321');

    expect(response.status).toBe(401);
  });
});
