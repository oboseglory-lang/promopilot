import { IndustryConfig } from '../types';

export const INDUSTRIES: IndustryConfig[] = [
  {
    id: 'food',
    name: 'Restaurants, Cafes & Bakeries',
    icon: 'Utensils',
    description: 'Bistros, pizzerias, coffee shops, burger joints, home bakeries & catering',
    sampleOffers: [
      'Buy 1 Large Pizza, Get 2nd Half Price this Tuesday',
      'Free Artisan Cappuccino with any Breakfast Bowl before 10 AM',
      'Weekend Family Platter for R280 (Feeds 4-5 people)',
      'Happy Hour Special: 2-for-1 Cocktails & Tapas from 4PM - 7PM',
      'Order 2 Burgers and get complimentary Loaded Fries'
    ],
    suggestedTones: ['Mouth-watering & Casual', 'Urgent Happy Hour', 'Warm & Welcoming', 'Exclusive Weekend Treat'],
    targetAudiences: ['Local foodies and brunch lovers', 'Busy office workers on lunch break', 'Families looking for dinner deals', 'College students & evening hangouts'],
    defaultHashtags: ['#FoodieDeals', '#LocalEats', '#CafeCulture', '#DinnerSpecial', '#FoodInspo']
  },
  {
    id: 'salon',
    name: 'Salons, Spas & Beauty',
    icon: 'Sparkles',
    description: 'Hair stylists, nail bars, barbershops, lash artists, massage & day spas',
    sampleOffers: [
      'Fresh Glow Combo: Gel Mani + Pedi for only R350 (Save R120)',
      'Gentlemen Cut + Hot Towel Shave + Beard Oil treatment for R180',
      'Midweek Pamper: Full Body Aromatherapy Massage at 25% off',
      'First-Time Client Special: 20% off all hair coloring services',
      'Spring Lash Extensions Set + Complimentary Eyebrow Tint'
    ],
    suggestedTones: ['Pampering & Luxe', 'Confidence Boosting', 'Friendly Neighborhood Salon', 'Limited Appointments Scarcity'],
    targetAudiences: ['Working professionals needing self-care', 'Brides and event attendees', 'Loyal locals looking for regular grooming', 'Weekend pamper seekers'],
    defaultHashtags: ['#BeautyDeals', '#SalonLife', '#NailInspo', '#SelfCareDay', '#HairTransformation']
  },
  {
    id: 'retail',
    name: 'Boutiques, Clothing & Retail',
    icon: 'ShoppingBag',
    description: 'Fashion boutiques, shoe stores, home decor, gift shops & accessory outlets',
    sampleOffers: [
      'End of Season Mega Sale: Up to 50% off all winter outerwear',
      'Payday Weekend: Buy Any 2 Dresses & Get a Free Tote Bag',
      'Flash 48-Hour Clearance: All Footwear marked down to R199 - R399',
      'New Arrival Drop: 15% off new collection with code NEWLOOK15',
      'Spend R600 or more and receive an instant R100 gift voucher'
    ],
    suggestedTones: ['Trendy & Fashion-forward', 'Excited Flash Sale', 'Chic & Boutique', 'Payday Splurge'],
    targetAudiences: ['Fashion-conscious shoppers', 'Gift hunters', 'Bargain lovers searching for payday sales', 'Local style seekers'],
    defaultHashtags: ['#OOTD', '#BoutiqueStyle', '#RetailTherapy', '#PaydaySale', '#StyleInspo']
  },
  {
    id: 'fitness',
    name: 'Gyms, Fitness & Personal Trainers',
    icon: 'Dumbbell',
    description: 'CrossFit boxes, yoga studios, personal trainers, pilates, martial arts',
    sampleOffers: [
      '30-Day Total Body Kickstart: 8 Personal Sessions + Meal Plan for R750',
      'Zero Joining Fee + First Month 50% Off when you sign up this week',
      'Unlimited Pilates & Yoga Intro Month pass for only R450',
      'Bring a Workout Buddy: 2-for-1 Monthly Gym Memberships',
      'Spring Transformation Challenge with Cash Prizes'
    ],
    suggestedTones: ['Motivational & High Energy', 'No Excuses Inspiring', 'Supportive & Community-Driven', 'Transformative'],
    targetAudiences: ['People restarting their fitness journey', 'Busy professionals wanting quick workouts', 'Athletes and weightlifters', 'Post-holiday reset seekers'],
    defaultHashtags: ['#FitFam', '#FitnessMotivation', '#WorkoutChallenge', '#GymLife', '#HealthyLifestyle']
  },
  {
    id: 'trades',
    name: 'Trades & Home Services',
    icon: 'Wrench',
    description: 'Plumbers, electricians, painters, handyman services, garden care & cleaners',
    sampleOffers: [
      'Spring Gutter Cleaning & Roof Inspection package for R499',
      'Deep Carpet & Couch Cleaning Special: 3 Rooms for R650',
      'Zero Call-Out Fee for plumbing emergencies booked this week',
      'Solar & Inverter Diagnostic + Safety Check at 30% off',
      'Garden Seasonal Clean-up: Mowing, trimming & rubble removal for R380'
    ],
    suggestedTones: ['Dependable & Trustworthy', 'Urgent Emergency Relief', 'Honest & Professional', 'Friendly Local Expert'],
    targetAudiences: ['Homeowners and landlords', 'Property managers', 'New tenants moving into homes', 'Seniors needing trusted maintenance'],
    defaultHashtags: ['#HomeImprovement', '#TrustedLocalTrades', '#PlumbingServices', '#CleanHomeHappyHome', '#SupportLocalPros']
  },
  {
    id: 'automotive',
    name: 'Automotive, Mechanics & Car Wash',
    icon: 'Car',
    description: 'Auto repair shops, car detailing, tyre centers, mobile valets & tinting',
    sampleOffers: [
      'Major Service Special: Oil change, filters + 30-point check from R850',
      'Deluxe Foam Wash + Ceramic Sealant + Interior Detail for R220',
      'Buy 3 Premium Tyres, get 4th Tyre 50% Off with free wheel balancing',
      'Air Conditioner Regas & Antibacterial Sanitization for R399',
      'Free Brake Pad Inspection with any minor service'
    ],
    suggestedTones: ['Reliable & Safety-Focused', 'Honest & Straight-Shooting', 'Weekend Shine & Pride', 'Urgent Holiday Prep'],
    targetAudiences: ['Daily commuters', 'Fleet vehicle owners', 'Car enthusiasts who love spotless rides', 'Holiday road-trip travelers'],
    defaultHashtags: ['#CarDetailing', '#AutoRepair', '#CarCare', '#DriveSafe', '#MechanicLife']
  },
  {
    id: 'realestate',
    name: 'Real Estate & Property',
    icon: 'Building',
    description: 'Estate agents, property rentals, holiday stays, airbnbs & commercial spaces',
    sampleOffers: [
      'Free No-Obligation Property Valuation + Marketing Analysis this month',
      'Reduced 4.5% Commission for Sole Mandate Listings signed before month end',
      'Weekend Open House Showcase with complimentary coffee & treats',
      'Midweek Coastal Airbnb Getaway: Stay 3 Nights, Pay for 2',
      'First-Time Buyer Consultation & Pre-Approval Assistance'
    ],
    suggestedTones: ['Prestigious & Confident', 'Warm & Dream-Home Inviting', 'Market Authority', 'Exclusive Opportunity'],
    targetAudiences: ['First-time home buyers', 'Property investors looking for yield', 'Families upgrading space', 'Holidaymakers'],
    defaultHashtags: ['#DreamHome', '#RealEstateDeals', '#PropertyInvestment', '#OpenHouse', '#LocalRealtor']
  },
  {
    id: 'professional',
    name: 'Professional & Business Services',
    icon: 'Briefcase',
    description: 'Bookkeepers, accountants, tax consultants, graphic designers & marketing',
    sampleOffers: [
      'End of Tax Season Health Check: 20% off filing for small businesses',
      'Company Registration + Tax Clearance + Free Bank Account Setup for R599',
      'Free 30-Minute Financial Audit for startups and retail shop owners',
      'Monthly Bookkeeping retainers starting from just R450/month',
      'Brand Identity Refresh Package for local entrepreneurs'
    ],
    suggestedTones: ['Authoritative & Knowledgeable', 'Stress-Relieving & Clear', 'ROI & Profit Focused', 'Supportive Partner'],
    targetAudiences: ['Small business owners', 'Freelancers and sole proprietors', 'Startups needing tax compliance', 'Growing retail merchants'],
    defaultHashtags: ['#SmallBusinessSupport', '#AccountingTips', '#TaxSeason', '#BusinessGrowth', '#EntrepreneurTips']
  },
  {
    id: 'crafts',
    name: 'Artisans, Handmade & Specialty',
    icon: 'Palette',
    description: 'Jewelry makers, candle creators, custom furniture, organic skincare, craft goods',
    sampleOffers: [
      'Handcrafted Soy Candle Trio Gift Set: 20% off with code CANDLELOVE',
      'Custom Engraved Leather Wallets: Free personalization this weekend',
      'Organic Artisanal Soap Bundles: Buy 3, get 1 free bath bomb',
      'Bespoke Wooden Cutting Board with complimentary wood care wax',
      'Market Day Special: R50 voucher with every purchase over R300'
    ],
    suggestedTones: ['Warm & Story-Driven', 'Craftsmanship & Quality', 'Eco-Conscious & Natural', 'Thoughtful Gifting'],
    targetAudiences: ['Conscious consumers who value handmade', 'Gift shoppers looking for unique items', 'Local market attendees', 'Interior design enthusiasts'],
    defaultHashtags: ['#HandmadeWithLove', '#SupportLocalMakers', '#ArtisanCrafts', '#UniqueGifts', '#SmallBatch']
  },
  {
    id: 'events',
    name: 'Events, Workshops & Entertainment',
    icon: 'Calendar',
    description: 'Live music venues, kids parties, pottery workshops, dance classes, pop-ups',
    sampleOffers: [
      'Early Bird Tickets: Save 30% for our Saturday Night Acoustic Sessions',
      'Sip & Paint Workshop: R295 includes canvas, paints & glass of wine',
      'Kids Birthday Party Package: 2 Hours All-Inclusive for 10 kids at R1,400',
      'Beginner Salsa Dance Crash Course: Couples discount R180 for 2',
      'Weekend Farmers & Makers Pop-Up Market: Free Entry & Live Music'
    ],
    suggestedTones: ['Exciting & Celebratory', 'FOMO & Limited Tickets', 'Fun & Community Gathering', 'Interactive & Joyful'],
    targetAudiences: ['Couples planning date nights', 'Parents planning weekend activities for kids', 'Friends looking for fun weekend spots', 'Hobbyists'],
    defaultHashtags: ['#WeekendVibes', '#LiveMusic', '#WhatToDoThisWeekend', '#CreativeWorkshops', '#FunTimes']
  }
];
