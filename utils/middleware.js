const logger = (request, response, next) => {
    if (process.env.NODE_ENV === 'test') {
        return next()
    }
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (req, res, next) => {
    var token
    if (req.headers && req.headers.authorization) {
        var splits = req.headers.authorization.split(' ')
        if (splits.length === 2 && splits[0] === 'bearer') {
            token = splits[1]
        }
    }
    req['token'] = token
    next()
}

module.exports = {
    logger,
    error,
    tokenExtractor
}