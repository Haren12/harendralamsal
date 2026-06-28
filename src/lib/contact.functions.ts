import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CONTACT_EMAIL = "harendralamsal4140@gmail.com";
const CONTACT_WHATSAPP = "9779823587535";
const CONTACT_SMS = "+9779823587535";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name too short").max(80),
  email: z.string().trim().email("Invalid email").max(160),
  phone: z.string().trim().max(40).optional().default(""),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(3, "Please write a message").max(2000),
});

type ContactInput = z.infer<typeof contactSchema>;

function leadText(data: ContactInput) {
  return [
    "New hire request from harendralamsal.com",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone/WhatsApp: ${data.phone}` : null,
    `Subject: ${data.subject}`,
    "",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendEmail(data: ContactInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "RESEND_API_KEY is not configured" };

  const from = process.env.CONTACT_EMAIL_FROM || "Harendra Website <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [CONTACT_EMAIL],
      reply_to: data.email,
      subject: `Hire request: ${data.subject}`,
      text: leadText(data),
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Email notification failed: ${message}`);
  }

  return { sent: true };
}

async function sendSms(data: ContactInput) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.CONTACT_SMS_TO || CONTACT_SMS;

  if (!accountSid || !authToken || !from) {
    return { sent: false, reason: "Twilio SMS is not configured" };
  }

  const body = new URLSearchParams({
    From: from,
    To: to,
    Body: leadText(data).slice(0, 1500),
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`SMS notification failed: ${message}`);
  }

  return { sent: true };
}

async function sendWhatsApp(data: ContactInput) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    return { sent: false, reason: "WhatsApp Cloud API is not configured" };
  }

  const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: CONTACT_WHATSAPP,
      type: "text",
      text: {
        preview_url: false,
        body: leadText(data),
      },
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`WhatsApp notification failed: ${message}`);
  }

  return { sent: true };
}

export const sendContactLead = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => contactSchema.parse(d))
  .handler(async ({ data }) => {
    const issues: string[] = [];

    const sms = await sendSms(data).catch((error) => {
      issues.push(error instanceof Error ? error.message : "SMS notification failed");
      return { sent: false };
    });

    const email = await sendEmail(data).catch((error) => {
      issues.push(error instanceof Error ? error.message : "Email notification failed");
      return { sent: false };
    });

    const whatsapp = await sendWhatsApp(data).catch((error) => {
      issues.push(error instanceof Error ? error.message : "WhatsApp notification failed");
      return { sent: false };
    });

    if (!sms.sent) issues.push("SMS provider is not configured");
    if (!email.sent) issues.push("Email provider is not configured");
    if (!whatsapp.sent) issues.push("WhatsApp auto-send is not configured");

    return {
      smsSent: sms.sent,
      emailSent: email.sent,
      whatsappSent: whatsapp.sent,
      issues: [...new Set(issues)],
    };
  });
