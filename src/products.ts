import { Product } from './types';

export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Avenzo Ares Gaming Laptop',
    category: 'electronics',
    price: 119999,
    description: 'Unleash absolute dominative computing power with the Avenzo Ares Gaming Laptop. Featuring custom aerospace aluminum casing, dual-liquid liquid thermal dissipators, an incredibly responsive mechanical RGB grid, and flagship gaming components, this laptop is designed for competitive gamers and intensive heavy render tasks alike.',
    sku: 'AVN-ARES-G15',
    stock: 14,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 18,
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Processor', value: 'Intel Core i9 14th Gen / AMD Ryzen 9' },
      { key: 'Memory', value: '32GB DDR5 Dual Channel @ 5600MHz' },
      { key: 'Storage', value: '2TB PCIe Gen4 NVMe ultra-fast SSD' },
      { key: 'Display', value: '16" QHD+ (2560x1600) 240Hz IPS, 100% DCI-P3' },
      { key: 'Chassis', value: 'Anodized Premium Titanium gray aluminum' }
    ],
    reviews: [
      { id: 'rev-1', name: 'Zeeshan Khan', rating: 5, comment: 'Phenomenal build quality! Easily hits over 180 FPS on high settings. Delivery in Lahore took just 24 hours.', date: '2026-05-18' },
      { id: 'rev-2', name: 'Alia Mahmood', rating: 4.8, comment: 'Sleek professional look, which means I can take it into boardrooms. Excellent thermal management.', date: '2026-05-24' }
    ]
  },
  {
    id: 'prod-002',
    name: 'Avenzo Zenith Business Laptop',
    category: 'electronics',
    price: 109999,
    description: 'Indulge in featherweight executive luxury. The Zenith is engineered representing executive mobility, security, and everlasting endurance. Packed with full corporate authentication security, silent keyboards, and a beautiful tactile trackpad, it defines enterprise elegance.',
    sku: 'AVN-ZENITH-X14',
    stock: 22,
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1496181130204-755241544e35?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Weight', value: '1.18 kg ultra-light form factor' },
      { key: 'Processor', value: 'Intel Core Ultra 7 with Intel vPro' },
      { key: 'Battery Life', value: 'Up to 18 Hours fast charge enabled' },
      { key: 'Security', value: 'Biometric FaceID & Touch integrated encryption' }
    ],
    reviews: [
      { id: 'rev-3', name: 'Omar Dar', rating: 5, comment: 'Essential tool for any modern executive. Battery lives up to the claim. Stunning display!', date: '2026-05-29' }
    ]
  },
  {
    id: 'prod-003',
    name: 'Avenzo Aura Premium Smartphone',
    category: 'electronics',
    price: 114999,
    description: 'Immerse yourself into a visual cinematic breakthrough. The Avenzo Aura incorporates a dynamic responsive fluid screen, a true-sensor cinematic shooter with variable aperture, and a massive 5200mAh battery that charges fully in 20 minutes under Pakistani climate-regulated speeds.',
    sku: 'AVN-AURA-PH1',
    stock: 25,
    isFeatured: true,
    rating: 4.7,
    reviewsCount: 32,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Display', value: '6.82" Dynamic 120Hz LTPO OLED' },
      { key: 'Main Camera', value: '50MP + 50MP Wide + 64MP Periscope Zoom 5x' },
      { key: 'Battery', value: '5200mAh with 100W SuperCharge' },
      { key: 'Finish', value: 'Satin Luxury Ceramic back with Gold Bezel' }
    ],
    reviews: [
      { id: 'rev-4', name: 'Mariam Shah', rating: 4.5, comment: 'Camera is incredible, portrait shots compete with professional gear. Highly recommend from Karachi.', date: '2026-06-01' }
    ]
  },
  {
    id: 'prod-004',
    name: 'Avenzo Eclipse 55" Smart 4K TV',
    category: 'home-appliances',
    price: 99999,
    description: 'Bring absolute cinematic grandeur directly into your lounge with the Avenzo Eclipse. Harnessing multi-zone backlight technology, HDR10+, and a powerful native speaker array, it serves true-to-life details from your local streaming applications.',
    sku: 'AVN-ECLIPSE-554K',
    stock: 10,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Resolution', value: 'True 4K UHD (3840 x 2160 pixels)' },
      { key: 'Smart Platform', value: 'Google TV with Home Assistant integrated' },
      { key: 'Audio', value: '45W Harman Sound with Dolby Atmos' },
      { key: 'Refresh Rate', value: '120Hz Fluid Motion engine' }
    ],
    reviews: [
      { id: 'rev-5', name: 'Noman Siddiqui', rating: 5, comment: 'The picture clarity is pristine! The deep blacks and visual contrasts are supreme.', date: '2026-06-03' }
    ]
  },
  {
    id: 'prod-005',
    name: 'Avenzo Signature DSLR Camera',
    category: 'electronics',
    price: 119500,
    description: 'Architect professional-grade captures. The Signature DSLR features a ultra-sensitive sensor, high-speed shutter systems, and native optical stabilization ensuring crisp frames even under low light Lahore street-market nights.',
    sku: 'AVN-DSLR-SIG30',
    stock: 8,
    isFeatured: false,
    rating: 4.6,
    reviewsCount: 14,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Sensor', value: '45.7 Megapixel Full-Frame CMOS Sensor' },
      { key: 'ISO Range', value: 'Auto (100 - 51200) custom expandable' },
      { key: 'Focusing', value: '64-point Dual Pixel Phase Detection' },
      { key: 'Video Resolution', value: '4K Cinema @ 60 FPS uncompressed' }
    ],
    reviews: []
  },
  {
    id: 'prod-006',
    name: 'Avenzo Falcon Professional Drone',
    category: 'electronics',
    price: 119999,
    description: 'Elevate your commercial cinematography. Features high-velocity mechanical wind resistance, dual-GPS position pinning, automatic path routing, and an absolute premium carbon weave chassis framework.',
    sku: 'AVN-FALCON-PX4',
    stock: 6,
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 9,
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Flight Time', value: 'Up to 45 minutes on dynamic power' },
      { key: 'Max Range', value: '12 km unhindered HD transmission' },
      { key: 'Stabilization', value: '3-axis active motorized gimbal stability' },
      { key: 'Sensor Tech', value: 'Omnidirectional obstacle collision avoiders' }
    ],
    reviews: []
  },
  {
    id: 'prod-007',
    name: 'Avenzo Elite Fitness Treadmill',
    category: 'fitness-mobility',
    price: 118999,
    description: 'Build your custom high-performance sanctuary. The Avenzo Elite contains a robust hydraulic shock absorbency grid, Bluetooth smart app connectivity, automated gradient lifting, and custom cooling side vents.',
    sku: 'AVN-ELITE-TMX7',
    stock: 12,
    isFeatured: false,
    rating: 4.7,
    reviewsCount: 20,
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Motor power', value: '4.5 HP Silent high-torque DC motor' },
      { key: 'Speed range', value: '1.0 to 22.0 KM/H one-click control' },
      { key: 'Slope Elevation', value: '15-level power automatic incline' },
      { key: 'Max Weight', value: '160 kg certified heavy duty support' }
    ],
    reviews: []
  },
  {
    id: 'prod-008',
    name: 'Avenzo Blizzard Air Conditioner 1.5 Ton',
    category: 'home-appliances',
    price: 109999,
    description: 'Conquer intense summers elegantly. Combining highly efficient inverter power grids, high ambient climate stabilization, gold rust-proof coating, and instant dual cooling sweeps.',
    sku: 'AVN-BLIZ-AC15',
    stock: 15,
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 28,
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Capacity', value: '1.5 Ton (18000 BTU) perfect climate sweep' },
      { key: 'Compressor', value: 'T3 Rotary DC Inverter Compressor' },
      { key: 'Saving Ratio', value: 'Saves up to 75% on electricity' },
      { key: 'Piping', value: '100% Pure Cooper inner grooved condenser' }
    ],
    reviews: [
      { id: 'rev-6', name: 'Farhan Ali', rating: 5, comment: 'Keeps my living room super cold in June heat of Multan. The inverter savings are verifiable.', date: '2026-06-04' }
    ]
  },
  {
    id: 'prod-009',
    name: 'Avenzo Studio Home Theater System',
    category: 'home-appliances',
    price: 89999,
    description: 'Absolute spatial acoustics. Immerse your family inside rich audio textures, heavy sub-bass dynamics, and crystal-clear high frequencies generated by handcrafted wooden satellites.',
    sku: 'AVN-HT-STUDIO51',
    stock: 11,
    isFeatured: false,
    rating: 4.5,
    reviewsCount: 12,
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Total Power', value: '1200 Watts RMS true output' },
      { key: 'Channels', value: '5.1 Multi-spatial surround sound setup' },
      { key: 'Connectivity', value: 'Bluetooth 5.2, Optical (SPDIF), HDMI eARC' },
      { key: 'Subwoofer', value: '10" Heavy-Thump down-firing wood driver' }
    ],
    reviews: []
  },
  {
    id: 'prod-010',
    name: 'Avenzo Predator Gaming Monitor',
    category: 'electronics',
    price: 64999,
    description: 'Experience frames in complete lag-free liquid speeds. The Predator is a curved masterpiece engineered for competitive visual reflexes, featuring color rendering accuracy ideal for designs.',
    sku: 'AVN-PRED-32C',
    stock: 18,
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 16,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Screen Size', value: '32" Ultra-Curved (1500R curvature)' },
      { key: 'Resolution', value: 'WQHD (2560 x 1440) 2K display' },
      { key: 'Refresh Rate', value: '180Hz SuperFluid refresh speed' },
      { key: 'Sync technology', value: 'NVIDIA G-Sync & AMD FreeSync Premium' }
    ],
    reviews: []
  },
  {
    id: 'prod-011',
    name: 'Avenzo Executive Premium Office Desk',
    category: 'office-furniture',
    price: 79999,
    description: 'A monument of boardroom sophistication. Crafted from real walnut and structured with matte heavy steel frame pillars, it hosts built-in hidden cable managers and secure motorized drawer locks.',
    sku: 'AVN-EXEC-DESK80',
    stock: 5,
    isFeatured: true,
    rating: 4.7,
    reviewsCount: 8,
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Dimensions', value: '72" W x 36" D x 30" H solid footprint' },
      { key: 'Material', value: 'Premium Solid Walnut wood top with steel leg rails' },
      { key: 'Features', value: 'Built-in wireless phone chargers & cable channels' }
    ],
    reviews: []
  },
  {
    id: 'prod-012',
    name: 'Avenzo Royal Premium Recliner Sofa',
    category: 'home-appliances',
    price: 94999,
    description: 'Enter absolute comfort royalty. The Royal Recliner features medical grade muscle lumbar support, dynamic motorized recline tracking, side spill-protected leather slots, and elegant leather.',
    sku: 'AVN-ROYAL-REC1',
    stock: 9,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 11,
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Upholstery', value: 'Italian Full-Grain Nappa Leather jacket' },
      { key: 'Mechanism', value: 'Whisper-quiet electric motorized recline (0-175°)' },
      { key: 'Cushioning', value: 'Multi-layer memory foam orthopedic grid' }
    ],
    reviews: []
  },
  {
    id: 'prod-013',
    name: 'Avenzo Summit Conference Table',
    category: 'office-furniture',
    price: 84999,
    description: 'Inspires collaborative leadership. Built to seat ten executives comfortably, equipped with pop-up connectivity panels, satin scratch-proof wood, and custom support legs.',
    sku: 'AVN-SUMMIT-CNF10',
    stock: 4,
    isFeatured: false,
    rating: 4.6,
    reviewsCount: 5,
    imageUrl: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Seating Capacity', value: 'Designed for 8 to 12 persons setup' },
      { key: 'Tech Ports', value: '4x Integrated pop-up hubs (AC, USB, HDMI)' },
      { key: 'Structure', value: 'Reinforced dual-arch steel beams under wood slab' }
    ],
    reviews: []
  },
  {
    id: 'prod-014',
    name: 'Avenzo Solar Inverter Hybrid 5kW',
    category: 'home-appliances',
    price: 69999,
    description: 'Sustain uninterrupted electricity security. The Hybrid Inverter automatically regulates solar grids, batteries, and general load profiles to maintain smooth flow during grid outages.',
    sku: 'AVN-SOLAR-HYB5',
    stock: 13,
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 31,
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Power Output', value: '5000 Watts continuous pure sine wave' },
      { key: 'MPPT Voltage', value: '120V - 450V wide operational window' },
      { key: 'Battery Support', value: 'Compatible with Lithium-Ion & Tubular batteries' },
      { key: 'Efficiency', value: '98% power conversion efficacy index' }
    ],
    reviews: [
      { id: 'rev-7', name: 'Javed Iqbal', rating: 5, comment: 'Running my 1.5 ton inverter AC seamlessly during loadshedding. A lifesaver.', date: '2026-06-08' }
    ]
  },
  {
    id: 'prod-015',
    name: 'Avenzo Commander Pro Workgroup Printer',
    category: 'electronics',
    price: 74999,
    description: 'Rapid high-duty enterprise paper processors. Delivers razor-sharp duplex prints, bulk automated scans with minimal operation sounds, and extreme ink storage yields.',
    sku: 'AVN-PRNT-CMD9',
    stock: 7,
    isFeatured: false,
    rating: 4.5,
    reviewsCount: 7,
    imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Print Speed', value: 'Up to 55 Pages Per Minute (Mono/Color)' },
      { key: 'functions', value: 'Print, Copy, Scan, Fax with automated document feeder' },
      { key: 'Connectivity', value: 'Wi-Fi Direct, Gigabit Ethernet, Apple AirPrint' }
    ],
    reviews: []
  },
  {
    id: 'prod-016',
    name: 'Avenzo Cruiser Carbon Electric Scooter',
    category: 'fitness-mobility',
    price: 119999,
    description: 'Revolutionize personal urban transit. Blends high-efficiency hub motors, lightweight premium carbon frames, and high-safety dual disc brakes, ideal for campus and estate commutes.',
    sku: 'AVN-CRSR-SCOOT',
    stock: 9,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 14,
    imageUrl: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Motor', value: '800W brushless rear hub dynamic motor' },
      { key: 'Top Speed', value: '45 KM/H electronic lock release configured' },
      { key: 'Range', value: 'Up to 55 KM per charges on eco speed cycles' },
      { key: 'Weight capacity', value: '120 kg maximum load capacity safety' }
    ],
    reviews: []
  },
  {
    id: 'prod-017',
    name: 'Avenzo V12 Industrial Vacuum Cleaner',
    category: 'fitness-mobility',
    price: 59999,
    description: 'Uncompromising dirt sweep forces. Possesses heavy-duty continuous dry/wet suction turbines, structural heavy stainless steel storage frames, and long flexible tubes.',
    sku: 'AVN-VAC-V12IND',
    stock: 12,
    isFeatured: false,
    rating: 4.6,
    reviewsCount: 9,
    imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Capacity', value: '80 Liters stainless steel heavy tank' },
      { key: 'Motor Power', value: '3000 Watts twin-motor super-suction' },
      { key: 'Filter', value: 'Washable HEPA multi-stage micro filter' }
    ],
    reviews: []
  },
  {
    id: 'prod-018',
    name: 'Avenzo Barista Pro Premium Coffee Machine',
    category: 'home-appliances',
    price: 89999,
    description: 'Awaken artistic coffee perfection. Delivers precise digital water thermology, consistent 15-bar pump extraction, and professional steam wands creating silk-soft milk microfoam.',
    sku: 'AVN-COF-BARISTA',
    stock: 15,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 21,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Pump Pressure', value: '15 Bar Italian electromagnetic pumps' },
      { key: 'Heating system', value: 'ThermoJet dynamic heating (heated in 3 seconds)' },
      { key: 'Grinder', value: 'Integrated conical burr grinder with 30 settings' }
    ],
    reviews: [
      { id: 'rev-8', name: 'Dr. Sarah', rating: 5, comment: 'Saves me trips to Gloria Jeans. Truly beautiful aesthetics and café grade espressos.', date: '2026-06-09' }
    ]
  },
  {
    id: 'prod-019',
    name: 'Avenzo AquaTemp Deluxe Water Dispenser',
    category: 'home-appliances',
    price: 54999,
    description: 'Elegantly satisfying thirst. Incorporates custom touch control panel interface, cold storage cooling cabinet, child safety locks for boiling water, and high-efficiency silent compressor cooling.',
    sku: 'AVN-WD-AQUA',
    stock: 16,
    isFeatured: false,
    rating: 4.4,
    reviewsCount: 10,
    imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Taps', value: '3 hot, cool, & super chilled dynamic outlets' },
      { key: 'Storage Cabin', value: '20 Liters lower active refrigerator cabin' },
      { key: 'Cooling Capacity', value: '4L/hour below 8 degrees thermal scale' }
    ],
    reviews: []
  },
  {
    id: 'prod-020',
    name: 'Avenzo ErgoMax Executive Office Chair',
    category: 'office-furniture',
    price: 54999,
    description: 'The absolute gold standard in ergonomic design. Built with premium mesh backings that regulate air climate, customizable 4D armrests, full mechanical spine profiling, and gas-lift adjusters.',
    sku: 'AVN-ERGO-CHAIR',
    stock: 20,
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 16,
    imageUrl: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=600&auto=format&fit=crop',
    specifications: [
      { key: 'Back Support', value: 'Dynamic posture tracking automatic lumbar adjustment' },
      { key: 'Armrests', value: '4D multi-directional soft padded locks' },
      { key: 'Gas Lift', value: 'Class 4 heavy duty gas cylinder certified' },
      { key: 'Mesh material', value: 'High elasticity breathable Korean mesh' }
    ],
    reviews: [
      { id: 'rev-9', name: 'Nabeel Qureshi', rating: 5, comment: 'Back pain resolved. Hands down the best office chair available on the market.', date: '2026-06-05' }
    ]
  }
];
