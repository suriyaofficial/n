import logo from './logo.svg';
import './App.css';
import Home from './Dash'
import Login from './Navbar'

function App() {
  return (
    <>
      {/* <Login /> */}
      <Home />
    </>
  );
}

export default App;









// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3100');
// console.log("🚀 ~ file: App.js:5 ~ socket:", socket)

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState('');

//   useEffect(() => {
//     socket.on('message', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });
//   }, [0]);

//   const handleMessageSubmit = () => {
//     socket.emit('message', inputValue);
//     setInputValue('');
//   };

//   return (
//     <div>
//       <h1>Socket.IO Test</h1>
//       <div>
//         {messages.map((message, index) => (
//           <p key={index}>{message}</p>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//       />
//       <button onClick={handleMessageSubmit}>Send</button>
//     </div>
//   );
// }

// export default App;


