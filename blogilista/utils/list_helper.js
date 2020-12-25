const dummy = (blogs) => { //eslint-disable-line
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return false
  }
  blogs.sort((blog1, blog2) => blog2.likes - blog1.likes )
  return {
    title: blogs[0].title,
    author: blogs[0].author,
    likes: blogs[0].likes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}