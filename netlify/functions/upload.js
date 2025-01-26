const axios = require('axios');
const formidable = require('formidable');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    // Use formidable to parse the incoming form data
    const form = new formidable.IncomingForm();
    form.parse(event.body, async (err, fields, files) => {
      if (err) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Error parsing file.' }),
        };
      }

      // Make sure the file is there
      if (!files.pdf) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'No file provided' }),
        };
      }

      // Prepare the form data to forward to the API, with 'cv' as the key
      const formData = new FormData();
      formData.append('cv', files.pdf[0]); // Renaming the field to 'cv'

      try {
        // Forward the form data to the target endpoint
        const response = await axios.post(
          'https://n8n-sgsh.onrender.com/webhook/scriba/cv',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': 'prova',
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
          body: JSON.stringify({ message: 'Error uploading the file to external API.' }),
        };
      }
    });
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing the request.' }),
    };
  }
};
