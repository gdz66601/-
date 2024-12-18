document.addEventListener('DOMContentLoaded', () => {
    const muyu = document.getElementById('muyu');
    const sound = document.getElementById('woodfish-sound');
    const volumeControl = document.getElementById('volume');
    const countDisplay = document.getElementById('count');
    const blessingContainer = document.getElementById('blessing');
    const autoToggle = document.getElementById('autoToggle');
    const frequencyControl = document.getElementById('frequency');
    const frequencyDisplay = document.getElementById('frequencyDisplay');

    let count = parseInt(localStorage.getItem('muyuCount')) || 0;
    countDisplay.textContent = count;

    // 设置初始音量
    sound.volume = volumeControl.value;

    // 自动敲击相关变量
    let isAutoPlaying = false;
    let autoPlayInterval = null;

    // 随机祝福语
    const blessings = [
        '功德+1',
        '善哉善哉',
        '阿弥陀佛',
        '心诚则灵',
        '福德无量'
    ];

    function createBlessingElement(x, y) {
        const blessing = document.createElement('div');
        blessing.className = 'blessing';
        blessing.textContent = blessings[Math.floor(Math.random() * blessings.length)];
        blessing.style.left = `${x}px`;
        blessing.style.top = `${y}px`;
        blessingContainer.appendChild(blessing);

        // 动画结束后移除元素
        blessing.addEventListener('animationend', () => {
            blessing.remove();
        });
    }

    function handleMuyuClick(event) {
        // 播放音效
        sound.currentTime = 0;
        sound.play();

        // 增加计数
        count++;
        countDisplay.textContent = count;
        localStorage.setItem('muyuCount', count);

        // 创建祝福文字
        const rect = muyu.getBoundingClientRect();
        createBlessingElement(
            event.clientX - 20,
            event.clientY - 20
        );

        // 触感反馈
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // 添加点击动画
        muyu.classList.add('clicked');
        setTimeout(() => muyu.classList.remove('clicked'), 100);
    }

    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        const interval = 1000 / parseFloat(frequencyControl.value);
        autoPlayInterval = setInterval(() => {
            handleMuyuClick({
                clientX: muyu.getBoundingClientRect().left + muyu.offsetWidth / 2,
                clientY: muyu.getBoundingClientRect().top + muyu.offsetHeight / 2
            });
        }, interval);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    // 点击事件监听
    muyu.addEventListener('click', handleMuyuClick);

    // 音量控制
    volumeControl.addEventListener('input', (event) => {
        sound.volume = event.target.value;
    });

    // 自动播放控制
    autoToggle.addEventListener('click', () => {
        isAutoPlaying = !isAutoPlaying;
        autoToggle.textContent = isAutoPlaying ? '停止自动' : '开始自动';
        autoToggle.classList.toggle('active', isAutoPlaying);
        
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
            handleMuyuClick({
                clientX: muyu.getBoundingClientRect().left + muyu.offsetWidth / 2,
                clientY: muyu.getBoundingClientRect().top + muyu.offsetHeight / 2
            });
        }
    });
}); 