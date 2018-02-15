const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

describe('remove existing blogs', async () => {
    beforeAll(async () => {
        await Blog.remove({})
        console.log('cleared')
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('blogs can be acquired with a GET request', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
    })

    test('a valid blog can be added', async () => {
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

        expect(response.body.length).toBe(1)
        expect(titles).toContain('Jampan seikkailut')
    })

    test('likes are set to 0 be default', async () => {
        await Blog.remove({})
        console.log('cleared2')
        const newBlog = {
            title: "Jampan seikkailut",
            author: 'Jamppa Koo',
            url: 'www.jampansivut.com'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            console.log('sent')

        const response = await api.get('/api/blogs')
        console.log('responded')

        console.log(response.body)

        const likes = response.body.map(l => l.likes)

        expect(likes[likes.length - 1]).toBe(0)
        console.log('equalled')
    })
})

afterAll(() => {
    server.close()
})