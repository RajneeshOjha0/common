const express = require("express");
const app = express();
const userRoute = require("./routes/UserRoute");
app.use(express.json())

app.use("/api/v1", userRoute);

app.use((err,req,res,next)=>{
  res.json({success:false,"message":"Something went wrong"})
  next();
})

app.listen(3000, () => {
  console.log("sseerv is listening on");
});
