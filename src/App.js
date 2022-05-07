import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const filterPersons = () => {
    let lowercaseFilter = filter.toLowerCase()
    return persons.filter(({name}) => {
      return name.toLowerCase().startsWith(lowercaseFilter)
    })
  }

  const personsToShow = filter === ''
    ? persons
    : filterPersons()

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const delayResetMessage = () => {
    setTimeout(() => {
      setMessage(null)
      setMessageType(null)
    }, 5000)
  }

  const handleDeletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
      .remove(id)
      .then(response => {
        setPersons(persons.filter((person => person.id !== id)))
        setMessage(`Deleted ${name}`)
        setMessageType('success')
        delayResetMessage()
      })
      .catch(error => {
        setMessage(`${name} is already deleted!`)
        setMessageType('error')
        delayResetMessage()
      })
    }
  }

  const allNames = () => (
    persons.map(({name}) => name)
  )

  const updatePerson = () => {
    if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const targetPerson = persons.find(({name}) => name === newName)
      const changedPerson = { ...targetPerson, number: newNumber }
      const targetId = targetPerson.id

      personService
        .update(targetId, changedPerson)
        .then(returnedPerson => {
          if (!returnedPerson) {
            throw 'Nonexistent person'
          }
          setPersons(persons.map(person => person.id !== targetId ? person : returnedPerson))
          setMessage(`Updated ${returnedPerson.name}'s number`)
          setMessageType('success')
          delayResetMessage()
        })
        .catch(error => {
          if (error === 'Nonexistent person') {
            error = `Information of ${newName} has already been removed from server`
            setPersons(persons.filter(person => person.id !== targetId))
          } else {
            error = error.response.data.error
          }
          setMessage(error)
          setMessageType('error')
          delayResetMessage()
        })
    }
  }

  const createPerson = () => {
    const newPerson = {name: newName, number: newNumber}

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setMessage(`Added ${returnedPerson.name}`)
        setMessageType('success')
        delayResetMessage()
      })
      .catch(error => {
        if (error.response.status === 500) {
          updatePerson()
        } else {
          setMessage(error.response.data.error)
          setMessageType('error')
          delayResetMessage()
        }
      })
  }

  const addPerson = (event) => {
    event.preventDefault()

    createPerson()
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons
        personsToShow={personsToShow}
        handleDeletePerson={handleDeletePerson}
      />
    </div>
  )
}

export default App