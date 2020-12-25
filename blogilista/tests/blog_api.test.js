const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const Blog = require('../models/blog')
const exampleBlogs = require('./example_blogs')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(exampleBlogs.listWithManyBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(exampleBlogs.listWithManyBlogs.length)
})

test('blogs have id field named as id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

test('a valid blog can be added', async () => {
  const newBlog = exampleBlogs.listWithOneBlog[0]

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(exampleBlogs.listWithManyBlogs.length + 1)

  const contents = blogsAtEnd.map(blog => blog.title)
  expect(contents).toContain(
    'Go To Statement Considered Harmful'
  )
})

test('Non defined likes-field initializes to zero', async () => {
  const newBlog = exampleBlogs.noLikesFieldBlog

  const resultBlog = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultBlog.body.likes).toEqual(0)
})

test('Blog without title is not added', async () => {
  const newBlog = exampleBlogs.noTitleBlog

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(exampleBlogs.listWithManyBlogs.length)
})

test('Blog without url is not added', async () => {
  const newBlog = exampleBlogs.noUrlBlog

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(exampleBlogs.listWithManyBlogs.length)
})

test('Blog without title and url is not added', async () => {
  const newBlog = exampleBlogs.noTitleOrUrlBlog

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(exampleBlogs.listWithManyBlogs.length)
})



afterAll(() => {
  mongoose.connection.close()
})