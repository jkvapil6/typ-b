using System.Linq;
using CourseApi.Data;
using CourseApi.Models;
using HotChocolate;
using HotChocolate.Data;

namespace CourseApi.GraphQL
{
    public class Query 
    {
        [UseDbContext(typeof(AppDbContext))]
        [UseProjection]
        public IQueryable<Course> GetCourses([ScopedService] AppDbContext context)
        {
            return context.Courses;
        }

        [UseDbContext(typeof(AppDbContext))]
        [UseProjection]
        public IQueryable<Instructor> GetInstructors([ScopedService] AppDbContext context)
        {
            return context.Instructors;
        }

        [UseDbContext(typeof(AppDbContext))]
        [UseProjection]
        public IQueryable<User> GetUsers([ScopedService] AppDbContext context)
        {
            return context.User;
        }
    }
}