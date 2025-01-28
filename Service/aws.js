const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

async function uploadFileToS3() {
  const bucketName = 'your-bucket-name';
  const region = 'your-region';
  const accessKeyId = 'your-access-key';
  const secretAccessKey = 'your-secret-key';
  const objectKey = 'your-object-key.txt';
  const fileContent = 'Hello JavaScript SDK!';

  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        Body: fileContent,
        
      })
    );

    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${objectKey}`;
    console.log('File uploaded successfully:', fileUrl);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

uploadFileToS3();
