const adminEmails = [
  'ynbonilla_pr@yahoo.com',
  'yadiel.bonilla19@outlook.com'
];

document.addEventListener('DOMContentLoaded', () => {
  const adminList = document.getElementById('admin-list');
  if (adminList) {
    adminList.textContent = adminEmails.join(', ');
  }

  const currentPage = document.body.dataset.page;
  const navLinks = document.querySelectorAll('.main-nav a');

  if (currentPage) {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.includes(currentPage)) {
        link.classList.add('active');
      }
    });
  }

  console.log('Finca Turpial local storefront is ready. Authorized admin emails configured.');
});
