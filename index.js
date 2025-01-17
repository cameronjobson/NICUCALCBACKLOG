const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
app.use(bodyParser.json());
app.use(cors());


const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });


const SPREADSHEET_ID = '1YOJ4FMBPXmi17RvBc0hiKrlSwogHApuQV1rGrNiVlfA';

app.get('/', (req, res) => {
  res.send('Welcome to the Bug Reporting API');
});

app.post('/report-bug', async (req, res) => {
  const { name, description2, description, gestAgeTotalDays, birthWeight, dateOfBirth } = req.body;

  function convertDaysToWeeks(days) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    return `${weeks} wk + ${remainingDays} d`;
}
  
  console.log(`Received bug report: ${name}, ${description2}, ${description}, ${gestAgeTotalDays}, ${birthWeight}, ${dateOfBirth}`);

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:F', 
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[name, description2, description, convertDaysToWeeks(gestAgeTotalDays), birthWeight, dateOfBirth]],
      },
    });

    console.log('Google Sheets API response:', response);

    res.status(200).send('Bug report submitted successfully');
  } catch (error) {
    console.error('Error submitting bug report:', error);
    res.status(500).send('Error submitting bug report');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
