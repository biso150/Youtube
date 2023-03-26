import User from "../models/User";
//import Video from "../models/Video";
import bcrypt from "bcrypt";
const fakeUser = {
  username: "Jihye",
  loggedIn: false
}

export const getJoin = (req, res) => res.render("join", {pageTitle: "Join", fakeUser});

export const postJoin = async(req, res) => {
  const {name, username, email, password, password2, location} = req.body;

  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {pageTitle, fakeUser, errorMessage: "Passwword confirmation does not match."});
  }

  const exists = await User.exists({$or: [{username}, {email}]})  // await User.exists({username: username});
  if (exists) {
    return res.status(400).render("join", {pageTitle, fakeUser, errorMessage: "This username/email is already taken."});
  }

  try {
    await User.create({
      name, username, email, password, location
    })
    return res.redirect("/login")
  } catch (error) {
    return res.status(400).render("join", {pageTitle, fakeUser, errorMessage: error._message})
  }
}

export const getLogin = (req, res) => {
  res.render("login", {pageTitle: "Login", fakeUser});
}

export const postLogin = async (req, res) => {
  const {username, password } = req.body;
  const pageTitle = "Login"
  const user = await User.findOne({username, githubLoginOnly: false})
  if(!user) {
    return res.status(400).render("login",{pageTitle, fakeUser, errorMessage:"An account with this username does not exists."})
  }
  
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) {
    return res.status(400).render("login",{pageTitle, fakeUser, errorMessage:"Wrong password"})
  }

  req.session.loggedIn = true;  // session에 추가
  req.session.user = user;
  
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config =  {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email"
  }
  const params = new URLSearchParams(config).toString();  // url을 만들어줌
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
}

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token"
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code
  }
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (await fetch(finalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json"
    }
  })).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (await fetch(`${apiUrl}/user`, {
      headers: {
        Authorization: `token ${access_token}`
      }
    })).json();
    const emailData = await (await fetch(`${apiUrl}/user/emails`, {
      headers: {
        Authorization: `token ${access_token}`
      }
    })).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }

    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        githubLoginOnly: true,
        location: userData.location
      })
    }    
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
  // res.send(JSON.stringify(json));  // 프론트엔드에서 json을 볼 수 있음
}

export const getEdit = (req, res) => {
  return res.render("editProfile", {pageTitle: "Edit Profile"});
}

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl}  // const id = req.session.user.id 와 같다
    },
    body: {
      name, email, username, location
    },
    file
  } = req;
  const updateUser = await User.findByIdAndUpdate(
    _id, {
      name, email, username, location, avatarUrl: file ? file.path : avatarUrl
    }, {
      new: true 
    })
  req.session.user = updateUser;
  // await User.findByIdAndUpdate(_id, { name, email, username, location })
  // req.session.user = {
  //   ...req.session.user,
  //   name, email, username, location
  // }


  /* name, email 중복 확인 해보기 */


  return res.redirect("/users/editProfile");
}

export const getChangePassword = (req, res) => {
  if (req.session.user.githubLoginOnly === true) {
    req.flash("error", "Can't change password.");
    return res.redirect("/")
  }
  return res.render("changePassword", {pageTitle: "Change Password"})
}

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id, password }
    },
    body: {
      oldPassword, newPassword, newPasswordConfirmation
    }
  } = req;

  // const user = await User.findById(_id);
  // const ok = await bcrypt.compare(oldPassword, user.password);
  const ok = await bcrypt.compare(oldPassword, password);
  if(!ok) {
    return res.status(400).render("changePassword",{ pageTitle: "Change Password", errorMessage: "The current password is incorrect" })
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("changePassword", { pageTitle: "Change Password", errorMessage: "The Password does not match the confirmation" })
  }

  const user = await User.findById(_id);
  user.password = newPassword;
  await user.save();  // hash 됨
  req.session.user.password = user.password;  
  req.flash("info", "Password updated");

  return res.redirect("/users/logout")
}

export const remove = (req, res) => res.send("Remove");

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
}

export const see = async (req, res) => {
  const { id } = req.params;
  // const user = await User.findById(id).populate("videos");
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      module: "User"
    }
  });
  if (!user) {
    return res.status(404).render("404", {pageTitle: "User not found."});
  }
  // const videos = await Video.find({owner: user._id})
  return res.render("profile", {pageTitle: user.name, user/*, videos*/})
}
