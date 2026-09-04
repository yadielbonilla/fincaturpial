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
  const productCardList = Array.from(productCards);
  let activeCard = null;

  const positionTooltip = (card, tooltip) => {
    const viewportPadding = 16;
    const sideGap = 18;
    const stackedLayout = window.innerWidth <= 760;
    const cardRect = card.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const roomRight = window.innerWidth - cardRect.right - viewportPadding;
    const roomLeft = cardRect.left - viewportPadding;
    const roomAbove = cardRect.top - viewportPadding;
    const roomBelow = window.innerHeight - cardRect.bottom - viewportPadding;
    const buildCandidate = (side) => {
      let left = viewportPadding;
      let top = viewportPadding;

      if (side === 'right') {
        left = Math.min(cardRect.right + sideGap, window.innerWidth - tooltipRect.width - viewportPadding);
        top = Math.min(
          Math.max(cardRect.top + (cardRect.height - tooltipRect.height) / 2, viewportPadding),
          window.innerHeight - tooltipRect.height - viewportPadding
        );
      } else if (side === 'left') {
        left = Math.max(viewportPadding, cardRect.left - tooltipRect.width - sideGap);
        top = Math.min(
          Math.max(cardRect.top + (cardRect.height - tooltipRect.height) / 2, viewportPadding),
          window.innerHeight - tooltipRect.height - viewportPadding
        );
      } else if (side === 'below') {
        left = Math.min(
          Math.max(cardRect.left + (cardRect.width - tooltipRect.width) / 2, viewportPadding),
          window.innerWidth - tooltipRect.width - viewportPadding
        );
        top = Math.min(cardRect.bottom + sideGap, window.innerHeight - tooltipRect.height - viewportPadding);
      } else {
        left = Math.min(
          Math.max(cardRect.left + (cardRect.width - tooltipRect.width) / 2, viewportPadding),
          window.innerWidth - tooltipRect.width - viewportPadding
        );
        top = Math.max(viewportPadding, cardRect.top - tooltipRect.height - sideGap);
      }

      return {
        side,
        left,
        top,
        right: left + tooltipRect.width,
        bottom: top + tooltipRect.height
      };
    };

    const getOverlapScore = (candidate) => productCardList.reduce((score, otherCard) => {
      if (otherCard === card) {
        return score;
      }

      const otherRect = otherCard.getBoundingClientRect();
      const overlapWidth = Math.max(0, Math.min(candidate.right, otherRect.right) - Math.max(candidate.left, otherRect.left));
      const overlapHeight = Math.max(0, Math.min(candidate.bottom, otherRect.bottom) - Math.max(candidate.top, otherRect.top));
      return score + (overlapWidth * overlapHeight);
    }, 0);

    const preferredSides = stackedLayout
      ? (roomBelow >= roomAbove ? ['below', 'above', 'right', 'left'] : ['above', 'below', 'right', 'left'])
      : (roomRight >= roomLeft ? ['right', 'left', 'above', 'below'] : ['left', 'right', 'above', 'below']);

    const bestPosition = preferredSides
      .map((side) => {
        const candidate = buildCandidate(side);
        return {
          ...candidate,
          overlapScore: getOverlapScore(candidate)
        };
      })
      .sort((first, second) => first.overlapScore - second.overlapScore || preferredSides.indexOf(first.side) - preferredSides.indexOf(second.side))[0];

    tooltip.dataset.side = bestPosition.side;
    tooltip.style.left = `${Math.round(bestPosition.left)}px`;
    tooltip.style.top = `${Math.round(bestPosition.top)}px`;
  };

  const updateActiveTooltipPosition = () => {
    if (!activeCard) {
      return;
    }

    const tooltip = document.getElementById(activeCard.getAttribute('aria-describedby'));
    if (!tooltip || !tooltip.classList.contains('tooltip-visible')) {
      return;
    }

    positionTooltip(activeCard, tooltip);
  };

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
    document.body.appendChild(tooltip);

    const showTooltip = () => {
      if (activeCard && activeCard !== card) {
        activeCard.classList.remove('tooltip-visible');
        const activeTooltipId = activeCard.getAttribute('aria-describedby');
        const activeTooltip = activeTooltipId ? document.getElementById(activeTooltipId) : null;
        if (activeTooltip) {
          activeTooltip.classList.remove('tooltip-visible');
          activeTooltip.setAttribute('aria-hidden', 'true');
        }
      }

      activeCard = card;
      card.classList.add('tooltip-visible');
      tooltip.classList.add('tooltip-visible');
      tooltip.setAttribute('aria-hidden', 'false');
      positionTooltip(card, tooltip);
    };

    const hideTooltip = () => {
      if (activeCard === card) {
        activeCard = null;
      }

      card.classList.remove('tooltip-visible');
      tooltip.classList.remove('tooltip-visible');
      tooltip.setAttribute('aria-hidden', 'true');
    };

    card.addEventListener('pointerenter', () => {
      showTooltip();
    });

    card.addEventListener('pointerleave', () => {
      hideTooltip();
    });

    card.addEventListener('focusin', () => {
      showTooltip();
    });

    card.addEventListener('focusout', () => {
      hideTooltip();
    });
  });

  window.addEventListener('resize', updateActiveTooltipPosition);
  window.addEventListener('scroll', updateActiveTooltipPosition, { passive: true });
}

const ZOOM_STORAGE_KEY = 'ft-page-zoom';
const ZOOM_MIN = 80;
const ZOOM_MAX = 150;
const ZOOM_STEP = 10;
const ZOOM_DEFAULT = 100;

function getStoredZoom() {
  const stored = parseInt(window.localStorage.getItem(ZOOM_STORAGE_KEY), 10);
  if (Number.isNaN(stored)) {
    return ZOOM_DEFAULT;
  }

  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, stored));
}

function applyZoom(level) {
  document.documentElement.style.setProperty('--page-zoom', `${level / 100}`);
  document.body.style.zoom = `${level}%`;

  const indicator = document.querySelector('.zoom-level');
  if (indicator) {
    indicator.textContent = `${level}%`;
  }
}

function setupZoomControl() {
  if (document.querySelector('.zoom-control')) {
    return;
  }

  const control = document.createElement('div');
  control.className = 'zoom-control';
  control.setAttribute('role', 'group');
  control.setAttribute('aria-label', 'Page zoom controls');
  control.innerHTML = `
    <button type="button" class="zoom-btn zoom-out" aria-label="Zoom out">&minus;</button>
    <button type="button" class="zoom-btn zoom-reset" aria-label="Reset zoom">&#8635;</button>
    <span class="zoom-level" aria-live="polite">100%</span>
    <button type="button" class="zoom-btn zoom-in" aria-label="Zoom in">+</button>
  `;
  document.body.appendChild(control);

  let currentZoom = getStoredZoom();
  applyZoom(currentZoom);

  const updateZoom = (level) => {
    currentZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, level));
    window.localStorage.setItem(ZOOM_STORAGE_KEY, String(currentZoom));
    applyZoom(currentZoom);
  };

  control.querySelector('.zoom-in').addEventListener('click', () => {
    updateZoom(currentZoom + ZOOM_STEP);
  });

  control.querySelector('.zoom-out').addEventListener('click', () => {
    updateZoom(currentZoom - ZOOM_STEP);
  });

  control.querySelector('.zoom-reset').addEventListener('click', () => {
    updateZoom(ZOOM_DEFAULT);
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
  setupZoomControl();

  console.log('Finca Turpial local storefront is ready. Authorized admin emails configured.');
});
