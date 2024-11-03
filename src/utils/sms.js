import axios from 'axios';

// export const sendOtp = async (mobile, otp) => {
//   const headers = {
//     'Content-Type': 'application/json',
//   };
//   const body = {
//     username: process.env.SMS_Samantel_Username,
//     password: process.env.SMS_Samantel_Password,
//     method: 'send',
//     messages: [
//       {
//         sender: '989999999000',
//         recipient: mobile,
//         body: 'سامانتل - کد تایید شما : ' + otp,
//         customerId: mobile,
//       },
//     ],
//   };
//   axios
//     .post(`https://sms.samantel.ir/services/rest/index.php`, body, {
//       headers: headers,
//     })
//     .then(() => {})
//     .catch(() => {});
// };

export const sendOtp = async (mobile, otp) => {
  let creatToken = await createToken();
  const headers = {
    'Content-Type': 'application/json',
    'x-sms-ir-secure-token': creatToken.TokenKey,
  };
  const body = {
    Code: otp,
    MobileNumber: mobile,
  };
  axios
    .post(`https://RestfulSms.com/api/VerificationCode`, body, {
      headers: headers,
    })
    .then(() => {})
    .catch(() => {});
};

const createToken = async () => {
  const { data } = await axios.post(`https://RestfulSms.com/api/Token`, {
    headers: {
      'Content-Type': 'application/json',
    },
    UserApiKey: process.env.SMS_Smsir_UserApiKey,
    SecretKey: process.env.SMS_Smsir_SecretKey,
  });
  return data;
};
