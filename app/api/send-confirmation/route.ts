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

export async function POST(request: Request) {
  try {
    const { name, email, company, date, time } = await request.json()

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: 'Craftech360 <bookings@craftech360.com>',
      to: email,
      subject: `Your Demo Booking is Confirmed - ${date}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #E17924; font-size: 28px; margin: 0;">Craftech360</h1>
              <p style="color: #666; font-size: 14px; margin-top: 8px;">Kinetic Display Solutions</p>
            </div>

            <!-- Main Card -->
            <div style="background: linear-gradient(145deg, #1a1a1a 0%, #111 100%); border-radius: 16px; padding: 32px; border: 1px solid #333;">

              <!-- Confirmation Badge -->
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="background-color: #22c55e; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                  Booking Confirmed
                </span>
              </div>

              <h2 style="color: #ffffff !important; font-size: 24px; text-align: center; margin: 0 0 8px 0;">
                Hi <span style="color: #E17924 !important;">${name}</span>!
              </h2>
              <p style="color: #e0e0e0 !important; text-align: center; margin: 0 0 32px 0; font-size: 16px;">
                Your demo session has been scheduled successfully.
              </p>

              <!-- Booking Details -->
              <div style="background-color: #2a1f15; border: 1px solid #E17924; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #E17924 !important; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 16px 0;">
                  Appointment Details
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="color: #e0e0e0 !important; padding: 8px 0; font-size: 14px;">Date</td>
                    <td style="color: #ffffff !important; padding: 8px 0; font-size: 14px; text-align: right; font-weight: 700;">${date}</td>
                  </tr>
                  <tr>
                    <td style="color: #e0e0e0 !important; padding: 8px 0; font-size: 14px;">Time</td>
                    <td style="color: #ffffff !important; padding: 8px 0; font-size: 14px; text-align: right; font-weight: 700;">${time}</td>
                  </tr>
                  <tr>
                    <td style="color: #e0e0e0 !important; padding: 8px 0; font-size: 14px;">Company</td>
                    <td style="color: #ffffff !important; padding: 8px 0; font-size: 14px; text-align: right; font-weight: 700;">${company}</td>
                  </tr>
                </table>
              </div>

              <!-- Location Details -->
              <div style="background-color: #1a1a1a; border: 1px solid #444444; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #E17924 !important; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 16px 0;">
                  Showroom Location
                </h3>
                <p style="color: #ffffff !important; font-size: 16px; font-weight: 700; margin: 0 0 8px 0;">
                  ${locationInfo.company}
                </p>
                <p style="color: #e0e0e0 !important; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
                  ${locationInfo.address}<br>
                  ${locationInfo.city}
                </p>
                <p style="color: #ffffff !important; font-size: 14px; margin: 0;">
                  <strong style="color: #E17924 !important;">Call:</strong> ${locationInfo.phone}
                </p>
              </div>

              <!-- Get Directions Button -->
              <div style="text-align: center;">
                <a href="${locationInfo.mapUrl}" target="_blank" style="display: inline-block; background-color: #E17924; color: #000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                  Get Directions
                </a>
              </div>

            </div>

            <!-- What to Expect -->
            <div style="margin-top: 32px; padding: 24px; background-color: rgba(255, 255, 255, 0.02); border-radius: 12px; border: 1px solid #222;">
              <h4 style="color: #fff; font-size: 14px; margin: 0 0 16px 0;">What to Expect:</h4>
              <ul style="color: #888; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Live demonstrations of all kinetic displays</li>
                <li>1-on-1 consultation with our experts</li>
                <li>Discussion of custom solutions for your needs</li>
                <li>No obligations - just experience the technology</li>
              </ul>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #222;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                Questions? Call us at ${locationInfo.phone}
              </p>
              <p style="color: #444; font-size: 11px; margin-top: 16px;">
                &copy; ${new Date().getFullYear()} Craftech360. All rights reserved.
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

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
