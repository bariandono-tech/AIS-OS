import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { user_id, stack_id } = req.body;

  if (!user_id || !stack_id) {
    return res.status(400).json({ error: 'Missing user_id or stack_id' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Database environment variables not configured on server' });
  }

  try {
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data, error } = await supabaseAdmin
      .from('purchases')
      .upsert({
        user_id,
        stack_id,
        purchased_at: new Date().toISOString()
      }, { onConflict: 'user_id,stack_id' })
      .select();

    if (error) throw error;

    return res.status(200).json({ 
      success: true, 
      message: 'Simulated payment verified and stack unlocked successfully.', 
      data 
    });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
}
