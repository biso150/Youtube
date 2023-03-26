const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (commentId, text) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.commentid = commentId;
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = " ❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
}

const handleSubmit = async (event) => {
  const textarea = form.querySelector("textarea");
  event.preventDefault();
  const text = textarea.value;
  const videoId = videoContainer.dataset.videoid;

  if (text === "") {
    return;
  }

  const response = await fetch(`/api/videos/${videoId}/comment`, {  // fetch는 js를 통해 url 이동 없이 request를 보낼 수 있게 해줌
    method: "POST",
    headers: { "Content-Type": "application/json" },  // 보내는 string이 json임을 알려주어 string을 객체로 변환하게 함
    body: JSON.stringify({ text })  //JSON.stringify() : json을 string으로 변환
  })

  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(newCommentId, text);
  }
}

if (form) {
  form.addEventListener("submit", handleSubmit);
}