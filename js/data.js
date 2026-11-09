/* ==========================================
   נתוני דמה עבור אולמות וספקים
   ========================================== */

const VENUES_DATA = [
    {
        id: 1,
        name: "אולמי גארדן שרון",
        region: "center",
        regionName: "מרכז",
        minGuests: 200,
        maxGuests: 600,
        pricePerPlate: 320,
        image: "🏰"
    },
    {
        id: 2,
        name: "אחוזת הנוף הצפוני",
        region: "north",
        regionName: "צפון",
        minGuests: 150,
        maxGuests: 450,
        pricePerPlate: 280,
        image: "🌿"
    },
    {
        id: 3,
        name: "צל החורש ירושלים",
        region: "jerusalem",
        regionName: "ירושלים",
        minGuests: 250,
        maxGuests: 800,
        pricePerPlate: 350,
        image: "🏛️"
    },
    {
        id: 4,
        name: "סאטורה אירועים בדרום",
        region: "south",
        regionName: "דרום",
        minGuests: 100,
        maxGuests: 400,
        pricePerPlate: 250,
        image: "🌴"
    }
];

const SUPPLIERS_DATA = [
    {
        id: 101,
        name: "סטודיו פלאש - צילום",
        category: "photography",
        categoryName: "צלם",
        price: 12000,
        rating: 4.9,
        image: "📷"
    },
    {
        id: 102,
        name: "DJ מקסימום - מוזיקה",
        category: "dj",
        categoryName: "DJ",
        price: 6500,
        rating: 4.8,
        image: "🎧"
    },
    {
        id: 103,
        name: "עיצובי פרחים שלזנגר",
        category: "design",
        categoryName: "עיצוב",
        price: 8500,
        rating: 4.7,
        image: "💐"
    },
    {
        id: 104,
        name: "קייטרינג טעמים מענגים",
        category: "catering",
        categoryName: "קייטרינג",
        price: 25000,
        rating: 5.0,
        image: "🍽️"
    }
];