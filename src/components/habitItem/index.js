import React from 'react'
import './habitItem.css'

import { connect } from 'react-redux'

const getLast2Weeks = () => {
  const dateRange = Array(14)
    .fill()
    .map((item, index) => {
      const date = new Date()
      date.setDate(date.getDate() - index - 1)
      return (
        <th>{`${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`}</th>
      )
    })

  return dateRange.reverse()
}

const HabitItem = ({ pageData }) => {
  return (
    <div className="habit-item">
      <table>
        <thead>
          <tr>
            <th></th>
            {getLast2Weeks()}
          </tr>
        </thead>
        <tbody>
          {pageData.items &&
            pageData.items.map((item) => {
              return (
                <tr>
                  <th>{item.name}</th>
                  {item.history.map((historyItem) => {
                    if (historyItem.completed) {
                      return <td className="l1"></td>
                    }

                    return <td className="l0"></td>
                  })}
                  <td>
                    <input type="checkbox" />
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

const mapStateToProps = (state) => ({
  ...state,
})

export default connect(mapStateToProps)(HabitItem)
