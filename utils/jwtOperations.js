/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken')
const { promisify } = require('util')

const signJWT = promisify(jwt.sign)
const verifyJWT = promisify(jwt.verify)

const createToken = async (payload) => signJWT(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_TIME })

const verifyToken = async (token) => verifyJWT(token, process.env.JWT_SECRET_KEY)

module.exports = {
  createToken,
  verifyToken,
}