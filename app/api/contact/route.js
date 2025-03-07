import { google } from "googleapis";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
const credentialsPath = path.join(
  process.cwd(),
  "credentials",
  "google-service-account.json"
);
export async function POST(req) {
  const { name, email, message } = await req.json();
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please fill in all fields" },
      { status: 400 }
    );
  }
  try {
    const credentials = JSON.parse(await fs.readFile(credentialsPath, "utf8"));
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const getRows = await sheets.spreadsheets.values.get({
      spreadsheetId: "1rkkKr_08U6DC1kV6tLAaniB0sCb2sAaKEObIJrvjtcU",
      range: "Contact!A:D",
    });
    const rows = getRows.data.values;
    let newRowNumber = 1;
    if (rows && rows.length > 1) {
      const lastRowNumber = parseInt(rows[rows.length - 1][0], 10);
      newRowNumber = !isNaN(lastRowNumber) ? lastRowNumber + 1 : 1;
    }
    const date = new Date();
    const formattedDate =
      date.toISOString().split("T")[0] +
      " " +
      date.toTimeString().split(" ")[0];

    const values = [[newRowNumber, name, email, message, formattedDate]];
    await sheets.spreadsheets.values.append({
      spreadsheetId: "1rkkKr_08U6DC1kV6tLAaniB0sCb2sAaKEObIJrvjtcU",
      range: "Contact!A:E",
      valueInputOption: "USER_ENTERED",
      resource: {
        values,
      },
    });
    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Error saving to Google Sheets:", error);
    return NextResponse.json(
      { error: "An error occurred while saving." },
      { status: 500 }
    );
  }
}
