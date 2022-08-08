const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const PLAYER_STORAGE_KEY = 'Music_Player'

const songName = $('header h2')
const audio = $('#audio')
const player = $('.player')
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')
const progress = $('#progress')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {
        isRepeat: false,
        isRandom: false,
        currentIndex: 0
    },
    songs: [
        {
            name: 'Light and Shadow',
            singer: 'Hiroyuki Sawano ft. Gemie',
            path: './assets/music/song1.mp3',
            image: './assets/img/img1.jpg'
        },
        {
            name: 'Everything Goes On',
            singer: 'Porter Robinson',
            path: './assets/music/song2.mp3',
            image: './assets/img/img2.jpg'
        },
        {
            name: 'Enemy',
            singer: 'Imagine Dragons x J.I.D',
            path: './assets/music/song3.mp3',
            image: './assets/img/img3.jpg'
        },
        {
            name: 'K/DA - MORE',
            singer: 'Madison Beer, (G)I-DLE, Lexie Liu, Jaira Burns, Seraphine',
            path: './assets/music/song4.mp3',
            image: './assets/img/img4.jpg'
        },
        {
            name: 'K/DA - POP/STARS',
            singer: 'Madison Beer, (G)I-DLE, Jaira Burns',
            path: './assets/music/song5.mp3',
            image: './assets/img/img5.jpg'
        },
        {
            name: 'K/DA - THE BADDEST',
            singer: '(G)I-DLE, Bea Miller, Wolftyla',
            path: './assets/music/song6.mp3',
            image: './assets/img/img6.jpg'
        },
        {
            name: 'Warriors',
            singer: '2WEI and Edda Hayes',
            path: './assets/music/song7.mp3',
            image: './assets/img/img7.jpg'
        },
        {
            name: 'RISE',
            singer: 'The Glitch Mob, Mako, and The Word Alive',
            path: './assets/music/song8.mp3',
            image: './assets/img/img8.jpg'
        },
        {
            name: 'Legends Never Die',
            singer: 'Against The Current',
            path: './assets/music/song9.mp3',
            image: './assets/img/img9.jpg'
        },
        {
            name: 'True Damage - GIANTS',
            singer: 'Becky G, Keke Palmer, SOYEON, DUCKWRTH, Thutmose',
            path: './assets/music/song10.mp3',
            image: './assets/img/img10.jpg'
        }
    ],
    setConfig(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    loadConfig() {
        this.isRepeat = this.config.isRepeat
        this.isRandom = this.config.isRandom
        // this.currentIndex = this.config.currentIndex
    },
    render() {
        var htmls = this.songs.map(song => `<div class="song">
        <div class="thumb" style="background-image: url(${song.image})">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h option-icon"></i>
        </div>
      </div>`)
        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents() {
        const cdWidth = cd.offsetWidth
        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWidth - scrollTop
            if (newWidth >= 0) cd.style.width = newWidth + 'px'
            else cd.style.width = 0
        }

        const cdThumbAnimation = cdThumb.animate(
            { transform: 'rotate(360deg)' },
            {
                duration: 10000,
                iterations: Infinity
            }
        )
        cdThumbAnimation.pause()

        playBtn.onclick = () => {
            if (this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }
        audio.onplay = () => {
            player.classList.add('playing')
            this.isPlaying = true
            cdThumbAnimation.play()
        }
        audio.onpause = () => {
            player.classList.remove('playing')
            this.isPlaying = false
            cdThumbAnimation.pause()
        }

        audio.ontimeupdate = () => {
            if (audio.duration) {
                const progressPercent = audio.currentTime / audio.duration * 100
                progress.value = progressPercent
            }
            progress.onchange = () => {
                audio.currentTime = progress.value / 100 * audio.duration
            }
        }

        nextBtn.onclick = () => {
            if (this.currentIndex < this.songs.length - 1) this.currentIndex += 1
            else this.currentIndex = 0
            $('.song.active').classList.remove('active')
            this.loadCurrentSong()
            this.autoScroll(true)
            audio.play()
        }

        prevBtn.onclick = () => {
            if (this.currentIndex > 0) this.currentIndex -= 1
            else this.currentIndex = this.songs.length - 1
            $('.song.active').classList.remove('active')
            this.loadCurrentSong()
            this.autoScroll(false)
            audio.play()
        }

        const randomSongs = []
        for (let i = 0; i < this.songs.length; i++) randomSongs[i] = i
        audio.onended = () => {
            if (this.isRepeat) audio.play()
            else {
                if (this.isRandom) {
                    const oldIndex = this.currentIndex
                    let randomIndex
                    let isMeet = false
                    let index = randomSongs.indexOf(oldIndex)
                    if (index !== -1) randomSongs.splice(index, 1)
                    if (randomSongs.length === 0) {
                        for (let i = 0; i < this.songs.length; i++) randomSongs[i] = i
                        let index = randomSongs.indexOf(oldIndex)
                        if (index !== -1) randomSongs.splice(index, 1)
                    }
                    do {
                        randomIndex = Math.floor(Math.random() * this.songs.length)
                        for (let i = 0; i < randomSongs.length; i++) {
                            isMeet = randomIndex === randomSongs[i]
                            if (isMeet) break
                        }
                    }
                    while (!isMeet)
                    
                    this.currentIndex = randomIndex
                    $('.song.active').classList.remove('active')
                    this.loadCurrentSong()
                    if (oldIndex < this.currentIndex) this.autoScroll(true)
                    else this.autoScroll(false)
                    audio.play()
                }
                else {
                    if (this.currentIndex < this.songs.length - 1) this.currentIndex += 1
                    else this.currentIndex = 0
                    $('.song.active').classList.remove('active')
                    this.loadCurrentSong()
                    this.autoScroll(true)
                    audio.play()
                }
            }   
        }

        const songList = $$('.song')
        songList.forEach((element, index) => {
            element.onclick = (e) => {
                if (e.target !== $$('.option-icon')[index] && index !== this.currentIndex) {
                    const oldIndex = this.currentIndex
                    this.currentIndex = index
                    $('.song.active').classList.remove('active')
                    this.loadCurrentSong()
                    if (oldIndex < this.currentIndex) this.autoScroll(true)
                    else this.autoScroll(false)
                    audio.play()
                }
            }
        })

        repeatBtn.onclick = () => {
            repeatBtn.classList.toggle('active')
            if (repeatBtn.classList.contains('active')) this.isRepeat = true
            else this.isRepeat = false
            this.setConfig('isRepeat', this.isRepeat)
        }
        if (this.isRepeat) repeatBtn.classList.add('active')
        
        randomBtn.onclick = () => {
            randomBtn.classList.toggle('active')
            if (randomBtn.classList.contains('active')) this.isRandom = true
            else this.isRandom = false
            this.setConfig('isRandom', this.isRandom)
        }
        if (this.isRandom) randomBtn.classList.add('active')
    },
    loadCurrentSong() {
        songName.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
        const songList = $$('.song')
        songList[this.currentIndex].classList.add('active')
        this.setConfig('currentIndex', this.currentIndex)
    },
    autoScroll(isNext) {
        if (isNext) {
            if (this.currentIndex === 0)
            $('.song.active').scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
            if (this.currentIndex !== 2 && this.currentIndex !== 1 && this.currentIndex !== 0)
            $('.song.active').scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
        }
        else {
            if (this.currentIndex === 2 || this.currentIndex === 1 || this.currentIndex === 0)
            $('.song.active').scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
            else
            $('.song.active').scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
        }
    },
    start() {
        this.loadConfig()
        this.defineProperties()
        this.render()
        this.handleEvents()
        this.loadCurrentSong() 
    }
}

app.start()



