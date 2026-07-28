document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for fade-in animations as sections scroll into view
    const observerOptions = {
        root: document.querySelector('.brand-book-container'),
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        observer.observe(section);
    });
});
