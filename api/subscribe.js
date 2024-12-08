function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Log the request details
    console.log('Making request to Loops API:', {
      email,
      hasApiKey: !!process.env.LOOPS_API_KEY
    });

    // Replace YOUR_FORM_ID with the actual form ID from your Loops dashboard
    const loopsResponse = await fetch('https://app.loops.so/api/newsletter-form/clll51cjn00qdmh0o3m691aw8', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.LOOPS_API_KEY
      },
      body: JSON.stringify({ email })
    });

    console.log('Loops API Response:', {
      status: loopsResponse.status,
      statusText: loopsResponse.statusText
    });

    const responseText = await loopsResponse.text();
    console.log('Response body:', responseText);

    if (!loopsResponse.ok) {
      throw new Error(`Subscription failed: ${responseText}`);
    }

    return res.status(200).json({ 
      message: 'Subscribed successfully',
      status: loopsResponse.status
    });

  } catch (error) {
    console.error('Newsletter error:', error);
    return res.status(500).json({ 
      error: error.message || 'Subscription failed',
      details: error.toString()
    });
  }
}