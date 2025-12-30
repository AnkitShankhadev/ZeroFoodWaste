require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const FoodDonation = require('../models/FoodDonation');
const { MONGODB_URI } = require('../config/env');

// Connect to database
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await FoodDonation.deleteMany({});

    console.log('Creating seed data...');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@zerofoodwaste.com',
      password: 'admin123',
      role: 'ADMIN',
      status: 'ACTIVE',
    });

    // Create Donors
    const donor1 = await User.create({
      name: 'John Donor',
      email: 'donor1@example.com',
      password: 'password123',
      role: 'DONOR',
      status: 'ACTIVE',
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'New Delhi, India',
      },
      phone: '+91 9876543210',
    });

    const donor2 = await User.create({
      name: 'Jane Donor',
      email: 'donor2@example.com',
      password: 'password123',
      role: 'DONOR',
      status: 'ACTIVE',
      location: {
        lat: 28.7041,
        lng: 77.1025,
        address: 'Gurgaon, India',
      },
      phone: '+91 9876543211',
    });

    // Create NGOs
    const ngo1 = await User.create({
      name: 'Food Bank NGO',
      email: 'ngo1@example.com',
      password: 'password123',
      role: 'NGO',
      status: 'ACTIVE',
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'New Delhi, India',
      },
      phone: '+91 9876543220',
    });

    const ngo2 = await User.create({
      name: 'Community Kitchen',
      email: 'ngo2@example.com',
      password: 'password123',
      role: 'NGO',
      status: 'ACTIVE',
      location: {
        lat: 28.7041,
        lng: 77.1025,
        address: 'Gurgaon, India',
      },
      phone: '+91 9876543221',
    });

    // Create Volunteers
    const volunteer1 = await User.create({
      name: 'Mike Volunteer',
      email: 'volunteer1@example.com',
      password: 'password123',
      role: 'VOLUNTEER',
      status: 'ACTIVE',
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'New Delhi, India',
      },
      phone: '+91 9876543230',
    });

    const volunteer2 = await User.create({
      name: 'Sarah Volunteer',
      email: 'volunteer2@example.com',
      password: 'password123',
      role: 'VOLUNTEER',
      status: 'ACTIVE',
      location: {
        lat: 28.7041,
        lng: 77.1025,
        address: 'Gurgaon, India',
      },
      phone: '+91 9876543231',
    });

    // Create Food Donations
    const donation1 = await FoodDonation.create({
      donorId: donor1._id,
      foodType: 'Fresh Vegetables',
      quantity: '10 kg',
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      description: 'Fresh vegetables including tomatoes, onions, and potatoes',
      status: 'CREATED',
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'New Delhi, India',
      },
    });

    const donation2 = await FoodDonation.create({
      donorId: donor2._id,
      foodType: 'Cooked Food',
      quantity: '50 plates',
      expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      description: 'Freshly cooked meals from restaurant',
      status: 'CREATED',
      location: {
        lat: 28.7041,
        lng: 77.1025,
        address: 'Gurgaon, India',
      },
    });

    const donation3 = await FoodDonation.create({
      donorId: donor1._id,
      foodType: 'Fruits',
      quantity: '5 kg',
      expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      description: 'Fresh fruits including apples and bananas',
      status: 'ACCEPTED',
      acceptedBy: ngo1._id,
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'New Delhi, India',
      },
    });

    console.log('Seed data created successfully!');
    console.log('\nTest Users:');
    console.log('Admin:', admin.email, '- password: admin123');
    console.log('Donor 1:', donor1.email, '- password: password123');
    console.log('Donor 2:', donor2.email, '- password: password123');
    console.log('NGO 1:', ngo1.email, '- password: password123');
    console.log('NGO 2:', ngo2.email, '- password: password123');
    console.log('Volunteer 1:', volunteer1.email, '- password: password123');
    console.log('Volunteer 2:', volunteer2.email, '- password: password123');
    console.log('\nCreated', await FoodDonation.countDocuments(), 'donations');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

