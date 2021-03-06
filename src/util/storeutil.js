import { showSidebar } from '../store.js';

export function resetView() {
  // set the sidebar to not be showing anymore
  showSidebar.set(false);
  // and scroll to the top of the page (smooth only on chrome, bah)
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}
