import React from 'react'

const Persons = ({personsToShow, handleDeletePerson}) => {
  return (
    <div>
      {personsToShow.map(({name, number, id}) =>
        <Person
          key={name}
          name={name}
          number={number}
          id={id}
          handleDeletePerson={handleDeletePerson}
        />
      )}
    </div>
  )
}

const Person = ({name, number, id, handleDeletePerson}) => {
  return (
    <>
      <p>{name} {number}
        <button onClick={() => handleDeletePerson(id, name)}>delete</button>
      </p>
    </>
  )
}

export default Persons