import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const GOOGLE_CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
const GOOGLE_SERVICE_PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;

const serviceAccountAuth = new JWT({
  email: GOOGLE_CLIENT_EMAIL,
  key: GOOGLE_SERVICE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

export default async function handler(req, res) {
    try {
      await doc.loadInfo();
      const sheet = doc.sheetsById[SHEET_ID];
      await sheet.addRow(req.body);
  
      res.status(200).json({ result: 'success' });
    } catch (e) {
      console.error(e); // log the error
      res.status(500).json({ error: e.message });
    }
  
}