import { supabase } from "@/integrations/supabase/client";

function getDevice() {
  const width = window.innerWidth;

  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";

  return "desktop";
}

function getBrowser() {
  const userAgent = navigator.userAgent;

  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge")) return "Edge";

  return "Other";
}

function getOS() {
  const platform = navigator.platform;

  if (platform.includes("Win")) return "Windows";
  if (platform.includes("Mac")) return "macOS";
  if (platform.includes("Linux")) return "Linux";
  if (platform.includes("iPhone")) return "iOS";
  if (platform.includes("Android")) return "Android";

  return "Other";
}


async function getLocation() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();

    return {
      country: data.country_name || null,
      city: data.city || null,
    };

  } catch {
    return {
      country: null,
      city: null,
    };
  }
}


export async function trackVisitor(pageUrl: string, postId?: string) {
  try {
    const { data, error } = await supabase
      .from("visitor_analytics")
      .insert({
        page_url: pageUrl,
        post_id: postId ?? null,
        device: getDevice(),
        browser: getBrowser(),
        os: getOS(),
        language: navigator.language,
        referrer: document.referrer || "direct",
      })
      .select();

    if (error) {
      console.error("Analytics insert error:", error);
      return;
    }

    console.log("Visitor tracked:", data);
  } catch (error) {
    console.error("Analytics error:", error);
  }
}
