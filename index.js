const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');

const app = express();
app.use(bodyParser.json());

// Load service account credentials from environment variable
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = '1YOJ4FMBPXmi17RvBc0hiKrlSwogHApuQV1rGrNiVlfA';

app.post('/report-bug', async (req, res) => {
  const { name, email, description } = req.body;

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:C', // Adjust the range as needed
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[name, email, description]],
      },
    });

    res.status(200).send('Bug report submitted successfully');
  } catch (error) {
    res.status(500).send('Error submitting bug report');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
