export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(dateStr));
}

export function unitLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    national: "National",
    state: "State",
    city_district: "City / District",
    assembly: "Assembly",
    ward_village: "Ward / Village"
  };
  return labels[level] ?? level;
}
