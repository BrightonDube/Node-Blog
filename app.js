//jshint esversion:8

const express = require("express");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
const uri = "mongodb://localhost/blog";
// Connect to Database
try{
  mongoose.connect(uri, {useNewUrlParser: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
          useCreateIndex: true  
  });
  console.log("Successfully connected to database");
}catch(err){
  console.log("There was a problem connecting to the database \n"+err);
}
//Create a Schema for creating our post documents
const Schema = mongoose.Schema;

const postSchema = new Schema({
  postTitle: {
    type: String,
    unique: true
  },
  postContent: {
    type: String,
    min: 20
  }
});

//Create a model to be used to build the documents. 
const Post = mongoose.model("post", postSchema);

app.get("/", async (req, res)=>{
  //fetch posts from database
  await Post.find((err, result)=>{
    if (err) console.log(err);
    else{
      res.render("home", {homeContent: homeStartingContent, posts: result});
    }
  });
  
});

app.get("/about", (req, res)=>{
  res.render("about", {aboutContent: aboutContent});
});
app.get("/contact", (req, res)=>{
  res.render("contact", {contactContent: contactContent});
});
app.get("/compose", (req, res)=>{
  res.render("compose", {});
});
// use express route params (req.params) to create dynamic routes.
app.get("/post/:id", async (req, res)=>{
  // Fetch the single post from the database and render it in the post page
    await Post.findById(req.params.id, (err, post)=>{
      if (err) {
        console.log("There was an error!\n" + err);
        res.redirect('/');

      } else {
        //render the post in the post template if the post title exists
        res.render('post', {postTitle: post.postTitle, postContent: post.postContent});
      }
    });
    //const requestedTitle = req.params.title;
    // posts.forEach((post)=>{
    //   const storedTitle = post.postTitle;         
    //   // use lodash to match any cases that might be typed by the user.
    //   if (_.lowerCase(storedTitle) === _.lowerCase(requestedTitle)){  
    //     //render the post in the post template if the post title exists
    //     res.render('post', {postTitle: post.postTitle, postContent: post.postContent});      
    //   }           
    // }); 
        
});

app.post("/compose", async (req, res)=>{
  // const post = {
  //   postTitle: req.body.post_title,
  //   postContent: req.body.post_content
  // }; 

  //posts.push(post);

  //grab postTitle and Content and store them in the database
  const postTitle = req.body.post_title;
  const postContent = req.body.post_content;
  const post = new Post({
    postTitle,
    postContent
  });
 await post.save((err)=>{
  if (err) console.log(err);
  else res.redirect("/");
 }); 
  
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
