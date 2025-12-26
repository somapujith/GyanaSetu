export const ROUTES = {
  HOME: '/',

  STUDENT_LOGIN: '/student-login',
  STUDENT_SIGNUP: '/student-signup',
  STUDENT_DASHBOARD: '/student-dashboard',
  BROWSE_RESOURCES: '/browse',
  MY_REQUESTS: '/requests',

  ADMIN_LOGIN: '/admin-login',
  ADMIN_DASHBOARD: '/admin-dashboard',

  POST_RESOURCE: '/post-resource',

  resourceDetail: (id) => `/resource/${id}`,
};
