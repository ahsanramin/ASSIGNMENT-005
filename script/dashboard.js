const API_BASE = 'https://phi-lab-server.vercel.app/api/v1/lab';
let allIssues = [];
let currentFilter = 'all';
const cardsContainer = document.getElementById('cardsContainer');
const spinner = document.getElementById('spinner');
const issueCountSpan = document.getElementById('issueCount');
const openCountSpan = document.getElementById('openCount');
const closedCountSpan = document.getElementById('closedCount');
const tabs = document.querySelectorAll('.tab');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.querySelector('.close-btn');
function showSpinner() { spinner.classList.remove('hidden'); }
function hideSpinner() { spinner.classList.add('hidden'); }
async function fetchAllIssues() {
  showSpinner();
  try {
    const res = await fetch(`${API_BASE}/issues`);
    const data = await res.json();
    if (data.status === 'success') {
      allIssues = data.data;
      updateStatsAndDisplay();
    }
  } catch (error) {
    console.error(error);
  } finally {
    hideSpinner();
  }
}
function displayIssues(issues) {
  cardsContainer.innerHTML = '';
  if (!issues.length) {
    cardsContainer.innerHTML = '<p class="col-span-full text-center text-gray-500">No issues found.</p>';
    return;
  }
  issues.forEach(issue => {
    const created = new Date(issue.createdAt).toLocaleDateString();
    const labelsHtml = issue.labels.map(label => `<span class="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">${label}</span>`).join('');

    let priorityBg = 'bg-gray-100 text-gray-800';
    if (issue.priority === 'high') priorityBg = 'bg-red-100 text-red-800';
    else if (issue.priority === 'medium') priorityBg = 'bg-yellow-100 text-yellow-800';
    else if (issue.priority === 'low') priorityBg = 'bg-green-100 text-green-800';

    const statusIcon = issue.status === 'open'
      ? '<img src="assets/Open-Status.png" alt="">'
      : '<img src="assets/Closed- Status .png" alt="">';

    const card = document.createElement('div');
    card.className = `bg-white rounded-lg shadow p-4 border-t-4 ${issue.status === 'open' ? 'border-green-500' : 'border-purple-500'} cursor-pointer hover:shadow-lg transition`;
    card.dataset.id = issue.id;
    card.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                ${statusIcon}
                <span class="${priorityBg} px-2 py-1 rounded-full text-xs font-medium">${issue.priority}</span>
            </div>
            <h3 class="font-bold text-lg text-gray-800 mb-1">${issue.title}</h3>
            <p class="text-gray-600 text-sm mb-2">${issue.description.substring(0, 80)}...</p>
            <div class="flex flex-wrap gap-1 mb-3">${labelsHtml}</div>
            <div class="flex justify-between items-center text-xs">
                <span class="capitalize px-2 py-1 rounded-full ${issue.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}">${issue.status}</span>
                <span class="text-gray-500">#${issue.id} by ${issue.author} · ${created}</span>
            </div>
        `;
    card.addEventListener('click', () => openIssueModal(issue.id));
    cardsContainer.appendChild(card);
  });
}
function updateStatsAndDisplay() {
  const openIssues = allIssues.filter(i => i.status === 'open');
  const closedIssues = allIssues.filter(i => i.status === 'closed');
  openCountSpan.textContent = openIssues.length;
  closedCountSpan.textContent = closedIssues.length;

  let filtered = [];
  if (currentFilter === 'all') filtered = allIssues;
  else filtered = allIssues.filter(i => i.status === currentFilter);

  issueCountSpan.textContent = `${filtered.length} Issues`;
  displayIssues(filtered);
}
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600'));
    tab.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
    currentFilter = tab.dataset.status;
    updateStatsAndDisplay();
  });
});
tabs[0].classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
async function performSearch() {
  const query = searchInput.value.trim();
  if (!query) {
    updateStatsAndDisplay();
    return;
  }
  showSpinner();
  try {
    const res = await fetch(`${API_BASE}/issues/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.status === 'success') {
      displayIssues(data.data);
      issueCountSpan.textContent = `${data.data.length} Issues`;
    } else {
      displayIssues([]);
    }
  } catch (error) {
    console.error(error);
  } finally {
    hideSpinner();
  }
}
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') performSearch(); });
async function openIssueModal(issueId) {
  modal.classList.remove('hidden');
  modalBody.innerHTML = '<div class="flex justify-center"><div class="spinner w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>';
  try {
    const res = await fetch(`${API_BASE}/issue/${issueId}`);
    const data = await res.json();
    if (data.status === 'success') {
      const issue = data.data;
      const created = new Date(issue.createdAt).toLocaleString();
      const labelsHtml = issue.labels.map(l => `<span class="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">${l}</span>`).join('');

      let priorityTextClass = '';
      if (issue.priority === 'high') priorityTextClass = 'text-red-600';
      else if (issue.priority === 'medium') priorityTextClass = 'text-yellow-600';
      else if (issue.priority === 'low') priorityTextClass = 'text-green-600';

      modalBody.innerHTML = `
                <h2 class="text-2xl font-bold text-gray-800 mb-2">${issue.title}</h2>
                <div class="flex items-center gap-2 mb-3">
                    <span class="capitalize px-2 py-1 rounded-full text-xs ${issue.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}">${issue.status}</span>
                    <span class="text-sm text-gray-600">Opened by ${issue.author} · ${created}</span>
                </div>
                <div class="flex flex-wrap gap-1 mb-4">${labelsHtml}</div>
                <p class="text-gray-700 mb-4">${issue.description}</p>
                <div class="border-t border-gray-200 pt-4">
                    <p class="text-sm"><span class="font-medium text-gray-700">Assignee:</span> <span class="text-gray-600">${issue.assignee || 'Unassigned'}</span></p>
                    <p class="text-sm"><span class="font-medium text-gray-700">Priority:</span> <span class="capitalize ${priorityTextClass}">${issue.priority}</span></p>
                </div>
            `;
    } else {
      modalBody.innerHTML = '<p class="text-red-500">Failed to load issue details.</p>';
    }
  } catch (error) {
    modalBody.innerHTML = '<p class="text-red-500">Error loading issue details.</p>';
  }
}
closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('isAuthenticated')) {
    window.location.href = 'index.html';
    return;
  }
  fetchAllIssues();
});