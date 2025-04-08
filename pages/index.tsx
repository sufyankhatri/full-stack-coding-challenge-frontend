import { NextPage } from 'next'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { debounce } from 'lodash'

import Layout from '../components/layout'
import useApiData from '../hooks/use-api-data'
import Airport from '../types/airport'
import InfiniteScroll from 'react-infinite-scroll-component'
import getAirport from '../services/get-airport.service'

const Page: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [airports, setAirports] = useState<Airport[]>([])
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('')

  // Create a debounced function that updates the debouncedSearchTerm
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value)
    }, 500),
    []
  )

  // Update the debounced value when searchTerm changes
  useEffect(() => {
    debouncedSetSearchTerm(searchTerm)
    setPage(1)
    setAirports([])
    // Cleanup function to cancel any pending debounced calls
    return () => {
      debouncedSetSearchTerm.cancel()
    }
  }, [searchTerm, debouncedSetSearchTerm])

  useEffect(() => {
    const searchParam = `search=${debouncedSearchTerm}&`
    getAirport(`${searchParam}page=${page}&limit=50`).then((airport) => {
      setAirports([...airports, ...airport])
    })
  }, [debouncedSearchTerm, page])

  const fetchData = () => {
    setPage(page + 1)
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Code Challenge: Airports</h1>

      <h2 className="mt-10 text-xl font-semibold">All Airports</h2>

      <div className="mt-1 relative shadow-sm">
        <input
          type="text"
          name="searchTerm"
          id="searchTerm"
          className="focus:ring-blue-600 focus:border-blue-600 block w-full sm:text-sm border-gray-300 text-gray-800 rounded bg-gray-50 p-3"
          placeholder="Search by name, IATA, city, or country"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <InfiniteScroll
        dataLength={airports.length} //This is important field to render the next data
        next={fetchData}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        // below props only if you need pull down functionality
        refreshFunction={() => {}}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        }
      >
        {airports.map((airport) => (
          <Link
            className="flex items-center p-5 mt-5 text-gray-800 border border-gray-200 rounded-lg shadow-sm hover:border-blue-600 focus:border-blue-600 focus:ring focus:ring-blue-200 focus:outline-none"
            href={`/airports/${airport.iata.toLowerCase()}`}
            key={airport.iata}
          >
            <span>
              {airport.name}, {airport.city}
            </span>
            <span className="ml-auto text-gray-500">{airport.country}</span>
          </Link>
        ))}
      </InfiniteScroll>
    </Layout>
  )
}

export default Page
