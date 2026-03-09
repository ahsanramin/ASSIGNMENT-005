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
