import { DestinationDoc, UserDoc, ItineraryDoc, AnalyticsEventDoc } from './types';

export const SEED_USERS: UserDoc[] = [
  {
    user_id: 'usr_admin_01',
    email: 'obajedavidbyron@gmail.com',
    display_name: 'David Byron (Jungle Lane Admin)',
    profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    created_at: '2026-08-01T08:00:00.000Z',
    role: 'admin'
  },
  {
    user_id: 'usr_traveler_02',
    email: 'sarah.watson@adventuretravel.com',
    display_name: 'Sarah Watson',
    profile_pic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    created_at: '2026-08-05T14:30:00.000Z',
    role: 'user'
  }
];

export const SEED_DESTINATIONS: DestinationDoc[] = [
  {
    attraction_id: 'attr_maasai_mara',
    name: 'Maasai Mara National Reserve',
    slug: 'maasai-mara-national-reserve',
    category: 'Nature',
    description: 'World-famous savanna wilderness renowned for the annual Great Migration of over two million wildebeest and zebras, dense lion prides, and sweeping golden grasslands along the Mara River.',
    location: {
      city: 'Narok County',
      country: 'Kenya',
      latitude: -1.4889,
      longitude: 35.1444,
      address: 'Sekenani Gate, Maasai Mara National Reserve, Narok'
    },
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80'
    ],
    opening_hours: 'Daily 06:00 AM – 06:30 PM',
    website_url: 'https://www.maasaimarakenyapark.com',
    phone_number: '+254 700 123 456',
    direct_directions_url: 'https://maps.google.com/?q=-1.4889,35.1444',
    average_rating: 4.9,
    review_count: 3840,
    is_featured: true,
    tags: ['big-5', 'wildlife', 'great-migration', 'photography', 'family-friendly', 'scenic']
  },
  {
    attraction_id: 'attr_amboseli',
    name: 'Amboseli National Park',
    slug: 'amboseli-national-park',
    category: 'Nature',
    description: 'Famed for giant free-ranging elephant herds set against the dramatic snow-capped backdrop of Mount Kilimanjaro, with observation hills offering 360-degree views of seasonal marshes and birdlife.',
    location: {
      city: 'Kajiado County',
      country: 'Kenya',
      latitude: -2.6527,
      longitude: 37.2606,
      address: 'Kimana Gate, Amboseli National Park, Loitokitok'
    },
    images: [
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80'
    ],
    opening_hours: 'Daily 06:00 AM – 06:00 PM',
    website_url: 'https://www.kws.go.ke/amboseli-national-park',
    phone_number: '+254 711 987 654',
    direct_directions_url: 'https://maps.google.com/?q=-2.6527,37.2606',
    average_rating: 4.8,
    review_count: 2410,
    is_featured: true,
    tags: ['elephants', 'kilimanjaro-views', 'family-friendly', 'scenic', 'wildlife']
  },
  {
    attraction_id: 'attr_giraffe_centre',
    name: 'Giraffe Centre & Karen Blixen Museum',
    slug: 'giraffe-centre-karen-blixen',
    category: 'Museum',
    description: 'Non-profit conservation center protecting endangered Rothschild giraffes with raised feeding platforms, adjacent to the historic farmhouse estate of author Karen Blixen nestled under the Ngong Hills.',
    location: {
      city: 'Nairobi',
      country: 'Kenya',
      latitude: -1.3756,
      longitude: 36.7447,
      address: 'Duma Road, Karen, Nairobi'
    },
    images: [
      'https://images.unsplash.com/photo-1574063413132-355dbfd83e21?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80'
    ],
    opening_hours: 'Daily 09:00 AM – 05:00 PM',
    website_url: 'https://www.giraffecentre.org',
    phone_number: '+254 20 807 0804',
    direct_directions_url: 'https://maps.google.com/?q=-1.3756,36.7447',
    average_rating: 4.8,
    review_count: 1920,
    is_featured: true,
    tags: ['family-friendly', 'day-trip', 'conservation', 'educational', 'photography']
  },
  {
    attraction_id: 'attr_carnivore_restaurant',
    name: 'The Carnivore Restaurant Nairobi',
    slug: 'carnivore-restaurant-nairobi',
    category: 'Restaurant',
    description: 'Iconic open-air charcoal barbecue feast venue where succulent meats are roasted over a huge charcoal pit on traditional Maasai swords and carved directly onto sizzling cast-iron plates.',
    location: {
      city: 'Nairobi',
      country: 'Kenya',
      latitude: -1.3283,
      longitude: 36.8041,
      address: 'Langata Road, Nairobi'
    },
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'
    ],
    opening_hours: 'Daily 12:00 PM – 11:00 PM',
    website_url: 'https://www.tamarind.co.ke/carnivore',
    phone_number: '+254 733 611 608',
    direct_directions_url: 'https://maps.google.com/?q=-1.3283,36.8041',
    average_rating: 4.7,
    review_count: 3150,
    is_featured: false,
    tags: ['dining', 'culinary', 'nyama-choma', 'family-friendly']
  },
  {
    attraction_id: 'attr_fort_jesus',
    name: 'Fort Jesus & UNESCO Old Town Mombasa',
    slug: 'fort-jesus-old-town-mombasa',
    category: 'Landmark',
    description: '16th-century Portuguese fortress overlooking the old port of Mombasa, representing a masterpiece of Renaissance military architecture and Swahili maritime trading heritage.',
    location: {
      city: 'Mombasa',
      country: 'Kenya',
      latitude: -4.0628,
      longitude: 39.6797,
      address: 'Nkrumah Road, Old Town, Mombasa'
    },
    images: [
      'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80'
    ],
    opening_hours: 'Daily 08:00 AM – 06:00 PM',
    website_url: 'https://whc.unesco.org/en/list/1295',
    phone_number: '+254 41 222 5934',
    direct_directions_url: 'https://maps.google.com/?q=-4.0628,39.6797',
    average_rating: 4.6,
    review_count: 1420,
    is_featured: true,
    tags: ['unesco-heritage', 'history', 'coastal', 'family-friendly', 'photography']
  },
  {
    attraction_id: 'attr_diani_marine_dhow',
    name: 'Diani Beach Marine Reserve & Dhow Safari',
    slug: 'diani-beach-marine-reserve',
    category: 'Activity',
    description: 'Pristine turquoise Indian Ocean paradise with powder-white sands, coral reef snorkeling with green sea turtles and dolphins, kitesurfing, and sunset sailing on authentic wooden Swahili dhows.',
    location: {
      city: 'Diani Beach',
      country: 'Kenya',
      latitude: -4.2792,
      longitude: 39.5936,
      address: 'Diani Beach Road, Kwale County'
    },
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    opening_hours: 'Open 24/7 (Water Sports 07:00 AM – 06:00 PM)',
    website_url: 'https://www.dianibeach.com',
    phone_number: '+254 722 555 777',
    direct_directions_url: 'https://maps.google.com/?q=-4.2792,39.5936',
    average_rating: 4.9,
    review_count: 2890,
    is_featured: true,
    tags: ['marine', 'snorkeling', 'beach', 'sunset-cruise', 'luxury', 'free-access']
  },
  {
    attraction_id: 'attr_lake_nakuru',
    name: 'Lake Nakuru National Park',
    slug: 'lake-nakuru-national-park',
    category: 'Nature',
    description: 'Rift Valley alkaline sanctuary hosting both white and endangered black rhinos, Rothschild giraffes, lions, and thousands of flamingos lining the scenic lake shoreline beneath Baboon Cliff.',
    location: {
      city: 'Nakuru',
      country: 'Kenya',
      latitude: -0.3644,
      longitude: 36.0822,
      address: 'Main Gate, Lake Nakuru National Park, Nakuru'
    },
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
    ],
    opening_hours: 'Daily 06:00 AM – 06:00 PM',
    website_url: 'https://www.kws.go.ke/lake-nakuru-national-park',
    phone_number: '+254 51 221 7234',
    direct_directions_url: 'https://maps.google.com/?q=-0.3644,36.0822',
    average_rating: 4.7,
    review_count: 1780,
    is_featured: false,
    tags: ['rhino-sanctuary', 'birdwatching', 'flamingos', 'rift-valley', 'wildlife']
  }
];

export const SEED_ITINERARIES: ItineraryDoc[] = [
  {
    itinerary_id: 'itin_classic_circuit_01',
    user_id: 'usr_traveler_02',
    title: '5-Day Classic Big 5 & Great Rift Circuit',
    is_public: true,
    created_at: '2026-08-10T10:00:00.000Z',
    updated_at: '2026-08-10T12:00:00.000Z',
    items: [
      {
        attraction_id: 'attr_giraffe_centre',
        day_number: 1,
        notes: 'Morning arrival in Nairobi, giraffe feeding platform and lunch in Karen.',
        order: 0
      },
      {
        attraction_id: 'attr_carnivore_restaurant',
        day_number: 1,
        notes: 'Celebratory welcome dinner at the famous Carnivore open-pit barbecue.',
        order: 1
      },
      {
        attraction_id: 'attr_lake_nakuru',
        day_number: 2,
        notes: 'Scenic drive down the Great Rift Valley escarpment. Afternoon rhino and flamingo tracking.',
        order: 2
      },
      {
        attraction_id: 'attr_maasai_mara',
        day_number: 3,
        notes: 'Transfer to Maasai Mara, afternoon game drive seeking lion prides and cheetahs.',
        order: 3
      },
      {
        attraction_id: 'attr_maasai_mara',
        day_number: 4,
        notes: 'Full day safari with bush picnic lunch beside the Mara River migration crossing.',
        order: 4
      }
    ]
  },
  {
    itinerary_id: 'itin_bush_to_beach_02',
    user_id: 'usr_admin_01',
    title: '7-Day Bush to Beach Luxury Expedition',
    is_public: true,
    created_at: '2026-08-08T09:00:00.000Z',
    updated_at: '2026-08-08T09:00:00.000Z',
    items: [
      {
        attraction_id: 'attr_amboseli',
        day_number: 1,
        notes: 'Fly into Amboseli for Kilimanjaro sunset photography and elephant observation.',
        order: 0
      },
      {
        attraction_id: 'attr_maasai_mara',
        day_number: 3,
        notes: 'Charter flight to Maasai Mara luxury tented camp.',
        order: 1
      },
      {
        attraction_id: 'attr_fort_jesus',
        day_number: 5,
        notes: 'Coastal transfer to Mombasa, UNESCO Swahili heritage walk.',
        order: 2
      },
      {
        attraction_id: 'attr_diani_marine_dhow',
        day_number: 6,
        notes: 'Private wooden dhow coral reef snorkeling and sandbank seafood barbecue.',
        order: 3
      }
    ]
  }
];

export const SEED_ANALYTICS_EVENTS: AnalyticsEventDoc[] = [
  {
    event_id: 'evt_init_001',
    session_id: 'sess_live_101',
    event_type: 'page_view',
    target_entity_id: 'destinations_explorer',
    metadata: {
      route_path: '/destinations',
      device_type: 'Desktop'
    },
    timestamp: '2026-08-15T06:30:00.000Z'
  },
  {
    event_id: 'evt_init_002',
    session_id: 'sess_live_102',
    event_type: 'search',
    target_entity_id: 'search_bar',
    metadata: {
      search_term: 'Maasai Mara migration',
      device_type: 'Mobile'
    },
    timestamp: '2026-08-15T06:32:10.000Z'
  },
  {
    event_id: 'evt_init_003',
    session_id: 'sess_live_102',
    event_type: 'page_view',
    target_entity_id: 'attr_maasai_mara',
    metadata: {
      route_path: '/destinations/maasai-mara-national-reserve',
      device_type: 'Mobile'
    },
    timestamp: '2026-08-15T06:32:30.000Z'
  },
  {
    event_id: 'evt_init_004',
    session_id: 'sess_live_103',
    event_type: 'bookmark',
    target_entity_id: 'itin_classic_circuit_01',
    metadata: {
      device_type: 'Desktop'
    },
    timestamp: '2026-08-15T06:40:00.000Z'
  },
  {
    event_id: 'evt_init_005',
    session_id: 'sess_live_104',
    event_type: 'outbound_click',
    target_entity_id: 'attr_maasai_mara',
    metadata: {
      link_type: 'Directions/Map',
      external_url: 'https://maps.google.com/?q=-1.4889,35.1444',
      device_type: 'Mobile'
    },
    timestamp: '2026-08-15T06:45:15.000Z'
  }
];
