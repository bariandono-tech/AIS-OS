import { supabase, HAS_SUPABASE } from '../lib/supabaseClient';
import * as localMock from '../data/mockData';

/**
 * Fetch all published stacks
 */
export async function getStacks() {
  if (HAS_SUPABASE && supabase) {
    try {
      // Coba panggil RPC security definer untuk mendapatkan jumlah konten yang akurat bypass RLS
      const { data, error } = await supabase
        .rpc('get_published_stacks');

      if (!error && data) {
        return data.map(stack => ({
          ...stack,
          content_count: parseInt(stack.content_count || 0, 10)
        }));
      }

      // Fallback jika RPC belum terbuat di database
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('stacks')
        .select('*')
        .eq('is_published', true)
        .order('title', { ascending: true });

      if (fallbackError) throw fallbackError;
      
      return fallbackData.map(stack => ({
        ...stack,
        content_count: 0
      }));
    } catch (err) {
      console.warn('Supabase getStacks failed, using mock fallback:', err.message);
    }
  }
  return localMock.stacks.filter(s => s.is_published);
}

/**
 * Fetch all content items within a stack slug
 */
export async function getContentByStack(stackSlug) {
  if (HAS_SUPABASE && supabase) {
    try {
      // 1. Dapatkan stack ID
      const { data: stackData, error: stackError } = await supabase
        .from('stacks')
        .select('id')
        .eq('slug', stackSlug)
        .single();

      if (stackError) throw stackError;

      // 2. Dapatkan content items
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('stack_id', stackData.id)
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn(`Supabase getContentByStack failed for ${stackSlug}, using mock fallback:`, err.message);
    }
  }
  return localMock.getContentByStack(stackSlug);
}

/**
 * Fetch flashcards for a specific content item ID
 */
export async function getFlashcards(contentItemId) {
  if (HAS_SUPABASE && supabase) {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('content_item_id', contentItemId);

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn(`Supabase getFlashcards failed for ${contentItemId}, using mock:`, err.message);
    }
  }
  return localMock.getFlashcardsByContentId(contentItemId);
}

/**
 * Fetch references for a specific content item ID
 */
export async function getReferences(contentItemId) {
  if (HAS_SUPABASE && supabase) {
    try {
      const { data, error } = await supabase
        .from('references')
        .select('*')
        .eq('content_item_id', contentItemId);

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn(`Supabase getReferences failed for ${contentItemId}, using mock:`, err.message);
    }
  }
  return localMock.getReferencesByContentId(contentItemId);
}

/**
 * Fetch list of stack IDs purchased by the current user
 */
export async function getPurchases() {
  if (HAS_SUPABASE && supabase) {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('stack_id');

      if (error) throw error;
      return data.map(p => p.stack_id);
    } catch (err) {
      console.warn('Failed to fetch purchases:', err.message);
    }
  }
  return [];
}

/**
 * Purchase a stack (simulated check-out)
 */
export async function purchaseStack(stackId) {
  if (HAS_SUPABASE && supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Pengguna tidak terautentikasi.');

      // 1. Coba panggil webhook API (simulasi server-side payment)
      try {
        const response = await fetch('/api/pay-webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: user.id,
            stack_id: stackId
          })
        });

        if (response.ok) {
          const resData = await response.json();
          console.log('Payment webhook simulated successfully:', resData);
          return resData.data;
        } else if (response.status === 404) {
          console.warn('Webhook endpoint not found (likely running local Vite dev server). Falling back to direct client-side insert.');
        } else {
          const errData = await response.json();
          throw new Error(errData.error || 'Webhook failed');
        }
      } catch (webhookErr) {
        console.warn('API payment webhook failed, falling back to direct database insert:', webhookErr.message);
      }

      // 2. Fallback: Direct insert via client SDK
      const { data, error } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          stack_id: stackId
        });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Failed to purchase stack:', err.message);
      throw err;
    }
  }
  return null;
}
