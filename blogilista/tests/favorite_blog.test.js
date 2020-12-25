const favoriteBlog = require('../utils/list_helper').favoriteBlog
const exampleBlogs = require('./example_blogs')

describe('favorite blog', () => {

  test('of empty list is false', () => {
    const result = favoriteBlog(exampleBlogs.listWithNoBlogs)
    expect(result).toBe(false)
  })

  test('when list has only one blog favorite is that', () => {
    const result = favoriteBlog(exampleBlogs.listWithOneBlog)
    expect(result).toEqual(
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5
      })
  })

  test('of a bigger list is right', () => {
    const result = favoriteBlog(exampleBlogs.listWIthManyBlogs)
    expect(result).toEqual(
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12
      }
    )
  })

})