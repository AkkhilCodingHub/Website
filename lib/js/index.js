document.addEventListener('DOMContentLoaded', function () {
    // Array of menu items
    const menuItems = [
        { text: 'Home', url: '~/dw/Project/lib/index.html' },
        { text: 'Forms', url: '~/dw/Project/lib/pages/forms.html' },
        { text: 'Fees', url: '~/dw/Project/lib/fees.html' },
    ];

    // Get the navigation menu container
    const navMenu = document.getElementById('navMenu');

    // Create menu items and append them to the navigation menu
    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = item.text;
        a.href = item.url;
        li.appendChild(a);
        navMenu.appendChild(li);
    });
});
