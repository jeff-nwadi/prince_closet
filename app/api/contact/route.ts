import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, orderNumber, message } = body;

    // Backend Security: Input validation
    if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
      return NextResponse.json({ error: 'First name is required' }, { status: 400 });
    }
    
    if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
      return NextResponse.json({ error: 'Last name is required' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Optional fields
    const safeOrderNumber = orderNumber && typeof orderNumber === 'string' ? orderNumber.trim() : null;

    // Simulate sending email or saving to DB
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Here you would normally integrate with SendGrid, Resend, or your DB
    console.log('Support Request Received:', {
      firstName,
      lastName,
      email,
      orderNumber: safeOrderNumber,
      message,
    });

    return NextResponse.json({ success: true, message: 'Your message has been sent successfully. We will get back to you shortly.' }, { status: 200 });
  } catch (error) {
    // Backend Security: Never expose stack traces
    console.error('Support API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while processing your request.' }, { status: 500 });
  }
}
