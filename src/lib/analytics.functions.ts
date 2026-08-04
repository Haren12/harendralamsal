import { supabase } from "@/integrations/supabase/client";

export async function getVisitorAnalytics() {
  const { data, error } = await supabase.from("visitor_analytics").select("*");

  if (error) {
    console.error("Analytics fetch error:", error);
    throw error;
  }

  const visitors = data || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayVisitors = visitors.filter((visitor) => {
    return new Date(visitor.created_at) >= today;
  });

  const devices = visitors.reduce(
    (acc, visitor) => {
      const device = visitor.device || "Unknown";

      acc[device] = (acc[device] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>,
  );

  const countries = visitors.reduce(
    (acc, visitor) => {
      const country = visitor.country || "Unknown";

      acc[country] = (acc[country] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>,
  );

  const pages = visitors.reduce(
    (acc, visitor) => {
      const page = visitor.page_url || "Unknown";

      acc[page] = (acc[page] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>,
  );

  const topPages = Object.entries(pages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([page, views]) => ({
      page,
      views,
    }));

  return {
    totalVisitors: visitors.length,
    todayVisitors: todayVisitors.length,
    devices,
    countries,
    topPages,
  };
}
