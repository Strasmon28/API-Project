// backend/routes/index.js
const express = require('express');
const apiRouter = require('./api');
const router = express.Router();

// Test route will set a cookie with a name of "XSRF-TOKEN" with value of req.csrfToken, then sends text "Hello World!" as response body.
// router.get('/hello/world', function(req, res) {
//     res.cookie('XSRF-TOKEN', req.csrfToken());
//     res.send('Hello World!');
// });

router.use('/api', apiRouter);

// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken
    });
});

module.exports = router;