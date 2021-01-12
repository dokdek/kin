const router = require('express').Router();

router.route('/').post((req,res) => {
    res.json({auth: true,
    token: req.cookies.token});
})

module.exports = router;