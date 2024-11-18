const app = require("./app")
const connectDatabase = require("./config/database")
 const dotenv = require("dotenv");


 // handling uncaught exception 

process.on("uncaughtException", err=>{
    console.log(`error : ${err.message}`);
    console.log(`shut down the server  due to uncaughtException  `);
    process.exit(1)
})
 // config

 dotenv.config({path:"backend/config/config.env"})


 // connect data base
connectDatabase()

 const server =app.listen(process.env.PORT,()=>{
    console.log(`server is working ON http://localhost:${process.env.PORT}`);
})


//   this is a uncaught error 
//   console.log(youtube);
  


//  unhandled promise Rejection 
 // unhandledRejection   this is  a event name

process.on("unhandledRejection", err=>{
    console.log(`error : ${err.message}`);
    console.log(`shut down the server  due to unhandle promise Rejection  `);
    
    server.close(()=>{
        process.exit()
    })
})



