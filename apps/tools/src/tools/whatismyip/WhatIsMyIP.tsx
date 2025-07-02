import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface IPInfo {
  ip: string;
  country: string;
  region: string;
  city: string;
  isp: string;
  timezone: string;
}

export function WhatIsMyIP() {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIPInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Using ipapi.co API for IP information
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        throw new Error('Failed to fetch IP information');
      }
      
      const data = await response.json();
      setIpInfo({
        ip: data.ip,
        country: data.country_name,
        region: data.region,
        city: data.city,
        isp: data.org,
        timezone: data.timezone
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIPInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-300 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="win95-window">
          <div className="win95-title-bar">
            <span className="win95-title">What Is My IP - IP Address Information</span>
          </div>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">What Is My IP Address?</h1>
              <p className="text-gray-600">Find out your public IP address and location information</p>
            </div>

            <div className="text-center mb-6">
              <Button 
                onClick={fetchIPInfo} 
                disabled={loading}
                className="win95-button"
              >
                {loading ? 'Loading...' : 'Refresh IP Info'}
              </Button>
            </div>

            {error && (
              <div className="win95-field-sunken p-4 mb-6 bg-red-50">
                <p className="text-red-600 font-bold">Error: {error}</p>
              </div>
            )}

            {ipInfo && (
              <div className="win95-field-sunken p-4 bg-white">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between">
                    <span className="font-bold">IP Address:</span>
                    <span className="font-mono text-blue-600">{ipInfo.ip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Country:</span>
                    <span>{ipInfo.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Region:</span>
                    <span>{ipInfo.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">City:</span>
                    <span>{ipInfo.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">ISP:</span>
                    <span>{ipInfo.isp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Timezone:</span>
                    <span>{ipInfo.timezone}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>This information is provided by your internet service provider and may not always be 100% accurate.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 