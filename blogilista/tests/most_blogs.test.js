const mostBlogs = require('../utils/list_helper').mostBlogs
const exampleBlogs = require('./example_blogs')

describe('most blogs', () => {

  test('when list if empty is false', () => {
    const result = mostBlogs(exampleBlogs.listWithNoBlogs)
    expect(result).toBe(false)
  })

  test('when list has only one blog most blogs is that', () => {
    const result = mostBlogs(exampleBlogs.listWithOneBlog)
    expect(result).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        blogs: 1
      })
  })

  test('of a bigger list is right', () => {
    const result = mostBlogs(exampleBlogs.listWithManyBlogs)
    expect(result).toEqual(
      {
        author: 'Robert C. Martin',
        blogs: 3
      }
    )
  })

})