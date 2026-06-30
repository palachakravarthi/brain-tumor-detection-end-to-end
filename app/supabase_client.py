import os
from pathlib import Path

# --- TLS / certificate setup (must run before the Supabase client is created) ---
# On Windows, antivirus tools like Avast intercept HTTPS for "SSL/TLS scanning"
# and re-sign traffic with their own root CA. That root is trusted by Windows but
# NOT by Python's bundled certifi, so requests fail with CERTIFICATE_VERIFY_FAILED.
# truststore makes Python verify against the Windows certificate store instead.
import truststore
truststore.inject_into_ssl()

# A stale SSL_CERT_FILE / SSL_CERT_DIR pointing at a missing file makes httpx
# crash on startup (FileNotFoundError). Drop it so the OS trust store is used.
for _var in ("SSL_CERT_FILE", "SSL_CERT_DIR"):
    if _var in os.environ and not os.path.exists(os.environ[_var]):
        os.environ.pop(_var)

from dotenv import load_dotenv
from supabase import create_client

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        f"Missing Supabase credentials. Checked {env_path} (exists={env_path.exists()}). "
        "Set SUPABASE_URL and SUPABASE_KEY in your .env file."
    )

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
