import nodemailer from "nodemailer";

export function isMailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.QUOTE_ALERT_EMAIL);
}

export async function sendQuoteAlert(quote: {
  id: string;
  name: string;
  city: string;
  service: string;
  email: string;
  phone: string;
  details: string;
}) {
  if (!isMailConfigured()) return;

  const transport = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASSWORD! },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
  });

  await transport.sendMail({
    from: { name: "Bâti Pool", address: process.env.SMTP_USER! },
    to: process.env.QUOTE_ALERT_EMAIL,
    replyTo: quote.email || undefined,
    subject: `Nouvelle demande de devis Bâti Pool — ${quote.service}`,
    text: `Nom : ${quote.name}\nVille : ${quote.city}\nService : ${quote.service}\nEmail : ${quote.email || "Non renseigné"}\nTéléphone : ${quote.phone || "Non renseigné"}\n\nProjet :\n${quote.details}\n\nRéférence : ${quote.id}`,
  });
}
