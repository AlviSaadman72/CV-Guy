document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded - script.js');

  // Input Elements
  const profileImageInput = document.getElementById('profileImage');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const nationalityInput = document.getElementById('nationality');
  const linkedinInput = document.getElementById('linkedin');
  const githubInput = document.getElementById('github');
  const careerObjectiveInput = document.getElementById('careerObjective');
  const skillsInput = document.getElementById('skills');

  // Output Elements (Resume Preview)
  const outputImage = document.getElementById('outputImage');
  const outputName = document.getElementById('outputName');
  const outputEmail = document.getElementById('outputEmail');
  const outputPhone = document.getElementById('outputPhone');
  const outputNationality = document.getElementById('outputNationality');
  const outputLinkedin = document.getElementById('outputLinkedin');
  const outputGithub = document.getElementById('outputGithub');
  const outputSummary = document.getElementById('outputSummary');
  const outputEducation = document.getElementById('outputEducation');
  const outputWorkExperience = document.getElementById('outputWorkExperience');
  const outputSkills = document.getElementById('outputSkills');

  // Dynamic Content Containers
  const educationContainer = document.getElementById('educationContainer');
  const addEducationButton = document.getElementById('addEducation');
  const workExperienceContainer = document.getElementById('workExperienceContainer');
  const addWorkExperienceButton = document.getElementById('addWorkExperience');

  // Action Buttons
  const downloadPdfButton = document.getElementById('downloadPdfButton');
  const logoutButton = document.getElementById('logoutButton');

  // Message Elements
  const imageMessage = document.getElementById('imageMessage');

  // Theme Toggle Button
  const themeToggleButton = document.getElementById('themeToggleButton');

  // IMPORTANT: Define resumeOutput here, alongside other elements,
  // so it's accessible within the downloadPdfButton click handler.
  const resumeOutput = document.getElementById('resumeOutput');


  // --- Basic check for critical elements required for initial function ---
  const criticalElements = {
    nameInput, outputName, outputSummary, skillsInput, outputSkills,
    outputImage, outputEmail, outputPhone, outputNationality, outputLinkedin, outputGithub,
    outputEducation, outputWorkExperience,
    educationContainer, addEducationButton,
    workExperienceContainer, addWorkExperienceButton,
    downloadPdfButton, logoutButton,
    resumeOutput, // Also check resumeOutput as it's critical for PDF
    themeToggleButton, // NEW: Add theme toggle button to critical elements
    imageMessage
  };

  let allCriticalFound = true;
  for (const key in criticalElements) {
    if (!criticalElements[key]) {
      console.error(`CRITICAL ERROR: Element "${key}" not found in HTML. Check your mainpage.html file.`);
      allCriticalFound = false;
    }
  }
  if (!allCriticalFound) {
    alert('Application Error: Some required elements could not be found. Please check your HTML or contact support.');
    return; // Stop execution if critical elements are missing
  }


  // Initialize counts for dynamic fields
  let educationItemIndex = 0;
  let workExperienceItemIndex = 0;


  // --- Helper function to attach event listeners to input elements ---
  function setupEventListeners(element) {
    if (!element) {
      console.warn('Attempted to set up event listeners on null element.');
      return;
    }

    const inputs = element.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('input', updateResumePreview);
      // Specifically for date inputs, 'change' event might be more reliable
      // especially when browser's date picker is used.
      if (input.type === 'month' || input.type === 'date') {
        input.addEventListener('change', updateResumePreview);
      }
    });

    const removeButton = element.querySelector('.remove-item-btn');
    if (removeButton) {
      removeButton.addEventListener('click', (event) => {
        const item = event.target.closest('.education-item') || event.target.closest('.work-experience-item');
        if (item) {
          console.log('Removing item:', item.className, 'index:', item.dataset.index);
          item.remove();
          updateRemoveButtonVisibility();
          updateResumePreview();
        }
      });
    }
  }


  // --- Add Education Item ---
  function addEducationItem() {
    const newIndex = educationItemIndex++;
    console.log('Adding new Education item with index:', newIndex);
    const educationItemHtml = `
      <div class="education-item" data-index="${newIndex}">
        <h4>Education ${newIndex + 1}</h4>
        <div class="form-group">
          <label for="degree${newIndex}">Degree/Certification:</label>
          <input type="text" id="degree${newIndex}" placeholder="Bachelor of Science in Computer Science">
        </div>
        <div class="form-group">
          <label for="university${newIndex}">University/Institution:</label>
          <input type="text" id="university${newIndex}" placeholder="University of Technology">
        </div>
        <div class="form-group date-group">
          <label for="gradDate${newIndex}">Graduation Date:</label>
          <input type="month" id="gradDate${newIndex}">
        </div>
        <button type="button" class="remove-item-btn">Remove Education</button>
      </div>
    `;
    educationContainer.insertAdjacentHTML('beforeend', educationItemHtml);
    const newEducationItem = educationContainer.lastElementChild;
    setupEventListeners(newEducationItem);
    updateRemoveButtonVisibility();
    updateResumePreview();
  }


  // --- Add Work Experience Item ---
  function addWorkExperienceItem() {
    const newIndex = workExperienceItemIndex++;
    console.log('Adding new Work Experience item with index:', newIndex);
    const workExperienceItemHtml = `
      <div class="work-experience-item" data-index="${newIndex}">
        <h4>Job ${newIndex + 1}</h4>
        <div class="form-group">
          <label for="jobTitle${newIndex}">Job Title:</label>
          <input type="text" id="jobTitle${newIndex}" placeholder="Software Engineer">
        </div>
        <div class="form-group">
          <label for="company${newIndex}">Company:</label>
          <input type="text" id="company${newIndex}" placeholder="Tech Solutions Inc.">
        </div>
        <div class="form-group date-group">
          <label for="startDate${newIndex}">Start Date:</label>
          <input type="month" id="startDate${newIndex}">
          <label for="endDate${newIndex}">End Date:</label>
          <input type="month" id="endDate${newIndex}">
        </div>
        <div class="form-group">
          <label for="responsibilities${newIndex}">Responsibilities (comma-separated):</label>
          <textarea id="responsibilities${newIndex}" rows="3" placeholder="Developed web applications, Managed databases, Collaborated with team..."></textarea>
        </div>
        <button type="button" class="remove-item-btn">Remove Job</button>
      </div>
    `;
    workExperienceContainer.insertAdjacentHTML('beforeend', workExperienceItemHtml);
    const newWorkExperienceItem = workExperienceContainer.lastElementChild;
    setupEventListeners(newWorkExperienceItem);
    updateRemoveButtonVisibility();
    updateResumePreview();
  }


  // --- Update remove button visibility ---
  function updateRemoveButtonVisibility() {
    const eduItems = document.querySelectorAll('.education-item');
    const workItems = document.querySelectorAll('.work-experience-item');

    // Only show remove button if there's more than one item
    eduItems.forEach(item => {
      const removeBtn = item.querySelector('.remove-item-btn');
      if (removeBtn) removeBtn.style.display = eduItems.length > 0 ? 'block' : 'none'; // Show if at least one exists
    });

    workItems.forEach(item => {
      const removeBtn = item.querySelector('.remove-item-btn');
      if (removeBtn) removeBtn.style.display = workItems.length > 0 ? 'block' : 'none'; // Show if at least one exists
    });
  }


  // --- Helper function to update resume preview ---
  function updateResumePreview() {
    console.log('updateResumePreview called.');

    // Personal Info
    outputName.textContent = nameInput.value || 'Your Name';
    outputSummary.textContent = careerObjectiveInput.value || 'Your career objective will appear here.';

    // Profile Image
    if (outputImage) {
      outputImage.style.display = outputImage.src && outputImage.src !== 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=' ? 'block' : 'none';
    }

    // Contact Info
    outputEmail.textContent = emailInput.value.trim() || '';
    outputPhone.textContent = phoneInput.value.trim() || '';
    outputNationality.textContent = nationalityInput.value.trim() ? `Nationality: ${nationalityInput.value.trim()}` : '';

    const linkedinVal = linkedinInput.value.trim();
    if (linkedinVal) {
      const linkedInUrl = linkedinVal.startsWith('http://') || linkedinVal.startsWith('https://') ? linkedinVal : `https://${linkedinVal}`;
      outputLinkedin.innerHTML = `LinkedIn: <a href="${linkedInUrl}" target="_blank">${linkedinVal}</a>`;
    } else {
      outputLinkedin.innerHTML = '';
    }

    const githubVal = githubInput.value.trim();
    if (githubVal) {
      const githubUrl = githubVal.startsWith('http://') || githubVal.startsWith('https://') ? githubVal : `https://${githubVal}`;
      outputGithub.innerHTML = `GitHub: <a href="${githubUrl}" target="_blank">${githubVal}</a>`;
    } else {
      outputGithub.innerHTML = '';
    }


    // Education
    let educationHtml = '';
    const educationItems = educationContainer.querySelectorAll('.education-item');
    if (educationItems.length === 0) {
      educationHtml = '<p class="placeholder-text">Education details will appear here.</p>';
    } else {
      educationItems.forEach(item => {
        const index = item.dataset.index;
        const degree = document.getElementById(`degree${index}`)?.value || '';
        const university = document.getElementById(`university${index}`)?.value || '';
        const gradDate = document.getElementById(`gradDate${index}`)?.value || '';

        if (degree || university || gradDate) {
          educationHtml += `
            <div class="education-item-output">
              <h4>${degree || 'Degree/Certification'}</h4>
              <p>${university || 'University/Institution'}</p>
              <p>${gradDate ? `Graduated: ${gradDate}` : 'Graduation Date'}</p>
            </div>
          `;
        }
      });
    }
    outputEducation.innerHTML = educationHtml;


    // Work Experience
    let workExperienceHtml = '';
    const workExperienceItems = workExperienceContainer.querySelectorAll('.work-experience-item');
    if (workExperienceItems.length === 0) {
      workExperienceHtml = '<p class="placeholder-text">Work experience details will appear here.</p>';
    } else {
      workExperienceItems.forEach(item => {
        const index = item.dataset.index;
        const jobTitle = document.getElementById(`jobTitle${index}`)?.value || '';
        const company = document.getElementById(`company${index}`)?.value || '';
        const startDate = document.getElementById(`startDate${index}`)?.value || '';
        const endDate = document.getElementById(`endDate${index}`)?.value || '';
        const responsibilities = document.getElementById(`responsibilities${index}`)?.value || '';

        if (jobTitle || company || startDate || endDate || responsibilities) {
          let respListHtml = '';
          if (responsibilities) {
            respListHtml = `<ul class="responsibilities-list">` +
              responsibilities.split(',').map(resp => `<li>${resp.trim()}</li>`).join('') +
              `</ul>`;
          }

          workExperienceHtml += `
            <div class="work-item">
              <h4>${jobTitle || 'Job Title'} at ${company || 'Company'}</h4>
              <p>${startDate} - ${endDate || 'Present'}</p>
              ${respListHtml}
            </div>
          `;
        }
      });
    }
    outputWorkExperience.innerHTML = workExperienceHtml;


    // Skills
    let skillsHtml = '';
    const skills = skillsInput.value.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
    if (skills.length === 0) {
      skillsHtml = '<ul class="skills-list-output"><li class="placeholder-text">Skills will appear here.</li></ul>';
    } else {
      skillsHtml = `<ul class="skills-list-output">` +
        skills.map(skill => `<li>${skill}</li>`).join('') +
        `</ul>`;
    }
    outputSkills.innerHTML = skillsHtml;

    // Ensure placeholders are removed if content is present
    document.querySelectorAll('.resume-template .placeholder-text').forEach(p => {
      if (p.parentElement.children.length > 1 && p.textContent.includes('will appear here')) {
        p.remove();
      }
    });

    // Re-add placeholders if sections become empty after removing items
    if (outputEducation.children.length === 0) {
        outputEducation.innerHTML = '<p class="placeholder-text">Education details will appear here.</p>';
    }
    if (outputWorkExperience.children.length === 0) {
        outputWorkExperience.innerHTML = '<p class="placeholder-text">Work experience details will appear here.</p>';
    }
    if (outputSkills.querySelector('ul').children.length === 0) { // Check if the ul itself is empty of list items
        outputSkills.innerHTML = '<ul class="skills-list-output"><li class="placeholder-text">Skills will appear here.</li></ul>';
    }
  }


  // --- Event Listeners ---
  addEducationButton.addEventListener('click', addEducationItem);
  addWorkExperienceButton.addEventListener('click', addWorkExperienceItem);

  // Initial setup for existing inputs and dynamic elements
  setupEventListeners(document.querySelector('.input-section'));
  updateRemoveButtonVisibility(); // Call initially to set correct visibility


  // Listen for changes on all input fields to update preview
  const allInputElements = document.querySelectorAll('.input-section input, .input-section textarea');
  allInputElements.forEach(input => {
    input.addEventListener('input', updateResumePreview);
    if (input.type === 'month' || input.type === 'date') {
      input.addEventListener('change', updateResumePreview);
    }
  });


  // Profile Image Upload
  profileImageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        outputImage.src = e.target.result;
        outputImage.style.display = 'block'; // Show image
        imageMessage.textContent = ''; // Clear any previous message
        updateResumePreview(); // Update preview after image loads
      };
      reader.onerror = () => {
        imageMessage.textContent = 'Error loading image.';
        outputImage.style.display = 'none';
        outputImage.src = '';
      };
      // Basic file size validation (e.g., 2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        imageMessage.textContent = 'Image size exceeds 2MB limit.';
        outputImage.style.display = 'none';
        outputImage.src = '';
        profileImageInput.value = ''; // Clear the input
      } else {
        reader.readAsDataURL(file);
      }
    } else {
      outputImage.src = '';
      outputImage.style.display = 'none';
      imageMessage.textContent = '';
      updateResumePreview();
    }
  });


  // Download as PDF
  downloadPdfButton.addEventListener('click', () => {
    console.log('Attempting to download PDF...');
    const element = document.querySelector('.resume-template'); // Target the resume-template class

    // Temporarily apply light theme for PDF generation to ensure readability
    const originalBodyClass = document.body.className;
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');

    // Remove placeholder texts before generating PDF
    const placeholders = element.querySelectorAll('.placeholder-text');
    placeholders.forEach(p => p.classList.add('hidden-for-pdf')); // Use a class to hide with display: none

    // Re-render to apply theme changes before PDF capture
    setTimeout(() => {
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5], // Top, Left, Bottom, Right
            filename: 'my_resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            console.log('PDF generation complete.');
            // Restore original theme and placeholders after PDF generation
            document.body.className = originalBodyClass;
            placeholders.forEach(p => p.classList.remove('hidden-for-pdf'));
        }).catch(error => {
            console.error('Error during PDF generation:', error);
            alert('Failed to generate PDF. Please try again.');
            // Ensure theme and placeholders are restored even on error
            document.body.className = originalBodyClass;
            placeholders.forEach(p => p.classList.remove('hidden-for-pdf'));
        });
    }, 100); // Small delay to ensure CSS is applied
  });

  // Add a CSS rule for hidden-for-pdf in style.css
  // .hidden-for-pdf { display: none !important; }


  // Logout Button
  logoutButton.addEventListener('click', () => {
    alert('Logged out. Redirecting to login/register page.');
    window.location.href = 'index.html'; // Redirect to login/register page
  });


  // Theme Toggle Functionality
  themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
    // You might want to save the user's preference in localStorage
    // const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    // localStorage.setItem('theme', currentTheme);
  });

  // Initial theme load (optional, if saving preference)
  // const savedTheme = localStorage.getItem('theme');
  // if (savedTheme === 'light') {
  //     document.body.classList.remove('dark-theme');
  //     document.body.classList.add('light-theme');
  // } else {
  //     document.body.classList.add('dark-theme'); // Default to dark
  // }


  // Initial preview update when the page loads
  addEducationItem(); // Add one initial education item
  addWorkExperienceItem(); // Add one initial work experience item
  updateResumePreview();
});