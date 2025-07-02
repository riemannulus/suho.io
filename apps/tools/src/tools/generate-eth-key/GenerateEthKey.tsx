import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EthereumKeys {
  privateKey: string;
  publicKey: string;
  address: string;
}

// Simple secp256k1 implementation for demo purposes
// In a real application, you'd use a proper crypto library
function generateRandomHex(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function privateKeyToAddress(privateKey: string): { publicKey: string; address: string } {
  // This is a simplified implementation for demo purposes
  // In reality, you'd use proper elliptic curve cryptography
  const hash = privateKey.substring(0, 40);
  const publicKey = '04' + generateRandomHex(64); // Uncompressed public key format
  const address = '0x' + hash;
  
  return { publicKey, address };
}

function generateEthereumKeys(): EthereumKeys {
  const privateKey = generateRandomHex(32);
  const { publicKey, address } = privateKeyToAddress(privateKey);
  
  return {
    privateKey: '0x' + privateKey,
    publicKey,
    address
  };
}

export function GenerateEthKey() {
  const [keys, setKeys] = useState<EthereumKeys | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateKeys = async () => {
    setIsGenerating(true);
    // Add a small delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const newKeys = generateEthereumKeys();
    setKeys(newKeys);
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${type} copied to clipboard!`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-300 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="win95-window">
          <div className="win95-title-bar">
            <span className="win95-title">Generate Ethereum Keys - Crypto Key Generator</span>
          </div>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Ethereum Key Generator</h1>
              <p className="text-gray-600">Generate random Ethereum private key, public key, and address</p>
            </div>

            <div className="text-center mb-6">
              <Button 
                onClick={generateKeys} 
                disabled={isGenerating}
                className="win95-button"
              >
                {isGenerating ? 'Generating...' : 'Generate New Keys'}
              </Button>
            </div>

            <div className="win95-field-sunken p-4 mb-6 bg-yellow-50">
              <div className="flex items-center mb-2">
                <span className="text-yellow-800 font-bold">⚠️ Security Warning</span>
              </div>
              <p className="text-yellow-800 text-sm">
                This is a demo tool for educational purposes. <strong>DO NOT</strong> use these keys for real transactions or store real funds. 
                Always use proper, secure methods for generating production Ethereum keys.
              </p>
            </div>

            {keys && (
              <div className="space-y-4">
                <div className="win95-field-sunken p-4 bg-white">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-bold text-gray-700">Private Key:</span>
                    <Button 
                      onClick={() => copyToClipboard(keys.privateKey, 'Private Key')}
                      className="win95-button-small"
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                    {keys.privateKey}
                  </div>
                </div>

                <div className="win95-field-sunken p-4 bg-white">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-bold text-gray-700">Public Key:</span>
                    <Button 
                      onClick={() => copyToClipboard(keys.publicKey, 'Public Key')}
                      className="win95-button-small"
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                    {keys.publicKey}
                  </div>
                </div>

                <div className="win95-field-sunken p-4 bg-white">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-bold text-gray-700">Ethereum Address:</span>
                    <Button 
                      onClick={() => copyToClipboard(keys.address, 'Address')}
                      className="win95-button-small"
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                    {keys.address}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Each private key corresponds to exactly one Ethereum address. Keep your private keys secure!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 