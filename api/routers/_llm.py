"""Shared OpenRouter/LLM helper used by game routers.

Provides a single async function `chat_completion(system, user_prompt, *, temperature=0.8, max_tokens=300)`
that handles model candidate fallback, retries, and returns the assistant text (string).
If OPENROUTER_API_KEY is not set, raises RuntimeError so callers can provide deterministic fallback.
"""
import os
import httpx
from typing import Optional, List

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
OPENROUTER_BASE_URL = os.getenv('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1')
OPENROUTER_MODEL = os.getenv('OPENROUTER_MODEL')

DEFAULT_MODELS = ['meta-llama/llama-3.3-70b-instruct:free', 'google/gemma-3-27b-it:free']


def _model_candidates() -> List[str]:
    lst: List[str] = []
    if OPENROUTER_MODEL:
        lst.append(OPENROUTER_MODEL)
    for m in DEFAULT_MODELS:
        if m not in lst:
            lst.append(m)
    return lst


async def chat_completion(system: str = None, user_prompt: str = None, *, messages: List[dict] = None, temperature: float = 0.8, max_tokens: int = 300) -> str:
    """Call the OpenRouter-compatible chat completions endpoint and return assistant text.

    Raises RuntimeError if OPENROUTER_API_KEY is not configured.
    """
    if not OPENROUTER_API_KEY:
        raise RuntimeError('OPENROUTER_API_KEY not configured')

    models = _model_candidates()
    url = f"{OPENROUTER_BASE_URL.rstrip('/')}/chat/completions"
    headers = {'Authorization': f'Bearer {OPENROUTER_API_KEY}', 'Content-Type': 'application/json'}

    # Use provided messages OR build from system/user_prompt
    chat_messages = messages
    if not chat_messages:
        chat_messages = [
            {'role': 'system', 'content': system or "You are a helpful AI assistant."},
            {'role': 'user', 'content': user_prompt or ""},
        ]

    async with httpx.AsyncClient(timeout=30) as client:
        for model in models:
            payload = {
                'model': model,
                'messages': chat_messages,
                'temperature': temperature,
                'max_tokens': max_tokens,
            }
            try:
                resp = await client.post(url, json=payload, headers=headers)
                resp.raise_for_status()
                data = resp.json()
                text = (data.get('choices') or [{}])[0].get('message', {}).get('content', '') or ''
                if text:
                    return text.strip()
            except Exception:
                # try next model
                continue

    # If all candidates failed, raise
    raise RuntimeError('LLM call failed for all model candidates')


async def safe_chat_completion(system: str = None, user_prompt: str = None, *, messages: List[dict] = None, temperature: float = 0.8, max_tokens: int = 300, fallback: Optional[str] = None) -> str:
    """Call chat_completion but return a fallback string when LLM unavailable or errors occur.

    This helps routers remain functional in local/dev environments without OPENROUTER_API_KEY.
    """
    try:
        return await chat_completion(system, user_prompt, messages=messages, temperature=temperature, max_tokens=max_tokens)
    except Exception:
        # On any failure, return provided fallback or a generic deterministic message.
        if fallback is not None:
            return fallback
        return "[llm-unavailable] Default response — OpenRouter key not configured or request failed."

