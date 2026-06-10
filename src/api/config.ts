import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://593k123.mars-t.mars-hosting.com/api/',
})

export default instance
