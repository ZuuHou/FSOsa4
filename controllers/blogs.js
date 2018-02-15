const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        if (body.title === undefined) {
            return response.status(400).json({ error: 'title missing' })
        }

        const blog = new Blog({
            author: body.author,
            title: body.title,
            url: body.url,
            likes: body.likes === undefined ? 0 : body.likes
        })
        const savedBlog = await blog.save()
        response.json(Blog.format(blog))
    } catch (exception) {
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

module.exports = blogsRouter