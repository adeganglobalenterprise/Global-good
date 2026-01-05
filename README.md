# Global Finance Bank - International Banking Web Application

## 🏦 Overview

Global Finance Bank is a comprehensive, full-featured web-based banking application that provides international and local banking services, crypto wallet management, and card services. This application is designed to work seamlessly across desktop, tablet, and mobile devices.

## ✨ Key Features

### 🔐 Dual Authentication System
- **Admin Dashboard**: Full administrative control with password protection
- **Customer Portal**: Secure customer login and registration
- Admin credentials: `Username: admin`, `Password: admin123`

### 💰 Banking Services
- **Local Transfers**: Send money to local accounts (2% fee)
- **International Transfers**: SWIFT transfers worldwide (5% fee)
- **Bill Payments**: Pay utilities and services
- **Cash Deposits**: Deposit at any branch
- **Card Deposits**: Deposit using debit/credit cards
- **Gift Card Redemption**: Convert gift cards to account balance

### 💳 Card Management
- Issue debit and credit cards
- 10-digit account numbers
- £5,000 credit limit for credit cards
- Real-time card status tracking

### ⛏️ Crypto Mining Wallet
- **Automatic Mining**: Balance increases by £0.50 every 5 minutes when enabled
- **Toggle Switch**: Easy on/off control from admin dashboard
- **Wallet Address**: Set and manage crypto wallet addresses
- **Real-time Updates**: Balance updates automatically every 5 minutes
- **Transaction History**: Complete mining transaction logs
- **Auto-Withdrawal**: Configure automatic withdrawals when threshold is reached

### 📊 Database & Analytics
- **Customer Management**: View and manage all customer accounts
- **Transaction History**: Complete transaction logs with status tracking
- **Real-time Statistics**: Dashboard with key metrics
- **SMS Notifications**: Built-in SMS notification system

### 🌐 Responsive Design
- Mobile-friendly interface
- Tablet optimized
- Desktop enhanced experience
- Works offline with local storage

## 📁 Project Structure

```
/workspace/
├── index.html              # Main application file
├── style.css               # Styling and responsive design
├── script.js               # Core application logic
├── mining_wallet/          # Mining wallet directory
│   ├── wallet_config.json  # Mining wallet configuration
│   └── mining_manager.js   # Mining wallet management
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local storage enabled in browser
- JavaScript enabled

### Installation

1. **Clone or Download** the project files to your web server or local machine

2. **Open** `index.html` in your web browser

3. **Login** as Admin:
   - Username: `admin`
   - Password: `admin123`

4. **Register** as Customer:
   - Click "Register New Account" on the login page
   - Fill in required details (Passport number required)
   - Login with your credentials

## 🔧 Configuration

### Admin Dashboard Features

1. **Overview Tab**: View total customers, transactions, and mining balance

2. **Customers Tab**: View all registered customers with their details:
   - Account number
   - Balance
   - Credit limit
   - Passport information

3. **Transactions Tab**: Complete transaction history:
   - Date and time
   - Transaction type
   - Description
   - Amount
   - Status (pending, success, failed)

4. **Mining Wallet Tab**:
   - Toggle mining on/off
   - Set crypto wallet address
   - View mining balance
   - Monitor mining rate (£0.50/5min)

5. **Settings Tab**: View system configuration

### Customer Dashboard Features

1. **Overview**: View account balance, account number, and quick actions

2. **Transfer**: 
   - Local transfers (2% fee)
   - International transfers (5% fee)

3. **Deposit**:
   - Cash deposits
   - Card deposits
   - Gift card redemption

4. **Cards**: Issue new debit or credit cards

5. **Pay Bills**: Pay utility bills and services

6. **History**: View personal transaction history

## ⛏️ Mining Wallet Details

### How Mining Works
1. Admin enables mining from the Mining Wallet tab
2. Balance automatically increases by £0.50 every 5 minutes
3. Updates happen automatically in the background
4. Mining continues until disabled by admin

### Mining Configuration
```json
{
  "enabled": false,
  "wallet_address": "",
  "balance": 100,
  "mining_rate": 0.5,
  "update_interval": 300,
  "supported_cryptos": ["BTC", "ETH", "USDT", "USDC", "BNB"]
}
```

### Mining Manager Features
- Start/stop mining
- Set wallet address
- Withdraw funds
- Auto-withdrawal configuration
- Transaction history
- Mining statistics
- Export wallet data

## 💾 Data Storage

All data is stored in the browser's local storage:
- Customer accounts and credentials
- Transaction history
- Mining wallet data
- System settings

**Note**: Data persists between sessions but is cleared when browser cache is cleared.

## 🔒 Security Features

- Password-protected admin access
- Secure customer authentication
- Passport number verification for registration
- Transaction status tracking
- Balance validation before transfers

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured dashboard
- **Tablet**: Optimized touch interface
- **Mobile**: Streamlined mobile experience

## 🌍 International Banking

### Supported Transfer Types
- **Local Transfers**: Bank-to-bank within country
- **International Transfers**: SWIFT transfers to any country
- **Crypto Transfers**: Direct crypto wallet transfers

### Transfer Fees
- Local: 2% of transfer amount
- International: 5% of transfer amount
- Crypto: Network fee applies

## 📊 Transaction Types

1. **Local Transfer**: Account-to-account transfers
2. **International Transfer**: SWIFT transfers
3. **Deposit**: Cash, card, or gift card deposits
4. **Withdrawal**: Fund withdrawals
5. **Bill Payment**: Utility and service payments
6. **Mining**: Automatic crypto mining rewards

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Structure and semantics
- **CSS3**: Styling and responsive design
- **JavaScript (ES6+)**: Core functionality
- **LocalStorage**: Data persistence
- **JSON**: Data storage format

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance Optimizations
- Efficient DOM manipulation
- Optimized CSS transitions
- Minimal external dependencies
- Fast localStorage operations

## 📝 API Integration Notes

### SMS Notification System
The application includes a simulated SMS notification system. To integrate with real SMS services, modify the `SMS` object in `script.js`:

```javascript
const SMS = {
    sendNotification(phoneNumber, message) {
        // Integrate with SMS API here
        // Example: Twilio, Nexmo, AWS SNS
        console.log(`SMS sent to ${phoneNumber}: ${message}`);
    }
};
```

### Real Banking Integration
To connect with real banking systems, you would need to:
1. Set up a backend server (Node.js, Python, PHP)
2. Integrate with banking APIs (Plaid, Stripe, SWIFT)
3. Implement proper security measures
4. Add database (PostgreSQL, MongoDB)
5. Implement KYC/AML compliance

## 🚀 Deployment

### Local Development
Simply open `index.html` in a web browser

### Web Server Deployment
1. Upload files to web server
2. Ensure HTTPS is enabled for security
3. Configure proper MIME types
4. Set up CORS if needed

### Production Deployment
For production use, consider:
- Backend API development
- Database implementation
- Security enhancements
- Payment gateway integration
- Regulatory compliance
- SSL/TLS certificates

## 📞 Support & Contact

For issues or questions:
- Check the console for error messages
- Verify local storage is enabled
- Ensure JavaScript is enabled
- Clear cache if experiencing issues

## 📄 License

This is a demonstration project. For commercial use, ensure compliance with banking regulations and obtain necessary licenses.

## ⚠️ Disclaimer

This is a demonstration banking application. It does not connect to real banking systems or process real money. For production use, proper security measures, regulatory compliance, and banking partnerships are required.

## 🔄 Version History

- **v1.0.0**: Initial release
  - Admin and customer authentication
  - Basic banking operations
  - Mining wallet functionality
  - Responsive design

## 🎯 Future Enhancements

Potential features for future versions:
- Real-time transaction notifications
- Multi-currency support
- Advanced analytics and reporting
- Integration with payment gateways
- Mobile app (React Native)
- API for third-party integrations
- Advanced security features (2FA)
- Investment and savings accounts
- Loan management system