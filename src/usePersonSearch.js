import { useEffect, useState } from 'react';
import axios from 'axios';

export default function usePersonSearch (queryName, queryAge, firstSlicedArray, secondSlicedArray) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [people, setPeople] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setPeople([])
    }, [queryName, queryAge])

    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel

        axios({
            method:'GET',
            url: 'https://random-persons.herokuapp.com/users',
            cancelToken: new axios.CancelToken(c => cancel = c) // Cancelation token to avoid calling the API for every typed letter
        }).then(res => {
            const list = res.data.data
            let result = []

            setPeople(prevPeople => {
                result = [...new Set([...prevPeople, ...list.filter(entry => {
                    if (queryAge && queryName !== '') {
                        return entry.name.includes(queryName) && entry.age.toString() === queryAge
                    } else if (queryAge && queryName === '') {
                        return entry.age.toString() === queryAge
                    } else {
                        return entry.name.includes(queryName)
                    }
                }).slice(firstSlicedArray, secondSlicedArray)])]

                return result
            })

            setHasMore(secondSlicedArray <= result.length)

            setLoading(false)
        }).catch(e => {
            if(axios.isCancel(e)) return
            setError(true)
        })

        return () => cancel()

    }, [queryName, queryAge, firstSlicedArray, secondSlicedArray])

    return { loading, error, people, hasMore }
}