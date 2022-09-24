const express = require('express')
const { register } = require('../controllers/auth')
const router = express.Router()

const {getAllJobs, getJobs, createJob, updateJobs, deleteJobs} = require('../controllers/jobs')

router.route('/').post(createJob).get(getAllJobs)
router.route('/:id').get(getJobs).delete(deleteJobs).patch(updateJobs)


module.exports = router