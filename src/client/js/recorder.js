import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview")

let stream;
let recorder;
let videoFile;
const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg"
}
const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
}

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: 1024,
      height: 576
    }
  });
  video.srcObject = stream;
  video.play();
}

init();

const handleDownload = async () => {
  actionBtn.innerText = "Transcoding...";
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.disabled = true;


  // ffmpeg instance 생성
  const ffmpeg = createFFmpeg({log: true});
  await ffmpeg.load();
  
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));


  // 썸네일 생성 및 저장
  await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb);  // -ss : 영상의 특정 시간대로 이동
  const thumbFile = ffmpeg.FS("readFile", files.thumb);
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" })
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(thumbUrl, "MyThumbnail.jpg")


  // 비디오 파일 생성, 변환, 저장
  await ffmpeg.run("-i", files.input, "-r", "60", files.output)  // -i = input

  const mp4File = ffmpeg.FS("readFile", files.output);  // Uint8Array : array of 8-bit unsigned integers / unsigned integer : 양의정수, signed : 음의정수
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const mp4Url = URL.createObjectURL(mp4Blob);

  downloadFile(mp4Url, "MyRecording.mp4")


  // 메모리에서 파일 및 URL 삭제
  ffmpeg.FS("unlink", files.thumb);
  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);

  URL.revokeObjectURL(videoFile);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(mp4Url);

  
  actionBtn.disabled = false;
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handleStart);
  init();
}

const handleStop = () => {
  actionBtn.innerText = "Download Recording";
  actionBtn.removeEventListener("click", handleStop);
  actionBtn.addEventListener("click", handleDownload);

  recorder.stop();

}

const handleStart = () => {
  actionBtn.innerText = "Stop Recording";
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);  //.createObjectURL() : 브라우저 메모리에서만 가능한 URL 생성. 실제 URL이 아닌 파일을 가르키는 URL임
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  }
  recorder.start();

  // setTimeout (() => {
  //   recorder.stop();
  // }, 5000);
}

actionBtn.addEventListener("click", handleStart);