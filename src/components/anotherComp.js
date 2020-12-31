import React from 'react'

const handleEvent = () => {
  console.log('Hello world...')
}

const AnotherComp = () => {
  return (
    <div>
      This is another component
      <button onClick={handleEvent}>click me</button>
    </div>
  )
}

export default AnotherComp
