import { CarHireVehicle, CarHireCategoryItem } from '../types';
import kenyaEconomyImg from '../assets/images/kenya_economy_car_1788874989494.jpg';
import kenyaSaloonImg from '../assets/images/kenya_saloon_car_1788875013251.jpg';
import kenyaSuvImg from '../assets/images/kenya_suv_car_1788875026687.jpg';
import kenyaSafari4x4Img from '../assets/images/kenya_safari_4x4_1788875042671.jpg';
import kenyaTourVanImg from '../assets/images/kenya_tour_van_1788875057019.jpg';
import kenyaLuxuryV8Img from '../assets/images/kenya_luxury_v8_1788875071830.jpg';

export const CAR_HIRE_LOCATIONS = [
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Eldoret',
  'Naivasha',
  'Diani'
];

export const CAR_HIRE_SERVICES_OFFERED = [
  {
    id: 'self-drive',
    title: 'Self-drive car hire',
    description: 'Enjoy the freedom to explore at your own pace with comprehensive insurance and 24/7 roadside assistance across Kenya.'
  },
  {
    id: 'chauffeur-driven',
    title: 'Chauffeur-driven vehicles',
    description: 'Travel in total comfort with professional, licensed, and courteous Kenyan driver-guides who know every route.'
  },
  {
    id: 'airport-transfers',
    title: 'Airport transfers',
    description: 'Punctual meet-and-greet transfers to and from JKIA, Wilson Airport, Moi International Mombasa, and Kisumu.'
  },
  {
    id: 'short-term',
    title: 'Short-term car hire',
    description: 'Convenient daily and weekend rentals for city errands, business meetings, and quick holiday road trips.'
  },
  {
    id: 'long-term',
    title: 'Long-term car hire',
    description: 'Cost-effective monthly and seasonal rental plans with flexible maintenance and vehicle replacement options.'
  },
  {
    id: 'corporate',
    title: 'Corporate car hire',
    description: 'Dedicated business travel solutions, executive transport, conference delegates, and organizational staff mobility.'
  },
  {
    id: 'safari-4x4',
    title: 'Safari and 4x4 hire',
    description: 'Purpose-built four-wheel-drive safari vehicles with pop-up roofs, high ground clearance, and bush gear.'
  },
  {
    id: 'delivery',
    title: 'Vehicle delivery',
    description: 'Direct delivery and pickup to your doorstep, hotel, office, or airport terminal in major towns across Kenya.'
  }
];

export const CAR_HIRE_CATEGORIES: CarHireCategoryItem[] = [
  {
    id: 'economy-cars',
    name: 'Economy Cars',
    category: 'economy',
    categoryLabel: 'Economy Cars',
    modelsExample: 'Toyota Vitz, Mazda Demio, Nissan Note',
    imageUrl: kenyaEconomyImg,
    shortDescription: 'Popular, nimble, and fuel-efficient Kenyan city hatchbacks. Ideal for Nairobi traffic, errands, day trips, and affordable journeys.',
    seats: '4 - 5 Seats',
    transmission: 'Automatic',
    driveType: '2WD',
    fuelType: 'Petrol',
    tag: 'Best for Town & City'
  },
  {
    id: 'saloon-cars',
    name: 'Saloon Cars',
    category: 'saloon',
    categoryLabel: 'Saloon Cars',
    modelsExample: 'Toyota Premio, Toyota Fielder, Toyota Axio',
    imageUrl: kenyaSaloonImg,
    shortDescription: 'Kenya’s most beloved sedans and wagons offering smooth comfort, generous boot space, and superb fuel economy on town and highway runs.',
    seats: '5 Seats',
    transmission: 'Automatic',
    driveType: '2WD',
    fuelType: 'Petrol',
    tag: 'Comfort & Fuel Saver'
  },
  {
    id: 'suvs',
    name: 'SUVs',
    category: 'suv',
    categoryLabel: 'SUVs',
    modelsExample: 'Toyota RAV4, Toyota Harrier, Nissan X-Trail, Subaru Forester',
    imageUrl: kenyaSuvImg,
    shortDescription: 'Kenya’s favorite elevated crossovers with high ground clearance, modern styling, and generous luggage capacity for upcountry or holiday road trips.',
    seats: '5 - 7 Seats',
    transmission: 'Automatic',
    driveType: 'AWD / 4WD',
    fuelType: 'Petrol / Diesel',
    tag: 'Versatile & Elevated'
  },
  {
    id: '4x4-vehicles',
    name: '4x4 Vehicles',
    category: '4x4',
    categoryLabel: '4x4 Vehicles',
    modelsExample: 'Toyota Land Cruiser 70-Series Custom Safari 4WD, Prado TX',
    imageUrl: kenyaSafari4x4Img,
    shortDescription: 'Kenya’s ultimate safari workhorses fitted with pop-up game-viewing roofs, heavy-duty suspension, dual spare wheels, and true all-terrain power.',
    seats: '7 - 8 Seats',
    transmission: 'Manual / Automatic 4x4',
    driveType: 'Full-Time 4WD',
    fuelType: 'Diesel',
    tag: 'Safari & Rugged Wilderness'
  },
  {
    id: 'vans-minibuses',
    name: 'Vans & Minibuses',
    category: 'vans-minibuses',
    categoryLabel: 'Vans & Minibuses',
    modelsExample: 'Toyota HiAce Safari Tour Van (Pop-Up Roof), Toyota Coaster (22–28 Seater)',
    imageUrl: kenyaTourVanImg,
    shortDescription: 'The quintessential Kenyan tour van with pop-up game viewing roof and high-capacity tourist minibuses for family groups, conferences, and safari teams.',
    seats: '8 - 28 Seats',
    transmission: 'Manual / Automatic',
    driveType: '4WD / RWD',
    fuelType: 'Diesel',
    tag: 'Group & Tour Specialist'
  },
  {
    id: 'luxury-vehicles',
    name: 'Luxury Vehicles',
    category: 'luxury',
    categoryLabel: 'Luxury Vehicles',
    modelsExample: 'Toyota Land Cruiser V8 / 300 Series Executive, Range Rover',
    imageUrl: kenyaLuxuryV8Img,
    shortDescription: 'Kenya’s premier executive status vehicle with commanding presence, leather luxury, whisper-quiet cabin, and optional VIP chauffeur service.',
    seats: '5 - 7 Seats',
    transmission: 'Automatic',
    driveType: 'AWD / 4WD',
    fuelType: 'Petrol / Diesel',
    tag: 'VIP & Executive Prestige'
  }
];

export const CAR_HIRE_FLEET: CarHireVehicle[] = [
  {
    id: 'safari-land-cruiser-extended',
    name: 'Custom Extended 4x4 Safari Land Cruiser',
    category: 'safari-4x4',
    categoryLabel: 'Safari 4x4',
    tag: 'Most Popular Safari Choice',
    seatingCapacity: 8,
    luggageCapacity: '8 Large Safari Bags + Hand Luggage',
    transmission: 'Manual 4x4',
    fuelType: 'Diesel',
    driveType: 'Full-Time 4WD',
    imageUrl: kenyaSafari4x4Img,
    secondaryImages: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'The undisputed gold standard of East African wildlife safaris. Specially extended chassis with 7 guaranteed window seats and an elevated pop-up roof for panoramic 360° wildlife photography.',
    keyFeatures: [
      'Guaranteed window seat for every passenger',
      'Full-length pop-up roof hatch for wildlife photography',
      'Dual spare wheels, heavy-duty suspension & high clearance',
      'Twin long-range fuel tanks for remote bush safaris',
      'Air conditioning and individual passenger reading lights'
    ],
    safariEquipment: [
      'Onboard 220V inverter with multi-socket USB charging ports',
      'Electric mini-fridge / insulated beverage cooler box',
      'Long-range VHF two-way bush radio for animal sighting alerts',
      'Comprehensive first-aid emergency medical kit',
      'Beanbags for camera lens stability & binoculars holder'
    ],
    rentalOptions: ['Chauffeur-Driven', 'Self-Drive', 'Cross-Border'],
    recommendedFor: 'Maasai Mara, Serengeti, Amboseli, Samburu, Northern Frontier & Great Migration safaris'
  },
  {
    id: 'safari-land-cruiser-standard',
    name: 'Standard 4x4 Safari Land Cruiser',
    category: 'safari-4x4',
    categoryLabel: 'Safari 4x4',
    tag: 'Agile 4WD Explorer',
    seatingCapacity: 5,
    luggageCapacity: '5 Safari Duffels',
    transmission: 'Manual 4x4',
    fuelType: 'Diesel',
    driveType: 'Full-Time 4WD',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Agile, robust, and capable of navigating the steepest wilderness trails. Perfect for couples, small families, or wildlife photographers seeking private game viewing flexibility.',
    keyFeatures: [
      'High ground clearance with heavy-duty off-road suspension',
      'Pop-up safari roof for stand-up wildlife viewing',
      'Dual spare tires and front electric recovery winch',
      'Snorkel air intake for shallow river crossings',
      'Spacious luggage area with tie-down straps'
    ],
    safariEquipment: [
      'VHF long-range communication radio',
      'Dual-battery setup with USB device charging ports',
      'Insulated cooler box for chilled refreshments',
      'Safari wildlife reference guidebook & birding checklist'
    ],
    rentalOptions: ['Chauffeur-Driven', 'Self-Drive', 'Cross-Border'],
    recommendedFor: 'Couples, private photographers, rugged terrain expeditions, Lake Turkana & Tsavo'
  },
  {
    id: 'safari-tour-minivan',
    name: 'Safari Tour Minivan (4x4 Pop-Up Van)',
    category: 'safari-van',
    categoryLabel: 'Safari Tour Van',
    tag: 'Best Value Safari Option',
    seatingCapacity: 8,
    luggageCapacity: '7-8 Medium Travel Bags',
    transmission: 'Manual 4x4',
    fuelType: 'Diesel',
    driveType: 'Part-Time 4WD',
    imageUrl: kenyaTourVanImg,
    secondaryImages: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Customized Toyota HiAce Safari Minivan equipped with a pop-up roof and all-terrain capabilities. An economical, comfortable choice for budget and mid-range safari journeys across Kenya.',
    keyFeatures: [
      'Elevated pop-up roof for unobstructed game viewing',
      '7 to 8 individual reclining bucket seats with seatbelts',
      'Spacious aisle and large sliding windows',
      'Reliable 4WD system for park dirt roads and mud tracks',
      'Air conditioning and stereo sound system'
    ],
    safariEquipment: [
      'VHF two-way radio linked to ranger frequencies',
      'Device charging ports for phones and cameras',
      'Complimentary mineral water cooler box',
      'First aid safety pack and fire extinguisher'
    ],
    rentalOptions: ['Chauffeur-Driven', 'Airport Transfers'],
    recommendedFor: 'Lake Nakuru, Naivasha, Ol Pejeta, Amboseli, Nairobi National Park & family groups'
  },
  {
    id: 'toyota-land-cruiser-prado-tx',
    name: 'Executive Toyota Land Cruiser Prado TX / V8',
    category: 'executive-suv',
    categoryLabel: 'Executive SUV',
    tag: 'Luxury Comfort & Town',
    seatingCapacity: 7,
    luggageCapacity: '5 Large Suitcases',
    transmission: 'Automatic 4x4',
    fuelType: 'Diesel',
    driveType: 'Full-Time 4WD',
    imageUrl: kenyaLuxuryV8Img,
    secondaryImages: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Premium comfort and executive styling paired with authentic 4WD power. Perfect for VIP airport arrivals, corporate meetings, diplomatic transport, and luxury road excursions.',
    keyFeatures: [
      'Plush leather interior with multi-zone climate control',
      'Smooth automatic transmission and quiet highway ride',
      'Advanced safety features: ABS, multi-airbags, traction control',
      'Bluetooth audio, Apple CarPlay / Android Auto connectivity',
      'Tinted privacy windows with sunshades'
    ],
    safariEquipment: [
      'High-speed mobile Wi-Fi hotspot (available upon request)',
      'Bottled drinking water & daily newspapers/mags',
      'Executive chauffeur dressed in professional attire'
    ],
    rentalOptions: ['Chauffeur-Driven', 'Self-Drive', 'Airport Transfers'],
    recommendedFor: 'Nairobi corporate transfers, luxury lodge visits, VIP delegations, weddings & city meetings'
  },
  {
    id: 'toyota-rav4-compact-suv',
    name: 'Toyota RAV4 / Vanguard 4WD (Compact SUV)',
    category: 'executive-suv',
    categoryLabel: 'Compact SUV',
    tag: 'Smart Self-Drive',
    seatingCapacity: 5,
    luggageCapacity: '3 Suitcases + Daypacks',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    driveType: 'Part-Time 4WD',
    imageUrl: kenyaSuvImg,
    shortDescription: 'Nimble, fuel-efficient compact SUV with elevated ground clearance. Ideal for couples, solo travelers, and business road trips between Nairobi, Naivasha, Nakuru, and Mount Kenya.',
    keyFeatures: [
      'Excellent fuel economy for highway and town driving',
      'Automatic transmission with cruise control',
      'Reversing camera and parking sensors',
      'Isofix child seat anchors available',
      'Roof rails for additional luggage or sports gear'
    ],
    safariEquipment: [
      'USB fast-charging ports',
      'Emergency roadside assistance kit & spare tire',
      'Kenyan road map and navigation holder'
    ],
    rentalOptions: ['Self-Drive', 'Chauffeur-Driven', 'Airport Transfers'],
    recommendedFor: 'Self-drive getaways, Nairobi National Park, Hell’s Gate, city errands and day outings'
  },
  {
    id: 'group-safari-coaster-bus',
    name: 'Toyota Coaster Safari Coach (22–28 Seater)',
    category: 'group-bus',
    categoryLabel: 'Group Safari Coach',
    tag: 'Large Group Specialist',
    seatingCapacity: 28,
    luggageCapacity: 'Dedicated Rear Luggage Bay + Overhead Racks',
    transmission: 'Manual',
    fuelType: 'Diesel',
    driveType: 'Rear-Wheel Drive',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Spacious, air-conditioned passenger coach customized for large travel groups, student educational tours, corporate team-building retreats, and multi-day overland excursions.',
    keyFeatures: [
      'High-back ergonomic reclining seats with armrests',
      'Individual passenger air-conditioning vents & reading lights',
      'Public address (PA) microphone system for guides & tour leaders',
      'Expansive panoramic view windows for scenic routes',
      'Massive rear compartment for duffels and camping supplies'
    ],
    safariEquipment: [
      'Onboard commercial cooler box for beverages',
      'Professional certified driver with heavy PSV commercial license',
      'Speed governor and GPS fleet tracking system'
    ],
    rentalOptions: ['Chauffeur-Driven', 'Airport Transfers'],
    recommendedFor: 'Corporate retreats, destination weddings, school groups, sports teams & conference delegates'
  }
];

export const CAR_HIRE_SERVICES = [
  {
    id: 'chauffeur-driven',
    title: 'Chauffeur-Driven Safari Services',
    description: 'Travel with complete peace of mind guided by licensed, English & Swahili-fluent Kenyan driver-guides with vast wildlife tracking expertise and bush mechanic mastery.',
    icon: 'UserCheck',
    badge: 'Highly Recommended'
  },
  {
    id: 'self-drive',
    title: 'Self-Drive 4x4 Adventures',
    description: 'For independent explorers who want the freedom to set their own pace. Includes comprehensive vehicle insurance, GPS route consultation, and 24/7 emergency roadside support.',
    icon: 'Navigation',
    badge: 'Total Freedom'
  },
  {
    id: 'airport-transfers',
    title: 'Nairobi & Regional Airport Transfers',
    description: 'Punctual, seamless meet-and-greet transfers to and from Jomo Kenyatta International Airport (JKIA), Wilson Airport, and hotels in Nairobi, Mombasa, and Kisumu.',
    icon: 'Plane',
    badge: 'Punctual & Stress-Free'
  },
  {
    id: 'camping-kits',
    title: 'Rooftop Tents & Bush Camping Kits',
    description: 'Equip your 4x4 Land Cruiser with rooftop tents, ground dome tents, sleeping bags, gas cookers, camping chairs, and kitchen utensils for authentic wilderness camping.',
    icon: 'Tent',
    badge: 'Wilderness Ready'
  },
  {
    id: 'cross-border',
    title: 'Cross-Border Safari Permits (COMESA)',
    description: 'Full facilitation of cross-border documentation, COMESA yellow card insurance, and logbook clearances for seamless overland travel into Tanzania, Uganda, and Rwanda.',
    icon: 'Globe',
    badge: 'East Africa Wide'
  },
  {
    id: 'corporate-leasing',
    title: 'Corporate & NGO Long-Term Rentals',
    description: 'Reliable, well-maintained fleets with tailored monthly and seasonal corporate lease contracts for international NGOs, film crews, researchers, and safari consultants.',
    icon: 'Briefcase',
    badge: 'Flexible Terms'
  }
];

export const CAR_HIRE_INCLUSIONS = [
  {
    title: 'Comprehensive Commercial PSV Insurance',
    description: 'Every rental vehicle in our fleet is fully insured with commercial passenger service vehicle coverage for total traveler protection.'
  },
  {
    title: 'Unlimited Mileage within Kenya',
    description: 'Explore freely without worrying about extra per-kilometer surcharges on safari circuits across the country.'
  },
  {
    title: '24/7 Roadside Assistance & Breakdown Guarantee',
    description: 'In the rare event of mechanical difficulty, our dedicated field support network provides swift roadside help or prompt vehicle replacement.'
  },
  {
    title: 'Certified Wildlife Driver-Guides (Optional)',
    description: 'Enhance your trip with native Kenyan safari professionals who know park secret spots, predator hotspots, and bush navigation.'
  },
  {
    title: 'Custom Safari Amenities Included',
    description: 'Pop-up roof for photography, dual spare tires, HF/VHF bush radio, high-clearance suspension, and onboard beverage cooler box.'
  },
  {
    title: 'Flexible Pick-Up & Drop-Off Locations',
    description: 'Pick up your vehicle at JKIA Airport, Wilson Airport, our Nairobi CBD office, or request delivery directly to your hotel or residence.'
  }
];

export const CAR_HIRE_FAQS = [
  {
    question: 'What documents are required to rent a vehicle with Jungle Lane Safaris?',
    answer: 'For self-drive rentals, you need a valid National Driver’s License (or International Driving Permit if your license is not in English), a valid passport or National ID, and you must be at least 23 years of age. For chauffeur-driven rentals, only basic booking contact details and your travel itinerary are required.'
  },
  {
    question: 'Why should I choose a 4x4 Safari Land Cruiser over a regular SUV for national parks?',
    answer: 'Kenyan national reserves like Maasai Mara, Amboseli, and Samburu have rugged dirt terrain, black-cotton mud tracks, and rocky riverbeds. Our custom 4x4 Land Cruisers feature heavy-duty suspension, high ground clearance, dual spare wheels, and most importantly, an elevated pop-up roof allowing all passengers to stand up for 360° unobstructed wildlife photography.'
  },
  {
    question: 'Can I take the vehicle across borders into Tanzania or Uganda?',
    answer: 'Yes! Jungle Lane Safaris provides complete cross-border facilitation including COMESA Yellow Card insurance, vehicle logbook authorities, and border clearance paperwork for safaris continuing into the Serengeti, Ngorongoro, Bwindi, or Volcanoes National Park. Please notify us at least 7 days in advance.'
  },
  {
    question: 'Is fuel included in the car hire quote?',
    answer: 'Standard rentals operate on a "Full-to-Full" or "Like-for-Like" fuel policy, where vehicles are delivered with a full tank and returned with a full tank. If you book a complete chauffeur-driven safari package, fuel and driver allowances are included in your custom proposal.'
  },
  {
    question: 'Do you offer airport pick-up and drop-off at JKIA and Wilson Airport?',
    answer: 'Yes, we provide 24/7 airport meet-and-greet services. Our driver will meet you at the arrival terminal with a personalized name board, assist with your luggage, and either transfer you to your hotel or hand over your safari vehicle immediately.'
  },
  {
    question: 'How do I get a custom quote or check vehicle availability?',
    answer: 'Simply click "Request Car Hire Quote" on any vehicle card, or reach out to our Nairobi operations desk directly on WhatsApp (+254 721 700 878) or email. We respond promptly with vehicle options tailored to your group size and route.'
  }
];
