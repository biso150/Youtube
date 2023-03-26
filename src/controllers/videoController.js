import Video from "../models/Video"
import User from "../models/User"
import Comment from "../models/Comment"

const fakeUser = {
  username: "Jihye",
  loggedIn: false
}

/* callback 방식
Video.find({}, (error, video) => {
  if(error) {
    return res.render("server-error")
  }
  return res.render("home", { pageTitle: "Home", fakeUser, video});
 })
 */

 /* proise 방식 */
export const trending = async(req, res) => {
  try {
    const video = await Video.find({}).sort({createdAt:"desc"}).populate("owner");
    return res.render("home", { pageTitle: "Home", fakeUser, video});
  } catch (error) {
    return res.render("server-error")
  }
};
export const watch = async(req, res) => {
  const {id} = req.params;  // const id= req.params.id;와 같다
  // const video = await Video.findById(id);
  // const owner = await User.findById(video.owner.toString());  // video.owner은 ObjectId이기 때문에 toString() 해야함
  const video = await Video.findById(id).populate("owner").populate("comments");  // .populate("owner") : mongoose가 ObjectId인 owner에 ref("User") 안의 정보를 불러옴. toString() 안해도 mongoose가 형식을 맞춰줌

  if(!video){
    return res.status(404).render("404", {pageTitle: "Video not found.", fakeUser})
  }
return res.render("watch", {pageTitle: video.title, fakeUser, video/*, owner*/})
};

export const getEdit = async(req, res) => {
  const { id } = req.params;
  const { user: { _id } } = req.session;
  const video = await Video.findById(id);  // edit.pug로 값을 보내줘야 하므로 exist 사용 불가
  if(!video){
    return res.status(404).status(404).render("404", {pageTitle: "Video not found.", fakeUser})
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/")
  }
  return res.render("edit", {pageTitle: `Edit: ${video.title}`, fakeUser, video})
};

export const postEdit = async(req, res) => {
  const {id} = req.params;
  const { user: { _id } } = req.session;
  const {title, description, hashtags} = req.body;
  const video = await Video.exists({_id: id});
  if(!video){
    return res.status(404).render("404", {pageTitle: "Video not found.", fakeUser})
  }
  if (String(video.owner) !== String(_id)) {    
    req.flash("error", "You are not the owner of the video");
    return res.status(403).redirect("/")
  }
  await Video.findByIdAndUpdate(id, {
    title, 
    description, 
    hashtags: Video.formatHashtags(hashtags)
  })  
  req.flash("success", "Changes saved");
  return res.redirect(`/videos/${id}`);  // 이동되는 페이지 주소
};

export const getUpload = (req, res) => {
  return res.render("upload", {pageTitle: `Upload Video`, fakeUser})
}

export const postUpload = async(req, res) => {
  const {user: {_id}} = req.session;
  const { video, thumb } = req.files;  // path:fileUrl
  const {title, description, hashtags} = req.body
  try {
  // const video = new Video({
  //   title,
  //   description,
  //   createdAt: Date.now(),
  //   hashtags: hashtags.split(","),
  //   meta: {
  //     views: 0,
  //     rating: 0
  //   } 
  // })
  // await video.save(); 
    const newVideo = await Video.create({  // video 추가
      title,
      description,
      //createdAt: Date.now(),
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path.replace(/\\/g, "/"),
      owner: _id,
      hashtags: Video.formatHashtags(hashtags)
      // meta: {
      //   views: 0,
      //   rating: 0
      // } 
    })

    const user = await User.findById(_id);
    user.videos.push(newVideo._id)
    user.save();

    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {pageTitle: `Upload Video`, fakeUser, errorMessage: error._message})
  }
}

export const remove = async(req, res) => {
  const { id } = req.params;
  const { user: { _id } } = req.session;
  const video = await Video.findById(id); 
  if(!video){
    return res.status(404).render("404", {pageTitle: "Video not found.", fakeUser})
  }
  //const video = await Video.find({_id: id});
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/")
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
}

export const search = async(req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: { 
        $regex: new RegExp(keyword, "i")  // i: 대소문자 구분 안함
      }
    }).populate("owner")
    //return res.render("search", {pageTitle: `Search Video`, fakeUser, videos});
  }
  return res.render("search", {pageTitle: "Search Video", fakeUser, videos});
}


export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);  // sendStatus : 상태코드만 보내고 연결 종료
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
}


export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id }
  } = req;

  const video = await Video.findById(id);

  if(!video) {
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id
  })
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId : comment._id });
}