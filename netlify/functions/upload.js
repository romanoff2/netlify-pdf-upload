const axios = require('axios');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    const formData = event.body;
    const headers = event.headers;

    // Check content type
    if (!headers['content-type']?.includes('multipart/form-data')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid Content-Type' }),
      };
    }

    const buffer = Buffer.from(formData, 'base64');
    const boundary = headers['content-type'].split('boundary=')[1];

    // Forward the form-data to the target endpoint
    const response = await axios.post(
      'https://n8n-sgsh.onrender.com/webhook/scriba/cv',
      buffer,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          Authorization: 'prova',
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'File uploaded successfully!' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error uploading the file.' }),
    };
  }
};