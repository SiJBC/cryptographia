
const { GoogleSpreadsheet } = require('google-spreadsheet')
const doc = new GoogleSpreadsheet(
  '12h_iVN8L-O-zZt82AQSFcwoArSsOJHixXBHSNqrZ18s'
)
const credentials = require('./client_secret.json')
// const { google } = require('googleapis')

async function accessSpreadSheet() {
  await doc.useServiceAccountAuth(credentials)
  await doc.loadInfo()
  const sheet = doc.sheetsById[0]
  const rowData = await sheet.getRows()
  for (var i = 0; i <= rowData.length - 1; i++) {
    var data = rowData[i]
    console.log(data._rawData[3])
  }
}

accessSpreadSheet()
