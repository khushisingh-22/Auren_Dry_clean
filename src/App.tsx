import React, { useState, useEffect, useRef } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Menu, 
  X, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Eye, 
  Users, 
  MousePointerClick, 
  Clock3, 
  RefreshCw,
  Send,
  Plus,
  Minus,
  Trash2,
  Heart
} from "lucide-react";

// Existing & New Image Assets
const SUITS_IMAGE = "/src/assets/images/auren_hero_suits_1790789434518.jpg";
const SOFA_IMAGE = "/src/assets/images/auren_sofa_cleaning_1790789453885.jpg";
const SHOE_IMAGE = "/src/assets/images/auren_shoe_cleaning_1790789476418.jpg";
const SAREE_IMAGE = "/src/assets/images/auren_saree_polishing_1790789491635.jpg";
const LAUNDRY_IMAGE = "/src/assets/images/auren_laundry_basket_1790797910878.jpg";
const DELIVERY_IMAGE = "/src/assets/images/auren_delivery_rider_1790797923364.jpg";

// WhatsApp Number configs
const PRIMARY_PHONE = "9211014626";
const SECONDARY_PHONE = "9990466365";

interface AnalyticsData {
  totalVisits: number;
  pageViews: number;
  conversions: number;
  avgDuration: number;
  maxScrollDepth: number;
  sourceTraffic: {
    direct: number;
    google: number;
    whatsapp: number;
    instagram: number;
    facebook: number;
  };
  deviceSplit: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  serviceConversions: { [key: string]: number };
}

interface RateItem {
  item: string;
  price: string;
  cat: "gents" | "ladies" | "winter" | "household";
}

interface BasketItem {
  item: string;
  price: string;
  quantity: number;
  cat: string;
}

export default function App() {
  // Navigation & Modal UI states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeRateTab, setActiveRateTab] = useState<"gents" | "ladies" | "winter" | "household">("gents");
  const [rateSearchQuery, setRateSearchQuery] = useState("");

  // Booking Basket (Cart) State
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [showBasketDrawer, setShowBasketDrawer] = useState(false);

  // Quick reservation state
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    address: "",
    service: "Saree Charak Polishing",
    pickupDate: "",
    pickupTime: "09:00 AM - 12:00 PM",
    specialNotes: ""
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Analytics local session
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 1,
    pageViews: 1,
    conversions: 0,
    avgDuration: 18,
    maxScrollDepth: 10,
    sourceTraffic: { direct: 1, google: 0, whatsapp: 0, instagram: 0, facebook: 0 },
    deviceSplit: { mobile: 0, desktop: 0, tablet: 0 },
    serviceConversions: {}
  });

  const startTimeRef = useRef<number>(Date.now());

  // --- EXACT FINAL RATE LIST DATA FROM POSTER IMAGE ---
  const rateCardData: RateItem[] = [
    // GENTS
    { item: "Suit 2 pc", price: "560", cat: "gents" },
    { item: "Suit 3 pc", price: "560", cat: "gents" },
    { item: "Trouser", price: "140", cat: "gents" },
    { item: "T-Shirt / Shirt", price: "140", cat: "gents" },
    { item: "Coat", price: "350", cat: "gents" },
    { item: "Kurta", price: "120", cat: "gents" },
    { item: "Pyjama", price: "120", cat: "gents" },
    { item: "Lower", price: "100", cat: "gents" },
    { item: "Waist Coat", price: "250", cat: "gents" },

    // LADIES
    { item: "Dress", price: "350/700", cat: "ladies" },
    { item: "Dupatta", price: "150", cat: "ladies" },
    { item: "Suit", price: "150", cat: "ladies" },
    { item: "Salwar / Plazo", price: "150", cat: "ladies" },
    { item: "Saree", price: "250/400", cat: "ladies" },
    { item: "Blouse", price: "100", cat: "ladies" },
    { item: "Skirt", price: "250/350", cat: "ladies" },
    { item: "Gown", price: "500/1200", cat: "ladies" },
    { item: "Lehenga", price: "600/1500", cat: "ladies" },

    // WINTER / WOOLEN
    { item: "Jacket Full", price: "300/400", cat: "winter" },
    { item: "Jacket Half", price: "250/300", cat: "winter" },
    { item: "Sweater / Cardigan Full", price: "200/300", cat: "winter" },
    { item: "Sweater / Cardigan Half", price: "150/250", cat: "winter" },
    { item: "Long Coat", price: "500", cat: "winter" },
    { item: "Shawl / Pashmina", price: "200/450", cat: "winter" },
    { item: "Leather Jacket", price: "450/650", cat: "winter" },
    { item: "Sweat Shirt", price: "200/300", cat: "winter" },
    { item: "Blanket Single", price: "300", cat: "winter" },
    { item: "Blanket Double", price: "400/480", cat: "winter" },
    { item: "Quilt Single", price: "500/550", cat: "winter" },
    { item: "Quilt Double", price: "550/600", cat: "winter" },

    // HOUSEHOLD
    { item: "Carpet (per sq ft)", price: "30", cat: "household" },
    { item: "Blinds", price: "300/600", cat: "household" },
    { item: "Sofa (per seat)", price: "350/450", cat: "household" },
    { item: "Hand Bags", price: "200/500", cat: "household" },
    { item: "Suitcase", price: "350/700", cat: "household" },
    { item: "Sports Shoe", price: "400", cat: "household" },
    { item: "Leather Shoe", price: "400/700", cat: "household" },
    { item: "Curtain per Panel (Door)", price: "250", cat: "household" },
    { item: "Double Sided Curtain", price: "350", cat: "household" },
    { item: "Bed Sheet Single", price: "200", cat: "household" },
    { item: "Double Bedsheet", price: "300", cat: "household" }
  ];

  // --- EXACT 6 SERVICES FROM THE POSTER (OUR SERVICES) ---
  const posterServices = [
    {
      id: "sofa",
      name: "Sofa Cleaning",
      desc: "Deep dry vacuuming and rich foam shampoo extraction. Restores fabric color and removes all seating dirt mites.",
      priceInfo: "₹350 - ₹450 / seat",
      image: SOFA_IMAGE,
      iconColor: "text-teal-600 bg-teal-50 border-teal-100",
      rateQuery: "Sofa (per seat)"
    },
    {
      id: "household",
      name: "Carpet Cleaning",
      desc: "Delicate deep wash and rotary dirt removal for plush oriental and modern designer floor carpets.",
      priceInfo: "₹30 / sq ft",
      image: LAUNDRY_IMAGE,
      iconColor: "text-cyan-500 bg-cyan-50 border-cyan-100",
      rateQuery: "Carpet (per sq ft)"
    },
    {
      id: "gents",
      name: "Steam Iron",
      desc: "Heavy-duty crease control and gentle steam profiling for suits, crisp formal shirts, and heavy coats.",
      priceInfo: "Starts at ₹140",
      image: SUITS_IMAGE,
      iconColor: "text-indigo-600 bg-indigo-50 border-indigo-100",
      rateQuery: "T-Shirt / Shirt"
    },
    {
      id: "ladies",
      name: "Saree Charak Polishing",
      desc: "Traditional starched roll pressing and professional silk drapes profiling to preserve heavy golden zari embroidery.",
      priceInfo: "₹250 - ₹400 / Saree",
      image: SAREE_IMAGE,
      iconColor: "text-amber-600 bg-amber-50 border-amber-100",
      rateQuery: "Saree"
    },
    {
      id: "household",
      name: "Shoe Cleaning",
      desc: "Advanced restoration scrub for sports sneakers, suede boots, and conditioning for premium leather formal shoes.",
      priceInfo: "₹400 - ₹700",
      image: SHOE_IMAGE,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
      rateQuery: "Shoe"
    },
    {
      id: "household",
      name: "Curtain Clean",
      desc: "Eco-solvent deep dry clean for heavy door drape panels, designer double-sided curtains, and window blinds.",
      priceInfo: "₹250 - ₹350 / panel",
      image: DELIVERY_IMAGE,
      iconColor: "text-sky-600 bg-sky-50 border-sky-100",
      rateQuery: "Curtain"
    }
  ];

  // --- ALL 6 PHOTO GALLERY ARRAY ---
  const galleryPhotos = [
    { src: SUITS_IMAGE, title: "Premium Gents Blazers & Suits Care", category: "Dry Cleaning" },
    { src: SAREE_IMAGE, title: "Designer Silk Sarees Charak & Rolling", category: "Saree Polish" },
    { src: SOFA_IMAGE, title: "Deep Stain Extraction Sofa Cleaning", category: "Sofa Service" },
    { src: SHOE_IMAGE, title: "Suede & Premium Leather Shoes Restorative", category: "Shoe Care" },
    { src: LAUNDRY_IMAGE, title: "Freshly Laundered Pastel Garments Basket", category: "Casual Wash" },
    { src: DELIVERY_IMAGE, title: "Friendly Doorstep Pickup & Delivery Rider", category: "Rider Service" }
  ];

  // --- SESSIONS & CONVERSIONS TELEMETRY ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const scrolled = Math.round((window.scrollY / totalHeight) * 100);
        const rawLocal = localStorage.getItem("auren_analytics_v1");
        if (rawLocal) {
          try {
            const data: AnalyticsData = JSON.parse(rawLocal);
            if (scrolled > data.maxScrollDepth) {
              data.maxScrollDepth = scrolled;
              setAnalytics(prev => ({ ...prev, maxScrollDepth: scrolled }));
              localStorage.setItem("auren_analytics_v1", JSON.stringify(data));
            }
          } catch (e) {}
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    const width = window.innerWidth;
    let deviceType: "mobile" | "desktop" | "tablet" = "desktop";
    if (width < 768) deviceType = "mobile";
    else if (width < 1024) deviceType = "tablet";

    const referrer = document.referrer.toLowerCase();
    let source: keyof AnalyticsData["sourceTraffic"] = "direct";
    if (referrer.includes("google")) source = "google";
    else if (referrer.includes("whatsapp") || window.location.search.includes("utm_source=whatsapp")) source = "whatsapp";
    else if (referrer.includes("instagram") || window.location.search.includes("utm_source=instagram")) source = "instagram";
    else if (referrer.includes("facebook") || window.location.search.includes("utm_source=facebook")) source = "facebook";

    const localData = localStorage.getItem("auren_analytics_v1");
    let currentData: AnalyticsData;

    if (localData) {
      try {
        currentData = JSON.parse(localData);
        currentData.pageViews += 1;

        const sessionActive = sessionStorage.getItem("auren_session_active");
        if (!sessionActive) {
          currentData.totalVisits += 1;
          currentData.sourceTraffic[source] = (currentData.sourceTraffic[source] || 0) + 1;
          currentData.deviceSplit[deviceType] = (currentData.deviceSplit[deviceType] || 0) + 1;
          sessionStorage.setItem("auren_session_active", "true");
        }
      } catch (e) {
        currentData = createInitialAnalytics(deviceType, source);
      }
    } else {
      currentData = createInitialAnalytics(deviceType, source);
      sessionStorage.setItem("auren_session_active", "true");
    }

    setAnalytics(currentData);
    localStorage.setItem("auren_analytics_v1", JSON.stringify(currentData));

    const durationInterval = setInterval(() => {
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      const rawLocal = localStorage.getItem("auren_analytics_v1");
      if (rawLocal) {
        try {
          const data: AnalyticsData = JSON.parse(rawLocal);
          const totalSessions = data.totalVisits || 1;
          data.avgDuration = Math.round(((data.avgDuration * (totalSessions - 1)) + elapsed) / totalSessions);
          
          setAnalytics(prev => ({ ...prev, avgDuration: data.avgDuration }));
          localStorage.setItem("auren_analytics_v1", JSON.stringify(data));
        } catch (e) {}
      }
    }, 5000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(durationInterval);
    };
  }, []);

  const createInitialAnalytics = (deviceType: "mobile" | "desktop" | "tablet", source: keyof AnalyticsData["sourceTraffic"]): AnalyticsData => {
    return {
      totalVisits: 1,
      pageViews: 1,
      conversions: 0,
      avgDuration: 12,
      maxScrollDepth: 10,
      sourceTraffic: {
        direct: source === "direct" ? 1 : 0,
        google: source === "google" ? 1 : 0,
        whatsapp: source === "whatsapp" ? 1 : 0,
        instagram: source === "instagram" ? 1 : 0,
        facebook: source === "facebook" ? 1 : 0
      },
      deviceSplit: {
        mobile: deviceType === "mobile" ? 1 : 0,
        desktop: deviceType === "desktop" ? 1 : 0,
        tablet: deviceType === "tablet" ? 1 : 0
      },
      serviceConversions: {
        "Sofa Cleaning": 0,
        "Carpet Cleaning": 0,
        "Steam Iron": 0,
        "Saree Charak": 0,
        "Shoe Cleaning": 0,
        "Curtain Clean": 0
      }
    };
  };

  const trackConversion = (serviceName: string) => {
    const rawLocal = localStorage.getItem("auren_analytics_v1");
    if (rawLocal) {
      try {
        const data: AnalyticsData = JSON.parse(rawLocal);
        data.conversions += 1;
        data.serviceConversions[serviceName] = (data.serviceConversions[serviceName] || 0) + 1;
        
        setAnalytics(data);
        localStorage.setItem("auren_analytics_v1", JSON.stringify(data));
      } catch (e) {}
    }
  };

  const injectSimulatedTraffic = () => {
    const simulated: AnalyticsData = {
      totalVisits: analytics.totalVisits + 195,
      pageViews: analytics.pageViews + 524,
      conversions: analytics.conversions + 39,
      avgDuration: 165,
      maxScrollDepth: 80,
      sourceTraffic: {
        direct: analytics.sourceTraffic.direct + 30,
        google: analytics.sourceTraffic.google + 72,
        whatsapp: analytics.sourceTraffic.whatsapp + 58,
        instagram: analytics.sourceTraffic.instagram + 22,
        facebook: analytics.sourceTraffic.facebook + 13
      },
      deviceSplit: {
        mobile: analytics.deviceSplit.mobile + 124,
        desktop: analytics.deviceSplit.desktop + 52,
        tablet: analytics.deviceSplit.tablet + 19
      },
      serviceConversions: {
        "Sofa Cleaning": (analytics.serviceConversions["Sofa Cleaning"] || 0) + 8,
        "Carpet Cleaning": (analytics.serviceConversions["Carpet Cleaning"] || 0) + 6,
        "Steam Iron": (analytics.serviceConversions["Steam Iron"] || 0) + 12,
        "Saree Charak": (analytics.serviceConversions["Saree Charak"] || 0) + 7,
        "Shoe Cleaning": (analytics.serviceConversions["Shoe Cleaning"] || 0) + 4,
        "Curtain Clean": (analytics.serviceConversions["Curtain Clean"] || 0) + 2
      }
    };

    setAnalytics(simulated);
    localStorage.setItem("auren_analytics_v1", JSON.stringify(simulated));
  };

  const clearAnalyticsData = () => {
    const initial = createInitialAnalytics("desktop", "direct");
    setAnalytics(initial);
    localStorage.setItem("auren_analytics_v1", JSON.stringify(initial));
  };

  // --- CART BOOKING BASKET METHOD ---
  const addToBasket = (item: RateItem) => {
    setBasket(prev => {
      const existing = prev.find(i => i.item === item.item);
      if (existing) {
        return prev.map(i => i.item === item.item ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item: item.item, price: item.price, quantity: 1, cat: item.cat }];
    });
  };

  const removeFromBasket = (itemName: string) => {
    setBasket(prev => {
      const existing = prev.find(i => i.item === itemName);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.item === itemName ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.item !== itemName);
    });
  };

  const clearBasket = () => setBasket([]);
  const getBasketTotalCount = () => basket.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleSendBasketToWhatsApp = () => {
    if (basket.length === 0) {
      window.open(`https://wa.me/91${PRIMARY_PHONE}?text=Hello%20Auren%20Dry%20Clean!%20I%20want%20to%20schedule%20a%20pickup.`, "_blank");
      return;
    }

    trackConversion("Checkout Basket List");
    let txt = "🧺 *AUREN DRY CLEAN - SELECTED WORKLIST* 🧺\n---------------------------------------\n";
    basket.forEach((item, idx) => {
      txt += `${idx + 1}. *${item.item}* (Qty: ${item.quantity}) - Rate: ₹${item.price}\n`;
    });
    txt += `\n📦 Total garments count: ${getBasketTotalCount()}\n📍 Location: Sector-27 Greater Noida\n\n_Hi Auren, please confirm this custom laundry order!_`;

    window.open(`https://wa.me/91${PRIMARY_PHONE}?text=${encodeURIComponent(txt)}`, "_blank");
  };

  // --- DRILL DOWN DIALOG BOXES ---
  const openCategoryModal = (catId: string) => {
    setSelectedCategory(catId);
  };

  const closeCategoryModal = () => {
    setSelectedCategory(null);
  };

  const getCategoryMetaData = (catId: string) => {
    switch (catId) {
      case "gents":
        return { name: "Gents Dry Clean Rates", img: SUITS_IMAGE, desc: "Meticulous deep solvent clean, spot check, and crisp heavy steam press for gents formal attire." };
      case "ladies":
        return { name: "Ladies Wear & Saree Polish", img: SAREE_IMAGE, desc: "Gentle wash, traditional starching, roll-pressing, and embroidery safe treatment for sarees and designer outfits." };
      case "winter":
        return { name: "Winter Woolens & Blankets", img: DELIVERY_IMAGE, desc: "Deep fiber dust extraction, sanitization, and heavy steam wash for single/double cozy quilts and blankets." };
      case "household":
        return { name: "Household Carpet & Curtains", img: LAUNDRY_IMAGE, desc: "Specialist chemical vacuuming, spot cleaning, and sanitization of carpets, panel door curtains, drapes, and linens." };
      default:
        return { name: "Auren Dry Clean Rates", img: SUITS_IMAGE, desc: "Professional garment and textile cleaning." };
    }
  };

  // Rates mapped by category, filtered by search query
  const filteredRates = rateCardData.filter(
    item => {
      const matchTab = item.cat === activeRateTab;
      const matchSearch = item.item.toLowerCase().includes(rateSearchQuery.toLowerCase());
      return matchTab && matchSearch;
    }
  );

  const handleInstantItemWhatsApp = (item: RateItem) => {
    trackConversion(`Book ${item.item}`);
    const text = `Hello Auren Dry Clean!\n\nI found your rate list and want to book deep care for *${item.item}* (Rate: ₹${item.price}).\n\nPlease confirm when your rider can pick this up in Greater Noida.\n\nThank you!`;
    window.open(`https://wa.me/91${PRIMARY_PHONE}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handlePickupFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackConversion(bookingForm.service);

    const txt = 
`🧺 *AUREN DRY CLEAN - INSTANT SCHEDULE* 🧺
--------------------------------------
👤 *Name:* ${bookingForm.name}
📞 *Mobile:* ${bookingForm.phone}
📍 *Sector/Address:* ${bookingForm.address}
🧺 *Service:* ${bookingForm.service}
📅 *Date:* ${bookingForm.pickupDate}
🕒 *Slot:* ${bookingForm.pickupTime}
📝 *Notes:* ${bookingForm.specialNotes || "None"}

_Hello Auren, please confirm my pickup request!_`;

    setBookingSuccess(true);
    setTimeout(() => {
      window.open(`https://wa.me/91${PRIMARY_PHONE}?text=${encodeURIComponent(txt)}`, "_blank");
      setBookingSuccess(false);
    }, 1500);
  };

  return (
    <div className="bg-light-mesh min-h-screen font-body flex flex-col relative text-slate-800 overflow-x-hidden selection:bg-brand-teal-500 selection:text-white">
      
      {/* Floating cleaning bubble background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[8%] left-[6%] w-24 h-24 rounded-full bg-brand-teal-500/5 border border-brand-teal-500/10 animate-float" style={{ animationDelay: "0s" }}></div>
        <div className="absolute top-[32%] right-[4%] w-36 h-36 rounded-full bg-brand-cyan-500/5 border border-brand-cyan-500/10 animate-float" style={{ animationDelay: "2.5s" }}></div>
        <div className="absolute top-[68%] left-[9%] w-28 h-28 rounded-full bg-brand-gold-500/5 border border-brand-gold-500/10 animate-float" style={{ animationDelay: "5s" }}></div>
      </div>

      {/* Top Promotional bar */}
      <div className={`bg-teal-gold-gradient text-white text-xs font-semibold py-2.5 px-4 transition-all duration-300 text-center relative z-40 ${isScrolled ? "h-0 py-0 overflow-hidden opacity-0" : "opacity-100"}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
          <span className="tracking-wider uppercase text-[10px] md:text-xs">✨ Get 40% OFF on All Services on 1st Order • Free Pickup & Delivery on-time</span>
        </div>
      </div>

      {/* Header bar (3-Zone top contract) */}
      <header className={`sticky top-0 z-30 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md border-b border-brand-teal-500/10 py-3 shadow-md" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Zone 1: Single brand wordmark */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full border border-brand-gold-500/35 flex items-center justify-center bg-brand-gold-500/5 group-hover:bg-brand-gold-500/10 transition-all duration-300">
              <svg className="w-5.5 h-5.5 text-brand-gold-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 4V7M12 7C14 7 19 10 20 13C21 16 19 18 17 18C15 18 13.5 16.5 12 16.5C10.5 16.5 9 18 7 18C5 18 3 16 4 13C5 10 10 7 12 7Z" />
                <path d="M12 4C11 3 10 4 11.5 5" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-serif font-bold tracking-widest text-brand-teal-600 leading-none">AUREN</span>
              <span className="text-[10px] tracking-[0.25em] text-brand-gold-500 font-mono font-bold mt-0.5 uppercase leading-none">DRY CLEAN</span>
            </div>
          </a>

          {/* Zone 2: Navigation link tabs */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-slate-600">
            <a href="#our-services" className="hover:text-brand-teal-500 transition-colors">Our Services</a>
            <a href="#studio-gallery" className="hover:text-brand-teal-500 transition-colors">Studio Gallery</a>
            <a href="#interactive-rates" className="hover:text-brand-teal-500 transition-colors">Price List</a>
            <a href="#pickup-schedule" className="hover:text-brand-teal-500 transition-colors">Book Pickup</a>
            
            <button 
              onClick={() => setShowAnalyticsModal(true)}
              className="text-slate-500 hover:text-brand-teal-500 font-mono text-xs flex items-center gap-1 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5 text-brand-gold-500" />
              Dashboard
            </button>
          </nav>

          {/* Zone 3: Navigation Primary Actions */}
          <div className="flex items-center gap-4">
            {basket.length > 0 && (
              <button 
                onClick={() => setShowBasketDrawer(true)}
                className="relative p-2 text-brand-teal-600 hover:bg-brand-teal-50 rounded-full transition-all flex items-center shrink-0"
              >
                <div className="absolute -top-1 -right-1.5 bg-brand-gold-500 text-white text-[9px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {getBasketTotalCount()}
                </div>
                <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </button>
            )}

            <a 
              href="tel:9211014626" 
              className="hidden lg:flex items-center gap-2 text-xs font-mono font-bold text-slate-600 hover:text-brand-teal-500 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-gold-500" />
              <span>9211014626</span>
            </a>

            <a 
              href="#pickup-schedule"
              className="px-5 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all whitespace-nowrap"
            >
              Rider Pickup
            </a>

            {/* Mobile hamburger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-brand-teal-500"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile slide drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 absolute top-full left-0 w-full py-6 px-6 flex flex-col gap-4 shadow-lg z-50">
            <a href="#our-services" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-700 hover:text-brand-teal-500">Our 6 Services</a>
            <a href="#studio-gallery" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-700 hover:text-brand-teal-500">Visual Gallery</a>
            <a href="#interactive-rates" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-700 hover:text-brand-teal-500">Flyer Rates Card</a>
            <a href="#pickup-schedule" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-700 hover:text-brand-teal-500">Book pickup rider</a>
            <hr className="border-slate-100" />
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowAnalyticsModal(true);
                }}
                className="w-full text-center py-2.5 rounded bg-slate-50 border border-slate-200 text-slate-600 hover:text-brand-teal-500 flex items-center justify-center gap-2 text-sm font-mono"
              >
                <BarChart3 className="w-4 h-4 text-brand-gold-500" />
                Live Business Telemetry
              </button>
              <a 
                href="tel:9211014626"
                className="w-full text-center py-2.5 rounded bg-brand-teal-50 border border-brand-teal-100 text-brand-teal-600 flex items-center justify-center gap-2 text-sm font-bold"
              >
                <Phone className="w-4 h-4 text-brand-gold-500" />
                Call Direct: 9211014626
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Welcome Cover */}
      <section className="relative pt-12 pb-24 overflow-hidden bg-gradient-to-b from-brand-teal-50 to-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-brand-gold-500/10 border border-brand-gold-500/25 rounded-full mb-6 text-xs font-bold text-brand-teal-700">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold-500 shrink-0" />
              <span>Premium Care For Your Everyday Wear</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-brand-indigo-950 leading-[1.1] mb-6">
              Dry Cleaning <br />
              <span className="text-teal-gold-gradient font-display italic font-light">Makes A Difference.</span>
            </h1>

            <p className="text-slate-600 text-base md:text-lg max-w-xl font-light leading-relaxed mb-8">
              Professional, eco-friendly solvent care that safely dissolves dirt, grease, and spots. Let our Greater Noida dry cleaning experts restore color shine and softness to your most valuable garments.
            </p>

            {/* Poster claims proof panel */}
            <div className="grid grid-cols-3 gap-6 border-l-4 border-brand-gold-500 pl-4 py-1.5 mb-8 text-xs font-bold text-slate-500 font-mono">
              <div>
                <span className="block text-xl font-black text-brand-teal-600">40% OFF</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5 block font-bold">1ST ORDER DISC.</span>
              </div>
              <div>
                <span className="block text-xl font-black text-brand-teal-600">7 DAYS</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5 block font-bold">9:00AM - 9:00PM</span>
              </div>
              <div>
                <span className="block text-xl font-black text-brand-teal-600">FREE</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5 block font-bold">PICKUP & DROP</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a 
                href="#our-services"
                className="px-8 py-4 bg-teal-gold-gradient text-white text-xs font-bold uppercase tracking-widest rounded-lg text-center shadow-lg hover:shadow-xl transition-all"
              >
                Explore Symmetrical Services
              </a>
              <a 
                href="#pickup-schedule"
                className="px-8 py-4 bg-white hover:bg-slate-50 text-brand-teal-600 border border-brand-teal-100 text-xs font-bold uppercase tracking-widest rounded-lg text-center transition-all"
              >
                Schedule Rider Now
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-80 sm:w-96 aspect-square max-w-full">
              {/* Symmetrical border styling */}
              <div className="absolute top-4 -right-4 w-full h-full rounded-2xl bg-brand-teal-500/10 border border-brand-teal-500/20 rotate-2 z-0"></div>
              
              <div className="absolute inset-0 rounded-2xl overflow-hidden border border-slate-100 shadow-2xl z-10 bg-white p-3">
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <img 
                    src={SUITS_IMAGE} 
                    alt="Premium garments dry cleaning studio" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-brand-teal-100 p-4 rounded-xl shadow-lg flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-mono font-bold text-brand-teal-600 uppercase leading-none mb-1">Introductory Special</span>
                      <span className="text-sm font-bold text-slate-800">Save 40% on First Order</span>
                    </div>
                    <span className="px-2.5 py-1 bg-brand-gold-500 text-white font-mono text-[10px] font-bold rounded">
                      NO CODE REQUIRED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust factors strip */}
      <section className="bg-slate-900 border-y border-slate-800 py-8 relative text-white z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs font-mono">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-brand-teal-500/5 border border-brand-teal-500/20 flex items-center justify-center text-brand-gold-500 mb-3 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-slate-100 uppercase tracking-wider text-[11px]">Free Pick-up & Delivery</h4>
            <p className="text-slate-400 mt-1 text-[10px]">On-time doorstep rider dispatch</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-brand-teal-500/5 border border-brand-teal-500/20 flex items-center justify-center text-brand-gold-500 mb-3 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-slate-100 uppercase tracking-wider text-[11px]">Gentle & Safe Cleaning</h4>
            <p className="text-slate-400 mt-1 text-[10px]">Eco-friendly fabric care fluids</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-brand-teal-500/5 border border-brand-teal-500/20 flex items-center justify-center text-brand-gold-500 mb-3 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-slate-100 uppercase tracking-wider text-[11px]">7 Days Open</h4>
            <p className="text-slate-400 mt-1 text-[10px]">From 9:00 am to 9:00 pm</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-brand-teal-500/5 border border-brand-teal-500/20 flex items-center justify-center text-brand-gold-500 mb-3 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-slate-100 uppercase tracking-wider text-[11px]">Expert Stain Removal</h4>
            <p className="text-slate-400 mt-1 text-[10px]">Rigorous spot checks and treatment</p>
          </div>
        </div>
      </section>

      {/* Symmetrical Grid: OUR SERVICES */}
      <section id="our-services" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-gold-500 font-mono text-xs uppercase tracking-[0.2em] font-bold">Cleaner Clothes • Brighter You</span>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-indigo-950 font-bold mt-2">OUR SERVICES</h2>
          
          <div className="flex items-center justify-center gap-2 mt-4 text-brand-gold-500">
            <span className="h-px w-10 bg-brand-gold-500/40"></span>
            <Heart className="w-4 h-4 fill-brand-gold-500 text-brand-gold-500" />
            <span className="h-px w-10 bg-brand-gold-500/40"></span>
          </div>
          
          <p className="text-slate-600 text-sm mt-4 font-light leading-relaxed">
            Exactly matching the 6 specific laundry and cleaning services from our poster flyer. Click on any box to **enter and inspect** the exact item prices and place your direct bookings.
          </p>
        </div>

        {/* 6 Symmetrical Service boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posterServices.map((box, idx) => (
            <div 
              key={idx}
              onClick={() => openCategoryModal(box.id)}
              className="bg-white rounded-xl border border-slate-100 p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:border-brand-teal-500/35 service-card-shadow hover:service-card-shadow-hover group text-left"
            >
              <div>
                <div className="h-48 rounded-xl overflow-hidden mb-6 border border-slate-100 relative shadow-sm">
                  <img 
                    src={box.image} 
                    alt={box.name} 
                    className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-brand-teal-500/20 text-brand-teal-700 font-mono text-[10px] font-bold px-2.5 py-1 rounded">
                    {box.priceInfo}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-serif text-brand-indigo-950 font-bold group-hover:text-brand-teal-500 transition-colors">
                    {box.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-light mt-2">
                    {box.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-teal-600 group-hover:text-brand-gold-500 transition-colors">
                <span>View Flyer Price & Book</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RICH VISUAL PHOTO GALLERY (PHOTOS USE KRO JAYDA SE JAYDA) */}
      <section id="studio-gallery" className="py-20 bg-[#f0fdfa]/40 border-y border-brand-teal-500/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-gold-500 font-mono text-xs uppercase tracking-[0.2em] font-bold">Auren Care Showcase</span>
            <h2 className="text-3xl md:text-4xl font-serif text-brand-indigo-950 font-bold mt-2">Our Premium Studio Gallery</h2>
            <p className="text-slate-600 text-sm mt-3 font-light">
              Actual high-fidelity visual representations of Auren Dry Clean's pristine care machinery, professional suit treatment, saree rolling, leather footwear polish, and cozy blanket wash!
            </p>
          </div>

          {/* Symmetrical Grid Masonry style for 6 Photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryPhotos.map((photo, i) => (
              <div 
                key={i} 
                className="group relative rounded-xl overflow-hidden border border-slate-100 shadow-md bg-white p-2.5 transition-all duration-300 hover:shadow-xl hover:border-brand-teal-500/20 text-left"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden relative">
                  <img 
                    src={photo.src} 
                    alt={photo.title} 
                    className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white space-y-1">
                      <span className="text-[9px] font-mono font-bold text-brand-gold-500 uppercase tracking-widest block">
                        {photo.category}
                      </span>
                      <h4 className="text-sm font-semibold leading-snug">{photo.title}</h4>
                    </div>
                  </div>
                </div>
                
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Auren Studio</span>
                    <h4 className="text-sm font-semibold text-brand-indigo-950 truncate max-w-[200px]">{photo.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono bg-brand-teal-50 text-brand-teal-600 px-2.5 py-1 rounded font-bold uppercase tracking-wider shrink-0">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Symmetrical Pricing rates (tabbed, directly on screen!) */}
      <section id="interactive-rates" className="py-24 max-w-7xl mx-auto px-6 relative z-10 text-left">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-gold-500 font-mono text-xs uppercase tracking-[0.2em] font-bold">Transparent Rates</span>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-indigo-950 font-bold mt-2">Your Final Rate List</h2>
          <p className="text-slate-600 text-sm mt-3 font-light leading-relaxed">
            Search prices or filter by categories matching the poster flyer exactly. Tap "Direct Book" or add items to your laundry basket and checkout in one-click.
          </p>
        </div>

        {/* Categories Tab and Search Box */}
        <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-5 mb-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-50 border border-slate-100 rounded-xl w-full lg:w-auto">
            {[
              { id: "gents", label: "Gents Wear" },
              { id: "ladies", label: "Ladies Wear" },
              { id: "winter", label: "Winter / Woolen" },
              { id: "household", label: "Household Care" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveRateTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap uppercase tracking-wider ${
                  activeRateTab === tab.id 
                    ? "bg-brand-teal-600 text-white shadow" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80 shrink-0">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={rateSearchQuery}
              onChange={(e) => setRateSearchQuery(e.target.value)}
              placeholder="Search garments, blazers, quilts..."
              className="w-full bg-slate-50 text-xs text-slate-800 pl-10 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-teal-500 font-mono"
            />
            {rateSearchQuery && (
              <button onClick={() => setRateSearchQuery("")} className="absolute inset-y-0 right-3 flex items-center text-slate-400">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Price List Results */}
        {filteredRates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRates.map((item, index) => {
              const qtyInBasket = basket.find(b => b.item === item.item)?.quantity || 0;

              return (
                <div 
                  key={index}
                  className="bg-white border border-slate-100 hover:border-brand-teal-500/20 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                      {item.cat} category
                    </span>
                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-brand-teal-600 transition-colors leading-snug">
                      {item.item}
                    </h4>
                    <span className="text-xs font-mono font-bold text-brand-teal-600 block mt-1">₹{item.price}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Basket Incrementor */}
                    {qtyInBasket > 0 ? (
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs font-mono">
                        <button 
                          onClick={() => removeFromBasket(item.item)}
                          className="w-5 h-5 rounded hover:bg-slate-200 text-brand-teal-600 font-bold"
                        >
                          -
                        </button>
                        <span className="px-1.5 font-bold text-slate-800">{qtyInBasket}</span>
                        <button 
                          onClick={() => addToBasket(item)}
                          className="w-5 h-5 rounded hover:bg-slate-200 text-brand-teal-600 font-bold"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => addToBasket(item)}
                        className="px-2 py-1.5 bg-slate-50 hover:bg-brand-teal-500 border border-slate-200 text-slate-600 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                      >
                        + Basket
                      </button>
                    )}

                    <button 
                      onClick={() => handleInstantItemWhatsApp(item)}
                      className="p-2 bg-brand-teal-50 hover:bg-brand-teal-500 border border-brand-teal-100 text-brand-teal-600 hover:text-white rounded-lg transition-all shadow-sm"
                      title="Direct Booking"
                    >
                      <Send className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white border border-slate-100 rounded-xl shadow-sm">
            <p className="text-slate-500 text-xs">No items found matching "{rateSearchQuery}"</p>
            <button 
              onClick={() => { setRateSearchQuery(""); }}
              className="mt-4 text-xs font-bold text-brand-teal-500 underline uppercase tracking-wider"
            >
              Reset Search Filter
            </button>
          </div>
        )}

      </section>

      {/* Simple 5-stage cleaning process */}
      <section className="py-20 bg-slate-50 border-y border-slate-100 relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-gold-500 font-mono text-xs uppercase tracking-[0.2em] font-bold">Auren Meticulous Process</span>
            <h2 className="text-3xl md:text-4xl font-serif text-brand-indigo-950 font-bold mt-2">How We Handle Your Clothes</h2>
            <p className="text-slate-600 text-sm mt-3">Meticulous cleaning journey for elite fabrics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { num: "01", name: "Rider Pickup", text: "garments safely packed in zip bags and tagged instantly under photographic inspection logs." },
              { num: "02", name: "Fiber Inspection", text: "Expert textile evaluation (saree zari borders, suit canvas, woolen weight) to pre-spot tough grease/food." },
              { num: "03", name: "Custom Solvent Clean", text: "Organic dry cleaning solvents or soft bio-shampoo cycles depending on garment thread weave." },
              { num: "04", name: "Steam Iron & Charak", text: "Traditional starching and roll pressing for drapes/sarees, and custom blazers heavy steam iron." },
              { num: "05", name: "Rider Return", text: "Protective garment hanger wrapping and on-time doorstep handoff back directly to your address." }
            ].map((p, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 relative shadow-sm">
                <span className="absolute -top-4 -left-2 text-5xl font-mono font-black text-brand-teal-500/5 select-none z-0">
                  {p.num}
                </span>
                <div className="relative z-10 mt-2 space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-800 tracking-wide uppercase font-mono">{p.name}</h4>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Booking & Map Contact segment */}
      <section id="pickup-schedule" className="py-24 bg-brand-teal-50/30 border-t border-slate-100 relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Location Support */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-brand-gold-500 font-mono text-xs uppercase tracking-[0.2em] font-bold">Direct Pickup Booking</span>
              <h2 className="text-3xl md:text-4xl font-serif text-brand-indigo-950 font-bold mt-2">Book Your Pickup Rider</h2>
              <p className="text-slate-600 text-sm mt-4 font-light leading-relaxed">
                Schedule your dry cleaning collection across Greater Noida sectors. Our rider will confirm the timings via WhatsApp.
              </p>

              <div className="flex flex-col gap-6 mt-8 text-xs font-mono text-slate-600">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-white border border-brand-teal-500/10 flex items-center justify-center shrink-0 text-brand-teal-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-slate-400 uppercase tracking-widest text-[9px] mb-1 font-bold">Studio Shop Location</span>
                    <p className="text-slate-700 leading-normal not-italic font-sans font-semibold text-sm">
                      Shop No. 15, Hemisphere Royal Golf Plaza,<br />
                      Sector-27, Near Godrej Society,<br />
                      Greater Noida, Uttar Pradesh 201301
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-white border border-brand-teal-500/10 flex items-center justify-center shrink-0 text-brand-teal-500">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-slate-400 uppercase tracking-widest text-[9px] mb-1 font-bold">Helpline Hotline</span>
                    <p className="text-slate-800 font-sans font-bold text-base tracking-wide">
                      <a href="tel:9211014626" className="hover:text-brand-teal-500 transition-colors">9211014626</a> / <a href="tel:9990466365" className="hover:text-brand-teal-500 transition-colors">9990466365</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-white border border-brand-teal-500/10 flex items-center justify-center shrink-0 text-brand-teal-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-slate-400 uppercase tracking-widest text-[9px] mb-1 font-bold">Email Support</span>
                    <p className="text-slate-700 font-sans text-sm font-medium">
                      <a href="mailto:support@aurendryclean.com" className="hover:text-brand-teal-500 transition-colors">support@aurendryclean.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-white border border-brand-teal-500/10 flex items-center justify-center shrink-0 text-brand-teal-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-slate-400 uppercase tracking-widest text-[9px] mb-1 font-bold">Timings</span>
                    <p className="text-slate-700 font-sans text-sm font-medium">
                      9:00 AM - 9:00 PM (Open all 7 Days)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coverage area */}
            <div className="mt-8 p-5 bg-white border border-slate-100 rounded-xl shadow-sm text-left">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block mb-1">Rider Zones</span>
              <p className="text-xs text-slate-500 leading-relaxed font-light mb-3">
                Riders are actively operating in and around Sector-27 Greater Noida, near Hemisphere and Godrej society.
              </p>
              <a 
                href="https://maps.google.com/?q=Shop+No.+15,+Hemisphere+Royal+Golf+Plaza,+Sector-27,+Greater+Noida" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-brand-teal-600 hover:text-brand-gold-500 font-bold uppercase tracking-wider transition-colors"
              >
                <span>Navigate on Google Maps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Booking form */}
          <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-md">
            <h3 className="text-2xl font-serif text-brand-indigo-950 font-bold mb-6">Schedule Home Pickup</h3>
            
            <form onSubmit={handlePickupFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    placeholder="Amit Kumar"
                    className="w-full bg-slate-50 text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-teal-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">WhatsApp Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    placeholder="Enter 10 digit phone number"
                    className="w-full bg-slate-50 text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-teal-500 font-mono text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">Society & Home Address in Greater Noida *</label>
                <textarea
                  required
                  rows={2}
                  value={bookingForm.address}
                  onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                  placeholder="E.g., Flat 504, Tower B, Godrej Golf Links, Sector-27"
                  className="w-full bg-slate-50 text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-teal-500 text-slate-800 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">Service Needed *</label>
                  <select
                    value={bookingForm.service}
                    onChange={(e) => setBookingForm({ ...bookingForm, service: e.target.value })}
                    className="w-full bg-slate-50 text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-teal-500 text-slate-700"
                  >
                    <option value="Sofa Cleaning">Sofa Cleaning</option>
                    <option value="Carpet Cleaning">Carpet Cleaning</option>
                    <option value="Steam Iron">Steam Iron</option>
                    <option value="Saree Charak Polishing">Saree Charak Polishing</option>
                    <option value="Shoe Cleaning">Shoe Cleaning</option>
                    <option value="Curtain Clean">Curtain Clean</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">Pickup Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.pickupDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, pickupDate: e.target.value })}
                    className="w-full bg-slate-50 text-xs px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-teal-500 font-mono text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">Preferred Slot *</label>
                  <select
                    value={bookingForm.pickupTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, pickupTime: e.target.value })}
                    className="w-full bg-slate-50 text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-teal-500 text-slate-700"
                  >
                    <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 03:00 PM">12:00 PM - 03:00 PM</option>
                    <option value="03:00 PM - 06:00 PM">03:00 PM - 06:00 PM</option>
                    <option value="06:00 PM - 09:00 PM">06:00 PM - 09:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">Instructions (e.g., tough stains) - Optional</label>
                <input
                  type="text"
                  value={bookingForm.specialNotes}
                  onChange={(e) => setBookingForm({ ...bookingForm, specialNotes: e.target.value })}
                  placeholder="E.g., Silk saree has grease stain, blazers have food spots..."
                  className="w-full bg-slate-50 text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-teal-500 text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={bookingSuccess}
                className={`w-full py-3.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all text-white font-mono flex items-center justify-center gap-2 ${
                  bookingSuccess 
                    ? "bg-emerald-500 text-white" 
                    : "bg-teal-gold-gradient hover:opacity-95 shadow-md cursor-pointer"
                }`}
              >
                {bookingSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Preparing WhatsApp Pickup Chat...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 shrink-0" />
                    <span>Confirm Rider & Book on WhatsApp</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-16 relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-800 pb-12 mb-12">
            
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full border border-brand-gold-500/35 flex items-center justify-center bg-brand-gold-500/5">
                <svg className="w-5.5 h-5.5 text-brand-gold-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 4V7M12 7C14 7 19 10 20 13C21 16 19 18 17 18C15 18 13.5 16.5 12 16.5C10.5 16.5 9 18 7 18C5 18 3 16 4 13C5 10 10 7 12 7Z" />
                  <path d="M12 4C11 3 10 4 11.5 5" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-serif font-bold tracking-widest text-white leading-none">AUREN</span>
                <span className="text-[10px] tracking-[0.25em] text-brand-gold-500 font-mono font-bold mt-0.5 uppercase leading-none">DRY CLEAN</span>
              </div>
            </div>

            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-semibold text-slate-300">
              <a href="#our-services" className="hover:text-brand-teal-500 transition-colors">Our Services</a>
              <a href="#studio-gallery" className="hover:text-brand-teal-500 transition-colors">Visual Gallery</a>
              <a href="#interactive-rates" className="hover:text-brand-teal-500 transition-colors">Price List</a>
              <a href="#pickup-schedule" className="hover:text-brand-teal-500 transition-colors">Rider Pickup</a>
              <button onClick={() => setShowAnalyticsModal(true)} className="hover:text-brand-gold-500 transition-colors font-mono text-brand-teal-500">
                <span>[📊 Partner Analytics]</span>
              </button>
            </nav>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-slate-500">
            <div>
              <p>© {new Date().getFullYear()} Auren Dry Clean. All rights reserved. Servicing Greater Noida elite sectors.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                100% Organic Eco Safe
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                Greater Noida
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING ACTION BAR */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/90 border border-slate-100 px-4 py-2.5 rounded-full backdrop-blur-md shadow-xl flex items-center gap-3.5 z-30 max-w-[95vw] md:max-w-md w-max transition-all hover:border-brand-teal-500/30">
        
        <a 
          href="tel:9211014626"
          className="flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-700 transition-all whitespace-nowrap"
        >
          <Phone className="w-3.5 h-3.5 text-brand-gold-500 shrink-0" />
          <span className="hidden sm:inline">Call Studio</span>
        </a>

        <div className="w-px h-5 bg-slate-200"></div>

        <button 
          onClick={() => {
            if (basket.length > 0) {
              setShowBasketDrawer(true);
            } else {
              document.getElementById("interactive-rates")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="relative px-3 py-2 text-slate-700 hover:text-brand-teal-500 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
        >
          {basket.length > 0 ? (
            <>
              <div className="w-5 h-5 rounded-full bg-brand-gold-500 text-white font-mono text-[9px] font-bold flex items-center justify-center">
                {getBasketTotalCount()}
              </div>
              <span className="text-slate-800 font-bold">Selected</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-brand-gold-500 shrink-0" />
              <span>Poster Prices</span>
            </>
          )}
        </button>

        <div className="w-px h-5 bg-slate-200"></div>

        <a 
          href="#pickup-schedule"
          onClick={() => trackConversion("Floating CTA Reservation")}
          className="px-4.5 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5 shadow-md whitespace-nowrap"
        >
          <span>Book Rider</span>
          <Send className="w-3 h-3 shrink-0" />
        </a>
      </div>


      {/* --- MODAL DRILL DOWN PANEL (INPE CLICK KRNE KE BAD ANDAR ENTER KR PAOGE) --- */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col justify-between animate-in zoom-in-95 duration-200 text-left">
            
            {/* Category Banner Cover image */}
            <div className="relative h-44 shrink-0 overflow-hidden bg-slate-900 flex items-end p-6">
              <img 
                src={getCategoryMetaData(selectedCategory).img} 
                alt="Selected category prices" 
                className="w-full h-full object-cover absolute inset-0 opacity-40"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
              
              <div className="relative z-10 space-y-1">
                <span className="text-[9px] font-mono font-bold text-brand-gold-500 uppercase tracking-widest block leading-none">
                  Flyer Rate List
                </span>
                <h3 className="text-2xl font-serif font-bold text-white tracking-wide leading-none">
                  {getCategoryMetaData(selectedCategory).name}
                </h3>
                <p className="text-xs text-slate-300 font-light max-w-md line-clamp-1">
                  {getCategoryMetaData(selectedCategory).desc}
                </p>
              </div>

              {/* Close Button */}
              <button 
                onClick={closeCategoryModal}
                className="absolute top-4 right-4 p-2 bg-black/40 border border-white/20 text-white hover:bg-black/60 rounded-full transition-all z-20 shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drill down rate list scroll container */}
            <div className="p-6 overflow-y-auto space-y-3 flex-grow bg-slate-50">
              {rateCardData
                .filter(item => item.cat === selectedCategory)
                .map((item, idx) => {
                  const qtyInBasket = basket.find(b => b.item === item.item)?.quantity || 0;

                  return (
                    <div 
                      key={idx}
                      className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between gap-4 transition-all hover:border-brand-teal-500/20"
                    >
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 leading-normal">{item.item}</h4>
                        <span className="text-xs font-mono font-bold text-brand-teal-600">Rate: ₹{item.price}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {qtyInBasket > 0 ? (
                          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs font-mono">
                            <button 
                              onClick={() => removeFromBasket(item.item)}
                              className="w-5 h-5 rounded hover:bg-slate-200 text-brand-teal-600 font-bold"
                            >
                              -
                            </button>
                            <span className="px-1 text-slate-800 font-bold">{qtyInBasket}</span>
                            <button 
                              onClick={() => addToBasket(item)}
                              className="w-5 h-5 rounded hover:bg-slate-200 text-brand-teal-600 font-bold"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => addToBasket(item)}
                            className="px-2.5 py-1.5 bg-brand-teal-50 hover:bg-brand-teal-500 text-brand-teal-600 hover:text-white border border-brand-teal-100 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                          >
                            + Basket
                          </button>
                        )}

                        <button 
                          onClick={() => handleInstantItemWhatsApp(item)}
                          className="p-2 bg-slate-50 border border-slate-200 hover:border-brand-teal-500/40 text-slate-500 hover:text-brand-teal-500 rounded-lg transition-all"
                          title="Instant Book"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Drill down modal footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
              <div className="font-mono text-[10px] text-slate-500">
                {basket.length > 0 ? (
                  <span className="text-brand-gold-500 font-bold">
                    🧺 {getBasketTotalCount()} garments added to local basket
                  </span>
                ) : (
                  <span>Select items to pre-compile a quote!</span>
                )}
              </div>

              <div className="flex gap-2">
                {basket.length > 0 && (
                  <button 
                    onClick={() => {
                      closeCategoryModal();
                      setShowBasketDrawer(true);
                    }}
                    className="px-3.5 py-2 bg-brand-gold-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-brand-gold-600 shadow-sm"
                  >
                    Open Basket
                  </button>
                )}
                <button 
                  onClick={closeCategoryModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}


      {/* --- BASKET CHECKOUT PANEL --- */}
      {showBasketDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-brand-teal-100 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl flex flex-col justify-between animate-in zoom-in-95 duration-200 text-left">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <svg className="w-5.5 h-5.5 text-brand-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <h3 className="text-lg font-serif font-bold text-brand-indigo-950">My Dry Cleaning Basket</h3>
              </div>
              <button 
                onClick={() => setShowBasketDrawer(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-grow bg-white">
              {basket.length > 0 ? (
                basket.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                    <div className="text-left">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block leading-none">
                        {item.cat} wear
                      </span>
                      <h4 className="text-sm font-semibold text-slate-800 leading-normal mt-0.5">{item.item}</h4>
                      <span className="text-xs font-mono font-bold text-brand-teal-600">Rate: ₹{item.price}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <button 
                        onClick={() => removeFromBasket(item.item)}
                        className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold text-slate-800 min-w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => addToBasket({ item: item.item, price: item.price, cat: item.cat as any })}
                        className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-sm font-light">
                  Your dry cleaning list is empty. Add items from the flyer rates first!
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3 shrink-0">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500">Total Items Selected:</span>
                <span className="text-slate-800 font-bold">{getBasketTotalCount()} garments</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal text-left">
                ⚠️ Estimates are according to final rate list flyer. Final review is conducted by the rider during pickup collection.
              </p>

              <div className="flex gap-2.5 pt-2">
                <button 
                  onClick={clearBasket}
                  className="px-3.5 py-2.5 border border-slate-200 hover:border-red-500 text-slate-400 hover:text-red-500 rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  Clear
                </button>
                <button 
                  onClick={handleSendBasketToWhatsApp}
                  disabled={basket.length === 0}
                  className="flex-grow py-2.5 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 shrink-0" />
                  <span>Send Basket to WhatsApp</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}


      {/* --- LIGHT THEMED ADMIN PANEL TELEMETRY --- */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-brand-teal-100 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col justify-between animate-in zoom-in-95 duration-200 text-left">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-brand-teal-50 text-brand-teal-600 border border-brand-teal-100">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-brand-indigo-950 leading-none">Auren Dry Clean Analytics</h3>
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block mt-1">Real-time local engagement dashboard</span>
                </div>
              </div>
              <button 
                onClick={() => setShowAnalyticsModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] bg-slate-50/50">
              
              {/* Traffic Simulator */}
              <div className="p-4 bg-brand-teal-50 border border-brand-teal-100 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                <div className="max-w-xl">
                  <h4 className="text-xs font-mono font-bold text-brand-teal-700 uppercase tracking-widest mb-1">Sandbox Live Telemetry</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Test the traffic dashboards responsiveness in real-time! Click below to immediately inject a realistic dry cleaning customer dataset.
                  </p>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={injectSimulatedTraffic}
                    className="px-3.5 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Simulate 190+ Visitors</span>
                  </button>
                  <button 
                    onClick={clearAnalyticsData}
                    className="px-3 py-2 bg-white border border-slate-200 hover:border-red-400 text-slate-500 hover:text-red-500 rounded-lg text-xs font-bold uppercase tracking-wider"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm text-left">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Total Sessions</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-mono font-bold text-slate-800 tabular-nums">{analytics.totalVisits}</span>
                    <span className="text-xs font-mono text-emerald-500 font-bold">+100%</span>
                  </div>
                </div>
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm text-left">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Page views</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-mono font-bold text-slate-800 tabular-nums">{analytics.pageViews}</span>
                    <span className="text-xs font-mono text-slate-400">Hits ratio</span>
                  </div>
                </div>
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm text-left">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">WhatsApp conversions</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-mono font-bold text-slate-800 tabular-nums">{analytics.conversions}</span>
                    <span className="text-xs font-mono font-bold text-emerald-500">
                      {analytics.totalVisits > 0 ? Math.round((analytics.conversions / analytics.totalVisits) * 100) : 0}% CR
                    </span>
                  </div>
                </div>
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm text-left">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Avg. Session time</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-mono font-bold text-slate-800 tabular-nums">
                      {analytics.avgDuration < 60 ? `${analytics.avgDuration}s` : `${Math.floor(analytics.avgDuration / 60)}m`}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{analytics.maxScrollDepth}% scroll</span>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Traffic Channels */}
                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm text-left">
                  <div className="border-b border-slate-100 pb-2 mb-4 flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Inbound traffic referrers</h4>
                    <span className="text-[9px] font-mono text-slate-400">Channels mapped</span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: "google", label: "Google Organic SEO", count: analytics.sourceTraffic.google, color: "bg-brand-teal-500" },
                      { key: "whatsapp", label: "WhatsApp Direct Share", count: analytics.sourceTraffic.whatsapp, color: "bg-emerald-500" },
                      { key: "direct", label: "Direct URL Visit", count: analytics.sourceTraffic.direct, color: "bg-indigo-500" },
                      { key: "instagram", label: "Instagram Link bio", count: analytics.sourceTraffic.instagram, color: "bg-pink-500" },
                      { key: "facebook", label: "Facebook Local Ad", count: analytics.sourceTraffic.facebook, color: "bg-sky-400" }
                    ].map(item => {
                      const total = Object.values(analytics.sourceTraffic).reduce((a,b)=>a+b, 0) || 1;
                      const pct = Math.round((item.count / total) * 100);

                      return (
                        <div key={item.key} className="space-y-1">
                          <div className="flex justify-between text-xs font-mono font-bold text-slate-600">
                            <span>{item.label}</span>
                            <span>{item.count} views ({pct}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Device Breakdown Donut representation */}
                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col justify-between text-left">
                  <div>
                    <div className="border-b border-slate-100 pb-2 mb-4 flex items-center justify-between">
                      <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Device Platform Split</h4>
                      <span className="text-[9px] font-mono text-slate-400">Aspect-ratios</span>
                    </div>

                    <div className="grid grid-cols-12 gap-4 items-center mt-4">
                      <div className="col-span-5 flex justify-center">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                          {(() => {
                            const mob = analytics.deviceSplit.mobile;
                            const dsk = analytics.deviceSplit.desktop;
                            const tab = analytics.deviceSplit.tablet;
                            const total = (mob + dsk + tab) || 1;
                            
                            const mPct = (mob / total) * 100;
                            const dPct = (dsk / total) * 100;
                            const tPct = (tab / total) * 100;

                            return (
                              <>
                                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0d9488" strokeWidth="3.2" strokeDasharray={`${mPct} ${100-mPct}`} strokeDashoffset="0" />
                                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#115e59" strokeWidth="3.2" strokeDasharray={`${dPct} ${100-dPct}`} strokeDashoffset={-mPct} />
                                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#d4af37" strokeWidth="3.2" strokeDasharray={`${tPct} ${100-tPct}`} strokeDashoffset={-(mPct+dPct)} />
                              </>
                            );
                          })()}
                        </svg>
                      </div>

                      <div className="col-span-7 space-y-2 font-mono text-[11px] text-slate-600">
                        {(() => {
                          const total = (analytics.deviceSplit.mobile + analytics.deviceSplit.desktop + analytics.deviceSplit.tablet) || 1;
                          return (
                            <>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-brand-teal-500 shrink-0"></span>
                                <span>Mobile:</span>
                                <span className="font-bold ml-auto tabular-nums">{Math.round((analytics.deviceSplit.mobile/total)*100)}%</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-brand-teal-700 shrink-0"></span>
                                <span>Desktop:</span>
                                <span className="font-bold ml-auto tabular-nums">{Math.round((analytics.deviceSplit.desktop/total)*100)}%</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-500 shrink-0"></span>
                                <span>Tablet:</span>
                                <span className="font-bold ml-auto tabular-nums">{Math.round((analytics.deviceSplit.tablet/total)*100)}%</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 font-mono mt-4 leading-normal">
                    💡 High touch targets are preconfigured to enable quick bookings on single finger taps.
                  </p>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center text-[10px] font-mono text-slate-400 shrink-0">
              <span>Auren telemetry tracker v1.6.0</span>
              <button 
                onClick={() => setShowAnalyticsModal(false)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
              >
                Close Panel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
