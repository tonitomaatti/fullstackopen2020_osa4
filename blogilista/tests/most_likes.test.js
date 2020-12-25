const mostLikes = require('../utils/list_helper').mostLikes
const exampleBlogs = require('./example_blogs')

describe('most likes', () => {

  test('when list if empty is false', () => {
    const result = mostLikes(exampleBlogs.listWithNoBlogs)
    expect(result).toBe(false)
  })

  test('when list has only one blog most likes is that', () => {
    const result = mostLikes(exampleBlogs.listWithOneBlog)
    expect(result).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        likes: 5
      })
  })

  test('of a bigger list is right', () => {
    const result = mostLikes(exampleBlogs.listWithManyBlogs)
    expect(result).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        likes: 17
      }
    )
  })

})