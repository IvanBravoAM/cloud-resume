
function parseDynamoItem(item) {
    const flatten = (obj) => {
      if (obj.S) return obj.S;
      if (obj.N) return Number(obj.N);
      if (obj.L) return obj.L.map(flatten);
      if (obj.M) {
        const result = {};
        for (const key in obj.M) {
          result[key] = flatten(obj.M[key]);
        }
        return result;
      }
      return obj;
    };
    
    return flatten(item);
  }
  
  // Update fetchResumeData
  async function fetchResumeData() {
      try {
          const response = await fetch('https://sats8483fb.execute-api.us-east-1.amazonaws.com/prd/resume');
          
          
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          return data.resume_data;  
      } catch (error) {
          console.error('Error fetching resume data:', error);
          return null;
      }
  }

  function populateSection(sectionId, items = [], templateFn) {
    const container = document.getElementById(sectionId);
    if (!items || !Array.isArray(items)) {
        container.innerHTML = '<p class="text-gray-500">No data available</p>';
        return;
    }
    container.innerHTML = items.map(templateFn).join('');
}

function experienceTemplate(exp) {
    return `
        <div class="mb-12 ">
            <div class="grid grid-cols-4">
                <div class="col-span-2">
                    <h3 class="lg:text-xl font-semibold text-white">${exp.title}  </h3>
                </div>
                
                <div class="col-span-2">
                    <h3 class="lg:text-xl text-right text-blue-600">${exp.company}</h3>
                </div>

                <div class="text-sm lg:text-lg text-white">
                    <span>${exp.dates}</span>
                </div>
            </div>
            <div class="p-4 italic text-gray-400">
                    ${exp.description}
            </div>
            <ul class="list-image-[url(assets/icons/blue-check.png)] list-inside space-y-1">
                ${(exp.details || []).map(d => `
                    <li class="text-gray-200">${d}</li>
                `).join('')}
            </ul>
        </div>
    `;
}

function skillTemplate(skill) {
    return `
        <div class="grid grid-cols-2 lg:grid-cols-8 p-1">
            <div class="col-span-1 flex items-center justify-center">
            <img src="assets/icons/${skill.category}-icon.png" alt="programming" class="w-10 h-10 bg-m-blue rounded-full flex items-center justify-center shadow-sm">
            </div>
            <div class="col-span-7 flex flex-wrap gap-2">
                ${skill.items.map(item => `
                    <span class="px-3 py-1.5 bg-gray-800 rounded-full text-sm text-gray-200 shadow-sm">
                        ${item}
                    </span>
                `).join('')}
            </div>
        </div>
    `;
}

function projectTemplate2(project) {
    return `
        <article class="hover:scale-95 delay-200 transition bg-gray-800 p-4 rounded-lg  mb-4">
            <h3 class="font-medium text-gray-50 mb-2">${project.tittle}</h3>
            <p class="text-gray-200">${project.description}</p>
            <a href="${project.github}" target="_blank" class="hover:text-blue-600 mb-4">⤴️</a>
            <a href="${project.demo}" target="_blank" class="hover:text-blue-600 mb-4">🪣</a>
            <div class="flex flex-wrap gap-2">
                ${project.stack.map(item => `
                    <span class="px-3 py-1 bg-white rounded-full text-sm shadow-sm">
                        ${item}
                    </span>
                `).join('')}
            </div>
        </article>
    `;
}

function projectTemplate(project) {
    return `<article class="group relative bg-m-blue dark:bg-m-blue p-6 rounded-xl shadow-lg hover:scale-[102%] transition-transform duration-200 ease-in-out">
    <div class="space-y-4">
        <!-- Title & Links -->
        <div class="flex justify-between items-start">
            <h3 class="text-xl font-semibold text-gray-100 dark:text-gray-200">
                ${project.tittle}
            </h3>
            <div class="flex gap-3">
                <span class="px-3 py-1.5 bg-s-700 dark:bg-gray-800 rounded-full text-sm text-gray-200 shadow-sm">
                    ${project.status}
                </span>
                <a href="${project.github}" target="_blank" class="text-gray-300 hover:text-blue-400 transition-colors" aria-label="Demo">
                    <img class="h-8 w-8" src="https://img.icons8.com/?size=100&id=AZOZNnY73haj&format=png&color=000000">
                </a>
                <a href="${project.demo}" target="_blank" class="text-gray-300 hover:text-blue-400 transition-colors" aria-label="GitHub">
                    <img class="h-8 w-8" src="https://img.icons8.com/?size=100&id=0mB4XgmUmhiD&format=png&color=000000">
                </a>
            </div>
        </div>

        <!-- Description -->
        <p class="text-gray-300 dark:text-gray-400 leading-relaxed">
            ${project.description}
        </p>

        <!-- Tech Stack -->
        <div class="flex flex-wrap gap-2 pt-2">
        ${project.stack.map(item => `
            <span class="px-3 py-1.5 bg-gray-700 dark:bg-gray-800 rounded-full text-sm text-gray-200 shadow-sm">
                ${item}
                    </span>
                `).join('')}
        </div>
    </div>

    <!-- Hover Effect Border -->
    <div class="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/20 rounded-xl pointer-events-none transition-all duration-300"></div>
</article>`};

async function initResume() {
    
    // Initialize visitor counter
    //updateVisitorCounter();
    const resumeData = await fetchResumeData();
    console.log(resumeData);
    if (!resumeData) {
        document.body.innerHTML = `<div class="text-red-500 text-center p-8">Failed to load resume data</div>`;
        return;
    }

    // Populate header with personal_info
    const personalInfo = resumeData.personal_info;
    document.getElementById('name').textContent = personalInfo.name;
    document.getElementById('about').textContent = resumeData.professional_summary;
    document.getElementById('contact').innerHTML = `
        ${personalInfo.email ? `
            <div class="flex items-center gap-1 min-w-0 min-h-0 my-4  bg-m-grey shadow-lg rounded-lg grid grid-cols-3">
            <a href="mailto:${personalInfo.email}" class="hover:text-blue-600">
            <img class="h-6 w-6" src="https://logospng.org/download/microsoft-outlook/logo-microsoft-outlook-256.png">
            </a>
            <div class="self-end col-span-2 text-s" >Mail</div>
            </div>` : ''}
        ${personalInfo.linkedin ? `<div class="flex items-center gap-1 min-w-0 min-h-0 my-4  bg-m-grey shadow-lg rounded-lg grid grid-cols-3"">
            <a href="${personalInfo.linkedin}" target="_blank" class="hover:text-blue-600 "><img class="h-8 w-8" src="https://logospng.org/download/linkedin/logo-linkedin-icon-256.png"></a>
            <div class="self-end col-span-2" >LinkedIn</div>
            </div>` : ''}
        ${personalInfo.github ? `<div class="flex items-center gap-1 min-w-0 min-h-0 my-4  bg-m-grey shadow-lg rounded-lg grid grid-cols-3"">
            <a href="https://${personalInfo.github}" target="_blank" class="hover:text-blue-600"><img class="h-8 w-8" src="https://img.icons8.com/?size=100&id=AZOZNnY73haj&format=png&color=000000"></a>
            <div class="self-end col-span-2" >Github</div>
            </div>` : ''}
        
        ${personalInfo.github ? `<div class="flex items-center gap-1 min-w-0 min-h-0 my-4  bg-m-grey shadow-lg rounded-lg grid grid-cols-3"">
                <a href="https://${personalInfo.github}" target="_blank" class="hover:text-blue-600"><img class="h-8 w-8" src="https://img.icons8.com/?size=100&id=AZOZNnY73haj&format=png&color=000000"></a>
                <div class="self-end col-span-2" >Articles</div>
                </div>` : ''}
        ${personalInfo.github ? `<div class="flex items-center gap-1 min-w-0 min-h-0 my-4  bg-m-grey shadow-lg rounded-lg grid grid-cols-3"">
            <a href="https://${personalInfo.github}" target="_blank" class="hover:text-blue-600"><img class="h-8 w-8" src="https://img.icons8.com/?size=100&id=AZOZNnY73haj&format=png&color=000000"></a>
            <div class="self-end col-span-2" >CV</div>
            </div>` : ''}        

    `;

    // Populate sections with correct data paths
    populateSection('experience', resumeData.professional_experience || [], experienceTemplate);
    populateSection('education', resumeData.education || [], educationTemplate);
    populateSection('skills', formatSkills(resumeData.skills), skillTemplate);
    populateSection('projects', resumeData.projects || [], projectTemplate);

    
}

function educationTemplate(edu) {
    return `
        <div class="mb-4">
            <div class="flex items-center">
            <h3 class="font-bold text-gray-50 mr-2">${edu.degree}</h3>
            <p class="text-gray-200">${edu.institution}</p>
            </div>
            <p class="text-sm text-gray-500">${edu.dates}</p>
        </div>
    `;
}

// Format skills data
function formatSkills(skills) {
    return Object.entries(skills).map(([category, items]) => ({
        category: category.replace(/_/g, ' ').toUpperCase(),
        items: items
    }));
}

// Visitor counter function (to be implemented in Chunk 2)
async function updateVisitorCounter() {
    try {
        const response = await fetch('https://sats8483fb.execute-api.us-east-1.amazonaws.com/prd/visitors', {
            method: 'POST'
        });
        const data = await response.json();
        document.querySelector('#visitor-counter span').textContent = "Visitors: " + data.count;
    } catch (error) {
        console.error('Error updating visitor count:', error);
    }
}


function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
    }
});


// Initialize on load
document.addEventListener('DOMContentLoaded', initResume);