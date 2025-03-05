async function fetchResumeData() {
    try {
        const response = await fetch('https://your-api-endpoint.execute-api.region.amazonaws.com/resume');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching resume data:', error);
        return null;
    }
}

function populateSection(sectionId, items, templateFn) {
    const container = document.getElementById(sectionId);
    container.innerHTML = items.map(templateFn).join('');
}

function experienceTemplate(exp) {
    return `
        <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800">${exp.title}</h3>
            <div class="flex items-center text-gray-600 text-sm mb-2">
                <span>${exp.company}</span>
                <span class="mx-2">•</span>
                <span>${exp.dates}</span>
            </div>
            <ul class="list-disc list-inside space-y-1">
                ${exp.details.map(d => `<li class="text-gray-700">${d}</li>`).join('')}
            </ul>
        </div>
    `;
}

function skillTemplate(skill) {
    return `
        <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-2">${skill.category}</h3>
            <div class="flex flex-wrap gap-2">
                ${skill.items.map(item => `
                    <span class="px-3 py-1 bg-white rounded-full text-sm shadow-sm">
                        ${item}
                    </span>
                `).join('')}
            </div>
        </div>
    `;
}

async function initResume() {
    const resumeData = await fetchResumeData();
    
    if (!resumeData) {
        document.body.innerHTML = `<div class="text-red-500 text-center p-8">Failed to load resume data</div>`;
        return;
    }

    // Populate header
    document.getElementById('name').textContent = resumeData.name;
    document.getElementById('contact').innerHTML = `
        ${resumeData.email ? `<a href="mailto:${resumeData.email}" class="hover:text-blue-600">${resumeData.email}</a>` : ''}
        ${resumeData.phone ? `<span>•</span> ${resumeData.phone}` : ''}
        ${resumeData.linkedin ? `<a href="${resumeData.linkedin}" target="_blank" class="hover:text-blue-600">LinkedIn</a>` : ''}
    `;

    // Populate sections
    populateSection('experience', resumeData.experience, experienceTemplate);
    populateSection('education', resumeData.education, experienceTemplate); // Reusing same template
    populateSection('skills', resumeData.skills, skillTemplate);

    // Initialize visitor counter
    updateVisitorCounter();
}

// Visitor counter function (to be implemented in Chunk 2)
async function updateVisitorCounter() {
    try {
        const response = await fetch('https://your-api-endpoint.execute-api.region.amazonaws.com/visitors', {
            method: 'POST'
        });
        const data = await response.json();
        document.querySelector('#visitor-counter span').textContent = data.count;
    } catch (error) {
        console.error('Error updating visitor count:', error);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initResume);