/**
 * WhatsApp integration utility for SakhiSphere
 * Generates direct chat URLs with pre-formatted, dignified messages
 */

export function cleanPhoneNumber(phone: string): string {
  // Strip spaces, dashes, parentheses and plus signs for the wa.me URL
  return phone.replace(/[^0-9]/g, '');
}

export function generateWhatsAppLink(phone: string, text: string): string {
  const cleaned = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleaned}?text=${encodedText}`;
}

export function buildProductInquiryMessage(
  businessName: string,
  productTitle: string,
  price?: number,
  currency = 'USD'
): string {
  const priceText = price !== undefined ? ` (${currency} $${price})` : '';
  return `Namaste Sister! I discovered your business "${businessName}" on SakhiSphere. I am deeply interested in your handcrafted piece "${productTitle}"${priceText}. Could you share more details about your creation process and availability? With respect,`;
}

export function buildServiceBookingMessage(
  businessName: string,
  serviceTitle: string,
  price?: number,
  duration?: string
): string {
  const durationText = duration ? ` (${duration})` : '';
  const priceText = price !== undefined ? ` at $${price}` : '';
  return `Namaste! I found "${businessName}" on SakhiSphere. I would love to book or consult about your service "${serviceTitle}"${durationText}${priceText}. Please let me know what dates and times work best for you.`;
}

export function buildSisterhoodEncouragementMessage(
  founderName: string,
  businessName: string
): string {
  return `Dear ${founderName}, I just read your inspiring journey with "${businessName}" on SakhiSphere! "Trust the Woman. Believe in the Craft. Back the Vision." Thank you for keeping this sovereign craft alive. Backing you all the way! 🌸`;
}

export function buildCustomOrderMessage(
  businessName: string
): string {
  return `Hello Sister! I am exploring "${businessName}" on SakhiSphere. I love your authentic work and would like to inquire about a custom bespoke order. Could we discuss ideas and timelines?`;
}

export function buildGeneralInquiryMessage(
  businessName: string
): string {
  return `Namaste! I found "${businessName}" on SakhiSphere. I love your authentic craft and would like to connect directly. "Trust the Woman. Believe in the Craft. Back the Vision."`;
}

