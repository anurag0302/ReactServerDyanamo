const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { 
  v4: uuidv4,
} = require('uuid');


const app = express();
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use("/profile", express.static("upload"));
const {
  addOrUpdateQuestion,
  getQuestions,
  deleteQuestion,
  getQuestionById,
  getSearchResult,
  updateQuestion,
} = require("./dynamo");

const {
  getUsers,
  login,
  addUser,
  deleteUser,
  updateUser,
  getUserById
} = require("./userinfo");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Working on port 5000 ");
});

// Api for QuestionAnswers
app.get("/questions", async (req, res) => {
  try {
    const questions = await getQuestions();
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.get("/questions/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const question = await getQuestionById(id);
    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.get("/questionsans/:data", async (req, res) => {
    const data = req.params.data;
    
    try {
      const question = await getSearchResult(data);
      
      res.json(question);
    } catch (err) {
      console.error(err);
      res.status(500).json({ err: "Something went wrong" });
    }
  });


  //storage---------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const value = "upload/";
    cb(null, value);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${uuidv4()}${path.extname(
        file.originalname.toLowerCase()
      )}`
    );
  },
});
const upload = multer({ storage: storage }).single("image");


app.post("/questions",upload, async (req, res) => {
 

  const {question,answer,status,dateLog,secondary} = JSON.parse(req.body.data);

  let imageLocation="null";
  if(req.file){ 
    imageLocation="http://localhost:5000/profile/"+req.file.filename;
    console.log(imageLocation)
  }
  
  
  let id=uuidv4();
  const qa=question.toLowerCase()+" "+answer.toLowerCase();
  const data={question:question,answer:answer,questionId:id,qa: qa,status:status,dateLog:dateLog,secondary:secondary,imageLocation:imageLocation}
  try {
    const newQuestion = await addOrUpdateQuestion(data);
    res.json(newQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.put("/questions/:id",upload, async (req, res) => {
  console.log("yesy")

  const question = JSON.parse(req.body.data);

  let imageLocation="null";
  if(req.file){ 
    imageLocation="http://localhost:5000/profile/"+req.file.filename;
    
  }
  else{
    imageLocation=question.secondary.imgdata
  }

  
  const { id } = req.params;
  question.id = id;
  try {
    const newQuestion = await updateQuestion(question,imageLocation);
    res.json(newQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.delete("/questions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    res.json(await deleteQuestion(id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

//UserInfo Working Api

app.get("/userinfo", async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.get("/userinfo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await getUserById(id);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});


app.post("/logininfo", async (req, res) => {
  const {id,password} = req.body;
  try {
    const newUser = await login(req.body);
    if(newUser.Item.password===password){
      res.json(newUser);
    }
    else{
      res.status(500).json({ err: "Invalid cred Found" });
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});


app.post("/userinfo", async (req, res) => {

  const {id,fullName,password,rolePosition} = req.body;
  
  
  const data={id:id,fullName:fullName,password:password,rolePosition:rolePosition}
  try {
    const newUser = await addUser(data);
    res.json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.put("/userinfo/:id", async (req, res) => {
  const user = req.body;
  const { id } = req.params;

  user.id = id;
  try {
    const editUser = await updateUser(user);
    res.json(editUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.delete("/userinfo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    res.json(await deleteUser(id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});








const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
