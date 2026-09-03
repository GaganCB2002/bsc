import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Section from '../models/Section.js';
import Quiz from '../models/Quiz.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bschannabasappa_lms';

export default async function seedDatabase(exitOnComplete = true) {
  try {
    // Refuse to wipe data in production under ANY circumstances. The seed script
    // does a destructive deleteMany() on every collection — running it against a
    // real production database is a guaranteed data-loss bug, whether or not
    // exitOnComplete is set. Force an explicit opt-in via SEED_ALLOW_PRODUCTION.
    if (process.env.NODE_ENV === 'production' && process.env.SEED_ALLOW_PRODUCTION !== '1') {
      console.error('❌ Refusing to run seed in production. Set SEED_ALLOW_PRODUCTION=1 to override (not recommended).');
      if (exitOnComplete) process.exit(1);
      return;
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB for seeding...');
    }

    // Clear existing data (DESTRUCTIVE — only safe in dev)
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Module.deleteMany({}),
      Section.deleteMany({}),
      Quiz.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@bschannabasappa.com',
      password: 'Admin123!',
      role: 'admin',
      bio: 'Platform administrator for BSC Exclusive Learning Academy',
    });

    await User.create({
      name: 'Admin',
      email: 'admin@bscexclusive.com',
      password: 'Admin123!',
      role: 'admin',
      bio: 'Platform administrator for BSC Exclusive Learning Academy',
    });

    const user = await User.create({
      name: 'Gagan',
      email: 'user@bschannabasappa.com',
      password: 'User123!',
      role: 'user',
      bio: 'Passionate learner exploring the world of traditional textiles',
    });

    await User.create({
      name: 'Gagan',
      email: 'user@bscexclusive.com',
      password: 'User123!',
      role: 'user',
      bio: 'Passionate learner exploring the world of traditional textiles',
    });

    console.log('Created users: admin@bscexclusive.com, admin@bschannabasappa.com, user@bscexclusive.com, user@bschannabasappa.com');

    // ===================== COURSE 1: Art of Silk Weaving =====================
    const course1 = await Course.create({
      title: 'The Art of Silk Weaving',
      description: 'Master the ancient craft of silk weaving — from understanding raw silk fibers to creating intricate Kanchipuram patterns. This comprehensive course covers the entire journey of silk saree creation.',
      thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
      category: 'Textile Arts',
      difficulty: 'beginner',
      estimatedDuration: '8 hours',
      instructor: 'Master Weaver Raghu',
      status: 'published',
      tags: ['silk', 'weaving', 'traditional', 'kanchipuram'],
      createdBy: admin._id,
    });

    // Module 1
    const m1_1 = await Module.create({
      courseId: course1._id, title: 'Introduction to Silk', description: 'Understanding the world of silk', order: 0, estimatedDuration: '1 hour',
    });
    await Section.create({ moduleId: m1_1._id, courseId: course1._id, title: 'Welcome & Course Overview', order: 0, estimatedTime: 5, content: `# Welcome to The Art of Silk Weaving\n\nWelcome to this comprehensive journey into the world of silk weaving. In this course, you will learn:\n\n- **The history** of silk production spanning 5,000+ years\n- **Different types** of silk and their unique properties\n- **Weaving techniques** from basic to advanced\n- **Pattern design** including traditional Indian motifs\n- **Quality assessment** — how to identify authentic silk\n\n## What You'll Need\n\n- An open and curious mind\n- A notebook for sketching patterns\n- Access to silk fabric samples (optional but recommended)\n\n> "Silk is the queen of all textiles — its shimmer tells the story of thousands of years of human ingenuity." — Master Weaver Raghu\n\nLet's begin this beautiful journey together!` });
    await Section.create({ moduleId: m1_1._id, courseId: course1._id, title: 'History of Silk', order: 1, estimatedTime: 15, content: `# The History of Silk\n\n## Ancient Origins\n\nSilk production, or **sericulture**, originated in ancient China around 3500 BCE. According to legend, Empress Xi Ling Shi discovered silk when a silkworm cocoon fell into her tea.\n\n## The Silk Road\n\nThe famous **Silk Road** (130 BCE – 1453 CE) was a network of trade routes connecting East Asia to the Mediterranean. Silk was so valuable it was often used as currency.\n\n### Key Historical Milestones:\n\n| Period | Event |\n|--------|-------|\n| 3500 BCE | Silk discovered in China |\n| 200 BCE | Silk Road trade begins |\n| 300 CE | Silk reaches India via trade |\n| 1400 CE | Kanchipuram silk tradition established |\n| 1938 | BS Channabasappa founded |\n\n## Silk in India\n\nIndia is the **second-largest silk producer** in the world. The four main types of Indian silk are:\n\n1. **Mulberry Silk** — Karnataka, Tamil Nadu\n2. **Tussar Silk** — Jharkhand, Bihar\n3. **Muga Silk** — Assam (exclusive to India)\n4. **Eri Silk** — Northeast India\n\n## The Kanchipuram Tradition\n\nKanchipuram (Kanchi) in Tamil Nadu is the silk capital of India. Kanchipuram silk sarees are characterized by:\n- Pure mulberry silk threads\n- Real gold or silver zari\n- Contrasting borders and pallus\n- Temple-inspired designs\n- Each saree takes 15–45 days to weave` });
    await Section.create({ moduleId: m1_1._id, courseId: course1._id, title: 'Types of Silk Fibers', order: 2, estimatedTime: 15, content: `# Types of Silk Fibers\n\nSilk comes in many varieties, each with unique characteristics.\n\n## 1. Mulberry Silk\n\nThe **most common and finest** silk, produced by Bombyx mori silkworms.\n\n**Properties:**\n- Smooth, lustrous finish\n- Natural white/cream color\n- Strong and durable\n- Excellent drape\n\n## 2. Tussar (Tussah) Silk\n\n**Wild silk** produced by Antheraea moths.\n\n**Properties:**\n- Rich golden/honey color\n- Slightly coarse texture\n- Natural, organic appeal\n- Popular for ethnic wear\n\n## 3. Muga Silk\n\n**Exclusive to Assam**, this golden silk is one of the rarest in the world.\n\n**Properties:**\n- Natural golden sheen\n- Extremely durable\n- Gets richer with washing\n- UNESCO-protected heritage\n\n## 4. Eri (Ahimsa) Silk\n\nAlso known as **peace silk** because the moth is not killed.\n\n**Properties:**\n- Soft, warm texture\n- Cotton-like feel\n- Ethical production\n- Thermal insulation\n\n## Quick Comparison\n\n| Type | Luster | Strength | Cost | Origin |\n|------|--------|----------|------|--------|\n| Mulberry | ★★★★★ | ★★★★ | ★★★ | Karnataka, TN |\n| Tussar | ★★★ | ★★★ | ★★ | Jharkhand |\n| Muga | ★★★★ | ★★★★★ | ★★★★★ | Assam |\n| Eri | ★★ | ★★★ | ★ | Northeast |` });

    // Module 2
    const m1_2 = await Module.create({
      courseId: course1._id, title: 'Understanding the Loom', description: 'Exploring traditional and modern looms', order: 1, estimatedDuration: '2 hours',
    });
    await Section.create({ moduleId: m1_2._id, courseId: course1._id, title: 'Types of Handlooms', order: 0, estimatedTime: 15, content: `# Types of Handlooms\n\n## Pit Loom\nThe **pit loom** is the oldest type of handloom in India. The weaver sits on a platform with their feet in a pit, operating the pedals below.\n\n### Advantages:\n- Simple construction\n- Low cost\n- Traditional authenticity\n- Suitable for heavy fabrics\n\n## Frame Loom\nA more modern design with a **raised frame** structure.\n\n### Advantages:\n- Better posture for weavers\n- Faster operation\n- More versatile\n\n## Jacquard Loom\nUsed for **complex pattern weaving**, the Jacquard attachment allows intricate designs to be woven into the fabric.\n\n### Used for:\n- Kanchipuram silk sarees\n- Banarasi brocades\n- Complex geometric patterns\n\n> The Jacquard mechanism, invented by Joseph Marie Jacquard in 1804, was one of the precursors to modern computing!` });
    await Section.create({ moduleId: m1_2._id, courseId: course1._id, title: 'Loom Setup & Preparation', order: 1, estimatedTime: 20, content: `# Loom Setup & Preparation\n\n## Step 1: Warping\n\nThe **warp** is the set of lengthwise threads held in tension on the loom. Warping is the process of preparing these threads.\n\n### Process:\n1. Select the silk thread count (60, 80, or 120 count)\n2. Measure the required length\n3. Wind threads on the warping drum\n4. Transfer to the loom beam\n\n## Step 2: Drawing-In\n\nEach warp thread must be **individually drawn through** the heddle eyes and reed.\n\n**For a single saree:**\n- 5,000 to 8,000 warp threads\n- Each manually threaded\n- Takes 2-3 days\n\n## Step 3: Tying\n\nThe warp threads are tied to the **front beam** of the loom to create proper tension.\n\n## Step 4: Preparing the Weft\n\nThe **weft** threads (horizontal) are wound onto bobbins using a charkha (spinning wheel).\n\n## Important Notes\n\n⚠️ **Thread tension** is critical — too tight causes breakage, too loose creates uneven weaving.\n\n✅ A properly set up loom can produce 3-4 meters of fabric per day for plain weaving, but only 15-20cm for complex Kanchipuram patterns.` });
    await Section.create({ moduleId: m1_2._id, courseId: course1._id, title: 'Warp and Weft Basics', order: 2, estimatedTime: 15, content: `# Warp and Weft Basics\n\n## The Two Fundamental Thread Systems\n\nAll woven fabric is created by interlacing two perpendicular sets of threads:\n\n### Warp (Vertical)\n- Runs **lengthwise** on the loom\n- Held under tension\n- Determines fabric length\n- Usually stronger thread\n\n### Weft (Horizontal)\n- Runs **crosswise** on the loom  \n- Interlaced through warp using a shuttle\n- Determines fabric width\n- Carries the design elements\n\n## Basic Weave Patterns\n\n### 1. Plain Weave\nThe simplest pattern — weft goes over one, under one.\n- Light, breathable fabric\n- Good for summer wear\n\n### 2. Twill Weave\nWeft creates a diagonal pattern — over two, under one.\n- Stronger fabric\n- Characteristic diagonal lines\n- Used in silk suiting\n\n### 3. Satin Weave\nWeft floats over multiple warp threads.\n- Smooth, lustrous surface\n- Less durable\n- Premium finish\n\n## Practice Exercise\n\nTake a piece of any woven fabric and try to identify:\n1. Which direction is the warp?\n2. What weave pattern is used?\n3. How many threads per centimeter can you count?` });

    // Module 3
    const m1_3 = await Module.create({
      courseId: course1._id, title: 'Design & Patterns', description: 'Traditional motifs and modern designs', order: 2, estimatedDuration: '2 hours',
    });
    await Section.create({ moduleId: m1_3._id, courseId: course1._id, title: 'Traditional Indian Motifs', order: 0, estimatedTime: 20, content: `# Traditional Indian Motifs\n\nIndian textile design is rich with symbolism. Each motif tells a story.\n\n## Temple Border (Rekku)\n\nThe iconic **stepped pyramid** pattern found on Kanchipuram sarees, representing South Indian temple architecture.\n\n## Peacock (Mayil)\n\nThe **national bird of India** is one of the most popular motifs.\n- Symbolizes: Beauty, grace, pride\n- Style: Full peacock, peacock feather, dancing peacock\n\n## Mango (Paisley/Ambi)\n\nThe **paisley** pattern originated in India as the mango motif.\n- Symbolizes: Fertility, good luck\n- Found in: Banarasi, Kanchipuram, Kashmiri shawls\n\n## Lotus (Thamarai)\n\n- Symbolizes: Purity, divine beauty\n- Common in: Kanchipuram pallus, Banarasi borders\n\n## Elephant (Yanai)\n\n- Symbolizes: Royalty, strength, wisdom\n- Style: Procession elephants, single elephant motifs\n\n## Chariot (Ratham)\n\n- Symbolizes: Victory, celebration\n- Found in: Temple sarees, wedding sarees\n\n## Modern Adaptations\n\nContemporary designers blend traditional motifs with:\n- Geometric patterns\n- Abstract interpretations\n- Minimalist versions\n- Fusion designs combining multiple traditions` });
    await Section.create({ moduleId: m1_3._id, courseId: course1._id, title: 'Color Theory in Textiles', order: 1, estimatedTime: 15, content: `# Color Theory in Textiles\n\n## Traditional Color Symbolism\n\nIn Indian textiles, colors carry deep cultural significance:\n\n### Red\n- **Meaning:** Prosperity, marital bliss, power\n- **Used in:** Bridal sarees, festival wear\n- **Dye source:** Lac, madder root\n\n### Yellow/Gold\n- **Meaning:** Auspiciousness, knowledge, spring\n- **Used in:** Puja wear, haldi ceremonies\n- **Dye source:** Turmeric, saffron\n\n### Green\n- **Meaning:** Nature, fertility, new beginnings\n- **Used in:** Mehndi ceremonies, daily wear\n\n### Blue\n- **Meaning:** Calm, wisdom, divinity (Lord Krishna)\n- **Dye source:** Indigo (Neel)\n\n### White\n- **Meaning:** Peace, purity, mourning\n- **Used in:** Kerala Kasavu sarees, religious ceremonies\n\n## Natural vs Synthetic Dyes\n\n| Aspect | Natural | Synthetic |\n|--------|---------|----------|\n| Cost | Higher | Lower |\n| Fastness | Moderate | High |\n| Environment | Eco-friendly | Polluting |\n| Colors | Subtle, earthy | Bright, vivid |\n| Skin safety | Excellent | Variable |\n\n## BS Channabasappa's Commitment\n\nWe use **azo-free natural dyes** sourced from:\n- Indigo plants for blues\n- Pomegranate rinds for yellows\n- Madder root for reds\n- Iron oxide for blacks` });

    // Module 4 — Quiz Section
    const m1_4 = await Module.create({
      courseId: course1._id, title: 'Assessment & Review', description: 'Test your knowledge', order: 3, estimatedDuration: '30 min',
    });
    const quizSection1 = await Section.create({ moduleId: m1_4._id, courseId: course1._id, title: 'Course Quiz', order: 0, estimatedTime: 15, contentType: 'quiz', content: `# Course Assessment\n\nTest your knowledge of silk weaving fundamentals. You need 70% to pass.\n\nClick the button below to start the quiz.` });
    await Section.create({ moduleId: m1_4._id, courseId: course1._id, title: 'Course Summary & Next Steps', order: 1, estimatedTime: 10, content: `# Course Summary\n\n## What You've Learned\n\n✅ The rich 5,000-year history of silk production\n✅ Different types of silk fibers and their properties\n✅ Handloom types and their mechanisms\n✅ Warp and weft fundamentals\n✅ Traditional Indian motifs and their symbolism\n✅ Color theory in textile design\n\n## Key Takeaways\n\n1. **Silk is an art form** — each saree represents hundreds of hours of skilled labor\n2. **Tradition meets innovation** — modern designs build on centuries of heritage\n3. **Quality matters** — authentic handloom silk is distinguishable from machine-made\n4. **Sustainability** — natural dyes and ethical practices are the future\n\n## Next Steps\n\n- Explore our **Advanced Weaving Techniques** course\n- Visit a handloom center to see weaving in person\n- Try identifying weave patterns in your own wardrobe\n- Share your learning with others!\n\n🎉 **Congratulations on completing this course!**` });

    // Create quiz for course 1
    await Quiz.create({
      sectionId: quizSection1._id,
      courseId: course1._id,
      title: 'Silk Weaving Fundamentals Quiz',
      passingScore: 70,
      timeLimit: 10,
      questions: [
        { question: 'Where did silk production originate?', options: ['India', 'China', 'Japan', 'Egypt'], correctAnswer: 1, explanation: 'Silk production originated in ancient China around 3500 BCE.' },
        { question: 'Which type of silk is exclusive to Assam, India?', options: ['Mulberry Silk', 'Tussar Silk', 'Muga Silk', 'Eri Silk'], correctAnswer: 2, explanation: 'Muga silk is exclusively produced in Assam and is known for its natural golden sheen.' },
        { question: 'What does the peacock motif symbolize in Indian textiles?', options: ['Strength', 'Beauty and grace', 'Wisdom', 'Prosperity'], correctAnswer: 1, explanation: 'The peacock motif symbolizes beauty, grace, and pride in Indian textile traditions.' },
        { question: 'What is the warp in weaving?', options: ['Horizontal threads', 'Vertical lengthwise threads', 'The finished edge', 'The shuttle'], correctAnswer: 1, explanation: 'Warp threads run vertically/lengthwise on the loom and are held under tension.' },
        { question: 'What is the traditional red dye source in Indian textiles?', options: ['Turmeric', 'Indigo', 'Madder root', 'Saffron'], correctAnswer: 2, explanation: 'Madder root (Manjistha) and lac have been traditional sources of red dye in Indian textiles.' },
      ],
    });

    // ===================== COURSE 2: Fabric Care & Maintenance =====================
    const course2 = await Course.create({
      title: 'Silk Saree Care & Maintenance',
      description: 'Learn how to properly care for, store, and maintain your precious silk sarees to preserve their beauty for generations.',
      thumbnail: 'https://images.unsplash.com/photo-1771654099745-73a4a4d09bcd?auto=format&fit=crop&q=80&w=800',
      category: 'Care & Maintenance',
      difficulty: 'beginner',
      estimatedDuration: '3 hours',
      instructor: 'Textile Expert Lakshmi',
      status: 'published',
      tags: ['care', 'maintenance', 'storage', 'cleaning'],
      createdBy: admin._id,
    });

    const m2_1 = await Module.create({ courseId: course2._id, title: 'Daily Care Essentials', description: 'Everyday tips for silk care', order: 0, estimatedDuration: '1 hour' });
    await Section.create({ moduleId: m2_1._id, courseId: course2._id, title: 'Understanding Silk Fabric', order: 0, estimatedTime: 10, content: `# Understanding Silk Fabric\n\nBefore learning care techniques, let's understand what makes silk special and why it requires gentle handling.\n\n## Why Silk Needs Special Care\n\n1. **Protein-based fiber** — similar to human hair\n2. **Sensitive to pH** — alkaline substances damage silk\n3. **Water sensitivity** — can watermark if not handled properly\n4. **UV sensitive** — prolonged sun exposure fades colors\n5. **Delicate when wet** — loses up to 20% strength\n\n## Golden Rules of Silk Care\n\n🔹 Never wring silk — always press gently\n🔹 Avoid direct sunlight for drying\n🔹 Store in breathable cotton covers\n🔹 Keep away from perfumes and deodorants\n🔹 Air out regularly to prevent mustiness` });
    await Section.create({ moduleId: m2_1._id, courseId: course2._id, title: 'Proper Folding Techniques', order: 1, estimatedTime: 10, content: `# Proper Folding Techniques\n\n## The Traditional Method\n\n### Step 1: Prepare a clean surface\nLay a clean cotton cloth on a flat surface.\n\n### Step 2: Fold along the length\nFold the saree lengthwise, keeping the pallu (decorated end) visible.\n\n### Step 3: Roll, don't fold\nFor long-term storage, **rolling is better than folding** as it prevents crease marks.\n\n### Step 4: Wrap in muslin\nWrap the rolled saree in a **clean muslin cloth** — never in plastic.\n\n## Important Tips\n\n⚠️ **Change the fold lines** every 3-6 months to prevent permanent creases\n\n⚠️ **Never use naphthalene balls** — they can damage silk and cause discoloration\n\n✅ Use **dried neem leaves** between sarees as a natural insect repellent\n\n✅ Place **silica gel packets** in the storage area to absorb moisture` });
    await Section.create({ moduleId: m2_1._id, courseId: course2._id, title: 'Cleaning & Washing Guide', order: 2, estimatedTime: 15, content: `# Cleaning & Washing Guide\n\n## Dry Cleaning (Recommended)\n\nFor expensive Kanchipuram and Banarasi sarees, **professional dry cleaning** is safest.\n\n## Hand Washing\n\nFor everyday silk sarees:\n\n### Materials Needed:\n- Lukewarm water (not hot!)\n- Mild shampoo or silk-specific detergent\n- Clean white towel\n- Padded hanger\n\n### Steps:\n1. Fill a basin with lukewarm water\n2. Add a small amount of mild shampoo\n3. Submerge the saree gently\n4. Swirl gently — **never rub or scrub**\n5. Soak for 3-5 minutes only\n6. Rinse with cool water until clear\n7. Add 1 tablespoon of white vinegar in the final rinse (restores sheen)\n8. Press between towels — **never wring**\n9. Dry flat in shade\n\n## Stain Removal\n\n| Stain | Solution |\n|-------|----------|\n| Oil/Grease | Cornstarch + gentle brush |\n| Turmeric | Sunlight (brief exposure) |\n| Sweat | White vinegar solution |\n| Ink | Rubbing alcohol (test first) |\n\n## What to NEVER Do\n\n❌ Machine wash\n❌ Use bleach\n❌ Iron directly on silk\n❌ Use hot water\n❌ Dry in direct sunlight` });

    const m2_2 = await Module.create({ courseId: course2._id, title: 'Storage & Preservation', description: 'Long-term preservation techniques', order: 1, estimatedDuration: '1 hour' });
    await Section.create({ moduleId: m2_2._id, courseId: course2._id, title: 'Ideal Storage Conditions', order: 0, estimatedTime: 10, content: `# Ideal Storage Conditions\n\n## Temperature & Humidity\n\n- **Temperature:** 18-22°C (65-72°F)\n- **Humidity:** 45-55% relative humidity\n- **Air circulation:** Essential — never store in airtight containers\n\n## Storage Materials\n\n### ✅ Use:\n- Clean muslin or cotton cloth wrapping\n- Wooden almirahs (wardrobes) with ventilation\n- Acid-free tissue paper for padding\n- Cedar blocks for natural moth protection\n\n### ❌ Avoid:\n- Plastic bags (trap moisture)\n- Cardboard boxes (acidic)\n- Wire hangers (can damage)\n- Newspaper (ink transfer)\n\n## Organization Tips\n\n1. Store heavy sarees at the bottom\n2. Keep everyday wear accessible\n3. Separate by fabric type\n4. Label storage boxes\n5. Maintain an inventory` });
    await Section.create({ moduleId: m2_2._id, courseId: course2._id, title: 'Seasonal Maintenance', order: 1, estimatedTime: 10, content: `# Seasonal Maintenance\n\n## Monsoon Season (June - September)\n\n⚠️ The most critical period for silk care.\n\n- Use silica gel packets extensively\n- Air out sarees on dry days\n- Check for any signs of fungus\n- Run a dehumidifier if possible\n\n## Summer (March - May)\n\n- Perfect time for annual airing\n- Refold all sarees to change crease lines\n- Check for insect damage\n- Lightly steam to remove wrinkles\n\n## Winter (November - February)\n\n- Ideal storage conditions naturally\n- Good time for dry cleaning\n- Replace neem leaves and cedar blocks\n\n## Annual Ritual\n\nOnce a year, perform the **"Saree Airing Ceremony":**\n\n1. Remove all sarees from storage\n2. Inspect each for damage\n3. Air in a shaded, well-ventilated room\n4. Replace all muslin wrappings\n5. Refold with fresh tissue paper\n6. Update your inventory\n\n> At BS Channabasappa, we recommend treating your silk collection as an investment. Properly cared for, a Kanchipuram saree can last 100+ years!` });

    // ===================== COURSE 3: Business of Textiles =====================
    const course3 = await Course.create({
      title: 'The Business of Indian Textiles',
      description: 'Explore the economics, supply chain, and entrepreneurship opportunities in India\'s textile industry — from weaver cooperatives to global fashion markets.',
      thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
      category: 'Business',
      difficulty: 'intermediate',
      estimatedDuration: '6 hours',
      instructor: 'Prof. Arvind Srinivasan',
      status: 'published',
      tags: ['business', 'economics', 'entrepreneurship', 'supply-chain'],
      createdBy: admin._id,
    });

    const m3_1 = await Module.create({ courseId: course3._id, title: 'Industry Overview', description: 'Understanding the Indian textile landscape', order: 0, estimatedDuration: '1.5 hours' });
    await Section.create({ moduleId: m3_1._id, courseId: course3._id, title: 'India\'s Textile Industry', order: 0, estimatedTime: 15, content: `# India's Textile Industry\n\n## Overview\n\nThe Indian textile industry is one of the **oldest and largest** in the world.\n\n### Key Statistics:\n- **Market Size:** $223 billion (2023)\n- **Employment:** 45 million+ direct, 100 million+ indirect\n- **GDP Contribution:** 2.3% of India's GDP\n- **Export Value:** $44.4 billion annually\n- **Global Rank:** 2nd largest textile exporter\n\n## Industry Segments\n\n### 1. Handloom Sector\n- 4.3 million handlooms in India\n- 35 million weavers and allied workers\n- Rich heritage of 100+ weaving clusters\n\n### 2. Powerloom Sector\n- 2.4 million powerlooms\n- Produces 60% of fabric output\n\n### 3. Mill Sector\n- Organized, large-scale production\n- Mostly cotton and blended fabrics\n\n## Government Initiatives\n\n- **Handloom Mark** — authentication of genuine handloom\n- **GI Tags** — Geographical Indication protection\n- **MUDRA loans** — financing for small weavers\n- **Cluster development** — infrastructure support` });
    await Section.create({ moduleId: m3_1._id, courseId: course3._id, title: 'Supply Chain & Economics', order: 1, estimatedTime: 15, content: `# Supply Chain & Economics\n\n## The Silk Supply Chain\n\n### Raw Material → Finished Product\n\n1. **Sericulture** — Silkworm farming (45 days)\n2. **Reeling** — Extracting silk from cocoons\n3. **Twisting** — Creating thread from raw silk\n4. **Dyeing** — Coloring the threads\n5. **Warping** — Preparing the loom\n6. **Weaving** — Creating the fabric\n7. **Finishing** — Quality checks, pressing\n8. **Retail** — Reaching the customer\n\n## Economics of a Kanchipuram Saree\n\n| Component | % of Cost |\n|-----------|----------|\n| Raw silk | 25-30% |\n| Zari (gold/silver thread) | 30-40% |\n| Weaver labor | 15-20% |\n| Dyeing | 5-8% |\n| Overhead & margins | 10-15% |\n\n## Pricing Factors\n\nA Kanchipuram saree can range from ₹5,000 to ₹5,00,000+ based on:\n- **Thread count** (60, 80, or 120 count)\n- **Zari quality** (tested gold vs imitation)\n- **Design complexity** (plain vs intricate)\n- **Weaving time** (3 days to 3 months)\n- **Brand reputation**` });
    await Section.create({ moduleId: m3_1._id, courseId: course3._id, title: 'Future of Indian Textiles', order: 2, estimatedTime: 15, content: `# Future of Indian Textiles\n\n## Emerging Trends\n\n### 1. Sustainable Fashion\n- Growing demand for organic and natural textiles\n- Carbon-neutral production methods\n- Recycled silk innovations\n\n### 2. Digital Transformation\n- E-commerce growth (30%+ YoY)\n- Virtual try-on technology\n- Blockchain for authenticity verification\n\n### 3. Global Luxury Market\n- Indian handloom gaining recognition in global fashion\n- Collaborations with international designers\n- Premium positioning of heritage textiles\n\n### 4. Technology Integration\n- CAD-assisted design for traditional patterns\n- Digital printing on silk\n- AI-powered quality inspection\n\n## Opportunities\n\n🔹 **Direct-to-consumer** brands\n🔹 **Artisan marketplace** platforms\n🔹 **Textile tourism** — weaving village experiences\n🔹 **Education & certification** — weaving courses\n🔹 **Export-oriented** boutique businesses\n\n## BS Channabasappa's Vision\n\nWe believe the future lies at the intersection of **tradition and technology** — preserving ancient techniques while embracing modern reach.\n\n> "The handloom is not just a machine. It's a storytelling instrument. Our job is to make sure the world hears the story." — BS Channabasappa` });

    console.log(`\n✅ Seed completed successfully!`);
    console.log(`\n📚 Created:`);
    console.log(`   - 2 users (admin + learner)`);
    console.log(`   - 3 courses`);
    console.log(`   - ${await Module.countDocuments()} modules`);
    console.log(`   - ${await Section.countDocuments()} sections`);
    console.log(`   - ${await Quiz.countDocuments()} quizzes`);
    console.log(`\n🔑 Login Credentials:`);
    console.log(`   Admin:  admin@bschannabasappa.com / Admin123!`);
    console.log(`   User:   user@bschannabasappa.com / User123!\n`);

    if (exitOnComplete) {
      await mongoose.connection.close();
      process.exit(0);
    }
  } catch (error) {
    console.error('Seed error:', error);
    if (exitOnComplete) process.exit(1);
  }
}

// Check if file is being run directly
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase(true);
}
