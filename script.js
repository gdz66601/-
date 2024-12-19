document.addEventListener('DOMContentLoaded', () => {
    // 木鱼元素
    const muyuTraditional = document.getElementById('muyu-traditional');
    const muyuIkun = document.getElementById('muyu-ikun');
    const currentMuyu = () => document.querySelector(`#muyu-${muyuStyle.value}`);

    // 音效元素
    const sounds = {
        muyu: document.getElementById('sound-muyu'),
        frog: document.getElementById('sound-frog'),
        chicken: document.getElementById('sound-chicken')
    };
    const currentSound = () => sounds[soundEffect.value];

    const volumeControl = document.getElementById('volume');
    const countDisplay = document.getElementById('count');
    const blessingContainer = document.getElementById('blessing');
    const autoToggle = document.getElementById('autoToggle');
    const frequencyControl = document.getElementById('frequency');
    const frequencyDisplay = document.getElementById('frequencyDisplay');
    const resetCount = document.getElementById('resetCount');
    const muyuStyle = document.getElementById('muyuStyle');
    const soundEffect = document.getElementById('soundEffect');

    // 主题相关
    const themeLinks = document.querySelectorAll('[data-theme]');
    const savedTheme = localStorage.getItem('theme') || 'cupcake';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // 修改主题切换事件监听
    document.querySelectorAll('.dropdown-content li a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const theme = e.target.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    });

    // 木鱼样式和音效设置
    muyuStyle.addEventListener('change', (e) => {
        const style = e.target.value;
        // 保存选择
        localStorage.setItem('muyuStyle', style);
        // 切换木鱼样式
        muyuTraditional.classList.toggle('hidden', style !== 'traditional');
        muyuIkun.classList.toggle('hidden', style !== 'ikun');
    });

    soundEffect.addEventListener('change', (e) => {
        const effect = e.target.value;
        // 保存选择
        localStorage.setItem('soundEffect', effect);
        // 音量同步
        Object.values(sounds).forEach(sound => {
            sound.volume = volumeControl.value;
        });
    });

    // 加载保存的设置
    const savedStyle = localStorage.getItem('muyuStyle') || 'traditional';
    const savedEffect = localStorage.getItem('soundEffect') || 'muyu';
    muyuStyle.value = savedStyle;
    soundEffect.value = savedEffect;
    // 应用保存的设置
    muyuTraditional.classList.toggle('hidden', savedStyle !== 'traditional');
    muyuIkun.classList.toggle('hidden', savedStyle !== 'ikun');

    let count = parseInt(localStorage.getItem('muyuCount')) || 0;
    countDisplay.textContent = count;

    // 设置初始音量
    Object.values(sounds).forEach(sound => {
        sound.volume = volumeControl.value;
    });

    // 自动敲击相关变量
    let isAutoPlaying = false;
    let autoPlayInterval = null;

    // 随机祝福语
    const blessings = {
        traditional: [
            '功德+1',
            '善哉善哉',
            '阿弥陀佛',
            '心诚则灵',
            '福德无量'
        ],
        ikun: [
            '鸡你太美',
            '只因你太美',
            'Kun',
            '篮球打的真好',
            '律师函警告'
        ]
    };

    // 用于记录最近的祝福文字位置
    let lastBlessingPositions = [];
    const MIN_DISTANCE = 40; // 最小间距

    function getRandomPosition(containerRect) {
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
            const x = Math.random() * (containerRect.width - 60); // 60是预估的文字宽度
            const y = Math.random() * (containerRect.height - 30); // 30是预估的文字高度

            // 检查与现有位置的距离
            const isTooClose = lastBlessingPositions.some(pos => {
                const dx = x - pos.x;
                const dy = y - pos.y;
                return Math.sqrt(dx * dx + dy * dy) < MIN_DISTANCE;
            });

            if (!isTooClose) {
                // 添加新位置到数组
                lastBlessingPositions.push({ x, y, time: Date.now() });
                // 只保留最近2秒内的位置
                lastBlessingPositions = lastBlessingPositions.filter(
                    pos => Date.now() - pos.time < 2000
                );
                return { x, y };
            }

            attempts++;
        }

        // 如果找不到合适的位置，返回随机位置
        return {
            x: Math.random() * (containerRect.width - 60),
            y: Math.random() * (containerRect.height - 30)
        };
    }

    function createBlessingElement(x, y) {
        const containerRect = blessingContainer.getBoundingClientRect();
        const position = getRandomPosition(containerRect);
        
        const blessing = document.createElement('div');
        blessing.className = 'absolute text-success font-bold text-lg animate-float-up';
        const currentBlessings = blessings[muyuStyle.value] || blessings.traditional;
        blessing.textContent = currentBlessings[Math.floor(Math.random() * currentBlessings.length)];
        blessing.style.left = `${position.x}px`;
        blessing.style.top = `${position.y}px`;
        blessingContainer.appendChild(blessing);

        // 动画结束后移除元素
        setTimeout(() => blessing.remove(), 1000);
    }

    function handleMuyuClick(event) {
        // 播放音效
        const sound = currentSound();
        sound.currentTime = 0;
        sound.play();

        // 增加计数
        count++;
        countDisplay.textContent = count;
        localStorage.setItem('muyuCount', count);

        // 创建祝福文字
        createBlessingElement();

        // 触感反馈
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    // 清零功能
    resetCount.addEventListener('click', () => {
        count = 0;
        countDisplay.textContent = count;
        localStorage.setItem('muyuCount', count);
    });

    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        const interval = 1000 / parseFloat(frequencyControl.value);
        autoPlayInterval = setInterval(() => {
            handleMuyuClick();
        }, interval);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    // 点击事件监听
    [muyuTraditional, muyuIkun].forEach(muyu => {
        muyu.addEventListener('click', handleMuyuClick);
    });

    // 音量控制
    volumeControl.addEventListener('input', (event) => {
        const volume = event.target.value;
        Object.values(sounds).forEach(sound => {
            sound.volume = volume;
        });
    });

    // 自动播放控制
    autoToggle.addEventListener('click', () => {
        isAutoPlaying = !isAutoPlaying;
        autoToggle.textContent = isAutoPlaying ? '停止自动' : '开始自动';
        autoToggle.classList.toggle('btn-error', isAutoPlaying);
        autoToggle.classList.toggle('btn-primary', !isAutoPlaying);
        
        if (isAutoPlaying) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
    });

    // 频率控制
    frequencyControl.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        frequencyDisplay.textContent = value.toFixed(1);
        if (isAutoPlaying) {
            startAutoPlay(); // 重新开始以更新频率
        }
    });

    // 键盘空格键支持
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault();
            handleMuyuClick();
        }
    });

    // 添加自定义动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-up {
            0% {
                transform: translateY(0);
                opacity: 1;
            }
            100% {
                transform: translateY(-50px);
                opacity: 0;
            }
        }
        .animate-float-up {
            animation: float-up 1s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
}); 