import React from 'react'
import {
  Route,
  DefaultRoute
} from 'react-router'

import App from './pages/app'
import BatteryMain from './pages/battery/main'

export default (
  <Route>
    <Route name='app' path='/' handler={ App }>
      <DefaultRoute handler={ BatteryMain } />
    </Route>
  </Route>
)
