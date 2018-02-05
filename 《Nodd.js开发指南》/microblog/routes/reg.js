const express = require('express')

const router = express.Router()

router.reg = (req, res) => {
  res.send('test')
}
module.exports = router
