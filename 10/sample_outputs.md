# Sample Application Outputs

This document shows real example runs of the Product Filtering System with different user queries to demonstrate the AI-powered filtering capabilities.

## Sample Run 1: Books with Good Ratings and Affordable Prices

### User Input
```
🔍 Enter your product search preferences (or "quit" to exit):
Examples:
  - "I need electronics under $100 that are in stock"
  - "Show me fitness equipment with rating above 4.5"
  - "Find kitchen appliances under $50"
  - "I want books with good ratings and affordable prices"

Your search: I want books with good ratings and affordable prices
```

### Application Output
```
🔍 Processing your request...

📦 Filtered Products:
==================================================
1. Novel: The Great Adventure - $14.99, Rating: 4.3, ✅ In Stock
2. Programming Guide - $49.99, Rating: 4.7, ✅ In Stock
3. Cookbook: Easy Recipes - $24.99, Rating: 4.5, ✅ In Stock
4. History of Science - $39.99, Rating: 4.6, ✅ In Stock
5. Self-Help Guide - $19.99, Rating: 4.2, ✅ In Stock
6. Fantasy Novel - $9.99, Rating: 4.1, ✅ In Stock
7. Biography: An Inspiring Life - $29.99, Rating: 4.4, ✅ In Stock
8. Mystery Novel - $19.99, Rating: 4.3, ✅ In Stock
9. Children's Picture Book - $12.99, Rating: 4.5, ✅ In Stock
10. Science Fiction Novel - $17.99, Rating: 4.2, ✅ In Stock

💭 AI Reasoning:
The user requested books that are affordable and have good ratings. I filtered the 'Books' category for products with a rating of at least 4.1 and a price below $50, considering these as good ratings and affordable prices. All selected books are in stock and meet these criteria.
==================================================
```

---

## Sample Run 2: Men's Clothing Under $100

### User Input
```
🔍 Enter your product search preferences (or "quit" to exit):
Examples:
  - "I need electronics under $100 that are in stock"
  - "Show me fitness equipment with rating above 4.5"
  - "Find kitchen appliances under $50"
  - "I want books with good ratings and affordable prices"

Your search: I need a men hoodie or jacket under $100 and in stock
```

### Application Output
```
🔍 Processing your request...

📦 Filtered Products:
==================================================
1. Men's Hoodie - $34.99, Rating: 4.6, ✅ In Stock

💭 AI Reasoning:
The user requested a men's hoodie or jacket under $100 and in stock. Among the available products, 'Men's Hoodie' is in the Clothing category, specifically a men's item, priced below $100 ($34.99), and is currently in stock. The men's jacket available is out of stock, so it was excluded.
==================================================
```

---

## Sample Run 3: Electronics Under $100 (Example)

### User Input
```
🔍 Enter your product search preferences (or "quit" to exit):
Examples:
  - "I need electronics under $100 that are in stock"
  - "Show me fitness equipment with rating above 4.5"
  - "Find kitchen appliances under $50"
  - "I want books with good ratings and affordable prices"

Your search: I need electronics under $100 that are in stock
```

### Expected Application Output
```
🔍 Processing your request...

📦 Filtered Products:
==================================================
1. Wireless Headphones - $99.99, Rating: 4.5, ✅ In Stock
2. Bluetooth Speaker - $49.99, Rating: 4.4, ✅ In Stock
3. Gaming Mouse - $59.99, Rating: 4.3, ✅ In Stock
4. External Hard Drive - $89.99, Rating: 4.4, ✅ In Stock
5. Portable Charger - $29.99, Rating: 4.2, ✅ In Stock

💭 AI Reasoning:
I filtered the electronics category for products under $100 that are currently in stock. I found 5 products that meet your criteria: Wireless Headphones ($99.99), Bluetooth Speaker ($49.99), Gaming Mouse ($59.99), External Hard Drive ($89.99), and Portable Charger ($29.99). All of these products are in stock and have decent ratings ranging from 4.2 to 4.5.
==================================================
```

---

## Sample Run 4: High-Rated Fitness Equipment (Example)

### User Input
```
🔍 Enter your product search preferences (or "quit" to exit):
Examples:
  - "I need electronics under $100 that are in stock"
  - "Show me fitness equipment with rating above 4.5"
  - "Find kitchen appliances under $50"
  - "I want books with good ratings and affordable prices"

Your search: Show me fitness equipment with rating above 4.5
```

### Expected Application Output
```
🔍 Processing your request...

📦 Filtered Products:
==================================================
1. Dumbbell Set - $149.99, Rating: 4.7, ✅ In Stock
2. Exercise Bike - $499.99, Rating: 4.6, ✅ In Stock
3. Treadmill - $899.99, Rating: 4.6, ❌ Out of Stock

💭 AI Reasoning:
I searched through the fitness category for equipment with ratings above 4.5. I found 3 products that meet your criteria: Dumbbell Set with a 4.7 rating, Exercise Bike with a 4.6 rating, and Treadmill with a 4.6 rating. Note that the Treadmill is currently out of stock, but the other two items are available.
==================================================
```

---

## Sample Run 5: Application Exit

### User Input
```
🔍 Enter your product search preferences (or "quit" to exit):
Examples:
  - "I need electronics under $100 that are in stock"
  - "Show me fitness equipment with rating above 4.5"
  - "Find kitchen appliances under $50"
  - "I want books with good ratings and affordable prices"

Your search: quit
```

### Application Output
```
👋 Thank you for using the Product Search Tool!
```

---

## Key Features Demonstrated

### 1. Natural Language Processing
- The AI understands various phrasings and natural language patterns
- Handles complex queries with multiple criteria
- Interprets price ranges, rating thresholds, and category preferences
- Successfully processed "men hoodie or jacket" as a specific clothing search

### 2. Intelligent Filtering
- Combines multiple criteria (price, rating, category, stock status, gender-specific items)
- Provides logical reasoning for selections
- Handles edge cases where limited results are found
- Considers context like excluding out-of-stock items when availability is requested

### 3. Structured Output
- Consistent formatting with emojis and clear sections
- Price formatting with proper decimal places
- Stock status indicators (✅ In Stock / ❌ Out of Stock)
- Numbered lists for easy reference

### 4. AI Reasoning
- Explains the filtering logic used
- Provides context for why certain items were included or excluded
- Contextualizes results within the broader dataset
- Shows understanding of user intent (e.g., "affordable" and "good ratings")

### 5. User Experience
- Clear prompts and examples
- Interactive console interface
- Graceful exit functionality
- Helpful ongoing guidance

---

## Real-World Performance Notes

These actual runs demonstrate the application's ability to:
- **Handle natural language variations**: Successfully interpreted "men hoodie or jacket" and "books with good ratings and affordable prices"
- **Apply intelligent filtering**: The AI made reasonable assumptions about what constitutes "affordable" (under $50) and "good ratings" (4.1+)
- **Provide comprehensive results**: Found all 10 books in the database that met the criteria
- **Show contextual understanding**: Excluded out-of-stock items when user specified "in stock"
- **Deliver consistent user experience**: Maintained professional formatting and helpful reasoning explanations

The AI-powered filtering successfully demonstrates flexibility in understanding user intent while maintaining precision in applying the filtering criteria to the structured product dataset. 