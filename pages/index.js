import React, { useState } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { GoogleSpreadsheet } from 'google-spreadsheet';

import dayjs from 'dayjs';
import '../styles/Home.module.css'

// Config variables
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const GOOGLE_CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
const GOOGLE_SERVICE_PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;

function Home() {
  const [authenticated, setAuthenticated] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const docs = [
    {
      uri: "/DeckEthicalAI.pdf",
    }, /* the rest of files*/
  ];

  const checkPassword = (password) => {
    return password === 'Ethics777'; // Replace 'your password' with the actual password
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (checkPassword(password)) {
      setAuthenticated(true)
      try {
        const newRow = {
          Email: email,
          Date: dayjs().format('DD MMMM YYYY hh:mm:ss A'),
        };
  
        const response = await fetch('/api/addRow', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newRow),
        });
  
        if (response.ok) {
          console.log('Row added!');
        } else {
          console.error('Error adding row: ', response.statusText);
        }
      } catch (e) {
        console.error('Error: ', e);
      }
    } else {
      alert("Incorrect password!");
    }
  };
  return (
    <div className="outerContainer">
      <h1 className="title">EthicalAI Portal ⌘</h1>
      {!authenticated ? (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="inputContainer">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
               />
            </div>
            <div className="inputContainer">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
               />
            </div>
            <div className="btnContainer">
              <button type="submit" className="submitButton">Access Document</button>
            </div>
          </form>
        </div>
      ) : (
        <DocViewer
          prefetchMethod="GET"
          documents={docs}
          pluginRenderers={DocViewerRenderers}
          style={{ height: "100vh" }}
        />
      )}
    </div>
  );
}

export default Home;