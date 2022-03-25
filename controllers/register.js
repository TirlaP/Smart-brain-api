const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  //   bcrypt.hash(password, null, null, function (err, hash) {
  //     // A hash function takes a string and jumbles it up in a
  //     //  way that it's no way to tell what it means
  //     // - Also, it always return different values => MORE SECURE
  //     console.log(hash);
  //   });
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission");
  }

  const hash = bcrypt.hashSync(password);

  // Transactions - tables are connected, so that if we can't update one of them,
  // we won't update any, and will send an erros, so that we don't have any
  // inconsistencies.
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("unable to register"));
};

module.exports = {
  handleRegister: handleRegister,
};
