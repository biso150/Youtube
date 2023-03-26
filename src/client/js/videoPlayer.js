const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currenITime = document.getElementById("currenITime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");


let volumeValue = 0.5;
video.volume = volumeValue;

let controlsTimeout = null;
let controlsMovementTimeout = null;

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause"
}

const handlePlay = () => {
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause"
}

const handleMuteClick = () => {
  if (video.muted) { 
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
}

const handleVolumeChange = (event) => {
  if (video.muted) { 
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-up";
  }
  const { target: { value } } = event;
  volumeValue = value;
  video.volume = volumeValue;
  if (value === "0") {
    muteBtnIcon.classList = "fas fa-volume-mute";
  } else {
    muteBtnIcon.classList = "fas fa-volume-up";
  }
}

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(11, 19);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
}

const handleTimeUpdate = () => {
  currenITime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
}

const handletimelineChange = (event) => {
  //video.currentTime = timeline.value;
  const { target: { value } } = event;
  video.currentTime = value;
}

const handleFullscreenClick = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenBtnIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtnIcon.classList = "fas fa-compress";
  }
}

const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    fullScreenBtnIcon.classList = "fas fa-compress";
  } else {
    fullScreenBtnIcon.classList = "fas fa-expand";
  }
}

const hideControls = () => {
  videoControls.classList.remove("showing");
}

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  videoControls.classList.add("showing");

  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  controlsMovementTimeout = setTimeout(hideControls, 3000);
}

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
}

const handleEnded = () => {
  // 페이지 이동 없이 url 호출
  const { videoid } = videoContainer.dataset;
  fetch(`/api/videos/${videoid}/view`, { method: "POST" });
}

playBtn.addEventListener("click", handlePlayClick);
video.addEventListener("play", handlePlay);
video.addEventListener("pause", handlePlay);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handletimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreenClick);
videoContainer.addEventListener("fullscreenchange", handleFullscreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);

// f 키로 fullscreen 이벤트
// window.addEventListener("keyup", (e) => {
//   const fullscreen = document.fullscreenElement;
//   if (e.keyCode === 70) {
//     if (!fullscreen) {
//       videoContainer.requestFullscreen();
//     } else {
//       document.exitFullscreen();
//     }
//   }
// })

//스페이스바, 클릭으로 재생/일시정지 구현 해보기
window.addEventListener("keyup", (e) => {
  if (e.keyCode === 32) {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause"
  }
})