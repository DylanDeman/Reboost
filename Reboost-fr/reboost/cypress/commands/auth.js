// Custom commands for authentication testing

// Login programmatically without using the UI
Cypress.Commands.add('loginProgrammatically', (username, role = 'user') => {
  // Determine user ID and roles based on username
  let userId, roles;
  
  if (username === 'Dylan De Man') {
    userId = 1;
    roles = ['admin', 'user'];
  } else if (username === 'Maxime Jacobs') {
    userId = 2;
    roles = ['user'];
  } else {
    userId = 3;
    roles = ['user'];
  }
  
  // Create user object
  const user = {
    id: userId,
    naam: username,
    roles: roles
  };
  
  // Set localStorage items for authenticated session
  localStorage.setItem('jwtToken', 'fake-jwt-token-for-testing');
  localStorage.setItem('user', JSON.stringify(user));
  
  // Log success
  cy.log(`Logged in programmatically as ${username} with roles: ${roles.join(', ')}`);
});

// Check if user has a specific role
Cypress.Commands.add('hasRole', (role) => {
  cy.window().then(win => {
    const userJson = win.localStorage.getItem('user');
    if (!userJson) {
      return false;
    }
    
    try {
      const user = JSON.parse(userJson);
      if (Array.isArray(user.roles)) {
        return user.roles.includes(role);
      } else if (typeof user.roles === 'string') {
        // Handle case where roles might be a comma-separated string
        return user.roles.split(',').map(r => r.trim()).includes(role);
      }
      return false;
    } catch (e) {
      cy.log('Error checking role:', e);
      return false;
    }
  });
});
