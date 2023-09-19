import { Request, Response } from 'express';
import { createLink, retrieveLink } from "../controllers/Controller"


const LinkInfo = require('../models/Links')
const router = require('express').Router()


// post a link
router.post('/', createLink)

// get all links

router.get('/', retrieveLink )

module.exports = router