import os
import sys
from dotenv import load_dotenv
load_dotenv()

def get_network_config():
    is_mainnet = "--mainnet" in sys.argv
    return {
        "name": "mainnet" if is_mainnet else "sepolia",
        "chainId": int(os.getenv("CHAIN_ID_MAINNET") if is_mainnet else os.getenv("CHAIN_ID_SEPOLIA")),
        "contract": os.getenv("CONTRACT_ADDRESS_MAINNET") if is_mainnet else os.getenv("CONTRACT_ADDRESS_SEPOLIA"),
    }
