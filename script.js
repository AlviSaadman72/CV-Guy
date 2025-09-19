document.addEventListener('DOMContentLoaded', () => {
    const clockElement = document.getElementById('digital-clock');
    const cvForm = document.getElementById('cv-form');
    const cvPreview = document.getElementById('cv-preview');
    const educationContainer = document.getElementById('education-container');
    const projectsContainer = document.getElementById('projects-container');
    const experienceContainer = document.getElementById('experience-container');
    const skillsContainer = document.getElementById('skills-container');
    const referencesContainer = document.getElementById('references-container');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const imageInput = document.getElementById('image-upload');
    let imageDataUrl = '';

    // Digital Clock and Calendar System
    function updateClock() {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        clockElement.textContent = now.toLocaleDateString('en-US', options);
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Theme Toggle Functionality
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.classList.add(currentTheme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const theme = document.body.classList.contains('dark-theme') ? 'dark-theme' : '';
            localStorage.setItem('theme', theme);
        });
    }

    // Dynamic Form Sections
    window.addEducation = function() {
        const eduCount = educationContainer.querySelectorAll('.education-item').length;
        if (eduCount >= 5) {
            alert('Maximum 5 educational information can be added.');
            return;
        }
        const newEdu = document.createElement('div');
        newEdu.classList.add('education-item');
        newEdu.innerHTML = `
            <input type="text" name="degree" placeholder="Degree" required>
            <input type="text" name="institution" placeholder="Institution Name" required>
            <input type="text" name="result" placeholder="Result" required>
            <input type="number" name="passingYear" placeholder="Passing Year" required>
            <button type="button" class="red-btn" onclick="this.parentElement.remove(); updatePreview();">Remove</button>
        `;
        educationContainer.appendChild(newEdu);
        updatePreview();
    };

    window.addProject = function() {
        const newProject = document.createElement('div');
        newProject.classList.add('project-item');
        newProject.innerHTML = `
            <input type="text" name="projectName" placeholder="Project Name">
            <input type="text" name="projectDescription" placeholder="Description">
            <input type="text" name="projectLanguages" placeholder="Used Languages">
            <input type="url" name="projectLink" placeholder="Links">
            <button type="button" class="red-btn" onclick="this.parentElement.remove(); updatePreview();">Remove</button>
        `;
        projectsContainer.appendChild(newProject);
        updatePreview();
    };

    window.addExperience = function() {
        const newExperience = document.createElement('div');
        newExperience.classList.add('experience-item');
        newExperience.innerHTML = `
            <input type="text" name="companyName" placeholder="Company Name">
            <input type="text" name="position" placeholder="Position">
            <input type="text" name="jobDuration" placeholder="Job Duration">
            <button type="button" class="red-btn" onclick="this.parentElement.remove(); updatePreview();">Remove</button>
        `;
        experienceContainer.appendChild(newExperience);
        updatePreview();
    };

    window.addSkill = function() {
        const skillCount = skillsContainer.querySelectorAll('.skill-item').length;
        if (skillCount >= 10) {
            alert('Maximum 10 skills can be added.');
            return;
        }
        const newSkill = document.createElement('div');
        newSkill.classList.add('skill-item');
        newSkill.innerHTML = `
            <input type="text" name="skillName" placeholder="Skill" required>
            <button type="button" class="red-btn" onclick="this.parentElement.remove(); updatePreview();">Remove</button>
        `;
        skillsContainer.appendChild(newSkill);
        updatePreview();
    };

    window.addReference = function() {
        const refCount = referencesContainer.querySelectorAll('.reference-item').length;
        if (refCount >= 3) {
            alert('Maximum 3 references can be added.');
            return;
        }
        const newRef = document.createElement('div');
        newRef.classList.add('reference-item');
        newRef.innerHTML = `
            <input type="text" name="referenceName" placeholder="Name" required>
            <input type="text" name="referenceContact" placeholder="Contact Information" required>
            <button type="button" class="red-btn" onclick="this.parentElement.remove(); updatePreview();">Remove</button>
        `;
        referencesContainer.appendChild(newRef);
        updatePreview();
    };
    
    // Live Preview Functionality
    cvForm.addEventListener('input', updatePreview);
    
    // Image upload handling
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.size > 2 * 1024 * 1024) { // 2MB
            alert('Image size exceeds the maximum limit of 2MB.');
            e.target.value = ''; // Clear the input
            imageDataUrl = '';
            updatePreview();
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            imageDataUrl = event.target.result;
            updatePreview();
        };
        reader.readAsDataURL(file);
    });

    // Main function to update the live preview
    function updatePreview() {
        const formData = new FormData(cvForm);
        let htmlContent = '';
        
        // Use a wrapping div for better structure
        htmlContent += '<div class="cv-document">';
        
        // Add image to the preview if available
        if (imageDataUrl) {
            htmlContent += `<div class="profile-image-container"><img src="${imageDataUrl}" alt="Profile Image" class="profile-image"></div>`;
        }

        // Mandatory Fields
        const fullName = formData.get('fullName');
        const mobile = formData.get('mobileNumber');
        const email = formData.get('email');
        const address = formData.get('homeAddress');
        const nationalId = formData.get('nationalId');

        htmlContent += `<div class="cv-header">`;
        htmlContent += `<h2>${fullName}</h2>`;
        htmlContent += `<p><strong>Mobile:</strong> ${mobile} | <strong>Email:</strong> ${email}</p>`;
        htmlContent += `<p><strong>Address:</strong> ${address} | <strong>National ID:</strong> ${nationalId}</p>`;
        
        const linkedIn = formData.get('linkedInId');
        if (linkedIn) htmlContent += `<p><strong>LinkedIn:</strong> <a href="${linkedIn}">${linkedIn}</a></p>`;
        const gitHub = formData.get('gitHubId');
        if (gitHub) htmlContent += `<p><strong>GitHub:</strong> <a href="${gitHub}">${gitHub}</a></p>`;
        htmlContent += `</div>`; // End cv-header

        htmlContent += '<h3>Educational Information</h3>';
        htmlContent += '<ul>';
        const educationItems = educationContainer.querySelectorAll('.education-item');
        educationItems.forEach(item => {
            const degree = item.querySelector('input[name="degree"]').value;
            const institution = item.querySelector('input[name="institution"]').value;
            const result = item.querySelector('input[name="result"]').value;
            const passingYear = item.querySelector('input[name="passingYear"]').value;
            if (degree) htmlContent += `<li><strong>${degree}</strong> from ${institution}, Result: ${result}, Passing Year: ${passingYear}</li>`;
        });
        htmlContent += '</ul>';

        htmlContent += '<h3>Skills</h3>';
        htmlContent += '<ul>';
        const skillsItems = skillsContainer.querySelectorAll('.skill-item');
        skillsItems.forEach(item => {
            const skill = item.querySelector('input[name="skillName"]').value;
            if (skill) htmlContent += `<li>${skill}</li>`;
        });
        htmlContent += '</ul>';

        const projectsItems = projectsContainer.querySelectorAll('.project-item');
        if (projectsItems.length > 0) {
            htmlContent += '<h3>Academic Projects</h3>';
            htmlContent += '<ul>';
            projectsItems.forEach(item => {
                const name = item.querySelector('input[name="projectName"]').value;
                const desc = item.querySelector('input[name="projectDescription"]').value;
                const lang = item.querySelector('input[name="projectLanguages"]').value;
                const link = item.querySelector('input[name="projectLink"]').value;
                if (name) {
                    htmlContent += `<li><strong>${name}</strong> - ${desc}`;
                    if (lang) htmlContent += ` (${lang})`;
                    if (link) htmlContent += ` <a href="${link}">${link}</a>`;
                    htmlContent += `</li>`;
                }
            });
            htmlContent += '</ul>';
        }

        const experienceItems = experienceContainer.querySelectorAll('.experience-item');
        if (experienceItems.length > 0) {
            htmlContent += '<h3>Working Experience</h3>';
            htmlContent += '<ul>';
            experienceItems.forEach(item => {
                const company = item.querySelector('input[name="companyName"]').value;
                const position = item.querySelector('input[name="position"]').value;
                const duration = item.querySelector('input[name="jobDuration"]').value;
                if (company) htmlContent += `<li><strong>${company}</strong> - ${position} (${duration})</li>`;
            });
            htmlContent += '</ul>';
        }

        const referencesItems = referencesContainer.querySelectorAll('.reference-item');
        if (referencesItems.length > 0) {
            htmlContent += '<h3>References</h3>';
            htmlContent += '<ul>';
            referencesItems.forEach(item => {
                const name = item.querySelector('input[name="referenceName"]').value;
                const contact = item.querySelector('input[name="referenceContact"]').value;
                if (name) htmlContent += `<li><strong>${name}</strong>: ${contact}</li>`;
            });
            htmlContent += '</ul>';
        }
        
        htmlContent += '</div>'; // End cv-document

        cvPreview.innerHTML = htmlContent;
    }
    
    // PDF Download
    window.downloadPDF = function() {
        const element = document.getElementById('cv-preview');

        if (!element || element.innerHTML.trim() === '') {
            alert('Please fill out the form and click "Save & Preview" first.');
            return;
        }

        const opt = {
            margin: 0.5,
            filename: 'my-cv.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        html2pdf().from(element).set(opt).save();
    };
});