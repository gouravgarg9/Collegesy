const vision = require('@google-cloud/vision');
const AppError = require('../utils/appError');
const path = require('path');

const CREDENTIALS = JSON.parse(JSON.stringify({
  "type": "service_account",
  "project_id": "page-speed-1621406024826",
  "private_key_id": "c363be7534039980560e28f0f536fcc901a3537b",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDkiuyBI036bR7p\no5MhYPwXwaeDu5ocS79ZLq4endIctFV4iU/4/qpkHThz7J9jqwTGkQhFuz4zu6L8\nRAktrv8njcIldM74dLHqc4HGCXFOfTJP4uoAtf5L6284saw0FYlZOwyvtcT8s1Ob\njPeYAsZgirmBfAtgJMISHKM13+AOkN5S5C+Rc7iwL10d3QX09X5BSBnGGNBXRDXH\ngrihzhhDjnUSl+UlAbB0DN5no2chSpOv818UlZCpBuPjAy7pGUykrsX5nQF4eayM\nOmwh2umGh+xf9U03mN3/s8BxOajb/Ibr5WQ0SkHZOB4v8s3t0STR0HXNhH3CDa20\nkc5M/IVDAgMBAAECggEAaFb2p/SW1sS37sIT25LcNPpgQLfHIbEBcLVroCW8dgds\n2CWUgeC+qQtgKSi4EjhTa1ZumOtl+Bdrz1E+gYFaE1RYdWJRVcRtL9VBQ8ku1j85\nV5iI7f8o1L9tnUwciwDkHn1jitrpTteOTb97kIZ/zDa5f6DCzsepZLx3VRLbR7pG\nKCqNt0F6jPJfigFLVXIShd4Fxb/mSX2lVQ3OCRNIUEe/wQhzPbFdW6lTOj8BTvqp\nqUiWduVICs29eeMcVW2GM4tyY+qxuOIcM3YvqvQBE6qcqfFIefoLk+ce1xIoml+k\nP/6jbipF4NeA4Qa5dsmxGjPkL/1qS9zz/GLBQTXiYQKBgQD2Sd18un9uAZ5kMLHW\nO99jqtrKOuQV/XD6IvPhBA0ic7hulvbwhJDMDoqD0lt4NbqC2MfWu5d7DUg0c9ia\nANBNDo2pkjZc5AJqztTXJ/9Aw/kmfLN+cMfWM22ze3mANhBGssyeq2N0hJG6Rjxv\nrJv3gqRKI+ltvGRsAW6eIWPcIwKBgQDtjezA5hjDa64slIEU4GBXHzLa2bBRsvMI\na6nkLFY9+QHLFJddwM61VpgxqdW1yrZTuShgqj4WkOBWg818dDcwHZLtg43DmEU6\npotv13yyIstHO5F+qh1+uhT1XXmgN9Jy/SrLpTupAVHa5HvYXa5Hlwaj/JXUAO10\nHg43WEU0YQKBgDXKyE93xGFYhSnI4O6zwQTZylOlLTAIXOalP7MD2YKO19d/rYu2\nyJFpE6PbDBNjWMs/YdZqvpknu3+JVeO9DcHmzdYdkzYSrtx5NE+R8tRIeWCImAOj\nymHkda9f5pe0NzXZ04tMT7qhQdr3gDe78YzLwepXkaJgJWbZoTl0fYUVAoGBAJI2\nBV9hACLflu9nY9+GjqVw1WswCz7txnoLUiDXTSmNppXpEZUpw9CHANuobZobr4bu\ncrS0c8yN1RZKv2H3YbRir3kyvEGD6jBEK5Rl7CD0G2u3dUCh0c+bFqVCqEZ9tTED\nM6DuDT9jSY9RjAxK9KaphPPP1iQLghszGIrl8IphAoGBAK3J1Pc3KpjHw4psYtQN\nIq5pnUiVJQm+83rpQFWxMf+gDS7zge07J/lfRj2pTinRA1x2ERECTyyH7TiK7uEM\neu7kmsfNuJaTViOe8v6KLNo2H68TGqwRlFXi9sShQIc+TFNkdzwlV8DbpotK2i9K\nT8Nb9qzIpMPjNegwzCDvMj1G\n-----END PRIVATE KEY-----\n",
  "client_email": "gourav-garg@page-speed-1621406024826.iam.gserviceaccount.com",
  "client_id": "103303072918802201215",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/gourav-garg%40page-speed-1621406024826.iam.gserviceaccount.com"
}));

  const CONFIG = {
    credentials : {
        private_key: CREDENTIALS.private_key,
        client_email: CREDENTIALS.client_email
    }
  }
// Creates a client
const client = new vision.ImageAnnotatorClient(CONFIG);


module.exports.detectText = async (fileName)=>{
  let result;
  try{[result] = await client.textDetection(path.join(`./public/images/users/${fileName}`));}
  catch(err){console.log(err)};
  const detections = result.textAnnotations.map((detection)=>{
    return detection.description.toLowerCase();
  });
  return detections;
}

module.exports.getRequired=(stringArr,requiredLabel)=>{
  let resArr = [];
    const finalResult = stringArr
    .filter((str)=>{
      if(str.indexOf(requiredLabel)>-1)
        return true;
      else
        return false;
    })
    .map((str)=>{
      return str.substring(str.indexOf(requiredLabel));
    })
    .forEach((str)=>{
      const arr = str.replaceAll('\n',' ').replaceAll(requiredLabel,'').replaceAll(':','').split(',');
      resArr.push(...arr);
    });
    resArr = resArr.join(',').split('.')[0].split(',');   
    return resArr;
}