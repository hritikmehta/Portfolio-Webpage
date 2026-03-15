# Google Apps Script Setup

The Connect form is configured to post to a Google Apps Script web app URL.

## Sender and Recipient

- sender Gmail: `mehta.hritik2001@gmail.com`
- recipient inbox: `hritikmehta.77@gmail.com`
- default subject: `Portfolio message from <name>`

## 1. Create the Script

Open:

- [https://script.google.com](https://script.google.com)

Create a new standalone Apps Script project under:

- `mehta.hritik2001@gmail.com`

Replace the default code with:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents || "{}");
    var name = String(data.name || "").trim();
    var email = String(data.email || "").trim();
    var message = String(data.message || "").trim();

    if (!name || !email || !message) {
      return jsonOutput({
        success: false,
        message: "Name, email, and message are required."
      });
    }

    var subject = "Portfolio message from " + name;
    var body = [
      "New portfolio message",
      "",
      "Name: " + name,
      "Email: " + email,
      "",
      "Message:",
      message
    ].join("\n");

    MailApp.sendEmail({
      to: "hritikmehta.77@gmail.com",
      replyTo: email,
      subject: subject,
      body: body,
      name: "Portfolio Contact Form"
    });

    return jsonOutput({ success: true });
  } catch (error) {
    return jsonOutput({
      success: false,
      message: error && error.message ? error.message : "Message delivery failed"
    });
  }
}

function doGet() {
  return jsonOutput({
    success: true,
    message: "Portfolio contact endpoint is live."
  });
}

function jsonOutput(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 2. Deploy the Script

In Apps Script:

1. Click `Deploy`
2. Click `New deployment`
3. Choose type: `Web app`
4. Description: `Portfolio contact form`
5. Execute as: `Me`
6. Who has access: `Anyone`
7. Click `Deploy`
8. Authorize the script when prompted

Copy the web app URL after deployment.

## 3. Paste the Web App URL Into This Repo

Open:

- `/Users/hritik/Documents/Github Projects/Portfolio-Webpage/content/site-content.json`

Replace:

- `REPLACE_WITH_GOOGLE_APPS_SCRIPT_WEB_APP_URL`

with your deployed Apps Script web app URL.

## 4. Redeploy the Portfolio

After pasting the web app URL:

1. commit the repo changes
2. push to GitHub
3. let Vercel redeploy

## Notes

- The form already sends JSON, so no additional backend is needed in this repo.
- Apps Script `MailApp.sendEmail` sends on behalf of your Gmail account.
- Google’s web-app docs: [Web Apps](https://developers.google.com/apps-script/guides/web)
- Mail sending docs: [MailApp](https://developers.google.com/apps-script/reference/mail/mail-app)
