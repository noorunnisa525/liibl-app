export const uploadToS3 = async (info, id, response, callBack) => {
  var obj = {};
  obj['name'] = response.fileName;
  obj['type'] = response.type;
  obj['uri'] = response.uri;

  const data = new FormData();
  data.append('key', info.file_bucket_path + info.filename);
  data.append('acl', 'private');
  data.append('Content-Type', response.type);
  data.append('AWSAccessKeyId', info.key);
  data.append('Policy', info.policy);
  data.append('filename', info.filename);
  data.append('Signature', info.signature);
  data.append('file', obj);

  var request = new XMLHttpRequest();
  request.onreadystatechange = e => {
    if (request.readyState !== 4) {
      return;
    }

    if (request.status === 200) {
    } else {
      callBack(id);

      return true;
    }
  };

  await request.open(
    'POST',
    'https://rishabh-bucket-demo.s3-eu-west-1.amazonaws.com',
    true,
  );
  await request.send(data);
};
