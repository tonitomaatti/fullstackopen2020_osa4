const { TestScheduler } = require('jest')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')
const exampleBlogs = require('./example_blogs')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(exampleBlogs.removeMongoFields(exampleBlogs.listWithManyBlogs))
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are six notes', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(6)
})


afterAll(() => {
  mongoose.connection.close()
})