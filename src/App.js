import React, { useState, useRef, useCallback } from 'react';
import usePersonSearch from './usePersonSearch';
import './App.css';

export default function App() {
  const [queryName, setQueryName] = useState('')
  const [queryAge, setQueryAge] = useState()
  const [firstSlicedArray, setFirstSlicedArray] = useState(0)
  const [secondSlicedArray, setSecondSlicedArray] = useState(50)

  const { people, hasMore, loading, error } = usePersonSearch(queryName, queryAge, firstSlicedArray, secondSlicedArray)

  const observer = useRef()

  const lastPersonElementRef = useCallback(node => {

    if (loading) return

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setFirstSlicedArray(prevFirstSlicedArray => prevFirstSlicedArray + 50)
        setSecondSlicedArray(prevSecondSlicedArray => prevSecondSlicedArray + 50)
      }
    })

    if (node) observer.current.observe(node)

  }, [loading, hasMore])

  function handleSearch(e) {
    setQueryName(e.target.value)
    setFirstSlicedArray(0)
    setSecondSlicedArray(50)
  }

  function handleSearchAge(e) {
    setQueryAge(e.target.value)
    setFirstSlicedArray(0)
    setSecondSlicedArray(50)
  }

  return (
    <div className="search-container">
      <h1>Person Search</h1>
      <div className="search-bar">
        <input className="search-input" type="text" placeholder="Name" value={queryName} onChange={handleSearch} />
        <input className="search-input" type="text" placeholder="Age" value={queryAge} onChange={handleSearchAge} />
      </div>

      <div className="search-result">
        {
          people.map((person, index) => {
            if (people.length === index + 1) {
              return (
                <div className='item' key={index} ref={lastPersonElementRef}>
                  <span className="label">Name:</span>
                  <span className="data name">{person.name}</span>
                  <span className="label">Age:</span>
                  <span className="data">{person.age}</span>
                </div>
              )
            } else {
              return (
                <div className='item' key={index}>
                  <span className="label">Name:</span>
                  <span className="data name">{person.name}</span>
                  <span className="label">Age:</span>
                  <span className="data">{person.age}</span>
                </div>
              )
            }
          })
        }
      </div>

      <div className="loading-error">{ loading && 'Loading...' }</div>
      <div className="loading-error">{ error && 'Error!' }</div>
    </div>
  )
}
