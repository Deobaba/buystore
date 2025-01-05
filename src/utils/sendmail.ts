import axios from 'axios';

// Your Brevo API key
const API_KEY = ""

// Brevo API URL
const API_URL = "ddd"

// Function to send an email
 const sendEmail = async (to: string, subject: string, template: any) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        sender: { email: 'adexsquare4192@gmail.com' },
        to: [{ email: to }],
        subject,
        // textContent: text,
        htmlContent: template 
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY
        }
      }
    );
    console.log('Email sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
  }
};



export const sendMail = async (to: string, subject: string, template: any, attempts = 2) => {
  let response1
  for (let i = 0; i < attempts; i++) {
      [response1] = await Promise.all([
          sendEmail(to,subject,template),
      ]);

      if (response1 !== undefined) {
          // Emails sent successfully, break the loop
          break;
      }

      if (i < attempts - 1) {
          console.log(`Retrying email send (${i + 1}/${attempts})...`);
      } else {
          console.error('Failed to send emails after multiple attempts');
      }
  }
};