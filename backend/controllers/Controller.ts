import { Request, Response } from 'express';
import  Node, {eNode} from '../models/Nodes'
import Link, {eLink} from '../models/Links'


const router = require('express').Router()
// request a node 

const createNode = async(req: Request , res: Response) => {
    const {name, x, y, occupation, description, ErdosNumber, CoAuthor} = req.body

    let empty = []

    
    if (!name) {
        empty.push('name')
    }
    if (!x) {
        empty.push('x')
    }
    if (!y) {
        empty.push('y')
    }
    if (!occupation) {
        empty.push('occupation')
    }
    if (!description) {
        empty.push('description')
    }
    if (!ErdosNumber) {
        empty.push('ErdosNumber')
    }
    if (empty.length > 0) {
        return res.status(400).json({error: 'Please fill in all the fields', empty})
    }
    
    try {
        const node = await Node.create({name, x, y, occupation,  description, ErdosNumber, CoAuthor })
        res.status(200).json(node)
    } catch(error) {
        const err = error as Error
        res.status(400).json({error: err.message})
    }
}

// retrieve all nodes
const retrieveNode = async(req: Request, res: Response) => {
    try {
        const nodes = await Node.find();
        res.json(nodes);
    } catch (error){
        res.status(500).json({error: 'Internal Server Error'});
    }
}

// Creating a link

const createLink = async(req:Request, res: Response) => {
    const {source, target} = req.body; 
    let empty = [];
    if (!source) {
        empty.push('source')
    }
    if (!target) {
        empty.push('target')
    }

    try {
        const link = await Link.create({source, target})
        res.status(200).json(link)
    } catch (error) {
        const err = error as Error
        res.status(400).json({error: err.message})
    }
}

// getting a link

const retrieveLink = async(req: Request, res: Response) => {
    try {
        const links = await Link.find();
        res.json(links);
    } catch (error){
        res.status(500).json({error: 'Internal Server Error'});
    }
}

export  {createNode, retrieveNode, createLink, retrieveLink};