# Google Sheets Recommendations Data

This guide explains how to connect your Google Sheet to your portfolio's recommendations page.

## Step 1: Set up the Google Sheet
1. Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
2. Name the sheet **"Portfolio Recommendations"**.
3. In the first row (Header), create exact columns identically named as follows:
   `id`, `category`, `categoryLabel`, `name`, `description`, `link`, `image`
4. Add a sample row (like the ones from your data.json):
   - id: `product-1`
   - category: `books`
   - categoryLabel: `Books`
   - name: `Atomic Habits`
   - description: `James Clear's masterpiece...`
   - link: `https://www.amazon.in`
   - image: `/recommendations/assets/reco_book_1.png`

## Step 2: Add the Apps Script
1. In your Google Sheet, click on **Extensions** > **Apps Script** in the top menu.
2. Delete the default `function myFunction() {}` code.
3. Paste the following code:

```javascript
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var data = [];
  
  // Get headers
  var headers = rows[0];
  
  // Loop through rows
  for (var i = 1; i < rows.length; i++) {
    var rowData = rows[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      if(headers[j]){
        obj[headers[j]] = rowData[j];
      }
    }
    
    // Only add if there is an ID
    if(obj.id) {
      data.push(obj);
    }
  }
  
  // Hardcode the categories structure since it's mostly static
  var responsePayload = {
    categories: [
      { id: "all", label: "All" },
      { id: "tech", label: "Tech" },
      { id: "books", label: "Books" },
      { id: "lifestyle", label: "Lifestyle" },
      { id: "health", label: "Health" }
    ],
    products: data
  };
  
  return ContentService.createTextOutput(JSON.stringify(responsePayload))
                       .setMimeType(ContentService.MimeType.JSON);
}
```

## Step 3: Deploy as a Web App
1. In the Apps Script editor, click the blue **Deploy** button at the top right.
2. Select **New deployment**.
3. Next to "Select type", click the gear icon ⚙️ and select **Web app**.
4. Description: `Recommendations API`
5. Execute as: **Me**
6. Who has access: **Anyone**
7. Click **Deploy**. (You will likely be asked to "Authorize Access", proceed past the safety steps).
8. Copy the **Web app URL**.

## Step 4: Link it to your website!
Once you have the URL, go into `recommendations/script.js` on line 12 and replace the `const SHEETS_URL = "YOUR_APP_SCRIPT_URL_HERE";` with your copied URL.

Commit and push your changes!
