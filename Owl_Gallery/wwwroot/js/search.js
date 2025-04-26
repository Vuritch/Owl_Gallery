document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('searchInput');
    const dropdown = document.getElementById('searchDropdown');
    const liveResults = document.getElementById('liveResults');
    let timeout;

    // Show dropdown on focus
    input.addEventListener('focus', () => {
        dropdown.style.display = 'block';
    });

    // Handle input typing
    input.addEventListener('input', () => {
        clearTimeout(timeout);
        const query = input.value.trim();

        if (!query) {
            liveResults.innerHTML = `<small class="text-muted">Start typing to search...</small>`;
            return;
        }

        // Delay the fetch for smoother UX
        timeout = setTimeout(async () => {
            try {
                const res = await fetch(`/Products/SearchLive?query=${encodeURIComponent(query)}`);
                const data = await res.json();

                if (data.length === 0) {
                    liveResults.innerHTML = `<small class="text-muted">No results found.</small>`;
                    return;
                }

                // Build result HTML
                liveResults.innerHTML = data.map(p => `
                    <a class="list-group-item list-group-item-action text-dark dark-mode-search-link"
                       href="/Products/Details/${p.id}">
                        <i class="fas fa-search me-2 text-purple"></i> ${p.name}
                        <small class="d-block text-muted">${p.category}</small>
                    </a>
                `).join('');
            } catch (error) {
                liveResults.innerHTML = `<small class="text-danger">Error loading results.</small>`;
            }
        }, 300);
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !input.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
});
