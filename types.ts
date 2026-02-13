
export interface NetworkNode {
  id: string;
  ip: string;
  mac: string;
  vendor: string;
  deviceName: string;
  type: 'Mobile' | 'Workstation' | 'IoT' | 'SmartTV' | 'Router';
  status: 'Authorized' | 'Suspicious' | 'Blocked';
  downloadSpeed: number; // Mbps
  uploadSpeed: number; // Mbps
  latency: number; // ms
  lastActive: number;
}

export interface NetworkHealth {
  downlink: number;
  uplink: number;
  totalDevices: number;
  activeThreats: number;
  ping: number;
  packetLoss: number;
}

export interface NetworkAlert {
  id: string;
  timestamp: number;
  sourceIp: string;
  targetDevice: string;
  attackType: 'DDoS' | 'ARP_Spoofing' | 'DNS_Hijacking' | 'Port_Scan' | 'Brute_Force';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  mitigationStatus: 'Detected' | 'Neutralized' | 'Monitoring';
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: number;
  links?: { title: string; uri: string }[];
}

export interface StyleOption {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}
