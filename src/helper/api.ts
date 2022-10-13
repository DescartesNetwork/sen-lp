import axios from 'axios'

const api = {
  // Authentication header
  auth: async (auth: boolean | object = false) => {
    if (typeof auth === 'object') return auth
    if (!auth) return null
    const wallet = window.sentre.solana
    if (!wallet) throw new Error('Wallet is not connected')
    const datetime = Number(new Date()) + 10000 // Valid in 10s
    const msg = datetime.toString() + Math.floor(Math.random() * 10 ** 16)
    const data = await wallet.signMessage(msg)
    const authHeader = JSON.stringify(data)
    return { Authorization: authHeader }
  },
  // Create
  post: async (
    url: string,
    params: any = null,
    auth: boolean | object = false,
  ) => {
    const authHeader = await api.auth(auth)
    try {
      const { data } = await axios({
        method: 'post',
        url: url,
        data: params,
        headers: authHeader,
      })
      if (data.status === 'ERROR') throw new Error(data.error)
      return data
    } catch (er: any) {
      if (!er.response) throw new Error(er.message)
      const {
        response: {
          data: { error },
        },
      } = er
      throw new Error(error)
    }
  },
  // Read
  get: async (
    url: string,
    params: any = null,
    auth: boolean | object = false,
  ) => {
    const authHeader = await api.auth(auth)
    try {
      const { data } = await axios({
        method: 'get',
        url: url,
        params: params,
        headers: authHeader,
      })
      if (data.status === 'ERROR') throw new Error(data.error)
      return data
    } catch (er: any) {
      if (!er.response) throw new Error(er.message)
      const {
        response: {
          data: { error },
        },
      } = er
      throw new Error(error)
    }
  },
  // Update
  put: async (
    url: string,
    params: any = null,
    auth: boolean | object = false,
  ) => {
    const authHeader = await api.auth(auth)
    try {
      const { data } = await axios({
        method: 'put',
        url: url,
        data: params,
        headers: authHeader,
      })
      if (data.status === 'ERROR') throw new Error(data.error)
      return data
    } catch (er: any) {
      if (!er.response) throw new Error(er.message)
      const {
        response: {
          data: { error },
        },
      } = er
      throw new Error(error)
    }
  },
  // Delete
  delete: async (
    url: string,
    params: any = null,
    auth: boolean | object = false,
  ) => {
    const authHeader = await api.auth(auth)
    try {
      const { data } = await axios({
        method: 'delete',
        url: url,
        data: params,
        headers: authHeader,
      })
      if (data.status === 'ERROR') throw new Error(data.error)
      return data
    } catch (er: any) {
      if (!er.response) throw new Error(er.message)
      const {
        response: {
          data: { error },
        },
      } = er
      throw new Error(error)
    }
  },
}

export default api
