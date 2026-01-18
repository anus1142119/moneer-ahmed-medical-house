/* THE HOUSE OF NOORA - GOVERNANCE ENGINE */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    
    // Initialize Filters if they exist on this page
    if(document.querySelector('.filter-bar')) {
        filterSelection("all");
    }
});

/* --- 1. THEME MANAGEMENT --- */
function initTheme() {
    const themeBtn = document.getElementById('theme-btn-svg');
    const savedTheme = localStorage.getItem('house_theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if(themeBtn) themeBtn.innerHTML = getSunIcon();
    } else {
        document.body.classList.remove('dark-mode');
        if(themeBtn) themeBtn.innerHTML = getMoonIcon();
    }
}

function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('theme-btn-svg');
    
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('house_theme', isDark ? 'dark' : 'light');
    if(themeBtn) themeBtn.innerHTML = isDark ? getSunIcon() : getMoonIcon();
}

/* --- 2. NAVIGATION --- */
function initNavigation() {
    const path = window.location.pathname;
    let page = path.split("/").pop();
    if (page === "") page = "index.html"; 

    const links = document.querySelectorAll('.desktop-nav a, .mobile-nav-overlay a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('active-page');
        if (href === page) {
            link.classList.add('active-page');
        }
    });
}
function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
}

/* --- 3. ICONS --- */
function getMoonIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
}
function getSunIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
}

/* --- 4. FILTER LOGIC --- */
function filterSelection(c) {
    var x, i;
    x = document.getElementsByClassName("filterDiv");
    if (c == "all") c = "";
    for (i = 0; i < x.length; i++) {
        w3RemoveClass(x[i], "show");
        if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
    }
    
    // Update Active Button
    var btnContainer = document.querySelector(".filter-bar");
    if(btnContainer) {
        var btns = btnContainer.getElementsByClassName("filter-btn");
        for (var j = 0; j < btns.length; j++) {
            btns[j].classList.remove("active");
            if(btns[j].getAttribute("onclick").includes(c || 'all')) {
                btns[j].classList.add("active");
            }
        }
    }
}

function w3AddClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
    }
}

function w3RemoveClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);     
        }
    }
    element.className = arr1.join(" ");
}