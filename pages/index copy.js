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
      uri: "/demo.pdf",
    }, /* the rest of files*/
  ];

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

  const checkPassword = (password) => {
    return password === 'Ethics777'; // Replace 'your password' with the actual password
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (checkPassword(password)) {
      setAuthenticated(true);
      try {
        const newRow = {
          Email: email,
          Date: dayjs().format('DD MMMM YYYY hh:mm:ss A'),
        };
        await doc.useServiceAccountAuth({
          client_email: GOOGLE_CLIENT_EMAIL,
          private_key: GOOGLE_SERVICE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
        await doc.loadInfo();

        const sheet = doc.sheetsById[SHEET_ID];
        await sheet.addRow(newRow);
      } catch (e) {
        console.error('Error: ', e);
      }
    } else {
      alert("Incorrect password!")
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