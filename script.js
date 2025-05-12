let currentSong = new Audio();
let songs;
let currFolder;

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="" srcset="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert"   src="play.svg" alt="" srcset="">
                            </div></li>`;
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs

}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"

    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")
             && !e.href.includes(".htaccess")
            ) {
            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();

            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44">

                                <circle cx="20" cy="22" r="21" fill="#1fdf64" />
                                <!-- Centered and adjusted arrow path -->
                                <path
                                    d="M26.8906 22.846C26.5371 24.189 24.8667 25.138 21.5257 27.0361C18.296 28.8709 16.6812 29.7884 15.3798 29.4196C14.8418 29.2671 14.3516 28.9776 13.9562 28.5787C13 27.6139 13 25.7426 13 22C13 18.2574 13 16.3861 13.9562 15.4213C14.3516 15.0224 14.8418 14.7329 15.3798 14.5804C16.6812 14.2116 18.296 15.1291 21.5257 16.9639C24.8667 18.862 26.5371 19.811 26.8906 21.154C27.0365 21.7084 27.0365 22.2916 26.8906 22.846Z"
                                    stroke="#000000" stroke-width="1.5" stroke-linejoin="round" fill="black" />
                            </svg>


                        </div>
                        <img src="/songs/${folder}/cover.jpeg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
playMusic(songs[0])
        })
    })

}


async function main() {

    await getSongs("songs/one")
    playMusic(songs[0], true)

    displayAlbums()

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"

        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    // Define this function before the `timeupdate` event listener
    function secondsToMinutesSeconds(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return "00:00";
        let minutes = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }


    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click", () => {
        console.log("Previous clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            currentSong.pause()
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {

        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            currentSong.pause()
            playMusic(songs[index + 1])
        }
    })

    next.addEventListener("click", () => {
        console.log("Next clicked");
    
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            currentSong.pause();
            playMusic(songs[index + 1]);
        }
    });
    
    
    currentSong.addEventListener("ended", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        } else {
            console.log("End of playlist");
            play.src = "play.svg";  
        }
    });
    

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting Volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100

        if(currentSong.volume > 0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

document.querySelector(".volume>img").addEventListener("click", e=>{
    if(e.target.src.includes("volume.svg")){
        e.target.src=   e.target.src.replace("volume.svg", "mute.svg")
        currentSong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }
    else{
        e.target.src=e.target.src.replace("mute.svg", "volume.svg")
        currentSong.volume=.10;
        document.querySelector(".range").getElementsByTagName("input")[0].value=10;
    }
})

}

main()