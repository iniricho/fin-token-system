# validator-py/parse_fin.py
import re
import time
import requests

def parse_fin():
    cid     = "bafybeibm7cmyaonoyokaw5bvbwu57c2lm7ei4x2w75sg6xcwgcdhekcxzu"
    gateway = "https://harlequin-known-coyote-427.mypinata.cloud"

    resp = requests.get(gateway)
    resp.raise_for_status()
    text = resp.text

    # Extract transaction code (:20:)
    m20 = re.search(r":20:([A-Za-z0-9]+)", text)
    if not m20:
        raise ValueError("Missing :20: tag for transaction code")
    tx_code = m20.group(1)

    # Extract amount (:32A:YYMMDDCUR1234,56)
    m32 = re.search(r":32A:\d{6}[A-Z]{3}([\d\.,]+)", text)
    raw = m32.group(1) if m32 else "0"
    clean = raw.replace(".", "").replace(",", ".")
    amount_eur   = float(clean)
    amount_units = int(amount_eur * 10**18)

    # Extract beneficiary name/account (:59:)
    m59 = re.search(r":59:(?:/[\dA-Za-z]+)?\s*([\s\S]*?)(?=\n:[0-9]{2}:)", text)
    receiver = m59.group(1).strip() if m59 else ""

    nonce = int(time.time() * 1000)

    return {
        "cid":       cid,
        "txCode":    tx_code,
        "receiver":  receiver,
        "amount":    amount_units,
        "nonce":     nonce
    }

if __name__ == "__main__":
    print("Parsed payload:", parse_fin())