import re

def os_from_ua(ua, hint=""):
    hint = hint.strip("\"' \t")
    m = re.search(r"Android ([\d.]+)", ua, re.I)
    m2 = re.search(r"OS (\d+)[._](\d+)", ua)
    m3 = re.search(r"Mac OS X (\d+)[._](\d+)", ua)
    if re.search(r"Windows NT 10", ua, re.I): return "Windows 10/11"
    if re.search(r"Windows NT 6\.3", ua, re.I): return "Windows 8.1"
    if re.search(r"Windows NT 6\.2", ua, re.I): return "Windows 8"
    if re.search(r"Windows NT 6\.1", ua, re.I): return "Windows 7"
    if re.search(r"Windows", ua, re.I) or hint.lower() == "windows": return "Windows"
    if m: return "Android " + m.group(1)
    if re.search(r"Android", ua, re.I) or hint.lower() == "android": return "Android"
    if re.search(r"iPad", ua, re.I):
        return ("iPadOS %s.%s" % (m2.group(1), m2.group(2))) if m2 else "iPadOS"
    if re.search(r"iPhone|iPod", ua, re.I):
        return ("iOS %s.%s" % (m2.group(1), m2.group(2))) if m2 else "iOS"
    if re.search(r"CrOS", ua, re.I): return "Chrome OS"
    if m3: return "macOS %s.%s" % (m3.group(1), m3.group(2))
    if re.search(r"Mac OS X|Macintosh", ua, re.I): return "macOS"
    if re.search(r"Linux", ua, re.I): return "Linux"
    return hint or "desconocido"

samples = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15",
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15",
    "",
]
for s in samples:
    print(repr(os_from_ua(s)))
