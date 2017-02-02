import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

@graphql(gql`
  query {
    user {
      name
    }
  }
`)
class Home extends Component {

  render () {

    const { user, loading } = this.props.data

    if (loading) {
      return (
        <span>User Loading</span>
      )
    }

    return (
      <div className='Home'>
        {`${JSON.stringify(user, null, 2)}`}
      </div>
    )
  }

}

export default Home
