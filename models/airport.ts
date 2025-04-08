import airports from '../data/airports.json'
import Airport from '../types/airport'

export const findAirportByIata = async (iata: string): Promise<Airport | undefined> => {
  return airports.find((airport) => airport.iata === iata.toUpperCase())
}

export const allAirports = async (): Promise<Airport[]> => {
  return airports
}

export const searchAirports = async (
  query: string,
  page: number = 1,
  limit: number = 50
): Promise<Airport[]> => {
  console.log('query', query)
  console.log('page', page)
  console.log('limit', limit)
  const regex = new RegExp(query, 'i')

  const filteredAirports = airports.filter(
    (airport) =>
      regex.test(airport.iata) ||
      regex.test(airport.name) ||
      regex.test(airport.city) ||
      regex.test(airport.country)
  )

  const startIndex = 0
  const endIndex = startIndex + limit
  return filteredAirports.slice(startIndex, endIndex)
}
