document.addEventListener('DOMContentLoaded', () => {
    const muyu = document.getElementById('muyu');
    const sound = document.getElementById('woodfish-sound');
    const volumeControl = document.getElementById('volume');
    const countDisplay = document.getElementById('count');
    const blessingContainer = document.getElementById('blessing');

    let count = parseInt(localStorage.getItem('muyuCount')) || 0;
    countDisplay.textContent = count;

    // 设置初始音量
    sound.volume = volumeControl.value;

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
    }

    // 点击事件监听
    muyu.addEventListener('click', handleMuyuClick);

    // 音量控制
    volumeControl.addEventListener('input', (event) => {
        sound.volume = event.target.value;
    });

    // 键盘空格键支持
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault();
            handleMuyuClick(event);
        }
    });
}); 