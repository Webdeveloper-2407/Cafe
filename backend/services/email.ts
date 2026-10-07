import nodemailer from 'nodemailer';

export interface OrderEmailDetails {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  orderType: string;
  deliveryAddress?: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  notes?: string;
}

export interface ReservationEmailDetails {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequest?: string;
}

export interface ContactEmailDetails {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  if (host) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Default to Gmail if SMTP_HOST is not explicitly specified
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

export async function sendOrderNotificationEmail(order: OrderEmailDetails): Promise<boolean> {
  const transporter = getTransporter();
  const mailTo = process.env.MAIL_TO || process.env.SMTP_USER || 'admin@cafe.com';
  const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER || '"Café Orders" <orders@cafe.com>';

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 6px 12px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 6px 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 6px 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2C1810; background: #FAF4ED; padding: 24px; border-radius: 12px;">
      <div style="text-align: center; border-bottom: 2px solid #6B4226; padding-bottom: 16px; margin-bottom: 20px;">
        <h1 style="color: #6B4226; margin: 0; font-size: 24px;">Café — Good Coffee & More</h1>
        <p style="color: #7A5034; margin: 4px 0 0 0; font-size: 13px;">New Customer Order Notification</p>
      </div>

      <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #E5D7C7;">
        <h2 style="font-size: 18px; color: #2C1810; margin-top: 0;">Order #${order.orderNumber}</h2>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Fulfillment:</strong> <span style="text-transform: uppercase; font-weight: bold; color: #6B4226;">${order.orderType}</span></p>
        ${order.deliveryAddress ? `<p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>` : ''}
        ${order.notes ? `<p><strong>Order Notes:</strong> ${order.notes}</p>` : ''}

        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
          <thead>
            <tr style="background: #F3ECE3; color: #6B4226;">
              <th style="padding: 8px 12px; text-align: left;">Item</th>
              <th style="padding: 8px 12px; text-align: center;">Qty</th>
              <th style="padding: 8px 12px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 16px; text-align: right; font-size: 14px;">
          <p style="margin: 4px 0;">Subtotal: $${order.subtotal.toFixed(2)}</p>
          <p style="margin: 4px 0;">Tax (8%): $${order.tax.toFixed(2)}</p>
          ${order.deliveryFee > 0 ? `<p style="margin: 4px 0;">Delivery Fee: $${order.deliveryFee.toFixed(2)}</p>` : ''}
          <h3 style="color: #6B4226; margin: 8px 0 0 0; font-size: 18px;">Total: $${order.total.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`[Email Mock/Fallback] Order notification for #${order.orderNumber} created. (SMTP credentials not configured in process.env)`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      subject: `[New Order] ${order.orderNumber} - ${order.customerName} ($${order.total.toFixed(2)})`,
      html,
    });
    console.log(`[Email] Notification sent for order #${order.orderNumber}`);
    return true;
  } catch (err) {
    console.error(`[Email Error] Failed to send order notification email:`, err);
    return false;
  }
}

export async function sendReservationNotificationEmail(res: ReservationEmailDetails): Promise<boolean> {
  const transporter = getTransporter();
  const mailTo = process.env.MAIL_TO || process.env.SMTP_USER || 'admin@cafe.com';
  const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER || '"Café Reservations" <reservations@cafe.com>';

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2C1810; background: #FAF4ED; padding: 24px; border-radius: 12px;">
      <h2 style="color: #6B4226; margin-top: 0;">New Table Reservation Request</h2>
      <div style="background: #ffffff; padding: 18px; border-radius: 8px; border: 1px solid #E5D7C7;">
        <p><strong>Guest Name:</strong> ${res.name}</p>
        <p><strong>Phone:</strong> ${res.phone}</p>
        <p><strong>Email:</strong> ${res.email}</p>
        <p><strong>Date & Time:</strong> ${res.date} at ${res.time}</p>
        <p><strong>Party Size:</strong> ${res.guests} Guests</p>
        ${res.specialRequest ? `<p><strong>Special Request:</strong> ${res.specialRequest}</p>` : ''}
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`[Email Mock/Fallback] Reservation notification for ${res.name} (${res.date} ${res.time}) logged.`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      subject: `[Table Reservation] ${res.name} - ${res.guests} guests on ${res.date} at ${res.time}`,
      html,
    });
    return true;
  } catch (err) {
    console.error(`[Email Error] Failed to send reservation email:`, err);
    return false;
  }
}

export async function sendContactNotificationEmail(contact: ContactEmailDetails): Promise<boolean> {
  const transporter = getTransporter();
  const mailTo = process.env.MAIL_TO || process.env.SMTP_USER || 'admin@cafe.com';
  const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER || '"Café Contact" <contact@cafe.com>';

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2C1810; background: #FAF4ED; padding: 24px; border-radius: 12px;">
      <h2 style="color: #6B4226; margin-top: 0;">New Contact Form Message</h2>
      <div style="background: #ffffff; padding: 18px; border-radius: 8px; border: 1px solid #E5D7C7;">
        <p><strong>Sender:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #FAF5EF; padding: 12px; border-radius: 6px; border: 1px solid #EDE2D4; font-size: 14px; white-space: pre-wrap;">${contact.message}</div>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`[Email Mock/Fallback] Contact message from ${contact.name} (${contact.subject}) logged.`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      subject: `[Contact Form] ${contact.subject} - from ${contact.name}`,
      html,
    });
    return true;
  } catch (err) {
    console.error(`[Email Error] Failed to send contact email:`, err);
    return false;
  }
}
