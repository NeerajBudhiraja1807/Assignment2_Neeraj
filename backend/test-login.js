const fetch = require('node-fetch');

fetch('http://localhost:5001/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password)
    }`,
    variables: {
      email: 'Abhi@gmail.com',
      password: 'Abhi1807'
    }
  })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
