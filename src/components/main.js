import React from 'react'
import './main.css'

import AnotherComp from './anotherComp.js'

import HabitItem from './habitItem'

export default () => (
  <div>
    <p className="main">Habit Tracker - Days</p>
    <AnotherComp />

    <HabitItem />
  </div>
)
