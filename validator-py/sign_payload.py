from eth_account import Account
from eth_account.messages import encode_structured_data
from dotenv import load_dotenv
from parse_fin import parse_fin
from utils import get_network_config
import os

load_dotenv()
config = get_network_config()

private_key = os.getenv("PRIVATE_KEY")
signer = Account.from_key(private_key)

def sign(payload):
    domain = {
        "name": "FinEuroToken",
        "version": "1",
        "chainId": config["chainId"],
        "verifyingContract": config["contract"],
    }

    typed_data = {
        "types": {
            "EIP712Domain": [
                {"name": "name", "type": "string"},
                {"name": "version", "type": "string"},
                {"name": "chainId", "type": "uint256"},
                {"name": "verifyingContract", "type": "address"},
            ],
            "FINPayload": [
                {"name": "cid", "type": "string"},
                {"name": "txCode", "type": "string"},
                {"name": "receiver", "type": "address"},
                {"name": "amount", "type": "uint256"},
                {"name": "nonce", "type": "uint256"},
            ],
        },
        "primaryType": "FINPayload",
        "domain": domain,
        "message": payload,
    }

    encoded = encode_structured_data(typed_data)
    signed = signer.sign_message(encoded)
    return signed.signature.hex()

if __name__ == "__main__":
    payload = parse_fin("2638350.fin")
    sig = sign(payload)
    print("Payload:", payload)
    print("Signature:", sig)
