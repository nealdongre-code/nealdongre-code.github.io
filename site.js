(() => {
  'use strict';
  const content = window.PORTFOLIO || {};
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && typeof value === 'string') el.textContent = value;
  };
  const goodUrl = (url) => {
    try { const x = new URL(url); return x.protocol === 'https:' || x.protocol === 'mailto:' ? x.href : null; }
    catch { return null; }
  };
  const external = (label, url, className = '') => {
    const a = document.createElement('a');
    a.textContent = label;
    a.href = goodUrl(url) || '#';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    if (className) a.className = className;
    return a;
  };
  const safe = goodUrl(content.github);
  setText('wordmark', content.name || 'Portfolio');
  document.title = `${content.name || 'Portfolio'} — Projects`;
  setText('about-text', content.about || '');
  setText('footer-name', `© ${new Date().getFullYear()} ${content.name || ''}`);
  if (safe) {
    document.getElementById('nav-github').href = safe;
  }
  const links = document.getElementById('about-links');
  if (safe) links.append(external('GitHub ↗', safe));
  if (goodUrl(content.linkedin)) links.append(external('LinkedIn ↗', content.linkedin));
  if (content.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.email)) {
    const a = document.createElement('a'); a.href = `mailto:${content.email}`; a.textContent = 'Email ↗'; links.append(a);
  }
  const visible = (Array.isArray(content.projects) ? content.projects : []).filter(p => p && p.visible === true);
  document.getElementById('empty-state').hidden = visible.length > 0;
  const list = document.getElementById('project-list');
  visible.forEach((p, i) => {
    const card = document.createElement('article'); card.className = 'project-card';
    const top = document.createElement('div'); top.className = 'project-top';
    const cat = document.createElement('span'); cat.className = 'project-category'; cat.textContent = p.category || 'PROJECT';
    const index = document.createElement('span'); index.className = 'project-index'; index.textContent = String(i + 1).padStart(2, '0');
    top.append(cat,index); card.append(top);
    const title = document.createElement('h3'); title.className = 'project-title'; title.textContent = p.title || 'Untitled project'; card.append(title);
    const description = document.createElement('p'); description.className = 'project-description'; description.textContent = p.description || ''; card.append(description);
    const tags = document.createElement('div'); tags.className = 'tags';
    (Array.isArray(p.tags) ? p.tags : []).forEach(t => { const el = document.createElement('span'); el.className = 'tag'; el.textContent = String(t); tags.append(el); });
    card.append(tags);
    const actions = document.createElement('div'); actions.className = 'project-links';
    if (goodUrl(p.demo)) actions.append(external('Live demo ↗', p.demo));
    if (goodUrl(p.repo)) actions.append(external('View code ↗', p.repo));
    if (actions.childElementCount) card.append(actions);
    list.append(card);
  });
})();
