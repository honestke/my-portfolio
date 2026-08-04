export function parseUserAgent(ua: string | null): { device: string; browser: string } {
  if (!ua) return { device: "unknown", browser: "unknown" };

  const isTablet = /iPad|Tablet/i.test(ua);
  const isMobile = !isTablet && /Mobile|Android|iPhone/i.test(ua);
  const device = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

  let browser = "Other";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\/|Opera/.test(ua)) browser = "Opera";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua)) browser = "Safari";

  return { device, browser };
}
