export const trending = (req, res) => res.send("Homepage");
export const see = (req, res) => res.send(`Watch Video #${req.params.id}`);
export const edit = (req, res) => res.send("Edit");
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const remove = (req, res) => res.send("Remove");