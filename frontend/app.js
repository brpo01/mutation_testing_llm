// Basic JavaScript functionalities for form submission, project handling, and navigation
document.getElementById('registerForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    // Handle registration logic
    alert('Registration successful!');
    window.location.href = 'login.html';
  });
  
  document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    // Handle login logic
    alert('Login successful!');
    window.location.href = 'project.html';
  });
  
  document.getElementById('projectForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    // Handle project creation
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const projectList = document.getElementById('projectList');
    
    const listItem = document.createElement('li');
    listItem.innerHTML = `${title} - ${description} 
      <button onclick="viewProject()">View</button>
      <button onclick="editProject()">Edit</button>
      <button onclick="deleteProject()">Delete</button>`;
    
    projectList.appendChild(listItem);
  });
  
  function viewProject() {
    window.location.href = 'program.html';
  }
  
  document.getElementById('mutationButton')?.addEventListener('click', function() {
    // Handle mutation analysis request
    alert('Performing Mutation Analysis...');
    window.location.href = 'mutationresult.html';
  });
  