const fetchJSON = async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

const templateSelect = document.getElementById('template-select');
const accentPicker = document.getElementById('accent-picker');
const editorForm = document.getElementById('editor');
const templateTrack = document.getElementById('template-track');
const templatesPrevBtn = document.getElementById('templates-prev');
const templatesNextBtn = document.getElementById('templates-next');
const viewTemplatesBtn = document.getElementById('view-templates');
const photoUpload = document.getElementById('photo-upload');
const photoSection = document.getElementById('photo-section');
const photoPreviewContainer = document.getElementById('photo-preview');
const preview = {
  name: document.getElementById('preview-name'),
  title: document.getElementById('preview-title'),
  summary: document.getElementById('preview-summary'),
  experience: document.getElementById('preview-experience'),
  skills: document.getElementById('preview-skills'),
  education: document.getElementById('preview-education'),
  templateLabel: document.getElementById('preview-template-label')
};

let templates = [];
let currentTemplate = null;
let cvState = {
  templateId: 'aurora',
  accent: '#3BC9DB',
  data: {
    name: 'Alex Carter',
    title: 'Product Designer',
    summary:
      'Human-centered designer with 6+ years crafting data-informed experiences across SaaS and consumer platforms.',
    experience: [],
    skills: ['Design systems', 'Rapid prototyping', 'User interviews', 'Motion design'],
    education: []
  }
};

const renderTemplateOptions = () => {
  templateSelect.innerHTML = templates
    .map((tpl) => `<option value="${tpl.id}">${tpl.name}</option>`)
    .join('');
  templateSelect.value = cvState.templateId;
};

const renderTemplateGallery = () => {
  if (!templateTrack) return;
  templateTrack.innerHTML = templates
    .map(
      (tpl) => `
        <article class="template-card">
          <div class="card-header">
            <span class="role-badge">${tpl.role}</span>
            <span class="template-badge">${tpl.sampleTitle}</span>
          </div>
          <div class="card-title">
            <h3>${tpl.name}</h3>
          </div>
          <div class="cv-preview" style="--preview-bg:${tpl.previewBackground}; --preview-text:${tpl.previewText}; --preview-accent:${tpl.previewAccent};">
            <div class="cv-page">
              <div class="cv-header ${tpl.hasPhoto ? 'with-photo' : ''}">
                ${tpl.hasPhoto ? '<div class="cv-photo"><div class="photo-placeholder">📷</div></div>' : ''}
                <div class="cv-header-text">
                  <div class="cv-name">${tpl.sampleName}</div>
                  <div class="cv-title">${tpl.sampleTitle}</div>
                  <div class="cv-contact">
                    <span>email@example.com</span>
                    <span>•</span>
                    <span>+1 (555) 123-4567</span>
                    <span>•</span>
                    <span>linkedin.com/in/profile</span>
                  </div>
                </div>
              </div>
              
              <div class="cv-section">
                <div class="cv-section-title">Summary</div>
                <div class="cv-section-content">
                  <p>${tpl.sampleSummary}</p>
                </div>
              </div>
              
              <div class="cv-section">
                <div class="cv-section-title">Experience</div>
                <div class="cv-section-content">
                  <div class="cv-job">
                    <div class="cv-job-header">
                      <strong>Senior ${tpl.sampleTitle}</strong>
                      <span class="cv-date">2021 — Present</span>
                    </div>
                    <div class="cv-company">Tech Innovations Inc.</div>
                    <ul class="cv-bullets">
                      ${tpl.sampleHighlights.map((item) => `<li>${item}</li>`).join('')}
                      <li>Collaborated with cross-functional teams to deliver key initiatives</li>
                    </ul>
                  </div>
                  <div class="cv-job">
                    <div class="cv-job-header">
                      <strong>${tpl.sampleTitle}</strong>
                      <span class="cv-date">2018 — 2021</span>
                    </div>
                    <div class="cv-company">Digital Solutions Ltd.</div>
                    <ul class="cv-bullets">
                      <li>Led projects that improved team efficiency by 30%</li>
                      <li>Mentored junior team members on best practices</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="cv-section">
                <div class="cv-section-title">Skills</div>
                <div class="cv-section-content">
                  <div class="cv-skills">
                    <span class="cv-skill">Leadership</span>
                    <span class="cv-skill">Strategy</span>
                    <span class="cv-skill">Analytics</span>
                    <span class="cv-skill">Communication</span>
                    <span class="cv-skill">Project Management</span>
                  </div>
                </div>
              </div>
              
              <div class="cv-section">
                <div class="cv-section-title">Education</div>
                <div class="cv-section-content">
                  <div class="cv-education">
                    <div class="cv-job-header">
                      <strong>Master of Business Administration</strong>
                      <span class="cv-date">2016 — 2018</span>
                    </div>
                    <div class="cv-company">University of Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <p class="card-description">${tpl.description}</p>
            <button class="use-template-btn" data-template-id="${tpl.id}">
              Use template
            </button>
          </div>
        </article>`
    )
    .join('');
};

const scrollTemplates = (direction) => {
  if (!templateTrack) return;
  const amount = templateTrack.clientWidth * 0.8;
  templateTrack.scrollBy({ left: direction * amount, behavior: 'smooth' });
};

const renderExperience = () => {
  const list = document.getElementById('experience-list');
  list.innerHTML = cvState.data.experience
    .map(
      (role, index) => `
        <div class="card" data-idx="${index}">
          <input type="text" name="experience.${index}.role" value="${role.role}" placeholder="Role" />
          <input type="text" name="experience.${index}.company" value="${role.company}" placeholder="Company" />
          <input type="text" name="experience.${index}.period" value="${role.period}" placeholder="Period" />
          <textarea name="experience.${index}.bullets" rows="3" placeholder="Bullets (comma separated)">${role.bullets.join(', ')}</textarea>
          <button class="ghost small" data-remove-exp="${index}" type="button">Remove</button>
        </div>`
    )
    .join('');
};

const renderEducation = () => {
  const list = document.getElementById('education-list');
  list.innerHTML = cvState.data.education
    .map(
      (item, index) => `
        <div class="card" data-idx="${index}">
          <input type="text" name="education.${index}.school" value="${item.school}" placeholder="School" />
          <input type="text" name="education.${index}.degree" value="${item.degree}" placeholder="Degree" />
          <input type="text" name="education.${index}.period" value="${item.period}" placeholder="Period" />
          <button class="ghost small" data-remove-edu="${index}" type="button">Remove</button>
        </div>`
    )
    .join('');
};

const renderPreview = () => {
  preview.name.textContent = cvState.data.name;
  preview.name.contentEditable = 'true';
  preview.title.textContent = cvState.data.title;
  preview.title.contentEditable = 'true';
  preview.summary.textContent = cvState.data.summary;
  preview.summary.contentEditable = 'true';

  preview.experience.innerHTML = cvState.data.experience
    .map(
      (item) => `
        <div class="preview-card">
          <div>
            <strong>${item.role}</strong> · ${item.company}
          </div>
          <small>${item.period}</small>
          <ul>
            ${item.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}
          </ul>
        </div>`
    )
    .join('');

  preview.skills.innerHTML = cvState.data.skills
    .map((skill) => `<span class="chip">${skill}</span>`)
    .join('');

  preview.education.innerHTML = cvState.data.education
    .map(
      (item) => `
        <div>
          <strong>${item.school}</strong>
          <p>${item.degree}</p>
          <small>${item.period}</small>
        </div>`
    )
    .join('');

  const template = templates.find((tpl) => tpl.id === cvState.templateId);
  if (template) {
    currentTemplate = template;
    document.documentElement.style.setProperty('--preview-accent', cvState.accent);
    document.documentElement.style.setProperty('--preview-background', template.background);
    preview.templateLabel.textContent = template.name;
    preview.templateLabel.style.background = cvState.accent;
    
    if (photoSection) {
      photoSection.style.display = template.hasPhoto ? 'block' : 'none';
    }
  }
};

const syncFormFields = () => {
  editorForm.name.value = cvState.data.name;
  editorForm.title.value = cvState.data.title;
  editorForm.summary.value = cvState.data.summary;
  editorForm.skills.value = cvState.data.skills.join(', ');
};

const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    cvState.data.photo = e.target.result;
    if (photoPreviewContainer) {
      photoPreviewContainer.innerHTML = `<img src="${e.target.result}" alt="Profile photo" style="max-width: 120px; border-radius: 8px;" />`;
    }
    renderPreview();
  };
  reader.readAsDataURL(file);
};

const addExperience = () => {
  cvState.data.experience.push({
    role: 'Product Designer',
    company: 'Company',
    period: '2023 — Present',
    bullets: ['Lead designer for app launch']
  });
  renderExperience();
  renderPreview();
};

const addEducation = () => {
  cvState.data.education.push({
    school: 'University',
    degree: 'Course',
    period: '2020 — 2024'
  });
  renderEducation();
  renderPreview();
};

const saveDraft = async () => {
  const payload = { templateId: cvState.templateId, data: cvState.data };
  const res = await fetchJSON('/api/cv', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  alert(`Draft saved with id ${res.id}`);
};

const exportCv = async () => {
  await fetchJSON('/api/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ templateId: cvState.templateId, data: cvState.data })
  });
  alert('Export queued (stub). Connect real PDF service in backend.');
};

const wireEvents = () => {
  editorForm.addEventListener('input', (event) => {
    const formData = new FormData(editorForm);
    cvState.data.name = formData.get('name');
    cvState.data.title = formData.get('title');
    cvState.data.summary = formData.get('summary');
    cvState.data.skills = formData
      .get('skills')
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);

    const experienceCards = document.querySelectorAll('#experience-list .card');
    cvState.data.experience = Array.from(experienceCards).map((card) => {
      const idx = card.dataset.idx;
      const bullets = card.querySelector(`[name="experience.${idx}.bullets"]`).value;
      return {
        role: card.querySelector(`[name="experience.${idx}.role"]`).value,
        company: card.querySelector(`[name="experience.${idx}.company"]`).value,
        period: card.querySelector(`[name="experience.${idx}.period"]`).value,
        bullets: bullets.split(',').map((b) => b.trim()).filter(Boolean)
      };
    });

    const educationCards = document.querySelectorAll('#education-list .card');
    cvState.data.education = Array.from(educationCards).map((card) => {
      const idx = card.dataset.idx;
      return {
        school: card.querySelector(`[name="education.${idx}.school"]`).value,
        degree: card.querySelector(`[name="education.${idx}.degree"]`).value,
        period: card.querySelector(`[name="education.${idx}.period"]`).value
      };
    });

    renderPreview();
  });

  document.getElementById('add-exp').addEventListener('click', addExperience);
  document.getElementById('add-edu').addEventListener('click', addEducation);
  document.getElementById('save-btn').addEventListener('click', saveDraft);
  document.getElementById('export-btn').addEventListener('click', exportCv);

  templateSelect.addEventListener('change', (e) => {
    cvState.templateId = e.target.value;
    renderPreview();
  });

  accentPicker.addEventListener('input', (e) => {
    cvState.accent = e.target.value;
    renderPreview();
  });

  document.getElementById('start-building').addEventListener('click', () => {
    document.getElementById('workspace').scrollIntoView({ behavior: 'smooth' });
  });

  if (photoUpload) {
    photoUpload.addEventListener('change', handlePhotoUpload);
  }

  preview.name.addEventListener('blur', (e) => {
    cvState.data.name = e.target.textContent;
    editorForm.name.value = e.target.textContent;
  });

  preview.title.addEventListener('blur', (e) => {
    cvState.data.title = e.target.textContent;
    editorForm.title.value = e.target.textContent;
  });

  preview.summary.addEventListener('blur', (e) => {
    cvState.data.summary = e.target.textContent;
    editorForm.summary.value = e.target.textContent;
  });

  if (viewTemplatesBtn) {
    viewTemplatesBtn.addEventListener('click', () => {
      document.getElementById('templates').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (templatesPrevBtn && templatesNextBtn) {
    templatesPrevBtn.addEventListener('click', () => scrollTemplates(-1));
    templatesNextBtn.addEventListener('click', () => scrollTemplates(1));
  }

  if (templateTrack) {
    templateTrack.addEventListener('click', (event) => {
      const button = event.target.closest('.use-template-btn');
      if (!button) return;
      const templateId = button.dataset.templateId;
      if (templateId) {
        window.location.href = `/editor.html?template=${templateId}`;
      }
    });
  }
};

const init = async () => {
  try {
    templates = await fetchJSON('/api/templates');
    renderTemplateOptions();
    renderTemplateGallery();
    renderExperience();
    renderEducation();
    syncFormFields();
    wireEvents();
    renderPreview();
  } catch (error) {
    console.error(error);
    alert('Failed to load templates. Please check server logs.');
  }
};

init();
