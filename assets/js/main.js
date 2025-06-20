// 2025年大阪京都旅游信息网站主脚本

document.addEventListener('DOMContentLoaded', function() {
    
    // 平滑滚动功能
    function smoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // 页面加载动画
    function pageLoadAnimation() {
        const cards = document.querySelectorAll('.nav-card, .page-content, .info-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // 表格响应式处理
    function handleResponsiveTables() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (!table.parentElement.classList.contains('table-container')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-container';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
    }

    // 图片懒加载
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // 回到顶部按钮
    function createBackToTopButton() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
            opacity: 0;
            transform: translateY(100px);
            transition: all 0.3s ease;
            z-index: 1000;
        `;

        document.body.appendChild(backToTopBtn);

        // 滚动显示/隐藏按钮
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.transform = 'translateY(0)';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.transform = 'translateY(100px)';
            }
        });

        // 点击回到顶部
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 卡片悬停效果增强
    function enhanceCardHover() {
        const cards = document.querySelectorAll('.nav-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // 表格排序功能（简单版本）
    function addTableSorting() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            const headers = table.querySelectorAll('th');
            headers.forEach((header, index) => {
                header.style.cursor = 'pointer';
                header.style.userSelect = 'none';
                header.title = '点击排序';
                
                header.addEventListener('click', () => {
                    sortTable(table, index);
                });
            });
        });
    }

    function sortTable(table, column) {
        const tbody = table.tBodies[0];
        const rows = Array.from(tbody.rows);
        
        const sorted = rows.sort((a, b) => {
            const aText = a.cells[column].textContent.trim();
            const bText = b.cells[column].textContent.trim();
            
            // 尝试数字排序
            const aNum = parseFloat(aText.replace(/[^0-9.-]/g, ''));
            const bNum = parseFloat(bText.replace(/[^0-9.-]/g, ''));
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return aNum - bNum;
            }
            
            // 文本排序
            return aText.localeCompare(bText, 'zh-CN');
        });
        
        sorted.forEach(row => tbody.appendChild(row));
    }

    // 搜索功能（如果有搜索框）
    function addSearchFunctionality() {
        const searchInputs = document.querySelectorAll('input[type="search"], .search-input');
        searchInputs.forEach(input => {
            input.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const searchableElements = document.querySelectorAll('.searchable, table tr');
                
                searchableElements.forEach(element => {
                    const text = element.textContent.toLowerCase();
                    if (text.includes(searchTerm) || searchTerm === '') {
                        element.style.display = '';
                    } else {
                        element.style.display = 'none';
                    }
                });
            });
        });
    }

    // 初始化所有功能
    function init() {
        smoothScroll();
        pageLoadAnimation();
        handleResponsiveTables();
        lazyLoadImages();
        createBackToTopButton();
        enhanceCardHover();
        addTableSorting();
        addSearchFunctionality();
        
        // 打印友好提示
        console.log('🗾 2025年大阪京都旅游信息网站已加载');
        console.log('✨ 所有交互功能已启用');
    }

    // 执行初始化
    init();

});

// 工具函数
const utils = {
    // 格式化货币
    formatCurrency: function(amount, currency = '¥') {
        return currency + parseFloat(amount).toLocaleString();
    },
    
    // 复制文本到剪贴板
    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('已复制到剪贴板');
        });
    },
    
    // 显示提示消息
    showToast: function(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
    }
};

// 全局变量
window.JapanTravelUtils = utils; 