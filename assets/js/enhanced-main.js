// 2025年大阪京都旅游信息网站 - 增强版主脚本

// 全局变量
let searchTimeout;
let currentTheme = localStorage.getItem('theme') || 'default';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎌 开始初始化日本旅游网站...');
    
    initializePageLoader();
    initializeNavigation();
    initializeSearch();
    initializeFavorites();
    initializeImageGallery();
    initializeBackToTop();
    initializeTheme();
    initializeAnimations();
    initializeInteractions();
    
    console.log('✅ 网站功能已全部加载完成！');
});

// 页面加载器
function initializePageLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.prepend(loader);
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.classList.add('hide');
            setTimeout(() => loader.remove(), 500);
        }, 800);
    });
}

// 导航功能增强
function initializeNavigation() {
    // 平滑滚动
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 导航卡片增强
    const navCards = document.querySelectorAll('.nav-card');
    navCards.forEach(card => {
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this);
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                setTimeout(() => window.location.href = href, 300);
                e.preventDefault();
            }
        });
    });
}

// 波纹效果
function createRippleEffect(e, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute; width: ${size}px; height: ${size}px;
        left: ${x}px; top: ${y}px; border-radius: 50%;
        background: rgba(255,255,255,0.6); transform: scale(0);
        animation: ripple 1s ease-out; pointer-events: none; z-index: 10;
    `;
    
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
}

// 搜索功能
function initializeSearch() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-icon">🔍</div>
        <input type="text" class="search-input" placeholder="搜索旅游信息..." id="searchInput">
        <div class="search-results" id="searchResults"></div>
    `;
    
    const header = document.querySelector('.header') || document.querySelector('header');
    if (header) header.appendChild(searchContainer);
    
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => performSearch(query, searchResults), 300);
            } else {
                searchResults.style.display = 'none';
            }
        });
        
        document.addEventListener('click', function(e) {
            if (!searchContainer.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
}

// 执行搜索
function performSearch(query, container) {
    const searchData = [
        { title: '航班信息', url: 'pages/flights.html', keywords: ['航班', '机票', '东方航空', '成都', '大阪'] },
        { title: '住宿信息', url: 'pages/hotels.html', keywords: ['酒店', '住宿', '旅馆', '难波', '京都'] },
        { title: '景点信息', url: 'pages/attractions.html', keywords: ['景点', '环球影城', '天守阁', '清水寺'] },
        { title: '美食信息', url: 'pages/food.html', keywords: ['美食', '料理', '寿司', '拉面', '大阪烧'] },
        { title: '优惠券信息', url: 'pages/coupons.html', keywords: ['优惠券', '交通卡', '周游卡'] },
        { title: '通信网络', url: 'pages/communication.html', keywords: ['网络', '通信', '漫游', 'WiFi'] },
        { title: '财务汇率', url: 'pages/finance.html', keywords: ['汇率', '换汇', '银行', '日元'] },
        { title: '消费方式', url: 'pages/payment.html', keywords: ['支付', '消费', '银联', '支付宝'] },
        { title: '文化常识', url: 'pages/culture.html', keywords: ['文化', '礼仪', '常识', '习俗'] },
        { title: '紧急联络', url: 'pages/emergency.html', keywords: ['紧急', '联络', '领事馆', '求助'] }
    ];
    
    const results = searchData.filter(item => 
        item.title.includes(query) || 
        item.keywords.some(keyword => keyword.includes(query))
    );
    
    if (results.length > 0) {
        container.innerHTML = results.map(result => `
            <div class="search-result-item" onclick="window.location.href='${result.url}'">
                <strong>${result.title}</strong>
                <span>${result.keywords.join(', ')}</span>
            </div>
        `).join('');
        container.style.display = 'block';
    } else {
        container.innerHTML = '<div class="no-results">未找到相关结果</div>';
        container.style.display = 'block';
    }
}

// 收藏功能
function initializeFavorites() {
    const cards = document.querySelectorAll('.nav-card, .info-card');
    cards.forEach(card => {
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = '♡';
        favoriteBtn.title = '收藏此页面';
        
        const cardTitle = card.querySelector('h3, h5')?.textContent || '未知页面';
        const cardUrl = card.getAttribute('href') || window.location.href;
        
        if (favorites.some(fav => fav.url === cardUrl)) {
            favoriteBtn.classList.add('active');
            favoriteBtn.innerHTML = '♥';
        }
        
        favoriteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(cardTitle, cardUrl, favoriteBtn);
        });
        
        card.style.position = 'relative';
        card.appendChild(favoriteBtn);
    });
    
    displayFavorites();
}

// 切换收藏状态
function toggleFavorite(title, url, button) {
    const existingIndex = favorites.findIndex(fav => fav.url === url);
    
    if (existingIndex > -1) {
        favorites.splice(existingIndex, 1);
        button.classList.remove('active');
        button.innerHTML = '♡';
    } else {
        favorites.push({ title, url, timestamp: Date.now() });
        button.classList.add('active');
        button.innerHTML = '♥';
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

// 显示收藏列表
function displayFavorites() {
    let favContainer = document.getElementById('favoritesContainer');
    if (!favContainer && favorites.length > 0) {
        favContainer = document.createElement('div');
        favContainer.id = 'favoritesContainer';
        favContainer.className = 'favorites-container';
        favContainer.innerHTML = `
            <h4>🌟 我的收藏</h4>
            <div class="favorites-list" id="favoritesList"></div>
        `;
        document.body.appendChild(favContainer);
    }
    
    if (favContainer) {
        const favoritesList = document.getElementById('favoritesList');
        favoritesList.innerHTML = favorites.map(fav => `
            <div class="favorite-item" onclick="window.location.href='${fav.url}'">
                <span>${fav.title}</span>
                <small>${new Date(fav.timestamp).toLocaleDateString()}</small>
            </div>
        `).join('');
    }
}

// 图片画廊功能
function initializeImageGallery() {
    // 图片懒加载
    const images = document.querySelectorAll('img[data-src], [data-image-category]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                if (img.dataset.imageCategory && typeof loadImage === 'function') {
                    loadImage(img.dataset.imageCategory, img.dataset.imageName, img, img.dataset.alt || '');
                }
                
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
    
    // 图片点击放大
    initializeImageModal();
}

// 图片模态框
function initializeImageModal() {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeImageModal()">
            <div class="modal-content">
                <img src="" alt="" id="modalImage">
                <button class="modal-close" onclick="closeImageModal()">×</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG' && !e.target.closest('.modal-content')) {
            openImageModal(e.target.src, e.target.alt);
        }
    });
}

// 回到顶部按钮
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop') || createBackToTopButton();
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled / (document.body.scrollHeight - window.innerHeight);
        
        if (scrolled > 300) {
            backToTopButton.style.display = 'block';
            backToTopButton.style.background = `conic-gradient(#007bff ${rate * 360}deg, #e9ecef 0deg)`;
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// 创建回到顶部按钮
function createBackToTopButton() {
    const button = document.createElement('button');
    button.id = 'backToTop';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.style.cssText = `
        position: fixed; bottom: 2rem; right: 2rem; width: 50px; height: 50px;
        border: none; border-radius: 50%; display: none; z-index: 1000;
        background: #007bff; color: white; cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,123,255,0.4);
        transition: all 0.3s ease;
    `;
    document.body.appendChild(button);
    return button;
}

// 主题切换
function initializeTheme() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.title = '切换主题';
    themeToggle.style.cssText = `
        position: fixed; top: 20px; right: 20px; width: 50px; height: 50px;
        border: none; border-radius: 50%; background: rgba(255,255,255,0.9);
        font-size: 20px; cursor: pointer; z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: all 0.3s ease;
    `;
    
    themeToggle.addEventListener('click', function() {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', currentTheme);
        this.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', currentTheme);
    });
    
    document.body.appendChild(themeToggle);
    
    if (currentTheme) {
        document.body.setAttribute('data-theme', currentTheme);
    }
}

// 动画功能
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.nav-card, .page-content, .info-card');
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        elementObserver.observe(element);
    });
}

// 交互功能
function initializeInteractions() {
    // 表格悬停效果
    const tableRows = document.querySelectorAll('table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => row.style.transform = 'scale(1.02)');
        row.addEventListener('mouseleave', () => row.style.transform = 'scale(1)');
    });
    
    // 卡片3D效果
    const cards = document.querySelectorAll('.nav-card, .info-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

// 模态框函数
function openImageModal(src, alt) {
    const modal = document.querySelector('.image-modal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = src;
    modalImage.alt = alt;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
    }
    
    if (e.key === 'Escape') {
        closeImageModal();
    }
    
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// 添加样式
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    @keyframes ripple { to { transform: scale(2); opacity: 0; } }
    
    .animate-on-scroll {
        opacity: 0; transform: translateY(50px);
        transition: all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
    }
    .animate-on-scroll.animate-in { opacity: 1; transform: translateY(0); }
    
    .search-container { position: relative; margin: 2rem 0; max-width: 500px; margin-left: auto; margin-right: auto; }
    .search-input {
        width: 100%; padding: 1rem 1rem 1rem 3rem; border: 2px solid #e9ecef;
        border-radius: 50px; font-size: 1rem; background: rgba(255,255,255,0.9);
        backdrop-filter: blur(10px); transition: all 0.3s ease;
    }
    .search-input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 20px rgba(102,126,234,0.2); }
    .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #7f8c8d; font-size: 1.2rem; }
    
    .search-results {
        position: absolute; top: 100%; left: 0; right: 0; background: white;
        border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        max-height: 300px; overflow-y: auto; z-index: 1000; display: none;
    }
    .search-result-item {
        padding: 1rem; border-bottom: 1px solid #eee; cursor: pointer;
        transition: background 0.3s ease;
    }
    .search-result-item:hover { background: #f8f9fa; }
    .search-result-item strong { display: block; color: #2c3e50; margin-bottom: 0.5rem; }
    .search-result-item span { color: #7f8c8d; font-size: 0.9rem; }
    .no-results { padding: 1rem; text-align: center; color: #7f8c8d; }
    
    .favorites-container {
        position: fixed; bottom: 80px; right: 20px; width: 300px;
        background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);
        border-radius: 15px; padding: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        z-index: 1000; max-height: 400px; overflow-y: auto;
    }
    .favorite-item {
        padding: 0.5rem; border-bottom: 1px solid #eee; cursor: pointer;
        transition: background 0.3s ease;
    }
    .favorite-item:hover { background: #f8f9fa; border-radius: 8px; }
    
    .favorite-btn {
        position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.9);
        border: none; border-radius: 50%; width: 40px; height: 40px;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.2rem; color: #e74c3c; cursor: pointer;
        transition: all 0.3s ease; backdrop-filter: blur(10px);
    }
    .favorite-btn:hover { background: rgba(231,76,60,0.1); transform: scale(1.1); }
    .favorite-btn.active { background: #e74c3c; color: white; }
    
    .image-modal {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.9); display: none; justify-content: center;
        align-items: center; z-index: 9999;
    }
    .modal-overlay { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
    .modal-content { position: relative; max-width: 90%; max-height: 90%; }
    .modal-content img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 10px; }
    .modal-close {
        position: absolute; top: -10px; right: -10px; background: white;
        border: none; border-radius: 50%; width: 40px; height: 40px;
        font-size: 20px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    
    [data-theme="dark"] { filter: invert(1) hue-rotate(180deg); }
    [data-theme="dark"] img, [data-theme="dark"] video { filter: invert(1) hue-rotate(180deg); }
    
    @media (max-width: 768px) {
        .favorites-container { width: 250px; right: 10px; bottom: 70px; }
    }
`;
document.head.appendChild(enhancedStyles);

console.log('🎌 日本旅游网站增强功能已全部加载！'); 