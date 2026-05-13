const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cloudkitchen')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ Connection error:', err));

// 2. SCHEMAS & MODELS
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
});
const User = mongoose.model('User', userSchema);

const itemSchema = new mongoose.Schema({
    brand: String, name: String, price: Number, desc: String, 
    img: String, isVeg: Boolean, category: String
});
const Item = mongoose.model('Item', itemSchema);

const orderSchema = new mongoose.Schema({
    items: Array, brand: String, address: String, payment: String,
    userEmail: String, status: { type: String, default: 'Placed' },
    paymentStatus: { type: String, default: 'Pending' },
    deliveryBoy: { type: String, default: 'Assigning Partner...' }
}, { timestamps: true });
const Order = mongoose.model('Order', orderSchema);

const reviewSchema = new mongoose.Schema({
    userEmail: String, brand: String, rating: Number, comment: String
}, { timestamps: true });
const Review = mongoose.model('Review', reviewSchema);

// 3. FULL SEEDER
async function seedDB() {
    const count = await Item.countDocuments();
    if (count > 20) {
        console.log("🟢 Database is healthy. Skipping seeder to protect custom menus.");
        return; 
    }
    
    console.log("🧹 Seeding initial menu items...");
    await Item.deleteMany({});
    const manualMenu = [
        // 1. THE BURGER CLUB
        { brand: 'The Burger Club', name: 'Aloo Tikki Supreme', price: 129, category: 'Mains', desc: 'Crispy potato patty', isVeg: true, img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400' },
        { brand: 'The Burger Club', name: 'Cheese Melt', price: 189, category: 'Mains', desc: 'Loaded with cheddar', isVeg: true, img: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=400' },
        { brand: 'The Burger Club', name: 'Veggie Whopper', price: 249, category: 'Mains', desc: 'Flame-grilled patty', isVeg: true, img: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=400' },
        { brand: 'The Burger Club', name: 'Paneer Zinger', price: 219, category: 'Mains', desc: 'Spicy paneer fillet', isVeg: true, img: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=400' },
        { brand: 'The Burger Club', name: 'Peri Peri Fries', price: 99, category: 'Sides', desc: 'Spicy seasoned fries', isVeg: true, img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400' },
        { brand: 'The Burger Club', name: 'Onion Rings', price: 119, category: 'Sides', desc: 'Golden batter fried', isVeg: true, img: 'https://images.unsplash.com/photo-1639024471283-035188835118?w=400' },
        { brand: 'The Burger Club', name: 'Veggie Nuggets', price: 139, category: 'Sides', desc: 'Crispy bite-sized snacks', isVeg: true, img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400' },
        { brand: 'The Burger Club', name: 'Chocolate Shake', price: 149, category: 'Drinks', desc: 'Thick creamy cocoa', isVeg: true, img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400' },
        { brand: 'The Burger Club', name: 'Cold Coffee', price: 129, category: 'Drinks', desc: 'Blended with cream', isVeg: true, img: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=400' },
        { brand: 'The Burger Club', name: 'Virgin Mojito', price: 119, category: 'Drinks', desc: 'Mint and lemon fizz', isVeg: true, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400' },
        
        // 2. PASTA PALACE
        { brand: 'Pasta Palace', name: 'White Sauce Penne', price: 299, category: 'Mains', desc: 'Mushroom garlic sauce', isVeg: true, img: 'https://images.unsplash.com/photo-1645112481338-3562e999f5fc?w=400' },
        { brand: 'Pasta Palace', name: 'Red Sauce Fusilli', price: 279, category: 'Mains', desc: 'Tangy tomato sauce', isVeg: true, img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400' },
        { brand: 'Pasta Palace', name: 'Pink Sauce Pasta', price: 329, category: 'Mains', desc: 'Mixed cream and tomato', isVeg: true, img: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400' },
        { brand: 'Pasta Palace', name: 'Pesto Spaghetti', price: 349, category: 'Mains', desc: 'Fresh basil pesto', isVeg: true, img: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=400' },
        { brand: 'Pasta Palace', name: 'Garlic Bread', price: 149, category: 'Sides', desc: 'Buttery herb bread', isVeg: true, img: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400' },
        { brand: 'Pasta Palace', name: 'Cheese Sticks', price: 189, category: 'Sides', desc: 'Mozzarella filled', isVeg: true, img: 'https://images.unsplash.com/photo-1620374645310-f9d97e733268?w=400' },
        { brand: 'Pasta Palace', name: 'Bruschetta', price: 199, category: 'Sides', desc: 'Tomato basil topping', isVeg: true, img: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?w=400' },
        { brand: 'Pasta Palace', name: 'Lemon Iced Tea', price: 119, category: 'Drinks', desc: 'Refreshing brew', isVeg: true, img: 'https://images.unsplash.com/photo-1510626335562-ce97a31e133d?w=400' },
        { brand: 'Pasta Palace', name: 'Blue Soda', price: 139, category: 'Drinks', desc: 'Curacao fizz', isVeg: true, img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400' },
        { brand: 'Pasta Palace', name: 'Tiramisu', price: 249, category: 'Desserts', desc: 'Coffee dessert', isVeg: true, img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' },
        
        // 3. TACO TOWN
        { brand: 'Taco Town Veg', name: 'Paneer Soft Taco', price: 199, category: 'Mains', desc: 'Grilled paneer salsa', isVeg: true, img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400' },
        { brand: 'Taco Town Veg', name: 'Crunchy Corn Taco', price: 179, category: 'Mains', desc: 'Sweet corn filling', isVeg: true, img: 'https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?w=400' },
        { brand: 'Taco Town Veg', name: 'Veg Burrito Bowl', price: 299, category: 'Mains', desc: 'Rice, beans, fresh salsa', isVeg: true, img: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400' },
        { brand: 'Taco Town Veg', name: 'Cheesy Quesadilla', price: 229, category: 'Mains', desc: 'Folded cheesy tortilla', isVeg: true, img: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400' },
        { brand: 'Taco Town Veg', name: 'Nacho Supreme', price: 249, category: 'Sides', desc: 'Loaded with cheese dip', isVeg: true, img: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400' },
        { brand: 'Taco Town Veg', name: 'Mexican Wrap', price: 199, category: 'Sides', desc: 'Avocado and bean', isVeg: true, img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400' },
        { brand: 'Taco Town Veg', name: 'Guacamole Dip', price: 79, category: 'Sides', desc: 'Fresh avocado mash', isVeg: true, img: 'https://images.unsplash.com/photo-1522036667459-9b6d96f40a21?w=400' },
        { brand: 'Taco Town Veg', name: 'Churros', price: 179, category: 'Desserts', desc: 'Cinnamon sugar sticks', isVeg: true, img: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400' },
        { brand: 'Taco Town Veg', name: 'Enchiladas', price: 319, category: 'Mains', desc: 'Baked with gravy', isVeg: true, img: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400' },
        { brand: 'Taco Town Veg', name: 'Mexican Cooler', price: 129, category: 'Drinks', desc: 'Mint and lemon fizz', isVeg: true, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400' },
        
        // 4. PIZZA PEAK
        { brand: 'Pizza Peak', name: 'Margherita Classic', price: 249, category: 'Mains', desc: 'Fresh mozzarella basil', isVeg: true, img: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400' },
        { brand: 'Pizza Peak', name: 'Farmhouse Special', price: 349, category: 'Mains', desc: 'Capsicum, onion, corn', isVeg: true, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
        { brand: 'Pizza Peak', name: 'Paneer Makhani', price: 399, category: 'Mains', desc: 'Creamy gravy base', isVeg: true, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
        { brand: 'Pizza Peak', name: 'Veggie Paradise', price: 379, category: 'Mains', desc: 'Loaded with gold corn', isVeg: true, img: 'https://images.unsplash.com/photo-1571066811402-9b8e7788b201?w=400' },
        { brand: 'Pizza Peak', name: 'Mexican Pizza', price: 389, category: 'Mains', desc: 'Jalapeños red pepper', isVeg: true, img: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400' },
        { brand: 'Pizza Peak', name: 'Garlic Bread Cheese', price: 129, category: 'Sides', desc: 'Cheesy appetizers', isVeg: true, img: 'https://images.unsplash.com/photo-1620374645310-f9d97e733268?w=400' },
        { brand: 'Pizza Peak', name: 'Calzone Pocket', price: 199, category: 'Sides', desc: 'Folded pizza stuffing', isVeg: true, img: 'https://images.unsplash.com/photo-1628815474619-383dd3f18ec3?w=400' },
        { brand: 'Pizza Peak', name: 'Peppy Paneer', price: 359, category: 'Mains', desc: 'Crisp capsicum paneer', isVeg: true, img: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400' },
        { brand: 'Pizza Peak', name: 'Stuffed Crust', price: 99, category: 'Sides', desc: 'Extra cheese crust', isVeg: true, img: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400' },
        { brand: 'Pizza Peak', name: 'Coke Zero', price: 60, category: 'Drinks', desc: 'Refreshing drink', isVeg: true, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400' },
        
        // 5. SUSHI SUN
        { brand: 'Sushi Sun Veg', name: 'Avocado Nigiri', price: 399, category: 'Mains', desc: 'Hand-pressed rice', isVeg: true, img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400' },
        { brand: 'Sushi Sun Veg', name: 'Veg California', price: 449, category: 'Mains', desc: 'Cucumber and carrot', isVeg: true, img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400' },
        { brand: 'Sushi Sun Veg', name: 'Miso Soup', price: 149, category: 'Sides', desc: 'Japanese soybean', isVeg: true, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
        { brand: 'Sushi Sun Veg', name: 'Tempura Veggies', price: 299, category: 'Sides', desc: 'Crispy batter fried', isVeg: true, img: 'https://images.unsplash.com/photo-1598930230293-2372a639df1f?w=400' },
        { brand: 'Sushi Sun Veg', name: 'Edamame Beans', price: 199, category: 'Sides', desc: 'Steamed soybeans', isVeg: true, img: 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=400' },
        { brand: 'Sushi Sun Veg', name: 'Kappa Maki', price: 349, category: 'Mains', desc: 'Cucumber rolls', isVeg: true, img: 'https://images.unsplash.com/photo-1611143669185-af324757bb90?w=400' },
        { brand: 'Sushi Sun Veg', name: 'Tofu Ramen', price: 499, category: 'Mains', desc: 'Big bowl of ramen', isVeg: true, img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400' },
        { brand: 'Sushi Sun Veg', name: 'Wasabi Peas', price: 99, category: 'Sides', desc: 'Crunchy spicy snack', isVeg: true, img: 'https://images.unsplash.com/photo-1505253304499-671c55fb57fe?w=400' },
        { brand: 'Sushi Sun Veg', name: 'Matcha Tea', price: 179, category: 'Drinks', desc: 'Health drink', isVeg: true, img: 'https://images.unsplash.com/photo-1582793988951-9aed55099993?w=400' },
        { brand: 'Sushi Sun Veg', name: 'Mochi Ice Cream', price: 259, category: 'Desserts', desc: 'Sweet rice dough', isVeg: true, img: 'https://images.unsplash.com/photo-1563805042-df68a2430cd5?w=400' },
        
        // 6. DESSERT DASH
        { brand: 'Dessert Dash', name: 'Red Velvet Pastry', price: 149, category: 'Desserts', desc: 'Cream cheese icing', isVeg: true, img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400' },
        { brand: 'Dessert Dash', name: 'Choco Lava Cake', price: 129, category: 'Desserts', desc: 'Molten center cake', isVeg: true, img: 'https://images.unsplash.com/photo-1563805042-df68a2430cd5?w=400' },
        { brand: 'Dessert Dash', name: 'Cheesecake', price: 199, category: 'Desserts', desc: 'Baked NY style', isVeg: true, img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400' },
        { brand: 'Dessert Dash', name: 'Fruit Custard', price: 99, category: 'Sides', desc: 'Fresh seasonal fruits', isVeg: true, img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400' },
        { brand: 'Dessert Dash', name: 'Apple Pie', price: 179, category: 'Desserts', desc: 'Cinnamon apples', isVeg: true, img: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400' },
        { brand: 'Dessert Dash', name: 'Cupcake', price: 79, category: 'Sides', desc: 'Vanilla sponge', isVeg: true, img: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=400' },
        { brand: 'Dessert Dash', name: 'Brownie Sundae', price: 219, category: 'Desserts', desc: 'With vanilla scoop', isVeg: true, img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400' },
        { brand: 'Dessert Dash', name: 'Macarons Box', price: 349, category: 'Sides', desc: 'Assorted pieces', isVeg: true, img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400' },
        { brand: 'Dessert Dash', name: 'Mango Mousse', price: 159, category: 'Desserts', desc: 'Fluffy mousse', isVeg: true, img: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400' },
        { brand: 'Dessert Dash', name: 'Gulab Jamun', price: 69, category: 'Desserts', desc: 'Indian sweet', isVeg: true, img: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=400' },
        
        // 7. ROLL REBELS VEG
        { brand: 'Roll Rebels Veg', name: 'Paneer Tikka Roll', price: 159, category: 'Mains', desc: 'Spiced paneer wrap', isVeg: true, img: 'https://images.unsplash.com/photo-1662116765994-4e4473859345?w=400' },
        { brand: 'Roll Rebels Veg', name: 'Veg Roll', price: 119, category: 'Mains', desc: 'Mix veg filling', isVeg: true, img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400' },
        { brand: 'Roll Rebels Veg', name: 'Jalapeno Roll', price: 179, category: 'Mains', desc: 'Spicy cheesy roll', isVeg: true, img: 'https://images.unsplash.com/photo-1635360341703-99b386629731?w=400' },
        { brand: 'Roll Rebels Veg', name: 'Soya Roll', price: 149, category: 'Mains', desc: 'Tandoori chaap roll', isVeg: true, img: 'https://images.unsplash.com/photo-1585238341267-1cfec2046a55?w=400' },
        { brand: 'Roll Rebels Veg', name: 'Mushroom Roll', price: 169, category: 'Mains', desc: 'Garlic butter glaze', isVeg: true, img: 'https://images.unsplash.com/photo-1594911773658-0130629c8971?w=400' },
        { brand: 'Roll Rebels Veg', name: 'Aloo Patty Roll', price: 99, category: 'Mains', desc: 'Simple potato roll', isVeg: true, img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400' },
        { brand: 'Roll Rebels Veg', name: 'Mayo Corn Roll', price: 129, category: 'Mains', desc: 'Sweet corn mayo', isVeg: true, img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400' },
        { brand: 'Roll Rebels Veg', name: 'Schezwan Roll', price: 159, category: 'Mains', desc: 'Spicy kick roll', isVeg: true, img: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400' },
        { brand: 'Roll Rebels Veg', name: 'Cold Coffee', price: 119, category: 'Drinks', desc: 'Classic brew', isVeg: true, img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' },
        { brand: 'Roll Rebels Veg', name: 'Masala Fries', price: 89, category: 'Sides', desc: 'Spiced potato fries', isVeg: true, img: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400' },
        
        // 8. SOUTH STATION
        { brand: 'South Station', name: 'Masala Dosa', price: 149, category: 'Mains', desc: 'Crispy potato crepe', isVeg: true, img: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400' },
        { brand: 'South Station', name: 'Idli Sambhar', price: 99, category: 'Mains', desc: 'Steamed rice cakes', isVeg: true, img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400' },
        { brand: 'South Station', name: 'Medu Vada', price: 119, category: 'Sides', desc: 'Savory donuts', isVeg: true, img: 'https://images.unsplash.com/photo-1626132646529-5003375a9f1a?w=400' },
        { brand: 'South Station', name: 'Onion Uttapam', price: 169, category: 'Mains', desc: 'Thick onion pancake', isVeg: true, img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
        { brand: 'South Station', name: 'Paneer Dosa', price: 199, category: 'Mains', desc: 'Cheese dosa variant', isVeg: true, img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
        { brand: 'South Station', name: 'Lemon Rice', price: 179, category: 'Mains', desc: 'Zesty South Indian', isVeg: true, img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
        { brand: 'South Station', name: 'Upma', price: 129, category: 'Mains', desc: 'Semolina breakfast', isVeg: true, img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
        { brand: 'South Station', name: 'Paniyaram', price: 139, category: 'Sides', desc: 'Rice batter balls', isVeg: true, img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
        { brand: 'South Station', name: 'Filter Coffee', price: 89, category: 'Drinks', desc: 'Strong milky coffee', isVeg: true, img: 'https://images.unsplash.com/photo-1544145945-f904253d0c7b?w=400' },
        { brand: 'South Station', name: 'Extra Chutney', price: 49, category: 'Sides', desc: 'Traditional dip', isVeg: true, img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
        
        // 9. HEALTHY HARBOR
        { brand: 'Healthy Harbor', name: 'Quinoa Bowl', price: 349, category: 'Mains', desc: 'Healthy superfood', isVeg: true, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
        { brand: 'Healthy Harbor', name: 'Greek Salad', price: 299, category: 'Mains', desc: 'Feta and olive salad', isVeg: true, img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400' },
        { brand: 'Healthy Harbor', name: 'Fruit Platter', price: 249, category: 'Mains', desc: 'Seasonal fresh cuts', isVeg: true, img: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400' },
        { brand: 'Healthy Harbor', name: 'Smoothie', price: 199, category: 'Drinks', desc: 'Oats fruit blend', isVeg: true, img: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400' },
        { brand: 'Healthy Harbor', name: 'Tofu Wrap', price: 279, category: 'Mains', desc: 'Protein rich wrap', isVeg: true, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
        { brand: 'Healthy Harbor', name: 'Lentil Soup', price: 159, category: 'Sides', desc: 'Warm nutritious soup', isVeg: true, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
        { brand: 'Healthy Harbor', name: 'Sprouted Salad', price: 189, category: 'Mains', desc: 'Lemon pepper toss', isVeg: true, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
        { brand: 'Healthy Harbor', name: 'Avocado Toast', price: 399, category: 'Mains', desc: 'Creamy sourdough', isVeg: true, img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400' },
        { brand: 'Healthy Harbor', name: 'Green Juice', price: 149, category: 'Drinks', desc: 'Spinach apple detox', isVeg: true, img: 'https://images.unsplash.com/photo-1610970881699-44a558dc970b?w=400' },
        { brand: 'Healthy Harbor', name: 'Hummus Snack', price: 169, category: 'Sides', desc: 'Chickpea dip box', isVeg: true, img: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?w=400' },
        
        // 10. CURRY CORNER VEG
        { brand: 'Curry Corner Veg', name: 'Dal Makhani', price: 299, category: 'Mains', desc: 'Slow cooked lentils', isVeg: true, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
        { brand: 'Curry Corner Veg', name: 'Butter Paneer', price: 349, category: 'Mains', desc: 'Tomato cashew gravy', isVeg: true, img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400' },
        { brand: 'Curry Corner Veg', name: 'Mixed Veg', price: 279, category: 'Mains', desc: 'Seasonal vegetable mix', isVeg: true, img: 'https://images.unsplash.com/photo-1585937421612-7110c0d95d11?w=400' },
        { brand: 'Curry Corner Veg', name: 'Butter Naan', price: 69, category: 'Sides', desc: 'Clay oven bread', isVeg: true, img: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=400' },
        { brand: 'Curry Corner Veg', name: 'Jeera Rice', price: 199, category: 'Mains', desc: 'Cumin rice classic', isVeg: true, img: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc392?w=400' },
        { brand: 'Curry Corner Veg', name: 'Palak Paneer', price: 319, category: 'Mains', desc: 'Fresh spinach cottage', isVeg: true, img: 'https://images.unsplash.com/photo-1603894584115-f73f2ec0b2ad?w=400' },
        { brand: 'Curry Corner Veg', name: 'Paratha', price: 89, category: 'Sides', desc: 'Layered wheat bread', isVeg: true, img: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=400' },
        { brand: 'Curry Corner Veg', name: 'Malai Kofta', price: 389, category: 'Mains', desc: 'Paneer balls gravy', isVeg: true, img: 'https://images.unsplash.com/photo-1585937421612-7110c0d95d11?w=400' },
        { brand: 'Curry Corner Veg', name: 'Boondi Raita', price: 99, category: 'Sides', desc: 'Spiced yogurt', isVeg: true, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
        { brand: 'Curry Corner Veg', name: 'Gulab Jamun', price: 79, category: 'Desserts', desc: 'Warm sweet syrup', isVeg: true, img: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=400' },

        // 11. MUMBAI MASALA VEG
        { brand: 'Mumbai Masala Veg', name: 'Pav Bhaji', price: 149, category: 'Mains', desc: 'Spicy mashed veggies', isVeg: true, img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400' },
        { brand: 'Mumbai Masala Veg', name: 'Vada Pav', price: 89, category: 'Sides', desc: 'Mumbai street food classic', isVeg: true, img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
        { brand: 'Mumbai Masala Veg', name: 'Misal Pav', price: 129, category: 'Mains', desc: 'Spicy sprout curry', isVeg: true, img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },

        // 12. PURE COASTAL
        { brand: 'Pure Coastal', name: 'Veg Stew', price: 249, category: 'Mains', desc: 'Coconut milk curry', isVeg: true, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
        { brand: 'Pure Coastal', name: 'Appam', price: 119, category: 'Sides', desc: 'Rice pancake', isVeg: true, img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
        { brand: 'Pure Coastal', name: 'Avial', price: 199, category: 'Mains', desc: 'Mixed veg coconut dish', isVeg: true, img: 'https://images.unsplash.com/photo-1585937421612-7110c0d95d11?w=400' },

        // 13. VAPI VEGGIE
        { brand: 'Vapi Veggie', name: 'Gujarati Thali', price: 299, category: 'Mains', desc: 'Complete regional meal', isVeg: true, img: 'https://images.unsplash.com/photo-1585937421612-7110c0d95d11?w=400' },
        { brand: 'Vapi Veggie', name: 'Khaman Dhokla', price: 99, category: 'Sides', desc: 'Steamed gram flour snack', isVeg: true, img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
        { brand: 'Vapi Veggie', name: 'Thepla', price: 149, category: 'Mains', desc: 'Fenugreek flatbread', isVeg: true, img: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=400' },

        // 14. PANEER GRILL HOUSE
        { brand: 'Paneer Grill House', name: 'Paneer Tikka', price: 249, category: 'Mains', desc: 'Tandoor grilled cottage cheese', isVeg: true, img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400' },
        { brand: 'Paneer Grill House', name: 'Malai Tikka', price: 269, category: 'Mains', desc: 'Creamy marinated paneer', isVeg: true, img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400' },
        { brand: 'Paneer Grill House', name: 'Hariyali Paneer', price: 259, category: 'Mains', desc: 'Mint marinated paneer', isVeg: true, img: 'https://images.unsplash.com/photo-1603894584115-f73f2ec0b2ad?w=400' },

        // 15. WAFFLE WORLD
        { brand: 'Waffle World', name: 'Nutella Waffle', price: 189, category: 'Desserts', desc: 'Classic choco hazelnut', isVeg: true, img: 'https://images.unsplash.com/photo-1562329265-95a6d7a83440?w=400' },
        { brand: 'Waffle World', name: 'Berry Waffle', price: 219, category: 'Desserts', desc: 'Fresh strawberry compote', isVeg: true, img: 'https://images.unsplash.com/photo-1562329265-95a6d7a83440?w=400' },
        { brand: 'Waffle World', name: 'Maple Syrup Waffle', price: 149, category: 'Desserts', desc: 'Original butter maple', isVeg: true, img: 'https://images.unsplash.com/photo-1562329265-95a6d7a83440?w=400' },

        // 16. SILVASSA SPICE VEG
        { brand: 'Silvassa Spice Veg', name: 'Spicy Misal', price: 139, category: 'Mains', desc: 'Extra hot sprout curry', isVeg: true, img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
        { brand: 'Silvassa Spice Veg', name: 'Kanda Poha', price: 89, category: 'Sides', desc: 'Onion flattened rice', isVeg: true, img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
        { brand: 'Silvassa Spice Veg', name: 'Sabudana Khichdi', price: 119, category: 'Mains', desc: 'Sago pearl dish', isVeg: true, img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },

        // 17. GREEN TRIBAL
        { brand: 'Green Tribal', name: 'Millet Salad', price: 249, category: 'Mains', desc: 'Ancient grains bowl', isVeg: true, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
        { brand: 'Green Tribal', name: 'Bamboo Shoot Soup', price: 179, category: 'Sides', desc: 'Earthy clear broth', isVeg: true, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
        { brand: 'Green Tribal', name: 'Roots Stir Fry', price: 229, category: 'Mains', desc: 'Tuber vegetable mix', isVeg: true, img: 'https://images.unsplash.com/photo-1585937421612-7110c0d95d11?w=400' },

        // 18. THE BAKE SHOP
        { brand: 'The Bake Shop', name: 'Croissant', price: 129, category: 'Sides', desc: 'Buttery flaky pastry', isVeg: true, img: 'https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?w=400' },
        { brand: 'The Bake Shop', name: 'Choco Chip Cookie', price: 89, category: 'Desserts', desc: 'Oven fresh classic', isVeg: true, img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400' },
        { brand: 'The Bake Shop', name: 'Sourdough Loaf', price: 199, category: 'Sides', desc: 'Artisan bread', isVeg: true, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' }
    ];

    await Item.insertMany(manualMenu);
    console.log(`🌱 Successfully Seeded ${manualMenu.length} Items!`);
}
// ⚠️ RESTART TERMINAL (Ctrl+C -> node server.js) AFTER SAVING ⚠️
seedDB();

// 4. API ROUTES
app.post('/api/auth/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email, password: req.body.password });
    if (user) res.json({ success: true, isAdmin: user.isAdmin, userEmail: user.email });
    else res.status(401).json({ error: "Invalid credentials" });
});

app.post('/api/auth/signup', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });
        const user = new User({ email: req.body.email, password: req.body.password });
        await user.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to create user" });
    }
});

app.get('/api/search', async (req, res) => {
    const results = await Item.find({ name: { $regex: req.query.q, $options: 'i' } }).limit(15);
    res.json(results);
});

app.get('/api/menu/:brand', async (req, res) => {
    const safeBrandName = req.params.brand.trim(); 
    res.json(await Item.find({ brand: { $regex: new RegExp('^' + safeBrandName + '$', 'i') } }));
});

app.post('/api/menu/add', async (req, res) => {
    try {
        const itemData = req.body;
        itemData.brand = itemData.brand.trim(); 
        const newItem = new Item(itemData);
        await newItem.save();
        res.status(200).json({ success: true, item: newItem });
    } catch (err) { res.status(500).json({ error: "Failed to add item to menu." }); }
});

// 🟢 NEW: DELETE RESTAURANT
app.delete('/api/menu/brand/:brand', async (req, res) => {
    try {
        await Item.deleteMany({ brand: new RegExp('^' + req.params.brand.trim() + '$', 'i') });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: "Failed to delete brand" }); }
});

// 🟢 NEW: DELETE MENU ITEM
app.delete('/api/menu/item/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: "Failed to delete item" }); }
});

// 🟢 NEW: UPDATE MENU ITEM
app.patch('/api/menu/item/:id', async (req, res) => {
    try {
        await Item.findByIdAndUpdate(req.params.id, req.body);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: "Failed to update item" }); }
});

// ORDERS
app.post('/api/order', async (req, res) => {
    const order = new Order(req.body); 
    res.json(await order.save());
});

app.get('/api/user-orders/:email', async (req, res) => {
    res.json(await Order.find({ userEmail: req.params.email }).sort({ createdAt: -1 }));
});

app.get('/api/orders', async (req, res) => {
    try { const orders = await Order.find().sort({ createdAt: -1 }); res.json(orders); } 
    catch (err) { res.status(500).json({ error: "Failed to fetch orders" }); }
});

app.get('/api/order/:id', async (req, res) => { res.json(await Order.findById(req.params.id)); });

app.get('/api/admin/kitchen-load', async (req, res) => {
    try {
        const loadData = await Order.aggregate([
            { $match: { status: { $in: ['Placed', 'Preparing', 'Out for Delivery'] } } },
            { $group: { _id: "$brand", activeOrders: { $sum: 1 } } }
        ]);
        res.json(loadData);
    } catch (err) { res.status(500).json({ error: "Could not fetch load data" }); }
});

app.post('/api/reviews', async (req, res) => {
    const rev = new Review(req.body); await rev.save(); res.json({ success: true });
});

app.get('/api/admin/analysis', async (req, res) => {
    try {
        const analysis = await Review.aggregate([
            { $group: { _id: "$brand", avgRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
            { $sort: { avgRating: -1 } }
        ]);
        res.json(analysis);
    } catch (err) { res.status(500).json({ error: "Analysis failed" }); }
});

app.get('/api/delivery/available', async (req, res) => {
    const orders = await Order.find({ status: 'Ready', deliveryBoy: 'Assigning Partner...' });
    res.json(orders);
});

app.patch('/api/delivery/complete/:id', async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, { status: 'Delivered' });
    res.json({ success: true });
});

app.patch('/api/order/:id/:field', async (req, res) => {
    try {
        const { id, field } = req.params;
        const updatedOrder = await Order.findByIdAndUpdate(id, { [field]: req.body[field] }, { new: true });
        if (updatedOrder) res.json({ success: true });
        else res.status(404).json({ error: "Order not found" });
    } catch (err) { res.status(500).json({ error: "Server Error" }); }
});

app.delete('/api/reset/:type', async (req, res) => {
    if(req.params.type === 'orders') await Order.deleteMany({});
    else { await Item.deleteMany({}); await seedDB(); }
    res.json({ success: true });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on Port ${PORT}`));

// Export the Express API for Vercel
module.exports = app;