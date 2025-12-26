import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, Timestamp, query, limit, getDocs, addDoc } from 'firebase/firestore';

// Firebase config - hardcoded from gyana-setu project
const firebaseConfig = {
  apiKey: "AIzaSyCpfqChmUZcyeUhZ-SyYGxt-cnmQPmsuYg",
  authDomain: "gyana-setu.firebaseapp.com",
  projectId: "gyana-setu",
  storageBucket: "gyana-setu.firebasestorage.app",
  messagingSenderId: "321099112394",
  appId: "1:321099112394:web:7164536c9d7c0fd8edf933",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sample data
const sampleUsers = [
  {
    email: 'student1@college.com',
    password: 'student123',
    fullName: 'Raj Kumar',
    college: 'IIIT Hyderabad',
    rollNo: '20BCS001',
    role: 'student',
  },
  {
    email: 'student2@college.com',
    password: 'student123',
    fullName: 'Priya Sharma',
    college: 'IIT Hyderabad',
    rollNo: '20CS002',
    role: 'student',
  },
];

const sampleResources = [
  {
    title: 'Data Structures & Algorithms - Thomas Cormen',
    description: 'Used textbook in great condition. Perfect for competitive programming.',
    category: 'books',
    condition: 'good',
    college: 'IIIT Hyderabad',
    location: 'IIIT Library - 2nd Floor',
  },
  {
    title: 'Laptop Stand Metal',
    description: 'Adjustable laptop stand for better ergonomics. Hardly used.',
    category: 'electronics',
    condition: 'excellent',
    college: 'IIT Hyderabad',
    location: 'IIT Main Campus - Building A',
  },
];

async function setupFirebase() {
  console.log('🚀 Setting up Firebase...\n');

  try {
    // Create sample users
    console.log('📝 Creating sample student accounts...');
    for (const userData of sampleUsers) {
      try {
        const userCred = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );

        // Create user profile in Firestore
        await setDoc(doc(db, 'users', userCred.user.uid), {
          uid: userCred.user.uid,
          email: userData.email,
          fullName: userData.fullName,
          college: userData.college,
          rollNo: userData.rollNo,
          role: userData.role,
          avatar: '',
          bio: '',
          createdAt: Timestamp.now(),
        });

        console.log(`   ✅ Created: ${userData.email}`);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`   ⏭️  Skipped: ${userData.email} (already exists)`);
        } else {
          console.error(`   ❌ Error: ${error.message}`);
        }
      }
    }

    // Create sample resources
    console.log('\n📚 Creating sample resources...');
    
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, limit(1));
    const usersSnapshot = await getDocs(q);
    
    if (usersSnapshot.empty) {
      console.log('   ⚠️  No users found. Skipping resource creation.');
      console.log('   💡 Create a student account first, then run this script again.');
    } else {
      const firstUserDoc = usersSnapshot.docs[0];
      const firstUserId = firstUserDoc.id;
      const firstUserData = firstUserDoc.data();

      for (const resource of sampleResources) {
        const docRef = await addDoc(collection(db, 'resources'), {
          ...resource,
          userId: firstUserId,
          userName: firstUserData.fullName,
          userEmail: firstUserData.email,
          status: 'available',
          requests: [],
          createdAt: Timestamp.now(),
        });

        console.log(`   ✅ Created: "${resource.title}" (ID: ${docRef.id})`);
      }
    }

    console.log('\n✨ Firebase setup complete!');
    console.log('\n📋 Test Accounts:');
    console.log('   Email: student1@college.com');
    console.log('   Password: student123');
    console.log('   \n   Email: student2@college.com');
    console.log('   Password: student123');
    console.log('\n🎯 Next Steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:5173/student-login');
    console.log('   3. Sign in with one of the test accounts above');
    console.log('   4. Verify resources appear on dashboard\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupFirebase();
