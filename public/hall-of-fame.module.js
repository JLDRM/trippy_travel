"use strict";

export var hallOfFameModule = (function () {

  const root_url = window.document.location.origin;
  const graphql = "/graphql?"

  function getHallOfFamePromise() {
    let hallOfFameQuery = JSON.stringify({
      query: `query {
        hall_of_fame {
          id,
          nickname,
          scoreTime,
          description
        }
      }`,
      variables: null,
    })

    return fetch(root_url + graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: hallOfFameQuery
    })
  }

  function addRecordPromise(nickname, scoreTime, description) {
    let newRecordQuery = JSON.stringify({
      query: `mutation {
        addRecord(nickname:"${nickname}",scoreTime:"${String(scoreTime)}",description:"${description}"){
          nickname,
          scoreTime,
          description
        }
      }`,
      variables: null,
    })

    return fetch(root_url + graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: newRecordQuery
    })
  }

  return {
    getHallOfFamePromise: getHallOfFamePromise,
    addRecordPromise: addRecordPromise,
  }

})()