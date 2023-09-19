import { Request, Response } from 'express';
import  {createNode, retrieveNode}  from '../controllers/Controller';


const NodeInfo = require('../models/Nodes')
const router = require('express').Router()

// retrive all nodes

router.get('/', retrieveNode)

// Post a node

router.post('/', createNode);



module.exports = router