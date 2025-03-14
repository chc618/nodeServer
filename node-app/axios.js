const axios = require('axios')

const service = axios.create({
  baseURL: '/api'
})

export default service
