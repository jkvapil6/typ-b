import '@/core/types'
import { gql } from "@apollo/client"
import { client } from '@/core/graphql/client'

/**
 * Add course mutation
 * 
 * @param {Course} course
 */
export const addCourseMutation = async (course) => {
  const mutation = gql`
    mutation {
      addCourse(input:{
          name: "${course.name}"
          photoUrl: "${course.photoUrl}"
          capacity: ${course.capacity}
          type: "${course.type}"
          difficulty: ${course.difficulty}
          date: "${course.date}"
          duration: ${course.duration}
          price: ${course.price}
          description: "${course.description}"
          skills: "${course.skills}"
          content: [
            ${course.content.map((item) => `{ name: "${item.name}", subchapters: [${item.subchapters.map((sub) => `"${sub}"`)}] }`)}
          ]
          instructorId: ${course.instructorId}
          placeId: ${course.placeId}
      }){
          id
      }
    }`

  const data = await client.request(mutation)
  return data
}

/**
 * Update course mutation
 * 
 * @param {Course} course
 */
 export const updateCourseMutation = async (course) => {
  const mutation = gql`
    mutation {
      updateCourse(id: ${course.id}, input:{
          id: ${course.id}
          name: "${course.name}"
          photoUrl: "${course.photoUrl}"
          capacity: ${course.capacity}
          type: "${course.type}"
          difficulty: ${course.difficulty}
          date: "${course.date}"
          duration: ${course.duration}
          price: ${course.price}
          description: "${course.description}"
          skills: "${course.skills}"
          content: [
            ${course.content.map((item) => `{ name: "${item.name}", subchapters: [${item.subchapters.map((sub) => `"${sub}"`)}] }`)}
          ]
          instructorId: ${course.instructorId}
          placeId: ${course.placeId}
      }){
          id
      }
    }`

  const data = await client.request(mutation)
  return data
}

/**
 * Cancel course mutation
 * 
 */
 export const cancelCourseMutation = async (courseId) => {
  const mutation = gql`
    mutation {
      cancelCourse(courseId: ${courseId})
    }`

  const data = await client.request(mutation)
  return data
}


  