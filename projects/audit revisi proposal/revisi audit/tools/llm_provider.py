"""
LLM Provider Helper — Centralized API client initialization.
Supports hybrid routing: different agents can use different providers.
"""
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load .env once
_current_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path=os.path.join(_current_dir, "..", ".env"))

def get_client(force_provider=None):
    """
    Returns (client, model_name) tuple.
    
    Args:
        force_provider: Override LLM_PROVIDER from .env. 
                        Use "google" for Gemini (free, good for surface-level tasks)
                        Use "dinoiki" for Claude (paid, good for deep reasoning)
                        If None, reads from .env LLM_PROVIDER variable.
    """
    provider = (force_provider or os.getenv("LLM_PROVIDER", "freemodel")).lower()
    
    if provider == "google":
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key or api_key == "your_google_api_key_here":
            raise ValueError("GOOGLE_API_KEY not set in .env")
        client = OpenAI(
            api_key=api_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )
        model_name = "gemini-2.0-flash"
    elif provider == "dinoiki":
        api_key = os.getenv("DINOIKI_API_KEY")
        if not api_key or api_key == "your_dinoiki_api_key_here":
            raise ValueError("DINOIKI_API_KEY not set in .env")
        client = OpenAI(
            api_key=api_key,
            base_url="https://ai.dinoiki.com/v1"
        )
        model_name = "claude-opus-4-8"
    elif provider == "freemodel":
        api_key = os.getenv("FREEMODEL_API_KEY")
        if not api_key or api_key == "your_freemodel_api_key_here":
            raise ValueError("FREEMODEL_API_KEY not set in .env")
        client = OpenAI(
            api_key=api_key,
            base_url="https://cc.freemodel.dev/v1"
        )
        model_name = "claude-sonnet-4-6" # Menggunakan Sonnet karena Opus sedang Service Unavailable di server freemodel
    elif provider == "nararouter":
        api_key = os.getenv("NARAROUTER_API_KEY")
        if not api_key:
            raise ValueError("NARAROUTER_API_KEY not set in .env")
        client = OpenAI(
            api_key=api_key,
            base_url="https://router.naraya.ai/v1"
        )
        model_name = "mimo-v2.5-pro-free"
    elif provider == "openrouter":
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise ValueError("OPENROUTER_API_KEY not set in .env")
        client = OpenAI(
            api_key=api_key,
            base_url="https://openrouter.ai/api/v1"
        )
        model_name = "nvidia/nemotron-3-ultra-550b-a55b:free"
    else:
        raise ValueError(f"Unknown LLM_PROVIDER: {provider}. Use 'google', 'dinoiki', 'nararouter', or 'openrouter'.")
    
    return client, model_name
