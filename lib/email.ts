/**
 * Email Service using Nodemailer
 * E-commerce email notifications
 */

import nodemailer from "nodemailer";

interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Create email transporter
 */
const createTransporter = () => {
  // Check if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
    console.warn("SMTP not configured. Emails will be logged only.");
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

/**
 * Send email
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  try {
    const transporter = createTransporter();

    // If no transporter (SMTP not configured), just log
    if (!transporter) {
      console.log("📧 Email (Mock):", {
        to: options.to,
        subject: options.subject,
      });

      return {
        success: true,
        messageId: `mock-${Date.now()}`,
      };
    }

    // Send email
    const info = await transporter.sendMail({
      from: options.from || process.env.SMTP_FROM || "noreply@shop.com",
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log("✅ Email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("❌ Email error:", error);

    return {
      success: false,
      error: error.message || "Failed to send email",
    };
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  to: string,
  orderData: {
    orderId: string;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    shippingAddress: string;
  }
): Promise<EmailResult> {
  const itemsHtml = orderData.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${
            item.name
          }</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${
            item.quantity
          }</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.price.toFixed(
            2
          )}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">$${(
            item.quantity * item.price
          ).toFixed(2)}</td>
        </tr>
      `
    )
    .join("");

  return sendEmail({
    to,
    subject: `Order Confirmation #${orderData.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Order Confirmed!</h1>
        <p>Hi ${orderData.customerName},</p>
        <p>Thank you for your order. We've received your order and will process it shortly.</p>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <strong>Order ID:</strong> ${orderData.orderId}
        </div>

        <h3>Order Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
              <th style="padding: 10px; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #2563eb;">$${orderData.total.toFixed(
                2
              )}</td>
            </tr>
          </tfoot>
        </table>

        <h3 style="margin-top: 30px;">Shipping Address:</h3>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
          ${orderData.shippingAddress.replace(/\n/g, "<br>")}
        </div>

        <p style="margin-top: 30px;">We'll send you another email when your order ships.</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 40px;">
          Thank you for shopping with us!<br>
          The Shop Team
        </p>
      </div>
    `,
    text: `Order Confirmation #${
      orderData.orderId
    }\n\nThank you for your order, ${
      orderData.customerName
    }!\n\nTotal: $${orderData.total.toFixed(2)}`,
  });
}

/**
 * Send shipping notification email
 */
export async function sendShippingNotificationEmail(
  to: string,
  data: {
    orderId: string;
    customerName: string;
    trackingNumber: string;
    carrier: string;
    estimatedDelivery: string;
  }
): Promise<EmailResult> {
  return sendEmail({
    to,
    subject: `Your Order #${data.orderId} Has Shipped!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10b981;">Your Order Has Shipped! 📦</h1>
        <p>Hi ${data.customerName},</p>
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <div style="margin-bottom: 15px;">
            <strong>Order ID:</strong> ${data.orderId}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Tracking Number:</strong> ${data.trackingNumber}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Carrier:</strong> ${data.carrier}
          </div>
          <div>
            <strong>Estimated Delivery:</strong> ${data.estimatedDelivery}
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Track Your Package
          </a>
        </div>

        <p>We hope you enjoy your purchase!</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 40px;">
          Thank you for shopping with us!<br>
          The Shop Team
        </p>
      </div>
    `,
    text: `Your Order #${data.orderId} Has Shipped!\n\nTracking: ${data.trackingNumber}\nCarrier: ${data.carrier}`,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  resetLink: string,
  userName: string
): Promise<EmailResult> {
  return sendEmail({
    to,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Password Reset</h1>
        <p>Hi ${userName},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Reset Password
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px;">
          This link will expire in 1 hour.<br>
          If you didn't request a password reset, you can safely ignore this email.
        </p>
        
        <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
          Link: ${resetLink}
        </p>
      </div>
    `,
    text: `Password Reset Request\n\nClick here to reset your password: ${resetLink}\n\nThis link expires in 1 hour.`,
  });
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<EmailResult> {
  return sendEmail({
    to,
    subject: "Welcome to Our Shop!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Welcome, ${name}!</h1>
        <p>Thank you for joining our community.</p>
        <p>Start exploring our products and enjoy exclusive member benefits:</p>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <ul style="margin: 0; padding-left: 20px;">
            <li>Free shipping on orders over $50</li>
            <li>Early access to sales</li>
            <li>Exclusive member discounts</li>
            <li>Easy order tracking</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Start Shopping
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 40px;">
          Happy Shopping!<br>
          The Shop Team
        </p>
      </div>
    `,
    text: `Welcome, ${name}! Thank you for joining our community.`,
  });
}
