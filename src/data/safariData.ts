import { SafariPackage, Destination, Testimonial, BlogPost } from '../types';

export const SAFARI_PACKAGES: SafariPackage[] = [
  {
    id: 'maasai-mara-3day',
    title: '3-Day Maasai Mara Express Safari',
    tag: 'Best Seller',
    category: 'multi',
    durationDays: 3,
    durationLabel: '3 Days / 2 Nights',
    priceFromUSD: 580,
    location: 'Maasai Mara National Reserve',
    destinations: ['Maasai Mara', 'Great Rift Valley'],
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Immersion into Kenya’s premier wildlife haven. Experience thrilling game drives searching for the Big Five, big cats, and the Great Migration.',
    keyHighlights: [
      'Unlimited game drives in Maasai Mara ecosystem',
      'High chance of spotting Big Five & Mara River crocodiles',
      'Optional hot air balloon safari over Mara plains',
      'Authentic Maasai cultural village interaction',
      'Dedicated 4x4 Land Cruiser with pop-up roof'
    ],
    dayByDay: [
      {
        day: 1,
        title: 'Nairobi to Maasai Mara Reserve & Afternoon Game Drive',
        description: 'Depart Nairobi early morning via the Great Rift Valley viewpoint. Arrive at Maasai Mara in time for hot lunch at your lodge/tented camp. Embark on your first exciting afternoon game drive tracking lions, cheetahs, and elephants until sunset.',
        overnight: 'Mara Sopa Lodge / Enkorok Mara Camp',
        meals: 'Lunch, Dinner'
      },
      {
        day: 2,
        title: 'Full Day Wildlife Tracking & Mara River Exploration',
        description: 'Spend an entire day traversing the open savannah of Maasai Mara with packed picnic lunch. Visit the legendary Mara River where wildebeest migrate, and search for leopards, rhinos, and large lion prides.',
        overnight: 'Mara Sopa Lodge / Enkorok Mara Camp',
        meals: 'Breakfast, Picnic Lunch, Dinner'
      },
      {
        day: 3,
        title: 'Early Morning Game Drive & Return to Nairobi',
        description: 'Enjoy a sunrise game drive capturing predators on morning hunt, followed by hearty breakfast. Check out and journey back to Nairobi, arriving late afternoon with airport or hotel drop-off.',
        overnight: 'N/A',
        meals: 'Breakfast'
      }
    ],
    inclusions: [
      'Transport in custom 4x4 Safari Land Cruiser with pop-up roof',
      'All Maasai Mara reserve entry fees',
      '2 Nights full board accommodation',
      'Professional English/Swahili speaking driver-guide',
      'Unlimited game drives as specified in itinerary',
      'Complimentary bottled drinking water in vehicle',
      'Nairobi hotel/airport pick-up and drop-off'
    ],
    exclusions: [
      'International airfare & visa fees',
      'Optional Hot Air Balloon Safari ($450 per person)',
      'Optional Maasai Village Cultural Tour ($30 per person)',
      'Personal expenses & driver tips'
    ]
  },
  {
    id: 'lakes-legends-5day',
    title: '5-Day Lakes & Legends Safari (Nakuru + Naivasha + Mara)',
    tag: 'Top Recommended',
    category: 'multi',
    durationDays: 5,
    durationLabel: '5 Days / 4 Nights',
    priceFromUSD: 990,
    location: 'Lake Nakuru, Naivasha & Maasai Mara',
    destinations: ['Lake Nakuru', 'Lake Naivasha', 'Hell\'s Gate', 'Maasai Mara'],
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'A classic Kenyan circuit combining flamingo-filled Rift Valley lakes, white/black rhino sanctuaries, hippo boat safaris, and full Mara safari magic.',
    keyHighlights: [
      'Rhino tracking at Lake Nakuru National Park',
      'Scenic boat ride on Lake Naivasha amidst hippos & fish eagles',
      'Walking or cycling safari in Hell’s Gate National Park',
      '2 full days in world-renowned Maasai Mara',
      'Stay in handpicked eco-camps and scenic lodges'
    ],
    dayByDay: [
      {
        day: 1,
        title: 'Nairobi to Lake Nakuru National Park',
        description: 'Drive from Nairobi to Lake Nakuru National Park. Afternoon game drive around the alkaline lake to spot endangered white and black rhinos, Rothschild giraffes, and flamingo flocks.',
        overnight: 'Lake Nakuru Sopa Lodge / Flamingo Hill Camp',
        meals: 'Lunch, Dinner'
      },
      {
        day: 2,
        title: 'Lake Naivasha Boat Safari & Hell’s Gate Walking Tour',
        description: 'Morning drive to Lake Naivasha. Enjoy a thrilling 1-hour motorized boat safari on the lake. Continue to Hell’s Gate for guided walking safari amongst zebras and gazelles.',
        overnight: 'Naivasha Sopa Lodge / Lake Naivasha Country Club',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 3,
        title: 'Lake Naivasha to Maasai Mara National Reserve',
        description: 'Travel through Narok town to the famous Maasai Mara. Check in at camp and set out for an evening game drive across the golden rolling hills.',
        overnight: 'Mara Sopa Lodge / Azure Mara Haven',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 4,
        title: 'Full Day Maasai Mara Big Five Expedition',
        description: 'A full day dedicated to wildlife watching in Maasai Mara. Picnic lunch near the Mara River and extensive tracking of Mara’s top predators.',
        overnight: 'Mara Sopa Lodge / Azure Mara Haven',
        meals: 'Breakfast, Picnic Lunch, Dinner'
      },
      {
        day: 5,
        title: 'Sunrise Game Drive & Return to Nairobi',
        description: 'Final morning game drive, breakfast, and return journey to Nairobi arriving around 4:00 PM.',
        overnight: 'N/A',
        meals: 'Breakfast'
      }
    ],
    inclusions: [
      'Transport in private 4x4 Safari Land Cruiser',
      'All park entrance fees (Nakuru, Naivasha, Maasai Mara)',
      'Boat safari on Lake Naivasha',
      'Full board accommodation for 4 nights',
      'Professional guide services',
      'Bottled water on game drives'
    ],
    exclusions: [
      'Bicycle hire at Hell’s Gate ($15)',
      'Tips and personal items',
      'Visas and travel insurance'
    ]
  },
  {
    id: 'nairobi-excursion-1day',
    title: '1-Day Nairobi Ultimate Wildlife Excursion',
    tag: 'Day Excursion',
    category: 'day',
    durationDays: 1,
    durationLabel: 'Full Day (8 Hours)',
    priceFromUSD: 160,
    location: 'Nairobi',
    destinations: ['Nairobi NP', 'Elephant Orphanage', 'Giraffe Centre'],
    imageUrl: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'The ultimate 1-day Nairobi highlight! Safari inside the world’s only national park within a capital city, adopt rescued baby elephants, and hand-feed giraffes.',
    keyHighlights: [
      'Nairobi National Park game drive with city skyline backdrop',
      'Visit David Sheldrick Wildlife Trust Elephant Orphanage',
      'Hand-feed endangered Rothschild Giraffes at Giraffe Centre',
      'Traditional Kenyan BBQ lunch at famous Carnivore Restaurant',
      'Seamless hotel/airport pick-up and drop-off'
    ],
    dayByDay: [
      {
        day: 1,
        title: 'Nairobi Game Drive, Elephant Sanctuary & Giraffe Feeding',
        description: '6:00 AM pick-up for early game drive in Nairobi National Park (spot lions, rhinos, buffaloes). At 11:00 AM visit David Sheldrick Elephant Orphanage to see baby elephants playing. 1:00 PM lunch at Carnivore/Tamambo. 3:00 PM feed giraffes at Giraffe Centre before returning to hotel.',
        meals: 'Lunch'
      }
    ],
    inclusions: [
      'Private vehicle transport with driver guide',
      'Nairobi National Park entry fee',
      'Sheldrick Elephant Orphanage booking & entrance fee',
      'Giraffe Centre entry fee',
      'Lunch at Carnivore / Local Restaurant',
      'Bottled drinking water'
    ],
    exclusions: [
      'Alcoholic beverages at lunch',
      'Personal gratuities'
    ]
  },
  {
    id: 'kenya-diani-8day',
    title: '8-Day Classic Kenya Safari & Diani Beach Extension',
    tag: 'Luxury Choice',
    category: 'luxury',
    durationDays: 8,
    durationLabel: '8 Days / 7 Nights',
    priceFromUSD: 2150,
    location: 'Amboseli, Lake Nakuru, Mara & Diani Beach',
    destinations: ['Amboseli', 'Lake Nakuru', 'Maasai Mara', 'Diani Beach'],
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'The ultimate bush-to-beach African holiday! Combine Amboseli’s giant elephants under Kilimanjaro, Rift Valley rhinos, Maasai Mara, and Diani’s white sands.',
    keyHighlights: [
      'Kilimanjaro backdrop view in Amboseli National Park',
      'Great Migration safari in Maasai Mara',
      'Domestic flight to Diani Beach (Ukunda)',
      '3 nights at luxury beachfront resort in Diani',
      'Perfect blend of action packed safari & relaxed beach bliss'
    ],
    dayByDay: [
      { day: 1, title: 'Nairobi to Amboseli National Park', description: 'Drive south to Amboseli with views of Mt. Kilimanjaro. Afternoon game drive in elephant realm.', overnight: 'Amboseli Serena Lodge', meals: 'Lunch, Dinner' },
      { day: 2, title: 'Amboseli to Lake Nakuru', description: 'Morning photo safari in Amboseli, then drive to Lake Nakuru National Park.', overnight: 'Sarova Lion Hill Game Lodge', meals: 'Breakfast, Lunch, Dinner' },
      { day: 3, title: 'Lake Nakuru to Maasai Mara', description: 'Drive across Rift Valley to Maasai Mara Reserve.', overnight: 'Ashnil Mara Camp', meals: 'Breakfast, Lunch, Dinner' },
      { day: 4, title: 'Full Day Maasai Mara Safari', description: 'Comprehensive Mara game tracking with picnic lunch.', overnight: 'Ashnil Mara Camp', meals: 'Breakfast, Lunch, Dinner' },
      { day: 5, title: 'Fly from Maasai Mara to Diani Beach', description: 'Morning game drive, then transfer to airstrip for flight directly to Diani Beach.', overnight: 'Baobab Beach Resort & Spa', meals: 'Breakfast, Dinner' },
      { day: 6, title: 'Diani Beach Relax & Ocean Adventures', description: 'Free day for swimming, glass bottom boat, diving or dhow sailing.', overnight: 'Baobab Beach Resort & Spa', meals: 'Breakfast, Lunch, Dinner' },
      { day: 7, title: 'Diani Beach Leisure Day', description: 'Enjoy spa treatments, seafood dining and sunset beach walks.', overnight: 'Baobab Beach Resort & Spa', meals: 'Breakfast, Lunch, Dinner' },
      { day: 8, title: 'Diani to Nairobi Flight & Departure', description: 'Transfer to Ukunda airstrip for flight back to Nairobi for international connection.', meals: 'Breakfast' }
    ],
    inclusions: [
      '4x4 Land Cruiser safari vehicle on mainland',
      'Domestic flight Mara - Diani - Nairobi',
      '7 nights luxury lodge & beachfront resort accommodation',
      'All park entrance fees and full board meals',
      'Airport transfers'
    ],
    exclusions: [
      'Water sports & spa treatments',
      'International flights'
    ]
  },
  {
    id: 'amboseli-tsavo-4day',
    title: '4-Day Amboseli & Tsavo Elephant Trail Safari',
    tag: 'Family Friendly',
    category: 'multi',
    durationDays: 4,
    durationLabel: '4 Days / 3 Nights',
    priceFromUSD: 750,
    location: 'Amboseli & Tsavo West',
    destinations: ['Amboseli', 'Tsavo West', 'Mzima Springs'],
    imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Witness iconic giant elephant herds under Mt. Kilimanjaro and explore the volcanic landscapes, lava flows, and underwater hippo viewing at Mzima Springs.',
    keyHighlights: [
      'Iconic photos of elephants with Mt. Kilimanjaro peak',
      'Underwater hippo observation chamber at Mzima Springs',
      'Shetani lava flow exploration in Tsavo West',
      'High density of red elephants, leopards, and lions'
    ],
    dayByDay: [
      { day: 1, title: 'Nairobi to Amboseli National Park', description: 'Scenic drive to Amboseli. Afternoon game drive in swampy plains.', overnight: 'Kibo Safari Camp', meals: 'Lunch, Dinner' },
      { day: 2, title: 'Amboseli Full Day Game Drives', description: 'Full day exploring Amboseli’s observation hill and swamp habitats.', overnight: 'Kibo Safari Camp', meals: 'Breakfast, Lunch, Dinner' },
      { day: 3, title: 'Amboseli to Tsavo West National Park', description: 'Drive to Tsavo West. Visit Mzima Springs and underwater hippo hideout.', overnight: 'Kilaguni Serena Lodge', meals: 'Breakfast, Lunch, Dinner' },
      { day: 4, title: 'Morning Safari & Return to Nairobi', description: 'Final game drive, breakfast, and return journey to Nairobi.', meals: 'Breakfast' }
    ],
    inclusions: [
      '4x4 Land Cruiser with pop-up roof',
      'All park fees and 3 nights lodging',
      'Professional driver guide'
    ],
    exclusions: [
      'Tips and personal items'
    ]
  },
  {
    id: 'hellsgate-naivasha-1day',
    title: '1-Day Hell’s Gate Biking & Naivasha Hippo Boat Safari',
    tag: 'Day Excursion',
    category: 'day',
    durationDays: 1,
    durationLabel: 'Full Day (10 Hours)',
    priceFromUSD: 140,
    location: 'Lake Naivasha & Hell\'s Gate',
    destinations: ['Lake Naivasha', 'Hell\'s Gate', 'Crescent Island'],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Active day excursion! Cycle alongside zebras and giraffes through geothermal gorges in Hell’s Gate, followed by a scenic lake boat trip with hippos.',
    keyHighlights: [
      'Cycle past zebras, impalas, and gazelles in Hell’s Gate',
      'Guided walk through Ol Njorowa Gorge',
      '1-hour hippo and bird watching boat safari on Lake Naivasha',
      'Optional Crescent Island walking safari among free animals'
    ],
    dayByDay: [
      {
        day: 1,
        title: 'Naivasha Cycling, Gorge Hike & Boat Ride',
        description: '7:00 AM pick-up from Nairobi. Arrive Hell’s Gate, collect bicycle and ride through dramatic cliffs. Hike down the gorge with a local guide. Enjoy lakeside lunch, followed by boat trip on Lake Naivasha.',
        meals: 'Lunch'
      }
    ],
    inclusions: ['Transport', 'Park fees', 'Bike hire', 'Boat trip', 'Lunch'],
    exclusions: ['Tips and personal items']
  }
];

export const DESTINATIONS: Destination[] = [
  {
    id: 'maasai-mara',
    name: 'Maasai Mara Reserve',
    tagline: 'Home of the Great Wildebeest Migration & Big Cats',
    highlights: ['Great Migration (July-Oct)', 'Big Cats (Lions, Cheetahs, Leopards)', 'Maasai Culture', 'Hot Air Balloon Safaris'],
    description: 'World-famous savanna ecosystem renowned for unmatched predator sightings, endless plains, and the dramatic annual wildebeest migration crossing the Mara River.',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    bestTimeToVisit: 'July to October (Migration), Year-round for wildlife',
    famousFor: 'Wildebeest Migration & Lions',
    recommendedDuration: '3 - 4 Days'
  },
  {
    id: 'amboseli',
    name: 'Amboseli National Park',
    tagline: 'Land of Giants & Mount Kilimanjaro Backdrop',
    highlights: ['Huge Elephant Herds', 'Mt. Kilimanjaro Views', 'Observation Hill', 'Over 400 Bird Species'],
    description: 'Located at the foot of snow-capped Mount Kilimanjaro, Amboseli offers iconic views of massive elephant families walking against the backdrop of Africa’s highest peak.',
    imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80',
    bestTimeToVisit: 'June to October & January to February',
    famousFor: 'Large Tuskers & Kilimanjaro Views',
    recommendedDuration: '2 - 3 Days'
  },
  {
    id: 'lake-nakuru',
    name: 'Lake Nakuru & Naivasha',
    tagline: 'Flamingo Havens, Rhinos & Rift Valley Lakes',
    highlights: ['Black & White Rhino Sanctuary', 'Flamingos & Pelicans', 'Hippo Boat Safaris', 'Rothschild Giraffes'],
    description: 'A beautiful alkaline lake in the Rift Valley sanctuary surrounded by steep escarpments, harboring endangered white and black rhinos and vibrant birdlife.',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    bestTimeToVisit: 'Year-round destination',
    famousFor: 'Rhino Sanctuary & Birdlife',
    recommendedDuration: '2 Days'
  },
  {
    id: 'samburu',
    name: 'Samburu National Reserve',
    tagline: 'The Arid North & The Samburu Special Five',
    highlights: ['Grevy’s Zebra', 'Reticulated Giraffe', 'Beisa Oryx', 'Somali Ostrich', 'Ewaso Nyiro River'],
    description: 'A rugged wilderness in Kenya’s Northern frontier along the Ewaso Nyiro River, home to unique species found nowhere else in southern Kenya.',
    imageUrl: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
    bestTimeToVisit: 'June to October & December to March',
    famousFor: 'Samburu Special 5 & Cultural Heritage',
    recommendedDuration: '3 Days'
  },
  {
    id: 'diani-beach',
    name: 'Diani Beach & Coastal Kenya',
    tagline: 'Award-Winning Tropical White Sand Paradise',
    highlights: ['Powder-white sand beaches', 'Coral Reef Snorkeling', 'Kisite Mpunguti Marine Park', 'Swahili Seafood Dining'],
    description: 'Consistently voted Africa’s leading beach destination, Diani combines swaying palm trees, crystal blue Indian Ocean waters, and luxury beach resorts.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    bestTimeToVisit: 'December to March & July to October',
    famousFor: 'White Sand Beaches & Marine Life',
    recommendedDuration: '3 - 5 Days'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-1',
    guestName: 'Mark & Sarah Thompson',
    country: 'United States',
    flagEmoji: '🇺🇸',
    rating: 5,
    title: 'Lifetime Memory in Maasai Mara!',
    comment: 'Jungle Lane Safaris made our dream honeymoon safari absolutely flawless! Our guide David had an uncanny talent for tracking leopards and lions. The custom 4x4 Land Cruiser was super comfortable with pop-up roof for photography. 10/10 recommendation!',
    safariTaken: '5-Day Lakes & Legends Safari',
    date: 'February 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rev-2',
    guestName: 'Claire Dubois',
    country: 'France',
    flagEmoji: '🇫🇷',
    rating: 5,
    title: 'Authentic local expertise and top care',
    comment: 'Traveling as a solo female traveler, I felt 100% safe and welcomed like family by the Jungle Lane team. From JKIA airport greeting to our daily game drives in Amboseli, everything was executed with precision and warmth.',
    safariTaken: '3-Day Maasai Mara Express',
    date: 'January 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rev-3',
    guestName: 'David & Hannah Schmidt',
    country: 'Germany',
    flagEmoji: '🇩🇪',
    rating: 5,
    title: 'Unbelievable 8-day Bush to Beach Safari',
    comment: 'Seeing Mount Kilimanjaro with elephants right in front, followed by 3 days in Maasai Mara and a relaxing stay at Diani beach. The team took care of every single detail including domestic flights and dietary preferences.',
    safariTaken: '8-Day Classic Kenya Safari & Diani Beach',
    date: 'November 2025',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rev-4',
    guestName: 'James & Fiona Campbell',
    country: 'United Kingdom',
    flagEmoji: '🇬🇧',
    rating: 5,
    title: 'Best 1-Day Nairobi Excursion ever',
    comment: 'We had a 1-day stopover in Nairobi and booked Jungle Lane Safaris. We saw lions in Nairobi National Park, held baby giraffes, and visited the elephant orphanage. Unforgettable day!',
    safariTaken: '1-Day Nairobi Ultimate Excursion',
    date: 'March 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'wildebeest-migration-guide',
    title: 'Complete Guide to the Great Wildebeest Migration in Kenya',
    excerpt: 'When to visit Maasai Mara to witness over 1.5 million wildebeest crossing the crocodile-infested Mara River.',
    category: 'Safari Tips',
    readTime: '6 min read',
    date: 'July 2025',
    author: 'Jungle Lane Safari Team',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    content: `The Great Wildebeest Migration is widely recognized as one of the Seven Natural Wonders of Africa. Every year between July and October, over 1.5 million wildebeest, 200,000 zebras, and hundreds of thousands of gazelles journey north from Serengeti into Kenya’s Maasai Mara Reserve in search of lush green pastures.

### When to See the Mara River Crossings
- **July to August:** The herds begin arriving in Maasai Mara. River crossings at Mara and Talek rivers are frequent and dramatic.
- **September:** Peak migration period in Mara plains with intense predator action (lions, cheetahs, leopards).
- **October:** Herds start moving back south towards Serengeti as rains begin.

### How to Book
Due to high demand during migration season (July–October), luxury and mid-range camps in Maasai Mara get fully booked 6 to 9 months in advance. Contact Jungle Lane Safaris today to secure prime lodge spots!`
  },
  {
    id: 'safari-packing-list',
    title: 'What to Pack for a Kenya Safari: Essentials & Dress Code',
    excerpt: 'Neutral clothing, camera gear, anti-malaria items, and luggage restrictions for 4x4 safari vehicles.',
    category: 'Travel Advice',
    readTime: '4 min read',
    date: 'August 2025',
    author: 'Jungle Lane Safari Team',
    imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80',
    content: `Packing for an African safari requires balancing comfort, weather versatility, and luggage limits. Here is your definitive packing list from local Kenyan experts:

1. **Colors:** Wear light neutral tones (khaki, beige, olive green). Avoid bright neon colors or dark blue/black (which attracts tsetse flies).
2. **Layering:** Morning game drives start early (6:30 AM) when temperatures are crisp (12°C/53°F). Bring a fleece jacket or light fleece pullover.
3. **Footwear:** Comfortable walking sneakers or lightweight hiking boots.
4. **Photography:** Camera with zoom lens (200mm-500mm), extra memory cards, and a dust-proof dry bag.
5. **Sun Protection:** Wide-brimmed safari hat, polaroid sunglasses, and high-SPF sunscreen.`
  },
  {
    id: 'mid-range-vs-luxury',
    title: 'Mid-Range vs. Luxury Safari Tented Camps in Kenya',
    excerpt: 'Understanding accommodation tiers, amenities, meal styles, and private conservancy access.',
    category: 'Accommodation',
    readTime: '5 min read',
    date: 'September 2025',
    author: 'Jungle Lane Safari Team',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
    content: `One of the most common questions from travelers is choosing between mid-range safari tented camps and ultra-luxury lodges.

### Mid-Range Tented Camps ($250 - $450 / night per person)
- **Features:** Ensuite bathrooms with hot flush toilets and hot showers, comfortable king beds, gourmet buffet meals, generator electricity.
- **Vibe:** Highly comfortable, authentic, great value for money.

### Ultra-Luxury Camps ($800 - $1800 / night per person)
- **Features:** Private plunge pools, open canvas suites, butler service, fine dining wines, private conservancy game drives, complimentary laundry.
- **Vibe:** Exclusive luxury immersion into remote wilderness.`
  }
];

export const COMPANY_STATS = [
  { value: '10+', label: 'Years of Local Expertise', subtext: 'Native Kenyan guides & safari planners' },
  { value: '100%', label: 'Customized Trips', subtext: 'Tailored for budget, couples & families' },
  { value: '500+', label: 'Big Five Sightings', subtext: 'High-success predator tracking rate' },
  { value: '5.0★', label: 'TripAdvisor & Google', subtext: 'Top customer satisfaction rating' }
];

export const WHY_CHOOSE_US = [
  {
    title: 'Native Maasai & Kenyan Guides',
    description: 'Deep ancestral knowledge of wildlife behavior, tracking skills, multi-lingual fluency, and warm Kenyan hospitality.',
    icon: 'Compass'
  },
  {
    title: 'Custom 4x4 Land Cruisers',
    description: 'Guaranteed 4x4 Land Cruisers with pop-up roof for 360° photography, high ground clearance, fridge, and phone charging ports.',
    icon: 'Truck'
  },
  {
    title: '24/7 On-Ground Concierge',
    description: 'Dedicated personal support from arrival at Nairobi JKIA airport to departure. We are on the ground in Kenya with you.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Tailored for Every Budget',
    description: 'Flexible options from affordable budget tented camps to 5-star luxury lodges without compromising safari quality.',
    icon: 'Sparkles'
  }
];

export const CONTACT_INFO = {
  companyName: 'JUNGLE LANE SAFARIS',
  tagline: 'Explore Africa with Africans',
  phoneDisplay: '+254 721 700 878',
  phoneRaw: '254721700878',
  whatsappNumber: '0721700878',
  whatsappUrl: 'https://wa.me/254721700878',
  email: 'junglelanesafaristours@gmail.com',
  address: 'Kimathi Street, City Centre, Nairobi, Kenya',
  katoLicence: 'KATO Member No. FE/542',
  ktbLicence: 'Licensed by Kenya Tourism Authority (TRA)',
  socials: {
    facebook: 'https://www.facebook.com/share/1BYyifq1Vv/',
    instagram: 'https://www.instagram.com/jungle_lane_safaris?igsh=MXZvcWdwbXZ5c3hnOQ==',
    whatsapp: 'https://wa.me/254721700878'
  }
};
