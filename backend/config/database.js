// const { log } = require("console");
// const mongoose = require("mongoose")
// const connectDatabase = ()=>{

//     mongoose.connect(`mongodb://localhost:27017/Ecommerce`)
//         .then((data)=>{
//         console.log(`mongodb connect with server  ${data.connection.host}`);
//             })
// }

// module.exports = connectDatabase

const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL,{
   //  useNewUrlParser: true,
   // useUnifiedTopology: true,
    // useCreateIndex: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;