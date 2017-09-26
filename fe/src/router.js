import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'

const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  })
  const routes = [
    {
      path: '/dashboard',
      models: () => [import('./models/dashboard')],
      component: () => import('./routes/dashboard/'),
    },
    {
      path: '/sys/account',
      models: () => [import('./models/sys/account')],
      component: () => import('./routes/sys/account/'),
    },
    {
      path: '/sys/menu',
      models: () => [import('./models/sys/menu')],
      component: () => import('./routes/sys/menu/'),
    },
    {
      path: '/sys/permission',
      models: () => [import('./models/sys/permission')],
      component: () => import('./routes/sys/permission/'),
    },
    {
      path: '/sys/role',
      models: () => [import('./models/sys/role')],
      component: () => import('./routes/sys/role/'),
    },
    {
      path: '/login',
      models: () => [import('./models/login')],
      component: () => import('./routes/login/'),
    },
  ]

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />
          {
            routes.map(({ path, ...dynamics }, key) => (
              <Route key={key} exact path={path} component={dynamic({ app, ...dynamics })} />
            ))
          }
          <Route component={error} />
        </Switch>
      </App>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
