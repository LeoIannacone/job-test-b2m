db = db.getMongo().getDB("b2m");
user = db.getUser("b2m");
if (!user) {
  db.createUser({ user: "b2m", pwd: "b2mpwd", roles: ["readWrite"] })
}
