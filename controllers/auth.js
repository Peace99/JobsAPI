const User = require('../models/users')
const { StatusCodes } = require('http-status-codes')
const { BadRequest, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
    
    // const {name, email, password} = req.body
    // if(!name || !email || !password){
    //     throw new BadRequest('Please provide name, email and password')
    // }
    const user = await User.create({...req.body})
    const token = user.createJWT() 
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token})
}


const login = async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        throw new BadRequest('Please provide email and password')
    }

    const user = await User.findOne({email})
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user: {name: user.name}, token})

}

module.exports = {
    register, login
}