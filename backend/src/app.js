const express=require('express');
const authRoutes=require('./routes/auth.routes');
const creategigRoutes=require('./routes/creategig.routes');
const serviceRequestRoutes=require('./routes/serviceRequest.routes');
const messageRoutes=require('./routes/message.routes');
const cookieParser=require('cookie-parser')
const app=express();
const cors=require('cors');
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use('/api/auth',authRoutes);
app.use('/api/gig',creategigRoutes)
app.use('/api/service-requests',serviceRequestRoutes);
app.use('/api/messages',messageRoutes);

module.exports=app;