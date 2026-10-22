import { Badge, FactCard, LabDefinition, QuestStep } from '../types';

export const AVATARS = [
  { id: 'fox', name: 'Pip the Space Fox', emoji: '🦊', desc: 'Curious explorer of stars' },
  { id: 'robot', name: 'Curie the Bot', emoji: '🤖', desc: 'Calculator with a huge heart' },
  { id: 'cat', name: 'Luna the Astro-Cat', emoji: '🐱', desc: 'Defier of planetary gravity' },
  { id: 'penguin', name: 'Penny the Polar Rocket', emoji: '🐧', desc: 'Aerodynamic rocket builder' },
  { id: 'dino', name: 'Rex the Quantum Dino', emoji: '🦖', desc: 'Ancient math genius' },
  { id: 'panda', name: 'Bao the Zen Balancer', emoji: '🐼', desc: 'Master of seesaws and angles' },
];

export const BADGES: Badge[] = [
  {
    id: 'badge_gravity',
    name: 'Cosmic Aviator',
    description: 'Launched a rocket across 3 different worlds!',
    icon: '🚀',
    color: 'from-amber-400 to-orange-500',
    requirement: 'Launch rockets in Earth, Moon, and Mars gravity'
  },
  {
    id: 'badge_balance',
    name: 'Balance Master',
    description: 'Solved the seesaw balance riddle using torque!',
    icon: '⚖️',
    color: 'from-blue-400 to-cyan-500',
    requirement: 'Balance weights on unequal lever arms'
  },
  {
    id: 'badge_optics',
    name: 'Rainbow Bender',
    description: 'Split white light into a 7-color rainbow spectrum!',
    icon: '🌈',
    color: 'from-purple-400 to-pink-500',
    requirement: 'Refract light with a triangular glass prism'
  },
  {
    id: 'badge_coaster',
    name: 'Energy Dynamo',
    description: 'Demonstrated kinetic and potential energy conservation!',
    icon: '🎢',
    color: 'from-emerald-400 to-teal-500',
    requirement: 'Build a rollercoaster that loops without losing energy'
  },
  {
    id: 'badge_circuits',
    name: 'Spark Wizard',
    description: 'Completed an electric circuit and powered up the bulb!',
    icon: '⚡',
    color: 'from-yellow-400 to-amber-500',
    requirement: 'Connect battery, switch, and bulb with live electrons'
  },
  {
    id: 'badge_fractions',
    name: 'Master Chef of Fractions',
    description: 'Fed hungry cosmic monsters exact pizza fractions!',
    icon: '🍕',
    color: 'from-rose-400 to-red-500',
    requirement: 'Match equivalent fractions and assemble whole pies'
  },
  {
    id: 'badge_geometry',
    name: 'Shape Alchemist',
    description: 'Transformed polygons and uncovered symmetry secret!',
    icon: '💎',
    color: 'from-indigo-400 to-violet-500',
    requirement: 'Explore 2D sides, angles, and 3D shapes'
  },
  {
    id: 'badge_cannon',
    name: 'Grid Marksman',
    description: 'Hit target comets with coordinates (X, Y) precision!',
    icon: '🎯',
    color: 'from-cyan-400 to-blue-600',
    requirement: 'Target coordinates and angle trajectories'
  },
  {
    id: 'badge_arcade',
    name: 'Speed Math Ace',
    description: 'Achieved a 10-answer streak in the Speed Math Arcade!',
    icon: '⭐',
    color: 'from-amber-300 to-yellow-500',
    requirement: 'Score 100+ points in rapid mental math'
  },
  {
    id: 'badge_quest',
    name: 'Galactic Graduate',
    description: 'Completed all stages of the Cosmo Quest Adventure!',
    icon: '🏆',
    color: 'from-yellow-400 to-rose-500',
    requirement: 'Solve 10 story challenges across Math & Physics'
  }
];

export const LABS: LabDefinition[] = [
  {
    id: 'gravity',
    title: 'Gravity & Rocket World',
    subtitle: 'Newton’s Ballistics & Planetary Gravity',
    category: 'physics',
    ageGroup: ['junior', 'cadet', 'master'],
    icon: '🚀',
    accentColor: '#f97316',
    cardGradient: 'from-orange-500/20 via-amber-500/10 to-transparent',
    summary: 'Adjust thrust, mass, and launch angles across Earth, the Moon, Mars, and Jupiter! Watch trajectories curve and land on the moonpad.',
    learningGoals: ['Gravity pulls everything down', 'Heavier worlds have stronger gravity', 'Angle affects rocket distance'],
    badgeReward: 'badge_gravity'
  },
  {
    id: 'seesaw',
    title: 'Seesaw & Torque Balance',
    subtitle: 'Levers, Moments & Equilibrium',
    category: 'physics',
    ageGroup: ['junior', 'cadet', 'master'],
    icon: '⚖️',
    accentColor: '#38bdf8',
    cardGradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    summary: 'Discover how a small mouse can lift a giant elephant! Move weights along distance notches and watch torque balance in real time.',
    learningGoals: ['Torque = Weight × Distance', 'Moving further from the pivot gives more leverage', 'Equal torques balance the seesaw'],
    badgeReward: 'badge_balance'
  },
  {
    id: 'optics',
    title: 'Rainbow Prism & Optics Lab',
    subtitle: 'Refraction, Reflection & Light Waves',
    category: 'physics',
    ageGroup: ['junior', 'cadet', 'master'],
    icon: '🌈',
    accentColor: '#c084fc',
    cardGradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
    summary: 'Aim laser beams, rotate mirrors, and pass white light through glass prisms to bend rays and create glowing rainbow spectrums.',
    learningGoals: ['Light travels in straight lines until it hits something', 'Mirrors bounce light (Angle in = Angle out)', 'Prisms bend colors differently to make rainbows'],
    badgeReward: 'badge_optics'
  },
  {
    id: 'coaster',
    title: 'Energy Coaster Playground',
    subtitle: 'Kinetic & Potential Energy Conservation',
    category: 'physics',
    ageGroup: ['cadet', 'master'],
    icon: '🎢',
    accentColor: '#34d399',
    cardGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    summary: 'Design your own rollercoaster! Watch live energy bars trade between Potential (height) and Kinetic (speed) energy as the cart zooms.',
    learningGoals: ['Higher points have more Potential Energy', 'Speed creates Kinetic Energy', 'Total Energy is always conserved!'],
    badgeReward: 'badge_coaster'
  },
  {
    id: 'circuit',
    title: 'Electric Spark Sandbox',
    subtitle: 'Circuits, Current & Voltage',
    category: 'physics',
    ageGroup: ['junior', 'cadet', 'master'],
    icon: '⚡',
    accentColor: '#fbbf24',
    cardGradient: 'from-yellow-500/20 via-amber-500/10 to-transparent',
    summary: 'Snap together batteries, switches, lightbulbs, buzzers, and fans. Watch animated electrons race through the closed loop!',
    learningGoals: ['Electricity needs a closed loop to flow', 'Switches open or close the circuit', 'More batteries make bulbs shine brighter'],
    badgeReward: 'badge_circuits'
  },
  {
    id: 'fractions',
    title: 'Pizza & Cake Fraction Bakery',
    subtitle: 'Halves, Thirds, Quarters & Equivalence',
    category: 'math',
    ageGroup: ['junior', 'cadet'],
    icon: '🍕',
    accentColor: '#fb7185',
    cardGradient: 'from-rose-500/20 via-red-500/10 to-transparent',
    summary: 'Slice delicious pizzas and cupcakes into equal parts! Feed friendly cosmic aliens and discover why 2/4 is the exact same as 1/2.',
    learningGoals: ['Fractions represent parts of a whole', 'Numerator is slices you have, Denominator is total slices', 'Different fractions can have the same value (equivalence)'],
    badgeReward: 'badge_fractions'
  },
  {
    id: 'geometry',
    title: 'Shape Morphing Transformer',
    subtitle: '2D Polygons, 3D Solids & Symmetry',
    category: 'math',
    ageGroup: ['junior', 'cadet', 'master'],
    icon: '💎',
    accentColor: '#818cf8',
    cardGradient: 'from-indigo-500/20 via-blue-500/10 to-transparent',
    summary: 'Slide to add sides: watch a triangle turn into a square, octagon, and circle! Calculate perimeter, area, and unfold 3D geometric nets.',
    learningGoals: ['Polygons are named by their number of sides', 'Perimeter is the border, Area is the inside space', 'Symmetry creates mirrored reflections'],
    badgeReward: 'badge_geometry'
  },
  {
    id: 'cannon',
    title: 'Cosmo Coordinate Cannon',
    subtitle: 'Cartesian Grid (X, Y) & Angles',
    category: 'math',
    ageGroup: ['cadet', 'master'],
    icon: '🎯',
    accentColor: '#22d3ee',
    cardGradient: 'from-cyan-500/20 via-teal-500/10 to-transparent',
    summary: 'Enter X (horizontal) and Y (vertical) coordinates or angle degrees to launch starry orbs and collect space crystals!',
    learningGoals: ['X goes left and right, Y goes up and down', 'Coordinates pinpoint exact locations in 2D space', 'Angles measure turn in degrees (0° to 90°)'],
    badgeReward: 'badge_cannon'
  },
  {
    id: 'arcade',
    title: 'Speed Math Arcade',
    subtitle: 'Quick Arithmetic, Combos & High Scores',
    category: 'math',
    ageGroup: ['junior', 'cadet', 'master'],
    icon: '⭐',
    accentColor: '#eab308',
    cardGradient: 'from-yellow-500/20 via-orange-500/10 to-transparent',
    summary: 'Blast through addition, subtraction, multiplication, and number patterns before the timer runs out! Build combo multipliers.',
    learningGoals: ['Rapid mental calculation', 'Recognizing number patterns and multiples', 'Focus, speed, and confidence with numbers'],
    badgeReward: 'badge_arcade'
  }
];

export const FACT_CARDS: FactCard[] = [
  {
    id: 'f1',
    title: 'Why Do We Not Float Away?',
    category: 'physics',
    question: 'What keeps our feet on the ground?',
    emoji: '🌍',
    shortAnswer: 'Earth’s giant gravity is pulling us toward its center like a giant cosmic magnet!',
    funFact: 'If you were standing on Jupiter, you would feel more than twice as heavy as you do on Earth!',
    interactiveTip: 'Try the Gravity World lab and launch a rocket on the Moon vs Jupiter!',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'f2',
    title: 'What is a Fraction in Real Life?',
    category: 'math',
    question: 'Why do we need numbers with lines in the middle?',
    emoji: '🍰',
    shortAnswer: 'Fractions are fair-sharing numbers! When you cut a cake into 4 equal slices and eat 1, you ate 1/4.',
    funFact: 'Ancient Egyptians only liked fractions with a 1 on top (like 1/2, 1/3, 1/4)!',
    interactiveTip: 'Head to the Fraction Bakery and slice a pizza into 8 slices.',
    color: 'from-rose-500 to-pink-600'
  },
  {
    id: 'f3',
    title: 'Where Do Rainbows Come From?',
    category: 'physics',
    question: 'How does clear sunlight turn into 7 glowing colors?',
    emoji: '🌈',
    shortAnswer: 'White light is actually a team of Red, Orange, Yellow, Green, Blue, Indigo, and Violet hiding together. Raindrops act like tiny glass prisms that slow down and bend each color at a slightly different angle!',
    funFact: 'Red light bends the least, while Violet light bends the most!',
    interactiveTip: 'In the Optics Lab, shine the white laser through the glass prism.',
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 'f4',
    title: 'Why is Zero Such a Super Number?',
    category: 'math',
    question: 'Is zero nothing, or something?',
    emoji: '0️⃣',
    shortAnswer: 'Zero is both the number for "none" and a magical placeholder! It turns 1 into 10, 100, and 1,000,000!',
    funFact: 'Zero was invented in ancient India by mathematician Brahmagupta around 628 CE.',
    interactiveTip: 'Practice multiplying by 10 and 100 in the Speed Math Arcade!',
    color: 'from-amber-500 to-yellow-600'
  },
  {
    id: 'f5',
    title: 'How Does a Seesaw Lift Heavy Things?',
    category: 'physics',
    question: 'Can a kid lift their parent on a seesaw?',
    emoji: '🤹',
    shortAnswer: 'YES! If the adult sits very close to the center pivot, and you sit all the way at the edge, your lever arm gives you super torque!',
    funFact: 'Archimedes once said: "Give me a lever long enough and a fulcrum on which to place it, and I shall move the world!"',
    interactiveTip: 'Test this in the Seesaw Lab by placing a heavy weight close to center.',
    color: 'from-teal-500 to-emerald-600'
  },
  {
    id: 'f6',
    title: 'Why Are Soap Bubbles Always Spheres?',
    category: 'math',
    question: 'Why aren’t bubbles cube-shaped?',
    emoji: '🫧',
    shortAnswer: 'Nature loves efficiency! A sphere holds the biggest amount of air inside the smallest possible surface area of soapy water.',
    funFact: 'Bees make hexagons for their honeycombs for the exact same reason—it uses the least wax to store the most honey!',
    interactiveTip: 'Check out the Shape Morphing Transformer to see shapes with more sides.',
    color: 'from-cyan-500 to-blue-600'
  }
];

export const QUEST_STEPS: QuestStep[] = [
  {
    id: 1,
    title: 'Mission 1: The Heavy Cargo Dilemma',
    story: 'Pip the Space Fox needs to lift a 60 kg crate into the spaceship hold, but only has a 20 kg counterweight and a long steel bar.',
    category: 'physics',
    question: 'Where should Pip place the pivot (fulcrum) to lift the heavy 60 kg crate easily?',
    options: [
      { label: 'Right in the exact middle', isCorrect: false, hint: 'If it’s in the middle, 20 kg cannot lift 60 kg!' },
      { label: 'Closer to the heavy 60 kg crate', isCorrect: true, hint: 'Yes! Making the heavy side shorter gives the light side a long lever arm!' },
      { label: 'Closer to the light 20 kg weight', isCorrect: false, hint: 'That would give the heavy crate more leverage instead!' }
    ],
    explanation: 'Torque = Weight × Distance. By placing the pivot close to the heavy crate, the light weight sits far away and gains 3× more turning force!',
    mascotReaction: '🦊 "Woohoo! The crate lifted like a feather thanks to lever physics!"',
    xpReward: 35
  },
  {
    id: 2,
    title: 'Mission 2: Fuel Fraction Calculation',
    story: 'The spaceship fuel tank has 4 equal compartments. Currently, 3 of them are filled with stardust fuel.',
    category: 'math',
    question: 'What fraction of the fuel tank is filled?',
    options: [
      { label: '1/4', isCorrect: false, hint: 'That is how much is empty!' },
      { label: '3/4', isCorrect: true, hint: '3 parts filled out of 4 total parts = 3/4!' },
      { label: '4/3', isCorrect: false, hint: 'The total parts goes in the denominator (bottom)!' }
    ],
    explanation: 'A fraction has a numerator (parts filled = 3) over a denominator (total parts = 4), making 3/4.',
    mascotReaction: '🤖 "Bleep bloop! Calculation confirmed! We have 75% fuel ready!"',
    xpReward: 35
  },
  {
    id: 3,
    title: 'Mission 3: Moon Jump Wonder',
    story: 'On Earth, astronaut Penny can jump 1 meter high. Gravity on the Moon is only about 1/6th as strong as on Earth.',
    category: 'physics',
    question: 'How high will Penny be able to jump on the Moon with the same jump strength?',
    options: [
      { label: 'About 1 meter (the same)', isCorrect: false, hint: 'Moon gravity is much weaker, so gravity doesn’t pull down as hard!' },
      { label: 'About 6 meters high!', isCorrect: true, hint: 'Spot on! With 1/6th the pull, you soar 6 times higher!' },
      { label: 'Only 1/6th of a meter (less)', isCorrect: false, hint: 'Weaker gravity means jumping higher, not lower!' }
    ],
    explanation: 'Because the Moon has less mass, its downward gravitational pull is weaker. Less downward acceleration means you stay in the air much longer and reach 6× the altitude!',
    mascotReaction: '🐧 "I can almost touch the stars with this lunar bounce!"',
    xpReward: 40
  },
  {
    id: 4,
    title: 'Mission 4: Geometry Navigation Beacon',
    story: 'The navigation computer displays a polygon with 6 equal sides and 6 angles. It asks for the shape’s secret name to open the warp gate.',
    category: 'math',
    question: 'What is a polygon with 6 sides called?',
    options: [
      { label: 'Pentagon', isCorrect: false, hint: 'A pentagon has 5 sides (like a house).' },
      { label: 'Hexagon', isCorrect: true, hint: 'Hexa means 6 in Greek, like honeycomb cells!' },
      { label: 'Octagon', isCorrect: false, hint: 'An octagon has 8 sides, like a stop sign.' }
    ],
    explanation: 'A polygon with 6 sides and 6 vertices is a Hexagon. Nature uses hexagons in beehives and snowflakes because they pack together perfectly!',
    mascotReaction: '🐱 "Meow! Hexagon gate opened! The stars align!"',
    xpReward: 35
  },
  {
    id: 5,
    title: 'Mission 5: Laser Mirror Target',
    story: 'A cosmic signal beam is coming in at a 45-degree angle toward a flat silver mirror.',
    category: 'physics',
    question: 'At what angle will the laser beam bounce off the mirror?',
    options: [
      { label: '90 degrees (straight up)', isCorrect: false, hint: 'Light bounces symmetrically.' },
      { label: '45 degrees', isCorrect: true, hint: 'Law of reflection: Angle of incidence = Angle of reflection!' },
      { label: '0 degrees (it stops)', isCorrect: false, hint: 'Mirrors reflect light, they don’t absorb it!' }
    ],
    explanation: 'The Law of Reflection states that the Angle of Incidence always equals the Angle of Reflection! Whatever angle the light hits the mirror, it bounces away at that identical angle.',
    mascotReaction: '🦊 "Direct hit on the relay dish! Signal transmitted!"',
    xpReward: 40
  },
  {
    id: 6,
    title: 'Mission 6: Pizza Party Monster Share',
    story: 'Two baby space aliens want to share 8 mini-pizzas equally. Then 2 more friends arrive, making 4 aliens total.',
    category: 'math',
    question: 'If 4 aliens share 8 pizzas equally, how many pizzas does each alien get?',
    options: [
      { label: '1 pizza each', isCorrect: false, hint: '8 divided by 4 is more than 1.' },
      { label: '2 pizzas each', isCorrect: true, hint: '8 ÷ 4 = 2! Everyone gets 2 whole pizzas!' },
      { label: '4 pizzas each', isCorrect: false, hint: '4 × 4 would be 16 pizzas!' }
    ],
    explanation: 'Division is splitting into equal groups: 8 pizzas ÷ 4 hungry aliens = 2 pizzas each.',
    mascotReaction: '🦖 "Yum yum! Nom nom! Even math tastes delicious with pizza!"',
    xpReward: 35
  },
  {
    id: 7,
    title: 'Mission 7: The Coaster Energy Conservation',
    story: 'A coaster car is sitting completely still at the very top of a 100-meter peak before dropping.',
    category: 'physics',
    question: 'What kind of energy does the car have at the very top of the hill?',
    options: [
      { label: 'Maximum Kinetic Energy (motion)', isCorrect: false, hint: 'It’s not moving yet, so kinetic energy is 0!' },
      { label: 'Maximum Potential Energy (stored height)', isCorrect: true, hint: 'Yes! Its height gives it maximum stored gravitational potential energy!' },
      { label: 'Zero total energy', isCorrect: false, hint: 'It has lots of stored energy waiting to be unleashed!' }
    ],
    explanation: 'At the top of the hill, all the energy is stored as Gravitational Potential Energy. As it zooms downward, that stored energy transforms into Kinetic Energy (speed)!',
    mascotReaction: '🐼 "Hold on to your hats! Down we goooo!"',
    xpReward: 45
  },
  {
    id: 8,
    title: 'Mission 8: Coordinate Planet Finder',
    story: 'Alien signals are detected at coordinate X = 3, Y = 5 on the radar grid.',
    category: 'math',
    question: 'How do you navigate to (3, 5) from the starting center (0, 0)?',
    options: [
      { label: 'Move 3 steps RIGHT, then 5 steps UP', isCorrect: true, hint: 'X is horizontal (right/left) and Y is vertical (up/down)!' },
      { label: 'Move 5 steps RIGHT, then 3 steps UP', isCorrect: false, hint: 'Remember: X comes first in the alphabet and in coordinates!' },
      { label: 'Move 3 steps DOWN, then 5 steps LEFT', isCorrect: false, hint: 'Positive numbers go Right and Up!' }
    ],
    explanation: 'Coordinates are written (X, Y). Walk along the hall (X = 3 right) before taking the elevator (Y = 5 up)!',
    mascotReaction: '🤖 "Target locked at (3, 5)! Scanning alien artifact now!"',
    xpReward: 40
  },
  {
    id: 9,
    title: 'Mission 9: The Circuit Dark Maze',
    story: 'The spaceship emergency lights won’t turn on. You find a circuit with a battery, lightbulb, and a wire with a broken gap.',
    category: 'physics',
    question: 'What do you need to do so the electric current can light up the bulb?',
    options: [
      { label: 'Cut another wire to let air in', isCorrect: false, hint: 'Cutting another wire makes another gap!' },
      { label: 'Close the gap with a conductive wire or metal switch', isCorrect: true, hint: 'Electricity requires an unbroken closed loop to flow!' },
      { label: 'Take out the battery', isCorrect: false, hint: 'Batteries are the energy source that pushes the electrons!' }
    ],
    explanation: 'An electric circuit must be a complete unbroken loop (closed circuit) for electrons to travel from the negative terminal of the battery through the bulb to the positive terminal.',
    mascotReaction: '⚡ "Click! The lightbulb shines brightly! The corridor is saved!"',
    xpReward: 45
  },
  {
    id: 10,
    title: 'Mission 10: The Grand Master Puzzle',
    story: 'To activate the Cosmic Warp Drive, you must solve this: If you have 3 boxes, and each box has 4 batteries, and each battery gives 2 volts of power, how much total voltage do you have?',
    category: 'math',
    question: 'Calculate: 3 boxes × 4 batteries per box × 2 volts each = ?',
    options: [
      { label: '14 Volts', isCorrect: false, hint: 'Check your multiplication: 3 × 4 = 12, then 12 × 2 = ?' },
      { label: '24 Volts', isCorrect: true, hint: '3 × 4 = 12 batteries, 12 × 2 = 24 Volts!' },
      { label: '20 Volts', isCorrect: false, hint: 'Try multiplying 12 by 2.' }
    ],
    explanation: '3 × 4 = 12 total batteries. 12 × 2 volts = 24 total volts. Combining multiplication steps powers up the ship!',
    mascotReaction: '🎉 "WARP DRIVE ONLINE! You are officially a Grand Master of Math & Physics!"',
    xpReward: 60
  }
];
