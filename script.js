const adminEmails = [
  'ynbonilla_pr@yahoo.com',
  'yadiel.bonilla19@outlook.com'
];

const catalogItems = [
  { name: 'Valencia', category: 'Fruits', page: 'fruits.html' },
  { name: 'Caviar', category: 'Fruits', page: 'fruits.html' },
  { name: 'Meyer', category: 'Fruits', page: 'fruits.html' },
  { name: 'Limon del Pais', category: 'Fruits', page: 'fruits.html' },
  { name: 'Guineo', category: 'Fruits', page: 'fruits.html' },
  { name: 'Platano', category: 'Fruits', page: 'fruits.html' },
  { name: 'Carambola', category: 'Fruits', page: 'fruits.html' },
  { name: 'Palmer', category: 'Fruits', page: 'fruits.html' },
  { name: 'Mulberrys', category: 'Fruits', page: 'fruits.html' },
  { name: 'Litchee', category: 'Fruits', page: 'fruits.html' },
  { name: 'Rambutan', category: 'Fruits', page: 'fruits.html' },
  { name: 'Pimiento', category: 'Vegetables', page: 'vegetables.html' },
  { name: 'Ajies', category: 'Vegetables', page: 'vegetables.html' },
  { name: 'Cilantro', category: 'Vegetables', page: 'vegetables.html' },
  { name: 'Culantro', category: 'Vegetables', page: 'vegetables.html' },
  { name: 'Microgreens', category: 'Vegetables', page: 'vegetables.html' },
  { name: 'Robles Red', category: 'Dragonfruit Plants', page: 'dragonfruit-plants.html' },
  { name: 'Zamorano', category: 'Dragonfruit Plants', page: 'dragonfruit-plants.html' },
  { name: 'Zebra', category: 'Dragonfruit Plants', page: 'dragonfruit-plants.html' },
  { name: 'Laverne Red', category: 'Dragonfruit Plants', page: 'dragonfruit-plants.html' },
  { name: 'Raw Honey', category: 'Other Consumables', page: 'other-consumables.html' },
  { name: 'Juices', category: 'Other Consumables', page: 'other-consumables.html' },
  { name: 'Vanilla', category: 'Other Consumables', page: 'other-consumables.html' },
  { name: 'Flor de Jamaica', category: 'Other Consumables', page: 'other-consumables.html' },
  { name: 'Other Flowers', category: 'Other Consumables', page: 'other-consumables.html' }
];

function normalizeValue(value) {
  return value.trim().toLowerCase();
}

function getMatchingItems(query) {
  const normalizedQuery = normalizeValue(query);

  if (!normalizedQuery) {
    return [];
  }

  return catalogItems.filter((item) => {
    const searchableText = `${item.name} ${item.category}`.toLowerCase();
    return searchableText.includes(normalizedQuery);
  });
}

function findExactMatch(query, items) {
  const normalizedQuery = normalizeValue(query);
  return items.find((item) => normalizeValue(item.name) === normalizedQuery);
}

function setSearchParam(itemName) {
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set('item', itemName);
  window.history.replaceState({}, '', nextUrl);
}

function highlightCatalogItem(itemName) {
  const normalizedItemName = normalizeValue(itemName);
  const productCards = document.querySelectorAll('.product-card');
  let matchedCard = null;

  productCards.forEach((card) => {
    card.classList.remove('product-card-highlight');

    const title = card.querySelector('h3');
    if (title && normalizeValue(title.textContent) === normalizedItemName) {
      matchedCard = card;
    }
  });

  if (!matchedCard) {
    return false;
  }

  matchedCard.classList.add('product-card-highlight');
  matchedCard.setAttribute('tabindex', '-1');
  matchedCard.focus({ preventScroll: true });
  matchedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return true;
}

function navigateToCatalogItem(item) {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  if (currentPage === item.page && highlightCatalogItem(item.name)) {
    setSearchParam(item.name);
    return;
  }

  window.location.href = `${item.page}?item=${encodeURIComponent(item.name)}`;
}

function applySearchTargetFromUrl() {
  const selectedItem = new URLSearchParams(window.location.search).get('item');

  if (selectedItem) {
    highlightCatalogItem(selectedItem);
  }
}

function setupCatalogSearch() {
  const searchWrap = document.querySelector('.search-wrap');
  if (!searchWrap) {
    return;
  }

  const searchInput = searchWrap.querySelector('input');
  const searchButton = searchWrap.querySelector('button');

  if (!searchInput || !searchButton) {
    return;
  }

  const results = document.createElement('div');
  results.className = 'search-results';
  results.hidden = true;
  searchWrap.appendChild(results);

  let matches = [];
  let activeIndex = -1;

  const hideResults = () => {
    activeIndex = -1;
    results.hidden = true;
    results.innerHTML = '';
  };

  const renderResults = () => {
    matches = getMatchingItems(searchInput.value).slice(0, 8);

    if (!matches.length) {
      hideResults();
      return;
    }

    results.innerHTML = matches.map((item, index) => `
      <button type="button" class="search-result${index === activeIndex ? ' active' : ''}" data-item-name="${item.name}">
        <span class="search-result-name">${item.name}</span>
        <span class="search-result-category">${item.category}</span>
      </button>
    `).join('');

    results.hidden = false;
  };

  const goToSelectedItem = () => {
    if (!matches.length) {
      return;
    }

    const selectedItem = matches[activeIndex] || findExactMatch(searchInput.value, matches) || matches[0];
    if (!selectedItem) {
      return;
    }

    hideResults();
    navigateToCatalogItem(selectedItem);
  };

  searchInput.addEventListener('input', () => {
    activeIndex = -1;
    renderResults();
  });

  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim()) {
      renderResults();
    }
  });

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      if (!matches.length) {
        renderResults();
      }

      if (!matches.length) {
        return;
      }

      event.preventDefault();
      activeIndex = (activeIndex + 1) % matches.length;
      renderResults();
      return;
    }

    if (event.key === 'ArrowUp') {
      if (!matches.length) {
        return;
      }

      event.preventDefault();
      activeIndex = activeIndex <= 0 ? matches.length - 1 : activeIndex - 1;
      renderResults();
      return;
    }

    if (event.key === 'Enter') {
      const exactMatches = getMatchingItems(searchInput.value);
      if (!matches.length && !exactMatches.length) {
        return;
      }

      event.preventDefault();
      matches = matches.length ? matches : exactMatches;
      goToSelectedItem();
      return;
    }

    if (event.key === 'Escape') {
      hideResults();
    }
  });

  searchButton.addEventListener('click', () => {
    matches = getMatchingItems(searchInput.value);
    goToSelectedItem();
  });

  results.addEventListener('click', (event) => {
    const resultButton = event.target.closest('.search-result');
    if (!resultButton) {
      return;
    }

    const selectedItem = catalogItems.find((item) => item.name === resultButton.dataset.itemName);
    if (!selectedItem) {
      return;
    }

    hideResults();
    navigateToCatalogItem(selectedItem);
  });

  document.addEventListener('click', (event) => {
    if (!searchWrap.contains(event.target)) {
      hideResults();
    }
  });
}

function setupProductTooltips() {
  const productCards = document.querySelectorAll('.product-card[data-tooltip]');

  productCards.forEach((card, index) => {
    const tooltipText = card.dataset.tooltip;
    const title = card.querySelector('h3');

    if (!tooltipText || !title) {
      return;
    }

    const tooltip = document.createElement('p');
    const tooltipId = `product-tooltip-${index + 1}`;

    tooltip.className = 'product-tooltip';
    tooltip.id = tooltipId;
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-hidden', 'true');
    tooltip.textContent = tooltipText;

    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-describedby', tooltipId);
    card.setAttribute('aria-label', `${title.textContent}. ${tooltipText}`);
    card.appendChild(tooltip);

    const showTooltip = () => {
      card.classList.add('tooltip-visible');
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateY(0)';
      tooltip.setAttribute('aria-hidden', 'false');
    };

    const hideTooltip = () => {
      card.classList.remove('tooltip-visible');
      tooltip.style.opacity = '0';
      tooltip.style.transform = 'translateY(-8px)';
      tooltip.setAttribute('aria-hidden', 'true');
    };

    card.addEventListener('mouseenter', () => {
      showTooltip();
    });

    card.addEventListener('pointerenter', () => {
      showTooltip();
    });

    card.addEventListener('mouseleave', () => {
      hideTooltip();
    });

    card.addEventListener('pointerleave', () => {
      hideTooltip();
    });

    card.addEventListener('focus', () => {
      showTooltip();
    });

    card.addEventListener('focusin', () => {
      showTooltip();
    });

    card.addEventListener('blur', () => {
      hideTooltip();
    });

    card.addEventListener('focusout', () => {
      hideTooltip();
    });
  });
}

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

  setupCatalogSearch();
  setupProductTooltips();
  applySearchTargetFromUrl();

  console.log('Finca Turpial local storefront is ready. Authorized admin emails configured.');
});
