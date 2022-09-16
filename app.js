const express = require("express");
const cors = require("cors");
const { 
  v4: uuidv4,
} = require('uuid');


const app = express();
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

const {
  addOrUpdateQuestion,
  getQuestions,
  deleteQuestion,
  getQuestionById,
  getSearchResult,
  updateQuestion
} = require("./dynamo");

const {
  getUsers,
  getUserById,
  addUser,
  deleteUser,
  updateUser
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

app.post("/questions", async (req, res) => {

  const {question,answer,status,dateLog,secondary} = req.body;
  
  let id=uuidv4();
  const qa=question.toLowerCase()+" "+answer.toLowerCase();
  const data={question:question,answer:answer,questionId:id,qa: qa,status:status,dateLog:dateLog,secondary:secondary}
  try {
    const newQuestion = await addOrUpdateQuestion(data);
    res.json(newQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.put("/questions/:id", async (req, res) => {
  const question = req.body;
  const { id } = req.params;
  question.id = id;
  try {
    const newQuestion = await updateQuestion(question);
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
  const id = req.params.id;
  try {
    const question = await getUserById(id);
    res.json(question);
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
