const fakeUser = {
  username: "Jihye",
  loggedIn: false
}

let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 1,
    id: 1
  },
  {
    title: "Seond Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 2
  },
  {
  title: "Third Video",
  rating: 5,
  comments: 2,
  createdAt: "2 minutes ago",
  views: 59,
  id: 3
  }
];

export const trending = (req, res) => {
  //const videos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  
  return res.render("home", { pageTitle: "Home", fakeUser, videos});
};
export const watch = (req, res) => {
  const {id} = req.params;  // const id= req.params.id;와 같다
  const video = videos[id - 1];
  return res.render("watch", {pageTitle: `Watching: ${video.title}`, fakeUser, video})
};
export const getEdit = (req, res) => {
  const {id} = req.params;
  const video = videos[id - 1];
  return res.render("edit", {pageTitle: `Editting: ${video.title}`, fakeUser, video})
};
export const postEdit = (req, res) => {
  const {id} = req.params;
  const {title} = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);  // 이동되는 페이지 주소
};
export const getUpload = (req, res) => {
  return res.render("upload", {pageTitle: `Upload Video`, fakeUser})
}
export const postUpload = (req, res) => {
  const {title} = req.body
  const newVideo = 
    {
    title,
    rating: 0,
    comments: 0,
    createdAt: "just now",
    views: 0,
    id: videos.length + 1
    }
  videos.push(newVideo)
  // here we will add a video to the videos array.
  return res.redirect("/");
}
export const search = (req, res) => res.send("Search");
export const remove = (req, res) => res.send("Remove");
