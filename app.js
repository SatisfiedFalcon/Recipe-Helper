/* ═══════════════════════════════════════════════
   RECIPE HELPER — app.js
   Auth · Recommendations · Preferences · Data
   ═══════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════
   FIREBASE CONFIG
   → Replace with your own config from
     console.firebase.google.com
     (free — Auth only, no database needed)
══════════════════════════════════ */
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCG6zZ8pzDQekuSO-faavddVDtHqaFjwk0",
  authDomain:        "savor-95070.firebaseapp.com",
  projectId:         "savor-95070",
  storageBucket:     "savor-95070.firebasestorage.app",
  messagingSenderId: "406193437105",
  appId:             "1:406193437105:web:777d4c07c794febf8d2590",
  measurementId:     "G-Z0SJNVWD3W"
};

/* ══════════════════════════════════
   DATA — CUISINES
══════════════════════════════════ */
const CUISINES = {
  Italian:       { flag:'🇮🇹', origin:'Italy',                   background:'Italian cuisine traces its roots to ancient Rome and evolved through centuries of regional traditions. Each region — from Tuscany to Sicily — has distinct flavours and techniques.',                                                          img:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80' },
  Asian:         { flag:'🍜', origin:'East & Southeast Asia',     background:'Asian cuisine spans thousands of years across China, Japan, Korea, Thailand, Vietnam and beyond — united by bold umami flavours, fresh herbs, and wok-fire technique.',                                                                       img:'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80' },
  American:      { flag:'🇺🇸', origin:'United States',            background:'American comfort food is a melting pot of immigrant traditions — from Southern soul food to New York deli culture — bold, hearty, and always satisfying.',                                                                                   img:'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80' },
  French:        { flag:'🇫🇷', origin:'France',                   background:'French cuisine is the cornerstone of Western cooking. Built on classical technique — mother sauces, proper knife skills, and precise timing — it elevates simple ingredients into art.',                                                     img:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80' },
  Mediterranean: { flag:'🫒', origin:'Mediterranean Basin',       background:'Mediterranean cooking — spanning Greece, Lebanon, Morocco and Spain — is defined by olive oil, legumes, fresh vegetables, and herbs. One of the world\'s healthiest diets.',                                                                img:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80' },
  Mexican:       { flag:'🇲🇽', origin:'Mexico',                   background:'Mexican cuisine is a UNESCO Intangible Cultural Heritage. Rooted in Aztec and Mayan traditions, it blends chilli, corn, beans and chocolate into complex, layered flavours.',                                                              img:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80' },
  Indian:        { flag:'🇮🇳', origin:'India',                    background:'Indian cuisine is one of the most diverse in the world — over 30 distinct regional styles united by a mastery of spice blending that dates back over 5,000 years.',                                                                         img:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80' },
};

/* ══════════════════════════════════
   DATA — MEALS
   ⚡ CHIEF AGENT APPENDS HERE
   Keep this array clean — Chief adds
   new objects automatically at the end.
══════════════════════════════════ */
const MEALS = [
  {
    id:1, name:'Spaghetti Aglio e Olio', cuisine:'Italian', time:'15 min', diff:'beginner', cost:'$2',
    emoji:'🍝', trending:true, featured:true,
    tags:['quick','budget','beginner'],
    img:'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=700&q=80',
    description:'A midnight classic from Naples. Just five pantry ingredients — spaghetti, garlic, olive oil, chilli and parsley — transform into something magical. The secret is golden (never burnt) garlic and starchy pasta water.',
    ingredients:['200g spaghetti','4 garlic cloves, thinly sliced','4 tbsp extra-virgin olive oil','½ tsp red chilli flakes','Large handful fresh parsley, chopped','Salt (for pasta water)','Parmesan to serve (optional)'],
    steps:['Bring a large pot of water to a boil. Season generously with salt — it should taste like the sea.','Cook spaghetti until al dente (1–2 min less than the packet says). Reserve 1 cup pasta water before draining.','While pasta cooks, heat olive oil in a wide pan over medium-low heat. Add sliced garlic.','Cook garlic slowly, 3–4 min, stirring, until golden. Add chilli flakes and cook 30 seconds more. Never let garlic go brown or it turns bitter.','Add drained pasta to the pan. Pour in ½ cup pasta water. Toss vigorously over medium heat until the water emulsifies with the oil creating a silky sauce.','Add parsley, toss again. Serve immediately with extra chilli and parmesan if desired.'],
    noOven:'This recipe uses only a stovetop — no oven involved at all.',
    noStove:'Microwave pasta: place in microwave-safe dish, cover with water, microwave 12 min stirring halfway. Warm oil and garlic in microwave 40 seconds. Combine.',
    subs:['No olive oil → any vegetable or sunflower oil','No fresh parsley → dried parsley or fresh basil','No chilli flakes → ¼ tsp black pepper','No parmesan → nutritional yeast for a vegan option'],
    reviews:[{name:'Sarah M',stars:5,text:'Made this at midnight with pantry staples — incredible!'},{name:'Jake T',stars:4,text:'Added a squeeze of lemon at the end. Game changer.'}],
  },
  {
    id:2, name:'Egg Fried Rice', cuisine:'Asian', time:'12 min', diff:'beginner', cost:'$2',
    emoji:'🍚', trending:true, featured:false,
    tags:['quick','budget','beginner'],
    img:'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=700&q=80',
    description:'The ultimate use-up-everything dish, born in Chinese home kitchens. Day-old rice is the secret — fresh rice is too wet and turns mushy. This version is faster than takeout and three times better.',
    ingredients:['2 cups cooked rice (day-old preferred)','2 eggs','2 tbsp soy sauce','1 tbsp sesame oil','2 garlic cloves, minced','3 spring onions, sliced','1 tbsp vegetable oil','Pinch of white pepper'],
    steps:['Heat a wok or large non-stick pan over HIGH heat until smoking. Add oil and swirl.','Add garlic — stir-fry 20 seconds until fragrant.','Push garlic aside. Crack in eggs. Scramble quickly with spatula until just set.','Add rice. Break up all clumps with the spatula and mix with the eggs.','Pour soy sauce around the edge of the pan (not directly on rice). Add white pepper.','Toss everything together vigorously for 2–3 min until rice is coated and has some char.','Drizzle sesame oil. Add spring onions. Serve immediately.'],
    noOven:'This is a wok/pan stovetop recipe. No oven needed.',
    noStove:'Scramble eggs in a mug in the microwave (1 min, stir halfway). Mix cold rice with soy sauce, add eggs. Microwave 2 min, stir once. Drizzle sesame oil.',
    subs:['No soy sauce → salt or fish sauce','No sesame oil → skip or a drop of any oil','No spring onion → chives or any fresh herb','Great additions → frozen peas, corn, diced carrot (add before eggs)'],
    reviews:[{name:'Mei L',stars:5,text:'Better than my local takeaway and ready in 12 minutes!'},{name:'James P',stars:4,text:'Perfect way to use leftover rice. I add frozen peas too.'}],
  },
  {
    id:3, name:'Classic Grilled Cheese', cuisine:'American', time:'10 min', diff:'beginner', cost:'$1.50',
    emoji:'🧀', trending:false, featured:false,
    tags:['quick','budget','beginner'],
    img:'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700&q=80',
    description:'The sandwich that has comforted Americans for a century. Seems simple, but there is real technique here — the right bread-to-cheese ratio, butter temperature, and patience make all the difference.',
    ingredients:['2 thick slices white or sourdough bread','2–3 slices cheddar (or any good melting cheese)','1 tbsp softened butter','Pinch of garlic powder (optional)'],
    steps:['Spread softened butter evenly on one side of each bread slice. Add garlic powder to butter if using.','Place one slice butter-side DOWN in a cold non-stick pan.','Add cheese slices, covering the bread completely.','Top with the second slice, butter-side UP.','Turn heat to medium-low. Cook 3–4 min until the bottom is deep golden.','Flip carefully. Cook other side 2–3 min until golden and cheese is fully melted.','Press gently with spatula, cut diagonally, serve immediately.'],
    noOven:'Purely stovetop — that is what makes it a grilled cheese.',
    noStove:'Use a sandwich press or panini maker. Cook on medium heat 3–4 min total.',
    subs:['No cheddar → any melting cheese: mozzarella, gouda, Swiss, American','No butter → mayonnaise on the outside (creates incredible crust)','Upgrade → add sliced tomato or crispy bacon inside'],
    reviews:[{name:'Comfort K',stars:5,text:'The mayo trick is absolutely real. Changed my life.'},{name:'Midnight S',stars:5,text:'My kids ask for this every single day.'}],
  },
  {
    id:4, name:'Shakshuka', cuisine:'Mediterranean', time:'25 min', diff:'beginner', cost:'$3',
    emoji:'🍳', trending:true, featured:true,
    tags:['budget','beginner'],
    img:'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=700&q=80',
    description:'North African in origin, now beloved from Tel Aviv to London. Eggs poached directly in a spiced tomato sauce — one pan, all drama. The name means "all mixed up" in Arabic.',
    ingredients:['6 eggs','2 cans (800g) chopped tomatoes','1 large onion, diced','4 garlic cloves, minced','1 red pepper, diced','2 tsp cumin','1 tsp paprika','½ tsp chilli flakes','Salt, olive oil','Fresh parsley to serve','Crusty bread or pita to serve'],
    steps:['Heat 2 tbsp olive oil in a wide, deep pan over medium heat. Cook onion and pepper 8 min until soft.','Add garlic and all spices. Stir 1 minute until fragrant.','Pour in tomatoes. Season well with salt. Simmer 10 min, stirring occasionally, until thickened.','Make 6 wells in the sauce with a spoon. Crack one egg into each well.','Cover the pan. Cook on medium-low 5–7 min — whites set, yolks still runny.','Scatter parsley. Serve straight from the pan with plenty of bread for scooping.'],
    noOven:'This is entirely stovetop.',
    noStove:'Not ideal for microwave. Can be made in a slow cooker: cook sauce on HIGH 2 hours, add eggs last 20 min.',
    subs:['No canned tomatoes → 6 large fresh tomatoes, roughly chopped','No red pepper → courgette or aubergine','Make it richer → add 2 tbsp of harissa paste','Add feta → crumble over before serving'],
    reviews:[{name:'Brunch B',stars:5,text:'This is my go-to for lazy Sunday brunch. Never fails.'},{name:'Spice L',stars:5,text:'Added harissa — absolutely worth it.'}],
  },
  {
    id:5, name:'Guacamole', cuisine:'Mexican', time:'8 min', diff:'beginner', cost:'$3',
    emoji:'🥑', trending:false, featured:false,
    tags:['quick','budget','beginner'],
    img:'https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=700&q=80',
    description:'The Aztecs made this over 500 years ago using a stone molcajete. Proper guac is chunky, not smooth — mashed, not blended — and it must be made right before eating.',
    ingredients:['3 ripe avocados','1 lime, juiced','½ red onion, finely diced','2 garlic cloves, minced','1 small tomato, diced','Small handful fresh coriander, chopped','½ jalapeño, minced (optional)','Salt & pepper'],
    steps:['Halve avocados, remove stones. Scoop flesh into a bowl.','Add lime juice immediately to prevent browning.','Mash with a fork to your preferred texture — leave some chunks.','Add garlic, onion, tomato, coriander, and jalapeño if using.','Season well with salt and pepper. Taste — it should be bright and zesty.','Serve immediately with tortilla chips. Press clingfilm directly onto surface if storing.'],
    noOven:'No cooking required at all.',
    noStove:'No cooking required at all.',
    subs:['No coriander → flat-leaf parsley or simply omit','No jalapeño → pinch of cayenne','No lime → lemon juice','Keep it from browning → press clingfilm directly onto the surface or leave the stone in'],
    reviews:[{name:'Avocado A',stars:5,text:'The lime is non-negotiable. Perfect every time.'},{name:'Taco N',stars:4,text:'I add a tiny pinch of cumin. Takes it to the next level.'}],
  },
  {
    id:6, name:'Red Lentil Soup', cuisine:'Mediterranean', time:'35 min', diff:'beginner', cost:'$2',
    emoji:'🥣', trending:false, featured:false,
    tags:['budget','beginner'],
    img:'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=700&q=80',
    description:'The most comforting bowl on earth. Red lentils dissolve beautifully without soaking, creating a thick, silky soup in under 40 minutes. Popular from Turkey to Morocco, each version has its own spice signature.',
    ingredients:['250g red lentils, rinsed','1 large onion, diced','3 garlic cloves','2 carrots, diced','1 litre vegetable stock','1 tsp cumin','1 tsp turmeric','½ tsp paprika','Juice of ½ lemon','Salt, olive oil','Fresh parsley to serve'],
    steps:['Heat 2 tbsp olive oil in a large pot. Cook onion and carrot over medium heat 7 min until soft.','Add garlic and all spices. Cook 1 minute, stirring.','Add lentils and stock. Bring to a boil, then reduce to a simmer.','Cook 20–25 min until lentils are completely broken down and soup is thick.','Blend partially with a stick blender for a creamy texture, or leave chunky.','Stir in lemon juice. Season generously. Serve with parsley and crusty bread.'],
    noOven:'Purely stovetop.',
    noStove:'Use a slow cooker on HIGH for 3–4 hours or LOW for 6–8 hours.',
    subs:['No vegetable stock → water + 1 tsp soy sauce + a little salt','No fresh tomatoes → canned works perfectly','No lemon → small splash of white vinegar','No parsley → any fresh herb or a drizzle of yoghurt'],
    reviews:[{name:'Meal Prep M',stars:5,text:'I batch this every Sunday. Five portions for almost nothing.'},{name:'Winter W',stars:5,text:'The most comforting thing I know how to make.'}],
  },
  {
    id:7, name:'French Omelette', cuisine:'French', time:'5 min', diff:'intermediate', cost:'$1.50',
    emoji:'🍳', trending:false, featured:false,
    tags:['quick','intermediate'],
    img:'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=700&q=80',
    description:'The French omelette is the test every culinary student must pass — pale, smooth, never browned, folded in three. It is the dish that separates cooks from chefs. Master it and you\'ve mastered heat control.',
    ingredients:['3 large eggs','1 tbsp cold butter, cubed','1 tsp fresh chives or parsley, chopped','Salt & white pepper'],
    steps:['Crack eggs into a bowl. Season with salt and a pinch of white pepper. Beat well with a fork until completely uniform — no streaks.','Heat a 20cm non-stick pan over medium-high heat. Add butter. When it melts and foams but BEFORE it browns, pour in the eggs.','Immediately begin shaking the pan while stirring the eggs with a silicone spatula. Move fast — this takes 60–90 seconds total.','As soon as the eggs are just barely set (still slightly glossy on top), add herbs. Tilt pan to 45 degrees.','Use the spatula to fold the near edge over to the middle. Then tilt the pan over a plate and roll the omelette out, folding as it lands.','The omelette should be pale yellow, smooth, and torpedo-shaped. If it browns, the heat was too high.','Serve within 30 seconds.'],
    noOven:'Stovetop only — the most stovetop recipe there is.',
    noStove:'Whisk eggs in a mug, microwave 30 seconds, stir, microwave 20 more seconds. Not a classic omelette but edible.',
    subs:['No chives → any soft herb, or cheese in the centre','No white pepper → black pepper (slightly different but fine)','Fillings → mushrooms, goat cheese, smoked salmon added before folding'],
    reviews:[{name:'Chef Student',stars:5,text:'Took me 10 attempts to nail it. Completely worth it.'},{name:'Paris D',stars:4,text:'The shaking technique is everything — watch a video first!'}],
  },
  {
    id:8, name:'Black Bean Tacos', cuisine:'Mexican', time:'15 min', diff:'beginner', cost:'$3',
    emoji:'🌮', trending:true, featured:false,
    tags:['quick','budget','beginner'],
    img:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=700&q=80',
    description:'Tacos trace back to the silver mines of 18th century Mexico — miners ate meat and fillings wrapped in corn tortillas. This meatless version is faster, cheaper, and satisfies exactly the same craving.',
    ingredients:['1 can (400g) black beans, drained','8 small corn or flour tortillas','1 tsp cumin','½ tsp smoked paprika','½ tsp garlic powder','Salt & oil','For serving: shredded lettuce, salsa, sour cream, lime, cheese, jalapeños'],
    steps:['Drain and rinse black beans. Heat 1 tbsp oil in a pan over medium heat.','Add beans and season with cumin, paprika, garlic powder, and salt. Stir and cook 3–4 min.','Lightly mash about half the beans with a fork — this creates a better texture in the taco.','Warm tortillas: in a dry pan 30 sec per side, or directly over a gas flame for char marks.','Build tacos: beans first, then lettuce, salsa, sour cream, and a squeeze of lime.','Top with cheese and jalapeños if desired. Eat immediately.'],
    noOven:'Stovetop only.',
    noStove:'Microwave beans 1.5 min in a bowl. Season and mash. Use cold tortillas or warm in toaster.',
    subs:['No black beans → any canned beans','No sour cream → plain Greek yoghurt','No salsa → diced tomato + pinch of salt + lime juice','No corn tortillas → flour tortillas, lettuce wraps, or flatbread'],
    reviews:[{name:'Taco T',stars:5,text:'My Meatless Monday staple. The smoked paprika makes it.'},{name:'Spice L',stars:5,text:'Added pickled jalapeños. Absolute perfection.'}],
  },
  {
    id:9, name:'Chicken Tikka Masala', cuisine:'Indian', time:'50 min', diff:'intermediate', cost:'$7',
    emoji:'🍛', trending:true, featured:true,
    tags:['intermediate','trending'],
    img:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=700&q=80',
    description:'Britain\'s most popular curry — ironically invented there by Bangladeshi chefs in the 1970s. Rich, creamy, fragrant, and deeply satisfying. The marinade step is non-negotiable for tender chicken.',
    ingredients:['600g chicken thighs, cubed','200ml plain yoghurt','2 tsp garam masala','2 tsp ground cumin','2 tsp ground coriander','1 tsp turmeric','1 tsp chilli powder','1 large onion, diced','4 garlic cloves','1 tbsp ginger, grated','400ml passata','200ml double cream','Salt & oil'],
    steps:['Mix yoghurt with half the spices and a pinch of salt. Coat chicken and marinate minimum 30 min (overnight is best).','Grill or pan-fry marinated chicken until slightly charred. Set aside.','Heat oil in large pan. Cook onion 8–10 min until deeply golden. Add garlic and ginger, cook 2 min.','Add remaining spices. Stir 1 min until fragrant.','Add passata. Simmer 10 min, stirring occasionally.','Add grilled chicken and cream. Simmer 10 more minutes.','Taste and adjust salt. Serve with basmati rice and naan.'],
    noOven:'Char the chicken in a hot pan instead of grilling.',
    noStove:'Not recommended for microwave — needs the sear for flavour development.',
    subs:['No chicken thighs → chicken breast (reduce cook time)','No double cream → coconut cream for dairy-free','No fresh ginger → 1 tsp ground ginger','No passata → blended canned tomatoes'],
    reviews:[{name:'Priya K',stars:5,text:'Better than my local Indian restaurant. The marinade is key.'},{name:'Curry C',stars:5,text:'I add a cinnamon stick to the sauce — try it.'}],
  },
  {
    id:10, name:'Crème Brûlée', cuisine:'French', time:'60 min', diff:'pro', cost:'$5',
    emoji:'🍮', trending:false, featured:false,
    tags:['pro','dessert'],
    img:'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=700&q=80',
    description:'The dessert with a dramatic ending — a thin layer of caramelised sugar shattered with a spoon. Crème brûlée was first recorded in France in 1691. The custard beneath must be silky and barely set.',
    ingredients:['500ml double cream','6 egg yolks','100g caster sugar + extra for topping','1 vanilla pod or 2 tsp vanilla extract','Pinch of salt'],
    steps:['Preheat oven to 160°C (325°F). Split vanilla pod and scrape seeds into cream. Warm cream gently with vanilla until just below boiling. Remove from heat.','Whisk egg yolks and sugar until pale — about 2 minutes. Don\'t aerate too much.','Slowly pour warm cream into yolks, whisking constantly. Strain through a fine sieve.','Divide into 4 ramekins. Place ramekins in a deep baking tray. Fill tray with boiling water halfway up the ramekins (bain-marie).','Bake 35–40 min. Custard should be set at edges but still have a slight wobble in the centre.','Cool, then refrigerate at least 2 hours (or overnight). Just before serving, sprinkle 1 tsp sugar on each and brûlée with a kitchen torch until amber.','Tap the caramel with a spoon and watch the crack. Serve immediately.'],
    noOven:'Crème brûlée requires an oven. No good substitute exists for the bain-marie bake.',
    noStove:'The cream must be warmed. Use a microwave in 30-second bursts until steaming.',
    subs:['No vanilla pod → 2 tsp vanilla extract or vanilla bean paste','No kitchen torch → place ramekins under a very hot grill/broiler 2–3 min for the brûlée','No double cream → heavy whipping cream (same thing different names)'],
    reviews:[{name:'Pastry P',stars:5,text:'Nailed it on the first try thanks to the wobble tip!'},{name:'Dinner D',stars:5,text:'Made this for a dinner party. Standing ovation.'}],
  },
  {id:11,name:'Garlic Butter Pasta',cuisine:'Italian',time:'12 min',diff:'beginner',cost:'$2',emoji:'🍝',trending:true,featured:false,tags:['quick','budget','beginner'],img:'https://images.unsplash.com/photo-1551183053-bf91798d9d30?w=700&q=80',description:'Five ingredients, one pot, twelve minutes. Pure weeknight magic — silky, garlicky, and deeply satisfying.',ingredients:['200g spaghetti','4 tbsp butter','5 garlic cloves, minced','¼ tsp chilli flakes','Salt & pepper','Fresh parsley','Parmesan'],steps:['Cook pasta in salted water until al dente. Reserve 1 cup pasta water.','Melt butter over medium heat. Add garlic and chilli, cook 2 min until golden.','Add pasta and ½ cup pasta water. Toss vigorously until silky.','Add parsley, season. Serve with parmesan.'],noOven:'Stovetop only.',noStove:'Microwave pasta 12 min. Melt butter with garlic 40 sec. Combine.',subs:['No butter → olive oil','No parsley → basil','No parmesan → nutritional yeast'],reviews:[{name:'Quick Cook',stars:5,text:'My go-to after work. Never gets old.'}]},
  {id:12,name:'Avocado Toast with Egg',cuisine:'American',time:'8 min',diff:'beginner',cost:'$2.50',emoji:'🥑',trending:true,featured:false,tags:['quick','beginner'],img:'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=700&q=80',description:'Creamy avocado on crunchy sourdough topped with a perfectly runny egg — simple, nutritious, and endlessly customisable.',ingredients:['2 slices sourdough','1 ripe avocado','2 eggs','Salt, pepper, chilli flakes','Lemon juice','Olive oil'],steps:['Toast bread until golden.','Mash avocado with lemon juice, salt and pepper.','Fry eggs in olive oil 2–3 min for runny yolk.','Spread avocado over toast. Top with egg and chilli flakes.'],noOven:'Stovetop only.',noStove:'Microwave egg in a mug 45 seconds.',subs:['No sourdough → any bread','No egg → sliced tomato','No lemon → lime'],reviews:[{name:'Brunch Queen',stars:5,text:'Added everything bagel seasoning — incredible.'}]},
  {id:13,name:'Caprese Salad',cuisine:'Italian',time:'5 min',diff:'beginner',cost:'$4',emoji:'🍅',trending:false,featured:false,tags:['quick','beginner'],img:'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=700&q=80',description:'From Capri — ripe tomato, fresh mozzarella and basil. One of the great flavour combinations in Italian cuisine.',ingredients:['3 large ripe tomatoes, sliced','250g fresh mozzarella, sliced','Large handful fresh basil','3 tbsp extra-virgin olive oil','1 tsp balsamic glaze','Salt & pepper'],steps:['Arrange alternating tomato and mozzarella slices on a plate.','Tuck basil between slices.','Drizzle with olive oil and balsamic glaze.','Season with salt and pepper. Serve immediately.'],noOven:'No cooking.',noStove:'No cooking.',subs:['No mozzarella → burrata','No balsamic glaze → red wine vinegar','No basil → fresh mint'],reviews:[{name:'Italian Nonna',stars:5,text:'Only works with perfect tomatoes. Heaven.'}]},
  {id:14,name:'Quesadillas',cuisine:'Mexican',time:'10 min',diff:'beginner',cost:'$2.50',emoji:'🫓',trending:false,featured:false,tags:['quick','budget','beginner'],img:'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=700&q=80',description:'Crispy on the outside, melty on the inside. Mexican street food perfected in under 10 minutes.',ingredients:['4 large flour tortillas','200g cheddar, grated','1 can black beans, drained','1 tsp cumin','½ tsp paprika','Sour cream and salsa to serve'],steps:['Season beans with cumin, paprika and salt.','Place tortilla in a dry pan over medium heat.','Add cheese on half, beans on top.','Fold over. Cook 2–3 min until golden. Flip, cook 2 min.','Cut into wedges. Serve with sour cream and salsa.'],noOven:'Stovetop only.',noStove:'Use a sandwich press.',subs:['No black beans → any beans or chicken','No cheddar → any melting cheese'],reviews:[{name:'Midnight Snack',stars:5,text:'I make these at 1am and have zero regrets.'}]},
  {id:15,name:'Tomato Soup',cuisine:'Mediterranean',time:'25 min',diff:'beginner',cost:'$2',emoji:'🍅',trending:false,featured:false,tags:['budget','beginner'],img:'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=700&q=80',description:'Homemade tomato soup beats any can. Tomatoes with garlic and basil blended into something silky and deeply comforting.',ingredients:['2 cans chopped tomatoes','1 onion, diced','4 garlic cloves','2 tbsp olive oil','1 tsp sugar','500ml vegetable stock','Fresh basil','Salt, pepper','Cream (optional)'],steps:['Cook onion 7 min until golden. Add garlic 1 min.','Add tomatoes, stock, sugar. Season. Simmer 15 min.','Add basil. Blend until smooth.','Adjust seasoning. Serve with cream and crusty bread.'],noOven:'Stovetop only.',noStove:'Slow cooker HIGH 3 hours then blend.',subs:['No fresh basil → 1 tsp dried','No cream → coconut milk'],reviews:[{name:'Soup Lover',stars:5,text:'Better than any restaurant tomato soup.'}]},
  {id:16,name:'Rice and Beans',cuisine:'American',time:'20 min',diff:'beginner',cost:'$1.50',emoji:'🫘',trending:false,featured:false,tags:['budget','beginner'],img:'https://images.unsplash.com/photo-1536304993881-ff86e0c9b589?w=700&q=80',description:'The dish that has sustained billions for centuries. Complete nutrition at the lowest possible cost.',ingredients:['1 cup long grain rice','1 can kidney beans, drained','1 onion, diced','3 garlic cloves','1 tsp cumin','1 tsp paprika','Salt, oil','Fresh coriander'],steps:['Cook rice per packet instructions.','Cook onion 5 min. Add garlic and spices, cook 1 min.','Add beans, cook 5 min until heated through.','Serve beans over rice with coriander.'],noOven:'Stovetop only.',noStove:'Microwave rice 12 min. Microwave beans with seasonings 2 min.',subs:['No kidney beans → any canned beans','Add hot sauce → highly recommended'],reviews:[{name:'Budget Student',stars:5,text:'Fed myself for a week on $5. Genuinely delicious.'}]},
  {id:17,name:'Peanut Butter Noodles',cuisine:'Asian',time:'12 min',diff:'beginner',cost:'$2',emoji:'🍜',trending:true,featured:false,tags:['quick','budget','beginner'],img:'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=700&q=80',description:'A peanut sauce so good you will want to put it on everything. Ready in minutes using pantry staples.',ingredients:['200g noodles','3 tbsp peanut butter','2 tbsp soy sauce','1 tbsp sesame oil','1 tbsp lime juice','1 tsp honey','1 garlic clove, minced','Hot water','Spring onions and sesame seeds'],steps:['Cook noodles. Drain and rinse cold.','Whisk peanut butter, soy, sesame oil, lime, honey and garlic.','Add hot water until sauce is pourable.','Toss noodles in sauce. Top with spring onions and sesame seeds.'],noOven:'Stovetop only.',noStove:'Microwave noodles 3 min. Mix sauce in a bowl.',subs:['No peanut butter → almond butter','No rice vinegar → lime juice'],reviews:[{name:'Noodle Fan',stars:5,text:'I made the sauce and literally drank the leftovers.'}]},
  {id:18,name:'Lentil Dhal',cuisine:'Indian',time:'30 min',diff:'beginner',cost:'$1.50',emoji:'🍛',trending:false,featured:false,tags:['budget','beginner'],img:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=700&q=80',description:'The backbone of Indian home cooking. Nourishing, cheap, and packed with flavour.',ingredients:['250g red lentils','1 onion, diced','3 garlic cloves','1 tbsp ginger','2 tomatoes, chopped','1 tsp mustard seeds','1 tsp turmeric','1 tsp cumin','1 tsp garam masala','Salt, oil','Fresh coriander'],steps:['Heat oil. Add mustard seeds until they pop.','Cook onion 7 min. Add garlic and ginger 2 min.','Add spices 30 sec. Add tomatoes 3 min.','Add lentils and 700ml water. Simmer 20 min until thick.','Season. Top with coriander. Serve with rice.'],noOven:'Stovetop only.',noStove:'Slow cooker HIGH 3–4 hours.',subs:['No mustard seeds → cumin seeds','No fresh ginger → 1 tsp ground ginger'],reviews:[{name:'Dhal Daily',stars:5,text:'Made this every week for a year. Never get bored.'}]},
  {id:19,name:'Banana Pancakes',cuisine:'American',time:'12 min',diff:'beginner',cost:'$1.50',emoji:'🥞',trending:false,featured:false,tags:['quick','budget','beginner'],img:'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=700&q=80',description:'Two ingredients, no flour, naturally sweet. Overripe bananas with eggs create gluten-free pancakes ready in minutes.',ingredients:['2 overripe bananas','2 eggs','Pinch of cinnamon','Butter for frying','Honey and fresh fruit to serve'],steps:['Mash bananas completely smooth.','Beat in eggs and cinnamon.','Heat pan over medium-low with butter.','Pour small amounts (2 tbsp each). Cook 2–3 min until bubbles form. Flip, cook 1 min.','Serve with honey and fruit.'],noOven:'Stovetop only.',noStove:'Not ideal for microwave.',subs:['No bananas → mashed sweet potato','Add blueberries or chocolate chips'],reviews:[{name:'Healthy Hack',stars:5,text:'My kids think these are dessert.'}]},
  {id:20,name:'Honey Garlic Chicken Thighs',cuisine:'American',time:'35 min',diff:'beginner',cost:'$6',emoji:'🍯',trending:true,featured:false,tags:['beginner'],img:'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=700&q=80',description:'Sticky, sweet, savoury, and utterly addictive. One of the most searched recipes in the world for good reason.',ingredients:['6 bone-in chicken thighs','3 tbsp honey','3 tbsp soy sauce','5 garlic cloves, minced','1 tbsp apple cider vinegar','Salt, pepper, oil'],steps:['Pat chicken dry. Season with salt and pepper.','Sear skin-side down in hot pan 5 min until golden. Flip 2 min.','Mix honey, soy, garlic and vinegar. Pour over chicken.','Bake at 200°C 25 min, basting halfway, until sticky.','Serve with rice and greens.'],noOven:'Cover pan on stovetop medium-low 25 min instead.',noStove:'Oven works fine.',subs:['No honey → maple syrup','No soy sauce → coconut aminos'],reviews:[{name:'Sticky Fingers',stars:5,text:'The glaze is so good I could drink it.'}]},
  {id:21,name:'Chicken Stir Fry',cuisine:'Asian',time:'15 min',diff:'beginner',cost:'$5',emoji:'🍗',trending:false,featured:false,tags:['quick','beginner'],img:'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=700&q=80',description:'Tender chicken and crisp vegetables cooked over screaming hot heat in minutes. The wok breath makes it special.',ingredients:['400g chicken breast, thinly sliced','2 tbsp soy sauce','1 tbsp oyster sauce','1 tsp sesame oil','1 tbsp cornstarch','2 garlic cloves','1 tsp ginger','Mixed vegetables','Oil'],steps:['Marinate chicken in soy, oyster sauce, sesame oil and cornstarch 10 min.','Heat wok over VERY HIGH heat until smoking.','Cook chicken 2 min without stirring. Flip 1 min. Remove.','Stir-fry garlic and ginger 20 sec. Add vegetables 3 min.','Return chicken. Toss 1 min. Serve over rice.'],noOven:'Wok only.',noStove:'High heat is essential.',subs:['No oyster sauce → hoisin','Any vegetables work'],reviews:[{name:'Wok Master',stars:5,text:'Better than takeout.'}]},
  {id:22,name:'Chicken Soup',cuisine:'American',time:'60 min',diff:'beginner',cost:'$5',emoji:'🍲',trending:false,featured:false,tags:['beginner'],img:'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=700&q=80',description:'The ultimate healing bowl. Every culture has a version — this is the classic with tender chicken, vegetables and noodles.',ingredients:['600g chicken thighs','3 carrots, sliced','3 celery sticks, sliced','1 onion, diced','4 garlic cloves','2 litres stock','100g egg noodles','Fresh parsley','Salt & pepper'],steps:['Place chicken in pot. Cover with stock. Boil, skim foam.','Add vegetables. Season. Simmer 40 min.','Remove chicken. Shred. Discard bones.','Return chicken. Add noodles, cook 8 min.','Add parsley. Serve hot.'],noOven:'Stovetop only.',noStove:'Slow cooker LOW 6–8 hours.',subs:['No egg noodles → rice','No stock → water + 2 stock cubes'],reviews:[{name:'Sick Day',stars:5,text:'Better medicine than anything from the pharmacy.'}]},
  {id:23,name:'Chicken Quesadillas',cuisine:'Mexican',time:'15 min',diff:'beginner',cost:'$4',emoji:'🌮',trending:true,featured:false,tags:['quick','beginner'],img:'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=700&q=80',description:'Crispy flour tortillas with seasoned chicken and melted cheese. Ready in 15 minutes and endlessly customisable.',ingredients:['300g cooked chicken, shredded','4 large tortillas','200g cheddar, grated','1 tsp cumin','½ tsp paprika','Sour cream, salsa, guacamole'],steps:['Season chicken with cumin, paprika and salt.','Place tortilla in dry pan over medium heat.','Add cheese on half, chicken on top.','Fold over. Cook 3 min until golden. Flip 2 min.','Cut into wedges. Serve with toppings.'],noOven:'Stovetop only.',noStove:'Sandwich press works perfectly.',subs:['No cooked chicken → canned chicken','No cheddar → any melting cheese'],reviews:[{name:'Fam Favourite',stars:5,text:'My kids request this every Friday.'}]},
  {id:24,name:'Lemon Herb Roast Chicken',cuisine:'French',time:'90 min',diff:'intermediate',cost:'$8',emoji:'🍗',trending:false,featured:true,tags:['intermediate','featured'],img:'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=700&q=80',description:'A whole chicken rubbed with herb butter, stuffed with lemon and garlic — the French method for impossibly juicy meat and crispy skin.',ingredients:['1 whole chicken (1.5kg)','4 tbsp softened butter','3 garlic cloves, minced','1 lemon, halved','Fresh rosemary and thyme','Salt & pepper'],steps:['Preheat oven to 200°C. Pat chicken completely dry.','Mix butter with garlic, rosemary, thyme and seasoning.','Push butter under skin. Rub remainder on top.','Stuff cavity with lemon and herbs.','Roast 80 min basting every 30 min. Rest 15 min before carving.'],noOven:'Cannot be made without an oven.',noStove:'Oven only.',subs:['No fresh herbs → 1 tbsp dried mixed herbs','No whole chicken → thighs, reduce to 35 min'],reviews:[{name:'Sunday Chef',stars:5,text:'Butter under the skin changed my roast chicken forever.'}]},
  {id:25,name:'Mushroom Risotto',cuisine:'Italian',time:'40 min',diff:'intermediate',cost:'$5',emoji:'🍄',trending:false,featured:true,tags:['intermediate','featured'],img:'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=700&q=80',description:'Proper risotto requires patience — but the result is a silky, deeply savoury bowl that cannot be replicated any other way.',ingredients:['300g arborio rice','500g mixed mushrooms, sliced','1 onion, finely diced','3 garlic cloves','150ml white wine','1.2 litres hot vegetable stock','50g parmesan','3 tbsp butter','Salt, olive oil','Fresh parsley'],steps:['Keep stock hot in a separate pot throughout.','Cook mushrooms over HIGH heat until golden. Set aside.','Cook onion 7 min. Add garlic 1 min. Add rice, toast 2 min.','Add wine, stir until absorbed.','Add stock one ladle at a time, stirring constantly 18–20 min.','Add mushrooms, butter and parmesan. Season. Rest 2 min. Serve immediately.'],noOven:'Stovetop only.',noStove:'Not possible — constant stirring on heat is essential.',subs:['No wine → extra stock','No parmesan → nutritional yeast for vegan'],reviews:[{name:'Risotto Rita',stars:5,text:'The constant stirring is meditative. Worth every minute.'}]},
  {id:26,name:'Veggie Burgers',cuisine:'American',time:'25 min',diff:'intermediate',cost:'$3',emoji:'🍔',trending:false,featured:false,tags:['budget','intermediate'],img:'https://images.unsplash.com/photo-1550547660-d9450f859349?w=700&q=80',description:'Homemade veggie burgers that hold together and taste incredible. Black beans, oats and spices create real flavour.',ingredients:['1 can black beans, drained','80g oats','1 egg','1 onion, finely diced','2 garlic cloves','1 tsp cumin','1 tsp smoked paprika','Salt, oil','Burger buns and toppings'],steps:['Mash beans roughly. Leave some texture.','Fry onion and garlic 5 min. Cool slightly.','Combine beans, oats, egg, onion and spices. Mix well.','Form into 4 patties. Refrigerate 15 min.','Cook in oil medium heat 4 min per side until golden.','Serve in buns with toppings.'],noOven:'Stovetop.',noStove:'Bake at 180°C 20 min flipping halfway.',subs:['No black beans → chickpeas','No egg → flax egg','No oats → breadcrumbs'],reviews:[{name:'Veggie Vic',stars:5,text:'My meat-eating husband prefers these to beef burgers.'}]},
  {id:27,name:'Chickpea Curry',cuisine:'Indian',time:'30 min',diff:'beginner',cost:'$2.50',emoji:'🥘',trending:true,featured:false,tags:['budget','beginner'],img:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=700&q=80',description:'Chana masala — North Indian chickpea curry. Rich, tomatoey and deeply spiced. Completely vegan and better the next day.',ingredients:['2 cans chickpeas, drained','2 cans chopped tomatoes','1 onion, diced','4 garlic cloves','1 tbsp ginger','2 tsp cumin','2 tsp coriander','1 tsp turmeric','1 tsp garam masala','½ tsp chilli','Salt, oil','Coriander and rice'],steps:['Cook onion 8 min until golden.','Add garlic and ginger 2 min. Add spices 1 min.','Add tomatoes. Simmer 10 min until thick.','Add chickpeas and 200ml water. Simmer 15 min.','Season. Top with coriander. Serve with rice.'],noOven:'Stovetop only.',noStove:'Slow cooker HIGH 4 hours.',subs:['No chickpeas → any canned beans','Creamier → add 100ml coconut cream at end'],reviews:[{name:'Chana Champion',stars:5,text:'I batch cook this every week. Freezes perfectly.'}]},
  {id:28,name:'Vegan Buddha Bowl',cuisine:'Mediterranean',time:'20 min',diff:'beginner',cost:'$4',emoji:'🥗',trending:true,featured:false,tags:['quick','beginner'],img:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&q=80',description:'A harmonious combination of grains, roasted veg, protein and tahini sauce — nourishing, colourful, completely satisfying.',ingredients:['1 cup cooked quinoa or rice','1 can chickpeas, drained and roasted','1 avocado, sliced','1 cup cherry tomatoes','1 cup cucumber, diced','Handful spinach','3 tbsp tahini','1 lemon juiced','1 garlic clove','Salt, water'],steps:['Toss chickpeas with oil and cumin. Roast at 200°C 20 min or pan-fry.','Whisk tahini, lemon, garlic and salt. Add water until pourable.','Assemble bowl: grains base, arrange toppings in sections.','Drizzle generously with tahini dressing.'],noOven:'Pan-fry chickpeas.',noStove:'All components can be assembled cold.',subs:['No quinoa → any grain','No tahini → peanut butter dressing'],reviews:[{name:'Plant Power',stars:5,text:'Meal prep this every Sunday. Keeps me energised all week.'}]},
  {id:29,name:'Chocolate Mug Cake',cuisine:'American',time:'5 min',diff:'beginner',cost:'$1.50',emoji:'🍫',trending:true,featured:false,tags:['quick','budget','beginner'],img:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80',description:'A warm gooey chocolate cake in 5 minutes with no mixing bowls and no oven. The dessert that has saved countless late nights.',ingredients:['4 tbsp self-raising flour','4 tbsp sugar','2 tbsp cocoa powder','1 egg','3 tbsp milk','3 tbsp vegetable oil','Pinch of salt','2 tbsp chocolate chips'],steps:['Add flour, sugar, cocoa and salt to a large mug. Mix.','Add egg, milk and oil. Mix until smooth.','Stir in chocolate chips.','Microwave HIGH 60–90 seconds until pulling from sides but moist on top.','Do not overcook. Eat straight from mug.'],noOven:'This IS the no-oven recipe.',noStove:'This IS the microwave recipe.',subs:['No self-raising flour → plain flour + ¼ tsp baking powder','No cocoa → add vanilla instead'],reviews:[{name:'Midnight Craving',stars:5,text:'Saved my life at 11pm. Every single time.'}]},
  {id:30,name:'Tiramisu',cuisine:'Italian',time:'30 min',diff:'intermediate',cost:'$8',emoji:'☕',trending:false,featured:true,tags:['intermediate','featured'],img:'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=700&q=80',description:'The iconic Italian dessert — coffee-soaked ladyfingers layered with mascarpone cream. No baking. Always better made the day before.',ingredients:['250g mascarpone','3 eggs, separated','75g caster sugar','200ml strong espresso, cooled','2 tbsp coffee liqueur','200g ladyfinger biscuits','Cocoa powder for dusting'],steps:['Whisk egg yolks and sugar until pale. Beat in mascarpone until smooth.','Whisk egg whites to stiff peaks. Fold into mascarpone mixture.','Quickly dip ladyfingers in coffee + liqueur (1 second per side).','Layer biscuits in dish. Spread half the cream. Repeat.','Dust with cocoa. Refrigerate minimum 4 hours.','Serve cold with extra cocoa.'],noOven:'No oven needed.',noStove:'No cooking required.',subs:['No mascarpone → cream cheese + 2 tbsp cream','No ladyfingers → plain sponge cake','No liqueur → more coffee'],reviews:[{name:'Nonna Approved',stars:5,text:'The family said it was the best they had ever had.'}]},
  {id:31,name:'Chocolate Brownies',cuisine:'American',time:'40 min',diff:'beginner',cost:'$4',emoji:'🍫',trending:true,featured:false,tags:['beginner'],img:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700&q=80',description:'Fudgy, not cakey. Dense and rich with a crackly top. The right ratio of fat to flour makes all the difference.',ingredients:['200g dark chocolate','150g butter','250g sugar','3 eggs','100g plain flour','30g cocoa powder','1 tsp vanilla','Pinch of salt'],steps:['Preheat oven 180°C. Line 20cm tin.','Melt chocolate and butter. Cool 5 min.','Whisk in sugar. Add eggs one at a time.','Add vanilla. Fold in flour, cocoa and salt — stop when flour disappears.','Bake 22–25 min. Skewer should have moist crumbs.','Cool completely before cutting.'],noOven:'Cannot be made without an oven.',noStove:'Melt chocolate in microwave 30-second bursts.',subs:['No dark chocolate → milk chocolate','Add walnuts or peanut butter swirl'],reviews:[{name:'Brownie Boss',stars:5,text:'Key is underbaking slightly. Fudgy perfection.'}]},
  {id:32,name:'Pad Thai',cuisine:'Asian',time:'20 min',diff:'intermediate',cost:'$5',emoji:'🍜',trending:true,featured:true,tags:['intermediate','trending'],img:'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=700&q=80',description:'Thailand\'s national noodle dish. Tangy, sweet, savoury and smoky all at once. The tamarind and fish sauce create an unforgettable flavour.',ingredients:['200g flat rice noodles','200g prawns or chicken or tofu','3 tbsp fish sauce','2 tbsp tamarind paste','1 tbsp palm sugar','2 eggs','100g bean sprouts','3 spring onions','Oil','Peanuts, lime, chilli'],steps:['Soak noodles in warm water 20 min. Drain.','Mix fish sauce, tamarind and sugar.','Cook protein in smoking wok 2–3 min. Push aside.','Add noodles. Pour sauce. Toss 2 min.','Push aside. Scramble eggs. Fold in.','Add sprouts and spring onions. Toss 30 sec. Serve with peanuts and lime.'],noOven:'Wok only.',noStove:'High heat is essential.',subs:['No tamarind → lime juice + extra sugar','No fish sauce → soy sauce'],reviews:[{name:'Bangkok Nights',stars:5,text:'Better than most Pad Thai I had in Thailand.'}]},
  {id:33,name:'Miso Soup',cuisine:'Asian',time:'10 min',diff:'beginner',cost:'$2',emoji:'🍜',trending:false,featured:false,tags:['quick','budget','beginner'],img:'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=700&q=80',description:'The soul of Japanese home cooking. A deeply umami broth that warms from the inside out — made fresh every morning in millions of Japanese homes.',ingredients:['1 litre dashi or vegetable stock','3 tbsp white or red miso paste','200g silken tofu, cubed','2 sheets dried wakame seaweed','2 spring onions, sliced'],steps:['Soak wakame 5 min. Drain.','Bring stock to a gentle simmer. Do not boil.','Add tofu and wakame. Warm 2 min.','Remove from heat. Dissolve miso in ladle of stock. Stir in.','Never boil miso. Serve topped with spring onions.'],noOven:'Stovetop only.',noStove:'Microwave stock 3 min. Dissolve miso in it.',subs:['No dashi → vegetable stock + 1 tsp soy','No wakame → spinach'],reviews:[{name:'Morning Ritual',stars:5,text:'I make this every morning. Sets the tone for the whole day.'}]},
  {id:34,name:'Korean Bibimbap',cuisine:'Asian',time:'30 min',diff:'intermediate',cost:'$6',emoji:'🍚',trending:true,featured:false,tags:['intermediate'],img:'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&q=80',description:'Korea\'s most iconic dish. Warm rice with seasoned vegetables, a fried egg and gochujang. The mixing is the most important part.',ingredients:['2 cups cooked rice','2 eggs','1 carrot, julienned','1 courgette, julienned','200g spinach','100g bean sprouts','200g beef mince (optional)','3 tbsp gochujang','1 tbsp sesame oil','Soy sauce, garlic'],steps:['Quickly stir-fry each vegetable separately in sesame oil. Season with soy.','Cook beef with soy, garlic and sugar. (optional)','Fry eggs sunny-side up.','Divide rice between bowls. Arrange toppings in sections.','Place egg in centre. Add gochujang on top.','Mix everything vigorously before eating.'],noOven:'Stovetop only.',noStove:'Not recommended.',subs:['No gochujang → sriracha + soy sauce','No beef → mushrooms or tofu'],reviews:[{name:'Seoul Food',stars:5,text:'The mixing is the most satisfying part.'}]},
  {id:35,name:'Dumplings (Gyoza)',cuisine:'Asian',time:'45 min',diff:'intermediate',cost:'$5',emoji:'🥟',trending:false,featured:false,tags:['intermediate'],img:'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=700&q=80',description:'Pan-fried gyoza with a crispy bottom and steamed top. The contrast in textures is what makes them extraordinary.',ingredients:['30 gyoza wrappers','300g pork mince','200g cabbage, salted and squeezed dry','3 garlic cloves, minced','1 tbsp ginger','2 tbsp soy sauce','1 tbsp sesame oil','Dipping sauce: soy, rice vinegar, chilli oil'],steps:['Combine pork, squeezed cabbage, garlic, ginger, soy and sesame oil.','Place 1 tsp filling in each wrapper. Moisten edges. Fold and pleat to seal.','Cook flat-side down in oiled pan 2 min until golden.','Add 4 tbsp water, cover immediately. Steam 5 min.','Uncover, cook 1 min more until crispy again. Serve with dipping sauce.'],noOven:'Pan-fried on stovetop.',noStove:'Steam over boiling water 8 min.',subs:['No pork → chicken, prawn or mushroom','No gyoza wrappers → wonton wrappers'],reviews:[{name:'Dumpling Master',stars:5,text:'Made 100 for Chinese New Year. Every single one disappeared.'}]},
  {id:36,name:'Pasta Carbonara',cuisine:'Italian',time:'20 min',diff:'intermediate',cost:'$4',emoji:'🍝',trending:true,featured:true,tags:['intermediate','trending'],img:'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=700&q=80',description:'The Roman pasta with no cream — just eggs, pecorino and guanciale creating silk through technique alone.',ingredients:['400g spaghetti','200g guanciale or pancetta, diced','4 egg yolks + 1 whole egg','100g pecorino romano, grated','Black pepper, generously ground','Salt'],steps:['Cook guanciale until crispy. Remove from heat.','Whisk eggs and pecorino. Season with lots of black pepper.','Cook pasta. Reserve 1 cup pasta water.','Add pasta to pan with guanciale. Remove from heat.','Pour egg mix over. Toss vigorously, adding pasta water until silky.','Serve immediately with extra pecorino and pepper.'],noOven:'Stovetop only.',noStove:'Cannot be made without a stove.',subs:['No guanciale → pancetta or bacon','No pecorino → parmesan','NEVER add cream'],reviews:[{name:'Roman Holiday',stars:5,text:'When it works it is one of the best things I have ever eaten.'}]},
  {id:37,name:'Penne Arrabbiata',cuisine:'Italian',time:'20 min',diff:'beginner',cost:'$2.50',emoji:'🍝',trending:false,featured:false,tags:['quick','budget','beginner'],img:'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=700&q=80',description:'Arrabbiata means angry — named for the chilli heat. A ferociously simple Roman sauce with more flavour than sauces ten times more complicated.',ingredients:['400g penne','3 cans chopped tomatoes','5 garlic cloves, sliced','1 tsp red chilli flakes','4 tbsp olive oil','Salt','Fresh parsley'],steps:['Heat oil. Add garlic and chilli. Cook slowly 3 min until golden.','Add tomatoes. Season. Simmer 15 min until thick.','Cook pasta in salted water. Toss in sauce with pasta water.','Serve with parsley. No cheese — Roman tradition.'],noOven:'Stovetop only.',noStove:'Cannot be made without a stove.',subs:['No chilli flakes → fresh red chilli','Add olives or capers for depth'],reviews:[{name:'Angry Pasta',stars:5,text:'I doubled the chilli. Zero regrets.'}]},
  {id:38,name:'Pasta Bolognese',cuisine:'Italian',time:'90 min',diff:'intermediate',cost:'$7',emoji:'🍝',trending:false,featured:false,tags:['intermediate'],img:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=80',description:'The original slow-cooked ragù from Bologna. Time and patience transform cheap ingredients into something extraordinary.',ingredients:['500g beef mince','1 onion, finely diced','2 carrots, finely diced','2 celery sticks, finely diced','4 garlic cloves','150ml milk','150ml white wine','400g canned tomatoes','400g tagliatelle','Parmesan, oil, salt, pepper'],steps:['Cook onion, carrot and celery 10 min on medium-low until completely soft.','Add garlic 1 min. Add mince. Brown on HIGH 10 min until liquid evaporates.','Add wine, stir until absorbed. Add milk, stir until absorbed.','Add tomatoes and 200ml water. Simmer uncovered on lowest heat 60–90 min.','Toss with pasta and pasta water. Serve with parmesan.'],noOven:'Stovetop only.',noStove:'Slow cooker LOW 6–8 hours after browning meat.',subs:['No white wine → red wine or skip','The milk step tenderises the meat — do not skip it'],reviews:[{name:'Bologna Born',stars:5,text:'The milk step confused me at first. Now I understand.'}]},
  {id:39,name:'Cacio e Pepe',cuisine:'Italian',time:'15 min',diff:'pro',cost:'$3',emoji:'🧀',trending:true,featured:false,tags:['quick','pro'],img:'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=700&q=80',description:'Three ingredients, centuries of Roman history. Cheese and pepper creating silk — no cream, no butter. Technique alone.',ingredients:['400g spaghetti','200g pecorino romano, finely grated','100g parmesan, finely grated','2 tsp black pepper, freshly ground','Salt'],steps:['Toast pepper in dry pan 30 seconds. Remove.','Cook pasta in less water than usual (more starch). Reserve 2 cups pasta water.','Add 1 cup pasta water to pan with pepper. Simmer.','Add pasta. Toss.','Off heat, add cheese gradually tossing constantly with pasta water until silky.','Serve immediately with extra pecorino and pepper.'],noOven:'Stovetop only.',noStove:'Cannot be made without a stove.',subs:['No pecorino → all parmesan','Practice makes perfect — technique is everything'],reviews:[{name:'Pro Chef',stars:5,text:'Failed 4 times before it clicked. Worth every attempt.'}]},
  {id:40,name:'Lasagne',cuisine:'Italian',time:'90 min',diff:'intermediate',cost:'$10',emoji:'🫕',trending:false,featured:false,tags:['intermediate'],img:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=80',description:'The grand Italian bake that feeds a crowd and improves every time it is reheated. Layers of pasta, bolognese, béchamel and parmesan.',ingredients:['12 lasagne sheets','500g beef mince','1 onion','3 garlic cloves','400g canned tomatoes','For béchamel: 60g butter, 60g flour, 700ml milk, nutmeg','200g parmesan','Salt, pepper, olive oil'],steps:['Make bolognese: fry onion and garlic, brown mince, add tomatoes. Simmer 30 min.','Make béchamel: melt butter, add flour 1 min, whisk in milk, season with nutmeg. Cook 5 min.','Preheat oven 180°C. Spread thin bolognese in dish.','Layer: pasta, bolognese, béchamel, parmesan. Repeat 3 times. Top with béchamel and lots of parmesan.','Cover with foil. Bake 30 min. Remove foil, bake 15 min until golden.','Rest 15 min before serving.'],noOven:'Cannot be made without an oven.',noStove:'Both sauces require stovetop.',subs:['No fresh sheets → dried sheets','Vegetarian → roasted vegetables instead of mince'],reviews:[{name:'Sunday Feast',stars:5,text:'Made this for 10 people. Not a single piece left.'}]},
  {id:41,name:'Fish Tacos',cuisine:'Mexican',time:'20 min',diff:'beginner',cost:'$6',emoji:'🌮',trending:true,featured:false,tags:['quick','beginner'],img:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=700&q=80',description:'Baja California\'s greatest export. Crispy fish, crunchy slaw, chipotle mayo — perfectly balanced between heat, acid and richness.',ingredients:['400g white fish fillets','8 small corn tortillas','100g plain flour','1 tsp paprika','1 tsp cumin','Salt, pepper, oil','Slaw: ¼ cabbage, lime juice, salt','Sauce: 4 tbsp mayo, 1 tbsp chipotle, lime juice'],steps:['Mix flour, paprika, cumin, salt and pepper. Coat fish.','Fry in hot oil 3–4 min per side until crispy. Drain.','Mix slaw and chipotle mayo separately.','Warm tortillas in dry pan.','Assemble: tortilla, fish, slaw, chipotle mayo, lime.'],noOven:'Pan-fried.',noStove:'Bake fish at 200°C 12 min.',subs:['No white fish → prawns or tofu','No chipotle → sriracha'],reviews:[{name:'Baja Bound',stars:5,text:'The chipotle mayo makes the whole thing. Do not skip it.'}]},
  {id:42,name:'Greek Salad',cuisine:'Mediterranean',time:'8 min',diff:'beginner',cost:'$4',emoji:'🥗',trending:false,featured:false,tags:['quick','budget','beginner'],img:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&q=80',description:'Horiatiki — village salad from Greece. No lettuce. Perfect tomatoes, cucumber, olives and feta drenched in the best olive oil. Simplicity perfected.',ingredients:['3 large ripe tomatoes, chunked','1 cucumber, thickly sliced','½ red onion, sliced','150g kalamata olives','200g feta cheese','1 tsp dried oregano','4 tbsp extra-virgin olive oil','Salt & pepper'],steps:['Combine tomatoes, cucumber, onion and olives.','Season with salt and drizzle with olive oil. Toss gently.','Top with feta as a whole slab.','Sprinkle oregano generously.','Let sit 5 min before serving.'],noOven:'No cooking.',noStove:'No cooking.',subs:['No kalamata → any black olives','No feta → halloumi'],reviews:[{name:'Greek Island',stars:5,text:'Nothing better when tomatoes are at their best.'}]},
  {id:43,name:'Beef Tacos',cuisine:'Mexican',time:'25 min',diff:'beginner',cost:'$6',emoji:'🌮',trending:true,featured:false,tags:['beginner'],img:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=700&q=80',description:'Tuesday\'s most famous meal. Seasoned ground beef in a warm tortilla with all the toppings — a globally loved formula that never gets old.',ingredients:['500g beef mince','8 taco shells or tortillas','1 onion, diced','3 garlic cloves','2 tsp cumin','1 tsp smoked paprika','1 tsp chilli powder','Salt, oil','Lettuce, cheese, sour cream, salsa, jalapeños, lime'],steps:['Cook onion 5 min. Add garlic 1 min.','Add beef on HIGH. Brown well 7 min.','Add spices and a splash of water. Cook 3 min.','Warm shells or tortillas.','Fill with beef and all toppings. Squeeze lime.'],noOven:'Stovetop.',noStove:'Cannot be made without a stove.',subs:['No beef → chicken or black beans','Add hot sauce for heat'],reviews:[{name:'Taco Tuesday',stars:5,text:'I make this literally every Tuesday. The spice mix is perfect.'}]},
  {id:44,name:'Salmon Teriyaki',cuisine:'Asian',time:'20 min',diff:'beginner',cost:'$9',emoji:'🐟',trending:true,featured:false,tags:['quick','beginner'],img:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80',description:'Sweet-soy glaze caramelises beautifully on salmon creating a lacquered, sticky coating that balances perfectly with the rich fish.',ingredients:['4 salmon fillets','3 tbsp soy sauce','2 tbsp mirin','1 tbsp sake (optional)','1 tbsp honey','Sesame seeds and spring onions','Steamed rice'],steps:['Mix soy, mirin, sake and honey.','Pat salmon dry. Season lightly.','Cook skin-side up 3 min. Flip.','Pour sauce over. Cook 3 min, basting constantly as sauce reduces.','When sticky and glazed, remove from heat.','Serve over rice with sesame seeds and spring onions.'],noOven:'Stovetop.',noStove:'Bake at 200°C 12 min, add sauce last 3 min.',subs:['No mirin → 1 tbsp sugar + 1 tbsp rice vinegar','No salmon → chicken thighs work beautifully'],reviews:[{name:'Tokyo Kitchen',stars:5,text:'The basting technique makes all the difference.'}]},
  {id:45,name:'Vegetable Fried Rice',cuisine:'Asian',time:'15 min',diff:'beginner',cost:'$2',emoji:'🍚',trending:false,featured:false,tags:['quick','budget','beginner'],img:'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=700&q=80',description:'Every vegetable in your fridge becomes something special in a screaming hot wok with day-old rice. Better than takeout in 15 minutes.',ingredients:['3 cups cooked rice (day-old)','3 eggs','Mixed vegetables (peas, carrot, corn, broccoli)','3 garlic cloves','3 tbsp soy sauce','1 tbsp sesame oil','Oil','Spring onions','White pepper'],steps:['Heat wok over VERY HIGH heat until smoking. Add oil.','Add garlic 20 sec. Add vegetables, stir-fry 3 min.','Push aside. Scramble eggs until just set.','Add rice. Break up clumps. Mix with veg and egg.','Pour soy around edge. Add pepper. Toss vigorously 2–3 min.','Drizzle sesame oil. Serve with spring onions.'],noOven:'Wok only.',noStove:'Microwave components separately and combine — but high heat is far better.',subs:['Any vegetables work','No soy → salt + sesame oil','Add tofu for protein'],reviews:[{name:'Fridge Clear',stars:5,text:'Cleared out my fridge and made the best meal of the week.'}]},
  {id:46,name:'Tom Yum Soup',cuisine:'Asian',time:'25 min',diff:'intermediate',cost:'$6',emoji:'🍲',trending:false,featured:false,tags:['intermediate'],img:'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=700&q=80',description:'Thailand\'s most famous soup — hot, sour, fragrant and complex. Lemongrass, galangal and kaffir lime create a broth unlike anything else.',ingredients:['1 litre chicken stock','300g prawns, peeled','200g mushrooms, halved','2 stalks lemongrass, bruised','4 kaffir lime leaves','3 slices galangal or ginger','3 tbsp fish sauce','3 tbsp lime juice','1 tsp sugar','2 red chillies','Fresh coriander'],steps:['Boil stock. Add lemongrass, galangal and lime leaves. Simmer 5 min.','Add mushrooms 3 min.','Add prawns 2 min until pink.','Season with fish sauce, lime and sugar. Taste — should be hot, sour and fragrant.','Add chillies. Top with coriander. Serve immediately.'],noOven:'Stovetop only.',noStove:'Not recommended.',subs:['No galangal → fresh ginger','No kaffir lime → lime zest','No fish sauce → soy sauce for vegetarian'],reviews:[{name:'Spice Seeker',stars:5,text:'This soup cured my cold in one bowl.'}]},
  {id:47,name:'Roasted Vegetable Pasta',cuisine:'Italian',time:'35 min',diff:'beginner',cost:'$4',emoji:'🍝',trending:false,featured:false,tags:['beginner'],img:'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=700&q=80',description:'Roasting concentrates vegetables\' natural sugars creating caramelised edges. Tossed with pasta and olive oil — Italian cooking at its most honest.',ingredients:['300g penne','1 courgette, diced','1 red pepper, diced','1 aubergine, diced','1 red onion, wedged','4 garlic cloves','4 tbsp olive oil','Salt, pepper, dried herbs','Fresh basil','Parmesan'],steps:['Preheat oven 220°C. Toss vegetables with oil, salt, pepper and herbs.','Roast 25–30 min tossing halfway until caramelised.','Cook pasta. Reserve 1 cup pasta water.','Combine pasta and vegetables with pasta water to loosen.','Finish with fresh basil and parmesan.'],noOven:'Pan-roast vegetables in batches over HIGH heat.',noStove:'Pasta can be microwaved.',subs:['Any vegetables work','No parmesan → goat cheese','Add white beans for protein'],reviews:[{name:'Oven Roast',stars:5,text:'The roasting step completely transforms the vegetables.'}]},
  {id:48,name:'Mango Sticky Rice',cuisine:'Asian',time:'35 min',diff:'intermediate',cost:'$4',emoji:'🥭',trending:false,featured:false,tags:['intermediate'],img:'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=700&q=80',description:'Thailand\'s most beloved dessert. Sweet glutinous rice soaked in coconut milk, served with perfectly ripe mango.',ingredients:['300g glutinous rice, soaked overnight','400ml coconut milk','4 tbsp sugar','½ tsp salt','2 ripe mangoes, sliced','Sesame seeds'],steps:['Steam soaked rice 25 min until tender.','Heat coconut milk, sugar and salt until dissolved. Do not boil.','Pour ¾ of coconut sauce over hot rice. Stir. Cover and rest 20 min.','Serve rice alongside sliced mango. Drizzle remaining sauce.','Sprinkle sesame seeds.'],noOven:'Steamer or stovetop only.',noStove:'Cannot be made without heat.',subs:['No glutinous rice → regular rice (different texture)','No fresh mango → canned mango'],reviews:[{name:'Thai Memory',stars:5,text:'Transported me straight back to Bangkok.'}]},
  {id:49,name:'Lemon Tart',cuisine:'French',time:'60 min',diff:'pro',cost:'$6',emoji:'🍋',trending:false,featured:false,tags:['pro'],img:'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=700&q=80',description:'The jewel of French patisserie — a buttery shortcrust shell filled with intensely sharp, silky lemon curd.',ingredients:['200g plain flour','100g cold butter, cubed','50g icing sugar','1 egg yolk','4 eggs, 200g sugar, 150ml lemon juice, 150ml double cream, zest of 2 lemons'],steps:['Make pastry: blitz flour, butter, sugar. Add egg yolk + cold water. Chill 30 min.','Roll and line 23cm tart tin. Blind bake 180°C 15 min with beans, 5 min without.','Whisk eggs, sugar, lemon juice, cream and zest together.','Pour into warm shell. Bake 150°C 25 min until just set with slight wobble.','Cool completely. Dust with icing sugar.'],noOven:'Cannot be made without an oven.',noStove:'Lemon curd can be made on stovetop.',subs:['No double cream → single cream','No fresh lemons → bottled lemon juice'],reviews:[{name:'French Pastry',stars:5,text:'Three attempts. Now I make this for every dinner party.'}]},
  {id:50,name:'Omelette Rice (Omurice)',cuisine:'Asian',time:'15 min',diff:'beginner',cost:'$2',emoji:'🍳',trending:true,featured:false,tags:['quick','budget','beginner'],img:'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=700&q=80',description:'Japan\'s beloved comfort food — ketchup fried rice wrapped in a silky thin omelette. A staple of Japanese home cooking since the 1900s.',ingredients:['2 cups cooked rice','3 eggs','2 tbsp ketchup plus more to serve','½ onion, diced','100g chicken or ham (optional)','Salt, pepper, butter','Soy sauce'],steps:['Fry onion in butter 3 min. Add protein if using.','Add rice. Stir-fry 2 min. Add ketchup and soy. Toss until evenly coated.','Push rice to one side. Beat eggs with salt and pour into empty side.','When just barely set, fold rice over eggs. Slide onto plate.','Squeeze ketchup on top in a zigzag.'],noOven:'Stovetop only.',noStove:'Not ideal for microwave.',subs:['No chicken → skip or use any leftover protein','No ketchup → tomato paste + pinch of sugar'],reviews:[{name:'Tokyo Nights',stars:5,text:'Takes me straight back to Japan. Perfect every time.'}]},
];

/* ══════════════════════════════════
   SUPPORT DATA
══════════════════════════════════ */
const CUISINE_LIST = [
  { name:'Italian',       emoji:'🇮🇹', img:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80' },
  { name:'Asian',         emoji:'🍜', img:'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80' },
  { name:'American',      emoji:'🇺🇸', img:'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80' },
  { name:'French',        emoji:'🇫🇷', img:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80' },
  { name:'Mediterranean', emoji:'🫒', img:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  { name:'Mexican',       emoji:'🇲🇽', img:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80' },
  { name:'Indian',        emoji:'🇮🇳', img:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
];

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80',
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1600&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600&q=80',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1600&q=80',
];

const HERO_TAGS = ['🍳 Eggs','🍚 Rice','🍝 Pasta','🧀 Cheese','🥦 Veggies','🫘 Beans','🧄 Garlic','🐔 Chicken'];

const AI_SUGGESTIONS = [
  "I have eggs, rice and garlic",
  "Something quick under 15 minutes",
  "Easy beginner Italian pasta",
  "Spicy Asian dish for dinner",
  "Budget meal under $3",
  "Impressive dinner party dish",
  "Healthy vegetarian option",
  "What can I cook with chicken?",
];

/* ══════════════════════════════════
   STATE
══════════════════════════════════ */
let favourites    = JSON.parse(localStorage.getItem('rh_favs')    || '[]');
let reviewStore   = JSON.parse(localStorage.getItem('rh_reviews') || '{}');
let viewHistory   = JSON.parse(localStorage.getItem('rh_history') || '[]');  // array of meal IDs, newest first
let userPrefs     = JSON.parse(localStorage.getItem('rh_prefs')   || 'null');
let currentMeal   = null;
let currentStars  = 0;
let bgIndex       = 0;
let browseFilter  = 'all';
let aiHistory     = [];
let currentUser   = null;   // Firebase user object
let firebaseReady = false;

/* ══════════════════════════════════
   FIREBASE INIT
══════════════════════════════════ */
function initFirebase() {
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    firebaseReady = true;

    firebase.auth().onAuthStateChanged(user => {
      currentUser = user;
      if (user) {
        onUserSignedIn(user);
      } else {
        onUserSignedOut();
      }
    });
  } catch (e) {
    // Firebase not configured yet — site works in guest mode
    console.warn('Firebase not configured. Running in guest mode.');
    firebaseReady = false;
  }
}

function onUserSignedIn(user) {
  // Update nav
  const navUser = document.getElementById('navUser');
  const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
  navUser.innerHTML = `
    <div class="nav-user-pill" onclick="showPage('profile')">
      <div class="nav-user-avatar">${user.photoURL
        ? `<img src="${user.photoURL}" style="width:100%;height:100%;border-radius:50%;object-fit:cover" referrerpolicy="no-referrer">`
        : initial}</div>
      <span class="nav-user-name">${user.displayName || user.email.split('@')[0]}</span>
    </div>`;

  // Load prefs from localStorage (keyed by uid for multi-user)
  const savedPrefs = localStorage.getItem('rh_prefs_' + user.uid);
  if (savedPrefs) {
    userPrefs = JSON.parse(savedPrefs);
    buildPersonalizedSections();
  } else {
    // First time — show onboarding
    setTimeout(() => openPrefs(), 800);
  }

  // Show personalized sections
  document.getElementById('personalizedSection').style.display = '';
  buildPersonalizedSections();
  buildRecentSection();

  showToast(`Welcome back, ${user.displayName || 'Chef'}! 👋`);
}

function onUserSignedOut() {
  const navUser = document.getElementById('navUser');
  navUser.innerHTML = `<button class="btn-sign-in" onclick="openAuth()">Sign In</button>`;
  document.getElementById('personalizedSection').style.display = 'none';
  document.getElementById('recentSection').style.display = 'none';
  document.getElementById('becauseSection').style.display = 'none';
  userPrefs = null;
}

/* ══════════════════════════════════
   AUTH FUNCTIONS
══════════════════════════════════ */
function openAuth() {
  showAuthPanel('signin');
  document.getElementById('authOverlay').classList.add('open');
}
function closeAuth() {
  document.getElementById('authOverlay').classList.remove('open');
  clearAuthErrors();
}
function showAuthPanel(panel) {
  document.getElementById('authSignIn').classList.toggle('hidden', panel !== 'signin');
  document.getElementById('authRegister').classList.toggle('hidden', panel !== 'register');
  clearAuthErrors();
}
function clearAuthErrors() {
  document.getElementById('authError').textContent = '';
  document.getElementById('authErrorReg').textContent = '';
}

function signInWithGoogle() {
  if (!firebaseReady) {
    alert('Firebase is not configured yet. See the README for setup instructions.');
    return;
  }
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(() => closeAuth())
    .catch(err => {
      document.getElementById('authError').textContent = err.message;
    });
}

function signInEmail() {
  if (!firebaseReady) {
    // Guest mode: simulate sign-in with name from email
    const email = document.getElementById('signInEmail').value.trim();
    if (!email) { document.getElementById('authError').textContent = 'Please enter your email.'; return; }
    currentUser = { uid: 'guest_' + email, email, displayName: email.split('@')[0], photoURL: null };
    onUserSignedIn(currentUser);
    closeAuth();
    return;
  }
  const email    = document.getElementById('signInEmail').value.trim();
  const password = document.getElementById('signInPassword').value;
  if (!email || !password) {
    document.getElementById('authError').textContent = 'Please fill in all fields.';
    return;
  }
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => closeAuth())
    .catch(err => {
      document.getElementById('authError').textContent = err.message;
    });
}

function registerEmail() {
  if (!firebaseReady) {
    const email = document.getElementById('regEmail').value.trim();
    const name  = document.getElementById('regName').value.trim();
    if (!email || !name) { document.getElementById('authErrorReg').textContent = 'Please fill in all fields.'; return; }
    currentUser = { uid: 'guest_' + email, email, displayName: name, photoURL: null };
    onUserSignedIn(currentUser);
    closeAuth();
    openPrefs();
    return;
  }
  const name     = document.getElementById('regName').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  if (!name || !email || !password) {
    document.getElementById('authErrorReg').textContent = 'Please fill in all fields.';
    return;
  }
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(cred => cred.user.updateProfile({ displayName: name }))
    .then(() => { closeAuth(); openPrefs(); })
    .catch(err => {
      document.getElementById('authErrorReg').textContent = err.message;
    });
}

function signOut() {
  if (firebaseReady) {
    firebase.auth().signOut();
  } else {
    currentUser = null;
    onUserSignedOut();
  }
  showPage('home');
  showToast('Signed out. See you soon! 👋');
}

/* ══════════════════════════════════
   PREFERENCES
══════════════════════════════════ */
const _prefSelections = { cuisines: [], level: [], diet: [] };

function openPrefs() {
  // Reset selections
  _prefSelections.cuisines = userPrefs ? [...(userPrefs.cuisines || [])] : [];
  _prefSelections.level    = userPrefs ? [...(userPrefs.level    || [])] : [];
  _prefSelections.diet     = userPrefs ? [...(userPrefs.diet     || [])] : [];

  // Mark existing selections
  document.querySelectorAll('#prefCuisines .pref-chip').forEach(btn => {
    btn.classList.toggle('selected', _prefSelections.cuisines.includes(btn.dataset.val));
  });
  document.querySelectorAll('#prefLevel .pref-chip').forEach(btn => {
    btn.classList.toggle('selected', _prefSelections.level.includes(btn.dataset.val));
  });
  document.querySelectorAll('#prefDiet .pref-chip').forEach(btn => {
    btn.classList.toggle('selected', _prefSelections.diet.includes(btn.dataset.val));
  });

  // Bind toggles
  document.querySelectorAll('#prefCuisines .pref-chip').forEach(btn => {
    btn.onclick = () => togglePrefChip(btn, _prefSelections.cuisines);
  });
  document.querySelectorAll('#prefLevel .pref-chip').forEach(btn => {
    btn.onclick = () => {
      // single select
      _prefSelections.level = [btn.dataset.val];
      document.querySelectorAll('#prefLevel .pref-chip').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    };
  });
  document.querySelectorAll('#prefDiet .pref-chip').forEach(btn => {
    btn.onclick = () => togglePrefChip(btn, _prefSelections.diet);
  });

  // Show step 1
  showPrefStep(1);
  document.getElementById('prefOverlay').classList.add('open');
}

function togglePrefChip(btn, arr) {
  const val = btn.dataset.val;
  const idx = arr.indexOf(val);
  if (idx === -1) { arr.push(val); btn.classList.add('selected'); }
  else            { arr.splice(idx, 1); btn.classList.remove('selected'); }
}

function showPrefStep(n) {
  [1, 2, 3].forEach(i => {
    document.getElementById('prefStep' + i).classList.toggle('hidden', i !== n);
    document.getElementById('pdot' + i).classList.toggle('active', i === n);
  });
}

function prefNext(step) {
  showPrefStep(step + 1);
}

function prefDone() {
  userPrefs = {
    cuisines: _prefSelections.cuisines,
    level:    _prefSelections.level,
    diet:     _prefSelections.diet,
  };
  if (currentUser) {
    localStorage.setItem('rh_prefs_' + currentUser.uid, JSON.stringify(userPrefs));
  }
  document.getElementById('prefOverlay').classList.remove('open');
  buildPersonalizedSections();
  showToast('✅ Preferences saved! Your feed is personalised.');
}

/* ══════════════════════════════════
   NETFLIX-STYLE RECOMMENDATION ENGINE
══════════════════════════════════ */
function scoreMealForUser(meal) {
  let score = 0;

  if (!userPrefs) return score;

  // Cuisine match
  if (userPrefs.cuisines && userPrefs.cuisines.includes(meal.cuisine)) score += 5;

  // Difficulty match
  if (userPrefs.level && userPrefs.level.includes(meal.diff)) score += 4;

  // Diet/tag match
  if (userPrefs.diet) {
    userPrefs.diet.forEach(d => {
      if (meal.tags.includes(d)) score += 3;
    });
  }

  // Boost for trending
  if (meal.trending) score += 1;

  // Boost for featured
  if (meal.featured) score += 1;

  // Penalise already viewed (show fresh stuff)
  if (viewHistory.includes(meal.id)) score -= 2;

  return score;
}

function getRecommended(count = 10, excludeIds = []) {
  return [...MEALS]
    .filter(m => !excludeIds.includes(m.id))
    .map(m => ({ ...m, _score: scoreMealForUser(m) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, count);
}

function getBecauseYouLiked() {
  // Find the most recently viewed/favourited meal and return similar
  const seedId = favourites[0] || viewHistory[0];
  if (!seedId) return null;
  const seed = MEALS.find(m => m.id === seedId);
  if (!seed) return null;

  const similar = MEALS
    .filter(m => m.id !== seed.id && (m.cuisine === seed.cuisine || m.diff === seed.diff))
    .slice(0, 8);

  return { seed, meals: similar };
}

function buildPersonalizedSections() {
  if (!currentUser) return;

  // Main personalized row
  const row = document.getElementById('personalizedRow');
  row.innerHTML = '';
  const recs = getRecommended(12);

  if (userPrefs && userPrefs.cuisines && userPrefs.cuisines.length > 0) {
    document.getElementById('personalizedLabel').textContent = '✨ Just for You';
    document.getElementById('personalizedTitle').textContent =
      'Recommended: ' + userPrefs.cuisines.slice(0, 2).join(' & ');
  }

  recs.forEach(m => row.appendChild(buildCard(m)));

  // "Because you liked" row
  const because = getBecauseYouLiked();
  if (because && because.meals.length > 0) {
    document.getElementById('becauseSection').style.display = '';
    document.getElementById('becauseTitle').textContent =
      `Because you liked "${because.seed.name}"`;
    const becauseRow = document.getElementById('becauseRow');
    becauseRow.innerHTML = '';
    because.meals.forEach(m => becauseRow.appendChild(buildCard(m)));
  }
}

function buildRecentSection() {
  if (!currentUser || viewHistory.length === 0) return;
  document.getElementById('recentSection').style.display = '';
  const row = document.getElementById('recentRow');
  row.innerHTML = '';
  viewHistory.slice(0, 10).forEach(id => {
    const meal = MEALS.find(m => m.id === id);
    if (meal) row.appendChild(buildCard(meal));
  });
}

/* Track a meal view for recommendations */
function trackView(mealId) {
  viewHistory = viewHistory.filter(id => id !== mealId);
  viewHistory.unshift(mealId);
  if (viewHistory.length > 50) viewHistory = viewHistory.slice(0, 50);
  localStorage.setItem('rh_history', JSON.stringify(viewHistory));
}

/* ══════════════════════════════════
   INIT
══════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  initFirebase();
  buildHeroSlides();
  buildHeroTags();
  buildFeatured();
  buildTrending();
  buildCuisineGrid();
  buildBeginners();
  buildQuick();
  buildBudget();
  buildNewRow();
  buildBrowseGrid();
  buildTrendingPage();
  buildAISuggestions();
  updateFavCount();
  startHeroRotation();

  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
  });
  document.getElementById('navbar').classList.add('scrolled');
});

/* ══════════════════════════════════
   PAGES
══════════════════════════════════ */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  if (page) page.classList.add('active');
  const link = document.querySelector(`.nav-link[data-page="${name}"]`);
  if (link) link.classList.add('active');
  window.scrollTo(0, 0);
  if (name === 'favourites') buildFavsPage();
  if (name === 'profile')    buildProfilePage();
}

/* ══════════════════════════════════
   HERO
══════════════════════════════════ */
function buildHeroSlides() {
  const container = document.getElementById('heroSlides');
  HERO_IMAGES.forEach((url, i) => {
    const d = document.createElement('div');
    d.className = 'hero-slide' + (i === 0 ? ' active' : '');
    d.style.backgroundImage = `url(${url})`;
    container.appendChild(d);
  });
}
function startHeroRotation() {
  setInterval(() => {
    const slides = document.querySelectorAll('.hero-slide');
    slides[bgIndex].classList.remove('active');
    bgIndex = (bgIndex + 1) % slides.length;
    slides[bgIndex].classList.add('active');
  }, 6000);
}
function buildHeroTags() {
  const container = document.getElementById('heroQuickTags');
  HERO_TAGS.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'hero-quick-tag';
    btn.textContent = tag;
    const ingredient = tag.replace(/^[^\s]+\s/, '').toLowerCase();
    btn.onclick = () => {
      document.getElementById('globalSearch').value = ingredient;
      toggleSearch(true);
      liveSearch(ingredient);
    };
    container.appendChild(btn);
  });
}

/* ══════════════════════════════════
   CARD BUILDER
══════════════════════════════════ */
function buildCard(meal) {
  const isFaved = favourites.includes(meal.id);
  const diff = meal.diff;
  const diffLabel = diff === 'beginner' ? '🟢 Beginner' : diff === 'intermediate' ? '🟡 Intermediate' : '🔴 Pro';
  const cuisine = CUISINES[meal.cuisine] || {};
  const card = document.createElement('div');
  card.className = 'recipe-card';
  card.innerHTML = `
    <div class="card-img-wrap">
      ${meal.img
        ? `<img class="card-img" src="${meal.img}" alt="${meal.name}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=card-emoji-fallback>${meal.emoji}</div>'">`
        : `<div class="card-emoji-fallback">${meal.emoji}</div>`}
      <div class="card-diff-badge diff-${diff}">${diffLabel}</div>
      <button class="card-fav-btn ${isFaved ? 'faved' : ''}" onclick="event.stopPropagation();toggleFav(${meal.id},this)" title="${isFaved ? 'Remove' : 'Save'}">
        ${isFaved ? '❤️' : '🤍'}
      </button>
    </div>
    <div class="card-body">
      <div class="card-origin">${cuisine.flag || '🌍'} ${meal.cuisine}</div>
      <div class="card-name">${meal.name}</div>
      <div class="card-meta">
        <span class="card-meta-item">⏱ ${meal.time}</span>
        <span class="card-meta-item cost">💰 ${meal.cost}</span>
      </div>
    </div>`;
  card.onclick = () => openMeal(meal.id);
  return card;
}

/* ══════════════════════════════════
   HOME SECTIONS
   These all read from MEALS directly
   — when Chief adds recipes, they
   automatically appear here.
══════════════════════════════════ */
function buildFeatured() {
  const row = document.getElementById('featuredRow');
  MEALS.filter(m => m.featured).forEach(m => row.appendChild(buildCard(m)));
}
function buildTrending() {
  const row = document.getElementById('trendingRow');
  MEALS.filter(m => m.trending).slice(0, 8).forEach(m => row.appendChild(buildCard(m)));
}
function buildBeginners() {
  const row = document.getElementById('beginnerRow');
  MEALS.filter(m => m.diff === 'beginner').slice(0, 8).forEach(m => row.appendChild(buildCard(m)));
}
function buildQuick() {
  const row = document.getElementById('quickRow');
  MEALS.filter(m => m.tags.includes('quick')).slice(0, 8).forEach(m => row.appendChild(buildCard(m)));
}
function buildBudget() {
  const row = document.getElementById('budgetRow');
  MEALS.filter(m => m.tags.includes('budget')).slice(0, 8).forEach(m => row.appendChild(buildCard(m)));
}
function buildNewRow() {
  // "Newly Added" — last 8 recipes by id (highest ids = newest from Chief)
  const row = document.getElementById('newRow');
  [...MEALS].sort((a, b) => b.id - a.id).slice(0, 8).forEach(m => row.appendChild(buildCard(m)));
}
function buildCuisineGrid() {
  const grid = document.getElementById('cuisineGrid');
  CUISINE_LIST.forEach(c => {
    const card = document.createElement('div');
    card.className = 'cuisine-card';
    card.innerHTML = `
      <img class="cuisine-img" src="${c.img}" alt="${c.name}" loading="lazy" onerror="this.style.display='none'">
      <div class="cuisine-overlay"></div>
      <div class="cuisine-label">${c.name}</div>
      <div class="cuisine-emoji">${c.emoji}</div>`;
    card.onclick = () => { setBrowseFilter('cuisine:' + c.name, null); showPage('browse'); };
    grid.appendChild(card);
  });
}

/* ══════════════════════════════════
   BROWSE PAGE
══════════════════════════════════ */
function buildBrowseGrid() {
  const grid = document.getElementById('browseGrid');
  grid.innerHTML = '';
  const filtered = getFilteredMeals();
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><h3>No results</h3><p>Try a different filter.</p></div>';
    return;
  }
  filtered.forEach(m => grid.appendChild(buildCard(m)));
}
function getFilteredMeals() {
  if (browseFilter === 'all') return MEALS;
  const [type, val] = browseFilter.split(':');
  if (type === 'cuisine') return MEALS.filter(m => m.cuisine === val);
  if (type === 'diff')    return MEALS.filter(m => m.diff === val);
  if (type === 'tag')     return MEALS.filter(m => m.tags.includes(val));
  return MEALS;
}
function setBrowseFilter(filter, el) {
  browseFilter = filter;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  buildBrowseGrid();
}
function filterBrowse(tag) {
  showPage('browse');
  setTimeout(() => {
    const chip = document.querySelector(`.filter-chip[data-filter="tag:${tag}"]`);
    setBrowseFilter('tag:' + tag, chip);
  }, 50);
}

/* ══════════════════════════════════
   TRENDING PAGE
══════════════════════════════════ */
function buildTrendingPage() {
  const container = document.getElementById('trendingRanked');
  const ranked = [...MEALS].sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
  ranked.forEach((meal, i) => {
    const cuisine = CUISINES[meal.cuisine] || {};
    const item = document.createElement('div');
    item.className = 'trending-item';
    item.innerHTML = `
      <div class="trending-rank">${i + 1}</div>
      <div class="trending-thumb">
        ${meal.img ? `<img src="${meal.img}" alt="${meal.name}" loading="lazy" onerror="this.parentElement.innerHTML='${meal.emoji}'">` : meal.emoji}
      </div>
      <div class="trending-info">
        <div class="trending-name">${meal.name}</div>
        <div class="trending-meta">
          <span>${cuisine.flag || '🌍'} ${meal.cuisine}</span>
          <span>⏱ ${meal.time}</span>
          <span class="cost">💰 ${meal.cost}</span>
          <span>📊 ${meal.diff.charAt(0).toUpperCase() + meal.diff.slice(1)}</span>
        </div>
      </div>
      <div class="trending-badge">${meal.trending ? '<span class="trending-fire">🔥</span>' : ''}</div>`;
    item.onclick = () => openMeal(meal.id);
    container.appendChild(item);
  });
}

/* ══════════════════════════════════
   FAVOURITES
══════════════════════════════════ */
function toggleFav(id, btn) {
  const idx = favourites.indexOf(id);
  if (idx === -1) {
    favourites.push(id);
    if (btn) { btn.classList.add('faved'); btn.textContent = '❤️'; }
    showToast('❤️ Added to favourites');
  } else {
    favourites.splice(idx, 1);
    if (btn) { btn.classList.remove('faved'); btn.textContent = '🤍'; }
    showToast('Removed from favourites');
  }
  localStorage.setItem('rh_favs', JSON.stringify(favourites));
  updateFavCount();
  // Sync all buttons for this id
  document.querySelectorAll('.card-fav-btn').forEach(b => {
    if (b.getAttribute('onclick') && b.getAttribute('onclick').includes(`toggleFav(${id},`)) {
      b.classList.toggle('faved', favourites.includes(id));
      b.textContent = favourites.includes(id) ? '❤️' : '🤍';
    }
  });
  // Refresh recommendations if signed in
  if (currentUser) buildPersonalizedSections();
}
function updateFavCount() {
  const el = document.getElementById('favCount');
  el.textContent = favourites.length;
  el.style.display = favourites.length > 0 ? 'flex' : 'none';
}
function buildFavsPage() {
  const grid = document.getElementById('favsGrid');
  grid.innerHTML = '';
  const favMeals = MEALS.filter(m => favourites.includes(m.id));
  if (favMeals.length === 0) {
    grid.innerHTML = `<div class="empty-state">
      <div class="empty-icon">🍽️</div>
      <h3>No favourites yet</h3>
      <p>Tap the heart ❤️ on any recipe to save it here.</p>
      <button class="btn-primary" onclick="showPage('browse')">Browse Recipes</button>
    </div>`;
    return;
  }
  favMeals.forEach(m => grid.appendChild(buildCard(m)));
}
function toggleFavModal() {
  if (!currentMeal) return;
  const btn = document.getElementById('modalFavBtn');
  const isFaved = favourites.includes(currentMeal.id);
  if (isFaved) {
    favourites = favourites.filter(id => id !== currentMeal.id);
    btn.classList.remove('faved'); btn.textContent = '🤍';
    showToast('Removed from favourites');
  } else {
    favourites.push(currentMeal.id);
    btn.classList.add('faved'); btn.textContent = '❤️';
    showToast('❤️ Added to favourites');
  }
  localStorage.setItem('rh_favs', JSON.stringify(favourites));
  updateFavCount();
}

/* ══════════════════════════════════
   PROFILE PAGE
══════════════════════════════════ */
function buildProfilePage() {
  if (!currentUser) {
    document.getElementById('profileName').textContent  = 'Guest';
    document.getElementById('profileEmail').textContent = 'Not signed in';
    document.getElementById('profileAvatar').textContent = '?';
    document.getElementById('statFavs').textContent     = 0;
    document.getElementById('statViewed').textContent   = 0;
    document.getElementById('statCuisines').textContent = 0;
    return;
  }

  const initial = (currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase();
  const avatarEl = document.getElementById('profileAvatar');
  if (currentUser.photoURL) {
    avatarEl.innerHTML = `<img src="${currentUser.photoURL}" style="width:100%;height:100%;border-radius:50%;object-fit:cover" referrerpolicy="no-referrer">`;
  } else {
    avatarEl.textContent = initial;
  }

  document.getElementById('profileName').textContent  = currentUser.displayName || currentUser.email.split('@')[0];
  document.getElementById('profileEmail').textContent = currentUser.email || '';

  // Stats
  const cuisinesSeen = [...new Set(viewHistory.map(id => {
    const m = MEALS.find(x => x.id === id);
    return m ? m.cuisine : null;
  }).filter(Boolean))];

  document.getElementById('statFavs').textContent     = favourites.length;
  document.getElementById('statViewed').textContent   = viewHistory.length;
  document.getElementById('statCuisines').textContent = cuisinesSeen.length;

  // Preferences display
  if (userPrefs) {
    const wrap = document.getElementById('profilePrefsDisplay');
    const all  = [
      ...(userPrefs.cuisines || []),
      ...(userPrefs.level    || []),
      ...(userPrefs.diet     || []),
    ];
    wrap.innerHTML = `
      <div class="pref-display-title">Your Preferences</div>
      <div class="pref-tags-wrap">
        ${all.map(p => `<span class="pref-tag">${p}</span>`).join('')}
      </div>`;
  }
}

/* ══════════════════════════════════
   MEAL MODAL
══════════════════════════════════ */
function openMeal(id) {
  const meal = MEALS.find(m => m.id === id);
  if (!meal) return;
  currentMeal = meal;
  trackView(id);

  const cuisine = CUISINES[meal.cuisine] || {};

  // Hero
  const hero = document.getElementById('modalHero');
  hero.innerHTML = meal.img
    ? `<img src="${meal.img}" alt="${meal.name}" onerror="this.parentElement.innerHTML='<div class=modal-hero-emoji>${meal.emoji}</div>'"><div class="modal-hero-gradient"></div>`
    : `<div class="modal-hero-emoji">${meal.emoji}</div><div class="modal-hero-gradient"></div>`;

  // Origin banner
  document.getElementById('originBanner').innerHTML = `
    <span class="origin-flag">${cuisine.flag || '🌍'}</span>
    <span class="origin-text">
      <strong>Origin: ${cuisine.origin || meal.cuisine}</strong><br>
      ${cuisine.background || ''}
    </span>`;

  const diffLabel = meal.diff === 'beginner' ? '🟢 Beginner' : meal.diff === 'intermediate' ? '🟡 Intermediate' : '🔴 Pro Chef';
  document.getElementById('modalCuisine').textContent = meal.cuisine.toUpperCase();
  document.getElementById('modalTitle').textContent   = meal.name;
  document.getElementById('modalDesc').textContent    = meal.description;
  document.getElementById('modalMeta').innerHTML = `
    <span class="modal-meta-item"><span class="diff-badge diff-${meal.diff}">${diffLabel}</span></span>
    <span class="modal-meta-item">⏱ ${meal.time}</span>
    <span class="modal-meta-item cost">💰 ${meal.cost}</span>`;

  const isFaved = favourites.includes(meal.id);
  const favBtn  = document.getElementById('modalFavBtn');
  favBtn.textContent = isFaved ? '❤️' : '🤍';
  favBtn.classList.toggle('faved', isFaved);

  // Tab 0: Ingredients
  document.getElementById('mtab0').innerHTML = `
    <div class="ingredients-grid">
      ${meal.ingredients.map(i => `<div class="ingredient-item"><span class="ingredient-dot"></span>${i}</div>`).join('')}
    </div>`;

  // Tab 1: Steps
  document.getElementById('mtab1').innerHTML = `
    <ul class="steps-list">
      ${meal.steps.map(s => `<li class="step-item"><div class="step-num"></div><div class="step-text">${s}</div></li>`).join('')}
    </ul>`;

  // Tab 2: Alternatives
  document.getElementById('mtab2').innerHTML = `
    <div class="alt-block"><h4>🔥 No Oven?</h4><p>${meal.noOven}</p></div>
    <div class="alt-block"><h4>🍳 No Stovetop?</h4><p>${meal.noStove}</p></div>
    <div class="alt-block"><h4>💡 Budget Substitutions</h4><p>${(meal.subs || []).map(s => `• ${s}`).join('<br/>')}</p></div>`;

  // Tab 3: Reviews
  buildReviews(meal);

  // Reset tabs
  document.querySelectorAll('.mtab').forEach((t, i) => t.classList.toggle('active', i === 0));
  document.querySelectorAll('.modal-tab-panel').forEach((p, i) => p.classList.toggle('active', i === 0));

  buildSimilar(meal);

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Refresh "because you liked" and recent row
  if (currentUser) {
    buildRecentSection();
    buildPersonalizedSections();
  }
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  currentMeal = null;
}
function switchModalTab(idx, btn) {
  document.querySelectorAll('.mtab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.modal-tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('mtab' + idx).classList.add('active');
  if (idx === 3) buildReviews(currentMeal);
}
function buildSimilar(meal) {
  const strip   = document.getElementById('similarStrip');
  const similar = MEALS.filter(m => m.id !== meal.id && (m.cuisine === meal.cuisine || m.diff === meal.diff)).slice(0, 8);
  strip.innerHTML = '';
  similar.forEach(m => {
    const card = document.createElement('div');
    card.className = 'similar-mini';
    card.innerHTML = `
      <div class="mini-img">
        ${m.img ? `<img src="${m.img}" alt="${m.name}" loading="lazy" onerror="this.parentElement.innerHTML='${m.emoji}'">` : m.emoji}
      </div>
      <div class="mini-name">${m.name}</div>`;
    card.onclick = () => openMeal(m.id);
    strip.appendChild(card);
  });
}

/* ══════════════════════════════════
   REVIEWS
══════════════════════════════════ */
function buildReviews(meal) {
  currentStars = 0;
  const stored = reviewStore[meal.id] || [];
  const all    = [...(meal.reviews || []), ...stored];
  const panel  = document.getElementById('mtab3');
  panel.innerHTML = `
    <div class="review-form-box">
      <h4>Leave a Review</h4>
      <div class="stars-picker" id="starsPicker">
        ${[1,2,3,4,5].map(n => `<button class="star-pick-btn" data-star="${n}" onclick="pickStar(${n})">★</button>`).join('')}
      </div>
      <textarea id="reviewText" placeholder="Share your experience with this recipe…"></textarea>
      <button class="btn-submit-review" onclick="submitReview()">Post Review</button>
    </div>
    <div class="review-list" id="reviewList">
      ${all.length === 0 ? '<p style="color:var(--grey-mid);font-size:.87rem">No reviews yet. Be the first!</p>' : ''}
      ${all.map(r => renderReview(r)).join('')}
    </div>`;
}
function renderReview(r) {
  const stars = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
  return `<div class="review-item">
    <div class="review-header">
      <div class="review-avatar">${r.name.charAt(0).toUpperCase()}</div>
      <div class="review-name">${r.name}</div>
      <div class="review-stars">${stars}</div>
    </div>
    <div class="review-text">${r.text}</div>
  </div>`;
}
function pickStar(n) {
  currentStars = n;
  document.querySelectorAll('.star-pick-btn').forEach((b, i) => {
    b.classList.toggle('lit', i < n);
  });
}
function submitReview() {
  if (!currentMeal) return;
  const text = document.getElementById('reviewText').value.trim();
  if (!text)         { showToast('Write something first!'); return; }
  if (!currentStars) { showToast('Pick a star rating!'); return; }

  const name = currentUser
    ? (currentUser.displayName || currentUser.email.split('@')[0])
    : 'Anonymous';

  const review = { name, stars: currentStars, text };
  if (!reviewStore[currentMeal.id]) reviewStore[currentMeal.id] = [];
  reviewStore[currentMeal.id].push(review);
  localStorage.setItem('rh_reviews', JSON.stringify(reviewStore));
  buildReviews(currentMeal);
  showToast('✅ Review posted!');
}

/* ══════════════════════════════════
   SEARCH
══════════════════════════════════ */
function toggleSearch(forceOpen) {
  const dd     = document.getElementById('searchDropdown');
  const isOpen = dd.classList.contains('open');
  if (forceOpen || !isOpen) {
    dd.classList.add('open');
    setTimeout(() => document.getElementById('globalSearch').focus(), 100);
  } else {
    dd.classList.remove('open');
  }
}
function clearSearch() {
  document.getElementById('globalSearch').value = '';
  document.getElementById('searchResults').innerHTML = '';
  document.getElementById('searchDropdown').classList.remove('open');
}
function liveSearch(query) {
  const results = document.getElementById('searchResults');
  if (!query.trim()) { results.innerHTML = ''; return; }
  const terms = query.toLowerCase().split(/[\s,]+/).filter(Boolean);
  const found = MEALS.filter(meal => {
    const hay = (meal.name + ' ' + meal.cuisine + ' ' + meal.ingredients.join(' ') + ' ' + meal.tags.join(' ')).toLowerCase();
    return terms.some(t => hay.includes(t));
  });
  if (found.length === 0) {
    results.innerHTML = '<div style="padding:12px;color:var(--grey-mid);font-size:.85rem">No recipes found for that search.</div>';
    return;
  }
  results.innerHTML = '';
  found.forEach(meal => {
    const item = document.createElement('div');
    item.className = 'search-result-item';
    const cuisine = CUISINES[meal.cuisine] || {};
    item.innerHTML = `
      <div class="search-result-thumb">
        ${meal.img ? `<img src="${meal.img}" alt="${meal.name}" onerror="this.parentElement.innerHTML='${meal.emoji}'">` : meal.emoji}
      </div>
      <div class="search-result-info">
        <div class="sr-name">${meal.name}</div>
        <div class="sr-meta">${cuisine.flag || '🌍'} ${meal.cuisine} · ⏱ ${meal.time} · 💰 ${meal.cost}</div>
      </div>`;
    item.onclick = () => { clearSearch(); openMeal(meal.id); };
    results.appendChild(item);
  });
}
function closeSearch() {
  document.getElementById('searchDropdown').classList.remove('open');
}

/* ══════════════════════════════════
   AI HELPER
══════════════════════════════════ */
function buildAISuggestions() {
  const row = document.getElementById('aiSuggestionsRow');
  AI_SUGGESTIONS.forEach(sug => {
    const btn = document.createElement('button');
    btn.className = 'ai-sug-btn';
    btn.textContent = sug;
    btn.onclick = () => {
      document.getElementById('aiInput').value = sug;
      sendAI();
    };
    row.appendChild(btn);
  });
}

function sendAI() {
  const input = document.getElementById('aiInput');
  const query = input.value.trim();
  if (!query) return;
  input.value = '';
  appendMessage(query, 'user');
  const thinking = appendTyping();
  setTimeout(() => {
    thinking.remove();
    const response = generateAIResponse(query);
    appendMessage(response.text, 'ai', response.meals);
  }, 900 + Math.random() * 600);
}

function generateAIResponse(query) {
  const q = query.toLowerCase();
  let found = [];
  let text  = '';

  const wantBeginner     = /beginner|easy|simple|starter|new|first time/.test(q);
  const wantIntermediate = /intermediate|medium|moderate/.test(q);
  const wantPro          = /pro|advanced|expert|chef|hard/.test(q);
  const wantQuick        = /quick|fast|15 min|10 min|rush|hurry|busy/.test(q);
  const wantBudget       = /cheap|budget|afford|broke|student|under \$/.test(q);
  const cuisineMatch     = Object.keys(CUISINES).find(c => q.includes(c.toLowerCase()));
  const ingredients      = ['eggs','rice','pasta','chicken','garlic','cheese','potato','tomato','onion','bean','mushroom','beef','fish'];
  const foundIngredients = ingredients.filter(i => q.includes(i));

  found = MEALS.filter(m => {
    let score = 0;
    if (wantBeginner     && m.diff === 'beginner')     score += 3;
    if (wantIntermediate && m.diff === 'intermediate') score += 3;
    if (wantPro          && m.diff === 'pro')          score += 3;
    if (wantQuick        && m.tags.includes('quick'))  score += 2;
    if (wantBudget       && m.tags.includes('budget')) score += 2;
    if (cuisineMatch     && m.cuisine === cuisineMatch) score += 4;
    foundIngredients.forEach(ing => {
      if ((m.ingredients.join(' ') + m.name).toLowerCase().includes(ing)) score += 3;
    });
    const nameWords = q.split(/\s+/);
    nameWords.forEach(w => { if (w.length > 3 && m.name.toLowerCase().includes(w)) score += 2; });

    // Boost for user preferences
    if (userPrefs) {
      score += scoreMealForUser(m) * 0.5;
    }

    m._score = score;
    return score > 0;
  });

  found.sort((a, b) => b._score - a._score);
  found = found.slice(0, 4);

  if (found.length > 0) {
    const parts = [];
    if (foundIngredients.length > 0) parts.push(`you have **${foundIngredients.join(', ')}**`);
    if (cuisineMatch)     parts.push(`${cuisineMatch} cuisine`);
    if (wantBeginner)     parts.push('beginner level');
    if (wantPro)          parts.push('pro level');
    if (wantQuick)        parts.push('ready quickly');
    if (wantBudget)       parts.push('budget-friendly');
    text = parts.length > 0
      ? `Based on ${parts.join(' and ')}, here are my top picks for you:`
      : `Great choice! Here are the best matches I found:`;
  } else {
    found = MEALS.filter(m => m.diff === 'beginner').slice(0, 3);
    text  = `I couldn't find an exact match, but here are some great recipes to get you started. You can also browse by cuisine or difficulty!`;
  }

  return { text, meals: found };
}

function appendMessage(text, role, meals) {
  const win = document.getElementById('aiChatWindow');
  const msg = document.createElement('div');
  msg.className = `ai-message ${role}`;
  const avatarText = role === 'ai' ? '🤖' : (currentUser
    ? (currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()
    : '👤');

  let mealsHTML = '';
  if (meals && meals.length > 0) {
    mealsHTML = `<div class="ai-results-grid">${meals.map(m =>
      `<div class="ai-result-chip" onclick="openMeal(${m.id})">
        <span class="chip-emoji">${m.emoji}</span>
        <span>${m.name}</span>
      </div>`).join('')}</div>`;
  }

  msg.innerHTML = `
    <div class="ai-avatar">${avatarText}</div>
    <div class="ai-bubble">${text}${mealsHTML}</div>`;
  win.appendChild(msg);
  win.scrollTop = win.scrollHeight;
}

function appendTyping() {
  const win = document.getElementById('aiChatWindow');
  const msg = document.createElement('div');
  msg.className = 'ai-message ai ai-typing';
  msg.innerHTML = `
    <div class="ai-avatar">🤖</div>
    <div class="ai-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  win.appendChild(msg);
  win.scrollTop = win.scrollHeight;
  return msg;
}

/* ══════════════════════════════════
   TOAST
══════════════════════════════════ */
let toastTimer = null;
function showToast(message) {
  const t = document.getElementById('toast');
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ══════════════════════════════════
   KEYBOARD
══════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); clearSearch(); }
});
