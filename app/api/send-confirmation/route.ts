import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const locationInfo = {
  company: "Craftech360",
  address: "WGWP+WV6, Ranganathan Colony, Deepanjali Nagar",
  city: "Bengaluru, Karnataka 560026",
  phone: "+91 9739076766",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=WGWP%2BWV6%2C+Deepanjali+Nagar%2C+Bengaluru%2C+Karnataka+560026"
}

const ADMIN_EMAILS = ['ravi@craftech360.com', 'abilash@craftech360.com', 'yamuna@craftech360.com']

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
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff;">

          <!-- Main Container with subtle pattern background -->
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; background-image: radial-gradient(circle at 20% 20%, rgba(225, 121, 36, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(225, 121, 36, 0.04) 0%, transparent 40%);">

            <!-- Header -->
            <div style="padding: 40px 32px 24px; text-align: center; border-bottom: 1px solid rgba(0,0,0,0.08);">
              <img src="https://ozkbnimjuhaweigscdby.supabase.co/storage/v1/object/public/cheekoimages/layer-202.png" alt="Craftech360" style="height: 48px; width: auto;" />
              <p style="color: rgba(0,0,0,0.5); font-size: 11px; margin: 12px 0 0 0; letter-spacing: 1px;">KINETIC DISPLAY SOLUTIONS</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 32px;">

              <!-- Greeting -->
              <div style="margin-bottom: 32px;">
                <p style="color: rgba(0,0,0,0.5); font-size: 14px; margin: 0 0 4px 0;">Hello,</p>
                <h2 style="color: #000000; font-size: 28px; margin: 0; font-weight: 600;">${name}</h2>
              </div>

              <!-- Confirmation Message -->
              <p style="color: rgba(0,0,0,0.7); font-size: 15px; line-height: 1.6; margin: 0 0 32px 0;">
                Your demo session has been confirmed. We look forward to showing you our kinetic display technology.
              </p>

              <!-- Appointment Details Box -->
              <div style="background: rgba(225, 121, 36, 0.08); border-left: 3px solid #E17924; padding: 24px; margin-bottom: 32px;">
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: rgba(0,0,0,0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Date</span>
                    </td>
                    <td style="padding: 8px 0; text-align: right;">
                      <span style="color: #000000; font-size: 15px; font-weight: 600;">${date}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: rgba(0,0,0,0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Time</span>
                    </td>
                    <td style="padding: 8px 0; text-align: right;">
                      <span style="color: #000000; font-size: 15px; font-weight: 600;">${time}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: rgba(0,0,0,0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Location</span>
                    </td>
                    <td style="padding: 8px 0; text-align: right;">
                      <span style="color: #000000; font-size: 15px; font-weight: 600;">${locationInfo.company}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Address -->
              <div style="margin-bottom: 32px;">
                <p style="color: rgba(0,0,0,0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Address</p>
                <p style="color: rgba(0,0,0,0.8); font-size: 14px; line-height: 1.6; margin: 0;">
                  ${locationInfo.address}<br>
                  ${locationInfo.city}
                </p>
              </div>

              <!-- Get Directions Button -->
              <div style="text-align: left; margin-bottom: 16px;">
                <a href="${locationInfo.mapUrl}" target="_blank" style="display: inline-block; background: #E17924; color: #ffffff; text-decoration: none; padding: 14px 36px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                  Get Directions
                </a>
              </div>

            </div>

            <!-- Footer -->
            <div style="padding: 24px 32px; border-top: 1px solid rgba(0,0,0,0.08); text-align: center;">
              <p style="color: rgba(0,0,0,0.5); font-size: 13px; margin: 0 0 8px 0;">
                Questions? Call us at <a href="tel:${locationInfo.phone}" style="color: #E17924; text-decoration: none;">${locationInfo.phone}</a>
              </p>
              <p style="color: rgba(0,0,0,0.4); font-size: 11px; margin: 0;">
                &copy; ${new Date().getFullYear()} Craftech360
              </p>
            </div>

          </div>
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
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px;">

              <!-- Header -->
              <div style="border-bottom: 2px solid #E17924; padding-bottom: 16px; margin-bottom: 24px;">
                <h1 style="color: #E17924; margin: 0; font-size: 24px;">New Demo Booking</h1>
              </div>

              <!-- Booking Details -->
              <div style="background: #f9f9f9; border-left: 4px solid #E17924; padding: 20px; margin-bottom: 24px;">
                <h2 style="color: #333; margin: 0 0 16px 0; font-size: 18px;">Booking Information</h2>

                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600; width: 120px;">Name:</td>
                    <td style="padding: 8px 0; color: #333;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Email:</td>
                    <td style="padding: 8px 0; color: #333;"><a href="mailto:${email}" style="color: #E17924;">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Phone:</td>
                    <td style="padding: 8px 0; color: #333;"><a href="tel:${phone || 'N/A'}" style="color: #E17924;">${phone || 'N/A'}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Company:</td>
                    <td style="padding: 8px 0; color: #333;">${company || 'N/A'}</td>
                  </tr>
                </table>
              </div>

              <!-- Schedule Details -->
              <div style="background: #fff8f0; border-left: 4px solid #E17924; padding: 20px; margin-bottom: 24px;">
                <h2 style="color: #333; margin: 0 0 16px 0; font-size: 18px;">Schedule</h2>

                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600; width: 120px;">Date:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600;">${date}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Time:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600;">${time}</td>
                  </tr>
                </table>
              </div>

              <!-- Footer -->
              <div style="text-align: center; color: #999; font-size: 12px; padding-top: 16px; border-top: 1px solid #eee;">
                <p style="margin: 0;">This is an automated notification from the Kinetic Display booking system.</p>
              </div>

            </div>
          </body>
          </html>
        `,
      })
    } catch (adminEmailError) {
      // Log admin email error but don't fail the request since user confirmation was sent
      console.error('Admin notification email error:', adminEmailError)
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
