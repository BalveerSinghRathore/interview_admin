import axios from 'axios'
// import constant from '../constant';

const useFetchData = async (type, url, auth = false, values = {}) => {
  let result = false
  try {
    let instance = axios.create({
      baseURL: 'http://localhost:3000/api/admin/',
    })

    if (auth) {
      let token = localStorage.getItem('interview-token')
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    switch (type) {
      case 'POST':
        result = await instance.post(url, values)
        break
      case 'PATCH':
        result = await instance.patch(url, values)
        break
      case 'DELETE':
        result = await instance.delete(url, values)
        break

      default:
        result = await instance.get(url, values)
        break
    }
  } catch (error) {
    console.log('error at axios', error)

    if (error.response.status === 401) {
      alert('You are not authorized')

      localStorage.removeItem('interview-token')
      window.location.reload()
    } else if (error.response.status === 500) {
      console.log('500 at axios', error)
    }
  }

  return result
}

export default useFetchData
