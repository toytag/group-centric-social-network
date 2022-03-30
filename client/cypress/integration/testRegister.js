describe('Test registration',  () => {
  const client_url = 'http://localhost:3000'
  const server_url = 'http://localhost:8080'
  before(() => {
    // Not recommend
    // cy.exec('npm start')
    // cy.exec('cd ../server && npm start')

    cy.request('DELETE', server_url + '/api/user/test', {
      id: 'CypressTestUser',
      password: 'CypressTestUser123',
    })
  })

  it('successfully go to register page', () => {
      cy.visit(client_url + '/register')

      cy.get('[testid=Username]').type('CypressTestUser')
      cy.get('[testid=Password]').type('CypressTestUser123')
      cy.get('[testid=ConfirmPassword]').type('CypressTestUser123')

      cy.get('button').contains('Sign Up').click()

      cy.url().should('deep.eq', client_url + '/')

      cy.request('DELETE', server_url + '/api/user/test', {
      id: 'CypressTestUser',
      password: 'CypressTestUser123',
    })
  })
})
