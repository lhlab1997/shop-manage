import Login from '../components/login'
import Home from '../components/home'
import Welcome from '../components/welcome'
import Users from '../components/Users/users'
import Roles from '../components/Permissions/roles'
import Rights from '../components/Permissions/rights'
import Categories from '../components/goods/categories'
import Params from '../components/goods/params'
import Goods from '../components/goods/goods'
import addGoods from '../components/goods/add-goods.vue'
import Order from '../components/orders/orders.vue'

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
      },
      {
        path: '/rights',
        name: 'Rights',
        component: Rights
      },
      {
        path: '/categories',
        name: 'Categories',
        component: Categories
      },
      {
        path: '/params',
        name: 'Params',
        component: Params
      },
      {
        path: '/goods',
        name: 'Goods',
        component: Goods,
        children: [
          
        ]
      },
      
      {
        path: '/orders',
        name: 'Order',
        component: Order
      },
      {
        path: '/add-goods',
        name: 'addGoods',
        component: addGoods
      },
    ]
  }
]
export default routes
