import multer from "multer"

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName="Youtube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};  // {}는 undefined 방지

  next();
}

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/login")
  }
}

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/")
  }
}

export const avatarUpload = multer({
  dest: "uploads/avatars/", limits: {fileSize: 3000000}
})

// export const videoUpload = multer({
//   dest: "uploads/videos/", limits: {fileSize: 10000000}
// })

export const videoUpload = multer({
  dest: "uploads/videos/"
})