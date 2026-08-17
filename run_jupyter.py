"""Launch JupyterLab from rl_env with Windows SSL cert-store workaround."""
from contextlib import contextmanager
import ssl
import sys
import warnings


@contextmanager
def _cert_store_workaround():
    original = ssl.SSLContext.load_default_certs

    def load_default_certs(context, purpose=ssl.Purpose.SERVER_AUTH):
        try:
            return original(context, purpose)
        except ssl.SSLError as error:
            warnings.warn(
                f"Windows certificate store could not be loaded: {error}",
                RuntimeWarning,
                stacklevel=2,
            )
            return None

    ssl.SSLContext.load_default_certs = load_default_certs
    try:
        yield
    finally:
        ssl.SSLContext.load_default_certs = original


with _cert_store_workaround():
    from jupyterlab.labapp import main

    if __name__ == "__main__":
        sys.exit(main())
