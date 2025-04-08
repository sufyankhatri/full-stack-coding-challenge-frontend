import axios from 'axios'

export const getAirport = async (search: string) => {
  const response = await axios.get(`/api/airports/${search}`)
  return response.data
}

export default getAirport
