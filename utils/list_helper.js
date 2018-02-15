const HashMap = require('hashmap')

const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    let likes = 0
    for (var i = 0; i < blogs.length; i++) {
        likes += blogs[i].likes
    }
    return likes
}

const favouriteBlog = (blogs) => {
    let max = 0
    let index = 0
    for (var i = 0; i < blogs.length; i++) {
        if (max < blogs[i].likes) {
            max = blogs[i].likes
            index = i
        }
    }
    return blogs[index]
}

const mostBlogs = (blogs) => {
    let writers = new HashMap

    for (var i = 0; i < blogs.length; i++) {
        if (writers.has(blogs[i].author)) {
            writers.set(blogs[i].author, writers.get(blogs[i].author) + 1)
        } else {
            writers.set(blogs[i].author, 1)
        }
    }

    let writer = ''
    let max = 0

    writers.forEach(function (value, key) {
        if (max < value) {
            writer = key
            max = value
        }
    })

    const topWriter = [
        {
            author: writer,
            blogs: max
        }
    ]
    return topWriter[0]

}

const mostLikes = (blogs) => {
    let writers = new HashMap

    for (var i = 0; i < blogs.length; i++) {
        if (writers.has(blogs[i].author)) {
            writers.set(blogs[i].author, writers.get(blogs[i].author) + blogs[i].likes)
        } else {
            writers.set(blogs[i].author, blogs[i].likes)
        }
    }

    let writer = ''
    let max = 0

    writers.forEach(function (value, key) {
        if (max < value) {
            writer = key
            max = value
        }
    })

    const topWriter = [
        {
            author: writer,
            likes: max
        }
    ]
    return topWriter[0]
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}