import Login from '../components/login'
import Home from '../components/home'
import Welcome from '../components/welcome'
import Users from '../components/Users/users'
import Roles from '../components/Permissions/roles'
import Rights from '../components/Permissions/rights'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    name: 'Home',
    redirect : '/welcome',
    children : [
      {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome,
      },
      {
        path: '/users',
        name: 'Users',
        component: Users
      },
      {
        path: '/roles',
        name: 'Roles',
        component: Roles
      },{
        path: '/rights',
        name: 'Rights',
        component: Rights
      }
    ]
  }
]
export default routes
