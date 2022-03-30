describe('test Login', () => {
  const client_url = 'http://localhost:3000'
  const server_url = 'http://localhost:8080'
  before(() => {
    // Not recommend
    // cy.exec('npm start')
    // cy.exec('cd ../server && npm start')

    cy.request('POST', server_url + '/api/user/test', {
      id: 'CypressTestUser',
      password: 'CypressTestUser123',
      attempts: 0,
    })

    // cy.request('POST', server_url + '/api/user/', {
    //   id: 'CypressTestUser',
    //   password: 'CypressTestUser123',
    //   attempts: 0,
    // })
  })
  
  it('successfully go to Login page', () => {
    cy.visit(client_url + '/login')

    cy.get('[testid=Username]').type('CypressTestUser')
    cy.get('[testid=Password]').type('CypressTestUser123')

    cy.get('button').contains('Login').click()

    cy.url().should('deep.eq', client_url + '/')

    cy.request('DELETE', server_url + '/api/user/test', {
      id: 'CypressTestUser',
    })
  })

  it('successfully go to forget password page', () => {
    cy.visit(client_url + '/login')

    cy.get('[testid=forgetPswd]').click()

    cy.url().should('deep.eq', client_url + '/forget')
  })
})