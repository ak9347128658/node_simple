const { describe, it } = require('node:test');     // built-in test runner (no Jest)
const assert = require('node:assert/strict');      // fail the test if values differ
const request = require('supertest');              // fake HTTP client for Express
const { createApp } = require('../src/app');       // app under test

describe('api', () => {
  const app = createApp();                         // no real port is opened

  it('returns health', async () => {
    const res = await request(app).get('/health');
    assert.equal(res.status, 200);                 // must be HTTP 200
    assert.equal(res.body.status, 'ok');           // body must be { status: "ok" }
  });

  it('greets by name', async () => {
    const res = await request(app).get('/hello/world');
    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'hello world');
  });
});