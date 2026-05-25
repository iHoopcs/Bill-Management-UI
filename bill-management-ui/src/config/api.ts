/**
 * Replace LOCAL_IP with your machine's local network IP.
 *
 * How to find it:
 *   Windows:  run `ipconfig`  → look for "IPv4 Address" (e.g. 192.168.1.42)
 *   Mac/Linux: run `ifconfig` → look for "inet" under en0/eth0
 *
 * Rules:
 *   - Physical device  → use your machine's local IP  e.g. http://192.168.1.42:8080
 *   - Android emulator → use http://10.0.2.2:8080  (emulator's alias for host machine)
 *   - iOS simulator    → localhost works fine       http://localhost:8080
 */
const LOCAL_IP = "192.168.1.17"; // <-- change this to your IP

export const API_BASE_URL = `http://${LOCAL_IP}:8080`;
