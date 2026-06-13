import cabaiRawitMerah from "@/assets/cabai-rawit-merah.jpg";
import cabaiMerahKeriting from "@/assets/cabai-merah-keriting.jpg";
import cabaiHijau from "@/assets/cabai-hijau.jpg";
import bawangMerah from "@/assets/bawang-merah.jpg";
import bawangPutih from "@/assets/bawang-putih.jpg";
import tomat from "@/assets/tomat.jpg";
import kunyit from "@/assets/kunyit.jpg";
import jahe from "@/assets/jahe.jpg";
import kangkung from "@/assets/kangkung.jpg";
import bayam from "@/assets/bayam.jpg";
import sawi from "@/assets/sawi.jpg";
import wortel from "@/assets/wortel.jpg";
import kentang from "@/assets/kentang.jpg";
import kubis from "@/assets/kubis.jpg";
import serai from "@/assets/serai.jpg";
import lengkuas from "@/assets/lengkuas.jpg";
import daunBawang from "@/assets/daun-bawang.jpg";

export type Category =
  | "cabai"
  | "sayuran"
  | "bawang"
  | "rempah"
  | "bumbu"
  | "buah"
  | "paket";

export interface Product {
  id: string;
  slug: string;
  name: string;
  weight: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  category: Category;
  image: string;
  stock: number;
  description: string;
  bestseller?: boolean;
}

export const CATEGORIES: { id: Category; label: string; image: string }[] = [
  { id: "cabai", label: "Cabai", image: cabaiRawitMerah },
  { id: "sayuran", label: "Sayuran Hijau", image: sawi },
  { id: "bawang", label: "Bawang", image: bawangPutih },
  { id: "rempah", label: "Rempah", image: jahe },
  { id: "bumbu", label: "Bumbu Dapur", image: kunyit },
  { id: "buah", label: "Buah Segar", image: tomat },
  { id: "paket", label: "Paket Masak", image: serai },
];

export const PRODUCTS: Product[] = [
  { id: "p1", slug: "cabai-rawit-merah", name: "Cabai Rawit Merah", weight: "1 kg", price: 18000, rating: 4.9, reviews: 1200, category: "cabai", image: cabaiRawitMerah, stock: 48, bestseller: true, description: "Cabai rawit merah segar pilihan langsung dari petani. Pedasnya menggigit, cocok untuk sambal, masakan tumis, dan bumbu dapur harian." },
  { id: "p2", slug: "cabai-merah-keriting", name: "Cabai Merah Keriting", weight: "1 kg", price: 24000, oldPrice: 28000, rating: 4.8, reviews: 980, category: "cabai", image: cabaiMerahKeriting, stock: 32, bestseller: true, description: "Cabai merah keriting segar dengan warna cerah, ideal untuk sambal goreng dan tumisan." },
  { id: "p3", slug: "cabai-hijau-besar", name: "Cabai Hijau Besar", weight: "1 kg", price: 16000, rating: 4.7, reviews: 640, category: "cabai", image: cabaiHijau, stock: 25, description: "Cabai hijau besar segar, tidak terlalu pedas, cocok untuk tumis cabai hijau." },
  { id: "p4", slug: "cabai-rawit-hijau", name: "Cabai Rawit Hijau", weight: "1 kg", price: 17000, rating: 4.7, reviews: 410, category: "cabai", image: cabaiHijau, stock: 20, description: "Cabai rawit hijau muda dengan rasa segar dan pedas." },
  { id: "p5", slug: "bawang-merah-brebes", name: "Bawang Merah Brebes", weight: "1 kg", price: 22000, rating: 4.9, reviews: 1100, category: "bawang", image: bawangMerah, stock: 60, bestseller: true, description: "Bawang merah asli Brebes, harum dan padat, pilihan utama dapur Indonesia." },
  { id: "p6", slug: "bawang-putih", name: "Bawang Putih", weight: "1 kg", price: 20000, rating: 4.8, reviews: 950, category: "bawang", image: bawangPutih, stock: 55, bestseller: true, description: "Bawang putih segar, siung besar, mudah dikupas." },
  { id: "p7", slug: "tomat-segar", name: "Tomat Segar", weight: "1 kg", price: 10000, rating: 4.6, reviews: 720, category: "buah", image: tomat, stock: 40, description: "Tomat merah segar, manis dan berair, ideal untuk sup, sambal, dan jus." },
  { id: "p8", slug: "kentang-dieng", name: "Kentang Dieng", weight: "1 kg", price: 14000, rating: 4.7, reviews: 530, category: "sayuran", image: kentang, stock: 35, description: "Kentang segar dari dataran tinggi Dieng, tekstur padat dan rasa gurih." },
  { id: "p9", slug: "wortel-segar", name: "Wortel Segar", weight: "1 kg", price: 12000, rating: 4.8, reviews: 610, category: "sayuran", image: wortel, stock: 38, description: "Wortel manis berwarna oranye cerah, kaya vitamin A." },
  { id: "p10", slug: "kubis-hijau", name: "Kubis Hijau", weight: "1 pcs", price: 9000, rating: 4.5, reviews: 320, category: "sayuran", image: kubis, stock: 22, description: "Kubis hijau segar, daun renyah, cocok untuk capcay dan lalap." },
  { id: "p11", slug: "kangkung", name: "Kangkung", weight: "1 ikat", price: 5000, rating: 4.8, reviews: 880, category: "sayuran", image: kangkung, stock: 50, bestseller: true, description: "Kangkung segar baru panen pagi, daun hijau muda dan batang renyah." },
  { id: "p12", slug: "bayam-hijau", name: "Bayam Hijau", weight: "1 ikat", price: 5000, rating: 4.8, reviews: 740, category: "sayuran", image: bayam, stock: 45, description: "Bayam hijau segar, daun lembut, kaya zat besi." },
  { id: "p13", slug: "sawi-hijau", name: "Sawi Hijau", weight: "500 gr", price: 8000, rating: 4.7, reviews: 510, category: "sayuran", image: sawi, stock: 30, description: "Sawi hijau segar, cocok untuk mi ayam dan tumisan." },
  { id: "p14", slug: "daun-bawang", name: "Daun Bawang", weight: "250 gr", price: 6000, rating: 4.7, reviews: 290, category: "bumbu", image: daunBawang, stock: 28, description: "Daun bawang segar, aroma harum, pelengkap berbagai masakan." },
  { id: "p15", slug: "jahe-merah", name: "Jahe Merah", weight: "500 gr", price: 15000, rating: 4.8, reviews: 470, category: "rempah", image: jahe, stock: 25, description: "Jahe merah segar, hangatnya kuat, cocok untuk wedang dan jamu." },
  { id: "p16", slug: "kunyit-segar", name: "Kunyit Segar", weight: "500 gr", price: 12000, rating: 4.8, reviews: 380, category: "rempah", image: kunyit, stock: 30, bestseller: true, description: "Kunyit segar dengan warna kuning pekat, ideal untuk bumbu masak dan jamu." },
  { id: "p17", slug: "lengkuas", name: "Lengkuas", weight: "250 gr", price: 8000, rating: 4.6, reviews: 220, category: "rempah", image: lengkuas, stock: 24, description: "Lengkuas segar untuk bumbu rendang, soto, dan gulai." },
  { id: "p18", slug: "serai", name: "Serai", weight: "5 batang", price: 5000, rating: 4.7, reviews: 260, category: "rempah", image: serai, stock: 40, description: "Serai segar, aroma harum, cocok untuk soto, tom yum, dan minuman herbal." },
];

export const findProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
