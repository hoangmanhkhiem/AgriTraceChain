  const pinataJWT: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MzdkNzd" +
  "iZC1kMWY2LTQyMWUtOGY2MC01OTgwZTMyOTdhOTEiLCJlbWFpbCI6Imxvbmd0ZC5hNWs0OGd0YkBnbWF" +
  "pbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXN" +
  "pcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3V" +
  "udCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXM" +
  "iOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5Ijo" +
  "iZGNjYmY4MTA2ZDg1NjQzM2I1YWUiLCJzY29wZWRLZXlTZWNyZXQiOiIxZWM0YmE5YjQ3ZjllMjA1MzN" +
  "lYTFiYmM5MjZkODIzOTJjZTcxODYyOWZjMmMwZWZjOTBjMWRiYjAxYTljN2IzIiwiZXhwIjoxNzc0NTI" +
  "0MTMyfQ.IokET3UfMOUUe9EQaZ6y7iNOnJdKdu0rbzxeO0PKTSc";
  const pinataGateway: string = "emerald-managing-koala-687.mypinata.cloud"
export const uploadToIPFS = async (
  data: any,
): Promise<string> => {
  try {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    const formData = new FormData();
    const filename = `data_${Date.now()}.json`;
    
    // Create file object from the data string
    const dataBlob = new Blob([dataString], { type: 'application/json' });
    const file = new File([dataBlob], filename, { type: 'application/json' });
    
    // Add the file to form data
    formData.append('file', file);
    
    // Make the API request to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pinataJWT}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Pinata API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result || !result.IpfsHash) {
      throw new Error("Data upload failed - No IPFS hash returned");
    }
    
    // Return the gateway URL
    return `https://${pinataGateway}/ipfs/${result.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading data to IPFS:", error);
    throw new Error(`Failed to upload data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Fetch data from an IPFS URL
 * @param url - The IPFS URL to fetch data from
 * @param parseJSON - Whether to parse the response as JSON (default: true)
 * @returns A promise resolving to the fetched data
 */
export const fetchFromIPFS = async <T = any>(url: string, parseJSON: boolean = true): Promise<T> => {
  try {
    // Validate URL
    if (!url || !url.startsWith('http')) {
      throw new Error('Invalid IPFS URL');
    }
    
    // Fetch data from the URL
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`IPFS fetch failed with status: ${response.status}`);
    }
    
    // Return parsed JSON or raw text based on parameter
    if (parseJSON) {
      return await response.json() as T;
    } else {
      return await response.text() as unknown as T;
    }
  } catch (error) {
    console.error("Error fetching data from IPFS:", error);
    throw new Error(`Failed to fetch data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
