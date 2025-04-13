# 🚀 Collegesy - Campus Marketplace   

A full-stack marketplace for college students to buy/sell used goods with real-time chat functionality.

## ✨ Features  

### 🛍️ Product Management  
- Create, update, and delete listings  
- Upload multiple product images  
- Mark items as sold  
- Search and filter products  

### 🔒 Authentication  
- JWT-based secure login  
- Password reset functionality  
- Profile updates  

### 💬 Real-Time Chat  
- Socket.io powered messaging  
- Multi-device support  
- Notification system  

## 🛠️ Tech Stack  

**Frontend**  
- React.js  
- Tailwind CSS  
- Axios for API calls  

**Backend**  
- Node.js & Express.js  
- MongoDB (Mongoose)  
- Socket.io  
- JWT & Bcrypt  

## 🚀 Installation  

1. Clone the repository:
```bash
git clone https://github.com/gouravgarg9/Collegesy.git
cd Collegesy
```
2. Install dependencies for both client and server:
```bash
cd server && npm install
cd ../client && npm install
```
3. Create .env file in server directory with:
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```
4. Run the application
```bash
# Start backend (from server directory)
npm run dev

# Start frontend (from client directory)
npm start
```
