import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: NextRequest) {
  try {
    console.log('[Contact API] Received request');
    const body = await req.json();
    console.log('[Contact API] Request body:', { ...body, message: body.message?.substring(0, 50) + '...' });
    
    const { name, email, message } = body;

    if (!name || !email || !message) {
      console.error('[Contact API] Missing fields:', { name: !!name, email: !!email, message: !!message });
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('[Contact API] Invalid email format:', email);
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!resend) {
      console.warn('[Contact API] RESEND_API_KEY missing. Logging contact submission only.');
      console.log('Contact form submission (not emailed):', { name, email, message });
      // Still return success even without Resend configured
      return NextResponse.json({ 
        success: true, 
        message: 'Message received! (Email service not configured)' 
      });
    } else {
      const { data, error } = await resend.emails.send({
        from: 'GermanPath Contact <onboarding@resend.dev>',
        to: ['smarviastudio@gmail.com'],
        replyTo: email,
        subject: `Contact Form: ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dd0000;">New Contact Form Submission</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            </div>
            <div style="background: #fff; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;" />
            <p style="font-size: 12px; color: #999;">
              This email was sent from the GermanPath contact form.
            </p>
          </div>
        `,
      });

      if (error) {
        console.error('[Contact API] Resend error:', error);
        return NextResponse.json(
          { error: 'Failed to send email. Please try again.' },
          { status: 500 }
        );
      }

      console.log('[Contact API] Email sent successfully:', data);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully! We will get back to you soon.' 
    });

  } catch (error) {
    console.error('[Contact API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
