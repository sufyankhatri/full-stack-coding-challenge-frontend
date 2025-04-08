import { NextApiRequest, NextApiResponse } from 'next'

import { allAirports, searchAirports } from '../../../models/airport'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { search } = req.query
  const airportString = search?.toString().split('&')[0].replace('search=', '') || ''
  const pageNumber = +(search?.toString().split('&')[1].replace('page=', '') || '1')
  const limitNumber = +(search?.toString().split('&')[2].replace('limit=', '') || '10')
  if (search === '') {
    const all = await allAirports()

    res.status(200).json(all)
  }

  const response = await searchAirports(airportString, pageNumber, limitNumber)
  const airports = response !== undefined ? response : []

  res.status(200).json(airports)
}
