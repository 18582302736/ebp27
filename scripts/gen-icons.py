#!/usr/bin/env python3
"""Generate PWA icons - a simple green leaf shape."""
import struct, zlib, os

def create_png(size, filename):
    """Create a simple PNG icon with a green circle (leaf-like)."""
    width, height = size, size

    # Build raw pixel data (RGBA)
    raw = b''
    cx, cy = size / 2, size / 2
    r = size * 0.38
    for y in range(height):
        raw += b'\x00'  # filter byte
        for x in range(width):
            dx, dy = (x - cx) / r, (y - cy) / r
            dist = (dx*dx + dy*dy) ** 0.5
            if dist < 0.85:
                # Green gradient inside circle
                g = int(180 - dist * 60)
                raw += bytes([0x5b, min(g + 30, 220), 0x5a, 255])
            elif dist < 1.0:
                # Anti-alias edge
                alpha = int(255 * (1.0 - dist) / 0.15)
                alpha = max(0, min(255, alpha))
                g = int(180 - dist * 60)
                raw += bytes([0x5b, min(g + 30, 220), 0x5a, alpha])
            else:
                raw += bytes([0xf7, 0xfa, 0xf5, 0])  # transparent

    def chunk(ctype, data):
        c = ctype + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', ihdr)
    png += chunk(b'IDAT', zlib.compress(raw))
    png += chunk(b'IEND', b'')

    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'wb') as f:
        f.write(png)
    print(f'Created {filename} ({size}x{size})')

create_png(192, 'icons/icon-192.png')
create_png(512, 'icons/icon-512.png')