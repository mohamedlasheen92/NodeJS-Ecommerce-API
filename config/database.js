const mongoose = require('mongoose')

const dbConnection = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(({ connection }) => {

      console.log(`Database Connected: ${connection.host}`);

    })

  // .catch((reason) => {
  //   console.log(`Database Error: ${reason}`);
  //   process.exit(1)
  // })
}

module.exports = dbConnection