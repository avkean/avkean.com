for (const link of document.querySelectorAll<HTMLAnchorElement>('a[data-email]')) {
  const address = atob(link.dataset.email!);
  link.textContent = address;
  link.href = `mailto:${address}`;
}
