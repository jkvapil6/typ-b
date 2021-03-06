import React from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { Tabs, Button, message } from 'antd'
const { TabPane } = Tabs
import { FileAddOutlined, UserAddOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons'

import '@/core/types'
import Content from '../components/common/Content'
import ProCard from '@/components/common/ProCard'
import CreateCourse from '@/components/manager/CreateCourse'
import { fetchAllManager } from '@/core/graphql/queries/managerQueries'
import { fetchAllUsers } from '@/core/graphql/queries/userQueries'
import { fetchRoles } from '@/core/graphql/queries/rolesQueries'
import { checkCoursesMutation } from '@/core/graphql/mutations/adminMutations'
import EditCourse from '@/components/manager/EditCourse'
import CreateInstructor from '@/components/manager/CreateInstructor'
import { ALL_COURSE_DETAIL_QUERY } from "@/core/graphql/queries/courseDetailQueries"
import UsersTable from '@/components/manager/UsersTable'

///
/// Manager create course page
///
export default function managerPage(props) {
    const router = useRouter()
    const newCourseTab = router.query.newCourse
    const editCourseTab = router.query.editCourse
    let course = {}
    let loaded
    if (editCourseTab || newCourseTab) {
      const id = parseInt(router.query.id)
      const { loading, error, data } = useQuery(ALL_COURSE_DETAIL_QUERY, 
        {variables: { id }})
      if (loading) return null
      if (error) return `Error! ${error}`
      course = data.courses.nodes[0]
      loaded = data
     
    }

    const checkCourses = async () => {
      const res = await checkCoursesMutation()
      if (res?.checkCourses) {
        message.success(`${res.checkCourses} uzavřených kurzů`)
      } else {
        message.info(`Všechny kurzy jsou již uzavřeny`)
      }
    }

    return (
      <Content>
        <ProCard>
          <Tabs tabPosition="left" defaultActiveKey={newCourseTab || editCourseTab ? "newCourse" : "profil"}>
            <TabPane key="users"
              tab={
                <span>
                  <TeamOutlined />
                  Uživatelé
                </span>
              }
            >
              <UsersTable 
                roles={props.data.roles} 
                users={props.data.users.sort((x, y) => (x.waiting === y.waiting)? 0 : x.waiting? -1 : 1)}
              />
            </TabPane>
            <TabPane key="newCourse"
              tab={
                <span>
                  <FileAddOutlined />
                  Nový kurz
                </span>
              }
            >
              {editCourseTab
                ? <EditCourse course={course} instructors={props.data.instructors}></EditCourse>
                : <CreateCourse course={newCourseTab ? course : null} instructors={props.data.instructors}></CreateCourse>
              }
            </TabPane>
            <TabPane key="newInstructor"
              tab={
                <span>
                  <UserAddOutlined />
                  Nový lektor
                </span>
              }
            >
              <CreateInstructor></CreateInstructor>
            </TabPane>
            <TabPane key="courses"
              disabled
              tab={
                <Button onClick={checkCourses}>Uzavřít dokončené kurzy</Button>
              }
            >
            </TabPane>
          </Tabs>
        </ProCard>
      </Content>
    )
  }

  ///
/// This gets called on every request
///
export const getServerSideProps = async () => {
  const res = await fetchAllManager()
  const users = await fetchAllUsers()
  const roles = await fetchRoles()
  return { props: { data: { instructors: res.instructors, ...users, roles } } }
}