const User = require('../model/user')
const App = require('../model/app')
const jwt = require('jsonwebtoken')

const getApps = async (req, res) => {
    try {
        const apps = await App.find()
        return res.status(200).json({ apps })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}
const getApp = async (req, res) => {
    try {
        const app = await App.findById(req.params.id)
        return res.status(200).json({ app })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const createApp = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const {name, website, image, appFile, description, contactMail} = req.body 
    const user = await User.findById(decoded.userId)
    try {
        if(user.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' })
        const app = await App.create({name, website, image, appFile, description, contactMail, user: user._id})
        return res.status(200).json({ app })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const updateApp = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const {name, website, image, appFile, description, contactMail} = req.body
    const user = await User.findById(decoded.userId)
    try {
        if(user.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' })
        const app = await App.findByIdAndUpdate(req.params.id, {name, website, image, appFile, description, contactMail}, {new: true})
        return res.status(200).json({ app })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const deleteApp = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    try {
        if(user.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' })
        const app = await App.findByIdAndDelete(req.params.id)
        return res.status(200).json({ app })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}


module.exports = {getApps, getApp, createApp, updateApp, deleteApp}