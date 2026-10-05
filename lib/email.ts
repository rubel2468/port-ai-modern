import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  totalAmount: number;
  bookingId: string;
  transactionId?: string;
}

// ── Booking Confirmation Email ────────────────────────────────────────────────
export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  const mailOptions = {
    from: `"StayBD 🏨" <${process.env.EMAIL_USER}>`,
    to: data.customerEmail,
    subject: `✅ Booking Confirmed – ${data.hotelName} | StayBD`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background:#f4f7f6; margin:0; padding:20px; }
    .container { max-width:600px; margin:0 auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08); }
    .header { background:linear-gradient(135deg,#0f766e,#0ea5e9); padding:32px 24px; text-align:center; }
    .header h1 { color:#fff; margin:0; font-size:26px; font-weight:800; }
    .header p { color:rgba(255,255,255,0.8); margin:6px 0 0; }
    .badge { display:inline-block; background:#f59e0b; color:#1a1a1a; font-weight:700; font-size:13px; padding:6px 16px; border-radius:20px; margin-top:12px; }
    .body { padding:28px 24px; }
    .greeting { font-size:16px; color:#374151; margin-bottom:20px; }
    .card { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:20px; margin-bottom:20px; }
    .card-title { font-size:13px; color:#059669; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:14px; }
    .row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #e5e7eb; }
    .row:last-child { border-bottom:none; }
    .label { color:#6b7280; font-size:13px; }
    .value { color:#111827; font-size:13px; font-weight:600; }
    .total-box { background:#0f766e; border-radius:12px; padding:16px 20px; text-align:center; margin:20px 0; }
    .total-box p { color:rgba(255,255,255,0.8); font-size:12px; margin:0 0 4px; }
    .total-box span { color:#fff; font-size:28px; font-weight:900; }
    .id-box { background:#f3f4f6; border-radius:10px; padding:14px 20px; text-align:center; margin-bottom:20px; }
    .id-box p { color:#6b7280; font-size:11px; margin:0 0 4px; text-transform:uppercase; letter-spacing:0.5px; }
    .id-box span { color:#0f766e; font-size:16px; font-weight:800; letter-spacing:2px; }
    .footer { background:#f9fafb; border-top:1px solid #e5e7eb; padding:20px 24px; text-align:center; }
    .footer p { color:#9ca3af; font-size:12px; margin:4px 0; }
    .footer a { color:#0f766e; text-decoration:none; font-weight:600; }
    .note { background:#fef3c7; border:1px solid #fde68a; border-radius:10px; padding:12px 16px; font-size:13px; color:#92400e; margin-bottom:20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏨 StayBD</h1>
      <p>Hotel & Resort Booking</p>
      <div class="badge">✅ Booking Confirmed</div>
    </div>
    <div class="body">
      <p class="greeting">Dear <strong>${data.customerName}</strong>, your booking has been confirmed!</p>

      <div class="id-box">
        <p>Booking Reference ID</p>
        <span>${data.bookingId}</span>
      </div>

      <div class="card">
        <div class="card-title">🏩 Hotel Details</div>
        <div class="row">
          <span class="label">Property</span>
          <span class="value">${data.hotelName}</span>
        </div>
        <div class="row">
          <span class="label">Location</span>
          <span class="value">${data.location}</span>
        </div>
        <div class="row">
          <span class="label">Room Type</span>
          <span class="value">${data.roomType}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">📅 Stay Details</div>
        <div class="row">
          <span class="label">Check-In</span>
          <span class="value">${data.checkIn}</span>
        </div>
        <div class="row">
          <span class="label">Check-Out</span>
          <span class="value">${data.checkOut}</span>
        </div>
        <div class="row">
          <span class="label">Guests</span>
          <span class="value">${data.guests} Person(s)</span>
        </div>
        ${data.transactionId ? `
        <div class="row">
          <span class="label">Transaction ID</span>
          <span class="value">${data.transactionId}</span>
        </div>` : ""}
      </div>

      <div class="total-box">
        <p>Total Amount Paid</p>
        <span>৳ ${data.totalAmount.toLocaleString()}</span>
      </div>

      <div class="note">
        📌 Please carry this email and a valid photo ID at check-in. For support, contact us at
        <a href="mailto:support@staybd.com">support@staybd.com</a>
      </div>
    </div>
    <div class="footer">
      <p>Thank you for choosing <a href="${process.env.NEXTAUTH_URL}">StayBD</a></p>
      <p>Need help? Call us at <strong>+880 1700-000000</strong></p>
      <p style="margin-top:8px;color:#d1d5db;">© 2026 StayBD. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// ── Welcome / Registration Email ──────────────────────────────────────────────
export async function sendWelcomeEmail(name: string, email: string) {
  const mailOptions = {
    from: `"StayBD 🏨" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🎉 Welcome to StayBD, ${name}!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background:#f4f7f6; margin:0; padding:20px; }
    .container { max-width:560px; margin:0 auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08); }
    .header { background:linear-gradient(135deg,#0f766e,#0ea5e9); padding:40px 24px; text-align:center; }
    .header h1 { color:#fff; margin:0; font-size:28px; font-weight:900; }
    .emoji { font-size:52px; display:block; margin-bottom:12px; }
    .body { padding:32px 24px; text-align:center; }
    .body h2 { color:#111827; font-size:22px; font-weight:800; margin:0 0 12px; }
    .body p { color:#6b7280; font-size:15px; line-height:1.6; }
    .btn { display:inline-block; margin-top:24px; padding:14px 36px; background:#0f766e; color:#fff; text-decoration:none; border-radius:12px; font-weight:700; font-size:15px; }
    .perks { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin:24px 0; }
    .perk { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:10px 16px; font-size:13px; color:#059669; font-weight:600; }
    .footer { background:#f9fafb; border-top:1px solid #e5e7eb; padding:16px; text-align:center; }
    .footer p { color:#9ca3af; font-size:12px; margin:4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="emoji">🏨</span>
      <h1>StayBD</h1>
    </div>
    <div class="body">
      <h2>Welcome, ${name}! 🎉</h2>
      <p>You've successfully joined Bangladesh's premier hotel & resort booking platform. Start exploring amazing properties today!</p>
      <div class="perks">
        <div class="perk">✅ Best Price Guarantee</div>
        <div class="perk">🔒 Secure Payment</div>
        <div class="perk">📞 24/7 Support</div>
        <div class="perk">❤️ Wishlist Feature</div>
      </div>
      <a href="${process.env.NEXTAUTH_URL}" class="btn">Start Exploring →</a>
    </div>
    <div class="footer">
      <p>© 2026 StayBD. All rights reserved.</p>
      <p>Questions? <a href="mailto:support@staybd.com" style="color:#0f766e;">support@staybd.com</a></p>
    </div>
  </div>
</body>
</html>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// ── Password Reset Email ──────────────────────────────────────────────────────
export async function sendPasswordResetEmail(email: string, resetLink: string) {
  const mailOptions = {
    from: `"StayBD 🏨" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🔐 Reset Your Password – StayBD`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background:#f4f7f6; margin:0; padding:20px; }
    .container { max-width:520px; margin:0 auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08); }
    .header { background:#0f766e; padding:28px; text-align:center; }
    .header h1 { color:#fff; margin:0; font-size:22px; font-weight:800; }
    .body { padding:28px; text-align:center; }
    .lock { font-size:48px; }
    .body p { color:#6b7280; font-size:14px; line-height:1.6; }
    .btn { display:inline-block; margin:20px 0; padding:14px 32px; background:#0f766e; color:#fff; text-decoration:none; border-radius:12px; font-weight:700; }
    .note { background:#fef3c7; border-radius:10px; padding:12px; font-size:12px; color:#92400e; }
    .footer { background:#f9fafb; padding:16px; text-align:center; }
    .footer p { color:#9ca3af; font-size:12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>🏨 StayBD</h1></div>
    <div class="body">
      <div class="lock">🔐</div>
      <h2 style="color:#111827;font-weight:800;">Password Reset Request</h2>
      <p>We received a request to reset your password. Click the button below to create a new password. This link expires in <strong>1 hour</strong>.</p>
      <a href="${resetLink}" class="btn">Reset Password</a>
      <div class="note">⚠️ If you did not request this, please ignore this email. Your account remains secure.</div>
    </div>
    <div class="footer"><p>© 2026 StayBD. All rights reserved.</p></div>
  </div>
</body>
</html>
    `,
  };

  return transporter.sendMail(mailOptions);
}
