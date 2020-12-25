const totalLikes = require('../utils/list_helper').totalLikes
const exampleBlogs = require('./example_blogs')

describe('total likes', () => {

  test('of empty list is zero', () => {
    const result = totalLikes(exampleBlogs.listWithNoBlogs)
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = totalLikes(exampleBlogs.listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = totalLikes(exampleBlogs.listWithManyBlogs)
    expect(result).toBe(36)
  })

})