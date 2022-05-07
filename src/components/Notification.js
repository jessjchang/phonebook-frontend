import React from 'react'

const Notification = ({message, type}) => {
  if (message === null) {
    return null
  }

  const messageStyle = {
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (type === 'success') {
    messageStyle['color'] = 'green'
  } else if (type === 'error') {
    messageStyle['color'] = 'red'
  }

  return (
    <div style={messageStyle}>
      {message}
    </div>
  )
}

export default Notification