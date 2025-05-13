const authController = require("./controllers/auth.controller");
const snippetController = require("./controllers/Snippet.controller")
const { verifyToken } = require('./middlewares/verifyToken.middleware');
const commentController = require('./controllers/Comment.controller');
const favoriteController = require('./controllers/Favorite.controller');

const axios = require("axios");


module.exports=(app)=>{
app.post('/register', authController.register);
app.post('/login', authController.login);
app.get('/auth', verifyToken , authController.getAuth)

app.post('/createS', verifyToken, snippetController.createSnippet);
app.put('/updateS/:id', verifyToken, snippetController.updateSnippet);
app.delete('/deleteS/:id', verifyToken, snippetController.deleteSnippet);
app.get('/getSById/:id', verifyToken,snippetController.getSnippetById);
app.get('/getAllS', verifyToken,snippetController.getAllSnippets);
app.post('/executeS',verifyToken, snippetController.executeSnippet);

app.post('/addComment', verifyToken, commentController.createComment);
app.put('/UpdateComment/:id', verifyToken, commentController.updateComment);
app.delete('/deleteComment/:id', verifyToken, commentController.deleteComment);

app.post('/addFavorite', verifyToken, favoriteController.addFavorite);
app.delete('/deleteFavorite/:snippetId', verifyToken, favoriteController.removeFavorite);
app.get('/favorites', verifyToken, favoriteController.getAllFavorites);



const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);




app.get("/ai-assistant-stream", async (req, res) => {
  const prompt = req.query.prompt;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const lines = text.split("\n");

   
    for (const line of lines) {
      if (line.trim()) {
        
        res.write(`data: ${JSON.stringify({ content: line + "\n" })}\n\n`);
        await new Promise((r) => setTimeout(r, 100)); 
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message || "Unknown error" })}\n\n`);
    res.end();
  }
});


  

}

