from google.genai import Client
import os


def get_google_genai_client() -> Client:
    """Initialize and return the Google GenAI client."""
    print("🔍 Initializing Google GenAI client...")

    api_key = os.getenv("GOOGLE_GENAI_API_KEY")

    if not api_key:
        raise ValueError("Google GenAI API key not found in environment variables.")

    print("✅ Google GenAI client initialized successfully.")
    return Client(api_key=api_key)


genai_client = get_google_genai_client()
