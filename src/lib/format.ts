export const rupiah = (n: number) =>
  "Rp" + n.toLocaleString("id-ID");

export const generateOrderId = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `PS-${pad(d.getDate())}${pad(d.getMonth() + 1)}${d.getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;
};

export const formatDateTimeWIB = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())} WIB`;
};
