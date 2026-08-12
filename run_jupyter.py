"""Launch JupyterLab from rl_env with Windows SSL cert-store workaround."""
import ssl
import sys


_orig = ssl.SSLContext.load_default_certs


def _safe_load_default_certs(self, purpose=ssl.Purpose.SERVER_AUTH):
    try:
        return _orig(self, purpose)
    except ssl.SSLError:
        return None


ssl.SSLContext.load_default_certs = _safe_load_default_certs

from jupyterlab.labapp import main

if __name__ == "__main__":
    sys.exit(main())
