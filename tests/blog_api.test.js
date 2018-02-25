const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { format, initialBlogs, nonExistingId, blogsInDb } = require('./test_helper')

describe('remove existing blogs', async () => {
    beforeAll(async () => {
        await Blog.remove({})

        const blogObjects = initialBlogs.map(b => new Blog(b))
        await Promise.all(blogObjects.map(b => b.save()))
    })

    test('blogs are returned as json by GET /api/blogs', async () => {
        const blogsInDatabase = await blogsInDb()
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('blogs can be acquired with a GET request to /api/blogs', async () => {
        const blogsInDatabase = await blogsInDb()
        const response = await api
            .get('/api/blogs')
            .expect(200)

        expect(response.body.length).toBe(blogsInDatabase.length)

        const returnedBlogs = response.body.map(b => b.title)
        blogsInDatabase.forEach(blog => {
            expect(returnedBlogs).toContain(blog.title)
        })
    })

    test('a valid blog can be added', async () => {
        const blogsInDatabase = await blogsInDb()
        const newBlog = {
            title: "Jampan seikkailut",
            author: 'Jamppa Koo',
            url: 'www.jampansivut.com',
            likes: '42'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const titles = response.body.map(b => b.title)

        expect(response.body.length).toBe(blogsInDatabase.length + 1)
        expect(titles).toContain('Jampan seikkailut')
    })

    test('a blog without title/url returns status 400', async () => {
        const newBlog = {
            author: 'Jamppa Koo',
            url: '',
            likes: '42'
        }

        const blogsAtStart = await blogsInDb()

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAfter = await blogsInDb()

        expect(blogsAfter.length).toBe(blogsAtStart.length)

    })

    test('likes are set to 0 be default', async () => {
        await Blog.remove({})
        const newBlog = {
            title: "Jampan seikkailut",
            author: 'Jamppa Koo',
            url: 'www.jampansivut.com'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)

        const response = await api.get('/api/blogs')

        const likes = response.body.map(l => l.likes)

        expect(likes[likes.length - 1]).toBe(0)
    })

    test('404 returned by GET /api/notes/:id with nonexisting valid id', async () => {
        const validNonexistingId = await nonExistingId()

        const response = await api
            .get(`/api/blogs/${validNonexistingId}`)
            .expect(404)
    })

    test('400 is returned by GET /api/notes/:id with invalid id', async () => {
        const invalidId = "5a3d5da59070081a82a3445"

        const response = await api
            .get(`/api/blogs/${invalidId}`)
            .expect(400)
    })
})
describe('DELETE /api/blogs/id testing', async () => {
    let newBlog

    beforeAll(async () => {
        newBlog = new Blog({
            title: "Jampan tarinat",
            author: "Jamppa Koo",
            url: "www.jamppa-com",
        })
        await newBlog.save()
    })

    test('blogpost is removed correctly', async () => {
        const beforeTest = await blogsInDb()

        await api
            .delete(`/api/blogs/${newBlog._id}`)
            .expect(204)

        const afterDeletion = await blogsInDb()
        const afterDeletionTitles = afterDeletion.map(b => b.title)
        expect(afterDeletion.length).toBe(beforeTest.length - 1)
        expect(afterDeletionTitles).not.toContain(newBlog.title)
    })
})



afterAll(() => {
    server.close()
})