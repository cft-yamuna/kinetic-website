import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

// WATI WhatsApp API configuration
const WATI_API_ENDPOINT = 'https://live-mt-server.wati.io/445322'
const WATI_API_TOKEN = process.env.WATI_API_TOKEN

// Send WhatsApp message via WATI
async function sendWhatsAppMessage(phone: string, templateName: string, parameters: { name: string; value: string }[]) {
  console.log('=== WATI WhatsApp Debug ===')
  console.log('Phone received:', phone)
  console.log('Template:', templateName)
  console.log('WATI_API_TOKEN exists:', !!WATI_API_TOKEN)

  if (!WATI_API_TOKEN) {
    console.warn('WATI_API_TOKEN not configured, skipping WhatsApp message')
    return null
  }

  // Format phone number: remove spaces/dashes, add 91 country code if needed
  let formattedPhone = phone.replace(/[\s\-\+]/g, '')
  // If it's a 10-digit Indian number, add country code
  if (formattedPhone.length === 10) {
    formattedPhone = '91' + formattedPhone
  }
  // Remove leading 0 if present after country code
  formattedPhone = formattedPhone.replace(/^0/, '')
  console.log('Formatted phone:', formattedPhone)

  try {
    const requestBody = {
      template_name: templateName,
      broadcast_name: `booking_${Date.now()}`,
      parameters: parameters,
    }
    console.log('Request body:', JSON.stringify(requestBody, null, 2))

    // Use v2 API endpoint
    const url = `${WATI_API_ENDPOINT}/api/v2/sendTemplateMessage?whatsappNumber=${formattedPhone}`
    console.log('WATI URL:', url)

    console.log('Token (first 10 chars):', WATI_API_TOKEN?.substring(0, 10) + '...')

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': WATI_API_TOKEN || '',
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(requestBody),
    })

    const responseText = await response.text()
    console.log('WATI Response status:', response.status)
    console.log('WATI Response text:', responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      console.error('Failed to parse WATI response as JSON')
      return null
    }

    if (!response.ok) {
      console.error('WATI API error:', data)
      return null
    }

    console.log('WhatsApp message sent successfully!')
    return data
  } catch (error) {
    console.error('WhatsApp send error:', error)
    return null
  }
}

const locationInfo = {
  company: "Craftech360",
  address: "WGWP+WV6, Ranganathan Colony, Deepanjali Nagar",
  city: "Bengaluru, Karnataka 560026",
  phone: "+91 9739076766",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=WGWP%2BWV6%2C+Deepanjali+Nagar%2C+Bengaluru%2C+Karnataka+560026"
}

const ADMIN_EMAILS = ['ravi@craftech360.com','yamuna@craftech360.com']

export async function POST(request: Request) {
  try {
    const { name, email, phone, company, date, time } = await request.json()

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send confirmation email to user
    const { data, error } = await resend.emails.send({
      from: 'Craftech360 <bookings@craftech360.com>',
      to: email,
      subject: `Demo Confirmed - ${date} at ${time}`,
      html: `
        <!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light">
          <meta name="supported-color-schemes" content="light">
          <!--[if mso]>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <![endif]-->
          <style>
            :root { color-scheme: light; supported-color-schemes: light; }
            body, table, td, div, p { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            body, #bodyTable { background-color: #ffffff !important; }
            u + .body .gmail-blend-screen { background: #ffffff !important; color: #000000 !important; }
            u + .body .gmail-blend-difference { background: #ffffff !important; mix-blend-mode: normal !important; }
            .logo-light { display: block !important; }
            .logo-dark { display: none !important; }
            @media (prefers-color-scheme: dark) {
              .logo-light { display: none !important; }
              .logo-dark { display: block !important; }
            }
          </style>
        </head>
        <body class="body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;" bgcolor="#ffffff">
          <table role="presentation" id="bodyTable" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="background-color: #ffffff !important;">
            <tr>
              <td align="center" bgcolor="#ffffff" style="background-color: #ffffff !important;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" bgcolor="#ffffff" style="max-width: 600px; background-color: #ffffff !important;">
                  <!-- Header -->
                  <tr>
                    <td align="center" bgcolor="#ffffff" style="padding: 40px 32px 24px; border-bottom: 1px solid #e0e0e0; background-color: #ffffff !important;">
                      <img class="logo-light" src="https://ozkbnimjuhaweigscdby.supabase.co/storage/v1/object/public/cheekoimages/layer-202.png" alt="Craftech360" style="height: 48px; width: auto; display: block;" />
                      <img class="logo-dark" src="https://ozkbnimjuhaweigscdby.supabase.co/storage/v1/object/public/cheekoimages/Craftech360_Logo%20White%201.png" alt="Craftech360" style="height: 48px; width: auto; display: none;" />
                      <p style="color: #808080; font-size: 11px; margin: 12px 0 0 0; letter-spacing: 1px;">KINETIC DISPLAY SOLUTIONS</p>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td bgcolor="#ffffff" style="padding: 40px 32px; background-color: #ffffff !important;">
                      <p style="color: #808080; font-size: 14px; margin: 0 0 4px 0;">Hello,</p>
                      <h2 style="color: #000000; font-size: 28px; margin: 0 0 32px 0; font-weight: 600;">${name}</h2>
                      <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6; margin: 0 0 32px 0;">
                        Your demo session has been confirmed. We look forward to showing you our kinetic display technology.
                      </p>
                      <!-- Details Box -->
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fef6f0" style="background-color: #fef6f0 !important; border-left: 3px solid #E17924; margin-bottom: 32px;">
                        <tr>
                          <td bgcolor="#fef6f0" style="padding: 24px; background-color: #fef6f0 !important;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fef6f0" style="background-color: #fef6f0 !important;">
                              <tr bgcolor="#fef6f0">
                                <td bgcolor="#fef6f0" style="padding: 8px 0; background-color: #fef6f0 !important;"><span style="color: #808080; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Date</span></td>
                                <td bgcolor="#fef6f0" align="right" style="padding: 8px 0; background-color: #fef6f0 !important;"><span style="color: #000000; font-size: 15px; font-weight: 600;">${date}</span></td>
                              </tr>
                              <tr bgcolor="#fef6f0">
                                <td bgcolor="#fef6f0" style="padding: 8px 0; background-color: #fef6f0 !important;"><span style="color: #808080; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Time</span></td>
                                <td bgcolor="#fef6f0" align="right" style="padding: 8px 0; background-color: #fef6f0 !important;"><span style="color: #000000; font-size: 15px; font-weight: 600;">${time}</span></td>
                              </tr>
                              <tr bgcolor="#fef6f0">
                                <td bgcolor="#fef6f0" style="padding: 8px 0; background-color: #fef6f0 !important;"><span style="color: #808080; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Location</span></td>
                                <td bgcolor="#fef6f0" align="right" style="padding: 8px 0; background-color: #fef6f0 !important;"><span style="color: #000000; font-size: 15px; font-weight: 600;">${locationInfo.company}</span></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <!-- Address -->
                      <p style="color: #808080; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Address</p>
                      <p style="color: #333333; font-size: 14px; line-height: 1.6; margin: 0 0 32px 0;">${locationInfo.address}<br>${locationInfo.city}</p>
                      <!-- Button -->
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td bgcolor="#E17924" style="background-color: #E17924; border-radius: 0;">
                            <a href="${locationInfo.mapUrl}" target="_blank" style="display: inline-block; background-color: #E17924; color: #ffffff; text-decoration: none; padding: 14px 36px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Get Directions</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td align="center" bgcolor="#ffffff" style="padding: 24px 32px; border-top: 1px solid #e0e0e0; background-color: #ffffff !important;">
                      <p style="color: #808080; font-size: 13px; margin: 0 0 8px 0;">Questions? Call us at <a href="tel:${locationInfo.phone}" style="color: #E17924; text-decoration: none;">${locationInfo.phone}</a></p>
                      <p style="color: #a0a0a0; font-size: 11px; margin: 0;">&copy; ${new Date().getFullYear()} Craftech360</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send notification email to admins with booking details
    try {
      await resend.emails.send({
        from: 'Craftech360 <bookings@craftech360.com>',
        to: ADMIN_EMAILS,
        subject: `New Demo Booking - ${name} on ${date}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light only">
            <meta name="supported-color-schemes" content="light only">
            <style>
              :root { color-scheme: light only; }
              @media (prefers-color-scheme: dark) {
                body, .email-body, .email-container { background-color: #ffffff !important; }
              }
            </style>
          </head>
          <body class="email-body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff !important;">
            <div class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff !important; padding: 32px;">
              <div style="border-bottom: 2px solid #E17924; padding-bottom: 16px; margin-bottom: 24px; background-color: #ffffff;">
                <h1 style="color: #E17924; margin: 0; font-size: 24px;">New Demo Booking</h1>
              </div>
              <div style="background-color: #f9f9f9 !important; border-left: 4px solid #E17924; padding: 20px; margin-bottom: 24px;">
                <h2 style="color: #333333; margin: 0 0 16px 0; font-size: 18px;">Booking Information</h2>
                <table style="width: 100%; border-collapse: collapse; background-color: #f9f9f9;">
                  <tr><td style="padding: 8px 0; color: #666666; font-weight: 600; width: 120px; background-color: #f9f9f9;">Name:</td><td style="padding: 8px 0; color: #333333; background-color: #f9f9f9;">${name}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666666; font-weight: 600; background-color: #f9f9f9;">Email:</td><td style="padding: 8px 0; color: #333333; background-color: #f9f9f9;"><a href="mailto:${email}" style="color: #E17924;">${email}</a></td></tr>
                  <tr><td style="padding: 8px 0; color: #666666; font-weight: 600; background-color: #f9f9f9;">Phone:</td><td style="padding: 8px 0; color: #333333; background-color: #f9f9f9;"><a href="tel:${phone || 'N/A'}" style="color: #E17924;">${phone || 'N/A'}</a></td></tr>
                  <tr><td style="padding: 8px 0; color: #666666; font-weight: 600; background-color: #f9f9f9;">Company:</td><td style="padding: 8px 0; color: #333333; background-color: #f9f9f9;">${company || 'N/A'}</td></tr>
                </table>
              </div>
              <div style="background-color: #fff8f0 !important; border-left: 4px solid #E17924; padding: 20px; margin-bottom: 24px;">
                <h2 style="color: #333333; margin: 0 0 16px 0; font-size: 18px;">Schedule</h2>
                <table style="width: 100%; border-collapse: collapse; background-color: #fff8f0;">
                  <tr><td style="padding: 8px 0; color: #666666; font-weight: 600; width: 120px; background-color: #fff8f0;">Date:</td><td style="padding: 8px 0; color: #333333; font-weight: 600; background-color: #fff8f0;">${date}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666666; font-weight: 600; background-color: #fff8f0;">Time:</td><td style="padding: 8px 0; color: #333333; font-weight: 600; background-color: #fff8f0;">${time}</td></tr>
                </table>
              </div>
              <div style="text-align: center; color: #999999; font-size: 12px; padding-top: 16px; border-top: 1px solid #eeeeee; background-color: #ffffff;">
                <p style="margin: 0;">This is an automated notification from the Kinetic Display booking system.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      })
    } catch (adminEmailError) {
      console.error('Admin notification email error:', adminEmailError)
    }

    // Send WhatsApp confirmation to user via WATI
    if (phone) {
      try {
        await sendWhatsAppMessage(phone, 'demo_cft', [
          { name: 'name', value: name },
          { name: 'date', value: date },
        ])
      } catch (whatsappError) {
        // Don't fail the booking if WhatsApp message fails
        console.error('WhatsApp message error:', whatsappError)
      }
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
