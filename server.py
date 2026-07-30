import http.server
import socketserver
import os
import sys

PORT = 8085
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    print("=" * 70)
    print(f"[+] SERVIDOR WEB SAUL ELKIND RETAIL ANALYTICS RODANDO NA PORTA {PORT}")
    print(f"[-] Acesse no seu navegador: http://localhost:{PORT}")
    print("=" * 70)
    
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[!] Servidor finalizado com sucesso.")

if __name__ == '__main__':
    run()
