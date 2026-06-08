// FreshTake — shared mockup interactivity (no backend; everything is local state)

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  // Mobile nav toggle (sidebar layouts)
  const navToggle = document.querySelector('[data-nav-toggle]');
  const sidebar = document.querySelector('[data-sidebar]');
  if (navToggle && sidebar) {
    navToggle.addEventListener('click', () => sidebar.classList.toggle('-translate-x-full'));
  }

  // Generic dropdown menus: [data-menu-trigger] toggles the next [data-menu]
  document.querySelectorAll('[data-menu-trigger]').forEach((trigger) => {
    const menu = trigger.parentElement.querySelector('[data-menu]');
    if (!menu) return;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('[data-menu]').forEach((m) => { if (m !== menu) m.classList.add('hidden'); });
      menu.classList.toggle('hidden');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('[data-menu]').forEach((m) => m.classList.add('hidden'));
  });

  // Generic modal open/close: [data-modal-open="id"], [data-modal-close]
  document.querySelectorAll('[data-modal-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-modal-open');
      const modal = document.getElementById(id);
      if (modal) modal.classList.remove('hidden');
    });
  });
  document.querySelectorAll('[data-modal-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.closest('[data-modal]')?.classList.add('hidden');
    });
  });
  // Close modal on backdrop click
  document.querySelectorAll('[data-modal]').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  });

  // Tabs: [data-tabs] container, [data-tab] buttons, [data-tab-panel] panels
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const tabs = group.querySelectorAll('[data-tab]');
    const panels = document.querySelectorAll(`[data-tab-panel][data-tabs-id="${group.getAttribute('data-tabs')}"]`);
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
        panels.forEach((p) => p.classList.toggle('hidden', p.getAttribute('data-tab-panel') !== target));
      });
    });
  });

  // Generic show/hide toggle: [data-toggle-target="id"] flips .hidden on target
  document.querySelectorAll('[data-toggle-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.getAttribute('data-toggle-target'));
      if (target) target.classList.toggle('hidden');
    });
  });

  // Table sort: [data-sort-key] header buttons sort rows in the nearest [data-sortable-table] tbody
  document.querySelectorAll('[data-sort-key]').forEach((header) => {
    header.addEventListener('click', () => {
      const table = header.closest('[data-sortable-table]');
      if (!table) return;
      const tbody = table.querySelector('tbody');
      const key = header.getAttribute('data-sort-key');
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const dir = header.getAttribute('data-sort-dir') === 'asc' ? 'desc' : 'asc';
      table.querySelectorAll('[data-sort-key]').forEach((h) => h.removeAttribute('data-sort-dir'));
      header.setAttribute('data-sort-dir', dir);
      const rank = { high: 0, normal: 1, low: 2, positive: 0, neutral: 1, negative: 2 };
      rows.sort((a, b) => {
        const av = (a.getAttribute(`data-${key}`) || '').toLowerCase();
        const bv = (b.getAttribute(`data-${key}`) || '').toLowerCase();
        const aRank = rank[av] !== undefined ? rank[av] : av;
        const bRank = rank[bv] !== undefined ? rank[bv] : bv;
        if (aRank < bRank) return dir === 'asc' ? -1 : 1;
        if (aRank > bRank) return dir === 'asc' ? 1 : -1;
        return 0;
      });
      rows.forEach((r) => tbody.appendChild(r));
    });
  });

  // Table/list filter: [data-filter-group] buttons set a filter; rows carry data-* attrs.
  // Multiple filter groups can share one scope element — selections combine with AND logic,
  // tracked in a small state map keyed by group name on the scope element itself.
  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const groupName = group.getAttribute('data-filter-group');
    const buttons = group.querySelectorAll('[data-filter-value]');
    const scope = document.querySelector(`[data-filter-scope="${groupName}"], [data-filter-scope-2="${groupName}"]`) || document;
    if (!scope.__ftFilters) scope.__ftFilters = {};
    scope.__ftFilters[groupName] = 'all';

    const applyFilters = () => {
      const filters = scope.__ftFilters;
      scope.querySelectorAll('[data-filter-item]').forEach((item) => {
        const match = Object.entries(filters).every(([key, val]) => val === 'all' || item.getAttribute(`data-${key}`) === val);
        item.classList.toggle('hidden', !match);
      });
      const emptyState = scope.querySelector('[data-filter-empty]');
      if (emptyState) {
        const visible = scope.querySelectorAll('[data-filter-item]:not(.hidden)').length;
        emptyState.classList.toggle('hidden', visible > 0);
      }
    };

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        scope.__ftFilters[groupName] = btn.getAttribute('data-filter-value');
        applyFilters();
      });
    });
  });

  // Toast helper
  window.ftToast = (message, opts = {}) => {
    const toast = document.getElementById('ft-toast');
    if (!toast) return;
    toast.querySelector('[data-toast-text]').textContent = message;
    const icon = toast.querySelector('[data-toast-icon]');
    if (icon) icon.setAttribute('data-lucide', opts.icon || 'check-circle-2');
    if (window.lucide) lucide.createIcons();
    toast.classList.add('ft-toast-show');
    clearTimeout(window.__ftToastTimer);
    window.__ftToastTimer = setTimeout(() => toast.classList.remove('ft-toast-show'), 3200);
  };

  // Wire up any [data-toast] elements declaratively: data-toast="message" [data-toast-icon="icon-name"]
  document.querySelectorAll('[data-toast]').forEach((el) => {
    el.addEventListener('click', () => ftToast(el.getAttribute('data-toast'), { icon: el.getAttribute('data-toast-icon') }));
  });
});
