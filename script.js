const adminEmails = [
  'ynbonilla_pr@yahoo.com',
  'yadiel.bonilla19@outlook.com'
];

document.addEventListener('DOMContentLoaded', () => {
  const adminList = document.getElementById('admin-list');
  if (adminList) {
    adminList.textContent = adminEmails.join(', ');
  }

  console.log('Finca Turpial local storefront is ready. Authorized admin emails configured.');
});
