/* DanyJ Food Market — illustrated category icons
 * One flat illustration per category, drawn from the products in the shop:
 * a rice sack, a bowl of poundo, fish and drumstick, a scotch bonnet, a palm oil
 * jerrycan, a malt bottle, a jar of chin chin and wholesale boxes.
 * They share one outline colour and palette so they read as a set.
 */
(function () {
  const o = (w = 1.6) => `stroke="#1f4a2a" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const svg = (body) => `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;

  const icons = {
    all: svg(`
      <path d="M9 21h30l-3.2 17.2A3 3 0 0 1 32.9 41H15.1a3 3 0 0 1-2.9-2.8Z" fill="#e7c48f" ${o()}/>
      <path d="M13 27h22M14 33h20" stroke="#c99a5c" stroke-width="1.4" fill="none"/>
      <path d="M16 21c0-6 3.6-10 8-10s8 4 8 10" fill="none" ${o()}/>
      <circle cx="17" cy="18" r="4.2" fill="#d8432f" ${o()}/><path d="M17 13.8c.6-1.2 1.6-1.8 2.8-1.8" fill="none" stroke="#3f7d3a" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M27 19c1-5 5-7 9-6-1 4-4 7-9 6Z" fill="#5f9a4c" ${o()}/>
      <path d="M22 20c0-3 1-5 3-6.5 2 1.5 3 3.5 3 6.5" fill="#f2cf72" ${o()}/>`),

    grains: svg(`
      <path d="M15 17c-2.6 7-3.6 15-2 22.5 7.4 3 14.6 3 22 0 1.6-7.5.6-15.5-2-22.5Z" fill="#ecd9b0" ${o()}/>
      <path d="M17.5 17 15 9.5c6 1.8 12 1.8 18 0L30.5 17" fill="#f6e9c9" ${o()}/>
      <path d="M16.5 17.2c5 1.6 10 1.6 15 0" fill="none" stroke="#c8693e" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="24" cy="29" r="5.5" fill="#fffaf0" ${o()}/>
      <path d="M21.6 30.8c.4-3 2.2-4.8 5-5.2-.3 3-2.2 4.9-5 5.2Z" fill="#5f9a4c"/>
      <g fill="#fff" ${o(1.1)}><ellipse cx="8.5" cy="41" rx="1.4" ry="2.4" transform="rotate(-30 8.5 41)"/><ellipse cx="39.5" cy="41.5" rx="1.4" ry="2.4" transform="rotate(25 39.5 41.5)"/><ellipse cx="42" cy="37" rx="1.3" ry="2.2" transform="rotate(60 42 37)"/></g>`),

    swallow: svg(`
      <path d="M17 24c0-7 3.2-11 7-11s7 4 7 11" fill="#fbf6ea" ${o()}/>
      <path d="M20.5 18.5c.8-1.8 2-2.8 3.5-3" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      <path d="M6 24h36c0 8.8-7.2 15-18 15S6 32.8 6 24Z" fill="#c8693e" ${o()}/>
      <path d="M10 28.5c3.6 4 8.4 6 14 6s10.4-2 14-6" fill="none" stroke="#e08a5c" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M16 40h16" ${o()}/>
      <path d="M33 13c3-1 6 0 7.5 2.5-3 1.2-6 .5-7.5-2.5Z" fill="#5f9a4c" ${o()}/>`),

    meat: svg(`
      <path d="M5 22c5-6.5 13-9 21-6.5 2.6.8 4.8 2.2 6.8 4l5.2-4.5-.6 7.5.6 7.5-5.2-4.5c-2 1.8-4.2 3.2-6.8 4C18 32 10 29.5 5 23Z" fill="#9fc0cf" ${o()}/>
      <path d="M12 18.5c3 2 3 6.5 0 9" fill="none" ${o()}/>
      <circle cx="9.2" cy="21.5" r="1.3" fill="#1f4a2a"/>
      <path d="M17 19.5l3 3-3 3M21 19l3 3.5-3 3.5" fill="none" stroke="#7aa3b6" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M24.5 31.5c3.8-3.4 9.2-3.1 12 .3 2.8 3.5 2 8.3-1.7 10.6-3.4 2.1-7.6 1.6-10-.9-2.4-2.5-2.6-7-.3-10Z" fill="#d98b5f" ${o()}/>
      <path d="M27 40.5 21 45" ${o(3.6)}/><path d="M27 40.5 21 45" stroke="#fffaf0" stroke-width="2" stroke-linecap="round"/>
      <circle cx="20" cy="45.5" r="1.9" fill="#fffaf0" ${o(1.2)}/>`),

    veg: svg(`
      <path d="M9 16c3.5-5 10-6.5 15-3.5-3.5 4-9.5 5.5-15 3.5Z" fill="#5f9a4c" ${o()}/>
      <path d="M11 25c0-4.6 5.4-8 13-8s13 3.4 13 8c0 3.2-1.2 5.6-2.8 7.6.5 3.4-1.7 6.4-4.6 7-1.2 2.8-3.4 4.8-5.6 4.8s-4.4-2-5.6-4.8c-2.9-.6-5.1-3.6-4.6-7C12.2 30.6 11 28.2 11 25Z" fill="#d8432f" ${o()}/>
      <path d="M17.6 32.6c1.8 1.4 4 2.2 6.4 2.2s4.6-.8 6.4-2.2M20 39.6c1.3.6 2.6.9 4 .9s2.7-.3 4-.9" fill="none" stroke="#a62a1c" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M16 23.5c1.2-2.2 3.4-3.4 6-3.8" fill="none" stroke="#f08a74" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M19 18.6c1.4 1.4 3 2 5 2s3.6-.6 5-2" fill="#3f7d3a" ${o(1.3)}/>
      <path d="M24 18.5c0-3.4 1.2-6 4-8" fill="none" stroke="#3f7d3a" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M34 12.5c2.6-.6 5 .3 6.4 2.4-2.4 1-5 .6-6.4-2.4Z" fill="#f2cf72" ${o()}/>`),

    oils: svg(`
      <path d="M12 16h22a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V17Z" fill="#fde4d6" ${o()}/>
      <path d="M12.2 24h23.8v15a3 3 0 0 1-3 3H14.6a2.4 2.4 0 0 1-2.4-2.4Z" fill="#c9381f"/>
      <path d="M11 17v22a3 3 0 0 0 3 3h20a3 3 0 0 0 3-3V19a3 3 0 0 0-3-3H12" fill="none" ${o()}/>
      <path d="M15 28v9" stroke="#e8735a" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M26 16v-3.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2V16" fill="none" ${o()}/>
      <rect x="14" y="8" width="7" height="8" rx="1.6" fill="#e0a23a" ${o()}/>
      <path d="M20 31.5c2.4-3.2 4-5 4-6.5 0 1.5 1.6 3.3 4 6.5a4 4 0 0 1-8 0Z" fill="#f2cf72" ${o(1.3)}/>`),

    drinks: svg(`
      <path d="M20 6h8v6.5c3.4 1.6 5 4.6 5 8.5v18a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3V21c0-3.9 1.6-6.9 5-8.5Z" fill="#6b3a22" ${o()}/>
      <rect x="19.5" y="4" width="9" height="4" rx="1.2" fill="#d8432f" ${o()}/>
      <path d="M15 24h18v10H15Z" fill="#e0a23a" ${o()}/>
      <path d="M19 29h10" stroke="#fffaf0" stroke-width="2" stroke-linecap="round"/>
      <path d="M18.5 15.5c-.9 1.2-1.4 2.6-1.5 4.2" fill="none" stroke="#a8674a" stroke-width="2" stroke-linecap="round"/>
      <path d="M35 26h7l-1.2 14a2 2 0 0 1-2 1.8h-.6a2 2 0 0 1-2-1.8Z" fill="#fde9cf" ${o()}/>
      <path d="M35.6 32h5.8l-.6 8a1.6 1.6 0 0 1-1.6 1.4h-1.4a1.6 1.6 0 0 1-1.6-1.4Z" fill="#c9381f"/>`),

    snacks: svg(`
      <rect x="12" y="8" width="24" height="7" rx="2.2" fill="#c8693e" ${o()}/>
      <path d="M14 15h20l1.5 4v18.5a4.5 4.5 0 0 1-4.5 4.5H17a4.5 4.5 0 0 1-4.5-4.5V19Z" fill="#fdf6ea" ${o()}/>
      <g ${o(1.2)} fill="#e0a23a">
        <rect x="16" y="29" width="5" height="5" rx="1.2" transform="rotate(-12 18.5 31.5)"/>
        <rect x="22.5" y="31" width="5" height="5" rx="1.2" transform="rotate(10 25 33.5)"/>
        <rect x="28" y="28.5" width="5" height="5" rx="1.2" transform="rotate(-6 30.5 31)"/>
        <rect x="18.5" y="35" width="5" height="5" rx="1.2" transform="rotate(14 21 37.5)"/>
        <rect x="25" y="36.5" width="5" height="5" rx="1.2" transform="rotate(-10 27.5 39)"/>
        <rect x="21" y="24" width="5" height="5" rx="1.2" transform="rotate(20 23.5 26.5)"/>
      </g>
      <rect x="16" y="18.5" width="16" height="4.5" rx="1.4" fill="#5f9a4c" ${o(1.2)}/>`),

    wholesale: svg(`
      <path d="M6 26 18 22l12 4v15l-12 4L6 41Z" fill="#d9a86c" ${o()}/>
      <path d="M18 30v15M6 26l12 4 12-4" fill="none" ${o()}/>
      <path d="M11 28.2v6" stroke="#f3e2c2" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M18 8l12 4v13l-12 4-12-4V12Z" fill="#e7bd84" ${o()}/>
      <path d="M18 16v13M6 12l12 4 12-4" fill="none" ${o()}/>
      <path d="M23.5 13.8v6" stroke="#f3e2c2" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M32 30h9v11h-9Z" fill="#7aa3b6" ${o()}/>
      <path d="M32 33.5h9" stroke="#1f4a2a" stroke-width="1.2"/>
      <path d="M34 22c1-3.8 4.6-5.8 8-5-.8 3.6-4.2 5.8-8 5Z" fill="#5f9a4c" ${o()}/>`),
  };

  window.FL_CAT_ICONS = icons;
  if (window.DANYJ) window.DANYJ.categories.forEach((c) => { c.svg = icons[c.id]; });
})();
