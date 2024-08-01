/* eslint-disable max-len */
const createAccountOtp = (otp) => {
  return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">

          <table style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
              <tr>
                  <td style="text-align: center;">
                  <p style="font-size: 12px; font-weight: bold; margin: 5px 0;"> RENTSPACE.</p>
                  </td>
              </tr>
              <tr>
                  <td style="text-align: center; margin: 20px 0;">
                      <p style="font-size: 24px; font-weight: bold;">Email OTP Verification</p>
                      <p style="color: #475467; font-size: 16px;"> This OTP is valid for 30 minutes. Please do not share this code with anyone.</p>
                      <div style="background-color: #F2F4F7; font-size: 24px; padding: 10px 30px; border-radius: 20px; display: inline-block;">${otp}</div>
                      <p style="font-size: 12px; margin: 5px 0;">This email was sent to you because you signed up for a RentSpace account. If you did not sign up for an account, please ignore this email.</p>
                      <p style="font-size: 12px; font-weight: bold; margin: 10px 0;">Thank You </p>
                  </td>
              </tr>
              <tr>
                  <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">
                       
                      <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">© 2024 RentSpace. All rights reserved.</p>
                      <p style="font-size: 12px; margin: 5px 0;">Follow us</p>
                      <a href="https://www.instagram.com/rentspacetech/">
                        <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
                      </a>
                      <a href="https://www.linkedin.com/company/rentspace.tech/">
                        <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
                      </a>
                      <a href="https://twitter.com/rentspacetech">
                        <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
                      </a>
                  </td>
              </tr>
          </table>
      
      </body>`;
};
const resetPinMailOTP = (otp) => {
  return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">
  
            <table style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
                <tr>
                    <td style="text-align: center;">
                    <p style="font-size: 12px; font-weight: bold; margin: 5px 0;"> RENTSPACE.</p>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center; margin: 20px 0;">
                        <p style="font-size: 24px; font-weight: bold;">Reset PIN OTP Verification</p>
                        <p style="color: #475467; font-size: 16px;"> This OTP is valid for 30 minutes. Please do not share this code with anyone.</p>
                        <div style="background-color: #F2F4F7; font-size: 24px; padding: 10px 30px; border-radius: 20px; display: inline-block;">${otp}</div>
                        <p style="font-size: 12px; margin: 5px 0;">This email was sent to you because you tried to reset your Rentspace Transaction Pin. If you did not attempt any pin change for your account, please ignore this email.</p>
                        <p style="font-size: 12px; font-weight: bold; margin: 10px 0;">Thank You </p>
                    </td>
                </tr>
              <tr>
                  <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">
                       
                      <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">© 2024 RentSpace. All rights reserved.</p>
                      <p style="font-size: 12px; margin: 5px 0;">Follow us</p>
                      <a href="https://www.instagram.com/rentspacetech/">
                        <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
                      </a>
                      <a href="https://www.linkedin.com/company/rentspace.tech/">
                        <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
                      </a>
                      <a href="https://twitter.com/rentspacetech">
                        <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
                      </a>
                  </td>
              </tr>
            </table>
        
        </body>`;
};
/* eslint-disable max-len */
const resetPasswordOtp = (otp) => {
  return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">

          <table style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
              <tr>
                  <td style="text-align: center;">
                  <p style="font-size: 12px; font-weight: bold; margin: 5px 0;"> RENTSPACE.</p>
                  </td>
              </tr>
              <tr>
                  <td style="text-align: center; margin: 20px 0;">
                      <p style="font-size: 24px; font-weight: bold;">Reset Password OTP Verification</p>
                      <p style="color: #475467; font-size: 16px;"> This OTP is valid for 2 minutes. Please do not share this code with anyone.</p>
                      <div style="background-color: #F2F4F7; font-size: 24px; padding: 10px 30px; border-radius: 20px; display: inline-block;">${otp}</div>
                      <p style="font-size: 12px; margin: 5px 0;">This email was sent to you because you tried to change your Rentspace account password. If you did not attempt any password change for your account, please ignore this email.</p>
                      <p style="font-size: 12px; font-weight: bold; margin: 10px 0;">Thank You </p>
                  </td>
              </tr>
              <tr>
                  <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">
                       
                      <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">© 2024 RentSpace. All rights reserved.</p>
                      <p style="font-size: 12px; margin: 5px 0;">Follow us</p>
                      <a href="https://www.instagram.com/rentspacetech/">
                        <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
                      </a>
                      <a href="https://www.linkedin.com/company/rentspace.tech/">
                        <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
                      </a>
                      <a href="https://twitter.com/rentspacetech">
                        <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
                      </a>
                  </td>
              </tr>
          </table>
      
      </body>`;
};

const fundWalletMessage = (name) => {
  return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">

  <table style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
      <tr>
          <td style="text-align: center;">
          <p style="font-size: 12px; font-weight: bold; margin: 5px 0;"> RENTSPACE.</p>
          </td>
      </tr>
      <tr>
          <td style="text-align: center; margin: 20px 0;">
              <p style="font-size: 24px; font-weight: bold;">Space Rent Funding</p>
              <p style="color: #475467; font-size: 16px;">Hello <strong>${name}</strong> . This is to notify you that your Space Rent Account has been deleted due to insufficient funds.Please fund your Space Rent wallet and create a new Space Rent to continue using the service.</p>
              <div style="background-color: #F2F4F7; font-size: 24px; padding: 10px 30px; border-radius: 20px; display: inline-block;"> <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://rentspace.tech/wp-content/uploads/2023/03/logo2.png" alt="Rentspace"></div>
              <p style="font-size: 12px; margin: 5px 0;">This email was sent to you because you tried to create a Space Rent account but couldn't be completed due to insufficient funds. If you did not attempt any space rent create on your account, please ignore this email.</p>
        
          </td>
      </tr>
      <tr>
          <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">
               
              <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">© 2024 RentSpace. All rights reserved.</p>
              <p style="font-size: 12px; margin: 5px 0;">Follow us</p>
              <a href="https://www.instagram.com/rentspacetech/">
                <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
              </a>
              <a href="https://www.linkedin.com/company/rentspace.tech/">
                <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
              </a>
              <a href="https://twitter.com/rentspacetech">
                <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
              </a>
          </td>
      </tr>
  </table>

</body>`;
};
const failedDebit = (name, amount, rentName) => {
  return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">

  <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <tr>
          <td style="text-align: center;">
              <p style="font-size: 12px; font-weight: bold; margin: 5px 0; color: #000;">RENTSPACE.</p>
          </td>
      </tr>
      <tr>
          <td style="text-align: center; padding: 20px 0;">
              <p style="font-size: 24px; font-weight: bold; color: #000;">Space Rent Funding</p>
              <p style="color: #475467; font-size: 16px;">Hello <strong>${name}</strong>,</p>
              <p style="color: #475467; font-size: 16px;">This is to notify you that your payment of <strong>${amount.toLocaleString(
                "en-NG",
                { style: "currency", currency: "NGN" }
              )}</strong> on Space Rent <strong>${rentName}</strong> failed due to insufficient funds in your wallet. Please top up your wallet to continue using our services.</p>
              <div style="background-color: #F2F4F7; font-size: 24px; padding: 10px 30px; border-radius: 20px; display: inline-block; margin: 20px 0;">
                  <img style="width: 40px; margin: 0 2px; display: inline-block;" src="https://rentspace.tech/wp-content/uploads/2023/03/logo2.png" alt="Rentspace">
              </div>
              <p style="font-size: 12px; margin: 5px 0; color: #475467;">This email was sent to you because you tried to pay for your rent but couldn't complete the transaction due to insufficient funds. If you did not attempt any space rent create on your account, please ignore this email.</p>
              <p style="color: #475467;">Thank you for choosing Rentspace Tech.</p>
              <p style="color: #475467;">Best Regards,</p>
              <p style="color: #475467;">The Rentspace Tech Team</p>
          </td>
      </tr>
      <tr>
          <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">
              <p style="font-size: 12px; font-weight: bold; margin: 5px 0; color: #000;">© 2024 RentSpace. All rights reserved.</p>
              <p style="font-size: 12px; margin: 5px 0; color: #475467;">Follow us</p>
              <a href="https://www.instagram.com/rentspacetech/" style="text-decoration: none; margin: 0 5px;">
                <img style="width: 20px; display: inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
              </a>
              <a href="https://www.linkedin.com/company/rentspace.tech/" style="text-decoration: none; margin: 0 5px;">
                <img style="width: 20px; display: inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
              </a>
              <a href="https://twitter.com/rentspacetech" style="text-decoration: none; margin: 0 5px;">
                <img style="width: 20px; display: inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
              </a>
          </td>
      </tr>
  </table>
</body>`;
};

const successfulDebit = (name, amount, rentName) => {
  return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">

  <table style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
      <tr>
          <td style="text-align: center;">
              <p style="font-size: 12px; font-weight: bold; margin: 5px 0;"> RENTSPACE.</p>
          </td>
      </tr>
      <tr>
          <td style="text-align: center; margin: 20px 0;">
              <p style="font-size: 24px; font-weight: bold;">Space Rent Funding</p>
              <p style="color: #475467; font-size: 16px;">Hello <strong>${name}</strong>,</p>
              <p style="color: #475467; font-size: 16px;">This is to notify you that your payment of <strong>${amount.toLocaleString(
                "en-NG",
                { style: "currency", currency: "NGN" }
              )}</strong> for Space Rent <strong>${rentName}</strong> was successful. Thank you for using our services.</p>
              <div style="background-color: #F2F4F7; font-size: 24px; padding: 10px 30px; border-radius: 20px; display: inline-block;">
                  <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://rentspace.tech/wp-content/uploads/2023/03/logo2.png" alt="Rentspace">
              </div>
              <p style="font-size: 12px; margin: 5px 0;">This email was sent to you because you made a payment for your Space Rent. If you did not make this payment, please contact our support immediately.</p>
              <p style="color: #475467;">Thank you for choosing Rentspace Tech.</p>
              <p style="color: #475467;">Best Regards,</p>
              <p style="color: #475467;">The Rentspace Tech Team</p>
          </td>
      </tr>
      <tr>
          <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">
              <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">© 2024 RentSpace. All rights reserved.</p>
              <p style="font-size: 12px; margin: 5px 0;">Follow us</p>
              <a href="https://www.instagram.com/rentspacetech/">
                <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
              </a>
              <a href="https://www.linkedin.com/company/rentspace.tech/">
                <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
              </a>
              <a href="https://twitter.com/rentspacetech">
                <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
              </a>
          </td>
      </tr>
  </table>

</body>`;
};

const upcomingRentPayment = (name, amount, rentName, nextDate) => {
  return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">

  <table style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
      <tr>
          <td style="text-align: center;">
          <p style="font-size: 12px; font-weight: bold; margin: 5px 0;"> RENTSPACE.</p>
          </td>
      </tr>
      <tr>
          <td style="text-align: center; margin: 20px 0;">
              <p style="font-size: 24px; font-weight: bold;">Space Rent Funding</p>
              <p style="color: #475467; font-size: 16px;">Dear <strong>${name}</strong> . This is to notify you that your next Space Rent Payment of <strong>${amount.toLocaleString(
    "en-NG",
    { style: "currency", currency: "NGN" }
  )}</strong> for <strong>${rentName}</strong> is coming up on <strong>${nextDate}</strong> . </p>
              <div style="background-color: #F2F4F7; font-size: 24px; padding: 10px 30px; border-radius: 20px; display: inline-block;"> <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://rentspace.tech/wp-content/uploads/2023/03/logo2.png" alt="Rentspace"></div>
 
        
          </td>
      </tr>
      <tr>
          <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">
               
              <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">© 2024 RentSpace. All rights reserved.</p>
              <p style="font-size: 12px; margin: 5px 0;">Follow us</p>
              <a href="https://www.instagram.com/rentspacetech/">
                <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
              </a>
              <a href="https://www.linkedin.com/company/rentspace.tech/">
                <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
              </a>
              <a href="https://twitter.com/rentspacetech">
                <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
              </a>
          </td>
      </tr>
  </table>

</body>`;
};
const addCardMessage = (name) => {
  return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">

  <table style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
      <tr>
          <td style="text-align: center;">
          <p style="font-size: 12px; font-weight: bold; margin: 5px 0;"> RENTSPACE.</p>
          </td>
      </tr>
      <tr>
          <td style="text-align: center; margin: 20px 0;">
              <p style="font-size: 24px; font-weight: bold;">Space Rent Funding</p>
              <p style="color: #475467; font-size: 16px;">Hello ${name} . This is to notify you that your Space Rent Account has been deleted due to inactive payment status.Please and create a new Space Rent make your first payment to continue using the service.</p>
              <div style="background-color: #F2F4F7; font-size: 24px; padding: 10px 30px; border-radius: 20px; display: inline-block;"><img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://rentspace.tech/wp-content/uploads/2023/03/logo2.png" alt="Rentspace"></div>
              <p style="font-size: 12px; margin: 5px 0;">This email was sent to you because you tried to create a Space Rent account but couldn't be completed due to inactive payment status. If you did not attempt any space rent create on your account, please ignore this email.</p>
        
          </td>
      </tr>
      <tr>
          <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">
               
              <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">© 2024 RentSpace. All rights reserved.</p>
              <p style="font-size: 12px; margin: 5px 0;">Follow us</p>
              <a href="https://www.instagram.com/rentspacetech/">
                <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
              </a>
              <a href="https://www.linkedin.com/company/rentspace.tech/">
                <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
              </a>
              <a href="https://twitter.com/rentspacetech">
                <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
              </a>
          </td>
      </tr>
  </table>

</body>`;
};

// Report acknpwledgement email
const reportSent = (
  username,
  complaintCategory,
  subject,
  email,
  description,
  imageUrl
) => {
  return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">
  
      <table style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
          <tr>
              <td style="text-align: center;">
              <p style="font-size: 12px; font-weight: bold; margin: 5px 0;"> RENTSPACE.</p>
              </td>
          </tr>
          <tr>
              <td style="text-align: center; margin: 20px 0;">
                  <p style="font-size: 24px; font-weight: bold;">Rentspace support</p>
                  <p style="color: #475467; font-size: 16px;"> Customer Complaint 📣.</p>
                  <p style="font-size: 12px; margin: 5px 0;"> A customer has reported an issue. Here are the details:.</p>
                  <ul style="list-style: none; padding: 0; margin: 10px 0;">
                  <li style="font-size: 14px; color: #475467;">Customer Name: ${username} </li>
                  <li style="font-size: 14px; color: #475467;">Email: ${email} </li>
                  <li style="font-size: 14px; color: #475467;">Subject: ${subject} </li>
                  <li style="font-size: 14px; color: #475467;">Complaint Category: ${complaintCategory} </li>
                  <li style="font-size: 14px; color: #475467;">Description: ${description}.</li>
                  <li style="font-size: 14px; color: #475467;">Image: <img src="${imageUrl}" alt="Customer Report Image" style="max-width: 100%;"></li>
              </ul>
            
              </td>
          </tr>
              <tr>
                  <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">
                       
                      <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">© 2024 RentSpace. All rights reserved.</p>
                      <p style="font-size: 12px; margin: 5px 0;">Follow us</p>
                      <a href="https://www.instagram.com/rentspacetech/">
                        <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
                      </a>
                      <a href="https://www.linkedin.com/company/rentspace.tech/">
                        <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
                      </a>
                      <a href="https://twitter.com/rentspacetech">
                        <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
                      </a>
                  </td>
              </tr>
  </table>
  
  </body>`;
};

const reportReceived = (username) => {
  return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">

    <table style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
        <tr>
            <td style="text-align: center;">
            <p style="font-size: 12px; font-weight: bold; margin: 5px 0;"> RENTSPACE.</p>
            </td>
        </tr>
        <tr>
            <td style="text-align: center; margin: 20px 0;">
                <p style="font-size: 24px; font-weight: bold;">Hi 👋 ${username}</p>
                <p style="color: #475467; font-size: 16px;"> We have received your report and we are working on it. We will get back to you as soon as possible.</p>
                <p style="font-size: 12px; margin: 5px 0;">This email was sent to you because you reported an issue to us. If you did not report any issue, please ignore this email.</p>
          
            </td>
        </tr>
              <tr>
                  <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">
                       
                      <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">© 2024 RentSpace. All rights reserved.</p>
                      <p style="font-size: 12px; margin: 5px 0;">Follow us</p>
                      <a href="https://www.instagram.com/rentspacetech/">
                        <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
                      </a>
                      <a href="https://www.linkedin.com/company/rentspace.tech/">
                        <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
                      </a>
                      <a href="https://twitter.com/rentspacetech">
                        <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
                      </a>
                  </td>
              </tr>
</table>

</body>`;
};

const transfer = (username, amount, walletBalance, description, date) => {
  return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
      <tr>
          <td>
          <a href="#"><img src="https://res.cloudinary.com/dqwulfc1j/image/upload/v1712389084/xedb0gztjo08ndbicozk.png" alt="" style="display: block; margin: 20px auto 20px; height:80px"></a>
              <p style="font-size: 14px; font-weight: bold; margin-bottom: 20px;">Dear ${username},</p>
              <p style="font-size: 14px; margin-bottom: 10px;">Your transfer of ₦${amount} is successful, Your Available Balance is ₦${walletBalance}</p>
              <p style="font-size: 14px; font-weight: bold; margin-bottom: 10px;">Transfer Details:</p>
              <p style="font-size: 14px; margin-bottom: 10px;">Transfer Description: </p>
              <p style="font-size: 14px; font-weight: bold; margin-left: 20px;">${description}</p>
              <p style="font-size: 14px; margin-bottom: 10px;">Date: </p>
              <p style="font-size: 14px; font-weight: bold; margin-left: 20px; margin-bottom: 20px">${date}</p>
          </td>
      </tr>
      <tr>
          <td>
              <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">For further enquiries, please contact our customer support through the following channels:</p>
              <p style="font-size: 12px; margin-bottom: 10px;">Email: <a href="mailto:customerservice@opay-inc.com">support@rentspace.tech</a></p>
          </td>
      </tr>
      <tr>
          <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">
              <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">© 2024 RentSpace. All rights reserved.</p>
              <p style="font-size: 12px; margin: 5px 0;">Follow us</p>
              <a href="https://www.instagram.com/rentspacetech/">
                  <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
              </a>
              <a href="https://www.linkedin.com/company/rentspace.tech/">
                  <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
              </a>
              <a href="https://twitter.com/rentspacetech">
                  <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
              </a>
          </td>
      </tr>
  </table>
</body>
`;
};

const walletFunding = (username, amount, description, date) => {
  return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
      <tr>
          <td>
              <a href="#"><img src="https://res.cloudinary.com/dqwulfc1j/image/upload/v1712389084/xedb0gztjo08ndbicozk.png" alt="" style="display: block; margin: 20px auto 20px; height:80px"></a>

              <p style="font-size: 14px; font-weight: bold; margin-bottom: 20px;">Hello ${username},</p>
              <p style="font-size: 14px; margin-bottom: 10px;">Your RentSpace Wallet has been credited successfully,</p>
              <p style="font-size: 14px; font-weight: bold; margin-bottom: 10px;">Details Below</p>
              <p style="font-size: 14px; margin-bottom: 10px;">Amount: </p>
              <p style="font-size: 14px; font-weight: bold; margin-left: 20px;"> ₦${amount}</p>
              <p style="font-size: 14px; margin-bottom: 10px;">Description: </p>
              <p style="font-size: 14px; font-weight: bold; margin-left: 20px;"> Space Wallet Funding From ${description}</p>
              <p style="font-size: 14px; margin-bottom: 10px;">Date: </p>
              <p style="font-size: 14px; font-weight: bold; margin-left: 20px; margin-bottom: 20px">${date}</p>
          </td>
      </tr>
      <tr>
          <td>
              <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">For further enquiries, please contact our customer support through the following channels:</p>
              <p style="font-size: 12px; margin-bottom: 10px;">Email: <a href="mailto:customerservice@opay-inc.com">support@rentspace.tech</a></p>
          </td>
      </tr>
      <tr>
          <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">
              <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">© 2024 RentSpace. All rights reserved.</p>
              <p style="font-size: 12px; margin: 5px 0;">Follow us</p>
              <a href="https://www.instagram.com/rentspacetech/">
                  <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
              </a>
              <a href="https://www.linkedin.com/company/rentspace.tech/">
                  <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
              </a>
              <a href="https://twitter.com/rentspacetech">
                  <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
              </a>
          </td>
      </tr>
  </table>

</body>

`;
};


const welcomeMail = (username) => {
  return `
  <center>
    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="background-color: rgb(234, 236, 226);">
      <tbody>
        <tr>
          <td class="bodyCell" align="center" valign="top">
            <table id="root" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tbody data-block-id="14" class="mceWrapper">
                <tr>
                  <td align="center" valign="top" class="mceWrapperOuter">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation">
                      <tbody>
                        <tr>
                          <td style="background-color:#d2c3b1;background-position:center;background-repeat:no-repeat;background-size:cover" class="mceWrapperInner" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="13">
                              <tbody>
                                <tr class="mceRow">
                                  <td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td style="padding-top:0;padding-bottom:0" class="mceColumn" data-block-id="-13" valign="top" colspan="12" width="100%">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td style="background-color:#ffffff;padding-top:12px;padding-bottom:12px;padding-right:0;padding-left:0" class="mceBlockContainer" align="center" valign="top">
                                                    <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0">
                                                      <img data-block-id="4" width="564" height="auto" style="width:564px;height:auto;max-width:1940px !important;display:block" alt="" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/83e6a34d-7ba0-abf5-089b-bca58a21408a.jpg" role="presentation" class="imageDropZone mceImage"/>
                                                    </span>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0" valign="top">
                                                    <table width="100%" style="border:0;background-color:#ffffff;border-collapse:separate">
                                                      <tbody>
                                                        <tr>
                                                          <td style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px" class="mceTextBlockContainer">
                                                            <div data-block-id="5" class="mceText" id="dataBlockId-5" style="width:100%">
                                                              <p><br/></p>
                                                              <p style="text-align: left;">Dear ${username},</p>
                                                              <p style="text-align: left;">We're excited to have you with us. At RentSpace, we understand how important it is to have a secure and comfortable home. We help you save for rent, manage your finances, and achieve financial freedom.</p>
                                                              <h3>What You Can Do with RentSpace:</h3>
                                                              <ul>
                                                                <li style="text-align: left;"><p style="text-align: left;"><strong>Set Savings Goals</strong>: Track your rent savings targets.</p></li>
                                                                <li style="text-align: left;"><p style="text-align: left;"><strong>Automate Savings</strong>: Schedule automatic transfers.</p></li>
                                                                <li style="text-align: left;"><p style="text-align: left;"><strong>Monitor Progress</strong>: See your savings progress and milestones.</p></li>
                                                                <li style="text-align: left;"><p style="text-align: left;"><strong>Get Tips and Advice</strong>: Access financial tips and advice.</p></li>
                                                                <li style="text-align: left;"><p style="text-align: left;"><strong>Community Support</strong>: Connect with others on the same journey.</p></li>
                                                              </ul>
                                                              <p style="text-align: left;">We believe in the peace of mind that comes with knowing your rent is covered. Let’s achieve your financial goals together. Need help? Our support team is here for you anytime.</p>
                                                              <p style="text-align: left;"><strong>Complete your profile now to start saving immediately and take control of your financial future!</strong></p>
                                                              <p style="text-align: left;"><br/></p>
                                                              <p style="text-align: left;">Welcome aboard!</p>
                                                              <p style="text-align: left;">Warm regards,</p>
                                                              <p style="text-align: left;">The RentSpace Team</p>
                                                              <p><br/></p>
                                                              <p><br/></p>
                                                              <p style="text-align: left;" class="last-child"><br/></p>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="background-color:#ffffff;padding-top:0px;padding-bottom:0px;padding-right:24px;padding-left:24px" class="mceBlockContainer" valign="top">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff;" role="presentation" class="mceDividerContainer" data-block-id="39">
                                                      <tbody>
                                                        <tr>
                                                          <td style="min-width:100%;border-top:4px solid #000000;" class="mceDividerBlock" valign="top"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="background-color:#f2f4f7;padding:20px;text-align:center;">
                                                    <div style="margin-top:40px;display:flex;align-items:center;justify-content:space-around;">
                                                      <a href="https://apps.apple.com/ng/app/rentspace-app/id6469376146" style="display:inline-block;" target="_blank" data-block-id="36">
                                                        <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0;">
                                                          <img width="213" height="auto" style="width:180px;height:auto;max-width:200px !important;display:block;border-radius:5px;" alt="" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/540b26b2-be1d-2abb-b35d-24a787d828e3.jpeg" role="presentation" class="imageDropZone mceImage"/>
                                                        </span>
                                                      </a>
                                                      <a href="https://play.google.com/store/apps/details?id=com.rentspace.app.android" style="display:inline-block;" target="_blank" data-block-id="37">
                                                        <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0;">
                                                          <img width="211" height="auto" style="width:180px;height:auto;max-width:200px !important;display:block;border-radius:5px;" alt="" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/f972bd50-96e3-e36f-06b5-2d177bd79cbb.jpeg" role="presentation" class="imageDropZone mceImage"/>
                                                        </span>
                                                      </a>
                                                    </div>
                                                    <img style="width:100px;margin:20px 0 5px;display:inline-block;" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/2f8f4f1e-3782-075b-b06f-7adabf3e9a1f.png" alt="Rentspace"/>
                                                    <p style="font-size:12px;font-weight:bold;margin:5px 0;">© 2024 RentSpace. All rights reserved.</p>
                                                    <p style="font-size:12px;margin:25px 5px 15px 5px;">Follow us</p>
                                                    <a href="https://www.facebook.com/profile.php?id=100083035015197&mibextid=LQQJ4d">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://cdn-images.mailchimp.com/icons/social-block-v3/block-icons-v3/facebook-filled-color-40.png" alt="Facebook"/>
                                                    </a>
                                                    <a href="https://www.instagram.com/rentspacetech?igsh=MXZwOWkzbjZrZml4dA%3D%3D&utm_source=qr">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram"/>
                                                    </a>
                                                    <a href="https://www.linkedin.com/company/rentspace.tech/">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn"/>
                                                    </a>
                                                    <a href="https://x.com/rentspacetech?s=21&t=qAAMl7hG_1Pl2RuSPJdU-w">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter"/>
                                                    </a>
                                                    <p style="font-size:12px;font-weight:bold;margin:5px 0;">For further enquiries, please contact our customer support through our mail:</p>
                                                    <a href="mailto:support@rentspace.tech" style="font-size:12px;font-weight:bold;margin:5px 0;">support@rentspace.tech</a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </center>`;
};

const getStarted = (username) => {
  return `
  <center>
    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="background-color: rgb(234, 236, 226);">
      <tbody>
        <tr>
          <td class="bodyCell" align="center" valign="top">
            <table id="root" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tbody data-block-id="14" class="mceWrapper">
                <tr>
                  <td align="center" valign="top" class="mceWrapperOuter">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation">
                      <tbody>
                        <tr>
                          <td style="background-color:#d2c3b1;background-position:center;background-repeat:no-repeat;background-size:cover" class="mceWrapperInner" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="13">
                              <tbody>
                                <tr class="mceRow">
                                  <td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td style="padding-top:0;padding-bottom:0" class="mceColumn" data-block-id="-13" valign="top" colspan="12" width="100%">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td style="background-color:#ffffff;padding-top:12px;padding-bottom:12px;padding-right:0;padding-left:0" class="mceBlockContainer" align="center" valign="top">
                                                    <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0">
                                                      <img data-block-id="4" width="564" height="auto" style="width:564px;height:auto;max-width:1940px !important;display:block" alt="" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/83e6a34d-7ba0-abf5-089b-bca58a21408a.jpg" role="presentation" class="imageDropZone mceImage"/>
                                                    </span>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0" valign="top">
                                                    <table width="100%" style="border:0;background-color:#ffffff;border-collapse:separate">
                                                      <tbody>
                                                        <tr>
                                                          <td style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px" class="mceTextBlockContainer">
                                                            <div data-block-id="5" class="mceText" id="dataBlockId-5" style="width:100%">
                                                              <p><br/></p>
                                                              <p style="text-align: left;">Dear ${username},</p>
                                                              <p style="text-align: left;">Introducing SpaceRent - Your Key to Easy Rent Savings</p>
                                                              <p style="text-align: left;">I’m excited to introduce SpaceRent, our flagship feature designed to make saving for rent both simple and stress-free.</p>
                                                              <h3>Save 70% of Your Rent:</h3>
                                                              <ul>
                                                                <li style="text-align: left;"><p style="text-align: left;"><strong>In just 5 to 8 months, you’ll have saved a substantial portion of your rent.</strong></p></li>
                                                                <li style="text-align: left;"><p style="text-align: left;"><strong>Automatic Savings:</strong> Set it and forget it - we’ll handle the rest.</p></li>
                                                                <li style="text-align: left;"><p style="text-align: left;"><strong>Get a Loan for the Rest:</strong> Need a little extra? Apply for a loan directly in the app.</p></li>
                                                              </ul>
                                                              <p style="text-align: left;">Create your first SpaceRent plan today and take control of your rent savings.</p>
                                                              <p style="text-align: left;"><br/></p>
                                                              <p style="text-align: left;">Cheers,</p>
                                                              <p style="text-align: left;">The RentSpace Team</p>
                                                              <p><br/></p>
                                                              <p><br/></p>
                                                              <p style="text-align: left;" class="last-child"><br/></p>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="background-color:#ffffff;padding-top:0px;padding-bottom:0px;padding-right:24px;padding-left:24px" class="mceBlockContainer" valign="top">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff;" role="presentation" class="mceDividerContainer" data-block-id="39">
                                                      <tbody>
                                                        <tr>
                                                          <td style="min-width:100%;border-top:4px solid #000000;" class="mceDividerBlock" valign="top"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="background-color:#f2f4f7;padding:20px;text-align:center;">
                                                    <div style="margin-top:40px;display:flex;align-items:center;justify-content:space-around;">
                                                      <a href="https://apps.apple.com/ng/app/rentspace-app/id6469376146" style="display:inline-block;" target="_blank" data-block-id="36">
                                                        <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0;">
                                                          <img width="213" height="auto" style="width:180px;height:auto;max-width:200px !important;display:block;border-radius:5px;" alt="" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/540b26b2-be1d-2abb-b35d-24a787d828e3.jpeg" role="presentation" class="imageDropZone mceImage"/>
                                                        </span>
                                                      </a>
                                                      <a href="https://play.google.com/store/apps/details?id=com.rentspace.app.android" style="display:inline-block;" target="_blank" data-block-id="37">
                                                        <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0;">
                                                          <img width="211" height="auto" style="width:180px;height:auto;max-width:200px !important;display:block;border-radius:5px;" alt="" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/f972bd50-96e3-e36f-06b5-2d177bd79cbb.jpeg" role="presentation" class="imageDropZone mceImage"/>
                                                        </span>
                                                      </a>
                                                    </div>
                                                    <img style="width:100px;margin:20px 0 5px;display:inline-block;" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/2f8f4f1e-3782-075b-b06f-7adabf3e9a1f.png" alt="Rentspace"/>
                                                    <p style="font-size:12px;font-weight:bold;margin:5px 0;">© 2024 RentSpace. All rights reserved.</p>
                                                    <p style="font-size:12px;margin:25px 5px 15px 5px;">Follow us</p>
                                                    <a href="https://www.facebook.com/profile.php?id=100083035015197&mibextid=LQQJ4d">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://cdn-images.mailchimp.com/icons/social-block-v3/block-icons-v3/facebook-filled-color-40.png" alt="Facebook"/>
                                                    </a>
                                                    <a href="https://www.instagram.com/rentspacetech?igsh=MXZwOWkzbjZrZml4dA%3D%3D&utm_source=qr">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram"/>
                                                    </a>
                                                    <a href="https://www.linkedin.com/company/rentspace.tech/">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn"/>
                                                    </a>
                                                    <a href="https://x.com/rentspacetech?s=21&t=qAAMl7hG_1Pl2RuSPJdU-w">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter"/>
                                                    </a>
                                                    <p style="font-size:12px;font-weight:bold;margin:5px 0;">For further enquiries, please contact our customer support through our mail:</p>
                                                    <a href="mailto:support@rentspace.tech" style="font-size:12px;font-weight:bold;margin:5px 0;">support@rentspace.tech</a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </center>`;
};

const reminderMailForBVNVerification = (username) => {
  return `
  <center>
    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="background-color: rgb(234, 236, 226);">
      <tbody>
        <tr>
          <td class="bodyCell" align="center" valign="top">
            <table id="root" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tbody data-block-id="14" class="mceWrapper">
                <tr>
                  <td align="center" valign="top" class="mceWrapperOuter">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation">
                      <tbody>
                        <tr>
                          <td style="background-color:#d2c3b1;background-position:center;background-repeat:no-repeat;background-size:cover" class="mceWrapperInner" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="13">
                              <tbody>
                                <tr class="mceRow">
                                  <td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td style="padding-top:0;padding-bottom:0" class="mceColumn" data-block-id="-13" valign="top" colspan="12" width="100%">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td style="background-color:#ffffff;padding-top:12px;padding-bottom:12px;padding-right:0;padding-left:0" class="mceBlockContainer" align="center" valign="top">
                                                    <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0">
                                                      <!-- Image removed -->
                                                    </span>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0" valign="top">
                                                    <table width="100%" style="border:0;background-color:#ffffff;border-collapse:separate">
                                                      <tbody>
                                                        <tr>
                                                          <td style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px" class="mceTextBlockContainer">
                                                            <div data-block-id="5" class="mceText" id="dataBlockId-5" style="width:100%">
                                                              <p><br/></p>
                                                              <p style="text-align: left;">Hi ${username},</p>
                                                              <p style="text-align: left;">Welcome to RentSpace! We're excited to have you on board. To get started and make the most out of your RentSpace experience, please verify your account.</p>
                                                              <p style="text-align: left;">By verifying your account with your BVN, you'll unlock access to a Virtual bank account, making it easy to fund your wallet and start your journey towards hassle-free rent payments.</p>
                                                              <p style="text-align: left;">If you have any questions or need assistance, feel free to reach out to our support team via <a href="mailto:support@rentspace.tech">support@rentspace.tech</a>.</p>
                                                              <p style="text-align: left;">Happy saving!</p>
                                                              <p style="text-align: left;">The RentSpace Team</p>
                                                              <p><br/></p>
                                                              <p style="text-align: left;"><strong>P.S.</strong> Verified accounts get a head start on earning SpacePoints!</p>
                                                              <p style="text-align: left;"><a href="https://rentspace.tech/blog/tips-for-successful-saving-on-spacerent" style="color: #4CAF50;">Tips for Successful Saving on SpaceRent</a></p>
                                                              <p style="text-align: left;"><a href="https://rentspace.tech/rentspace-community/" style="color: #4CAF50;">Join the RentSpace Community</a></p>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="background-color:#ffffff;padding-top:0px;padding-bottom:0px;padding-right:24px;padding-left:24px" class="mceBlockContainer" valign="top">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff;" role="presentation" class="mceDividerContainer" data-block-id="39">
                                                      <tbody>
                                                        <tr>
                                                          <td style="min-width:100%;border-top:4px solid #000000;" class="mceDividerBlock" valign="top"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="background-color:#f2f4f7;padding:20px;text-align:center;">
                                                    <div style="margin-top:40px;display:flex;align-items:center;justify-content:space-around;">
                                                      <a href="https://apps.apple.com/ng/app/rentspace-app/id6469376146" style="display:inline-block;" target="_blank" data-block-id="36">
                                                        <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0;">
                                                          <img width="213" height="auto" style="width:180px;height:auto;max-width:200px !important;display:block;border-radius:5px;" alt="" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/540b26b2-be1d-2abb-b35d-24a787d828e3.jpeg" role="presentation" class="imageDropZone mceImage"/>
                                                        </span>
                                                      </a>
                                                      <a href="https://play.google.com/store/apps/details?id=com.rentspace.app.android" style="display:inline-block;" target="_blank" data-block-id="37">
                                                        <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0;">
                                                          <img width="211" height="auto" style="width:180px;height:auto;max-width:200px !important;display:block;border-radius:5px;" alt="" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/f972bd50-96e3-e36f-06b5-2d177bd79cbb.jpeg" role="presentation" class="imageDropZone mceImage"/>
                                                        </span>
                                                      </a>
                                                    </div>
                                                    <img style="width:100px;margin:20px 0 5px;display:inline-block;" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/2f8f4f1e-3782-075b-b06f-7adabf3e9a1f.png" alt="Rentspace"/>
                                                    <p style="font-size:12px;font-weight:bold;margin:5px 0;">© 2024 RentSpace. All rights reserved.</p>
                                                    <p style="font-size:12px;margin:25px 5px 15px 5px;">Follow us</p>
                                                    <a href="https://www.facebook.com/profile.php?id=100083035015197&mibextid=LQQJ4d">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://cdn-images.mailchimp.com/icons/social-block-v3/block-icons-v3/facebook-filled-color-40.png" alt="Facebook"/>
                                                    </a>
                                                    <a href="https://www.instagram.com/rentspacetech?igsh=MXZwOWkzbjZrZml4dA%3D%3D&utm_source=qr">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram"/>
                                                    </a>
                                                    <a href="https://www.linkedin.com/company/rentspace.tech/">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn"/>
                                                    </a>
                                                    <a href="https://x.com/rentspacetech?s=21&t=qAAMl7hG_1Pl2RuSPJdU-w">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter"/>
                                                    </a>
                                                    <p style="font-size:12px;font-weight:bold;margin:5px 0;">For further enquiries, please contact our customer support through our mail:</p>
                                                    <a href="mailto:support@rentspace.tech" style="font-size:12px;font-weight:bold;margin:5px 0;">support@rentspace.tech</a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </center>`;
};

const reminderMailForSpaceRent = (username) => {
  return `
  <center>
    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="background-color: rgb(234, 236, 226);">
      <tbody>
        <tr>
          <td class="bodyCell" align="center" valign="top">
            <table id="root" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tbody data-block-id="14" class="mceWrapper">
                <tr>
                  <td align="center" valign="top" class="mceWrapperOuter">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation">
                      <tbody>
                        <tr>
                          <td style="background-color:#d2c3b1;background-position:center;background-repeat:no-repeat;background-size:cover" class="mceWrapperInner" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="13">
                              <tbody>
                                <tr class="mceRow">
                                  <td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td style="padding-top:0;padding-bottom:0" class="mceColumn" data-block-id="-13" valign="top" colspan="12" width="100%">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td style="background-color:#ffffff;padding-top:12px;padding-bottom:12px;padding-right:0;padding-left:0" class="mceBlockContainer" align="center" valign="top">
                                                    <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0">
                                                      <!-- Image removed -->
                                                    </span>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0" valign="top">
                                                    <table width="100%" style="border:0;background-color:#ffffff;border-collapse:separate">
                                                      <tbody>
                                                        <tr>
                                                          <td style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px" class="mceTextBlockContainer">
                                                            <div data-block-id="5" class="mceText" id="dataBlockId-5" style="width:100%">
                                                              <p><br/></p>
                                                              <p style="text-align: left;">Hi ${username},</p>
                                                              <p style="text-align: left;">We noticed you’re interested in starting a SpaceRent plan – that’s awesome! Now, let’s take the final step to begin your savings journey.</p>
                                                              <p style="text-align: left;">If you have any questions or need help, our support team via <a href="mailto:support@rentspace.tech">support@rentspace.tech</a> is ready to guide you through the process.</p>
                                                              <p style="text-align: left;">Cheers,</p>
                                                              <p style="text-align: left;">The RentSpace Team</p>
                                                              <p><br/></p>
                                                              <p style="text-align: left;"><strong>P.S.</strong> The sooner you start, the sooner you save. Let’s do this!</p>
                                                              <h3>Tips for Successful Saving on SpaceRent</h3>
                                                              <ul>
                                                                <li style="text-align: left;"><p style="text-align: left;">Set a realistic goal.</p></li>
                                                                <li style="text-align: left;"><p style="text-align: left;">Track your progress.</p></li>
                                                                <li style="text-align: left;"><p style="text-align: left;"><a href="https://rentspace.tech/rentspace-community/" style="color: #4CAF50;">Join the RentSpace Community.</p></li>
                                                              </ul>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="background-color:#ffffff;padding-top:0px;padding-bottom:0px;padding-right:24px;padding-left:24px" class="mceBlockContainer" valign="top">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff;" role="presentation" class="mceDividerContainer" data-block-id="39">
                                                      <tbody>
                                                        <tr>
                                                          <td style="min-width:100%;border-top:4px solid #000000;" class="mceDividerBlock" valign="top"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="background-color:#f2f4f7;padding:20px;text-align:center;">
                                                    <div style="margin-top:40px;display:flex;align-items:center;justify-content:space-around;">
                                                      <a href="https://apps.apple.com/ng/app/rentspace-app/id6469376146" style="display:inline-block;" target="_blank" data-block-id="36">
                                                        <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0;">
                                                          <img width="213" height="auto" style="width:180px;height:auto;max-width:200px !important;display:block;border-radius:5px;" alt="" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/540b26b2-be1d-2abb-b35d-24a787d828e3.jpeg" role="presentation" class="imageDropZone mceImage"/>
                                                        </span>
                                                      </a>
                                                      <a href="https://play.google.com/store/apps/details?id=com.rentspace.app.android" style="display:inline-block;" target="_blank" data-block-id="37">
                                                        <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0;">
                                                          <img width="211" height="auto" style="width:180px;height:auto;max-width:200px !important;display:block;border-radius:5px;" alt="" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/f972bd50-96e3-e36f-06b5-2d177bd79cbb.jpeg" role="presentation" class="imageDropZone mceImage"/>
                                                        </span>
                                                      </a>
                                                    </div>
                                                    <img style="width:100px;margin:20px 0 5px;display:inline-block;" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/2f8f4f1e-3782-075b-b06f-7adabf3e9a1f.png" alt="Rentspace"/>
                                                    <p style="font-size:12px;font-weight:bold;margin:5px 0;">© 2024 RentSpace. All rights reserved.</p>
                                                    <p style="font-size:12px;margin:25px 5px 15px 5px;">Follow us</p>
                                                    <a href="https://www.facebook.com/profile.php?id=100083035015197&mibextid=LQQJ4d">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://cdn-images.mailchimp.com/icons/social-block-v3/block-icons-v3/facebook-filled-color-40.png" alt="Facebook"/>
                                                    </a>
                                                    <a href="https://www.instagram.com/rentspacetech?igsh=MXZwOWkzbjZrZml4dA%3D%3D&utm_source=qr">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram"/>
                                                    </a>
                                                    <a href="https://www.linkedin.com/company/rentspace.tech/">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn"/>
                                                    </a>
                                                    <a href="https://x.com/rentspacetech?s=21&t=qAAMl7hG_1Pl2RuSPJdU-w">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter"/>
                                                    </a>
                                                    <p style="font-size:12px;font-weight:bold;margin:5px 0;">For further enquiries, please contact our customer support through our mail:</p>
                                                    <a href="mailto:support@rentspace.tech" style="font-size:12px;font-weight:bold;margin:5px 0;">support@rentspace.tech</a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </center>`;
};

const firstDepositMailForSpaceRent = (firstName) => {
  return `
  <center>
    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="background-color: rgb(234, 236, 226);">
      <tbody>
        <tr>
          <td class="bodyCell" align="center" valign="top">
            <table id="root" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tbody data-block-id="14" class="mceWrapper">
                <tr>
                  <td align="center" valign="top" class="mceWrapperOuter">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation">
                      <tbody>
                        <tr>
                          <td style="background-color:#d2c3b1;background-position:center;background-repeat:no-repeat;background-size:cover" class="mceWrapperInner" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="13">
                              <tbody>
                                <tr class="mceRow">
                                  <td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td style="padding-top:0;padding-bottom:0" class="mceColumn" data-block-id="-13" valign="top" colspan="12" width="100%">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td style="background-color:#ffffff;padding-top:12px;padding-bottom:12px;padding-right:0;padding-left:0" class="mceBlockContainer" align="center" valign="top">
                                                    <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0">
                                                      <!-- Image removed -->
                                                    </span>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0" valign="top">
                                                    <table width="100%" style="border:0;background-color:#ffffff;border-collapse:separate">
                                                      <tbody>
                                                        <tr>
                                                          <td style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px" class="mceTextBlockContainer">
                                                            <div data-block-id="5" class="mceText" id="dataBlockId-5" style="width:100%">
                                                              <p><br/></p>
                                                              <p style="text-align: left;">Hi ${firstName},</p>
                                                              <p style="text-align: left;">
                                                                Congratulations on starting your SpaceRent plan! You’re on your way to managing your rent payments effortlessly and building a solid financial future.
                                                              </p>
                                                              <p style="text-align: left;">
                                                                To ensure you get the most out of your SpaceRent plan, remember to maintain your savings schedule and explore the benefits of our loan options when you hit the 70% mark of your goal.
                                                              </p>
                                                              </p>
                                                              <p style="text-align: left;">
                                                                We’re here to support you every step of the way. Reach out if you have any questions or need assistance via <a href="mailto:support@rentspace.tech">support@rentspace.tech</a>.
                                                              </p>
                                                              <p style="text-align: left;">
                                                                Best wishes,
                                                              </p>
                                                              <p style="text-align: left;">
                                                                The RentSpace Team
                                                              </p>
                                                              <p><br/></p>
                                                              <p style="text-align: left;">
                                                                <strong>P.S.</strong> Keep saving consistently and watch your SpacePoints grow!
                                                              </p>
                                                              <h3>Tips for Successful Saving on SpaceRent</h3>
                                                              <ul>
                                                                <li style="text-align: left;"><p style="text-align: left;">Join the RentSpace Community</p></li>
                                                              </ul>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="background-color:#ffffff;padding-top:0px;padding-bottom:0px;padding-right:24px;padding-left:24px" class="mceBlockContainer" valign="top">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff;" role="presentation" class="mceDividerContainer" data-block-id="39">
                                                      <tbody>
                                                        <tr>
                                                          <td style="min-width:100%;border-top:4px solid #000000;" class="mceDividerBlock" valign="top"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="background-color:#f2f4f7;padding:20px;text-align:center;">
                                                    <div style="margin-top:40px;display:flex;align-items:center;justify-content:space-around;">
                                                      <a href="https://apps.apple.com/ng/app/rentspace-app/id6469376146" style="display:inline-block;" target="_blank" data-block-id="36">
                                                        <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0;">
                                                          <img width="213" height="auto" style="width:180px;height:auto;max-width:200px !important;display:block;border-radius:5px;" alt="" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/540b26b2-be1d-2abb-b35d-24a787d828e3.jpeg" role="presentation" class="imageDropZone mceImage"/>
                                                        </span>
                                                      </a>
                                                      <a href="https://play.google.com/store/apps/details?id=com.rentspace.app.android" style="display:inline-block;" target="_blank" data-block-id="37">
                                                        <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0;">
                                                          <img width="211" height="auto" style="width:180px;height:auto;max-width:200px !important;display:block;border-radius:5px;" alt="" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/f972bd50-96e3-e36f-06b5-2d177bd79cbb.jpeg" role="presentation" class="imageDropZone mceImage"/>
                                                        </span>
                                                      </a>
                                                    </div>
                                                    <img style="width:100px;margin:20px 0 5px;display:inline-block;" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/2f8f4f1e-3782-075b-b06f-7adabf3e9a1f.png" alt="Rentspace"/>
                                                    <p style="font-size:12px;font-weight:bold;margin:5px 0;">© 2024 RentSpace. All rights reserved.</p>
                                                    <p style="font-size:12px;margin:25px 5px 15px 5px;">Follow us</p>
                                                    <a href="https://www.facebook.com/profile.php?id=100083035015197&mibextid=LQQJ4d">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://cdn-images.mailchimp.com/icons/social-block-v3/block-icons-v3/facebook-filled-color-40.png" alt="Facebook"/>
                                                    </a>
                                                    <a href="https://www.instagram.com/rentspacetech?igsh=MXZwOWkzbjZrZml4dA%3D%3D&utm_source=qr">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram"/>
                                                    </a>
                                                    <a href="https://www.linkedin.com/company/rentspace.tech/">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn"/>
                                                    </a>
                                                    <a href="https://x.com/rentspacetech?s=21&t=qAAMl7hG_1Pl2RuSPJdU-w">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter"/>
                                                    </a>
                                                    <p style="font-size:12px;font-weight:bold;margin:5px 0;">For further enquiries, please contact our customer support through our mail:</p>
                                                    <a href="mailto:support@rentspace.tech" style="font-size:12px;font-weight:bold;margin:5px 0;">support@rentspace.tech</a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </center>`;
};

const missedFirstDepositMailForSpaceRent = (firstName) => {
  return `
  <center>
    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="background-color: rgb(234, 236, 226);">
      <tbody>
        <tr>
          <td class="bodyCell" align="center" valign="top">
            <table id="root" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tbody data-block-id="14" class="mceWrapper">
                <tr>
                  <td align="center" valign="top" class="mceWrapperOuter">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation">
                      <tbody>
                        <tr>
                          <td style="background-color:#d2c3b1;background-position:center;background-repeat:no-repeat;background-size:cover" class="mceWrapperInner" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="13">
                              <tbody>
                                <tr class="mceRow">
                                  <td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td style="padding-top:0;padding-bottom:0" class="mceColumn" data-block-id="-13" valign="top" colspan="12" width="100%">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td style="background-color:#ffffff;padding-top:12px;padding-bottom:12px;padding-right:0;padding-left:0" class="mceBlockContainer" align="center" valign="top">
                                                    <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0">
                                                      <!-- Image removed -->
                                                    </span>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0" valign="top">
                                                    <table width="100%" style="border:0;background-color:#ffffff;border-collapse:separate">
                                                      <tbody>
                                                        <tr>
                                                          <td style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px" class="mceTextBlockContainer">
                                                            <div data-block-id="5" class="mceText" id="dataBlockId-5" style="width:100%">
                                                              <p><br/></p>
                                                              <p style="text-align: left;">Hi ${firstName},</p>
                                                              <p style="text-align: left;">
                                                                We noticed that you expressed interest in starting your SpaceRent plan but missed your initial saving day. No worries – it’s never too late to begin!
                                                              </p>
                                                              <p style="text-align: left;">
                                                                We are curious to know what might have held you back and how we can assist you in getting started. If you need any assistance, our support team is here to help via <a href="mailto:support@rentspace.tech">support@rentspace.tech</a>.
                                                              </p>
                                                              <p style="text-align: left;">
                                                                Here’s how to get back on track:
                                                              </p>
                                                              <ul>
                                                                <li style="text-align: left;">Log in to your RentSpace app.</li>
                                                                <li style="text-align: left;">Navigate to your SpaceRent plan.</li>
                                                                <li style="text-align: left;">Confirm your savings schedule and start date.</li>
                                                              </ul>
                                                              <p style="text-align: left;">
                                                                Don’t miss out on the benefits of SpaceRent. Let’s get you saving today!
                                                              </p>
                                                              <p style="text-align: left;">
                                                                Warm regards,
                                                              </p>
                                                              <p style="text-align: left;">
                                                                The RentSpace Team
                                                              </p>
                                                              <p><br/></p>
                                                              <p style="text-align: left;">
                                                                <strong>P.S.</strong> Consistent saving not only helps you manage your rent but also rewards you with SpacePoints. Start saving now and watch your rewards grow!
                                                              </p>
                                                             <h3>Tips for Successful Saving on SpaceRent</h3>
                                                              <ul>
                                                                <li style="text-align: left;"><p style="text-align: left;">Set a realistic goal.</p></li>
                                                                <li style="text-align: left;"><p style="text-align: left;">Track your progress.</p></li>
                                                                <li style="text-align: left;"><p style="text-align: left;"><a href="https://rentspace.tech/rentspace-community/" style="color: #4CAF50;">Join the RentSpace Community.</p></li>
                                                              </ul>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="background-color:#ffffff;padding-top:0px;padding-bottom:0px;padding-right:24px;padding-left:24px" class="mceBlockContainer" valign="top">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff;" role="presentation" class="mceDividerContainer" data-block-id="39">
                                                      <tbody>
                                                        <tr>
                                                          <td style="min-width:100%;border-top:4px solid #000000;" class="mceDividerBlock" valign="top"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="background-color:#f2f4f7;padding:20px;text-align:center;">
                                                    <div style="margin-top:40px;display:flex;align-items:center;justify-content:space-around;">
                                                      <a href="https://apps.apple.com/ng/app/rentspace-app/id6469376146" style="display:inline-block;" target="_blank" data-block-id="36">
                                                        <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0;">
                                                          <img width="213" height="auto" style="width:180px;height:auto;max-width:200px !important;display:block;border-radius:5px;" alt="" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/540b26b2-be1d-2abb-b35d-24a787d828e3.jpeg" role="presentation" class="imageDropZone mceImage"/>
                                                        </span>
                                                      </a>
                                                      <a href="https://play.google.com/store/apps/details?id=com.rentspace.app.android" style="display:inline-block;" target="_blank" data-block-id="37">
                                                        <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0;">
                                                          <img width="211" height="auto" style="width:180px;height:auto;max-width:200px !important;display:block;border-radius:5px;" alt="" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/f972bd50-96e3-e36f-06b5-2d177bd79cbb.jpeg" role="presentation" class="imageDropZone mceImage"/>
                                                        </span>
                                                      </a>
                                                    </div>
                                                    <img style="width:100px;margin:20px 0 5px;display:inline-block;" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/2f8f4f1e-3782-075b-b06f-7adabf3e9a1f.png" alt="Rentspace"/>
                                                    <p style="font-size:12px;font-weight:bold;margin:5px 0;">© 2024 RentSpace. All rights reserved.</p>
                                                    <p style="font-size:12px;margin:25px 5px 15px 5px;">Follow us</p>
                                                    <a href="https://www.facebook.com/profile.php?id=100083035015197&mibextid=LQQJ4d">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://cdn-images.mailchimp.com/icons/social-block-v3/block-icons-v3/facebook-filled-color-40.png" alt="Facebook"/>
                                                    </a>
                                                    <a href="https://www.instagram.com/rentspacetech?igsh=MXZwOWkzbjZrZml4dA%3D%3D&utm_source=qr">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram"/>
                                                    </a>
                                                    <a href="https://www.linkedin.com/company/rentspace.tech/">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn"/>
                                                    </a>
                                                    <a href="https://x.com/rentspacetech?s=21&t=qAAMl7hG_1Pl2RuSPJdU-w">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter"/>
                                                    </a>
                                                    <p style="font-size:12px;font-weight:bold;margin:5px 0;">For further enquiries, please contact our customer support through our mail:</p>
                                                    <a href="mailto:support@rentspace.tech" style="font-size:12px;font-weight:bold;margin:5px 0;">support@rentspace.tech</a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </center>`;
};

const spaceRentDeletionReminderMail = (firstName) => {
  return `
  <center>
    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="background-color: rgb(234, 236, 226);">
      <tbody>
        <tr>
          <td class="bodyCell" align="center" valign="top">
            <table id="root" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tbody data-block-id="14" class="mceWrapper">
                <tr>
                  <td align="center" valign="top" class="mceWrapperOuter">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation">
                      <tbody>
                        <tr>
                          <td style="background-color:#d2c3b1;background-position:center;background-repeat:no-repeat;background-size:cover" class="mceWrapperInner" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="13">
                              <tbody>
                                <tr class="mceRow">
                                  <td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td style="padding-top:0;padding-bottom:0" class="mceColumn" data-block-id="-13" valign="top" colspan="12" width="100%">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td style="background-color:#ffffff;padding-top:12px;padding-bottom:12px;padding-right:0;padding-left:0" class="mceBlockContainer" align="center" valign="top">
                                                    <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0">
                                                      <!-- Image removed -->
                                                    </span>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0" valign="top">
                                                    <table width="100%" style="border:0;background-color:#ffffff;border-collapse:separate">
                                                      <tbody>
                                                        <tr>
                                                          <td style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px" class="mceTextBlockContainer">
                                                            <div data-block-id="5" class="mceText" id="dataBlockId-5" style="width:100%">
                                                              <p><br/></p>
                                                              <p style="text-align: left;">Hi ${firstName},</p>
                                                              <p style="text-align: left;">
                                                                We hope this message finds you well. We noticed that you expressed interest in starting a SpaceRent plan but haven’t begun saving yet. We wanted to remind you that without initiating your savings, your SpaceRent plan will soon be deleted.
                                                              </p>
                                                              <p style="text-align: left;">
                                                                But don’t worry! You can easily create a new SpaceRent plan and begin saving towards your rent.
                                                              </p>
                                                              <p style="text-align: left;">
                                                                Here’s how to get started:
                                                              </p>
                                                              <ul>
                                                                <li>Log in to your RentSpace app.</li>
                                                                <li>Create a new SpaceRent plan with your desired savings goals.</li>
                                                                <li>Set up your savings schedule and start date.</li>
                                                                <li>Begin your journey to stress-free rent payments!</li>
                                                              </ul>
                                                              <p style="text-align: left;">
                                                                We’re here to support you every step of the way. Reach out if you have any questions or need assistance via <a href="mailto:support@rentspace.tech">support@rentspace.tech</a>.
                                                              </p>
                                                              <p style="text-align: left;">
                                                                Warm regards,
                                                              </p>
                                                              <p style="text-align: left;">
                                                                The RentSpace Team
                                                              </p>
                                                              <p><br/></p>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="background-color:#ffffff;padding-top:0px;padding-bottom:0px;padding-right:24px;padding-left:24px" class="mceBlockContainer" valign="top">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff;" role="presentation" class="mceDividerContainer" data-block-id="39">
                                                      <tbody>
                                                        <tr>
                                                          <td style="min-width:100%;border-top:4px solid #000000;" class="mceDividerBlock" valign="top"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="background-color:#f2f4f7;padding:20px;text-align:center;">
                                                    <div style="margin-top:40px;display:flex;align-items:center;justify-content:space-around;">
                                                      <a href="https://apps.apple.com/ng/app/rentspace-app/id6469376146" style="display:inline-block;" target="_blank" data-block-id="36">
                                                        <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0;">
                                                          <img width="213" height="auto" style="width:180px;height:auto;max-width:200px !important;display:block;border-radius:5px;" alt="" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/540b26b2-be1d-2abb-b35d-24a787d828e3.jpeg" role="presentation" class="imageDropZone mceImage"/>
                                                        </span>
                                                      </a>
                                                      <a href="https://play.google.com/store/apps/details?id=com.rentspace.app.android" style="display:inline-block;" target="_blank" data-block-id="37">
                                                        <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0;">
                                                          <img width="211" height="auto" style="width:180px;height:auto;max-width:200px !important;display:block;border-radius:5px;" alt="" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/f972bd50-96e3-e36f-06b5-2d177bd79cbb.jpeg" role="presentation" class="imageDropZone mceImage"/>
                                                        </span>
                                                      </a>
                                                    </div>
                                                    <img style="width:100px;margin:20px 0 5px;display:inline-block;" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/2f8f4f1e-3782-075b-b06f-7adabf3e9a1f.png" alt="Rentspace"/>
                                                    <p style="font-size:12px;font-weight:bold;margin:5px 0;">© 2024 RentSpace. All rights reserved.</p>
                                                    <p style="font-size:12px;margin:25px 5px 15px 5px;">Follow us</p>
                                                    <a href="https://www.facebook.com/profile.php?id=100083035015197&mibextid=LQQJ4d">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://cdn-images.mailchimp.com/icons/social-block-v3/block-icons-v3/facebook-filled-color-40.png" alt="Facebook"/>
                                                    </a>
                                                    <a href="https://www.instagram.com/rentspacetech?igsh=MXZwOWkzbjZrZml4dA%3D%3D&utm_source=qr">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram"/>
                                                    </a>
                                                    <a href="https://www.linkedin.com/company/rentspace.tech/">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn"/>
                                                    </a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </center>`;
};

const takeASurvey = (firstName) => {
  return `
  <center>
    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="background-color: rgb(234, 236, 226);">
      <tbody>
        <tr>
          <td class="bodyCell" align="center" valign="top">
            <table id="root" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tbody data-block-id="14" class="mceWrapper">
                <tr>
                  <td align="center" valign="top" class="mceWrapperOuter">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation">
                      <tbody>
                        <tr>
                          <td style="background-color:#d2c3b1;background-position:center;background-repeat:no-repeat;background-size:cover" class="mceWrapperInner" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" data-block-id="13">
                              <tbody>
                                <tr class="mceRow">
                                  <td style="background-position:center;background-repeat:no-repeat;background-size:cover" valign="top">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td style="padding-top:0;padding-bottom:0" class="mceColumn" data-block-id="-13" valign="top" colspan="12" width="100%">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td style="background-color:#ffffff;padding-top:12px;padding-bottom:12px;padding-right:0;padding-left:0" class="mceBlockContainer" align="center" valign="top">
                                                    <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0">
                                                      <!-- Image removed -->
                                                    </span>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0" valign="top">
                                                    <table width="100%" style="border:0;background-color:#ffffff;border-collapse:separate">
                                                      <tbody>
                                                        <tr>
                                                          <td style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px" class="mceTextBlockContainer">
                                                            <div data-block-id="5" class="mceText" id="dataBlockId-5" style="width:100%">
                                                              <p><br/></p>
                                                              <p style="text-align: left;">Hi ${firstName},</p>
                                                              <p style="text-align: left;">We value your opinion and would love to hear from you! By participating in our short survey, you'll help us understand your needs better and improve our services..</p>
                                                              <p style="text-align: left;">Your feedback is vital in helping us improve and provide better services for you. Plus, you’ll have a chance to win exciting rewards!</p>
                                                              
 <p style="text-align: center;">
                                                                <a href="https://tinyurl.com/4fu62zsc" style="display:inline-block;background-color:#007bff;color:#ffffff;padding:12px 24px;text-decoration:none;font-weight:bold;border-radius:5px;">Take Survey</a>
                                                              </p>                                                                     
                                                                      <p style="text-align: left;">        Join us in making a difference – it only takes a few minutes!
</p>
                                                              <p></p>
                                                              <p style="text-align: left;"> Thank you for your support!</p
                                                              <p style="text-align: left;"> <br/>
                                                                The RentSpace Team
                                                              </p>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="background-color:#ffffff;padding-top:0px;padding-bottom:0px;padding-right:24px;padding-left:24px" class="mceBlockContainer" valign="top">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff;" role="presentation" class="mceDividerContainer" data-block-id="39">
                                                      <tbody>
                                                        <tr>
                                                          <td style="min-width:100%;border-top:4px solid #000000;" class="mceDividerBlock" valign="top"></td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="background-color:#f2f4f7;padding:20px;text-align:center;">
                                                   <div style="margin-top:40px;display:flex;align-items:center;justify-content:center;gap:20px;">
  <a href="https://apps.apple.com/ng/app/rentspace-app/id6469376146" style="display:inline-block;" target="_blank" data-block-id="36">
    <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0;">
      <img width="180" height="auto" style="width:180px;height:auto;max-width:180px !important;display:block;border-radius:5px;" alt="App Store" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/540b26b2-be1d-2abb-b35d-24a787d828e3.jpeg" role="presentation" class="imageDropZone mceImage"/>
    </span>
  </a>
  <a href="https://play.google.com/store/apps/details?id=com.rentspace.app.android" style="display:inline-block;" target="_blank" data-block-id="37">
    <span class="mceImageBorder" style="border:0;vertical-align:top;margin:0;">
      <img width="180" height="auto" style="width:180px;height:auto;max-width:180px !important;display:block;border-radius:5px;" alt="Play Store" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/f972bd50-96e3-e36f-06b5-2d177bd79cbb.jpeg" role="presentation" class="imageDropZone mceImage"/>
    </span>
  </a>
</div>
                                                   <img style="width:100px;margin:20px 0 5px;display:inline-block;" src="https://mcusercontent.com/4bf7b7503cc0cfb70a31c331e/images/2f8f4f1e-3782-075b-b06f-7adabf3e9a1f.png" alt="Rentspace"/>
                                                    <p style="font-size:12px;font-weight:bold;margin:5px 0;">© 2024 RentSpace. All rights reserved.</p>
                                                    <p style="font-size:12px;margin:25px 5px 15px 5px;">Follow us</p>
                                                    <a href="https://www.facebook.com/profile.php?id=100083035015197&mibextid=LQQJ4d">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://cdn-images.mailchimp.com/icons/social-block-v3/block-icons-v3/facebook-filled-color-40.png" alt="Facebook"/>
                                                    </a>
                                                    <a href="https://www.instagram.com/rentspacetech?igsh=MXZwOWkzbjZrZml4dA%3D%3D&utm_source=qr">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram"/>
                                                    </a>
                                                    <a href="https://www.linkedin.com/company/rentspace.tech/">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn"/>
                                                    </a>
                                                    <a href="https://x.com/rentspacetech?s=21&t=qAAMl7hG_1Pl2RuSPJdU-w">
                                                      <img style="width:30px;margin:0 5px;display:inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter"/>
                                                    </a>
                                                    <p style="font-size:12px;font-weight:bold;margin:5px 0;">For further enquiries, please contact our customer support through our mail:</p>
                                                    <a href="mailto:support@rentspace.tech" style="font-size:12px;font-weight:bold;margin:5px 0;">support@rentspace.tech</a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </center>`;
};

module.exports = {
  createAccountOtp,
  resetPinMailOTP,
  resetPasswordOtp,
  reportReceived,
  reportSent,
  fundWalletMessage,
  addCardMessage,
  failedDebit,
  upcomingRentPayment,
  transfer,
  walletFunding,
  welcomeMail,
  successfulDebit,
  getStarted,
  reminderMailForBVNVerification,
  reminderMailForSpaceRent,
  firstDepositMailForSpaceRent,
  missedFirstDepositMailForSpaceRent,
  spaceRentDeletionReminderMail,
  takeASurvey,
};
