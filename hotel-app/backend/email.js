import 'dotenv/config';
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Aurelia Hotel <onboarding@resend.dev>";

export async function sendVerificationEmail(to, fullName, code) {
  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your Aurelia Hotel account",
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <h1 style="font-size: 24px; font-weight: 400; letter-spacing: 0.1em; color: #8a6e3e; margin-bottom: 8px;">AURELIA</h1>
        <p style="color: #6b6456; font-size: 14px; margin-bottom: 32px;">Luxury Hotel</p>
        <h2 style="font-size: 20px; font-weight: 400; color: #1a1814; margin-bottom: 16px;">Welcome, ${fullName}</h2>
        <p style="color: #6b6456; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          Thank you for creating an account. Please use the code below to verify your email address.
        </p>
        <div style="background: #f5edde; border: 1px solid #d0cab8; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="font-size: 36px; font-weight: 500; letter-spacing: 0.3em; color: #8a6e3e; margin: 0;">${code}</p>
        </div>
        <p style="color: #a09888; font-size: 12px;">This code expires in 15 minutes. If you didn't create an account, ignore this email.</p>
      </div>
    `,
  });
  console.log("Resend verification response:", JSON.stringify(result));
}

export async function sendBookingConfirmationEmail(to, fullName, booking, room) {
  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: `Booking confirmed — Room ${booking.roomId}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <h1 style="font-size: 24px; font-weight: 400; letter-spacing: 0.1em; color: #8a6e3e; margin-bottom: 8px;">AURELIA</h1>
        <p style="color: #6b6456; font-size: 14px; margin-bottom: 32px;">Luxury Hotel</p>
        <h2 style="font-size: 20px; font-weight: 400; color: #1a1814; margin-bottom: 16px;">Booking confirmed</h2>
        <p style="color: #6b6456; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          Dear ${fullName}, your booking has been confirmed. Here are your details:
        </p>
        <div style="background: #faf9f7; border: 1px solid #e8e4dc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; font-size: 13px; color: #1a1814;">
            <tr><td style="padding: 6px 0; color: #a09888;">Booking ref</td><td style="text-align: right; font-weight: 500;">${booking.id}</td></tr>
            <tr><td style="padding: 6px 0; color: #a09888;">Room</td><td style="text-align: right;">${room?.name || booking.roomId}</td></tr>
            <tr><td style="padding: 6px 0; color: #a09888;">Check-in</td><td style="text-align: right;">${booking.checkIn}</td></tr>
            <tr><td style="padding: 6px 0; color: #a09888;">Check-out</td><td style="text-align: right;">${booking.checkOut}</td></tr>
            <tr><td style="padding: 6px 0; color: #a09888; border-top: 1px solid #e8e4dc; padding-top: 12px;">Total</td><td style="text-align: right; font-size: 18px; color: #8a6e3e; border-top: 1px solid #e8e4dc; padding-top: 12px;">€${booking.total?.toLocaleString()}</td></tr>
          </table>
        </div>
        <p style="color: #a09888; font-size: 12px;">We look forward to welcoming you. For any questions contact us at hello@aurelia-hotel.com</p>
      </div>
    `,
  });
  console.log("Resend booking response:", JSON.stringify(result));
}

export async function sendCancellationEmail(to, fullName, booking, room) {
  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: `Booking cancelled — Room ${booking.roomId}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <h1 style="font-size: 24px; font-weight: 400; letter-spacing: 0.1em; color: #8a6e3e; margin-bottom: 8px;">AURELIA</h1>
        <p style="color: #6b6456; font-size: 14px; margin-bottom: 32px;">Luxury Hotel</p>
        <h2 style="font-size: 20px; font-weight: 400; color: #1a1814; margin-bottom: 16px;">Booking cancelled</h2>
        <p style="color: #6b6456; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          Dear ${fullName}, your booking has been cancelled. Here are the details:
        </p>
        <div style="background: #faf9f7; border: 1px solid #e8e4dc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; font-size: 13px; color: #1a1814;">
            <tr><td style="padding: 6px 0; color: #a09888;">Booking ref</td><td style="text-align: right; font-weight: 500;">${booking.id}</td></tr>
            <tr><td style="padding: 6px 0; color: #a09888;">Room</td><td style="text-align: right;">${room?.name || booking.roomId}</td></tr>
            <tr><td style="padding: 6px 0; color: #a09888;">Check-in</td><td style="text-align: right;">${booking.checkIn}</td></tr>
            <tr><td style="padding: 6px 0; color: #a09888;">Check-out</td><td style="text-align: right;">${booking.checkOut}</td></tr>
          </table>
        </div>
        <p style="color: #a09888; font-size: 12px;">If you did not request this cancellation please contact us immediately at hello@aurelia-hotel.com</p>
      </div>
    `,
  });
  console.log("Resend cancellation response:", JSON.stringify(result));
}

export async function sendPasswordChangedEmail(to, fullName) {
  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: "Your password has been changed",
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <h1 style="font-size: 24px; font-weight: 400; letter-spacing: 0.1em; color: #8a6e3e; margin-bottom: 8px;">AURELIA</h1>
        <p style="color: #6b6456; font-size: 14px; margin-bottom: 32px;">Luxury Hotel</p>
        <h2 style="font-size: 20px; font-weight: 400; color: #1a1814; margin-bottom: 16px;">Password changed</h2>
        <p style="color: #6b6456; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          Dear ${fullName}, your password has been successfully changed.
        </p>
        <p style="color: #6b6456; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          If you did not make this change, please contact us immediately.
        </p>
        <p style="color: #a09888; font-size: 12px;">Contact us at hello@aurelia-hotel.com</p>
      </div>
    `,
  });
  console.log("Resend password response:", JSON.stringify(result));
}