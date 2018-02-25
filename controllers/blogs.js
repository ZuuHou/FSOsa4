const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    try {
        const token = getTokenFrom(request)
        console.log(token)
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log(decodedToken)

        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        if (body.title === undefined || body.url === undefined) {
            return response.status(400).json({ error: 'title and/or url missing missing' })
        }

        const user = await User
        .findById(decodedToken.id)

        console.log('token')
        console.log(decodedToken)
        console.log(user)

        const blog = new Blog({
            author: body.author,
            title: body.title,
            url: body.url,
            likes: body.likes === undefined ? 0 : body.likes,
            user: user._id
        })
        const savedBlog = await blog.save()

        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.json(Blog.format(savedBlog))
    } catch (exception) {
        if (exception.name === 'JsonWebTokenError') {
            response.status(401).json({ error: exception.message })
        }
        console.log(exception)
        response.status(500).json({ error: 'fix your stuff!' })
    }
})

blogsRouter.get('/:id', async (request, response) => {
    try {
        const blog = await Blog.findById(request.params.id)

        if (blog) {
            response.json(Blog.format(blog))
        } else {
            response.status(404).end()
        }

    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)

        response.status(204).end()
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    try {
        const body = request.body
        const blog = {
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            id: body._id
        }

        await Blog
            .findByIdAndUpdate(request.params.id, blog, { new: true })
        response.json(Blog.format(blog))


    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted if' })
    }
})

module.exports = blogsRouter