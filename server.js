import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/connect.js';
import cors from 'cors';
import authMiddleware from './middleware/authMiddleware.js';

// routers
import authRouter from './routes/authRoutes.js';
import programRouter from './routes/programRoutes.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';

// import for default view
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());  // Allow CORS from all origins
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const port = process.env.PORT || 5100;

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/project', authMiddleware, programRouter);
app.use('/api/v1/users', authMiddleware, userRouter);
app.use('/api/v1/chat', authMiddleware, chatRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is running on ${port}....`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

// import express from 'express';
// import dotenv from 'dotenv';
// import path from 'path';
// import connectDB from './db/connect.js';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import exphbs from 'express-handlebars';
// import authMiddleware from './middleware/authMiddleware.js';

// // Routers
// import authRouter from './routes/authRoutes.js';
// import programRouter from './routes/programRoutes.js';
// import userRouter from './routes/userRoutes.js';
// import chatRouter from './routes/chatRoutes.js';

// dotenv.config();

// const app = express();
// const __dirname = path.resolve();

// // Set up Handlebars view engine
// const hbs = exphbs.create({
//   extname: 'hbs',
//   defaultLayout: 'main', // Optional: if you have a main layout file
//   layoutsDir: path.join(__dirname, 'views/layouts'), // Optional: if you have a layouts directory
//   partialsDir: path.join(__dirname, 'views/partials') // Optional: if you have a partials directory
// });

// app.engine('hbs', hbs.engine);
// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'views'));

// // Serve static files from the public directory
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors());  // Allow CORS from all origins
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// // Define routes for rendering views
// app.get('/', (req, res) => res.render('index', { title: 'Home' }));
// app.get('/login', (req, res) => res.render('login', { title: 'Login' }));
// app.get('/register', (req, res) => res.render('register', { title: 'Register' }));
// app.get('/dashboard', authMiddleware, (req, res) => {
//   // Fetch user's projects and pass to the template
//   const projects = []; // Fetch from DB
//   res.render('dashboard', { title: 'Dashboard', projects });
// });
// app.get('/project/new', authMiddleware, (req, res) => res.render('project', { title: 'New Project' }));
// app.get('/mutation-results', authMiddleware, (req, res) => {
//   const results = ''; // Fetch results
//   res.render('mutationResults', { title: 'Mutation Results', results });
// });

// // API routes
// app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/project', authMiddleware, programRouter);
// app.use('/api/v1/users', authMiddleware, userRouter);
// app.use('/api/v1/chat', authMiddleware, chatRouter);

// // Catch-all for non-API routes
// app.get('*', (req, res) => res.status(404).render('404', { title: 'Not Found' }));

// const start = async () => {
//   try {
//     await connectDB(process.env.MONGO_URL);
//     app.listen(process.env.PORT || 5100, () => {
//       console.log(`Server is running on port ${process.env.PORT || 5100}....`);
//     });
//   } catch (error) {
//     console.error('Error starting server:', error);
//   }
// };

// start();

