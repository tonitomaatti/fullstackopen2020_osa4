const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const Blog = require('../models/blog')
const exampleBlogs = require('./example_blogs')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'root', passwordHash })
  const returnedUser = await user.save()

  const blogsWithUser = exampleBlogs.listWithManyBlogs.map(blog => {
    blog.user = returnedUser._id
    return blog
  })
  await Blog.deleteMany({})
  await Blog.insertMany(blogsWithUser)
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

  const user = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${user.body.token}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(exampleBlogs.listWithManyBlogs.length + 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  expect(titles).toContain(
    'Go To Statement Considered Harmful'
  )
})

test('blog is not added without user token', async () => {
  const newBlog = exampleBlogs.listWithOneBlog[0]

  const result = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toBeDefined()
  expect(result.body.error).toContain('invalid token')
})

test('Non defined likes-field initializes to zero', async () => {
  const newBlog = exampleBlogs.noLikesFieldBlog

  const user = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const resultBlog = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${user.body.token}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultBlog.body.likes).toEqual(0)
})

test('Blog without title is not added', async () => {
  const newBlog = exampleBlogs.noTitleBlog

  const user = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${user.body.token}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(exampleBlogs.listWithManyBlogs.length)
})

test('Blog without url is not added', async () => {
  const newBlog = exampleBlogs.noUrlBlog

  const user = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${user.body.token}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(exampleBlogs.listWithManyBlogs.length)
})

test('Blog without title and url is not added', async () => {
  const newBlog = exampleBlogs.noTitleOrUrlBlog

  const user = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${user.body.token}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(exampleBlogs.listWithManyBlogs.length)
})

test('A blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  const user = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `bearer ${user.body.token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    exampleBlogs.listWithManyBlogs.length -1
  )

  const titles = blogsAtEnd.map(blog => blog.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('A blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  blogToUpdate.title = 'An updated title'

  const updatedBlog = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(updatedBlog.body.title).toEqual('An updated title')
})

afterAll(() => {
  mongoose.connection.close()
})