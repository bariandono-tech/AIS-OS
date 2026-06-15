import { supabase, HAS_SUPABASE } from '../lib/supabaseClient';
import * as localMock from '../data/mockData';

/**
 * Fetch all published stacks
 */
export async function getStacks() {
  if (HAS_SUPABASE && supabase) {
    try {
      const { data, error } = await supabase
        .from('stacks')
        .select('*')
        .eq('is_published', true)
        .order('title', { ascending: true });

      if (error) throw error;
      
      // Hitung content_count secara lokal atau default
      return data.map(stack => ({
        ...stack,
        content_count: stack.content_count || 0 // dapat diperbaiki dengan select count
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
