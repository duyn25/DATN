const express = require('express')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth/auth-routes');
const adminSpecRouter = require('./routes/admin/spec-route');
const adminCategoryRouter = require('./routes/admin/category-route');
const adminProductRouter = require('./routes/admin/product-route');
const adminOrderRouter = require("./routes/admin/order-routes");
const adminStatRouter = require("./routes/admin/stat-route");
const shopProductRouter = require("./routes/shop/product-route");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopCartRouter = require('./routes/shop/cart-routes');
const shopOrderRouter = require('./routes/shop/order-route');
const shopSearchRouter = require('./routes/shop/search-routes');
const commonFeatureRouter = require("./routes/common/feature-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopChatbotRouter = require("./routes/shop/chatbot-routes")

mongoose.connect('mongodb+srv://ngduytttb:ngduytttb@cluster0.mtfljp9.mongodb.net/'

).then(()=>console.log('MongoDB connected')).catch((error) => console.log(error));
;

const app = express()
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin : 'http://localhost:5173',
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders : [
            "Content-Type",
            'Authorization',
            "Cache-Control",
            'Expires',
            'Pragma'
        ],
        credentials: true
    })
);
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth',authRouter);
app.use('/api/admin/specification',adminSpecRouter);
app.use('/api/admin/category',adminCategoryRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use('/api/admin/product',adminProductRouter);
app.use('/api/admin/stat',adminStatRouter);
app.use("/api/shop/product", shopProductRouter);
app.use('/api/shop/cart',shopCartRouter);
app.use('/api/shop/order',shopOrderRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/chatbot", shopChatbotRouter);
app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/shop/review", shopReviewRouter);

app.listen(PORT, ()=>console.log(`Server is running on port ${PORT}`));