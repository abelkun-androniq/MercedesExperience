# Dev server on :8765 (npm run serve). Like `python3 -m http.server`, but every response says Cache-Control: no-cache, so
# the browser revalidates each module and an edited file shows on a plain reload (plain http.server sends no cache header,
# and browsers then keep files for a while without asking).
import http.server


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


http.server.ThreadingHTTPServer(("", 8765), Handler).serve_forever()
