module.exports = function () {
    var service = {
        notFoundMiddleware: notFoundMiddleware,
        send404: send404
    };
    return service;

    function notFoundMiddleware(req, res, next) {
        send404(req, res, 'API endpoint not found');
    }

    function send404(req, res, description) {
        var data = {
            status: 404,
            message: 'Not Found',
            description: description,
            url: req.url
        };
        res.status(404)
            .send(data)
            .end();
    }
};
