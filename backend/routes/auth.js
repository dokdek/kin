const router = require('express').Router();

router.route('/').get((req,res) => {
    res.json({auth: true});
})

module.exports = router;