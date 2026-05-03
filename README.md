# WhatsApp Web clone

    -This Project is a full-Stack WhatsApp Web Clone developed as part of Humbletree Internship Assignment.
    -It includes user authentication,profile-setup, real-time messaging,MongoDb storage, and a Professional WhatsApp web-like interface.

## How it Works/Workingflow

    -Sign up/Login with Email or username and a password (This one the combined flow /uses a single access flow. Existing users will log in directly. New users can enter email or username with a password to start account access)

    -After signing up / log in you have to set Username, Full name and a Profile picture(Optional). The User can edit there Profile data in the UserProfile.

    -See the list of other users on the left side in the Chatlist, Click any one to open the chat that is showen in the chatwindow.

    -Send and Receive text messages instantly. And Auto Scrolling to Last message.

    - Messages are saved in the MongoDB so they don't disappear after refresh

## Tech Stack Used

### Frontend
    -React.js(Vite)
    -React Router DOM
    -tailwindcss/vite
    -axios
    -lucide-react
    -react-icons
    -socket.io-client
### Backend
    -bcryptjs for password hashing,
    -cloudinary for Storing Profile pictures
    -Node.js + express
    -jsonwebtoken for auth
    -MongoDb with mongoose
    -socket.io

## features Implemented

 ### User Authentication
    - User registration/login
    - JWT token authentication
    - Protected routes
    - Profile completion system

### Chat Interface
    - Two-panel WhatsApp Web layout
    - Sidebar navigation
    - Chat list with available users
    - Active chat highlighting
    - Chat window with message history
    - Delete chat functionality

### Messaging System
    - Send text messages
    - Real-time communication using Socket.IO
    - Store messages in MongoDB
    - Fetch conversation history
    - Display messages in chronological order
    - Auto-scroll to latest messages
    - Persist chats after refresh

## Floder Structure 

WhatsApp-Web-Clone-/
        -backend/
            -config/  (cloudinary + mongodb)
            -controllers/  (auth,message,user)
            -middleware/  (auth,error,upload)
            -models/  (user,message)
            -routes/  (auth,message,user)
            -sockets/  (socket)
            -utils/  (generatetoken,uploadtocloudinary)
            -server.js
    -frontend
       src/
        -api/  (api)
        -components/  (chatlist,chatwindow,navbar,sidebar)
        -pages/ (auth,dashboard,profilesetup,userprofile)
        -services/  (auth,message,socket,user)
        -App.jsx
        -main.jsx

## How to Run it Locally
    you will need Node.js,Mongodb and a Cloudinary account

### 1. clone the Repository
    -git clone https://github.com/mprem27/WhatsApp-Web-Clone-.git
    -cd WhatsApp-Web-Clone-

### 2. Backend
    -cd backend
    -npm install

### Environment Variables Setup
    -Create a ".env" file inside the "backend" folder with this:

        MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/Whatsappclone 
        PORT=4000
        JWT_SECRET=any_long_random_string_you_want
        JWT_EXPIRES_IN=7d
        FRONTEND_URL=http://localhost:5173
        CLOUDINARY_NAME=your_cloudinary_cloud_name
        CLOUDINARY_API_KEY=your_cloudinary_api_key
        CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret

### Environment Variables Explanation
    -MONGODB_URI ="Connection string for the database"."In the Free MongoDB Atlas account go to Connect click on the Drivers then copy the URI"

    -PORT ="Port the backend listens on Any free port"

    -JWT_SECRET="Secret used to sign JWT tokens.Any long random string"

    -JWT_EXPIRES_IN="Token Exprires timeLine (lifetime) "

    -FRONTEND_URL="http://localhost:5173 for local dev"

    -CLOUDINARY_NAME="Cloudinary cloud name"."That is Available in the Cloudinary dashboard, At top-right account info"

    -CLOUDINARY_API_KEY="Cloudinary API key that will be there in Cloudinary go to Settings and then API Keys"
    
    -CLOUDINARY_SECRET_KEY="Cloudinary API secret that will in the same place where the Cloudinary API key found or showen"

        
### Then start it:
    npm start
    
        -If everything is fine you should see 
        "MongoDB connected successfully!,
        Cloudinary Connected and 
        Server running on port 4000".

### 3. Frontend
    -Open a new terminal:
        -cd frontend
        -npm install

### Environment Variables Setup
    -Create a ".env" file inside the "frontend" folder with this:
        VITE_API_URL='http://localhost:4000/api'
        VITE_SOCKET_URL='http://localhost:4000'

### Then Run:
    npm run dev
        -Open http://localhost:5173 in the browser.


