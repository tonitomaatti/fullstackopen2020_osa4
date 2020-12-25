const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')
const exampleBlogs = require('./example_blogs')

const api = supertest(app)
const initialBlogs = exampleBlogs.removeMongoFields(exampleBlogs.listWithManyBlogs)


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})


afterAll(() => {
  mongoose.connection.close()
})