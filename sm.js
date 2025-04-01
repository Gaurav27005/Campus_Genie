document.addEventListener('DOMContentLoaded', function() {
  // Get semester tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  const semPanels = document.querySelectorAll('.sem-panel');
  
  // Add click event to tab buttons
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const semId = button.getAttribute('data-sem');
      
      // Remove active class from all buttons and panels
      tabButtons.forEach(btn => btn.classList.remove('active'));
      semPanels.forEach(panel => panel.classList.remove('active'));
      
      // Add active class to clicked button and corresponding panel
      button.classList.add('active');
      document.getElementById(semId).classList.add('active');
      
      // Fetch materials for the selected semester
      fetchMaterials(semId.replace('sem', ''));
    });
  });
  
  // Fetch materials for the default active tab (semester 3)
  fetchMaterials(3);
});

async function fetchMaterials(semester) {
  try {
    const response = await fetch(`/api/materials?semester=${semester}`);
    const materials = await response.json();
    
    if (response.ok) {
      displayMaterials(materials, semester);
    } else {
      console.error('Error fetching materials:', materials.message);
      displayError(`Failed to load semester ${semester} materials. Please try again later.`, semester);
    }
  } catch (error) {
    console.error('Error:', error);
    displayError(`Failed to connect to the server. Please try again later.`, semester);
  }
}

function displayMaterials(materials, semester) {
  const materialsGrid = document.querySelector(`#sem${semester} .materials-grid`);
  
  // Group materials by subject
  const subjectGroups = {};
  materials.forEach(material => {
    if (!subjectGroups[material.subject]) {
      subjectGroups[material.subject] = [];
    }
    subjectGroups[material.subject].push(material);
  });
  
  // Clear existing content
  materialsGrid.innerHTML = '';
  
  // Check if there are any materials
  if (Object.keys(subjectGroups).length === 0) {
    materialsGrid.innerHTML = '<div class="no-materials">No study materials available for this semester</div>';
    return;
  }
  
  // Create subject sections
  for (const subject in subjectGroups) {
    const subjectSection = document.createElement('div');
    subjectSection.className = 'subjects-section';
    
    const subjectHeader = document.createElement('h3');
    subjectHeader.textContent = subject;
    subjectSection.appendChild(subjectHeader);
    
    const materialsList = document.createElement('div');
    materialsList.className = 'materials-list';
    
    // Add materials for this subject
    subjectGroups[subject].forEach(material => {
      const materialCard = document.createElement('div');
      materialCard.className = 'material-card';
      
      materialCard.innerHTML = `
        <div class="material-content">
          <h4>${material.title}</h4>
          <p>${material.description}</p>
          <div class="material-meta">
            <span>Uploaded by: ${material.uploadedBy ? material.uploadedBy.name : 'Anonymous'}</span>
            <span>Date: ${new Date(material.createdAt).toLocaleDateString()}</span>
          </div>
          <a href="${material.fileUrl}" class="btn" target="_blank">Download</a>
        </div>
      `;
      
      materialsList.appendChild(materialCard);
    });
    
    subjectSection.appendChild(materialsList);
    materialsGrid.appendChild(subjectSection);
  }
}

function displayError(message, semester) {
  const materialsGrid = document.querySelector(`#sem${semester} .materials-grid`);
  materialsGrid.innerHTML = `<div class="error-message">${message}</div>`;
}