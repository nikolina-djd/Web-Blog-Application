import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import {fileURLToPath} from "url";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = (__dirname + "/views/index.ejs");
const postsPath = (__dirname + "/views/posts.ejs");
const blogDetailsPath = (__dirname + "/views/viewBlogDetails.ejs");
 
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(express.static('public'));

 app.get("/", (req, res)=> {
 res.render(indexPath)});

//Create Post

 let blogArray = []
app.post("/submit", (req, res) => {

 const blogTitle = req.body["title"];
 const blogAuthor = req.body["author"];
 const blogMessage = req.body["blogpost"];

 blogArray.push({
 id: generateID(),
 title: blogTitle,
 author: blogAuthor,
 description: blogMessage,
 })
  res.render(postsPath, {
    blogList: blogArray,
  });
});


function generateID() {
  return Math.floor(Math.random() * 10000);
}



// Render blog details page
app.get("/blogDetails/:id", (req, res) => {
  const blogId = req.params.id;
  const blogDetails = blogArray.find((blog) => blog.id === parseInt(blogId));
  res.render(blogDetailsPath, {
    blogDetails: blogDetails,
  });
});

// Delete a blog
app.post("/delete/:id", (req, res) => {
  const blogId = req.params.id;
  blogArray = blogArray.filter((blog) => blog.id !== parseInt(blogId));
  res.send(
    '<script>alert("Blog deleted successfully"); window.location="/post";</script>'
  );
  res.redirect("/post");
});


//Edit blog
app.get("/edit/:id", (req, res) => {
  const blogId = req.params.id;
  const blogDetails = blogArray.find((blog) => blog.id === parseInt(blogId));
  res.render(indexPath, {
    isEdit: true,
    blogDetails: blogDetails,
  });
});



// Update blog
app.post("/edit/:id", (req, res) => {
  const blogId = req.params.id;
  const editBlog = blogArray.findIndex((blog) => blog.id === parseInt(blogId));
  if (editBlog === -1) {
    res.send("<h1> Something went wrong </h1>");
  }
  const updatedTitle = req.body["title"];
  const updatedDescription = req.body["blogpost"];
  const updatedAuthor = req.body["author"];

  const blogTitle = (blogArray[editBlog].title = updatedTitle);
  const blogMessage = (blogArray[editBlog].description = updatedDescription);
  
  const blogAuthor = (blogArray[editBlog].author = updatedAuthor);
  
  [...blogArray, { blogTitle: blogTitle, blogMessage: blogMessage, blogAuthor:blogAuthor }];

  res.render(postsPath, {
    isEdit: true,
    blogList: blogArray,
  });
});

//Render View All Posts Page
app.get("/post", (req, res)=>{
res.render(postsPath, {
 blogList: blogArray,
  });
})





app.listen(port, ()=>{
console.log(`Server is running on port ${port}`)})