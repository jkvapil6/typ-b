import '@/core/types'
import { gql } from "@apollo/client"
import { sendRequest } from '@/core/graphql/client'


/**
 * @returns {Object<Courses>} 
 */
export const fetchAllCourses = async () => {
  const res = await sendRequest(ALL_COURSES_QUERY)
  if (res) {
    return { courses: res?.courses?.nodes }
  }
}

export const ALL_COURSES_QUERY = gql`
  query {
    courses {
      nodes {
        id
        name
        date
        description
        photoUrl
        capacity
        canceled
        occupancy
        duration
        type
        difficulty
        place {
          id
          name
          virtual
          address
        }
        price
        evaluation
        instructor {
          id
          name
          surname
        }
      }
    }
  }
`
