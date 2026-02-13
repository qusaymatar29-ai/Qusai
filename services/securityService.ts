
import { GoogleGenAI } from "@google/genai";
import { NetworkNode, NetworkHealth, NetworkAlert } from "../types";

// محاولة جلب معلومات الشبكة الحقيقية إذا كان التطبيق يعمل في Electron
const getRealNetworkNodes = async (): Promise<NetworkNode[]> => {
  try {
    if (typeof window !== 'undefined' && (window as any).process && (window as any).require) {
      const { execSync } = (window as any).require('child_process');
      const os = (window as any).require('os');
      
      const interfaces = os.networkInterfaces();
      let localIp = '192.168.1.x';
      for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
          if (iface.family === 'IPv4' && !iface.internal) {
            localIp = iface.address;
          }
        }
      }

      const output = execSync('arp -a').toString();
      const lines = output.split('\n');
      
      const nodes: NetworkNode[] = [];
      
      nodes.push({
        id: 'SELF',
        ip: localIp,
        mac: 'LOCAL_HOST',
        vendor: 'This Device',
        deviceName: 'ADMIN_STATION_PC',
        type: 'Workstation',
        status: 'Authorized',
        downloadSpeed: 150 + Math.random() * 100,
        uploadSpeed: 50 + Math.random() * 20,
        latency: 1,
        lastActive: Date.now()
      });

      lines.forEach((line: string, index: number) => {
        const ipMatch = line.match(/\d+\.\d+\.\d+\.\d+/);
        const macMatch = line.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
        
        if (ipMatch && macMatch && ipMatch[0] !== localIp) {
          const ip = ipMatch[0];
          const mac = macMatch[1] ? macMatch[0] : 'Unknown';
          
          let type: NetworkNode['type'] = 'IoT';
          if (ip.endsWith('.1')) type = 'Router';
          else if (index % 3 === 0) type = 'Mobile';
          else if (index % 5 === 0) type = 'SmartTV';

          nodes.push({
            id: `NODE_${index}`,
            ip: ip,
            mac: mac,
            vendor: 'Live Asset',
            deviceName: type === 'Router' ? 'CORE_GATEWAY' : `UNNAMED_DEV_${ip.split('.').pop()}`,
            type: type,
            status: 'Authorized',
            downloadSpeed: Math.random() * 30,
            uploadSpeed: Math.random() * 5,
            latency: Math.floor(Math.random() * 40) + 5,
            lastActive: Date.now()
          });
        }
      });

      return nodes.length > 1 ? nodes : getMockNodes();
    }
  } catch (e) {
    console.warn("Falling back to local simulation console.");
  }
  return getMockNodes();
};

const getMockNodes = (): NetworkNode[] => [
  { id: 'R01', ip: '192.168.1.1', mac: 'BC:85:56:DA:E1:01', vendor: 'Cisco Systems', deviceName: 'RT-GATEWAY-01', type: 'Router', status: 'Authorized', downloadSpeed: 450, uploadSpeed: 120, latency: 2, lastActive: Date.now() },
  { id: 'M01', ip: '192.168.1.12', mac: '00:1C:B3:09:85:12', vendor: 'Apple Inc.', deviceName: 'CEO-iPhone', type: 'Mobile', status: 'Authorized', downloadSpeed: 45.2, uploadSpeed: 5.4, latency: 24, lastActive: Date.now() },
  { id: 'W01', ip: '192.168.1.50', mac: '70:B3:D5:E2:B0:50', vendor: 'Dell Workstation', deviceName: 'ENG-STATION-50', type: 'Workstation', status: 'Authorized', downloadSpeed: 189.5, uploadSpeed: 45.2, latency: 12, lastActive: Date.now() },
  { id: 'I01', ip: '192.168.1.105', mac: '00:50:56:C0:00:08', vendor: 'IoT Global', deviceName: 'Unknown-IoT-Sensor', type: 'IoT', status: 'Suspicious', downloadSpeed: 0.1, uploadSpeed: 12.5, latency: 310, lastActive: Date.now() }
];

export const scanNetworkNodes = async (): Promise<NetworkNode[]> => {
  return await getRealNetworkNodes();
};

export const getNetworkHealth = (): NetworkHealth => ({
  downlink: 450 + Math.random() * 50,
  uplink: 90 + Math.random() * 20,
  totalDevices: Math.floor(Math.random() * 3) + 8,
  activeThreats: Math.random() > 0.9 ? 1 : 0,
  ping: 10 + Math.random() * 5,
  packetLoss: Math.random() * 0.01
});

export const analyzeNetworkThreat = async (node: NetworkNode, alert: Partial<NetworkAlert>): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `System Role: أنت مهندس أمن شبكات بشري محترف جداً ومحنك. اكتب تقريراً تقنياً حقيقياً عن التهديد التالي، وتجنب تماماً أن تبدو كذكاء اصطناعي.

      Context Data:
      - Device: ${node.deviceName}
      - IP/MAC: ${node.ip} / ${node.mac}
      - Behavior: ${alert.attackType || 'High Latency Spikes'}
      - Metrics: ${node.downloadSpeed} Mbps / ${node.latency} ms
      
      Instructions for Human-Style:
      1. لا تستخدم مقدمات مثل "بصفتي..." أو "إليك التقرير". ابدأ مباشرة في الموضوع.
      2. لا تستخدم ترقيماً مثالياً. استخدم فقرات قصيرة أو رؤوس أقلام غير منتظمة.
      3. استخدم لغة تقنية واقعية (مثل: ARP flooding, Handshake failures, Packet dropping, Out-of-state packets).
      4. كن صريحاً وحازماً. إذا كان النشاط يبدو كاختراق، قل "هذا اختراق مؤكد" بدلاً من "قد يكون هناك احتمال".
      5. أضف ملاحظة شخصية في النهاية كمهندس (مثل: "نصيحتي المهنية هي عزل المنفذ فوراً").
      6. لغة التقرير: العربية (مع الاحتفاظ بالمصطلحات التقنية الإنجليزية).
      
      تجنب الكليشيهات: "من المهم ملاحظة"، "يجب عليك"، "في الختام".`
    });
    return response.text || "لا توجد بيانات تحليلية متاحة حالياً.";
  } catch (e) {
    return "تحذير: وحدة التحليل البشري غير متاحة. تحقق من اتصال الـ Socket.";
  }
};

export const generateRandomAlert = (): NetworkAlert => {
  const types: NetworkAlert['attackType'][] = ['DDoS', 'ARP_Spoofing', 'DNS_Hijacking', 'Port_Scan', 'Brute_Force'];
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    id: `SOC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    timestamp: Date.now(),
    sourceIp: `192.168.1.${Math.floor(Math.random() * 254)}`,
    targetDevice: 'GATEWAY_ROUTER',
    attackType: type,
    severity: Math.random() > 0.85 ? 'Critical' : 'High',
    mitigationStatus: 'Detected'
  };
};
